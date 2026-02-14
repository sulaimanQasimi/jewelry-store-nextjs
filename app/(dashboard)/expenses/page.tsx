'use client'

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import FormField from '@/components/ui/FormField'
import FilterBar from '@/components/ui/FilterBar'
import DataTable from '@/components/ui/DataTable'
import type { ColumnDef } from '@/components/ui/DataTable'

interface Expense {
  id: number
  type: string
  detail: string
  price: number
  currency: string
  date: string
}

export default function ExpensesPage() {
  const [data, setData] = useState<Expense[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [typeFilter, setTypeFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    type: '',
    detail: '',
    price: '',
    currency: 'افغانی'
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchExpenses = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = { page: String(page), limit: String(limit) }
      if (typeFilter) params.type = typeFilter
      if (dateFrom) params.dateFrom = dateFrom
      if (dateTo) params.dateTo = dateTo
      const { data: res } = await axios.get<{ success: boolean; data: Expense[]; total: number }>(
        '/api/expense/list',
        { params }
      )
      if (res.success) {
        setData(res.data ?? [])
        setTotal(res.total ?? 0)
      }
    } catch {
      setData([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit, typeFilter, dateFrom, dateTo])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.type.trim() || !form.detail.trim() || !form.price.trim() || !form.currency.trim()) {
      toast.error('نوع، جزئیات، مبلغ و واحد پول را وارد کنید')
      return
    }
    setSubmitting(true)
    try {
      const { data: res } = await axios.post('/api/expense/add-expense', {
        type: form.type,
        detail: form.detail,
        price: Number(form.price),
        currency: form.currency,
        date: new Date().toISOString()
      })
      if (res.success) {
        toast.success(res.message ?? 'ثبت شد')
        setForm({ type: '', detail: '', price: '', currency: 'افغانی' })
        fetchExpenses()
      } else toast.error(res.message)
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' })
    } catch {
      return d
    }
  }

  const columns: ColumnDef<Expense>[] = [
    { key: 'id', label: '#' },
    { key: 'type', label: 'نوع' },
    { key: 'detail', label: 'جزئیات' },
    { key: 'price', label: 'مبلغ', render: (r) => r.price?.toLocaleString() ?? '—' },
    { key: 'currency', label: 'واحد پول' },
    { key: 'date', label: 'تاریخ', render: (r) => formatDate(r.date) }
  ]

  const extraFilters = (
    <>
      <FormField label="نوع">
        <input
          type="text"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          placeholder="نوع مصارف"
          className="input-luxury min-w-[120px]"
        />
      </FormField>
      <FormField label="از تاریخ">
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="input-luxury"
        />
      </FormField>
      <FormField label="تا تاریخ">
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="input-luxury"
        />
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
      <header>
        <h1 className="font-heading text-2xl font-semibold text-charcoal">مصارف</h1>
        <p className="mt-1 text-sm text-charcoal-soft">ثبت مصارف و مشاهده لیست با فیلتر و صفحه‌بندی.</p>
      </header>

      <section className="card-luxury rounded-2xl border border-gold-200/50 p-6">
        <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">افزودن مصارف</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormField label="نوع">
            <input
              className="input-luxury w-full"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            />
          </FormField>
          <FormField label="جزئیات">
            <input
              className="input-luxury w-full"
              value={form.detail}
              onChange={(e) => setForm((f) => ({ ...f, detail: e.target.value }))}
            />
          </FormField>
          <FormField label="مبلغ">
            <input
              type="number"
              className="input-luxury w-full"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            />
          </FormField>
          <FormField label="واحد پول">
            <select
              className="input-luxury w-full"
              value={form.currency}
              onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
            >
              <option value="افغانی">افغانی</option>
              <option value="دالر">دالر</option>
            </select>
          </FormField>
          <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
            <button type="submit" disabled={submitting} className="btn-luxury btn-luxury-primary px-6 py-2">
              {submitting ? 'در حال ثبت...' : 'ثبت مصارف'}
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">لیست مصارف</h2>
        <FilterBar
          extraFilters={extraFilters}
          onReset={resetFilters}
        />
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
          />
        </div>
      </section>
    </div>
  )
}
