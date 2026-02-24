'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { motion } from 'framer-motion'
import { ArrowRight, User, RotateCcw, ShoppingBag } from 'lucide-react'

interface ProductSnapshot {
  productName?: string
  barcode?: string
  gram?: number
  karat?: number
  salePrice?: { price?: number; currency?: string }
  image?: string
}

interface ReturnDetail {
  id: number
  transactionId: number | null
  productId: number
  customerName: string
  customerPhone: string
  bellNumber: number
  productSnapshot: ProductSnapshot
  note: string | null
  returnedAt: string
}

const formatDate = (d: string | undefined) => {
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
    return d ?? '—'
  }
}

const formatMoney = (n: number) =>
  Number(n).toLocaleString('fa-IR', { useGrouping: true })

export default function ReturnDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [data, setData] = useState<ReturnDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    axios
      .get<{ success: boolean; data?: ReturnDetail }>(`/api/returns/${id}`)
      .then((res) => {
        if (res.data?.success && res.data.data) {
          setData(res.data.data)
        } else {
          setError('مرجوعیه یافت نشد')
        }
      })
      .catch(() => {
        setError('خطا در بارگذاری')
        setData(null)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="animate-pulse text-charcoal-soft dark:text-slate-400 font-medium">
          در حال بارگذاری...
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <p className="text-red-500 dark:text-red-400 mb-4">{error ?? 'مرجوعیه یافت نشد'}</p>
        <Link
          href="/returns"
          className="btn-luxury btn-luxury-outline p-2 inline-flex items-center justify-center"
          aria-label="بازگشت به لیست مرجوعات"
          title="بازگشت به لیست مرجوعات"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  const snap = data.productSnapshot ?? {}
  const unitPrice = snap.salePrice?.price ?? 0

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <Link
          href="/returns"
          className="p-2 inline-flex items-center justify-center text-charcoal dark:text-slate-200 hover:text-gold-600 dark:hover:text-gold-400 transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50"
          aria-label="بازگشت به مرجوعات"
          title="بازگشت به مرجوعات"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        {data.transactionId != null && (
          <Link
            href={`/sales/${data.transactionId}`}
            className="btn-luxury btn-luxury-outline px-4 py-2 inline-flex items-center gap-2"
          >
            مشاهده فروش مرتبط
          </Link>
        )}
      </div>

      <div
        className="relative bg-white dark:bg-slate-800/95 rounded-2xl border-2 border-gold-200/60 dark:border-gold-800/50 shadow-lg overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,215,0,0.03) 0%, transparent 50%)'
        }}
      >
        <div className="h-1 bg-gradient-to-l from-gold-700 via-gold-500 to-gold-300" />

        <div className="p-6 sm:p-8 md:p-10">
          <header className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-600">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-amber-100 dark:bg-amber-900/40 p-2">
                <RotateCcw className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </span>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-charcoal dark:text-white">
                مرجوعیه #{data.id}
              </h1>
              <span className="text-slate-500 dark:text-slate-400 text-sm">
                {formatDate(data.returnedAt)}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                مرجوع شده
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              بل #{data.bellNumber}
            </p>
          </header>

          <div className="mb-8 p-5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 flex flex-wrap items-start gap-4">
            <div className="rounded-full bg-gold-100 dark:bg-gold-900/30 p-3">
              <User className="w-8 h-8 text-gold-600 dark:text-gold-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                مشتری
              </p>
              <p className="font-heading text-lg font-semibold text-charcoal dark:text-white">
                {data.customerName}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-1" dir="ltr">
                {data.customerPhone}
              </p>
            </div>
          </div>

          <h2 className="font-heading text-lg font-semibold text-charcoal dark:text-white mb-4">
            محصول مرجوع شده
          </h2>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/30 flex gap-4">
            {snap.image ? (
              <img
                src={snap.image.startsWith('http') ? snap.image : `/${snap.image}`}
                alt=""
                className="w-20 h-20 object-cover rounded-lg shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-slate-200 dark:bg-slate-600 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-8 h-8 text-slate-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-charcoal dark:text-white">
                {snap.productName ?? '—'}
              </p>
              {snap.barcode != null && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5" dir="ltr">
                  بارکد: {snap.barcode}
                </p>
              )}
              <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-600 dark:text-slate-300">
                {snap.gram != null && <span>{snap.gram} گرم</span>}
                {snap.karat != null && <span>عیار {snap.karat}</span>}
              </div>
              {unitPrice > 0 && (
                <p className="mt-2 font-semibold text-gold-700 dark:text-gold-400" dir="ltr">
                  {formatMoney(unitPrice)} افغانی
                </p>
              )}
            </div>
          </div>

          {data.note?.trim() && (
            <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">یادداشت</p>
              <p className="text-sm text-charcoal dark:text-slate-200">{data.note.trim()}</p>
            </div>
          )}
        </div>

        <div className="h-1 bg-gradient-to-l from-gold-300 via-gold-500 to-gold-700" />
      </div>
    </div>
  )
}
