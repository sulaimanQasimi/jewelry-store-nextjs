import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

const GRAMS_PER_OUNCE = 31.1035

export async function POST(request: NextRequest) {
  try {
    const { date, price_per_ounce_usd, price_per_gram_afn, source } = await request.json()

    if (!date?.trim()) {
      return NextResponse.json({ success: false, message: 'تاریخ الزامی است' })
    }

    const priceOz = parseFloat(price_per_ounce_usd)
    if (isNaN(priceOz) || priceOz <= 0) {
      return NextResponse.json({ success: false, message: 'نرخ طلا (دلار per اونس) باید عدد مثبت باشد' })
    }

    let priceGramAfn: number | null = null
    if (typeof price_per_gram_afn === 'number' && !isNaN(price_per_gram_afn)) {
      priceGramAfn = price_per_gram_afn
    } else {
      const rateRows = (await query("SELECT rate FROM currencies WHERE code = 'USD' AND active = 1 LIMIT 1", [])) as { rate?: number }[]
      const usdRate = rateRows?.[0]?.rate
      if (usdRate != null && Number(usdRate) > 0) {
        priceGramAfn = (priceOz / GRAMS_PER_OUNCE) * Number(usdRate)
      }
    }

    await query(
      `INSERT INTO gold_rates (date, price_per_ounce_usd, price_per_gram_afn, source) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE price_per_ounce_usd = VALUES(price_per_ounce_usd), price_per_gram_afn = VALUES(price_per_gram_afn), source = VALUES(source)`,
      [date.trim(), priceOz, priceGramAfn, source?.trim() || 'manual']
    )

    const rows = (await query(
      'SELECT * FROM gold_rates WHERE date = ?',
      [date.trim()]
    )) as any[]

    return NextResponse.json({
      success: true,
      message: 'نرخ طلا با موفقیت ثبت شد',
      data: rows[0]
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
