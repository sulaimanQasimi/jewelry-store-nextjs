import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const rows = (await query(
      'SELECT * FROM gold_rates ORDER BY date DESC LIMIT 1',
      []
    )) as any[]

    if (!rows?.length) {
      return NextResponse.json({ success: true, data: null })
    }

    return NextResponse.json({ success: true, data: rows[0] })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
