import { NextRequest, NextResponse } from 'next/server'
import type { RowDataPacket } from 'mysql2'
import { getConnection } from '@/lib/db'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, detail, price, currency, date, account_id: accountId } = body

    if (!type || !detail || !price || !currency) {
      return NextResponse.json({ success: false, message: 'لطفا خانه های خالی را پر نمایید' })
    }

    const amount = Number(price)
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ success: false, message: 'مبلغ معتبر وارد کنید' })
    }

    const dateValue = date ? new Date(date) : new Date()

    if (accountId) {
      const conn = await getConnection()
      try {
        await conn.query('START TRANSACTION')

        const [rows] = await conn.execute<RowDataPacket[]>(
          'SELECT id, balance, status FROM accounts WHERE id = ? FOR UPDATE',
          [accountId]
        )
        const account = rows?.[0]
        if (!account) {
          await conn.query('ROLLBACK')
          return NextResponse.json({ success: false, message: 'حساب یافت نشد' })
        }
        if (account.status !== 'active') {
          await conn.query('ROLLBACK')
          return NextResponse.json({ success: false, message: 'حساب فعال نیست' })
        }

        const balanceBefore = Number(account.balance)
        if (balanceBefore < amount) {
          await conn.query('ROLLBACK')
          return NextResponse.json({ success: false, message: 'موجودی کافی نیست' })
        }
        const balanceAfter = balanceBefore - amount

        await conn.execute(
          'UPDATE accounts SET balance = ? WHERE id = ?',
          [balanceAfter.toFixed(4), accountId]
        )

        const txId = randomUUID()
        const description = `مصرف: ${(type || '').toString().slice(0, 100)}${(detail || '').toString().slice(0, 200) ? ' - ' + (detail || '').toString().slice(0, 200) : ''}`
        await conn.execute(
          `INSERT INTO account_transactions (id, account_id, type, amount, balance_before, balance_after, description)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            txId,
            accountId,
            'debit',
            amount.toFixed(4),
            balanceBefore.toFixed(4),
            balanceAfter.toFixed(4),
            description
          ]
        )

        await conn.execute(
          'INSERT INTO expenses (type, detail, price, currency, date, account_id) VALUES (?, ?, ?, ?, ?, ?)',
          [type, detail, amount, currency, dateValue, accountId]
        )

        await conn.query('COMMIT')
      } catch (err) {
        await conn.query('ROLLBACK').catch(() => {})
        throw err
      } finally {
        conn.release()
      }
    } else {
      const { query } = await import('@/lib/db')
      await query(
        'INSERT INTO expenses (type, detail, price, currency, date) VALUES (?, ?, ?, ?, ?)',
        [type, detail, amount, currency, dateValue]
      )
    }

    return NextResponse.json({ success: true, message: 'دیتا موفقانه ثبت شد' })
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'خطا'
    })
  }
}
