'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import {
  BarChart3,
  Calendar,
  TrendingUp,
  ShoppingBag,
  Receipt,
  Package,
  AlertTriangle,
  Wallet,
  Landmark,
  Scale,
  FileSpreadsheet,
  FileText,
  Printer
} from 'lucide-react'
import PersianDatePicker from '@/components/ui/PersianDatePicker'
import CustomerCombobox, { type CustomerOption } from '@/components/ui/CustomerCombobox'
import SupplierCombobox, { type SupplierOption } from '@/components/ui/SupplierCombobox'
import StatCard from '@/components/dashboard/StatCard'
import Loader from '@/components/ui/Loader'
import ReportWidget from '@/components/reports-summary/ReportWidget'
import TrendMiniChart from '@/components/reports-summary/TrendMiniChart'
import type { ReportsSummaryResponse } from '@/lib/reports/summary/types'
import { exportSummaryToExcel, exportSingleReportToExcel } from '@/lib/reports/export/excel'
import { exportSummaryToPdf, exportSingleReportToPdf } from '@/lib/reports/export/pdf'

type Preset = 'today' | 'week' | 'month' | 'year'

function iso(d: Date) {
  return d.toISOString().slice(0, 10)
}

function presetRange(p: Preset): { from: string; to: string } {
  const now = new Date()
  const to = new Date(now)
  const from = new Date(now)
  if (p === 'today') {
    // same day
  } else if (p === 'week') {
    from.setDate(from.getDate() - 6)
  } else if (p === 'month') {
    from.setMonth(from.getMonth() - 1)
  } else if (p === 'year') {
    from.setFullYear(from.getFullYear() - 1)
  }
  return { from: iso(from), to: iso(to) }
}

function formatAfn(n: number) {
  return (Number.isFinite(n) ? n : 0).toLocaleString('fa-IR')
}

