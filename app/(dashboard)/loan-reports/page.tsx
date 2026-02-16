'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import FormField from '@/components/ui/FormField'
import FilterBar from '@/components/ui/FilterBar'
import DataTable from '@/components/ui/DataTable'
import type { ColumnDef } from '@/components/ui/DataTable'
import LoanReportFormModal from '@/components/loan-report/LoanReportFormModal'
import type { LoanReportFormData } from '@/components/loan-report/LoanReportFormModal'

interface LoanReport {
  id: number
  cName: string
  cId: number
  amount: number
  currency: string
  detail: string
  date: string | null
  createdAt: string
}

function formatDate(d: string | null) {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' })
  } catch {
    return d
  }
}

export default function LoanReportsPage() {
  const router = useRouter()
  const [data, setData] = useState<LoanReport[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [customerId, setCustomerId] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<LoanReport | null>(null)
  const [customers, setCustomers] = useState<{ id: number; customerName?: string; name?: string }[]>([])

  useEffect(() => {
    axios.get<{ success?: boolean; data?: { id: number; customerName?: string; name?: string }[] }>('/api/customer/registered-customers', { params: { limit: 500 } })
      .then(({ data: res }) => setCustomers(Array.isArray(res?.data) ? res.data : []))
      .catch(() => setCustomers([]))
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = { page: String(page), limit: String(limit) }
      if (customerId) params.customerId = customerId
      const { data: res } = await axios.get<{ success?: boolean; data?: LoanReport[]; total?: number }>(
        '/api/loan-report/list',
        { params }
      )
      const list = Array.isArray(res?.data) ? res.data : []
      setData(list)
      setTotal(Number(res?.total) >= 0 ? Number(res.total) : list.length)
    } catch (err: unknown) {
      console.error('Failed to load loan reports:', err)
      setData([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit, customerId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (row: LoanReport) => {
    setEditing(row)
    setModalOpen(true)
  }

  const columns: ColumnDef<LoanReport>[] = [
    { key: 'id', label: '#' },
    { key: 'cName', label: 'نام مشتری' },
    { key: 'amount', label: 'مبلغ', render: (r) => (r.amount != null ? Number(r.amount).toLocaleString() : '—') },
    { key: 'currency', label: 'واحد پول' },
    { key: 'date', label: 'تاریخ', render: (r) => formatDate(r.date) },
    { key: 'detail', label: 'جزئیات', render: (r) => (r.detail ? String(r.detail).slice(0, 40) + (String(r.detail).length > 40 ? '…' : '') : '—') },
    {
      key: 'actions',
      label: 'عملیات',
      render: (r) => (
        <div className="flex gap-2">
          <button type="button" onClick={() => openEdit(r)} className="btn-luxury btn-luxury-outline py-1.5 px-3 text-sm">ویرایش</button>
          <button type="button" onClick={() => router.push(`/loan-reports/${r.id}`)} className="btn-luxury btn-luxury-primary py-1.5 px-3 text-sm">مشاهده</button>
        </div>
      )
    }
  ]

  const extraFilters = (
    <FormField label="مشتری">
      <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="input-luxury min-w-[180px]">
        <option value="">همه</option>
        {customers.map((c) => (
          <option key={c.id} value={c.id}>{c.customerName ?? c.name ?? ''}</option>
        ))}
      </select>
    </FormField>
  )

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal">گزارش قرض</h1>
          <p className="mt-1 text-sm text-charcoal-soft">لیست گزارشات قرض را با فیلتر مشاهده کنید.</p>
        </div>
        <button type="button" onClick={openCreate} className="btn-luxury btn-luxury-primary px-6 py-2 shrink-0">افزودن گزارش قرض</button>
      </header>
      <section>
        <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">لیست گزارشات قرض</h2>
        <FilterBar extraFilters={extraFilters} onReset={() => setCustomerId('')} />
        <div className="mt-4">
          <DataTable<LoanReport>
            columns={columns}
            data={data}
            keyField="id"
            loading={loading}
            emptyMessage="گزارش قرض یافت نشد"
            pagination={{ page, limit, total, onPageChange: setPage, onLimitChange: setLimit }}
            minWidth="800px"
          />
        </div>
      </section>
      <LoanReportFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        mode={editing ? 'edit' : 'create'}
        initialData={editing ? (editing as LoanReportFormData) : null}
        onSuccess={fetchData}
      />
    </div>
  )
}
