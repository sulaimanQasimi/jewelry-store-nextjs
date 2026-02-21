'use client'

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import FormField from '@/components/ui/FormField'
import FilterBar from '@/components/ui/FilterBar'
import DataTable from '@/components/ui/DataTable'
import type { ColumnDef } from '@/components/ui/DataTable'
import GoldRatesCard from '@/components/dashboard/GoldRatesCard'
import GoldRateFormModal from '@/components/gold-rate/GoldRateFormModal'
import type { GoldRateFormData } from '@/components/gold-rate/GoldRateFormModal'

interface GoldRateRow {
  id: number
  date: string
  price_per_ounce_usd: number
  price_per_gram_afn: number | null
  source: string | null
}

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' })
  } catch {
    return d
  }
}

const formatNum = (n: number) => (n != null ? Number(n).toLocaleString('fa-IR') : '—')

export default function GoldRatePage() {
  const [data, setData] = useState<GoldRateRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<GoldRateRow | null>(null)
  const [latest, setLatest] = useState<GoldRateRow | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = { page: String(page), limit: String(limit) }
      if (dateFrom) params.dateFrom = dateFrom
      if (dateTo) params.dateTo = dateTo
      const { data: res } = await axios.get<{ success?: boolean; data?: GoldRateRow[]; total?: number }>(
        '/api/gold-rate/list',
        { params }
      )
      const list = Array.isArray(res?.data) ? res.data : []
      setData(list)
      setTotal(Number(res?.total) >= 0 ? Number(res.total) : list.length)
    } catch (err: unknown) {
      console.error('Failed to load gold rates:', err)
      setData([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit, dateFrom, dateTo])

  const fetchLatest = useCallback(async () => {
    try {
      const { data: res } = await axios.get<{ success?: boolean; data?: GoldRateRow | null }>('/api/gold-rate/latest')
      setLatest(res?.data ?? null)
    } catch {
      setLatest(null)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchLatest()
  }, [fetchLatest])

  const onSuccess = () => {
    fetchData()
    fetchLatest()
  }

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (row: GoldRateRow) => {
    setEditing(row)
    setModalOpen(true)
  }

  const columns: ColumnDef<GoldRateRow>[] = [
    { key: 'id', label: '#', className: 'w-14' },
    { key: 'date', label: 'تاریخ', render: (r) => formatDate(r.date) },
    {
      key: 'price_per_ounce_usd',
      label: 'دلار/اونس',
      render: (r) => (r.price_per_ounce_usd != null ? `$${Number(r.price_per_ounce_usd).toLocaleString()}` : '—'),
      className: 'phone-ltr'
    },
    {
      key: 'price_per_gram_afn',
      label: 'افغانی/گرم',
      render: (r) => formatNum(r.price_per_gram_afn ?? 0),
      className: 'font-stat'
    },
    {
      key: 'actions',
      label: 'عملیات',
      render: (r) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => openEdit(r)}
            className="px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-sm font-medium transition-colors"
          >
            ویرایش
          </button>
        </div>
      )
    }
  ]

  const extraFilters = (
    <>
      <FormField label="از تاریخ">
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="input-luxury w-full"
        />
      </FormField>
      <FormField label="تا تاریخ">
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="input-luxury w-full"
        />
      </FormField>
    </>
  )

  const resetFilters = () => {
    setDateFrom('')
    setDateTo('')
  }

  return (
    <div className="space-y-8" dir="rtl">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal dark:text-white">نرخ طلا</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-stat">
            مدیریت نرخ روزانه طلا برای محاسبه قیمت پیشنهادی اجناس
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="min-w-[140px] py-2.5 px-5 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-700 hover:to-amber-800 focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 font-stat transition-all duration-200"
        >
          افزودن نرخ طلا
        </button>
      </header>

      <div className="max-w-sm">
        <GoldRatesCard
          pricePerGramAfn={latest?.price_per_gram_afn ?? null}
          date={latest?.date ?? null}
          pricePerOunceUsd={latest?.price_per_ounce_usd ?? null}
          href="/gold-rate"
        />
      </div>

      <section>
        <h2 className="font-heading text-lg font-semibold text-charcoal dark:text-white mb-4">لیست نرخ طلا</h2>
        <FilterBar extraFilters={extraFilters} onReset={resetFilters} />
        <div className="mt-4">
          <DataTable<GoldRateRow>
            columns={columns}
            data={data}
            keyField="id"
            loading={loading}
            emptyMessage="نرخ طلایی یافت نشد. برای محاسبه قیمت بر اساس طلا ابتدا نرخ امروز را ثبت کنید."
            pagination={{
              page,
              limit,
              total,
              onPageChange: setPage,
              onLimitChange: setLimit
            }}
            minWidth="600px"
          />
        </div>
      </section>

      <GoldRateFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        mode={editing ? 'edit' : 'create'}
        initialData={editing ? (editing as GoldRateFormData) : null}
        onSuccess={onSuccess}
      />
    </div>
  )
}
