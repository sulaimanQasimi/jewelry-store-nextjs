import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { parseJson } from '@/lib/db-sp'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
    const search = searchParams.get('search')?.trim() || ''
    const dateFrom = searchParams.get('dateFrom')?.trim() || ''
    const dateTo = searchParams.get('dateTo')?.trim() || ''
    const customerIdParam = searchParams.get('customerId')?.trim()
    const bellNumberParam = searchParams.get('bellNumber')?.trim() || searchParams.get('billNumber')?.trim() || ''
    const offset = (page - 1) * limit

    const conditions: string[] = []
    const countParams: any[] = []
    const listParams: any[] = []

    if (search) {
      conditions.push('(r.customerName LIKE ? OR r.customerPhone LIKE ?)')
      const term = `%${search}%`
      countParams.push(term, term)
      listParams.push(term, term)
    }
    if (bellNumberParam) {
      const bellNum = parseInt(bellNumberParam, 10)
      if (!Number.isNaN(bellNum)) {
        conditions.push('r.bellNumber = ?')
        countParams.push(bellNum)
        listParams.push(bellNum)
      }
    }
    if (dateFrom) {
      conditions.push('DATE(r.returnedAt) >= ?')
      countParams.push(dateFrom)
      listParams.push(dateFrom)
    }
    if (dateTo) {
      conditions.push('DATE(r.returnedAt) <= ?')
      countParams.push(dateTo)
      listParams.push(dateTo)
    }
    const needCustomerJoin = customerIdParam && !Number.isNaN(parseInt(customerIdParam, 10))
    if (needCustomerJoin) {
      const customerId = parseInt(customerIdParam!, 10)
      conditions.push('t.customerId = ?')
      countParams.push(customerId)
      listParams.push(customerId)
    }

    const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const joinSql = needCustomerJoin ? 'LEFT JOIN transactions t ON t.id = r.transactionId' : ''

    const countResult = (await query(
      `SELECT COUNT(*) AS total FROM returns r ${joinSql} ${whereSql}`,
      countParams
    )) as any[]
    const total = Number(countResult?.[0]?.total ?? 0)

    const rows = (await query(
      `SELECT r.id, r.transactionId, r.productId, r.customerName, r.customerPhone, r.bellNumber,
              r.productSnapshot, r.note, r.returnedAt
       FROM returns r ${joinSql} ${whereSql}
       ORDER BY r.returnedAt DESC
       LIMIT ${limit} OFFSET ${offset}`,
      listParams
    )) as any[]

    const data = rows.map((r) => ({
      id: r.id,
      transactionId: r.transactionId,
      productId: r.productId,
      customerName: r.customerName,
      customerPhone: r.customerPhone,
      bellNumber: r.bellNumber,
      productSnapshot: parseJson(r.productSnapshot),
      note: r.note ?? null,
      returnedAt: r.returnedAt
    }))

    return NextResponse.json({ success: true, data, total, page, limit })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
