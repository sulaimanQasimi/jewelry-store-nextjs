import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
    const offset = (page - 1) * limit

    const countResult = (await query('SELECT COUNT(*) AS total FROM fragments', [])) as any[]
    const total = Number(countResult?.[0]?.total ?? 0)

    const data = (await query(
      `SELECT * FROM fragments ORDER BY date DESC, id DESC LIMIT ${limit} OFFSET ${offset}`,
      []
    )) as any[]

    return NextResponse.json({ success: true, data, total, page, limit })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
