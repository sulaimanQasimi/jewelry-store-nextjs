import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
    const search = searchParams.get('search')?.trim() || ''
    const isSold = searchParams.get('isSold')
    const offset = (page - 1) * limit

    const conditions: string[] = []
    const countParams: any[] = []
    const listParams: any[] = []

    if (isSold !== undefined && isSold !== '') {
      const sold = isSold === 'true' ? 1 : 0
      conditions.push('isSold = ?')
      countParams.push(sold)
      listParams.push(sold)
    }
    if (search) {
      conditions.push('(productName LIKE ? OR type LIKE ? OR barcode LIKE ?)')
      const term = `%${search}%`
      countParams.push(term, term, term)
      listParams.push(term, term, term)
    }

    const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const countResult = (await query(
      `SELECT COUNT(*) AS total FROM products ${whereSql}`,
      countParams
    )) as any[]
    const total = Number(countResult?.[0]?.total ?? 0)

    // LIMIT/OFFSET must be literals (mysql2 prepared statement limitation)
    const data = (await query(
      `SELECT * FROM products ${whereSql} ORDER BY createdAt DESC LIMIT ${limit} OFFSET ${offset}`,
      listParams
    )) as any[]

    return NextResponse.json({ success: true, data, total, page, limit })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
