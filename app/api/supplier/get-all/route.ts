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
        ? 'SELECT COUNT(*) AS total FROM suppliers WHERE isActive = 1 AND name LIKE ?'
        : 'SELECT COUNT(*) AS total FROM suppliers WHERE isActive = 1',
      search ? [`%${search}%`] : []
    ) as any[]
    const total = Number(countResult?.[0]?.total ?? 0)

    const whereClause = search ? 'AND name LIKE ?' : ''
    const whereParams = search ? [`%${search}%`] : []
    const sql = `SELECT id, name, phone, address, isActive FROM suppliers WHERE isActive = 1 ${whereClause} ORDER BY name ASC LIMIT ${limit} OFFSET ${offset}`
    const data = (await query(sql, whereParams)) as any[]

    return NextResponse.json({ success: true, data, total, page, limit })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
