import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
    const search = searchParams.get('search')?.trim() || ''
    const offset = (page - 1) * limit

    const countResult = await query(
      search
        ? 'SELECT COUNT(*) AS total FROM customers WHERE customerName LIKE ? OR phone LIKE ?'
        : 'SELECT COUNT(*) AS total FROM customers',
      search ? [`%${search}%`, `%${search}%`] : []
    ) as any[]
    const total = Number(countResult?.[0]?.total ?? 0)

    const whereClause = search ? 'WHERE customerName LIKE ? OR phone LIKE ?' : ''
    const params = search ? [`%${search}%`, `%${search}%`, limit, offset] : [limit, offset]
    const sql = `SELECT * FROM customers ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`
    const rows = (await query(sql, params)) as any[]
    const list = Array.isArray(rows) ? rows.map((r) => ({ ...r })) : []

    return NextResponse.json({
      success: true,
      data: list,
      customers: list,
      total,
      page,
      limit
    })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
