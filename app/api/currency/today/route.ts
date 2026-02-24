import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

/** GET: return current USD rate from currencies table */
export async function GET() {
  try {
    const rows = (await query(
      "SELECT rate FROM currencies WHERE code = 'USD' AND active = 1 LIMIT 1",
      []
    )) as { rate?: number }[]

    if (!rows?.length || rows[0].rate == null) {
      return NextResponse.json({ success: false, message: 'نرخ دالر تعیین نشده' })
    }

    return NextResponse.json({ success: true, rate: { usdToAfn: Number(rows[0].rate) } })
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.json({ success: false, message: (error as Error).message })
  }
}

/** POST: update USD rate in currencies table */
export async function POST(request: NextRequest) {
  try {
    const { usdToAfn } = await request.json()
    const rate = Number(usdToAfn)
    if (isNaN(rate) || rate <= 0) {
      return NextResponse.json({ success: false, message: 'نرخ نامعتبر' }, { status: 400 })
    }

    await query("UPDATE currencies SET rate = ? WHERE code = 'USD'", [rate])

    const rows = (await query(
      "SELECT rate FROM currencies WHERE code = 'USD' LIMIT 1",
      []
    )) as { rate?: number }[]

    return NextResponse.json({ success: true, rate: { usdToAfn: Number(rows?.[0]?.rate ?? rate) } })
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.json({ success: false, message: (error as Error).message })
  }
}
