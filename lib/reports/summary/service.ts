import { query } from '@/lib/db'
import { fnGetCurrencyRate, parseJson } from '@/lib/db-sp'
import type {
  DailyReportPreviewRow,
  ExpensesReportSummary,
  ProfitLossSummary,
  PurchasesReportSummary,
  ReportsSummaryResponse,
  ReportsSummaryFilters,
  SalesReportSummary,
  StockReportSummary,
  TopRow,
  TrendPoint,
  TrialBalanceSummary
} from './types'
import { clampDateRange, isProbablyCashAccount, roundMoney, toAfn } from './helpers'

type TransactionRow = { id: number; customerId: number; customerName: string; createdAt: Date | string; bellNumber: number; product: any; receipt: any }
type PurchaseRow = { id: number; supplierId: number; supplierName: string; totalAmount: number; paidAmount: number; currency: string; date: Date | string; createdAt: Date | string }
type ExpenseRow = { id: number; type: string; price: number; currency: string; date: Date | string }

function bucketKey(period: 'day' | 'week' | 'month', d: Date): string {
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

function summarizeTrends(rows: { at: Date; totalAfn: number }[], period: 'day' | 'week' | 'month'): TrendPoint[] {
  const buckets: Record<string, { total: number; count: number }> = {}
  for (const r of rows) {
    const k = bucketKey(period, r.at)
    if (!buckets[k]) buckets[k] = { total: 0, count: 0 }
    buckets[k].total += r.totalAfn
    buckets[k].count += 1
  }
  return Object.keys(buckets)
    .sort()
    .map((k) => ({ period: k, totalAfn: roundMoney(buckets[k].total), count: buckets[k].count }))
}

function topNFromMap(map: Record<string, { quantity: number; valueAfn: number }>, limit: number): TopRow[] {
  const entries = Object.entries(map).map(([label, v]) => ({
    label,
    quantity: v.quantity,
    valueAfn: roundMoney(v.valueAfn)
  }))
  entries.sort((a, b) => b.valueAfn - a.valueAfn)
  return entries.slice(0, limit)
}

export async function getReportsSummary(filters: ReportsSummaryFilters): Promise<ReportsSummaryResponse> {
  const { dateFrom: from0, dateTo: to0 } = clampDateRange(new Date(filters.dateFrom), new Date(filters.dateTo))
  const usdRate = (await fnGetCurrencyRate(filters.dateFrom)) ?? 1

  const [companyRows] = await Promise.all([query('SELECT * FROM companies ORDER BY id DESC LIMIT 1', []) as Promise<any[]>])
  const company = companyRows?.[0]

  const trxConditions: string[] = ['createdAt >= ? AND createdAt <= ?']
  const trxParams: any[] = [from0, to0]
  if (filters.customerId) {
    trxConditions.push('customerId = ?')
    trxParams.push(filters.customerId)
  }
  const trxWhere = `WHERE ${trxConditions.join(' AND ')}`

  const [transactions, purchases, expenses] = await Promise.all([
    query(`SELECT id, customerId, customerName, createdAt, bellNumber, product, receipt FROM transactions ${trxWhere} ORDER BY createdAt DESC`, trxParams) as Promise<TransactionRow[]>,
    (async () => {
      const cond: string[] = ['createdAt >= ? AND createdAt <= ?']
      const params: any[] = [from0, to0]
      if (filters.supplierId) {
        cond.push('supplierId = ?')
        params.push(filters.supplierId)
      }
      const where = `WHERE ${cond.join(' AND ')}`
      return (await query(
        `SELECT id, supplierId, supplierName, totalAmount, paidAmount, currency, date, createdAt FROM purchases ${where} ORDER BY createdAt DESC`,
        params
      )) as PurchaseRow[]
    })(),
    (async () => {
      const cond: string[] = ['date >= ? AND date <= ?']
      const params: any[] = [from0, to0]
      const where = `WHERE ${cond.join(' AND ')}`
      return (await query(
        `SELECT id, type, price, currency, date FROM expenses ${where} ORDER BY date DESC, id DESC`,
        params
      )) as ExpenseRow[]
    })()
  ])

  // --- Sales / Receivables / COGS aggregation from transactions JSON
  let salesTotalAfn = 0
  let salesPaidAfn = 0
  let salesRemainingAfn = 0
  let salesDiscountAfn = 0
  let salesProductsCount = 0
  let salesTotalGram = 0
  let cogsAfn = 0

  const topCustomersBySales: Record<string, { quantity: number; valueAfn: number }> = {}
  const topItemsByRevenue: Record<string, { quantity: number; valueAfn: number }> = {}
  const salesTrendRows: { at: Date; totalAfn: number }[] = []

  const dailyPreview: DailyReportPreviewRow[] = []

  for (const trx of transactions || []) {
    const receipt = parseJson(trx.receipt) as any
    const products = (parseJson(trx.product) as any[]) || []

    const isDollarSale = products.some((p: any) => p?.salePrice?.currency === 'دالر')
    const mult = isDollarSale ? usdRate : 1

    const total = (receipt?.totalAmount ?? 0) * mult
    const paid = (receipt?.paidAmount ?? 0) * mult
    const rem = (receipt?.remainingAmount ?? 0) * mult
    const disc = (receipt?.discount ?? 0) * mult

    salesTotalAfn += total
    salesPaidAfn += paid
    salesRemainingAfn += rem
    salesDiscountAfn += disc

    const createdAt = new Date(trx.createdAt as any)
    salesTrendRows.push({ at: createdAt, totalAfn: total })

    // preview (limit 12)
    if (dailyPreview.length < 12) {
      dailyPreview.push({
        id: trx.id,
        bellNumber: trx.bellNumber,
        createdAt: createdAt.toISOString(),
        customerName: trx.customerName,
        totalAmountAfn: roundMoney(total),
        paidAmountAfn: roundMoney(paid),
        remainingAmountAfn: roundMoney(rem)
      })
    }

    // Top customers
    const customerLabel = trx.customerName || `#${trx.customerId}`
    if (!topCustomersBySales[customerLabel]) topCustomersBySales[customerLabel] = { quantity: 0, valueAfn: 0 }
    topCustomersBySales[customerLabel].quantity += 1
    topCustomersBySales[customerLabel].valueAfn += total

    // Products totals + COGS + top items
    for (const p of products) {
      salesProductsCount += 1
      salesTotalGram += Number(p?.gram ?? 0) || 0

      // COGS: purchasePriceToAfn already AFN per schema
      cogsAfn += Number(p?.purchasePriceToAfn ?? 0) || 0

      const label = (p?.productName || p?.name || p?.barcode || p?.type || 'سایر').toString().trim() || 'سایر'
      const itemAmount = toAfn(Number(p?.salePrice?.amount ?? p?.salePrice?.price ?? 0) || 0, p?.salePrice?.currency, usdRate)
      if (!topItemsByRevenue[label]) topItemsByRevenue[label] = { quantity: 0, valueAfn: 0 }
      topItemsByRevenue[label].quantity += 1
      topItemsByRevenue[label].valueAfn += itemAmount
    }
  }

  const salesSummary: SalesReportSummary = {
    totalProducts: salesProductsCount,
    totalGram: salesTotalGram,
    totalAmountAfn: roundMoney(salesTotalAfn),
    remainAmountAfn: roundMoney(salesRemainingAfn),
    totalDiscountAfn: roundMoney(salesDiscountAfn)
  }

  const receivablesTotalAfn = roundMoney(salesRemainingAfn)

  // --- Purchases / Payables
  let purchasesTotalAfn = 0
  let purchasesPaidAfn = 0
  let purchasesRemainingAfn = 0
  const purchaseTrendRows: { at: Date; totalAfn: number }[] = []
  const topSuppliersByPayable: Record<string, { quantity: number; valueAfn: number }> = {}

  for (const p of purchases || []) {
    const total = toAfn(Number(p.totalAmount ?? 0) || 0, p.currency, usdRate)
    const paid = toAfn(Number(p.paidAmount ?? 0) || 0, p.currency, usdRate)
    const rem = Math.max(0, total - paid)

    purchasesTotalAfn += total
    purchasesPaidAfn += paid
    purchasesRemainingAfn += rem

    purchaseTrendRows.push({ at: new Date(p.createdAt as any), totalAfn: total })

    const supplierLabel = p.supplierName || `#${p.supplierId}`
    if (!topSuppliersByPayable[supplierLabel]) topSuppliersByPayable[supplierLabel] = { quantity: 0, valueAfn: 0 }
    topSuppliersByPayable[supplierLabel].quantity += 1
    topSuppliersByPayable[supplierLabel].valueAfn += rem
  }

  // Include supplier_products payable components (pasaRemaining + wageRemaining)
  const supplierProductCond: string[] = []
  const supplierProductParams: any[] = []
  if (filters.supplierId) {
    supplierProductCond.push('supplierId = ?')
    supplierProductParams.push(filters.supplierId)
  }
  const supplierProductWhere = supplierProductCond.length ? `WHERE ${supplierProductCond.join(' AND ')}` : ''
  const supplierProducts = (await query(
    `SELECT supplierName, supplierId, pasaRemaining, wageRemaining FROM supplier_products ${supplierProductWhere}`,
    supplierProductParams
  )) as any[]

  let vendorExtraPayablesAfn = 0
  for (const row of supplierProducts || []) {
    const rem = (Number(row.pasaRemaining ?? 0) || 0) + (Number(row.wageRemaining ?? 0) || 0)
    vendorExtraPayablesAfn += rem
    const supplierLabel = row.supplierName || `#${row.supplierId}`
    if (!topSuppliersByPayable[supplierLabel]) topSuppliersByPayable[supplierLabel] = { quantity: 0, valueAfn: 0 }
    topSuppliersByPayable[supplierLabel].valueAfn += rem
  }

  const purchasesSummary: PurchasesReportSummary = {
    purchasesCount: purchases?.length ?? 0,
    totalAmountAfn: roundMoney(purchasesTotalAfn),
    totalPaidAfn: roundMoney(purchasesPaidAfn),
    totalRemainingAfn: roundMoney(purchasesRemainingAfn + vendorExtraPayablesAfn)
  }

  const payablesTotalAfn = purchasesSummary.totalRemainingAfn

  // --- Expenses
  const byType: Record<string, number> = {}
  let expensesTotalAfn = 0
  for (const e of expenses || []) {
    const amount = toAfn(Number(e.price ?? 0) || 0, e.currency, usdRate)
    expensesTotalAfn += amount
    const type = (e.type || 'سایر').toString().trim() || 'سایر'
    byType[type] = (byType[type] || 0) + amount
  }
  const expensesSummary: ExpensesReportSummary = {
    expensesCount: expenses?.length ?? 0,
    totalAmountAfn: roundMoney(expensesTotalAfn),
    byType: Object.entries(byType)
      .map(([type, total]) => ({ type, totalAfn: roundMoney(total) }))
      .sort((a, b) => b.totalAfn - a.totalAfn)
      .slice(0, 8)
  }

  // --- Stock / Low stock (types under threshold)
  const stockFilters: string[] = []
  const stockParams: any[] = []
  let joinCat = ''
  if (filters.categoryId) {
    joinCat = 'INNER JOIN product_categories pc ON pc.product_id = p.id'
    stockFilters.push('pc.category_id = ?')
    stockParams.push(filters.categoryId)
  }
  if (filters.productType) {
    stockFilters.push('p.type = ?')
    stockParams.push(filters.productType)
  }
  const stockWhere = stockFilters.length ? `WHERE ${stockFilters.join(' AND ')}` : ''

  const stockRows = (await query(
    `SELECT p.type, p.isSold, p.purchasePriceToAfn FROM products p ${joinCat} ${stockWhere}`,
    stockParams
  )) as any[]

  let availableCount = 0
  let soldCount = 0
  let stockValueAfn = 0
  const stockByType: Record<string, { available: number; sold: number }> = {}
  for (const r of stockRows || []) {
    const type = (r.type || 'سایر').toString().trim() || 'سایر'
    if (!stockByType[type]) stockByType[type] = { available: 0, sold: 0 }
    if (Number(r.isSold) === 1 || r.isSold === true) {
      soldCount += 1
      stockByType[type].sold += 1
    } else {
      availableCount += 1
      stockByType[type].available += 1
      stockValueAfn += Number(r.purchasePriceToAfn ?? 0) || 0
    }
  }

  const stockSummary: StockReportSummary = {
    availableCount,
    soldCount,
    stockValueAfn: roundMoney(stockValueAfn),
    byType: Object.entries(stockByType)
      .map(([type, v]) => ({ type, availableCount: v.available, soldCount: v.sold }))
      .sort((a, b) => b.availableCount - a.availableCount)
      .slice(0, 10)
  }

  const lowStockThreshold = 2
  const lowTypes = Object.entries(stockByType)
    .map(([type, v]) => ({ type, availableCount: v.available }))
    .filter((r) => r.availableCount <= lowStockThreshold)
    .sort((a, b) => a.availableCount - b.availableCount)
    .slice(0, 12)

  // --- Cash/Bank and Trial balance from accounts table
  const accountRows = (await query(
    'SELECT id, account_number, name, currency, balance, status FROM accounts ORDER BY created_at DESC'
  )) as any[]
  let cashAfn = 0
  let bankAfn = 0
  const accounts = (accountRows || [])
    .filter((a) => a.status === 'active' || a.status == null)
    .map((a) => {
      const bal = Number(a.balance ?? 0) || 0
      const balAfn = toAfn(bal, a.currency, usdRate)
      if (isProbablyCashAccount(a.name)) cashAfn += balAfn
      else bankAfn += balAfn
      return {
        id: String(a.id),
        name: String(a.name ?? ''),
        currency: String(a.currency ?? ''),
        balance: bal,
        balanceAfn: roundMoney(balAfn)
      }
    })

  const cashBank = {
    totalAfn: roundMoney(cashAfn + bankAfn),
    cashInHandAfn: roundMoney(cashAfn),
    bankBalanceAfn: roundMoney(bankAfn),
    accounts
  }

  const trialRows = accounts.map((a) => {
    // Without a chart of accounts, treat positive balances as debit for a simple cash/bank trial view.
    return {
      accountNumber: (accountRows.find((x) => String(x.id) === a.id)?.account_number as string) || '',
      accountName: a.name,
      debitAfn: a.balanceAfn,
      creditAfn: 0
    }
  })
  const trialBalance: TrialBalanceSummary = {
    rows: trialRows,
    totalDebitAfn: roundMoney(trialRows.reduce((s, r) => s + r.debitAfn, 0)),
    totalCreditAfn: 0
  }

  // --- Profit & Loss
  const profitLoss: ProfitLossSummary = {
    salesAfn: roundMoney(salesTotalAfn),
    cogsAfn: roundMoney(cogsAfn),
    grossProfitAfn: roundMoney(salesTotalAfn - cogsAfn),
    expensesAfn: roundMoney(expensesTotalAfn),
    netProfitAfn: roundMoney(salesTotalAfn - cogsAfn - expensesTotalAfn)
  }

  const grossProfitAfn = profitLoss.grossProfitAfn
  const netProfitAfn = profitLoss.netProfitAfn

  // --- Charts
  const salesTrend = summarizeTrends(salesTrendRows, 'day')
  const purchaseTrend = summarizeTrends(purchaseTrendRows, 'day')
  const profitTrend: TrendPoint[] = (() => {
    const byDay: Record<string, { total: number; count: number }> = {}
    for (const s of salesTrendRows) {
      const k = bucketKey('day', s.at)
      if (!byDay[k]) byDay[k] = { total: 0, count: 0 }
      byDay[k].total += s.totalAfn
      byDay[k].count += 1
    }
    for (const p of purchaseTrendRows) {
      const k = bucketKey('day', p.at)
      if (!byDay[k]) byDay[k] = { total: 0, count: 0 }
      // purchases reduce profit trend; this isn't full P&L trend but gives a directional view
      byDay[k].total -= p.totalAfn
    }
    return Object.keys(byDay)
      .sort()
      .map((k) => ({ period: k, totalAfn: roundMoney(byDay[k].total), count: byDay[k].count }))
  })()

  const topCustomers = topNFromMap(topCustomersBySales, 8)
  const topSellingItems = topNFromMap(topItemsByRevenue, 10)
  const topSuppliers = topNFromMap(topSuppliersByPayable, 8)

  const kpis = {
    totalSalesAfn: roundMoney(salesTotalAfn),
    totalPurchasesAfn: roundMoney(purchasesTotalAfn),
    grossProfitAfn,
    netProfitAfn,
    totalExpensesAfn: roundMoney(expensesTotalAfn),
    receivablesAfn: receivablesTotalAfn,
    payablesAfn: payablesTotalAfn,
    cashInHandAfn: cashBank.cashInHandAfn,
    bankBalanceAfn: cashBank.bankBalanceAfn,
    stockValueAfn: stockSummary.stockValueAfn,
    lowStockTypesCount: lowTypes.length,
    todayTransactionsCount: (() => {
      const today = new Date()
      const start = new Date(today)
      start.setHours(0, 0, 0, 0)
      const end = new Date(today)
      end.setHours(23, 59, 59, 999)
      return (transactions || []).filter((t) => {
        const dt = new Date(t.createdAt as any)
        return dt >= start && dt <= end
      }).length
    })()
  }

  return {
    success: true,
    filters,
    generatedAt: new Date().toISOString(),
    company: company
      ? {
          companyName: company.companyName,
          slogan: company.slogan,
          phone: company.phone,
          address: company.address,
          image: company.image
        }
      : undefined,
    kpis,
    charts: {
      salesTrend,
      purchaseTrend,
      profitTrend,
      topCustomers,
      topSellingItems
    },
    reports: {
      daily: { preview: dailyPreview },
      sales: salesSummary,
      purchases: purchasesSummary,
      expenses: expensesSummary,
      receivables: { totalAfn: receivablesTotalAfn, topCustomers },
      payables: { totalAfn: payablesTotalAfn, topSuppliers },
      stock: stockSummary,
      lowStock: { threshold: lowStockThreshold, lowTypes: lowTypes },
      cashBank,
      trialBalance,
      profitLoss
    }
  }
}