export default function ReportsSummaryPage() {
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - 30)
    return iso(d)
  })
  const [dateTo, setDateTo] = useState(() => iso(new Date()))
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerOption | null>(null)
  const [customerId, setCustomerId] = useState(0)
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierOption | null>(null)
  const [supplierId, setSupplierId] = useState(0)
  const [categoryId, setCategoryId] = useState<number>(0)
  const [productType, setProductType] = useState<string>('')
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])

  const [data, setData] = useState<ReportsSummaryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const printRef = useRef<HTMLDivElement>(null)

  const fetchSummary = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: res } = await axios.get<ReportsSummaryResponse>('/api/reports/summary', {
        params: {
          dateFrom,
          dateTo,
          customerId: customerId || undefined,
          supplierId: supplierId || undefined,
          categoryId: categoryId || undefined,
          productType: productType?.trim() || undefined
        }
      })
      if (res?.success) setData(res)
      else {
        setData(null)
        setError('Failed to load summary')
      }
    } catch (e: unknown) {
      const msg =
        e && typeof e === 'object' && 'response' in e
          ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
          : null
      setError(msg ?? (e instanceof Error ? e.message : 'Failed to load summary'))
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [dateFrom, dateTo, customerId, supplierId, categoryId, productType])

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  useEffect(() => {
    axios
      .get<{ success?: boolean; data?: { id: number; name: string }[] }>('/api/categories/list')
      .then(({ data }) => setCategories(Array.isArray(data?.data) ? data.data : []))
      .catch(() => setCategories([]))
  }, [])

  const setPreset = useCallback((p: Preset) => {
    const r = presetRange(p)
    setDateFrom(r.from)
    setDateTo(r.to)
  }, [])

  const headerSubtitle = useMemo(() => {
    const shop = data?.company?.companyName ? `— ${data.company.companyName}` : ''
    return `All key business reports in one place ${shop}`
  }, [data?.company?.companyName])

  const topKpis = data?.kpis

  const onPrint = useCallback(() => {
    // Print current page; buttons are hidden via print:hidden utility
    window.print()
  }, [])

  const exportPageExcel = useCallback(() => {
    if (!data) return
    exportSummaryToExcel(data)
  }, [data])

  const exportPagePdf = useCallback(() => {
    if (!data) return
    exportSummaryToPdf(data)
  }, [data])

  const exportExcel = useCallback(
    (key: string) => {
      if (!data) return
      exportSingleReportToExcel(data, key)
    },
    [data]
  )

  const exportPdf = useCallback(
    (key: string) => {
      if (!data) return
      exportSingleReportToPdf(data, key)
    },
    [data]
  )

  return (
    <div className="space-y-8" dir="rtl">
      <header className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-heading text-2xl font-semibold text-charcoal dark:text-white">
            Reports Summary
          </h1>
          <p className="mt-1 text-sm text-charcoal-soft dark:text-slate-400 font-stat">
            {headerSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <button type="button" className="btn-luxury btn-luxury-outline px-4 py-2 inline-flex items-center gap-2" onClick={onPrint}>
            <Printer className="w-4 h-4" />
            Print Page
          </button>
          <button type="button" className="btn-luxury btn-luxury-primary px-4 py-2 inline-flex items-center gap-2" onClick={exportPageExcel}>
            <FileSpreadsheet className="w-4 h-4" />
            Export Summary (Excel)
          </button>
          <button type="button" className="btn-luxury btn-luxury-primary px-4 py-2 inline-flex items-center gap-2" onClick={exportPagePdf}>
            <FileText className="w-4 h-4" />
            Export Summary (PDF)
          </button>
        </div>
      </header>

      <section className="card-luxury p-6 border border-amber-200/50 dark:border-slate-600/50 print:hidden">
        <h2 className="font-heading text-lg font-semibold text-charcoal dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-amber-600" />
          Filters
        </h2>

        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-charcoal dark:text-slate-300 mb-1">From</label>
            <PersianDatePicker value={dateFrom || null} onChange={(v) => setDateFrom(v ?? '')} className="input-luxury" />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal dark:text-slate-300 mb-1">To</label>
            <PersianDatePicker value={dateTo || null} onChange={(v) => setDateTo(v ?? '')} className="input-luxury" />
          </div>

          <div className="flex items-center gap-2">
            <button type="button" className="btn-luxury btn-luxury-outline px-3 py-2 text-sm" onClick={() => setPreset('today')}>
              Today
            </button>
            <button type="button" className="btn-luxury btn-luxury-outline px-3 py-2 text-sm" onClick={() => setPreset('week')}>
              This Week
            </button>
            <button type="button" className="btn-luxury btn-luxury-outline px-3 py-2 text-sm" onClick={() => setPreset('month')}>
              This Month
            </button>
            <button type="button" className="btn-luxury btn-luxury-outline px-3 py-2 text-sm" onClick={() => setPreset('year')}>
              This Year
            </button>
          </div>

          <CustomerCombobox
            value={customerId}
            selectedCustomer={selectedCustomer}
            onChange={(id, c) => {
              setCustomerId(id)
              setSelectedCustomer(c)
            }}
            className="min-w-[240px]"
            label="Customer"
          />

          <SupplierCombobox
            value={supplierId}
            selectedSupplier={selectedSupplier}
            onChange={(id, s) => {
              setSupplierId(id)
              setSelectedSupplier(s)
            }}
            className="min-w-[240px]"
            label="Vendor/Supplier"
          />

          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-charcoal dark:text-slate-300 mb-1">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(parseInt(e.target.value, 10) || 0)}
              className="input-luxury"
            >
              <option value={0}>All</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-charcoal dark:text-slate-300 mb-1">Product type</label>
            <input
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="input-luxury"
              placeholder="e.g. انگشتر"
            />
          </div>

          <button
            type="button"
            onClick={fetchSummary}
            disabled={loading}
            className="btn-luxury btn-luxury-primary px-6 py-2 disabled:opacity-60 inline-flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            {loading ? 'Loading…' : 'Apply'}
          </button>
        </div>
      </section>

      {error ? (
        <div className="card-luxury p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl">
          {error}
        </div>
      ) : null}

      {loading ? (
        <Loader message="Loading reports summary…" className="min-h-[380px]" />
      ) : !data ? (
        <div className="card-luxury p-8 text-center text-charcoal-soft dark:text-slate-400">
          No data
        </div>
      ) : (
        <div ref={printRef} className="space-y-8">
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Sales" value={formatAfn(topKpis?.totalSalesAfn ?? 0)} sub="AFN" icon={TrendingUp} variant="gold" href="/report" />
            <StatCard label="Net Profit" value={formatAfn(topKpis?.netProfitAfn ?? 0)} sub="AFN" icon={Receipt} variant="emerald" href="/report/summary" />
            <StatCard label="Receivables" value={formatAfn(topKpis?.receivablesAfn ?? 0)} sub="AFN" icon={Wallet} variant="ruby" href="/report/summary" />
            <StatCard label="Stock Value" value={formatAfn(topKpis?.stockValueAfn ?? 0)} sub="AFN" icon={Package} variant="neutral" href="/products" />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="card-luxury p-6 border border-amber-200/50 dark:border-slate-600/50">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-charcoal-soft dark:text-slate-400">Sales trend</p>
                  <p className="mt-1 text-lg font-semibold text-charcoal dark:text-white">{formatAfn(data.kpis.totalSalesAfn)} AFN</p>
                </div>
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <div className="mt-3">
                <TrendMiniChart title="Sales" points={data.charts.salesTrend} />
              </div>
            </div>

            <div className="card-luxury p-6 border border-amber-200/50 dark:border-slate-600/50">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-charcoal-soft dark:text-slate-400">Purchase trend</p>
                  <p className="mt-1 text-lg font-semibold text-charcoal dark:text-white">{formatAfn(data.kpis.totalPurchasesAfn)} AFN</p>
                </div>
                <ShoppingBag className="w-5 h-5 text-amber-600" />
              </div>
              <div className="mt-3">
                <TrendMiniChart title="Purchases" points={data.charts.purchaseTrend} color="rgb(13, 148, 136)" fill="rgba(13, 148, 136, 0.18)" />
              </div>
            </div>

            <div className="card-luxury p-6 border border-amber-200/50 dark:border-slate-600/50">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-charcoal-soft dark:text-slate-400">Profit trend</p>
                  <p className="mt-1 text-lg font-semibold text-charcoal dark:text-white">{formatAfn(data.kpis.netProfitAfn)} AFN</p>
                </div>
                <Receipt className="w-5 h-5 text-amber-600" />
              </div>
              <div className="mt-3">
                <TrendMiniChart title="Profit" points={data.charts.profitTrend} color="rgb(225, 29, 72)" fill="rgba(225, 29, 72, 0.16)" />
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <ReportWidget
              title="Daily Report"
              subtitle="Today’s transactions preview (sales)"
              icon={Calendar}
              href="/daily-report"
              actions={{ onExportExcel: () => exportExcel('daily_report'), onExportPdf: () => exportPdf('daily_report'), onPrint }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-amber-200/60 dark:border-slate-600">
                      <th className="text-right py-2 px-2">Bell</th>
                      <th className="text-right py-2 px-2">Customer</th>
                      <th className="text-right py-2 px-2">Total</th>
                      <th className="text-right py-2 px-2">Paid</th>
                      <th className="text-right py-2 px-2">Remain</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.reports.daily.preview.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-500 dark:text-slate-400">No transactions</td>
                      </tr>
                    ) : (
                      data.reports.daily.preview.map((r) => (
                        <tr key={r.id} className="border-b border-amber-100 dark:border-slate-700/50">
                          <td className="py-2 px-2 font-stat">#{r.bellNumber}</td>
                          <td className="py-2 px-2">{r.customerName}</td>
                          <td className="py-2 px-2 font-stat">{formatAfn(r.totalAmountAfn)}</td>
                          <td className="py-2 px-2 font-stat">{formatAfn(r.paidAmountAfn)}</td>
                          <td className="py-2 px-2 font-stat">{formatAfn(r.remainingAmountAfn)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </ReportWidget>

            <ReportWidget
              title="Sales Report"
              subtitle="Totals for selected range"
              icon={TrendingUp}
              href="/report"
              actions={{ onExportExcel: () => exportExcel('sales_report'), onExportPdf: () => exportPdf('sales_report'), onPrint }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-amber-50 dark:bg-amber-900/15 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Total sales</p>
                  <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.sales.totalAmountAfn)} AFN</p>
                </div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/15 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Receivables</p>
                  <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.sales.remainAmountAfn)} AFN</p>
                </div>
                <div className="p-4 bg-rose-50 dark:bg-rose-900/15 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Discount</p>
                  <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.sales.totalDiscountAfn)} AFN</p>
                </div>
                <div className="p-4 bg-white/70 dark:bg-slate-800/40 rounded-xl border border-amber-200/40 dark:border-slate-600/40">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Products sold</p>
                  <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.sales.totalProducts)}</p>
                </div>
                <div className="p-4 bg-white/70 dark:bg-slate-800/40 rounded-xl border border-amber-200/40 dark:border-slate-600/40">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Total gram</p>
                  <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.sales.totalGram)}</p>
                </div>
              </div>
            </ReportWidget>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <ReportWidget
              title="Purchases Report"
              subtitle="Purchases totals & outstanding"
              icon={ShoppingBag}
              href="/purchases"
              actions={{ onExportExcel: () => exportExcel('purchase_report'), onExportPdf: () => exportPdf('purchase_report'), onPrint }}
            >
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/15 rounded-xl">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Total purchases</p>
                    <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.purchases.totalAmountAfn)} AFN</p>
                  </div>
                  <div className="p-4 bg-rose-50 dark:bg-rose-900/15 rounded-xl">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Outstanding</p>
                    <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.purchases.totalRemainingAfn)} AFN</p>
                  </div>
                </div>
                <p className="text-sm text-charcoal-soft dark:text-slate-400">Count: {formatAfn(data.reports.purchases.purchasesCount)}</p>
              </div>
            </ReportWidget>

            <ReportWidget
              title="Expense Report"
              subtitle="Total expenses + top categories"
              icon={Receipt}
              href="/expenses"
              actions={{ onExportExcel: () => exportExcel('expenses'), onExportPdf: () => exportPdf('expenses'), onPrint }}
            >
              <div className="space-y-3">
                <div className="p-4 bg-rose-50 dark:bg-rose-900/15 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Total expenses</p>
                  <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.expenses.totalAmountAfn)} AFN</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-amber-200/60 dark:border-slate-600">
                        <th className="text-right py-2 px-2">Type</th>
                        <th className="text-right py-2 px-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.reports.expenses.byType.length === 0 ? (
                        <tr><td colSpan={2} className="py-6 text-center text-slate-500 dark:text-slate-400">No expenses</td></tr>
                      ) : (
                        data.reports.expenses.byType.map((r) => (
                          <tr key={r.type} className="border-b border-amber-100 dark:border-slate-700/50">
                            <td className="py-2 px-2">{r.type}</td>
                            <td className="py-2 px-2 font-stat">{formatAfn(r.totalAfn)} AFN</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </ReportWidget>

            <ReportWidget
              title="Profit & Loss"
              subtitle="Sales − COGS − Expenses"
              icon={Receipt}
              href="/report/summary"
              actions={{ onExportExcel: () => exportExcel('profit_loss'), onExportPdf: () => exportPdf('profit_loss'), onPrint }}
            >
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/15 rounded-xl">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Sales</p>
                    <p className="mt-1 text-base font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.profitLoss.salesAfn)} AFN</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    <p className="text-xs text-slate-500 dark:text-slate-400">COGS</p>
                    <p className="mt-1 text-base font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.profitLoss.cogsAfn)} AFN</p>
                  </div>
                  <div className="p-4 bg-rose-50 dark:bg-rose-900/15 rounded-xl">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Expenses</p>
                    <p className="mt-1 text-base font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.profitLoss.expensesAfn)} AFN</p>
                  </div>
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/15 rounded-xl">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Net profit</p>
                    <p className="mt-1 text-base font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.profitLoss.netProfitAfn)} AFN</p>
                  </div>
                </div>
              </div>
            </ReportWidget>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <ReportWidget
              title="Stock / Inventory Report"
              subtitle="Available vs sold + stock value"
              icon={Package}
              href="/products"
              actions={{ onExportExcel: () => exportExcel('stock_report'), onExportPdf: () => exportPdf('stock_report'), onPrint }}
            >
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/15 rounded-xl">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Available</p>
                    <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.stock.availableCount)}</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Sold</p>
                    <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.stock.soldCount)}</p>
                  </div>
                </div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/15 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Stock value</p>
                  <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.stock.stockValueAfn)} AFN</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-amber-200/60 dark:border-slate-600">
                        <th className="text-right py-2 px-2">Type</th>
                        <th className="text-right py-2 px-2">Available</th>
                        <th className="text-right py-2 px-2">Sold</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.reports.stock.byType.map((r) => (
                        <tr key={r.type} className="border-b border-amber-100 dark:border-slate-700/50">
                          <td className="py-2 px-2">{r.type}</td>
                          <td className="py-2 px-2 font-stat">{formatAfn(r.availableCount)}</td>
                          <td className="py-2 px-2 font-stat">{formatAfn(r.soldCount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </ReportWidget>

            <ReportWidget
              title="Low Stock Report"
              subtitle={`Types with available ≤ ${data.reports.lowStock.threshold}`}
              icon={AlertTriangle}
              href="/products"
              actions={{ onExportExcel: () => exportExcel('low_stock'), onExportPdf: () => exportPdf('low_stock'), onPrint }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-amber-200/60 dark:border-slate-600">
                      <th className="text-right py-2 px-2">Type</th>
                      <th className="text-right py-2 px-2">Available</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.reports.lowStock.lowTypes.length === 0 ? (
                      <tr><td colSpan={2} className="py-6 text-center text-slate-500 dark:text-slate-400">No low-stock types</td></tr>
                    ) : (
                      data.reports.lowStock.lowTypes.map((r) => (
                        <tr key={r.type} className="border-b border-amber-100 dark:border-slate-700/50">
                          <td className="py-2 px-2">{r.type}</td>
                          <td className="py-2 px-2 font-stat">{formatAfn(r.availableCount)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </ReportWidget>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <ReportWidget
              title="Receivables Report"
              subtitle="Total receivable from customers"
              icon={Wallet}
              href="/report/summary"
              actions={{ onExportExcel: () => exportExcel('receivables'), onExportPdf: () => exportPdf('receivables'), onPrint }}
            >
              <div className="space-y-3">
                <div className="p-4 bg-rose-50 dark:bg-rose-900/15 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Receivables total</p>
                  <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.receivables.totalAfn)} AFN</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-amber-200/60 dark:border-slate-600">
                        <th className="text-right py-2 px-2">Customer</th>
                        <th className="text-right py-2 px-2">Sales</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.reports.receivables.topCustomers.length === 0 ? (
                        <tr><td colSpan={2} className="py-6 text-center text-slate-500 dark:text-slate-400">No data</td></tr>
                      ) : (
                        data.reports.receivables.topCustomers.map((r) => (
                          <tr key={r.label} className="border-b border-amber-100 dark:border-slate-700/50">
                            <td className="py-2 px-2">{r.label}</td>
                            <td className="py-2 px-2 font-stat">{formatAfn(r.valueAfn)} AFN</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </ReportWidget>

            <ReportWidget
              title="Payables Report"
              subtitle="Total payable to vendors/suppliers"
              icon={Landmark}
              href="/purchases"
              actions={{ onExportExcel: () => exportExcel('payables'), onExportPdf: () => exportPdf('payables'), onPrint }}
            >
              <div className="space-y-3">
                <div className="p-4 bg-rose-50 dark:bg-rose-900/15 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Payables total</p>
                  <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.payables.totalAfn)} AFN</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-amber-200/60 dark:border-slate-600">
                        <th className="text-right py-2 px-2">Supplier</th>
                        <th className="text-right py-2 px-2">Outstanding</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.reports.payables.topSuppliers.length === 0 ? (
                        <tr><td colSpan={2} className="py-6 text-center text-slate-500 dark:text-slate-400">No data</td></tr>
                      ) : (
                        data.reports.payables.topSuppliers.map((r) => (
                          <tr key={r.label} className="border-b border-amber-100 dark:border-slate-700/50">
                            <td className="py-2 px-2">{r.label}</td>
                            <td className="py-2 px-2 font-stat">{formatAfn(r.valueAfn)} AFN</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </ReportWidget>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <ReportWidget
              title="Cash / Bank Summary"
              subtitle="Accounts balances (approx cash vs bank)"
              icon={Wallet}
              href="/accounts"
              actions={{ onExportExcel: () => exportExcel('cash_bank'), onExportPdf: () => exportPdf('cash_bank'), onPrint }}
            >
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/15 rounded-xl">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Cash in hand</p>
                    <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.cashBank.cashInHandAfn)} AFN</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Bank balance</p>
                    <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.cashBank.bankBalanceAfn)} AFN</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-amber-200/60 dark:border-slate-600">
                        <th className="text-right py-2 px-2">Account</th>
                        <th className="text-right py-2 px-2">Balance (AFN)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.reports.cashBank.accounts.slice(0, 8).map((a) => (
                        <tr key={a.id} className="border-b border-amber-100 dark:border-slate-700/50">
                          <td className="py-2 px-2">{a.name}</td>
                          <td className="py-2 px-2 font-stat">{formatAfn(a.balanceAfn)} AFN</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </ReportWidget>

            <ReportWidget
              title="Trial Balance (Accounts)"
              subtitle="Simple trial view from cash/bank accounts (no chart of accounts)"
              icon={Scale}
              href="/accounts"
              actions={{ onExportExcel: () => exportExcel('trial_balance'), onExportPdf: () => exportPdf('trial_balance'), onPrint }}
            >
              <div className="space-y-3">
                <div className="p-4 bg-white/70 dark:bg-slate-800/40 rounded-xl border border-amber-200/40 dark:border-slate-600/40">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Total debit</p>
                  <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.trialBalance.totalDebitAfn)} AFN</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-amber-200/60 dark:border-slate-600">
                        <th className="text-right py-2 px-2">Account</th>
                        <th className="text-right py-2 px-2">Debit</th>
                        <th className="text-right py-2 px-2">Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.reports.trialBalance.rows.slice(0, 10).map((r) => (
                        <tr key={r.accountName} className="border-b border-amber-100 dark:border-slate-700/50">
                          <td className="py-2 px-2">{r.accountName}</td>
                          <td className="py-2 px-2 font-stat">{formatAfn(r.debitAfn)}</td>
                          <td className="py-2 px-2 font-stat">{formatAfn(r.creditAfn)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </ReportWidget>
          </section>

          <section className="card-luxury p-6 border border-amber-200/50 dark:border-slate-600/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="font-heading text-lg font-semibold text-charcoal dark:text-white">
                  Top Selling Items
                </h3>
                <p className="mt-1 text-sm text-charcoal-soft dark:text-slate-400">
                  Highest revenue items in selected range
                </p>
              </div>
              <Link href="/report/analytics" className="btn-luxury btn-luxury-outline px-4 py-2 inline-flex items-center gap-2 print:hidden">
                <BarChart3 className="w-4 h-4" />
                Open Analytics
              </Link>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-amber-200/60 dark:border-slate-600">
                    <th className="text-right py-2 px-2">Item</th>
                    <th className="text-right py-2 px-2">Qty</th>
                    <th className="text-right py-2 px-2">Revenue (AFN)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.charts.topSellingItems.length === 0 ? (
                    <tr><td colSpan={3} className="py-6 text-center text-slate-500 dark:text-slate-400">No data</td></tr>
                  ) : (
                    data.charts.topSellingItems.map((r) => (
                      <tr key={r.label} className="border-b border-amber-100 dark:border-slate-700/50">
                        <td className="py-2 px-2">{r.label}</td>
                        <td className="py-2 px-2 font-stat">{formatAfn(r.quantity)}</td>
                        <td className="py-2 px-2 font-stat">{formatAfn(r.valueAfn)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

