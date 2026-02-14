'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import FilterBar from '@/components/ui/FilterBar'
import DataTable from '@/components/ui/DataTable'
import type { ColumnDef } from '@/components/ui/DataTable'
import SupplierFormModal from '@/components/supplier/SupplierFormModal'
import type { SupplierFormData } from '@/components/supplier/SupplierFormModal'

interface Supplier {
  id: number
  name: string
  phone: string
  address: string | null
  isActive: boolean
}

export default function SuppliersPage() {
  const router = useRouter()
  const [data, setData] = useState<Supplier[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)

  const fetchSuppliers = useCallback(async () => {
    setLoading(true)
    try {
      const { data: res } = await axios.get<{ success?: boolean; data?: Supplier[]; total?: number }>(
        '/api/supplier/get-all',
        { params: { page, limit, search: search || undefined } }
      )
      const list = Array.isArray(res?.data) ? res.data : []
      setData(list)
      setTotal(Number(res?.total) >= 0 ? Number(res.total) : list.length)
    } catch (err: unknown) {
      console.error('Failed to load suppliers:', err)
      setData([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit, search])

  useEffect(() => {
    fetchSuppliers()
  }, [fetchSuppliers])

  const openCreate = () => {
    setEditingSupplier(null)
    setModalOpen(true)
  }

  const openEdit = (row: Supplier) => {
    setEditingSupplier(row)
    setModalOpen(true)
  }

  const columns: ColumnDef<Supplier>[] = [
    { key: 'id', label: '#' },
    { key: 'name', label: 'نام' },
    { key: 'phone', label: 'شماره تماس' },
    { key: 'address', label: 'آدرس', render: (r) => (r.address ? String(r.address).slice(0, 40) + (String(r.address).length > 40 ? '…' : '') : '—') },
    {
      key: 'isActive',
      label: 'وضعیت',
      render: (r) => (r.isActive ? 'فعال' : 'غیرفعال')
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
            onClick={() => router.push(`/suppliers/${r.id}`)}
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
          <h1 className="font-heading text-2xl font-semibold text-charcoal">لیست تمویل‌کنندگان</h1>
          <p className="mt-1 text-sm text-charcoal-soft">لیست تمویل‌کنندگان را با فیلتر و صفحه‌بندی مشاهده کنید.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="btn-luxury btn-luxury-primary px-6 py-2 shrink-0"
        >
          افزودن تمویل‌کننده
        </button>
      </header>

      <section>
        <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">لیست تمویل‌کنندگان</h2>
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="نام تمویل‌کننده..."
          onReset={() => setSearch('')}
        />
        <div className="mt-4">
          <DataTable<Supplier>
            columns={columns}
            data={data}
            keyField="id"
            loading={loading}
            emptyMessage="تمویل‌کننده یافت نشد"
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

      <SupplierFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingSupplier(null)
        }}
        mode={editingSupplier ? 'edit' : 'create'}
        initialData={editingSupplier ? (editingSupplier as SupplierFormData) : null}
        onSuccess={fetchSuppliers}
      />
    </div>
  )
}
