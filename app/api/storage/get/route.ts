import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    const rows = (await query(
      'SELECT usd, afn FROM storages WHERE date = ? ORDER BY updatedAt DESC LIMIT 1',
      [today]
    )) as { usd: number; afn: number }[]

    if (!rows || rows.length === 0) {
      // Return latest storage if no row for today (e.g. first load)
      const latest = (await query(
        'SELECT usd, afn FROM storages ORDER BY updatedAt DESC LIMIT 1'
      )) as { usd: number; afn: number }[]
      const storage = latest?.[0] ? { usd: latest[0].usd, afn: latest[0].afn } : { usd: 0, afn: 0 }
      return NextResponse.json({ success: true, storage })
    }

    return NextResponse.json({
      success: true,
      storage: { usd: rows[0].usd, afn: rows[0].afn }
    })
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'خطا در دریافت دخل' },
      { status: 500 }
    )
  }
}
