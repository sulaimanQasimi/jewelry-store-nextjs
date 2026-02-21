import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')?.trim() || ''

    if (status) {
      const rows = (await query('SELECT COUNT(*) AS c FROM repairs WHERE status = ?', [status])) as any[]
      const count = Number(rows?.[0]?.c ?? 0)
      return NextResponse.json({ success: true, count })
    }

    const rows = (await query('SELECT status, COUNT(*) AS c FROM repairs GROUP BY status', [])) as { status: string; c: number }[]
    const byStatus: Record<string, number> = {}
    for (const r of rows || []) {
      byStatus[r.status] = Number(r.c)
    }
    const total = (await query('SELECT COUNT(*) AS c FROM repairs', [])) as any[]
    return NextResponse.json({
      success: true,
      count: Number(total?.[0]?.c ?? 0),
      byStatus
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
