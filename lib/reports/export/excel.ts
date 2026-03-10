'use client'

import * as XLSX from 'xlsx'
import { buildExportFilename } from './filenames'
import type { ReportsSummaryResponse } from '@/lib/reports/summary/types'

type SheetRow = Record<string, string | number | null | undefined>

function aoaSheet(titleRows: string[][], header: string[], rows: (string | number | null | undefined)[][]) {
  const aoa: (string | number | null | undefined)[][] = [...titleRows, header, ...rows]
  return XLSX.utils.aoa_to_sheet(aoa)
}

function setColWidths(ws: XLSX.WorkSheet, widths: number[]) {
  ;(ws as any)['!cols'] = widths.map((wch) => ({ wch }))
}

function currencyFormatRange(ws: XLSX.WorkSheet, startRow1: number, startCol0: number, endRow1: number, endCol0: number) {
  for (let r = startRow1; r <= endRow1; r++) {
    for (let c = startCol0; c <= endCol0; c++) {
      const addr = XLSX.utils.encode_cell({ r: r - 1, c })
      const cell = ws[addr] as XLSX.CellObject | undefined
      if (!cell) continue
      if (typeof cell.v === 'number') {
        ;(cell as any).z = '#,##0'
      }
    }
  }
}

function headerBlock(summary: ReportsSummaryResponse, reportTitle: string): string[][] {
  const f = summary.filters
  const company = summary.company?.companyName || '—'
  return [
    [company],
    [reportTitle],
    [`Date range: ${f.dateFrom} → ${f.dateTo}`],
    [
      `Filters: customerId=${f.customerId ?? 'all'}, supplierId=${f.supplierId ?? 'all'}, categoryId=${f.categoryId ?? 'all'}, productType=${f.productType ?? 'all'}`
    ],
    ['']
  ]
}

export function exportSummaryToExcel(summary: ReportsSummaryResponse) {
  const wb = XLSX.utils.book_new()

  // KPI sheet
  {
    const titleRows = headerBlock(summary, 'Reports Summary (KPIs)')
    const header = ['KPI', 'Value (AFN)']
    const k = summary.kpis
    const rows = [
      ['Total Sales', k.totalSalesAfn],
      ['Total Purchases', k.totalPurchasesAfn],
      ['Gross Profit', k.grossProfitAfn],
      ['Net Profit', k.netProfitAfn],
      ['Total Expenses', k.totalExpensesAfn],
      ['Receivables', k.receivablesAfn],
      ['Payables', k.payablesAfn],
      ['Cash in hand', k.cashInHandAfn],
      ['Bank balance', k.bankBalanceAfn],
      ['Stock value', k.stockValueAfn],
      ['Low stock types', k.lowStockTypesCount],
      ['Today transactions', k.todayTransactionsCount]
    ]
    const ws = aoaSheet(titleRows, header, rows)
    setColWidths(ws, [28, 18])
    currencyFormatRange(ws, titleRows.length + 2, 1, titleRows.length + 2 + rows.length - 1, 1)
    XLSX.utils.book_append_sheet(wb, ws, 'KPIs')
  }

  // Daily preview
  {
    const titleRows = headerBlock(summary, 'Daily Report (Preview)')
    const header = ['Bell', 'CreatedAt', 'Customer', 'Total (AFN)', 'Paid (AFN)', 'Remain (AFN)']
    const rows = summary.reports.daily.preview.map((r) => [
      r.bellNumber,
      r.createdAt,
      r.customerName,
      r.totalAmountAfn,
      r.paidAmountAfn,
      r.remainingAmountAfn
    ])
    const ws = aoaSheet(titleRows, header, rows)
    setColWidths(ws, [10, 22, 26, 16, 16, 16])
    currencyFormatRange(ws, titleRows.length + 2, 3, titleRows.length + 2 + Math.max(0, rows.length - 1), 5)
    XLSX.utils.book_append_sheet(wb, ws, 'Daily')
  }

  // Top selling items
  {
    const titleRows = headerBlock(summary, 'Top Selling Items')
    const header = ['Item', 'Quantity', 'Revenue (AFN)']
    const rows = summary.charts.topSellingItems.map((r) => [r.label, r.quantity, r.valueAfn])
    const ws = aoaSheet(titleRows, header, rows)
    setColWidths(ws, [36, 12, 18])
    currencyFormatRange(ws, titleRows.length + 2, 2, titleRows.length + 2 + Math.max(0, rows.length - 1), 2)
    XLSX.utils.book_append_sheet(wb, ws, 'Top Items')
  }

  const fname = buildExportFilename('reports_summary', 'xlsx', new Date(summary.generatedAt))
  XLSX.writeFile(wb, fname, { compression: true })
}

