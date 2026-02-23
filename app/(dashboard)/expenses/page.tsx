'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import FormField from '@/components/ui/FormField'
import PersianDatePicker from '@/components/ui/PersianDatePicker'
import FilterBar from '@/components/ui/FilterBar'
import DataTable from '@/components/ui/DataTable'
import type { ColumnDef } from '@/components/ui/DataTable'
import ExpenseFormModal from '@/components/expense/ExpenseFormModal'
import type { Expense } from '@/types/expense'
import type { ExpenseFormData } from '@/types/expense'
import { EXPENSE_TYPES } from '@/types/expense'

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' })
  } catch {
    return d
  }
}

export default function ExpensesPage() {
  const router = useRouter()
  const [data, setData] = useState<Expense[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [typeFilter, setTypeFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

  const fetchExpenses = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = { page: String(page), limit: String(limit) }
      if (typeFilter) params.type = typeFilter
      if (dateFrom) params.dateFrom = dateFrom
      if (dateTo) params.dateTo = dateTo
      const { data: res } = await axios.get<{ success?: boolean; data?: Expense[]; total?: number }>(
        '/api/expense/list',
        { params }
      )
      const list = Array.isArray(res?.data) ? res.data : []
      setData(list)
      setTotal(Number(res?.total) >= 0 ? Number(res.total) : list.length)
    } catch (err: unknown) {
      console.error('Failed to load expenses:', err)
      setData([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit, typeFilter, dateFrom, dateTo])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  const openCreate = () => {
    setEditingExpense(null)
    setModalOpen(true)
  }

  const openEdit = (row: Expense) => {
    setEditingExpense(row)
    setModalOpen(true)
  }

  const columns: ColumnDef<Expense>[] = [
    { key: 'id', label: '#' },
    { key: 'type', label: 'نوع' },
    { key: 'detail', label: 'جزئیات', render: (r) => (r.detail ? String(r.detail).slice(0, 40) + (String(r.detail).length > 40 ? '…' : '') : '—') },
    { key: 'price', label: 'مبلغ', render: (r) => (r.price != null ? Number(r.price).toLocaleString() : '—') },
    { key: 'currency', label: 'واحد پول' },
    { key: 'date', label: 'تاریخ', render: (r) => formatDate(r.date) },
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
          <button
            type="button"
            onClick={() => router.push(`/expenses/${r.id}`)}
            className="btn-luxury btn-luxury-primary py-1.5 px-3 text-sm"
          >
            مشاهده
          </button>
        </div>
      )
    }
  ]

  const extraFilters = (
    <>
      <FormField label="نوع">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="input-luxury min-w-[140px]"
        >
          <option value="">همه</option>
          {EXPENSE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </FormField>
      <FormField label="از تاریخ">
        <PersianDatePicker value={dateFrom || null} onChange={(v) => setDateFrom(v ?? '')} className="input-luxury" />
      </FormField>
      <FormField label="تا تاریخ">
        <PersianDatePicker value={dateTo || null} onChange={(v) => setDateTo(v ?? '')} className="input-luxury" />
      </FormField>
    </>
  )

  const resetFilters = () => {
    setTypeFilter('')
    setDateFrom('')
    setDateTo('')
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal">مصارف</h1>
          <p className="mt-1 text-sm text-charcoal-soft">لیست مصارف را با فیلتر و صفحه‌بندی مشاهده کنید.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="btn-luxury btn-luxury-primary px-6 py-2 shrink-0"
        >
          افزودن مصرف
        </button>
      </header>

      <section>
        <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">لیست مصارف</h2>
        <FilterBar extraFilters={extraFilters} onReset={resetFilters} />
        <div className="mt-4">
          <DataTable<Expense>
            columns={columns}
            data={data}
            keyField="id"
            loading={loading}
            emptyMessage="مصرفی یافت نشد"
            pagination={{
              page,
              limit,
              total,
              onPageChange: setPage,
              onLimitChange: setLimit
            }}
            minWidth="800px"
          />
        </div>
      </section>

      <ExpenseFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingExpense(null)
        }}
        mode={editingExpense ? 'edit' : 'create'}
        initialData={editingExpense ? (editingExpense as ExpenseFormData) : null}
        onSuccess={fetchExpenses}
      />
    </div>
  )
}
