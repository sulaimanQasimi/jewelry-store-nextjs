'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import FormField from '@/components/ui/FormField'
import FilterBar from '@/components/ui/FilterBar'
import DataTable from '@/components/ui/DataTable'
import type { ColumnDef } from '@/components/ui/DataTable'
import PersonalExpenseFormModal from '@/components/personal-expense/PersonalExpenseFormModal'
import type { PersonalExpenseFormData } from '@/components/personal-expense/PersonalExpenseFormModal'

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

export default function PersonalExpensesPage() {
  const router = useRouter()
  const [data, setData] = useState<PersonalExpense[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [personId, setPersonId] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<PersonalExpense | null>(null)
  const [persons, setPersons] = useState<{ id: number; name: string }[]>([])

  useEffect(() => {
    axios.get<{ success?: boolean; data?: { id: number; name: string }[] }>('/api/person/list', { params: { limit: 500 } })
      .then(({ data: res }) => setPersons(Array.isArray(res?.data) ? res.data : []))
      .catch(() => setPersons([]))
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = { page: String(page), limit: String(limit) }
      if (personId) params.personId = personId
      const { data: res } = await axios.get<{ success?: boolean; data?: PersonalExpense[]; total?: number }>(
        '/api/personal-expense/list',
        { params }
      )
      const list = Array.isArray(res?.data) ? res.data : []
      setData(list)
      setTotal(Number(res?.total) >= 0 ? Number(res.total) : list.length)
    } catch (err: unknown) {
      console.error('Failed to load personal expenses:', err)
      setData([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit, personId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (row: PersonalExpense) => {
    setEditing(row)
    setModalOpen(true)
  }

  const columns: ColumnDef<PersonalExpense>[] = [
    { key: 'id', label: '#' },
    { key: 'name', label: 'نام' },
    { key: 'personName', label: 'شخص', render: (r) => r.personName ?? '—' },
    { key: 'amount', label: 'مبلغ', render: (r) => (r.amount != null ? Number(r.amount).toLocaleString() : '—') },
    { key: 'currency', label: 'واحد پول' },
    { key: 'createdAt', label: 'تاریخ', render: (r) => formatDate(r.createdAt) },
    {
      key: 'actions',
      label: 'عملیات',
      render: (r) => (
        <div className="flex gap-2">
          <button type="button" onClick={() => openEdit(r)} className="btn-luxury btn-luxury-outline py-1.5 px-3 text-sm">ویرایش</button>
          <button type="button" onClick={() => router.push(`/personal-expenses/${r.id}`)} className="btn-luxury btn-luxury-primary py-1.5 px-3 text-sm">مشاهده</button>
        </div>
      )
    }
  ]

  const extraFilters = (
    <FormField label="شخص">
      <select value={personId} onChange={(e) => setPersonId(e.target.value)} className="input-luxury min-w-[180px]">
        <option value="">همه</option>
        {persons.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
    </FormField>
  )

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal">مصارف شخصی</h1>
          <p className="mt-1 text-sm text-charcoal-soft">لیست مصارف شخصی را با فیلتر مشاهده کنید.</p>
        </div>
        <button type="button" onClick={openCreate} className="btn-luxury btn-luxury-primary px-6 py-2 shrink-0">افزودن مصرف شخصی</button>
      </header>
      <section>
        <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">لیست مصارف شخصی</h2>
        <FilterBar extraFilters={extraFilters} onReset={() => setPersonId('')} />
        <div className="mt-4">
          <DataTable<PersonalExpense>
            columns={columns}
            data={data}
            keyField="id"
            loading={loading}
            emptyMessage="مصرف شخصی یافت نشد"
            pagination={{ page, limit, total, onPageChange: setPage, onLimitChange: setLimit }}
            minWidth="800px"
          />
        </div>
      </section>
      <PersonalExpenseFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        mode={editing ? 'edit' : 'create'}
        initialData={editing ? (editing as PersonalExpenseFormData) : null}
        onSuccess={fetchData}
      />
    </div>
  )
}
