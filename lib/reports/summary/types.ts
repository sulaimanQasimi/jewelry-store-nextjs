export type DateRange = { dateFrom: Date; dateTo: Date }

export type ReportsSummaryFilters = {
  dateFrom: string
  dateTo: string
  customerId?: number
  supplierId?: number
  categoryId?: number
  productType?: string
}

export type Money = {
  amountAfn: number
  currency: 'AFN'
}

export type TrendPoint = { period: string; totalAfn: number; count: number }

export type TopRow = {
  label: string
  quantity: number
  valueAfn: number
}

export type SummaryKpis = {
  totalSalesAfn: number
  totalPurchasesAfn: number
  grossProfitAfn: number
  netProfitAfn: number
  totalExpensesAfn: number
  receivablesAfn: number
  payablesAfn: number
  cashInHandAfn: number
  bankBalanceAfn: number
  stockValueAfn: number
  lowStockTypesCount: number
  todayTransactionsCount: number
}

export type DailyReportPreviewRow = {
  id: number
  bellNumber: number
  createdAt: string
  customerName: string
  totalAmountAfn: number
  paidAmountAfn: number
  remainingAmountAfn: number
}

export type SalesReportSummary = {
  totalProducts: number
  totalGram: number
  totalAmountAfn: number
  remainAmountAfn: number
  totalDiscountAfn: number
}

export type PurchasesReportSummary = {
  purchasesCount: number
  totalAmountAfn: number
  totalPaidAfn: number
  totalRemainingAfn: number
}

export type ExpensesReportSummary = {
  expensesCount: number
  totalAmountAfn: number
  byType: { type: string; totalAfn: number }[]
}

export type StockReportSummary = {
  availableCount: number
  soldCount: number
  stockValueAfn: number
  byType: { type: string; availableCount: number; soldCount: number }[]
}

export type CashBankSummary = {
  totalAfn: number
  cashInHandAfn: number
  bankBalanceAfn: number
  accounts: { id: string; name: string; currency: string; balance: number; balanceAfn: number }[]
}

export type TrialBalanceRow = {
  accountNumber: string
  accountName: string
  debitAfn: number
  creditAfn: number
}

export type TrialBalanceSummary = {
  rows: TrialBalanceRow[]
  totalDebitAfn: number
  totalCreditAfn: number
}

export type ProfitLossSummary = {
  salesAfn: number
  cogsAfn: number
  grossProfitAfn: number
  expensesAfn: number
  netProfitAfn: number
}

export type ReportsSummaryResponse = {
  success: boolean
  filters: ReportsSummaryFilters
  generatedAt: string
  company?: { companyName?: string; slogan?: string; phone?: string; address?: string; image?: string }
  kpis: SummaryKpis
  charts: {
    salesTrend: TrendPoint[]
    purchaseTrend: TrendPoint[]
    profitTrend: TrendPoint[]
    topCustomers: TopRow[]
    topSellingItems: TopRow[]
  }
  reports: {
    daily: { preview: DailyReportPreviewRow[] }
    sales: SalesReportSummary
    purchases: PurchasesReportSummary
    expenses: ExpensesReportSummary
    receivables: { totalAfn: number; topCustomers: TopRow[] }
    payables: { totalAfn: number; topSuppliers: TopRow[] }
    stock: StockReportSummary
    lowStock: { threshold: number; lowTypes: { type: string; availableCount: number }[] }
    cashBank: CashBankSummary
    trialBalance: TrialBalanceSummary
    profitLoss: ProfitLossSummary
  }
}

