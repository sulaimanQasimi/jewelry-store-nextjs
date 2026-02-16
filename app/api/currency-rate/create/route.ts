import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { date, usdToAfn } = await request.json()

    if (!date?.trim()) {
      return NextResponse.json({ success: false, message: 'تاریخ الزامی است' })
    }

    const rate = parseFloat(usdToAfn)
    if (isNaN(rate) || rate <= 0) {
      return NextResponse.json({ success: false, message: 'نرخ ارز باید عدد مثبت باشد' })
    }

    await query(
      `INSERT INTO currency_rates (date, usdToAfn) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE usdToAfn = ?`,
      [date.trim(), rate, rate]
    )

    const rows = (await query(
      'SELECT * FROM currency_rates WHERE date = ?',
      [date.trim()]
    )) as any[]

    return NextResponse.json({
      success: true,
      message: 'نرخ ارز با موفقیت ثبت شد',
      data: rows[0]
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
