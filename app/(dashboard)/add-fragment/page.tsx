'use client'

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import DataTable from '@/components/ui/DataTable'
import type { ColumnDef } from '@/components/ui/DataTable'
import FragmentFormModal from '@/components/fragment/FragmentFormModal'
import type { FragmentFormData } from '@/components/fragment/FragmentFormModal'

interface Fragment {
  id: number
  gram: number
  wareHouse: number
  changedToPasa: number
  remain: number | null
  amount: number
  detail: string | null
  isCompleted: boolean
  date: string
}

export default function AddFragmentPage() {
  const [data, setData] = useState<Fragment[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingFragment, setEditingFragment] = useState<Fragment | null>(null)

  const fetchFragments = useCallback(async () => {
    setLoading(true)
    try {
      const { data: res } = await axios.get<{ success?: boolean; data?: Fragment[]; total?: number }>(
        '/api/fragment/list',
        { params: { page, limit } }
      )
      const list = Array.isArray(res?.data) ? res.data : []
      setData(list)
      setTotal(Number(res?.total) >= 0 ? Number(res.total) : list.length)
    } catch (err: unknown) {
      console.error('Failed to load fragments:', err)
      setData([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit])

  useEffect(() => {
    fetchFragments()
  }, [fetchFragments])

  const formatDate = (d: string) => {
    if (!d) return '—'
    try {
      return new Date(d).toLocaleDateString('fa-IR')
    } catch {
      return d
    }
  }

  const columns: ColumnDef<Fragment>[] = [
    { key: 'id', label: '#' },
    { key: 'gram', label: 'گرم', render: (r) => r.gram.toLocaleString('fa-IR') },
    { key: 'wareHouse', label: 'انبار', render: (r) => r.wareHouse.toLocaleString('fa-IR') },
    { key: 'changedToPasa', label: 'تبدیل به پاسا', render: (r) => r.changedToPasa.toLocaleString('fa-IR') },
    { key: 'remain', label: 'باقی‌مانده', render: (r) => (r.remain != null ? r.remain.toLocaleString('fa-IR') : '—') },
    { key: 'amount', label: 'مبلغ', render: (r) => r.amount.toLocaleString('fa-IR') },
    { key: 'detail', label: 'توضیحات', render: (r) => (r.detail ? String(r.detail).slice(0, 40) + (String(r.detail).length > 40 ? '…' : '') : '—') },
    { key: 'isCompleted', label: 'وضعیت', render: (r) => (r.isCompleted ? 'تکمیل' : 'در حال') },
    { key: 'date', label: 'تاریخ', render: (r) => formatDate(r.date) },
    {
      key: 'actions',
      label: 'عملیات',
      render: (r) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingFragment(r)
              setModalOpen(true)
            }}
            className="btn-luxury btn-luxury-outline py-1.5 px-3 text-sm"
          >
            ویرایش
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal">خرید شکسته</h1>
          <p className="mt-1 text-sm text-charcoal-soft">ثبت و مدیریت شکسته‌ها</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingFragment(null)
            setModalOpen(true)
          }}
          className="btn-luxury btn-luxury-primary px-6 py-2 shrink-0"
        >
          افزودن شکسته
        </button>
      </header>

      <section>
        <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">لیست شکسته‌ها</h2>
        <DataTable<Fragment>
          columns={columns}
          data={data}
          keyField="id"
          loading={loading}
          emptyMessage="شکسته‌ای یافت نشد"
          pagination={{
            page,
            limit,
            total,
            onPageChange: setPage,
            onLimitChange: setLimit
          }}
          minWidth="900px"
        />
      </section>

      <FragmentFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingFragment(null)
        }}
        mode={editingFragment ? 'edit' : 'create'}
        initialData={editingFragment ? (editingFragment as FragmentFormData) : null}
        onSuccess={fetchFragments}
      />
    </div>
  )
}
