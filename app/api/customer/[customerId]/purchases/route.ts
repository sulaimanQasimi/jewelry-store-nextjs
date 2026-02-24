import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

function parseJson(val: unknown): any {
  if (typeof val === 'string') return JSON.parse(val)
  return val
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    const { customerId } = await params
    const id = parseInt(customerId, 10)
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: 'شناسه نامعتبر' }, { status: 400 })
    }

    const transactions = (await query(
      'SELECT id, bellNumber, product, receipt, createdAt FROM transactions WHERE customerId = ? ORDER BY createdAt DESC LIMIT 100',
      [id]
    )) as any[]

    const rateRows = (await query("SELECT rate FROM currencies WHERE code = 'USD' AND active = 1 LIMIT 1", [])) as { rate?: number }[]
    const rate = rateRows?.[0]?.rate != null ? Number(rateRows[0].rate) : 1

    let totalSpent = 0
    let lastPurchaseAt: string | null = null
    const purchases: { id: number; bellNumber: number; createdAt: string; totalAmount: number; productCount: number }[] = []

    for (const trx of transactions) {
      const products = parseJson(trx.product) as any[]
      const receipt = parseJson(trx.receipt) as any
      const isDollar = products?.some((p: any) => p.salePrice?.currency === 'دالر')
      const amount = (receipt?.totalAmount ?? 0) * (isDollar ? rate : 1)
      totalSpent += amount
      if (!lastPurchaseAt) lastPurchaseAt = trx.createdAt
      purchases.push({
        id: trx.id,
        bellNumber: trx.bellNumber,
        createdAt: trx.createdAt,
        totalAmount: Math.round(amount),
        productCount: Array.isArray(products) ? products.length : 0
      })
    }

    if (lastPurchaseAt === null && transactions.length > 0) {
      lastPurchaseAt = transactions[transactions.length - 1].createdAt
    }

    return NextResponse.json({
      success: true,
      data: {
        purchases,
        totalSpent: Math.round(totalSpent),
        lastPurchaseAt,
        transactionCount: transactions.length
      }
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
