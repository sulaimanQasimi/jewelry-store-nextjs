'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import FormField from '@/components/ui/FormField'
import FilterBar from '@/components/ui/FilterBar'
import DataTable from '@/components/ui/DataTable'
import type { ColumnDef } from '@/components/ui/DataTable'
import RepairFormModal from '@/components/repair/RepairFormModal'
import type { RepairFormData } from '@/components/repair/RepairFormModal'

interface RepairRow {
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

const STATUS_LABELS: Record<string, string> = {
  received: 'دریافت شده',
  in_progress: 'در دست تعمیر',
  ready: 'آماده تحویل',
  delivered: 'تحویل داده شده',
  cancelled: 'لغو شده'
}

const statusBadgeClass: Record<string, string> = {
  received: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  in_progress: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  ready: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  delivered: 'bg-slate-100 text-slate-600 dark:bg-slate-600 dark:text-slate-200',
  cancelled: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
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

export default function RepairsPage() {
  const searchParams = useSearchParams()
  const [data, setData] = useState<RepairRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [statusFilter, setStatusFilter] = useState(() => searchParams?.get('status') ?? '')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<RepairRow | null>(null)

  useEffect(() => {
    const status = searchParams?.get('status') ?? ''
    setStatusFilter(status)
  }, [searchParams])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = { page: String(page), limit: String(limit) }
      if (statusFilter) params.status = statusFilter
      if (dateFrom) params.dateFrom = dateFrom
      if (dateTo) params.dateTo = dateTo
      const { data: res } = await axios.get<{ success?: boolean; data?: RepairRow[]; total?: number }>(
        '/api/repairs/list',
        { params }
      )
      const list = Array.isArray(res?.data) ? res.data : []
      setData(list)
      setTotal(Number(res?.total) >= 0 ? Number(res.total) : list.length)
    } catch (err: unknown) {
      console.error('Failed to load repairs:', err)
      setData([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit, statusFilter, dateFrom, dateTo])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (row: RepairRow) => {
    setEditing(row)
    setModalOpen(true)
  }

  const columns: ColumnDef<RepairRow>[] = [
    { key: 'id', label: '#', className: 'w-14' },
    { key: 'customer_name', label: 'مشتری' },
    { key: 'customer_phone', label: 'تلفن', className: 'phone-ltr', render: (r) => r.customer_phone || '—' },
    {
      key: 'product_description',
      label: 'شرح کار',
      render: (r) => (r.product_description ? (r.product_description.length > 40 ? r.product_description.slice(0, 40) + '…' : r.product_description) : '—')
    },
    {
      key: 'status',
      label: 'وضعیت',
      render: (r) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass[r.status] ?? statusBadgeClass.received}`}>
          {STATUS_LABELS[r.status] ?? r.status}
        </span>
      )
    },
    { key: 'due_date', label: 'تاریخ تحویل', render: (r) => formatDate(r.due_date) },
    {
      key: 'estimated_cost',
      label: 'هزینه تخمینی',
      render: (r) => (r.estimated_cost != null ? `${formatNum(r.estimated_cost)} ${r.currency || 'AFN'}` : '—'),
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
            className="px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-sm font-medium"
          >
            ویرایش
          </button>
        </div>
      )
    }
  ]

  const extraFilters = (
    <>
      <FormField label="وضعیت">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-luxury w-full"
        >
          <option value="">همه</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </FormField>
      <FormField label="از تاریخ (تحویل)">
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="input-luxury w-full" />
      </FormField>
      <FormField label="تا تاریخ (تحویل)">
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="input-luxury w-full" />
      </FormField>
    </>
  )

  const resetFilters = () => {
    setStatusFilter('')
    setDateFrom('')
    setDateTo('')
  }

  return (
    <div className="space-y-8" dir="rtl">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal dark:text-white">تعمیرات</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-stat">
            درخواست‌های تعمیر و کارهای در دست انجام
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="min-w-[140px] py-2.5 px-5 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-700 hover:to-amber-800 font-stat transition-all duration-200"
        >
          ثبت تعمیر جدید
        </button>
      </header>

      <FilterBar extraFilters={extraFilters} onReset={resetFilters} />
      <div className="mt-4">
        <DataTable<RepairRow>
          columns={columns}
          data={data}
          keyField="id"
          loading={loading}
          emptyMessage="درخواست تعمیری یافت نشد"
          pagination={{
            page,
            limit,
            total,
            onPageChange: setPage,
            onLimitChange: setLimit
          }}
          minWidth="900px"
        />
      </div>

      <RepairFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        mode={editing ? 'edit' : 'create'}
        initialData={
          editing
            ? {
                id: editing.id,
                customer_id: editing.customer_id,
                customer_name: editing.customer_name,
                customer_phone: editing.customer_phone,
                product_description: editing.product_description ?? '',
                incoming_notes: editing.incoming_notes ?? '',
                estimated_cost: editing.estimated_cost,
                currency: editing.currency,
                status: editing.status,
                due_date: editing.due_date
              }
            : null
        }
        onSuccess={fetchData}
      />
    </div>
  )
}
