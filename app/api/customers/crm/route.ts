import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

function parseJson(val: unknown): any {
  if (typeof val === 'string') return JSON.parse(val)
  return val
}

function daysUntilNextOccasion(dateStr: string | null, label: string): { days: number; label: string } | null {
  if (!dateStr || !dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return null
  const [_, m, d] = dateStr.split('-').map(Number)
  const now = new Date()
  let next = new Date(now.getFullYear(), m - 1, d)
  if (next < now) next = new Date(now.getFullYear() + 1, m - 1, d)
  const days = Math.ceil((next.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
  return days <= 30 ? { days, label } : null
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const hasOccasion = searchParams.get('upcomingOccasions') === 'true'

    const customers = (await query(
      'SELECT id, customerName, phone, birthDate, anniversary_date FROM customers',
      []
    )) as any[]

    const transactions = (await query(
      'SELECT customerId, customerName, receipt, product, createdAt FROM transactions ORDER BY createdAt DESC',
      []
    )) as any[]

    const rateRows = (await query("SELECT rate FROM currencies WHERE code = 'USD' AND active = 1 LIMIT 1", [])) as { rate?: number }[]
    const defaultRate = rateRows?.[0]?.rate != null ? Number(rateRows[0].rate) : 1

    const byCustomer: Record<
      number,
      { totalSpent: number; lastPurchaseAt: string | null; customerName: string; phone: string }
    > = {}
    for (const c of customers) {
      byCustomer[c.id] = {
        totalSpent: 0,
        lastPurchaseAt: null,
        customerName: c.customerName ?? '',
        phone: c.phone ?? ''
      }
    }

    for (const trx of transactions) {
      const cid = trx.customerId
      if (!byCustomer[cid]) continue
      const products = parseJson(trx.product) as any[]
      const receipt = parseJson(trx.receipt) as any
      const rate = defaultRate
      const isDollar = products?.some((p: any) => p.salePrice?.currency === 'دالر')
      const amount = (receipt?.totalAmount ?? 0) * (isDollar ? rate : 1)
      byCustomer[cid].totalSpent += amount
      if (!byCustomer[cid].lastPurchaseAt) byCustomer[cid].lastPurchaseAt = trx.createdAt
    }

    const list: {
      id: number
      customerName: string
      phone: string
      totalSpent: number
      lastPurchaseAt: string | null
      nextOccasion: { days: number; label: string } | null
      birthDate: string | null
      anniversary_date: string | null
    }[] = []

    for (const c of customers) {
      const agg = byCustomer[c.id]
      const birthNext = daysUntilNextOccasion(c.birthDate, 'تولد')
      const annNext = daysUntilNextOccasion(c.anniversary_date, 'سالگرد')
      const nextOccasion = birthNext ?? annNext

      if (hasOccasion && !nextOccasion) continue

      list.push({
        id: c.id,
        customerName: agg?.customerName ?? c.customerName ?? '',
        phone: agg?.phone ?? c.phone ?? '',
        totalSpent: Math.round(agg?.totalSpent ?? 0),
        lastPurchaseAt: agg?.lastPurchaseAt ?? null,
        nextOccasion: nextOccasion ?? null,
        birthDate: c.birthDate ?? null,
        anniversary_date: c.anniversary_date ?? null
      })
    }

    list.sort((a, b) => (b.totalSpent - a.totalSpent))

    return NextResponse.json({ success: true, data: list })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
