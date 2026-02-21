'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import FilterBar from '@/components/ui/FilterBar'
import DataTable from '@/components/ui/DataTable'
import type { ColumnDef } from '@/components/ui/DataTable'

interface CrmRow {
  id: number
  customerName: string
  phone: string
  totalSpent: number
  lastPurchaseAt: string | null
  nextOccasion: { days: number; label: string } | null
  birthDate: string | null
  anniversary_date: string | null
}

function formatDate(d: string | null | undefined) {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' })
  } catch {
    return d
  }
}

const formatNum = (n: number) => (n != null ? n.toLocaleString('fa-IR') : '—')

export default function CrmPage() {
  const [data, setData] = useState<CrmRow[]>([])
  const [loading, setLoading] = useState(true)
  const [upcomingOnly, setUpcomingOnly] = useState(false)

  const fetchData = () => {
    setLoading(true)
    axios
      .get<{ success?: boolean; data?: CrmRow[] }>('/api/customers/crm', {
        params: upcomingOnly ? { upcomingOccasions: 'true' } : {}
      })
      .then(({ data: res }) => {
        setData(Array.isArray(res?.data) ? res.data : [])
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
  }, [upcomingOnly])

  const columns: ColumnDef<CrmRow>[] = [
    { key: 'id', label: '#', className: 'w-14' },
    { key: 'customerName', label: 'مشتری' },
    { key: 'phone', label: 'تلفن', className: 'phone-ltr', render: (r) => r.phone || '—' },
    {
      key: 'totalSpent',
      label: 'مجموع خرید (افغانی)',
      render: (r) => formatNum(r.totalSpent),
      className: 'font-stat'
    },
    {
      key: 'lastPurchaseAt',
      label: 'آخرین خرید',
      render: (r) => formatDate(r.lastPurchaseAt)
    },
    {
      key: 'nextOccasion',
      label: 'مناسبت نزدیک',
      render: (r) =>
        r.nextOccasion ? (
          <span className="text-amber-700 dark:text-amber-400 font-stat">
            {r.nextOccasion.days} روز تا {r.nextOccasion.label}
          </span>
        ) : (
          '—'
        )
    },
    {
      key: 'actions',
      label: 'عملیات',
      render: (r) => (
        <Link
          href={`/customer-registration/${r.id}`}
          className="px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-sm font-medium"
        >
          مشاهده
        </Link>
      )
    }
  ]

  const extraFilters = (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={upcomingOnly}
        onChange={(e) => setUpcomingOnly(e.target.checked)}
        className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
      />
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">فقط دارای مناسبت در ۳۰ روز آینده</span>
    </label>
  )

  return (
    <div className="space-y-8" dir="rtl">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal dark:text-white">CRM مشتریان</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-stat">
            تاریخچه خرید و مناسبت‌های نزدیک برای وفاداری و بازاریابی
          </p>
        </div>
        <Link
          href="/customer-registration"
          className="text-amber-600 dark:text-amber-400 hover:underline text-sm font-stat"
        >
          لیست مشتریان
        </Link>
      </header>

      <FilterBar extraFilters={extraFilters} onReset={() => setUpcomingOnly(false)} />
      <div className="mt-4">
        <DataTable<CrmRow>
          columns={columns}
          data={data}
          keyField="id"
          loading={loading}
          emptyMessage={upcomingOnly ? 'مشتری با مناسبت در ۳۰ روز آینده یافت نشد' : 'مشتری یافت نشد'}
          minWidth="900px"
        />
      </div>
    </div>
  )
}
