'use server'

import type { RowDataPacket } from 'mysql2'
import { getConnection } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'crypto'

export type TransactionType = 'credit' | 'debit'

export interface Account {
  id: string
  account_number: string
  name: string
  currency: string
  balance: string
  status: 'active' | 'frozen'
  created_at: Date | string
}

export interface AccountTransaction {
  id: string
  account_id: string
  type: TransactionType
  amount: string
  balance_before: string
  balance_after: string
  description: string | null
  created_at: Date | string
}

/**
 * Process a credit or debit transaction with row-level locking.
 * Uses START TRANSACTION, SELECT ... FOR UPDATE, then UPDATE + INSERT, COMMIT/ROLLBACK.
 * All SQL uses prepared statements (parameterized) to prevent SQL injection.
 */
export async function processTransaction(
  accountId: string,
  amount: number,
  type: TransactionType,
  description?: string | null
): Promise<{ success: boolean; error?: string }> {
  if (amount <= 0) {
    return { success: false, error: 'Amount must be positive' }
  }

  const conn = await getConnection()
  try {
    await conn.execute('START TRANSACTION')

    // Lock the account row so no other process can modify balance until we commit
    const [rows] = await conn.execute<RowDataPacket[]>(
      'SELECT id, balance, status FROM accounts WHERE id = ? FOR UPDATE',
      [accountId]
    )
    const account = rows?.[0]
    if (!account) {
      await conn.execute('ROLLBACK')
      return { success: false, error: 'Account not found' }
    }
    if (account.status !== 'active') {
      await conn.execute('ROLLBACK')
      return { success: false, error: 'Account is not active' }
    }

    const balanceBefore = Number(account.balance)
    let balanceAfter: number
    if (type === 'credit') {
      balanceAfter = balanceBefore + amount
    } else {
      if (balanceBefore < amount) {
        await conn.execute('ROLLBACK')
        return { success: false, error: 'Insufficient funds' }
      }
      balanceAfter = balanceBefore - amount
    }

    // Update account balance (parameterized)
    await conn.execute(
      'UPDATE accounts SET balance = ? WHERE id = ?',
      [balanceAfter.toFixed(4), accountId]
    )

    const txId = randomUUID()
    await conn.execute(
      `INSERT INTO account_transactions (id, account_id, type, amount, balance_before, balance_after, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        txId,
        accountId,
        type,
        amount.toFixed(4),
        balanceBefore.toFixed(4),
        balanceAfter.toFixed(4),
        description ?? null
      ]
    )

    await conn.execute('COMMIT')
    return { success: true }
  } catch (err) {
    await conn.execute('ROLLBACK').catch(() => {})
    console.error('processTransaction error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Transaction failed'
    }
  } finally {
    conn.release()
  }
}

/** Get a single account by id. Parameterized query. */
export async function getAccount(accountId: string): Promise<Account | null> {
  const { query } = await import('@/lib/db')
  const rows = (await query(
    'SELECT id, account_number, name, currency, balance, status, created_at FROM accounts WHERE id = ?',
    [accountId]
  )) as Account[]
  return rows?.[0] ?? null
}

/** Get ledger (transaction history) for an account. Parameterized query. */
export async function getAccountTransactions(
  accountId: string,
  limit = 50
): Promise<AccountTransaction[]> {
  const { query } = await import('@/lib/db')
  const rows = (await query(
    `SELECT id, account_id, type, amount, balance_before, balance_after, description, created_at
     FROM account_transactions WHERE account_id = ? ORDER BY created_at DESC LIMIT ?`,
    [accountId, limit]
  )) as AccountTransaction[]
  return Array.isArray(rows) ? rows : []
}

/** List all accounts. Parameterized where applicable. */
export async function getAccounts(): Promise<Account[]> {
  const { query } = await import('@/lib/db')
  const rows = (await query(
    'SELECT id, account_number, name, currency, balance, status, created_at FROM accounts ORDER BY created_at DESC'
  )) as Account[]
  return Array.isArray(rows) ? rows : []
}

/**
 * Server action for the Deposit/Withdraw form: process transaction then revalidate cache.
 * Call this directly with args when not using a form.
 */
export async function submitAccountTransaction(
  accountId: string,
  amount: number,
  type: TransactionType,
  description?: string | null
): Promise<{ success: boolean; error?: string }> {
  const result = await processTransaction(accountId, amount, type, description)
  if (result.success) {
    revalidatePath('/accounts')
    revalidatePath(`/accounts/${accountId}`)
  }
  return result
}

export type TransactionFormState = { success: boolean; error?: string }

/**
 * Form action for Deposit/Withdraw modal: reads accountId, amount, type, description from FormData.
 * Use with useActionState so useFormStatus works and client gets success/error state.
 */
export async function submitAccountTransactionForm(
  _prevState: TransactionFormState,
  formData: FormData
): Promise<TransactionFormState> {
  const accountId = formData.get('accountId') as string
  const type = (formData.get('type') as TransactionType) || 'credit'
  const amountStr = formData.get('amount') as string
  const amount = parseFloat(amountStr)
  const description = (formData.get('description') as string)?.trim() || null
  if (!accountId) return { success: false, error: 'Missing account' }
  if (!Number.isFinite(amount) || amount <= 0) return { success: false, error: 'Enter a valid positive amount' }
  const result = await submitAccountTransaction(accountId, amount, type, description)
  return result.success ? { success: true } : { success: false, error: result.error }
}
