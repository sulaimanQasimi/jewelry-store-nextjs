'use client'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { buildExportFilename } from './filenames'
import type { ReportsSummaryResponse } from '@/lib/reports/summary/types'

function addHeader(doc: jsPDF, summary: ReportsSummaryResponse, title: string) {
  const company = summary.company?.companyName || 'Company'
  const range = `${summary.filters.dateFrom} → ${summary.filters.dateTo}`
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text(company, 14, 16)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text(title, 14, 24)
  doc.setFontSize(9.5)
  doc.text(`Date range: ${range}`, 14, 30)
  doc.text(
    `Filters: customerId=${summary.filters.customerId ?? 'all'}, supplierId=${summary.filters.supplierId ?? 'all'}, categoryId=${summary.filters.categoryId ?? 'all'}, productType=${summary.filters.productType ?? 'all'}`,
    14,
    35
  )
}

export function exportSummaryToPdf(summary: ReportsSummaryResponse) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  addHeader(doc, summary, 'Reports Summary')

  const k = summary.kpis
  autoTable(doc, {
    startY: 48,
    head: [['KPI', 'Value (AFN)']],
    body: [
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
    ],
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [198, 167, 94] },
    theme: 'grid'
  })

  const fname = buildExportFilename('reports_summary', 'pdf', new Date(summary.generatedAt))
  doc.save(fname)
}

export function exportSingleReportToPdf(summary: ReportsSummaryResponse, reportKey: string) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })

  if (reportKey === 'daily_report') {
    addHeader(doc, summary, 'Daily Report (Preview)')
    autoTable(doc, {
      startY: 48,
      head: [['Bell', 'CreatedAt', 'Customer', 'Total (AFN)', 'Paid (AFN)', 'Remain (AFN)']],
      body: summary.reports.daily.preview.map((r) => [
        `#${r.bellNumber}`,
        r.createdAt,
        r.customerName,
        r.totalAmountAfn,
        r.paidAmountAfn,
        r.remainingAmountAfn
      ]),
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [198, 167, 94] },
      theme: 'grid'
    })
  } else if (reportKey === 'sales_report') {
    addHeader(doc, summary, 'Sales Report (Summary)')
    const s = summary.reports.sales
    autoTable(doc, {
      startY: 48,
      head: [['Metric', 'Value']],
      body: [
        ['Total sales (AFN)', s.totalAmountAfn],
        ['Receivables (AFN)', s.remainAmountAfn],
        ['Discount (AFN)', s.totalDiscountAfn],
        ['Products sold', s.totalProducts],
        ['Total gram', s.totalGram]
      ],
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [198, 167, 94] },
      theme: 'grid'
    })
  } else if (reportKey === 'purchase_report') {
    addHeader(doc, summary, 'Purchase Report (Summary)')
    const p = summary.reports.purchases
    autoTable(doc, {
      startY: 48,
      head: [['Metric', 'Value']],
      body: [
        ['Purchases count', p.purchasesCount],
        ['Total purchases (AFN)', p.totalAmountAfn],
        ['Total paid (AFN)', p.totalPaidAfn],
        ['Outstanding (AFN)', p.totalRemainingAfn]
      ],
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [13, 148, 136] },
      theme: 'grid'
    })
  } else if (reportKey === 'profit_loss') {
    addHeader(doc, summary, 'Profit & Loss')
    const p = summary.reports.profitLoss
    autoTable(doc, {
      startY: 48,
      head: [['Metric', 'Value (AFN)']],
      body: [
        ['Sales', p.salesAfn],
        ['COGS', p.cogsAfn],
        ['Gross Profit', p.grossProfitAfn],
        ['Expenses', p.expensesAfn],
        ['Net Profit', p.netProfitAfn]
      ],
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [13, 148, 136] },
      theme: 'grid'
    })
  } else if (reportKey === 'expenses') {
    addHeader(doc, summary, 'Expense Report (Top Types)')
    autoTable(doc, {
      startY: 48,
      head: [['Type', 'Total (AFN)']],
      body: summary.reports.expenses.byType.map((r) => [r.type, r.totalAfn]),
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [225, 29, 72] },
      theme: 'grid'
    })
  } else if (reportKey === 'stock_report') {
    addHeader(doc, summary, 'Stock / Inventory Report')
    autoTable(doc, {
      startY: 48,
      head: [['Type', 'Available', 'Sold']],
      body: summary.reports.stock.byType.map((r) => [r.type, r.availableCount, r.soldCount]),
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [198, 167, 94] },
      theme: 'grid'
    })
  } else if (reportKey === 'low_stock') {
    addHeader(doc, summary, `Low Stock Report (≤ ${summary.reports.lowStock.threshold})`)
    autoTable(doc, {
      startY: 48,
      head: [['Type', 'Available']],
      body: summary.reports.lowStock.lowTypes.map((r) => [r.type, r.availableCount]),
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [245, 158, 11] },
      theme: 'grid'
    })
  } else if (reportKey === 'receivables') {
    addHeader(doc, summary, 'Receivables Report')
    autoTable(doc, {
      startY: 48,
      head: [['Customer', 'Transactions', 'Sales (AFN)']],
      body: summary.reports.receivables.topCustomers.map((r) => [r.label, r.quantity, r.valueAfn]),
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [220, 38, 38] },
      theme: 'grid'
    })
  } else if (reportKey === 'payables') {
    addHeader(doc, summary, 'Payables Report')
    autoTable(doc, {
      startY: 48,
      head: [['Supplier', 'Purchases', 'Outstanding (AFN)']],
      body: summary.reports.payables.topSuppliers.map((r) => [r.label, r.quantity, r.valueAfn]),
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [79, 70, 229] },
      theme: 'grid'
    })
  } else if (reportKey === 'cash_bank') {
    addHeader(doc, summary, 'Cash / Bank Summary')
    autoTable(doc, {
      startY: 48,
      head: [['Account', 'Currency', 'Balance', 'Balance (AFN)']],
      body: summary.reports.cashBank.accounts.map((a) => [a.name, a.currency, a.balance, a.balanceAfn]),
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [198, 167, 94] },
      theme: 'grid'
    })
  } else if (reportKey === 'trial_balance') {
    addHeader(doc, summary, 'Trial Balance (Accounts)')
    autoTable(doc, {
      startY: 48,
      head: [['Account', 'Debit (AFN)', 'Credit (AFN)']],
      body: summary.reports.trialBalance.rows.map((r) => [r.accountName, r.debitAfn, r.creditAfn]),
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [198, 167, 94] },
      theme: 'grid'
    })
  } else if (reportKey === 'top_selling_items') {
    addHeader(doc, summary, 'Top Selling Items')
    autoTable(doc, {
      startY: 48,
      head: [['Item', 'Qty', 'Revenue (AFN)']],
      body: summary.charts.topSellingItems.map((r) => [r.label, r.quantity, r.valueAfn]),
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [225, 29, 72] },
      theme: 'grid'
    })
  } else {
    addHeader(doc, summary, `Report: ${reportKey}`)
    doc.setFontSize(10)
    doc.text('This report PDF export is not yet mapped.', 14, 60)
  }

  const fname = buildExportFilename(reportKey, 'pdf', new Date(summary.generatedAt))
  doc.save(fname)
}

