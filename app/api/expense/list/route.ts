import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
    const type = searchParams.get('type')?.trim() || ''
    const dateFrom = searchParams.get('dateFrom')?.trim() || ''
    const dateTo = searchParams.get('dateTo')?.trim() || ''
    const offset = (page - 1) * limit

    const conditions: string[] = []
    const countParams: any[] = []
    const listParams: any[] = []

    if (type) {
      conditions.push('type LIKE ?')
      countParams.push(`%${type}%`)
      listParams.push(`%${type}%`)
    }
    if (dateFrom) {
      conditions.push('date >= ?')
      countParams.push(dateFrom)
      listParams.push(dateFrom)
    }
    if (dateTo) {
      conditions.push('date <= ?')
      countParams.push(dateTo)
      listParams.push(dateTo)
    }

    const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const countResult = (await query(
      `SELECT COUNT(*) AS total FROM expenses ${whereSql}`,
      countParams
    )) as any[]
    const total = Number(countResult?.[0]?.total ?? 0)

    listParams.push(limit, offset)
    const data = (await query(
      `SELECT * FROM expenses ${whereSql} ORDER BY date DESC, id DESC LIMIT ? OFFSET ?`,
      listParams
    )) as any[]

    return NextResponse.json({ success: true, data, total, page, limit })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
