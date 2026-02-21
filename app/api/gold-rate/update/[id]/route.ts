import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

const GRAMS_PER_OUNCE = 31.1035

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const idNum = parseInt(id, 10)
    if (isNaN(idNum)) {
      return NextResponse.json({ success: false, message: 'شناسه نامعتبر' }, { status: 400 })
    }

    const { date, price_per_ounce_usd, price_per_gram_afn, source } = await request.json()

    if (!date?.trim()) {
      return NextResponse.json({ success: false, message: 'تاریخ الزامی است' }, { status: 400 })
    }

    const priceOz = parseFloat(price_per_ounce_usd)
    if (isNaN(priceOz) || priceOz <= 0) {
      return NextResponse.json({ success: false, message: 'نرخ طلا باید عدد مثبت باشد' }, { status: 400 })
    }

    let priceGramAfn: number | null = null
    if (typeof price_per_gram_afn === 'number' && !isNaN(price_per_gram_afn)) {
      priceGramAfn = price_per_gram_afn
    } else {
      const rates = (await query(
        'SELECT usdToAfn FROM currency_rates WHERE date = ? LIMIT 1',
        [date.trim()]
      )) as { usdToAfn?: number }[]
      const usdToAfn = rates?.[0]?.usdToAfn
      if (usdToAfn != null && usdToAfn > 0) {
        priceGramAfn = (priceOz / GRAMS_PER_OUNCE) * usdToAfn
      }
    }

    await query(
      'UPDATE gold_rates SET date = ?, price_per_ounce_usd = ?, price_per_gram_afn = ?, source = ? WHERE id = ?',
      [date.trim(), priceOz, priceGramAfn, source?.trim() || 'manual', idNum]
    )

    return NextResponse.json({
      success: true,
      message: 'نرخ طلا با موفقیت به‌روزرسانی شد'
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
