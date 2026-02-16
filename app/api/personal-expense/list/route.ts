import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
    const personId = searchParams.get('personId')?.trim() || ''
    const offset = (page - 1) * limit

    const conditions: string[] = []
    const countParams: any[] = []
    const listParams: any[] = []

    if (personId) {
      conditions.push('pe.personId = ?')
      countParams.push(parseInt(personId))
      listParams.push(parseInt(personId))
    }

    const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const countResult = (await query(
      `SELECT COUNT(*) AS total FROM personal_expenses ${whereSql}`,
      countParams
    )) as any[]
    const total = Number(countResult?.[0]?.total ?? 0)

    const data = (await query(
      `SELECT pe.*, p.name AS personName, p.phone AS personPhone
       FROM personal_expenses pe
       LEFT JOIN persons p ON pe.personId = p.id
       ${whereSql}
       ORDER BY pe.createdAt DESC
       LIMIT ${limit} OFFSET ${offset}`,
      listParams
    )) as any[]

    return NextResponse.json({ success: true, data, total, page, limit })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
