'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import FilterBar from '@/components/ui/FilterBar'
import DataTable from '@/components/ui/DataTable'
import type { ColumnDef } from '@/components/ui/DataTable'
import SupplierProductFormModal from '@/components/supplier/SupplierProductFormModal'
import type { SupplierProduct } from '@/types/supplierProduct'
import type { SupplierProductFormData } from '@/types/supplierProduct'

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateStr
  }
}

export default function RegisterSupplierProductPage() {
  const router = useRouter()
  const [data, setData] = useState<SupplierProduct[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<SupplierProduct | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const { data: res } = await axios.get<{ success?: boolean; data?: SupplierProduct[]; total?: number }>(
        '/api/supplier-product/list',
        { params: { page, limit, search: search || undefined } }
      )
      const list = Array.isArray(res?.data) ? res.data : []
      setData(list)
      setTotal(Number(res?.total) >= 0 ? Number(res.total) : list.length)
    } catch (err: unknown) {
      console.error('Failed to load supplier products:', err)
      setData([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit, search])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const openCreate = () => {
    setEditingProduct(null)
    setModalOpen(true)
  }

  const openEdit = (row: SupplierProduct) => {
    setEditingProduct(row)
    setModalOpen(true)
  }

  const columns: ColumnDef<SupplierProduct>[] = [
    { key: 'id', label: '#' },
    { key: 'supplierName', label: 'تمویل‌کننده' },
    { key: 'name', label: 'نام جنس' },
    { key: 'type', label: 'نوعیت', render: (r) => r.type ?? '—' },
    { key: 'karat', label: 'عیار', render: (r) => r.karat ?? '—' },
    { key: 'weight', label: 'وزن' },
    { key: 'pasa', label: 'پاسه', render: (r) => (r.pasa != null ? Number(r.pasa).toFixed(2) : '—') },
    { key: 'pasaRemaining', label: 'باقی پاسه', render: (r) => (r.pasaRemaining != null ? Number(r.pasaRemaining).toFixed(2) : '—') },
    { key: 'totalWage', label: 'مجموع وجوره', render: (r) => (r.totalWage != null ? Number(r.totalWage).toFixed(2) : '—') },
    { key: 'wageRemaining', label: 'باقی وجوره', render: (r) => (r.wageRemaining != null ? Number(r.wageRemaining).toFixed(2) : '—') },
    { key: 'createdAt', label: 'تاریخ', render: (r) => formatDate(r.createdAt) },
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
            onClick={() => router.push(`/register-supplier-product/${r.id}`)}
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
          <h1 className="font-heading text-2xl font-semibold text-charcoal">ثبت اجناس تمویل‌کننده</h1>
          <p className="mt-1 text-sm text-charcoal-soft">لیست اجناس تمویل را با فیلتر و صفحه‌بندی مشاهده کنید.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="btn-luxury btn-luxury-primary px-6 py-2 shrink-0"
        >
          افزودن جنس تمویل
        </button>
      </header>

      <section>
        <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">لیست اجناس تمویل‌کننده</h2>
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="نام جنس، نوع یا تمویل‌کننده..."
          onReset={() => setSearch('')}
        />
        <div className="mt-4">
          <DataTable<SupplierProduct>
            columns={columns}
            data={data}
            keyField="id"
            loading={loading}
            emptyMessage="جنس تمویل یافت نشد"
            pagination={{
              page,
              limit,
              total,
              onPageChange: setPage,
              onLimitChange: setLimit
            }}
            minWidth="1000px"
          />
        </div>
      </section>

      <SupplierProductFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingProduct(null)
        }}
        mode={editingProduct ? 'edit' : 'create'}
        initialData={editingProduct ? (editingProduct as SupplierProductFormData) : null}
        onSuccess={fetchProducts}
      />
    </div>
  )
}
