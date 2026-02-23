'use client'

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import PersianDatePicker from '@/components/ui/PersianDatePicker'

interface DailyProduct {
  productId: number
  name: string
  purchase: number
  sold: number
  barcode: string
  gram: number
  karat: number
}

interface DailyTransaction {
  _id: number
  customerName: string
  customerPhone: string
  discount: number
  totalAmount: number
  paidAmount: number
  remainingAmount: number
  bellNumber: number
  date: string
  product: DailyProduct[]
}

export default function DailyReportPage() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [daily, setDaily] = useState<DailyTransaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReport = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await axios.get<{ success?: boolean; daily?: DailyTransaction[]; message?: string }>(
        '/api/transaction/daily-report',
        { params: { date } }
      )
      if (data.success && Array.isArray(data.daily)) {
        setDaily(data.daily)
      } else {
        setDaily([])
        if (data.message) setError(data.message)
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null
      setError(msg ?? (err instanceof Error ? err.message : 'خطا در بارگذاری'))
      setDaily([])
    } finally {
      setLoading(false)
    }
  }, [date])

  useEffect(() => {
    fetchReport()
  }, [fetchReport])

  const formatDate = (d: string) => {
    if (!d) return '—'
    try {
      return new Date(d).toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return d
    }
  }

  const formatNum = (n: number) => (n != null ? n.toLocaleString('fa-IR') : '—')

  const totals = daily.reduce(
    (acc, t) => ({
      totalAmount: acc.totalAmount + (t.totalAmount ?? 0),
      paidAmount: acc.paidAmount + (t.paidAmount ?? 0),
      remainingAmount: acc.remainingAmount + (t.remainingAmount ?? 0),
      discount: acc.discount + (t.discount ?? 0),
      count: acc.count + 1
    }),
    { totalAmount: 0, paidAmount: 0, remainingAmount: 0, discount: 0, count: 0 }
  )

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal">گزارش یومیه</h1>
          <p className="mt-1 text-sm text-charcoal-soft">تراکنش‌های روزانه</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-charcoal">تاریخ:</label>
          <PersianDatePicker value={date || null} onChange={(v) => setDate(v ?? '')} className="input-luxury" />
          <button
            type="button"
            onClick={fetchReport}
            disabled={loading}
            className="btn-luxury btn-luxury-primary px-6 py-2 disabled:opacity-60"
          >
            {loading ? 'در حال بارگذاری...' : 'بارگذاری'}
          </button>
        </div>
      </header>

      {error && (
        <div className="card-luxury p-4 bg-red-50 border-red-200 text-red-700 rounded-xl">
          {error}
        </div>
      )}

      {!error && (
        <>
          <section className="card-luxury p-6">
            <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">خلاصه</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="p-4 bg-gold-50 rounded-xl">
                <p className="text-sm text-charcoal-soft">تعداد تراکنش</p>
                <p className="text-xl font-bold text-charcoal">{formatNum(totals.count)}</p>
              </div>
              <div className="p-4 bg-gold-50 rounded-xl">
                <p className="text-sm text-charcoal-soft">مبلغ کل</p>
                <p className="text-xl font-bold text-charcoal">{formatNum(totals.totalAmount)}</p>
              </div>
              <div className="p-4 bg-gold-50 rounded-xl">
                <p className="text-sm text-charcoal-soft">پرداختی</p>
                <p className="text-xl font-bold text-charcoal">{formatNum(totals.paidAmount)}</p>
              </div>
              <div className="p-4 bg-gold-50 rounded-xl">
                <p className="text-sm text-charcoal-soft">باقی‌مانده</p>
                <p className="text-xl font-bold text-charcoal">{formatNum(totals.remainingAmount)}</p>
              </div>
              <div className="p-4 bg-gold-50 rounded-xl">
                <p className="text-sm text-charcoal-soft">تخفیف</p>
                <p className="text-xl font-bold text-charcoal">{formatNum(totals.discount)}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">تراکنش‌ها</h2>
            {loading ? (
              <div className="card-luxury p-8 text-center text-charcoal-soft">در حال بارگذاری...</div>
            ) : daily.length === 0 ? (
              <div className="card-luxury p-8 text-center text-charcoal-soft">تراکنشی برای این تاریخ یافت نشد</div>
            ) : (
              <div className="space-y-4">
                {daily.map((t) => (
                  <div key={t._id} className="card-luxury p-6 border border-gold-200/50">
                    <div className="flex flex-wrap justify-between gap-4 mb-4">
                      <div>
                        <p className="font-semibold text-charcoal">{t.customerName}</p>
                        <p className="text-sm text-charcoal-soft phone-ltr" dir="ltr">{t.customerPhone}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-charcoal-soft">بل #{t.bellNumber}</p>
                        <p className="text-sm text-charcoal-soft">{formatDate(t.date)}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm">کل: <span className="font-medium">{formatNum(t.totalAmount)}</span> افغانی</p>
                        <p className="text-sm">پرداختی: <span className="font-medium">{formatNum(t.paidAmount)}</span></p>
                        <p className="text-sm">باقی: <span className="font-medium">{formatNum(t.remainingAmount)}</span></p>
                        {t.discount ? <p className="text-sm text-amber-600">تخفیف: {formatNum(t.discount)}</p> : null}
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gold-200">
                            <th className="text-right py-2 px-2">نام محصول</th>
                            <th className="text-right py-2 px-2">بارکد</th>
                            <th className="text-right py-2 px-2">گرم</th>
                            <th className="text-right py-2 px-2">عیار</th>
                            <th className="text-right py-2 px-2">خرید</th>
                            <th className="text-right py-2 px-2">فروش</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(t.product || []).map((p, idx) => (
                            <tr key={idx} className="border-b border-gold-100 last:border-0">
                              <td className="py-2 px-2">{p.name ?? '—'}</td>
                              <td className="py-2 px-2 phone-ltr" dir="ltr">{p.barcode ?? '—'}</td>
                              <td className="py-2 px-2">{formatNum(p.gram)}</td>
                              <td className="py-2 px-2">{formatNum(p.karat)}</td>
                              <td className="py-2 px-2">{formatNum(p.purchase)}</td>
                              <td className="py-2 px-2">{formatNum(p.sold)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}