export function exportSingleReportToExcel(summary: ReportsSummaryResponse, reportKey: string) {
  const wb = XLSX.utils.book_new()
  const baseTitle = reportKey.replace(/_/g, ' ')

  if (reportKey === 'daily_report') {
    const titleRows = headerBlock(summary, 'Daily Report (Preview)')
    const header = ['Bell', 'CreatedAt', 'Customer', 'Total (AFN)', 'Paid (AFN)', 'Remain (AFN)']
    const rows = summary.reports.daily.preview.map((r) => [
      r.bellNumber,
      r.createdAt,
      r.customerName,
      r.totalAmountAfn,
      r.paidAmountAfn,
      r.remainingAmountAfn
    ])
    const ws = aoaSheet(titleRows, header, rows)
    setColWidths(ws, [10, 22, 28, 16, 16, 16])
    currencyFormatRange(ws, titleRows.length + 2, 3, titleRows.length + 2 + Math.max(0, rows.length - 1), 5)
    XLSX.utils.book_append_sheet(wb, ws, 'Daily')
  } else if (reportKey === 'sales_report') {
    const titleRows = headerBlock(summary, 'Sales Report (Summary)')
    const header = ['Metric', 'Value']
    const s = summary.reports.sales
    const rows = [
      ['Total sales (AFN)', s.totalAmountAfn],
      ['Receivables (AFN)', s.remainAmountAfn],
      ['Discount (AFN)', s.totalDiscountAfn],
      ['Products sold', s.totalProducts],
      ['Total gram', s.totalGram]
    ]
    const ws = aoaSheet(titleRows, header, rows)
    setColWidths(ws, [26, 18])
    currencyFormatRange(ws, titleRows.length + 2, 1, titleRows.length + 2 + rows.length - 1, 1)
    XLSX.utils.book_append_sheet(wb, ws, 'Sales')
  } else if (reportKey === 'purchase_report') {
    const titleRows = headerBlock(summary, 'Purchase Report (Summary)')
    const header = ['Metric', 'Value (AFN)']
    const p = summary.reports.purchases
    const rows = [
      ['Purchases count', p.purchasesCount],
      ['Total purchases', p.totalAmountAfn],
      ['Total paid', p.totalPaidAfn],
      ['Outstanding', p.totalRemainingAfn]
    ]
    const ws = aoaSheet(titleRows, header, rows)
    setColWidths(ws, [24, 18])
    currencyFormatRange(ws, titleRows.length + 2, 1, titleRows.length + 2 + rows.length - 1, 1)
    XLSX.utils.book_append_sheet(wb, ws, 'Purchases')
  } else if (reportKey === 'profit_loss') {
    const titleRows = headerBlock(summary, 'Profit & Loss')
    const header = ['Metric', 'Value (AFN)']
    const p = summary.reports.profitLoss
    const rows = [
      ['Sales', p.salesAfn],
      ['COGS', p.cogsAfn],
      ['Gross Profit', p.grossProfitAfn],
      ['Expenses', p.expensesAfn],
      ['Net Profit', p.netProfitAfn]
    ]
    const ws = aoaSheet(titleRows, header, rows)
    setColWidths(ws, [22, 18])
    currencyFormatRange(ws, titleRows.length + 2, 1, titleRows.length + 2 + rows.length - 1, 1)
    XLSX.utils.book_append_sheet(wb, ws, 'P&L')
  } else if (reportKey === 'expenses') {
    const titleRows = headerBlock(summary, 'Expense Report (Top Types)')
    const header = ['Type', 'Total (AFN)']
    const rows = summary.reports.expenses.byType.map((r) => [r.type, r.totalAfn])
    const ws = aoaSheet(titleRows, header, rows)
    setColWidths(ws, [30, 18])
    currencyFormatRange(ws, titleRows.length + 2, 1, titleRows.length + 2 + Math.max(0, rows.length - 1), 1)
    XLSX.utils.book_append_sheet(wb, ws, 'Expenses')
  } else if (reportKey === 'stock_report') {
    const titleRows = headerBlock(summary, 'Stock / Inventory Report')
    const header = ['Type', 'Available', 'Sold']
    const rows = summary.reports.stock.byType.map((r) => [r.type, r.availableCount, r.soldCount])
    const ws = aoaSheet(titleRows, header, rows)
    setColWidths(ws, [28, 12, 12])
    XLSX.utils.book_append_sheet(wb, ws, 'Stock by Type')
  } else if (reportKey === 'low_stock') {
    const titleRows = headerBlock(summary, `Low Stock Report (≤ ${summary.reports.lowStock.threshold})`)
    const header = ['Type', 'Available']
    const rows = summary.reports.lowStock.lowTypes.map((r) => [r.type, r.availableCount])
    const ws = aoaSheet(titleRows, header, rows)
    setColWidths(ws, [30, 12])
    XLSX.utils.book_append_sheet(wb, ws, 'Low Stock')
  } else if (reportKey === 'receivables') {
    const titleRows = headerBlock(summary, 'Receivables Report')
    const header = ['Customer', 'Transactions', 'Sales (AFN)']
    const rows = summary.reports.receivables.topCustomers.map((r) => [r.label, r.quantity, r.valueAfn])
    const ws = aoaSheet(titleRows, header, rows)
    setColWidths(ws, [32, 14, 18])
    currencyFormatRange(ws, titleRows.length + 2, 2, titleRows.length + 2 + Math.max(0, rows.length - 1), 2)
    XLSX.utils.book_append_sheet(wb, ws, 'Receivables')
  } else if (reportKey === 'payables') {
    const titleRows = headerBlock(summary, 'Payables Report')
    const header = ['Supplier', 'Purchases', 'Outstanding (AFN)']
    const rows = summary.reports.payables.topSuppliers.map((r) => [r.label, r.quantity, r.valueAfn])
    const ws = aoaSheet(titleRows, header, rows)
    setColWidths(ws, [32, 14, 18])
    currencyFormatRange(ws, titleRows.length + 2, 2, titleRows.length + 2 + Math.max(0, rows.length - 1), 2)
    XLSX.utils.book_append_sheet(wb, ws, 'Payables')
  } else if (reportKey === 'cash_bank') {
    const titleRows = headerBlock(summary, 'Cash / Bank Summary')
    const header = ['Account', 'Currency', 'Balance', 'Balance (AFN)']
    const rows = summary.reports.cashBank.accounts.map((a) => [a.name, a.currency, a.balance, a.balanceAfn])
    const ws = aoaSheet(titleRows, header, rows)
    setColWidths(ws, [34, 12, 14, 16])
    currencyFormatRange(ws, titleRows.length + 2, 3, titleRows.length + 2 + Math.max(0, rows.length - 1), 3)
    XLSX.utils.book_append_sheet(wb, ws, 'CashBank')
  } else if (reportKey === 'trial_balance') {
    const titleRows = headerBlock(summary, 'Trial Balance (Accounts)')
    const header = ['Account', 'Debit (AFN)', 'Credit (AFN)']
    const rows = summary.reports.trialBalance.rows.map((r) => [r.accountName, r.debitAfn, r.creditAfn])
    const ws = aoaSheet(titleRows, header, rows)
    setColWidths(ws, [34, 16, 16])
    currencyFormatRange(ws, titleRows.length + 2, 1, titleRows.length + 2 + Math.max(0, rows.length - 1), 2)
    XLSX.utils.book_append_sheet(wb, ws, 'TrialBalance')
  } else {
    // generic fallback: KPIs only
    const titleRows = headerBlock(summary, `Report: ${baseTitle}`)
    const header = ['Key', 'Value']
    const rows: SheetRow[] = [{ note: 'This report export is not yet mapped to a specific sheet.' }]
    const ws = XLSX.utils.json_to_sheet(rows, { skipHeader: true })
    XLSX.utils.sheet_add_aoa(ws, [...titleRows, header], { origin: 'A1' })
    XLSX.utils.book_append_sheet(wb, ws, 'Report')
  }

  const fname = buildExportFilename(reportKey, 'xlsx', new Date(summary.generatedAt))
  XLSX.writeFile(wb, fname, { compression: true })
}

