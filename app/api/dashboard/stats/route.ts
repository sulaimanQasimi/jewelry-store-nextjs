import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

function parseJson(val: unknown): any {
  if (typeof val === 'string') return JSON.parse(val)
  return val
}

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0]
    const rates = (await query('SELECT * FROM currency_rates WHERE date = ? LIMIT 1', [today])) as { usdToAfn?: number }[]
    const rate = rates?.[0]?.usdToAfn ?? 1

    const [
      productsTotal,
      productsSold,
      productsAvailable,
      customersCount,
      suppliersCount,
      transactionsCount,
      purchasesCount,
      expensesTotal,
      loanReports
    ] = await Promise.all([
      query('SELECT COUNT(*) AS c FROM products', []) as Promise<any[]>,
      query('SELECT COUNT(*) AS c FROM products WHERE isSold = 1', []) as Promise<any[]>,
      query('SELECT COUNT(*) AS c FROM products WHERE isSold = 0', []) as Promise<any[]>,
      query('SELECT COUNT(*) AS c FROM customers', []) as Promise<any[]>,
      query('SELECT COUNT(*) AS c FROM suppliers WHERE isActive = 1', []) as Promise<any[]>,
      query('SELECT COUNT(*) AS c FROM transactions', []) as Promise<any[]>,
      query('SELECT COUNT(*) AS c FROM purchases', []) as Promise<any[]>,
      query('SELECT COALESCE(SUM(price), 0) AS t FROM expenses', []) as Promise<any[]>,
      query('SELECT COUNT(*) AS c, COALESCE(SUM(amount), 0) AS t FROM loan_reports', []) as Promise<any[]>
    ])

    const stats = {
      productsTotal: Number(productsTotal?.[0]?.c ?? 0),
      productsSold: Number(productsSold?.[0]?.c ?? 0),
      productsAvailable: Number(productsAvailable?.[0]?.c ?? 0),
      customersCount: Number(customersCount?.[0]?.c ?? 0),
      suppliersCount: Number(suppliersCount?.[0]?.c ?? 0),
      transactionsCount: Number(transactionsCount?.[0]?.c ?? 0),
      purchasesCount: Number(purchasesCount?.[0]?.c ?? 0),
      expensesTotal: Number(expensesTotal?.[0]?.t ?? 0),
      loanReportsCount: Number(loanReports?.[0]?.c ?? 0),
      loanReportsTotal: Number(loanReports?.[0]?.t ?? 0)
    }

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    const todayTrx = (await query(
      'SELECT * FROM transactions WHERE createdAt >= ? AND createdAt <= ?',
      [todayStart, todayEnd]
    )) as any[]

    let todaySales = 0
    let todayPaid = 0
    let todayRemaining = 0
    for (const trx of todayTrx) {
      const receipt = parseJson(trx.receipt) as any
      const products = parseJson(trx.product) as any[]
      const isDollar = products?.some((p: any) => p.salePrice?.currency === 'دالر')
      const mult = isDollar ? rate : 1
      todaySales += (receipt?.totalAmount ?? 0) * mult
      todayPaid += (receipt?.paidAmount ?? 0) * mult
      todayRemaining += (receipt?.remainingAmount ?? 0) * mult
    }

    const last7Days: { date: string; total: number; count: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const start = new Date(d)
      start.setHours(0, 0, 0, 0)
      const end = new Date(d)
      end.setHours(23, 59, 59, 999)

      const rows = (await query(
        'SELECT * FROM transactions WHERE createdAt >= ? AND createdAt <= ?',
        [start, end]
      )) as any[]

      let dayTotal = 0
      for (const trx of rows) {
        const receipt = parseJson(trx.receipt) as any
        const products = parseJson(trx.product) as any[]
        const isDollar = products?.some((p: any) => p.salePrice?.currency === 'دالر')
        dayTotal += (receipt?.totalAmount ?? 0) * (isDollar ? rate : 1)
      }
      last7Days.push({
        date: dateStr,
        total: Math.round(dayTotal),
        count: rows.length
      })
    }

    const salesByType = (await query(
      `SELECT type, COUNT(*) AS cnt FROM products WHERE isSold = 1 GROUP BY type ORDER BY cnt DESC LIMIT 6`,
      []
    )) as { type: string; cnt: number }[]

    return NextResponse.json({
      success: true,
      stats: {
        ...stats,
        todaySales: Math.round(todaySales),
        todayPaid: Math.round(todayPaid),
        todayRemaining: Math.round(todayRemaining),
        todayTransactions: todayTrx.length
      },
      last7Days,
      salesByType: (salesByType || []).map((r) => ({ label: r.type || 'سایر', value: Number(r.cnt) }))
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
