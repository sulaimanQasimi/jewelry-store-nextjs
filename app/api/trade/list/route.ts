import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
    const traderId = searchParams.get('traderId')?.trim() || ''
    const offset = (page - 1) * limit

    const conditions: string[] = []
    const countParams: any[] = []
    const listParams: any[] = []

    if (traderId) {
      conditions.push('traderId = ?')
      countParams.push(Number(traderId))
      listParams.push(Number(traderId))
    }

    const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const countResult = (await query(
      `SELECT COUNT(*) AS total FROM trades ${whereSql}`,
      countParams
    )) as any[]
    const total = Number(countResult?.[0]?.total ?? 0)

    listParams.push(limit, offset)
    const data = (await query(
      `SELECT * FROM trades ${whereSql} ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
      listParams
    )) as any[]

    return NextResponse.json({ success: true, data, total, page, limit })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
