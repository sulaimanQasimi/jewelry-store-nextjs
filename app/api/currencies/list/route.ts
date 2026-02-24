import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
    const search = searchParams.get('search')?.trim() || ''
    const activeOnly = searchParams.get('active') !== 'false'
    const offset = (page - 1) * limit

    const conditions: string[] = []
    const params: (string | number)[] = []
    if (search) {
      conditions.push('(code LIKE ? OR name_fa LIKE ? OR symbol LIKE ?)')
      const term = `%${search}%`
      params.push(term, term, term)
    }
    if (activeOnly) {
      conditions.push('active = 1')
    }
    const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const countParams = params.slice()

    const countResult = (await query(
      `SELECT COUNT(*) AS total FROM currencies ${whereSql}`,
      countParams
    )) as { total: number }[]
    const total = Number(countResult?.[0]?.total ?? 0)

    const list = (await query(
      `SELECT id, code, name_fa, symbol, rate, is_default, active, sort_order, createdAt, updatedAt
       FROM currencies ${whereSql}
       ORDER BY sort_order ASC, code ASC
       LIMIT ${limit} OFFSET ${offset}`,
      params
    )) as any[]

    return NextResponse.json({ success: true, data: list, total, page, limit })
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'خطا' },
      { status: 500 }
    )
  }
}
