'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'

interface PersonalExpense {
  id: number
  name: string
  personId: number
  personName?: string
  personPhone?: string
  amount: number
  currency: string
  detail: string | null
  createdAt: string
}

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' })
  } catch {
    return d
  }
}

export default function PersonalExpenseDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [data, setData] = useState<PersonalExpense | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    axios.get<{ success: boolean; data?: PersonalExpense }>(`/api/personal-expense/${id}`)
      .then(({ data: res }) => {
        if (res.success && res.data) setData(res.data)
        else setError('مصرف شخصی یافت نشد')
      })
      .catch(() => setError('خطا در بارگذاری'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center py-12"><span className="text-charcoal-soft">در حال بارگذاری...</span></div>
  if (error || !data) return (
    <div className="space-y-4">
      <p className="text-red-600">{error ?? 'مصرف شخصی یافت نشد'}</p>
      <Link href="/personal-expenses" className="btn-luxury btn-luxury-outline">بازگشت به لیست</Link>
    </div>
  )

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal">جزئیات مصرف شخصی</h1>
          <p className="mt-1 text-sm text-charcoal-soft">{data.name}</p>
        </div>
        <Link href="/personal-expenses" className="btn-luxury btn-luxury-outline px-6 py-2 shrink-0">بازگشت به لیست</Link>
      </header>
      <section className="card-luxury rounded-2xl p-6 max-w-2xl">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><dt className="text-sm text-charcoal-soft">نام</dt><dd className="font-medium text-charcoal">{data.name}</dd></div>
          <div><dt className="text-sm text-charcoal-soft">شخص</dt><dd className="font-medium text-charcoal">{data.personName ?? '—'}</dd></div>
          <div><dt className="text-sm text-charcoal-soft">مبلغ</dt><dd className="font-medium text-charcoal">{data.amount != null ? Number(data.amount).toLocaleString() : '—'} {data.currency}</dd></div>
          <div><dt className="text-sm text-charcoal-soft">تاریخ</dt><dd className="font-medium text-charcoal">{formatDate(data.createdAt)}</dd></div>
          {data.detail && <div className="sm:col-span-2"><dt className="text-sm text-charcoal-soft">جزئیات</dt><dd className="font-medium text-charcoal">{data.detail}</dd></div>}
        </dl>
      </section>
    </div>
  )
}
