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
        setError('بارگذاری خلاصه گزارشات ناموفق بود')
      }
    } catch (e: unknown) {
      const msg =
        e && typeof e === 'object' && 'response' in e
          ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
          : null
      setError(msg ?? (e instanceof Error ? e.message : 'بارگذاری خلاصه گزارشات ناموفق بود'))
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
    return `همه گزارشات مهم کسب‌وکار در یک جا ${shop}`
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
            خلاصه گزارشات
          </h1>
          <p className="mt-1 text-sm text-charcoal-soft dark:text-slate-400 font-stat">
            {headerSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={onPrint}
            className="btn-luxury btn-luxury-outline p-2.5 sm:p-2 inline-flex items-center justify-center"
            aria-label="چاپ صفحه"
            title="چاپ صفحه"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={exportPageExcel}
            className="btn-luxury btn-luxury-primary p-2.5 sm:p-2 inline-flex items-center justify-center"
            aria-label="خروجی خلاصه (اکسل)"
            title="خروجی خلاصه (اکسل)"
          >
            <FileSpreadsheet className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={exportPagePdf}
            className="btn-luxury btn-luxury-primary p-2.5 sm:p-2 inline-flex items-center justify-center"
            aria-label="خروجی خلاصه (PDF)"
            title="خروجی خلاصه (PDF)"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </header>

      <section className="card-luxury p-6 border border-amber-200/50 dark:border-slate-600/50 print:hidden">
        <h2 className="font-heading text-lg font-semibold text-charcoal dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-amber-600" />
          فیلترها
        </h2>

        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-charcoal dark:text-slate-300 mb-1">از تاریخ</label>
            <PersianDatePicker value={dateFrom || null} onChange={(v) => setDateFrom(v ?? '')} className="input-luxury" />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal dark:text-slate-300 mb-1">تا تاریخ</label>
            <PersianDatePicker value={dateTo || null} onChange={(v) => setDateTo(v ?? '')} className="input-luxury" />
          </div>

          <div className="flex items-center gap-2">
            <button type="button" className="btn-luxury btn-luxury-outline px-3 py-2 text-sm" onClick={() => setPreset('today')}>
              امروز
            </button>
            <button type="button" className="btn-luxury btn-luxury-outline px-3 py-2 text-sm" onClick={() => setPreset('week')}>
              این هفته
            </button>
            <button type="button" className="btn-luxury btn-luxury-outline px-3 py-2 text-sm" onClick={() => setPreset('month')}>
              این ماه
            </button>
            <button type="button" className="btn-luxury btn-luxury-outline px-3 py-2 text-sm" onClick={() => setPreset('year')}>
              امسال
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
            label="مشتری"
          />

          <SupplierCombobox
            value={supplierId}
            selectedSupplier={selectedSupplier}
            onChange={(id, s) => {
              setSupplierId(id)
              setSelectedSupplier(s)
            }}
            className="min-w-[240px]"
            label="تمویل‌کننده / فروشنده"
          />

          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-charcoal dark:text-slate-300 mb-1">دسته‌بندی</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(parseInt(e.target.value, 10) || 0)}
              className="input-luxury"
            >
              <option value={0}>همه</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-charcoal dark:text-slate-300 mb-1">نوع محصول</label>
            <input
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="input-luxury"
              placeholder="مثال: انگشتر"
            />
          </div>

          <button
            type="button"
            onClick={fetchSummary}
            disabled={loading}
            className="btn-luxury btn-luxury-primary px-6 py-2 disabled:opacity-60 inline-flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            {loading ? 'در حال بارگذاری…' : 'اعمال'}
          </button>
        </div>
      </section>

      {error ? (
        <div className="card-luxury p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl">
          {error}
        </div>
      ) : null}

      {loading ? (
        <Loader message="در حال بارگذاری خلاصه گزارشات…" className="min-h-[380px]" />
      ) : !data ? (
        <div className="card-luxury p-8 text-center text-charcoal-soft dark:text-slate-400">
          داده‌ای یافت نشد
        </div>
      ) : (
        <div ref={printRef} className="space-y-8">
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="مجموع فروش" value={formatAfn(topKpis?.totalSalesAfn ?? 0)} sub="افغانی" icon={TrendingUp} variant="gold" href="/report" />
            <StatCard label="سود خالص" value={formatAfn(topKpis?.netProfitAfn ?? 0)} sub="افغانی" icon={Receipt} variant="emerald" href="/report/summary" />
            <StatCard label="دریافتنی‌ها" value={formatAfn(topKpis?.receivablesAfn ?? 0)} sub="افغانی" icon={Wallet} variant="ruby" href="/report/summary" />
            <StatCard label="ارزش موجودی" value={formatAfn(topKpis?.stockValueAfn ?? 0)} sub="افغانی" icon={Package} variant="neutral" href="/products" />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="card-luxury p-6 border border-amber-200/50 dark:border-slate-600/50">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-charcoal-soft dark:text-slate-400">روند فروش</p>
                  <p className="mt-1 text-lg font-semibold text-charcoal dark:text-white">{formatAfn(data.kpis.totalSalesAfn)} افغانی</p>
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
                  <p className="text-sm text-charcoal-soft dark:text-slate-400">روند خرید</p>
                  <p className="mt-1 text-lg font-semibold text-charcoal dark:text-white">{formatAfn(data.kpis.totalPurchasesAfn)} افغانی</p>
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
                  <p className="text-sm text-charcoal-soft dark:text-slate-400">روند سود</p>
                  <p className="mt-1 text-lg font-semibold text-charcoal dark:text-white">{formatAfn(data.kpis.netProfitAfn)} افغانی</p>
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
              title="گزارش یومیه"
              subtitle="پیش‌نمایش تراکنش‌های امروز (فروش)"
              icon={Calendar}
              href="/daily-report"
              actions={{ onExportExcel: () => exportExcel('daily_report'), onExportPdf: () => exportPdf('daily_report'), onPrint }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-amber-200/60 dark:border-slate-600">
                      <th className="text-right py-2 px-2">بل</th>
                      <th className="text-right py-2 px-2">مشتری</th>
                      <th className="text-right py-2 px-2">کل</th>
                      <th className="text-right py-2 px-2">پرداختی</th>
                      <th className="text-right py-2 px-2">باقی</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.reports.daily.preview.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-500 dark:text-slate-400">تراکنشی نیست</td>
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
              title="گزارش فروش"
              subtitle="مجموع برای بازه انتخاب‌شده"
              icon={TrendingUp}
              href="/report"
              actions={{ onExportExcel: () => exportExcel('sales_report'), onExportPdf: () => exportPdf('sales_report'), onPrint }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-amber-50 dark:bg-amber-900/15 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-slate-400">مجموع فروش</p>
                  <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.sales.totalAmountAfn)} افغانی</p>
                </div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/15 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-slate-400">دریافتنی‌ها</p>
                  <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.sales.remainAmountAfn)} افغانی</p>
                </div>
                <div className="p-4 bg-rose-50 dark:bg-rose-900/15 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-slate-400">تخفیف</p>
                  <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.sales.totalDiscountAfn)} افغانی</p>
                </div>
                <div className="p-4 bg-white/70 dark:bg-slate-800/40 rounded-xl border border-amber-200/40 dark:border-slate-600/40">
                  <p className="text-xs text-slate-500 dark:text-slate-400">محصولات فروخته‌شده</p>
                  <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.sales.totalProducts)}</p>
                </div>
                <div className="p-4 bg-white/70 dark:bg-slate-800/40 rounded-xl border border-amber-200/40 dark:border-slate-600/40">
                  <p className="text-xs text-slate-500 dark:text-slate-400">وزن کل (گرم)</p>
                  <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.sales.totalGram)}</p>
                </div>
              </div>
            </ReportWidget>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <ReportWidget
              title="گزارش خرید"
              subtitle="مجموع خریدها و مانده پرداخت‌نشده"
              icon={ShoppingBag}
              href="/purchases"
              actions={{ onExportExcel: () => exportExcel('purchase_report'), onExportPdf: () => exportPdf('purchase_report'), onPrint }}
            >
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/15 rounded-xl">
                    <p className="text-xs text-slate-500 dark:text-slate-400">مجموع خرید</p>
                    <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.purchases.totalAmountAfn)} افغانی</p>
                  </div>
                  <div className="p-4 bg-rose-50 dark:bg-rose-900/15 rounded-xl">
                    <p className="text-xs text-slate-500 dark:text-slate-400">مانده</p>
                    <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.purchases.totalRemainingAfn)} افغانی</p>
                  </div>
                </div>
                <p className="text-sm text-charcoal-soft dark:text-slate-400">تعداد: {formatAfn(data.reports.purchases.purchasesCount)}</p>
              </div>
            </ReportWidget>

            <ReportWidget
              title="گزارش مصارف"
              subtitle="مجموع مصارف و دسته‌های برتر"
              icon={Receipt}
              href="/expenses"
              actions={{ onExportExcel: () => exportExcel('expenses'), onExportPdf: () => exportPdf('expenses'), onPrint }}
            >
              <div className="space-y-3">
                <div className="p-4 bg-rose-50 dark:bg-rose-900/15 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-slate-400">مجموع مصارف</p>
                  <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.expenses.totalAmountAfn)} افغانی</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-amber-200/60 dark:border-slate-600">
                        <th className="text-right py-2 px-2">نوع</th>
                        <th className="text-right py-2 px-2">مجموع</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.reports.expenses.byType.length === 0 ? (
                        <tr><td colSpan={2} className="py-6 text-center text-slate-500 dark:text-slate-400">مصرفی نیست</td></tr>
                      ) : (
                        data.reports.expenses.byType.map((r) => (
                          <tr key={r.type} className="border-b border-amber-100 dark:border-slate-700/50">
                            <td className="py-2 px-2">{r.type}</td>
                            <td className="py-2 px-2 font-stat">{formatAfn(r.totalAfn)} افغانی</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </ReportWidget>

            <ReportWidget
              title="سود و زیان"
              subtitle="فروش − بهای تمام‌شده − مصارف"
              icon={Receipt}
              href="/report/summary"
              actions={{ onExportExcel: () => exportExcel('profit_loss'), onExportPdf: () => exportPdf('profit_loss'), onPrint }}
            >
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/15 rounded-xl">
                    <p className="text-xs text-slate-500 dark:text-slate-400">فروش</p>
                    <p className="mt-1 text-base font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.profitLoss.salesAfn)} افغانی</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    <p className="text-xs text-slate-500 dark:text-slate-400">بهای تمام‌شده</p>
                    <p className="mt-1 text-base font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.profitLoss.cogsAfn)} افغانی</p>
                  </div>
                  <div className="p-4 bg-rose-50 dark:bg-rose-900/15 rounded-xl">
                    <p className="text-xs text-slate-500 dark:text-slate-400">مصارف</p>
                    <p className="mt-1 text-base font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.profitLoss.expensesAfn)} افغانی</p>
                  </div>
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/15 rounded-xl">
                    <p className="text-xs text-slate-500 dark:text-slate-400">سود خالص</p>
                    <p className="mt-1 text-base font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.profitLoss.netProfitAfn)} افغانی</p>
                  </div>
                </div>
              </div>
            </ReportWidget>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <ReportWidget
              title="گزارش موجودی انبار"
              subtitle="موجود در انبار در مقابل فروخته‌شده + ارزش موجودی"
              icon={Package}
              href="/products"
              actions={{ onExportExcel: () => exportExcel('stock_report'), onExportPdf: () => exportPdf('stock_report'), onPrint }}
            >
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/15 rounded-xl">
                    <p className="text-xs text-slate-500 dark:text-slate-400">موجود</p>
                    <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.stock.availableCount)}</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    <p className="text-xs text-slate-500 dark:text-slate-400">فروخته‌شده</p>
                    <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.stock.soldCount)}</p>
                  </div>
                </div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/15 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-slate-400">ارزش موجودی</p>
                  <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.stock.stockValueAfn)} افغانی</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-amber-200/60 dark:border-slate-600">
                        <th className="text-right py-2 px-2">نوع</th>
                        <th className="text-right py-2 px-2">موجود</th>
                        <th className="text-right py-2 px-2">فروخته‌شده</th>
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
              title="گزارش کمبود موجودی"
              subtitle={`انواع با موجودی ≤ ${data.reports.lowStock.threshold}`}
              icon={AlertTriangle}
              href="/products"
              actions={{ onExportExcel: () => exportExcel('low_stock'), onExportPdf: () => exportPdf('low_stock'), onPrint }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
<thead>
                  <tr className="border-b border-amber-200/60 dark:border-slate-600">
                    <th className="text-right py-2 px-2">نوع</th>
                    <th className="text-right py-2 px-2">موجود</th>
                  </tr>
                </thead>
                <tbody>
                  {data.reports.lowStock.lowTypes.length === 0 ? (
                    <tr><td colSpan={2} className="py-6 text-center text-slate-500 dark:text-slate-400">نوع کم‌موجودی نیست</td></tr>
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
              title="گزارش دریافتنی‌ها"
              subtitle="مجموع قابل دریافت از مشتریان"
              icon={Wallet}
              href="/report/summary"
              actions={{ onExportExcel: () => exportExcel('receivables'), onExportPdf: () => exportPdf('receivables'), onPrint }}
            >
              <div className="space-y-3">
                <div className="p-4 bg-rose-50 dark:bg-rose-900/15 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-slate-400">مجموع دریافتنی‌ها</p>
                  <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.receivables.totalAfn)} افغانی</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-amber-200/60 dark:border-slate-600">
                        <th className="text-right py-2 px-2">مشتری</th>
                        <th className="text-right py-2 px-2">فروش</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.reports.receivables.topCustomers.length === 0 ? (
                        <tr><td colSpan={2} className="py-6 text-center text-slate-500 dark:text-slate-400">داده‌ای نیست</td></tr>
                      ) : (
                        data.reports.receivables.topCustomers.map((r) => (
                          <tr key={r.label} className="border-b border-amber-100 dark:border-slate-700/50">
                            <td className="py-2 px-2">{r.label}</td>
                            <td className="py-2 px-2 font-stat">{formatAfn(r.valueAfn)} افغانی</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </ReportWidget>

            <ReportWidget
              title="گزارش پرداختنی‌ها"
              subtitle="مجموع قابل پرداخت به تمویل‌کنندگان / فروشندگان"
              icon={Landmark}
              href="/purchases"
              actions={{ onExportExcel: () => exportExcel('payables'), onExportPdf: () => exportPdf('payables'), onPrint }}
            >
              <div className="space-y-3">
                <div className="p-4 bg-rose-50 dark:bg-rose-900/15 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-slate-400">مجموع پرداختنی‌ها</p>
                  <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.payables.totalAfn)} افغانی</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-amber-200/60 dark:border-slate-600">
                        <th className="text-right py-2 px-2">تمویل‌کننده</th>
                        <th className="text-right py-2 px-2">مانده</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.reports.payables.topSuppliers.length === 0 ? (
                        <tr><td colSpan={2} className="py-6 text-center text-slate-500 dark:text-slate-400">داده‌ای نیست</td></tr>
                      ) : (
                        data.reports.payables.topSuppliers.map((r) => (
                          <tr key={r.label} className="border-b border-amber-100 dark:border-slate-700/50">
                            <td className="py-2 px-2">{r.label}</td>
                            <td className="py-2 px-2 font-stat">{formatAfn(r.valueAfn)} افغانی</td>
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
              title="خلاصه نقد / بانک"
              subtitle="موجودی حساب‌ها (تقریبی نقد در مقابل بانک)"
              icon={Wallet}
              href="/accounts"
              actions={{ onExportExcel: () => exportExcel('cash_bank'), onExportPdf: () => exportPdf('cash_bank'), onPrint }}
            >
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/15 rounded-xl">
                    <p className="text-xs text-slate-500 dark:text-slate-400">نقد در دست</p>
                    <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.cashBank.cashInHandAfn)} افغانی</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    <p className="text-xs text-slate-500 dark:text-slate-400">موجودی بانک</p>
                    <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.cashBank.bankBalanceAfn)} افغانی</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-amber-200/60 dark:border-slate-600">
                        <th className="text-right py-2 px-2">حساب</th>
                        <th className="text-right py-2 px-2">موجودی (افغانی)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.reports.cashBank.accounts.slice(0, 8).map((a) => (
                        <tr key={a.id} className="border-b border-amber-100 dark:border-slate-700/50">
                          <td className="py-2 px-2">{a.name}</td>
                          <td className="py-2 px-2 font-stat">{formatAfn(a.balanceAfn)} افغانی</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </ReportWidget>

            <ReportWidget
              title="تراز آزمایشی (حساب‌ها)"
              subtitle="نمای ساده تراز از حساب‌های نقد/بانک"
              icon={Scale}
              href="/accounts"
              actions={{ onExportExcel: () => exportExcel('trial_balance'), onExportPdf: () => exportPdf('trial_balance'), onPrint }}
            >
              <div className="space-y-3">
                <div className="p-4 bg-white/70 dark:bg-slate-800/40 rounded-xl border border-amber-200/40 dark:border-slate-600/40">
                  <p className="text-xs text-slate-500 dark:text-slate-400">مجموع بدهکار</p>
                  <p className="mt-1 text-lg font-bold text-charcoal dark:text-white font-stat">{formatAfn(data.reports.trialBalance.totalDebitAfn)} افغانی</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-amber-200/60 dark:border-slate-600">
                        <th className="text-right py-2 px-2">حساب</th>
                        <th className="text-right py-2 px-2">بدهکار</th>
                        <th className="text-right py-2 px-2">بستانکار</th>
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
                  پرفروش‌ترین اقلام
                </h3>
                <p className="mt-1 text-sm text-charcoal-soft dark:text-slate-400">
                  اقلام با بیشترین درآمد در بازه انتخاب‌شده
                </p>
              </div>
              <Link href="/report/analytics" className="btn-luxury btn-luxury-outline px-4 py-2 inline-flex items-center gap-2 print:hidden">
                <BarChart3 className="w-4 h-4" />
                باز کردن تحلیل
              </Link>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-amber-200/60 dark:border-slate-600">
                    <th className="text-right py-2 px-2">قلم</th>
                    <th className="text-right py-2 px-2">تعداد</th>
                    <th className="text-right py-2 px-2">درآمد (افغانی)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.charts.topSellingItems.length === 0 ? (
                    <tr><td colSpan={3} className="py-6 text-center text-slate-500 dark:text-slate-400">داده‌ای نیست</td></tr>
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

