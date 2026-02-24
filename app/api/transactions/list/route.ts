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
    const bellNumberParam = searchParams.get('bellNumber')?.trim()
    const offset = (page - 1) * limit

    const conditions: string[] = []
    const countParams: any[] = []
    const listParams: any[] = []

    if (search) {
      conditions.push('(customerName LIKE ? OR customerPhone LIKE ?)')
      const term = `%${search}%`
      countParams.push(term, term)
      listParams.push(term, term)
    }
    if (customerIdParam) {
      const customerId = parseInt(customerIdParam, 10)
      if (!Number.isNaN(customerId)) {
        conditions.push('customerId = ?')
        countParams.push(customerId)
        listParams.push(customerId)
      }
    }
    if (bellNumberParam) {
      const bellNum = parseInt(bellNumberParam, 10)
      if (!Number.isNaN(bellNum)) {
        conditions.push('bellNumber = ?')
        countParams.push(bellNum)
        listParams.push(bellNum)
      }
    }
    if (dateFrom) {
      conditions.push('DATE(createdAt) >= ?')
      countParams.push(dateFrom)
      listParams.push(dateFrom)
    }
    if (dateTo) {
      conditions.push('DATE(createdAt) <= ?')
      countParams.push(dateTo)
      listParams.push(dateTo)
    }

    const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const countResult = (await query(
      `SELECT COUNT(*) AS total FROM transactions ${whereSql}`,
      countParams
    )) as any[]
    const total = Number(countResult?.[0]?.total ?? 0)

    const rows = (await query(
      `SELECT id, customerId, customerName, customerPhone, product, receipt, bellNumber, note,
              COALESCE(returned_count, 0) AS returned_count,
              COALESCE(return_status, 'normal') AS return_status,
              createdAt
       FROM transactions ${whereSql}
       ORDER BY createdAt DESC
       LIMIT ${limit} OFFSET ${offset}`,
      listParams
    )) as any[]

    const data = rows.map((r) => ({
      id: r.id,
      customerId: r.customerId,
      customerName: r.customerName,
      customerPhone: r.customerPhone,
      product: parseJson(r.product),
      receipt: parseJson(r.receipt),
      bellNumber: r.bellNumber,
      note: r.note ?? null,
      returned_count: Number(r.returned_count) || 0,
      return_status: r.return_status ?? 'normal',
      createdAt: r.createdAt
    }))

    return NextResponse.json({ success: true, data, total, page, limit })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
