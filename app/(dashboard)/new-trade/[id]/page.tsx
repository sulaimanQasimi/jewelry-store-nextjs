'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import axios from 'axios'

interface Trader {
  id: number
  name: string
  phone: string
  address: string | null
  createdAt: string
  updatedAt: string
}

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

export default function TraderShowPage() {
  const params = useParams()
  const id = params?.id as string | undefined
  const [trader, setTrader] = useState<Trader | null>(null)
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
      .get<{ success: boolean; data: Trader }>(`/api/trader/${id}`)
      .then(({ data: res }) => {
        if (!cancelled && res.success && res.data) setTrader(res.data)
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

  if (notFound || !trader) {
    return (
      <div className="space-y-6">
        <Link href="/new-trade" className="text-gold-600 hover:underline text-sm">
          بازگشت به لیست معامله‌داران
        </Link>
        <p className="text-charcoal-soft">معامله‌دار یافت نشد.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 transition-opacity duration-200">
      <Link href="/new-trade" className="inline-flex items-center gap-1 text-gold-600 hover:underline text-sm">
        بازگشت به لیست معامله‌داران
      </Link>

      <div className="card-luxury rounded-2xl border border-gold-200/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gold-200 bg-gold-50/50">
          <h1 className="font-heading text-2xl font-semibold text-charcoal">{trader.name}</h1>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 p-6 text-sm">
          <div>
            <dt className="text-charcoal-soft">نام</dt>
            <dd className="font-medium text-charcoal">{trader.name}</dd>
          </div>
          <div>
            <dt className="text-charcoal-soft">شماره تماس</dt>
            <dd className="font-medium text-charcoal">{trader.phone}</dd>
          </div>
          {trader.address && (
            <div className="sm:col-span-2">
              <dt className="text-charcoal-soft">آدرس</dt>
              <dd className="font-medium text-charcoal">{trader.address}</dd>
            </div>
          )}
          <div>
            <dt className="text-charcoal-soft">تاریخ ثبت</dt>
            <dd className="font-medium text-charcoal">{formatDate(trader.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-charcoal-soft">آخرین به‌روزرسانی</dt>
            <dd className="font-medium text-charcoal">{formatDate(trader.updatedAt)}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
