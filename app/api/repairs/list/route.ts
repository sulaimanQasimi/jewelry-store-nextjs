import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
    const status = searchParams.get('status')?.trim() || ''
    const dateFrom = searchParams.get('dateFrom')?.trim() || ''
    const dateTo = searchParams.get('dateTo')?.trim() || ''
    const customerId = searchParams.get('customerId')?.trim() || ''
    const offset = (page - 1) * limit

    const conditions: string[] = []
    const params: any[] = []

    if (status) {
      conditions.push('r.status = ?')
      params.push(status)
    }
    if (dateFrom) {
      conditions.push('r.due_date >= ?')
      params.push(dateFrom)
    }
    if (dateTo) {
      conditions.push('r.due_date <= ?')
      params.push(dateTo)
    }
    if (customerId) {
      conditions.push('r.customer_id = ?')
      params.push(parseInt(customerId, 10))
    }

    const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const countResult = (await query(
      `SELECT COUNT(*) AS total FROM repairs r ${whereSql}`,
      params
    )) as any[]
    const total = Number(countResult?.[0]?.total ?? 0)

    const data = (await query(
      `SELECT r.* FROM repairs r ${whereSql} ORDER BY r.created_at DESC LIMIT ${limit} OFFSET ${offset}`,
      params
    )) as any[]

    return NextResponse.json({ success: true, data, total, page, limit })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
