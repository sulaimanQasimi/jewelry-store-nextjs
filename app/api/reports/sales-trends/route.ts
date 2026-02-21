import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

function parseJson(val: unknown): any {
  if (typeof val === 'string') return JSON.parse(val)
  return val
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || 'day'
    const dateFrom = searchParams.get('dateFrom')?.trim()
    const dateTo = searchParams.get('dateTo')?.trim()

    const start = dateFrom ? new Date(dateFrom) : (() => { const d = new Date(); d.setDate(d.getDate() - 30); return d })()
    const end = dateTo ? new Date(dateTo) : new Date()
    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 999)

    const transactions = (await query(
      'SELECT * FROM transactions WHERE createdAt >= ? AND createdAt <= ? ORDER BY createdAt',
      [start, end]
    )) as any[]

    const rateByDate: Record<string, number> = {}
    const datesNeeded = new Set<string>()
    for (const trx of transactions) {
      const d = new Date(trx.createdAt).toISOString().split('T')[0]
      datesNeeded.add(d)
    }
    if (datesNeeded.size > 0) {
      const dateArr = Array.from(datesNeeded)
      const placeholders = dateArr.map(() => '?').join(',')
      const rates = (await query(
        `SELECT date, usdToAfn FROM currency_rates WHERE date IN (${placeholders})`,
        dateArr
      )) as any[]
      for (const r of rates || []) {
        rateByDate[r.date] = Number(r.usdToAfn) || 1
      }
    }

    const bucketKey = (d: Date) => {
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      if (period === 'month') return `${y}-${m}`
      if (period === 'week') {
        const startOfWeek = new Date(d)
        const dayOfWeek = d.getDay()
        const diff = d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
        startOfWeek.setDate(diff)
        return startOfWeek.toISOString().split('T')[0]
      }
      return `${y}-${m}-${day}`
    }

    const buckets: Record<string, { total: number; count: number }> = {}

    for (const trx of transactions) {
      const products = parseJson(trx.product) as any[]
      const receipt = parseJson(trx.receipt) as any
      const isDollar = products?.some((p: any) => p.salePrice?.currency === 'دالر')
      const dateStr = new Date(trx.createdAt).toISOString().split('T')[0]
      const rate = rateByDate[dateStr] ?? 1
      const amount = (receipt?.totalAmount ?? 0) * (isDollar ? rate : 1)
      const key = bucketKey(new Date(trx.createdAt))
      if (!buckets[key]) buckets[key] = { total: 0, count: 0 }
      buckets[key].total += amount
      buckets[key].count += 1
    }

    const sortedKeys = Object.keys(buckets).sort()
    const data = sortedKeys.map((periodLabel) => ({
      period: periodLabel,
      total: Math.round(buckets[periodLabel].total),
      count: buckets[periodLabel].count
    }))

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
