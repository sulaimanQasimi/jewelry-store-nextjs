'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import axios from 'axios'

const STATUS_LABELS: Record<string, string> = {
  received: 'دریافت شده',
  in_progress: 'در دست تعمیر',
  ready: 'آماده تحویل',
  delivered: 'تحویل داده شده',
  cancelled: 'لغو شده'
}

function formatDate(d: string | null | undefined) {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' })
  } catch {
    return d
  }
}

const formatNum = (n: number | null) => (n != null ? n.toLocaleString('fa-IR') : '—')

interface Repair {
  id: number
  customer_id: number
  customer_name: string
  customer_phone: string
  product_description: string | null
  incoming_notes: string | null
  estimated_cost: number | null
  currency: string
  status: string
  due_date: string | null
  completed_at: string | null
  created_at: string
}

export default function RepairDetailPage() {
  const params = useParams()
  const id = params?.id as string | undefined
  const [repair, setRepair] = useState<Repair | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) {
      setNotFound(true)
      setLoading(false)
      return
    }
    let cancelled = false
    axios
      .get<{ success?: boolean; data?: Repair }>(`/api/repairs/${id}`)
      .then(({ data: res }) => {
        if (!cancelled && res?.success && res?.data) setRepair(res.data)
        else if (!cancelled) setNotFound(true)
      })
      .catch(() => {
        if (!cancelled) setNotFound(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-slate-500 dark:text-slate-400">در حال بارگذاری...</p>
      </div>
    )
  }

  if (notFound || !repair) {
    return (
      <div className="space-y-6">
        <Link href="/repairs" className="text-amber-600 hover:underline text-sm">
          بازگشت به لیست تعمیرات
        </Link>
        <p className="text-slate-500 dark:text-slate-400">تعمیر یافت نشد.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6" dir="rtl">
      <header className="flex flex-wrap items-center gap-3">
        <Link href="/repairs" className="text-amber-600 dark:text-amber-400 hover:underline text-sm font-stat">
          بازگشت به لیست تعمیرات
        </Link>
        <Link
          href={`/repairs/${repair.id}/edit`}
          className="py-2 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-sm font-stat"
        >
          ویرایش
        </Link>
      </header>

      <div className="card-luxury rounded-2xl border border-amber-200/50 dark:border-slate-600/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-amber-200/60 dark:border-slate-600 flex flex-row items-center justify-between">
          <h1 className="font-heading text-2xl font-semibold text-charcoal dark:text-white">تعمیر #{repair.id}</h1>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              repair.status === 'received'
                ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                : repair.status === 'in_progress'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                  : repair.status === 'ready'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                    : repair.status === 'delivered'
                      ? 'bg-slate-100 text-slate-600 dark:bg-slate-600 dark:text-slate-200'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
            }`}
          >
            {STATUS_LABELS[repair.status] ?? repair.status}
          </span>
        </div>
        <dl className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div>
            <dt className="text-slate-500 dark:text-slate-400">مشتری</dt>
            <dd className="font-medium text-charcoal dark:text-white">{repair.customer_name}</dd>
          </div>
          <div>
            <dt className="text-slate-500 dark:text-slate-400">تلفن</dt>
            <dd className="font-medium text-charcoal dark:text-white phone-ltr" dir="ltr">{repair.customer_phone}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-slate-500 dark:text-slate-400">شرح کار</dt>
            <dd className="font-medium text-charcoal dark:text-white mt-1">{repair.product_description || '—'}</dd>
          </div>
          {repair.incoming_notes ? (
            <div className="sm:col-span-2">
              <dt className="text-slate-500 dark:text-slate-400">یادداشت ورود</dt>
              <dd className="font-medium text-charcoal dark:text-white mt-1">{repair.incoming_notes}</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-slate-500 dark:text-slate-400">هزینه تخمینی</dt>
            <dd className="font-medium text-charcoal dark:text-white font-stat">
              {repair.estimated_cost != null ? `${formatNum(repair.estimated_cost)} ${repair.currency}` : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500 dark:text-slate-400">تاریخ تحویل پیش‌بینیشده</dt>
            <dd className="font-medium text-charcoal dark:text-white">{formatDate(repair.due_date)}</dd>
          </div>
          <div>
            <dt className="text-slate-500 dark:text-slate-400">تاریخ ثبت</dt>
            <dd className="font-medium text-charcoal dark:text-white">{formatDate(repair.created_at)}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
