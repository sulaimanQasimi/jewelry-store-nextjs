import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { query } from '@/lib/db'

const USER_FIELDS = 'id, username, email, role, is_active, created_at, updated_at'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const user = session?.user as { id?: string; role?: string } | undefined
    if (!user?.role || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
    const search = searchParams.get('search')?.trim() || ''
    const offset = (page - 1) * limit

    const conditions: string[] = []
    const countParams: any[] = []
    const listParams: any[] = []

    if (search) {
      conditions.push('(username LIKE ? OR email LIKE ?)')
      const term = `%${search}%`
      countParams.push(term, term)
      listParams.push(term, term)
    }

    const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const countResult = (await query(
      `SELECT COUNT(*) AS total FROM users ${whereSql}`,
      countParams
    )) as any[]
    const total = Number(countResult?.[0]?.total ?? 0)

    const data = (await query(
      `SELECT ${USER_FIELDS} FROM users ${whereSql} ORDER BY username ASC LIMIT ${limit} OFFSET ${offset}`,
      listParams
    )) as any[]

    return NextResponse.json({ success: true, data, total, page, limit })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
