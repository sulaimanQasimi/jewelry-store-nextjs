import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const usd = Number(body?.usd ?? 0)
    const afn = Number(body?.afn ?? 0)

    const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

    await query(
      `INSERT INTO storages (date, usd, afn) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE usd = VALUES(usd), afn = VALUES(afn)`,
      [today, usd, afn]
    )

    return NextResponse.json({
      success: true,
      storage: { usd, afn }
    })
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'خطا در ذخیره دخل' },
      { status: 500 }
    )
  }
}
