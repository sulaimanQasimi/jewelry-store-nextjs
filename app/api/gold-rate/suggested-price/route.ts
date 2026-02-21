import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const gram = parseFloat(searchParams.get('gram') || '0')
    const karat = parseFloat(searchParams.get('karat') || '0')
    const wagePerGram = parseFloat(searchParams.get('wagePerGram') || '0')

    if (gram <= 0 || karat <= 0) {
      return NextResponse.json({ success: true, suggestedPriceAfn: null, message: 'گرم و عیار باید مثبت باشند' })
    }

    const rows = (await query(
      'SELECT * FROM gold_rates ORDER BY date DESC LIMIT 1',
      []
    )) as { price_per_gram_afn?: number }[]

    const goldPerGramAfn = rows?.[0]?.price_per_gram_afn
    if (goldPerGramAfn == null || goldPerGramAfn <= 0) {
      return NextResponse.json({ success: true, suggestedPriceAfn: null, message: 'نرخ طلا ثبت نشده است' })
    }

    const goldValue = gram * (karat / 24) * goldPerGramAfn
    const wageValue = gram * (wagePerGram || 0)
    const suggestedPriceAfn = Math.round((goldValue + wageValue) * 100) / 100

    return NextResponse.json({
      success: true,
      suggestedPriceAfn,
      goldPerGramAfn,
      goldValue: Math.round(goldValue * 100) / 100,
      wageValue: Math.round(wageValue * 100) / 100
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
