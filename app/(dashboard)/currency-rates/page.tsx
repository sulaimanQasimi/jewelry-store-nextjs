'use client'

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import FormField from '@/components/ui/FormField'
import PersianDatePicker from '@/components/ui/PersianDatePicker'
import FilterBar from '@/components/ui/FilterBar'
import DataTable from '@/components/ui/DataTable'
import type { ColumnDef } from '@/components/ui/DataTable'
import CurrencyRateFormModal from '@/components/currency-rate/CurrencyRateFormModal'
import type { CurrencyRateFormData } from '@/components/currency-rate/CurrencyRateFormModal'

interface CurrencyRate {
  id: number
  date: string
  usdToAfn: number
}

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' })
  } catch {
    return d
  }
}

export default function CurrencyRatesPage() {
  const [data, setData] = useState<CurrencyRate[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CurrencyRate | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = { page: String(page), limit: String(limit) }
      if (dateFrom) params.dateFrom = dateFrom
      if (dateTo) params.dateTo = dateTo
      const { data: res } = await axios.get<{ success?: boolean; data?: CurrencyRate[]; total?: number }>(
        '/api/currency-rate/list',
        { params }
      )
      const list = Array.isArray(res?.data) ? res.data : []
      setData(list)
      setTotal(Number(res?.total) >= 0 ? Number(res.total) : list.length)
    } catch (err: unknown) {
      console.error('Failed to load currency rates:', err)
      setData([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit, dateFrom, dateTo])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (row: CurrencyRate) => {
    setEditing(row)
    setModalOpen(true)
  }

  const columns: ColumnDef<CurrencyRate>[] = [
    { key: 'id', label: '#' },
    { key: 'date', label: 'تاریخ', render: (r) => formatDate(r.date) },
    { key: 'usdToAfn', label: 'نرخ دالر به افغانی', render: (r) => (r.usdToAfn != null ? Number(r.usdToAfn).toLocaleString() : '—') },
    {
      key: 'actions',
      label: 'عملیات',
      render: (r) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => openEdit(r)}
            className="btn-luxury btn-luxury-outline py-1.5 px-3 text-sm"
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
        <PersianDatePicker value={dateFrom || null} onChange={(v) => setDateFrom(v ?? '')} className="input-luxury" />
      </FormField>
      <FormField label="تا تاریخ">
        <PersianDatePicker value={dateTo || null} onChange={(v) => setDateTo(v ?? '')} className="input-luxury" />
      </FormField>
    </>
  )

  const resetFilters = () => {
    setDateFrom('')
    setDateTo('')
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal">نرخ ارز</h1>
          <p className="mt-1 text-sm text-charcoal-soft">مدیریت نرخ روزانه دالر به افغانی.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="btn-luxury btn-luxury-primary px-6 py-2 shrink-0"
        >
          افزودن نرخ ارز
        </button>
      </header>

      <section>
        <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">لیست نرخ ارز</h2>
        <FilterBar extraFilters={extraFilters} onReset={resetFilters} />
        <div className="mt-4">
          <DataTable<CurrencyRate>
            columns={columns}
            data={data}
            keyField="id"
            loading={loading}
            emptyMessage="نرخ ارزی یافت نشد"
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

      <CurrencyRateFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        mode={editing ? 'edit' : 'create'}
        initialData={editing ? (editing as CurrencyRateFormData) : null}
        onSuccess={fetchData}
      />
    </div>
  )
}
