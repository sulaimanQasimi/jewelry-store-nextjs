import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

function parseJson(val: unknown): any {
  if (typeof val === 'string') return JSON.parse(val)
  return val
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dateFrom = searchParams.get('dateFrom')?.trim()
    const dateTo = searchParams.get('dateTo')?.trim()
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))

    let transactions: any[]
    if (dateFrom && dateTo) {
      const start = new Date(dateFrom)
      start.setHours(0, 0, 0, 0)
      const end = new Date(dateTo)
      end.setHours(23, 59, 59, 999)
      transactions = (await query(
        'SELECT * FROM transactions WHERE createdAt >= ? AND createdAt <= ?',
        [start, end]
      )) as any[]
    } else {
      const start = new Date()
      start.setDate(start.getDate() - 30)
      start.setHours(0, 0, 0, 0)
      transactions = (await query(
        'SELECT * FROM transactions WHERE createdAt >= ?',
        [start]
      )) as any[]
    }

    const rateByDate: Record<string, number> = {}
    const datesNeeded = new Set<string>()
    for (const trx of transactions) {
      datesNeeded.add(new Date(trx.createdAt).toISOString().split('T')[0])
    }
    const rateRows = (await query("SELECT rate FROM currencies WHERE code = 'USD' AND active = 1 LIMIT 1", [])) as { rate?: number }[]
    const usdRate = rateRows?.[0]?.rate != null ? Number(rateRows[0].rate) : 1
    for (const d of datesNeeded) {
      rateByDate[d] = usdRate
    }

    const byType: Record<string, { quantity: number; revenue: number }> = {}

    for (const trx of transactions) {
      const products = parseJson(trx.product) as any[]
      const dateStr = new Date(trx.createdAt).toISOString().split('T')[0]
      const rate = rateByDate[dateStr] ?? 1

      for (const p of products || []) {
        const type = (p.type || p.productName || 'سایر').trim() || 'سایر'
        const isDollar = p.salePrice?.currency === 'دالر'
        const amount = (p.salePrice?.amount ?? 0) * (isDollar ? rate : 1)
        if (!byType[type]) byType[type] = { quantity: 0, revenue: 0 }
        byType[type].quantity += 1
        byType[type].revenue += amount
      }
    }

    const entries = Object.entries(byType).map(([label, v]) => ({
      label,
      quantity: v.quantity,
      revenue: Math.round(v.revenue)
    }))
    entries.sort((a, b) => b.revenue - a.revenue)
    const data = entries.slice(0, limit)

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
