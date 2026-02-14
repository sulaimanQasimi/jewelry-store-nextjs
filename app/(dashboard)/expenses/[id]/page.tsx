'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import axios from 'axios'
import type { Expense } from '@/types/expense'

function formatDate(d: string | null) {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return d
  }
}

export default function ExpenseShowPage() {
  const params = useParams()
  const id = params?.id as string | undefined
  const [expense, setExpense] = useState<Expense | null>(null)
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
      .get<{ success: boolean; data: Expense }>(`/api/expense/${id}`)
      .then(({ data: res }) => {
        if (!cancelled && res.success && res.data) setExpense(res.data)
        else if (!cancelled) setNotFound(true)
      })
      .catch(() => {
        if (!cancelled) setNotFound(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-charcoal-soft">در حال بارگذاری...</p>
      </div>
    )
  }

  if (notFound || !expense) {
    return (
      <div className="space-y-6">
        <Link href="/expenses" className="text-gold-600 hover:underline text-sm">
          بازگشت به لیست مصارف
        </Link>
        <p className="text-charcoal-soft">مصرف یافت نشد.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 transition-opacity duration-200">
      <Link href="/expenses" className="inline-flex items-center gap-1 text-gold-600 hover:underline text-sm">
        بازگشت به لیست مصارف
      </Link>

      <div className="card-luxury rounded-2xl border border-gold-200/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gold-200 bg-gold-50/50">
          <h1 className="font-heading text-2xl font-semibold text-charcoal">{expense.type}</h1>
          <p className="mt-1 text-sm text-charcoal-soft">
            {Number(expense.price).toLocaleString()} {expense.currency}
          </p>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 p-6 text-sm">
          <div>
            <dt className="text-charcoal-soft">نوع</dt>
            <dd className="font-medium text-charcoal">{expense.type}</dd>
          </div>
          <div>
            <dt className="text-charcoal-soft">مبلغ</dt>
            <dd className="font-medium text-charcoal">{Number(expense.price).toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-charcoal-soft">واحد پول</dt>
            <dd className="font-medium text-charcoal">{expense.currency}</dd>
          </div>
          <div>
            <dt className="text-charcoal-soft">تاریخ</dt>
            <dd className="font-medium text-charcoal">{formatDate(expense.date)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-charcoal-soft">جزئیات</dt>
            <dd className="font-medium text-charcoal mt-1">{expense.detail}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
