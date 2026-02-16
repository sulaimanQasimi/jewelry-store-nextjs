'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import FilterBar from '@/components/ui/FilterBar'
import DataTable from '@/components/ui/DataTable'
import type { ColumnDef } from '@/components/ui/DataTable'
import ProductMasterFormModal from '@/components/product-master/ProductMasterFormModal'
import type { ProductMasterFormData } from '@/components/product-master/ProductMasterFormModal'

interface ProductMaster {
  id: number
  name: string
  type: string
  gram: number
  karat: number
  isActive: boolean
}

export default function ProductMastersPage() {
  const router = useRouter()
  const [data, setData] = useState<ProductMaster[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ProductMaster | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const { data: res } = await axios.get<{ success?: boolean; data?: ProductMaster[]; total?: number }>(
        '/api/product-master/list',
        { params: { page, limit, search: search || undefined } }
      )
      const list = Array.isArray(res?.data) ? res.data : []
      setData(list)
      setTotal(Number(res?.total) >= 0 ? Number(res.total) : list.length)
    } catch (err: unknown) {
      console.error('Failed to load product masters:', err)
      setData([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit, search])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (row: ProductMaster) => {
    setEditing(row)
    setModalOpen(true)
  }

  const columns: ColumnDef<ProductMaster>[] = [
    { key: 'id', label: '#' },
    { key: 'name', label: 'نام' },
    { key: 'type', label: 'نوع' },
    { key: 'gram', label: 'وزن (گرام)', render: (r) => (r.gram != null ? Number(r.gram).toLocaleString() : '—') },
    { key: 'karat', label: 'عیار', render: (r) => (r.karat != null ? Number(r.karat).toLocaleString() : '—') },
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
            onClick={() => router.push(`/product-masters/${r.id}`)}
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
          <h1 className="font-heading text-2xl font-semibold text-charcoal">محصولات اصلی</h1>
          <p className="mt-1 text-sm text-charcoal-soft">لیست محصولات اصلی را با فیلتر و صفحه‌بندی مشاهده کنید.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="btn-luxury btn-luxury-primary px-6 py-2 shrink-0"
        >
          افزودن محصول اصلی
        </button>
      </header>

      <section>
        <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">لیست محصولات اصلی</h2>
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="نام یا نوع..."
          onReset={() => setSearch('')}
        />
        <div className="mt-4">
          <DataTable<ProductMaster>
            columns={columns}
            data={data}
            keyField="id"
            loading={loading}
            emptyMessage="محصول اصلی یافت نشد"
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

      <ProductMasterFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        mode={editing ? 'edit' : 'create'}
        initialData={editing ? (editing as ProductMasterFormData) : null}
        onSuccess={fetchData}
      />
    </div>
  )
}
