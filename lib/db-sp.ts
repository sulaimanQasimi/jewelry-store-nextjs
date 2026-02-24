/**
 * Stored procedure and function helpers for Gemify DB.
 * Use these for atomic operations and centralized business logic.
 */

import { query, getConnection } from './db'

/** Parse JSON column (mysql2 may return string or object) */
export function parseJson(val: unknown): any {
  if (typeof val === 'string') return JSON.parse(val)
  return val
}

/** Get USD rate (units of default currency per 1 USD) from currencies.rate. Date param kept for API compatibility but ignored. */
export async function fnGetCurrencyRate(_date?: string): Promise<number | null> {
  const rows = (await query(
    "SELECT rate FROM currencies WHERE code = 'USD' AND active = 1 LIMIT 1"
  )) as any[]
  const rate = rows?.[0]?.rate
  return rate != null ? Number(rate) : null
}

/** Get next available bell number for transactions */
export async function fnNextBellNumber(): Promise<number> {
  const rows = (await query('SELECT fn_next_bell_number() AS next_num', [])) as any[]
  return Number(rows?.[0]?.next_num ?? 1)
}

/**
 * Create transaction via stored procedure.
 * Validates customer, products; marks products sold; inserts transaction.
 * Product and receipt must already be converted to AFN by caller.
 */
export async function spCreateTransaction(
  customerId: number,
  productJson: string,
  receiptJson: string,
  bellNumber: number,
  note: string | null
): Promise<{ transactionId: number; errorMsg: string | null }> {
  const conn = await getConnection()
  try {
    await conn.execute('CALL sp_create_transaction(?, ?, ?, ?, ?, @out_id, @out_err)', [
      customerId,
      productJson,
      receiptJson,
      bellNumber,
      note
    ])
    const [rows] = await conn.execute('SELECT @out_id AS id, @out_err AS err') as any[]
    const id = rows?.[0]?.id != null ? Number(rows[0].id) : 0
    const err = rows?.[0]?.err?.trim() || null
    return { transactionId: id, errorMsg: err }
  } finally {
    conn.release()
  }
}

/**
 * Return product from transaction via stored procedure.
 */
export async function spReturnProduct(
  transactionId: number,
  productId: number
): Promise<{ success: boolean; errorMsg: string | null }> {
  const conn = await getConnection()
  try {
    await conn.execute('CALL sp_return_product(?, ?, @out_success, @out_err)', [
      transactionId,
      productId
    ])
    const [rows] = await conn.execute('SELECT @out_success AS success, @out_err AS err') as any[]
    const success = Number(rows?.[0]?.success) === 1
    const err = rows?.[0]?.err?.trim() || null
    return { success, errorMsg: err }
  } finally {
    conn.release()
  }
}

/**
 * Pay loan via stored procedure.
 * Converts USD to AFN if currency is 'دالر'.
 */
export async function spPayLoan(
  transactionId: number,
  amount: number,
  currency: string,
  usdRate: number
): Promise<{ success: boolean; errorMsg: string | null }> {
  const conn = await getConnection()
  try {
    await conn.execute('CALL sp_pay_loan(?, ?, ?, ?, @out_success, @out_err)', [
      transactionId,
      amount,
      currency,
      usdRate
    ])
    const [rows] = await conn.execute('SELECT @out_success AS success, @out_err AS err') as any[]
    const success = Number(rows?.[0]?.success) === 1
    const err = rows?.[0]?.err?.trim() || null
    return { success, errorMsg: err }
  } finally {
    conn.release()
  }
}

/** Check if value is ResultSetHeader (last element in procedure result) */
function isResultSetHeader(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false
  const keys = ['fieldCount', 'affectedRows', 'insertId']
  return keys.every((key) => key in (data as object))
}

/**
 * Get daily transactions via stored procedure.
 * mysql2 returns [rows[], ResultSetHeader] for CALL with one SELECT.
 */
export async function spGetDailyTransactions(
  dateFrom: Date,
  dateTo: Date
): Promise<any[]> {
  const result = (await query('CALL sp_get_daily_transactions(?, ?)', [dateFrom, dateTo])) as any[]
  if (Array.isArray(result) && result.length > 0 && !isResultSetHeader(result[0])) {
    return result[0] as any[]
  }
  return []
}

/**
 * Get customer loans (transactions with remaining amount > 0) via stored procedure.
 */
export async function spGetCustomerLoans(): Promise<any[]> {
  const result = (await query('CALL sp_get_customer_loans()')) as any[]
  if (Array.isArray(result) && result.length > 0 && !isResultSetHeader(result[0])) {
    return result[0] as any[]
  }
  return []
}
