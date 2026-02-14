'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import FilterBar from '@/components/ui/FilterBar'
import DataTable from '@/components/ui/DataTable'
import type { ColumnDef } from '@/components/ui/DataTable'
import TraderFormModal from '@/components/trader/TraderFormModal'
import type { TraderFormData } from '@/components/trader/TraderFormModal'

interface Trader {
  id: number
  name: string
  phone: string
  address: string | null
  createdAt: string
  updatedAt: string
}

export default function NewTradePage() {
  const router = useRouter()
  const [data, setData] = useState<Trader[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTrader, setEditingTrader] = useState<Trader | null>(null)

  const fetchTraders = useCallback(async () => {
    setLoading(true)
    try {
      const { data: res } = await axios.get<{ success?: boolean; data?: Trader[]; total?: number }>(
        '/api/trader/list',
        { params: { page, limit, search: search || undefined } }
      )
      const list = Array.isArray(res?.data) ? res.data : []
      setData(list)
      setTotal(Number(res?.total) >= 0 ? Number(res.total) : list.length)
    } catch (err: unknown) {
      console.error('Failed to load traders:', err)
      setData([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit, search])

  useEffect(() => {
    fetchTraders()
  }, [fetchTraders])

  const openCreate = () => {
    setEditingTrader(null)
    setModalOpen(true)
  }

  const openEdit = (row: Trader) => {
    setEditingTrader(row)
    setModalOpen(true)
  }

  const columns: ColumnDef<Trader>[] = [
    { key: 'id', label: '#' },
    { key: 'name', label: 'نام' },
    { key: 'phone', label: 'شماره تماس' },
    {
      key: 'address',
      label: 'آدرس',
      render: (r) => (r.address ? String(r.address).slice(0, 40) + (String(r.address).length > 40 ? '…' : '') : '—')
    },
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
            onClick={() => router.push(`/new-trade/${r.id}`)}
            className="btn-luxury btn-luxury-primary py-1.5 px-3 text-sm"
          >
            مشاهده
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal">معامله‌داران</h1>
          <p className="mt-1 text-sm text-charcoal-soft">لیست معامله‌داران را با فیلتر و صفحه‌بندی مشاهده کنید.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="btn-luxury btn-luxury-primary px-6 py-2 shrink-0"
        >
          افزودن معامله‌دار
        </button>
      </header>

      <section>
        <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">لیست معامله‌داران</h2>
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="نام یا شماره تماس..."
          onReset={() => setSearch('')}
        />
        <div className="mt-4">
          <DataTable<Trader>
            columns={columns}
            data={data}
            keyField="id"
            loading={loading}
            emptyMessage="معامله‌دار یافت نشد"
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

      <TraderFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingTrader(null)
        }}
        mode={editingTrader ? 'edit' : 'create'}
        initialData={editingTrader ? (editingTrader as TraderFormData) : null}
        onSuccess={fetchTraders}
      />
    </div>
  )
}
