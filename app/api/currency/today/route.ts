import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const today = new Date().toISOString().split('T')[0]

    const rates = await query(
      'SELECT * FROM currency_rates WHERE date = ?',
      [today]
    ) as any[]

    if (!rates || rates.length === 0) {
      return NextResponse.json({ success: false, message: 'نرخ را تعیین کنید' })
    }

    return NextResponse.json({ success: true, rate: rates[0] })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { usdToAfn } = await request.json()
    const today = new Date().toISOString().split('T')[0]

    // Use INSERT ... ON DUPLICATE KEY UPDATE for upsert
    await query(
      `INSERT INTO currency_rates (date, usdToAfn) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE usdToAfn = ?`,
      [today, usdToAfn, usdToAfn]
    )

    const rates = await query(
      'SELECT * FROM currency_rates WHERE date = ?',
      [today]
    ) as any[]

    return NextResponse.json({ success: true, rate: rates[0] })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
