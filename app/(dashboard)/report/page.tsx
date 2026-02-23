'use client'

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { BarChart3, Calendar, TrendingUp, Package, ChevronDown, ChevronUp } from 'lucide-react'
import PersianDatePicker from '@/components/ui/PersianDatePicker'

interface SaleReportData {
  totalProducts: number
  totalGram: number
  totalAmount: number
  remainAmount: number
  totalDiscount: number
  products: { name: string; barcode: string; gram: number; price: any }[]
}

export default function ReportPage() {
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - 30)
    return d.toISOString().slice(0, 10)
  })
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().slice(0, 10))
  const [data, setData] = useState<SaleReportData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showProducts, setShowProducts] = useState(false)

  const fetchReport = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: res } = await axios.get<SaleReportData & { success?: boolean; message?: string }>(
        '/api/transaction/sale-report',
        { params: { dateFrom, dateTo } }
      )
      if (res?.success !== false) {
        setData({
          totalProducts: res?.totalProducts ?? 0,
          totalGram: res?.totalGram ?? 0,
          totalAmount: res?.totalAmount ?? 0,
          remainAmount: res?.remainAmount ?? 0,
          totalDiscount: res?.totalDiscount ?? 0,
          products: res?.products ?? []
        })
      } else {
        setError(res?.message ?? 'خطا')
        setData(null)
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null
      setError(msg ?? (err instanceof Error ? err.message : 'خطا در بارگذاری'))
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [dateFrom, dateTo])

  useEffect(() => {
    fetchReport()
  }, [fetchReport])

  const formatNum = (n: number) => (n != null ? n.toLocaleString('fa-IR') : '0')
  const formatDate = (d: string) => {
    if (!d) return '—'
    try {
      return new Date(d).toLocaleDateString('fa-IR')
    } catch {
      return d
    }
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal dark:text-white">گزارشات</h1>
          <p className="mt-1 text-sm text-charcoal-soft dark:text-slate-400">گزارش فروش بر اساس بازه تاریخی</p>
        </div>
        <Link
          href="/daily-report"
          className="btn-luxury btn-luxury-outline px-6 py-2 flex items-center gap-2 shrink-0"
        >
          <Calendar className="h-4 w-4" />
          گزارش یومیه
        </Link>
      </header>

      <section className="card-luxury p-6 border border-gold-200/50 dark:border-slate-600/50">
        <h2 className="font-heading text-lg font-semibold text-charcoal dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-gold-600" />
          فیلتر بازه زمانی
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
          <button
            type="button"
            onClick={fetchReport}
            disabled={loading}
            className="btn-luxury btn-luxury-primary px-6 py-2 disabled:opacity-60"
          >
            {loading ? 'در حال بارگذاری...' : 'بارگذاری گزارش'}
          </button>
        </div>
      </section>

      {error && (
        <div className="card-luxury p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl">
          {error}
        </div>
      )}

      {!error && data && (
        <>
          <section className="card-luxury p-6 border border-gold-200/50 dark:border-slate-600/50">
            <h2 className="font-heading text-lg font-semibold text-charcoal dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gold-600" />
              خلاصه فروش
            </h2>
            <p className="text-sm text-charcoal-soft dark:text-slate-400 mb-4">
              از {formatDate(dateFrom)} تا {formatDate(dateTo)}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="p-4 bg-gold-50 dark:bg-gold-900/20 rounded-xl">
                <p className="text-sm text-charcoal-soft dark:text-slate-400">تعداد محصولات</p>
                <p className="text-xl font-bold text-charcoal dark:text-white">{formatNum(data.totalProducts)}</p>
              </div>
              <div className="p-4 bg-gold-50 dark:bg-gold-900/20 rounded-xl">
                <p className="text-sm text-charcoal-soft dark:text-slate-400">وزن کل (گرم)</p>
                <p className="text-xl font-bold text-charcoal dark:text-white">{formatNum(data.totalGram)}</p>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                <p className="text-sm text-charcoal-soft dark:text-slate-400">مبلغ کل</p>
                <p className="text-xl font-bold text-charcoal dark:text-white">{formatNum(data.totalAmount)} افغانی</p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <p className="text-sm text-charcoal-soft dark:text-slate-400">باقی‌مانده</p>
                <p className="text-xl font-bold text-charcoal dark:text-white">{formatNum(data.remainAmount)} افغانی</p>
              </div>
              <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
                <p className="text-sm text-charcoal-soft dark:text-slate-400">تخفیف</p>
                <p className="text-xl font-bold text-charcoal dark:text-white">{formatNum(data.totalDiscount)} افغانی</p>
              </div>
            </div>
          </section>

          {data.products && data.products.length > 0 && (
            <section className="card-luxury p-6 border border-gold-200/50 dark:border-slate-600/50">
              <button
                type="button"
                onClick={() => setShowProducts((s) => !s)}
                className="w-full flex items-center justify-between gap-2 font-heading text-lg font-semibold text-charcoal dark:text-white mb-4"
              >
                <span className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-gold-600" />
                  لیست محصولات فروخته شده ({data.products.length})
                </span>
                {showProducts ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
              {showProducts && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gold-200 dark:border-slate-600">
                        <th className="text-right py-2 px-2">نام</th>
                        <th className="text-right py-2 px-2">بارکد</th>
                        <th className="text-right py-2 px-2">گرم</th>
                        <th className="text-right py-2 px-2">قیمت</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.products.map((p, idx) => (
                        <tr key={idx} className="border-b border-gold-100 dark:border-slate-700/50">
                          <td className="py-2 px-2">{p.name ?? '—'}</td>
                          <td className="py-2 px-2 phone-ltr" dir="ltr">{p.barcode ?? '—'}</td>
                          <td className="py-2 px-2">{formatNum(p.gram)}</td>
                          <td className="py-2 px-2">
                            {p.price?.price != null
                              ? formatNum(p.price.price) + (p.price?.currency ? ` ${p.price.currency}` : '')
                              : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {data.totalProducts === 0 && (
            <div className="card-luxury p-8 text-center text-charcoal-soft dark:text-slate-400">
              در این بازه زمانی فروشی ثبت نشده است
            </div>
          )}
        </>
      )}
    </div>
  )
}
