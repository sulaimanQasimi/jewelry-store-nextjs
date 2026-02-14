'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-toastify'
import FilterBar from '@/components/ui/FilterBar'
import DataTable from '@/components/ui/DataTable'
import type { ColumnDef } from '@/components/ui/DataTable'
import ProductFormModal from '@/components/product/ProductFormModal'
import type { ProductFormData } from '@/components/product/ProductFormModal'

interface Product {
  id: number
  productName: string
  type: string
  gram: number
  karat: number
  purchasePriceToAfn: number
  bellNumber?: number | null
  isSold: boolean
  image?: string | null
  barcode: string
  wage?: number | null
  auns?: number | null
  createdAt?: string
  updatedAt?: string
}

function normalizeProduct(row: Record<string, unknown>): Product {
  return {
    id: Number(row.id),
    productName: String(row.productName ?? row.productname ?? ''),
    type: String(row.type ?? ''),
    gram: Number(row.gram ?? 0),
    karat: Number(row.karat ?? 0),
    purchasePriceToAfn: Number(row.purchasePriceToAfn ?? row.purchasepricetoafn ?? 0),
    bellNumber: row.bellNumber != null || row.bellnumber != null ? Number(row.bellNumber ?? row.bellnumber) : null,
    isSold: Boolean(row.isSold ?? row.issold),
    image: row.image != null ? String(row.image) : null,
    barcode: String(row.barcode ?? ''),
    wage: row.wage != null ? Number(row.wage) : null,
    auns: row.auns != null ? Number(row.auns) : null,
    createdAt: row.createdAt != null ? String(row.createdAt) : undefined,
    updatedAt: row.updatedAt != null ? String(row.updatedAt) : undefined
  }
}

export default function ProductsPage() {
  const router = useRouter()
  const [data, setData] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [isSoldFilter, setIsSoldFilter] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string | number> = { page, limit }
      if (search) params.search = search
      if (isSoldFilter !== '') params.isSold = isSoldFilter
      const { data: res } = await axios.get<{ success?: boolean; data?: Record<string, unknown>[]; total?: number }>(
        '/api/product/list',
        { params }
      )
      const raw = Array.isArray(res?.data) ? res.data : []
      setData(raw.map(normalizeProduct))
      setTotal(Number(res?.total) >= 0 ? Number(res.total) : raw.length)
    } catch (err: unknown) {
      console.error('Failed to load products:', err)
      setData([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit, search, isSoldFilter])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const openCreate = () => {
    setEditingProduct(null)
    setModalOpen(true)
  }

  const openEdit = (row: Product) => {
    setEditingProduct(row)
    setModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('آیا از حذف این محصول اطمینان دارید؟')) return
    setDeletingId(id)
    try {
      const { data: res } = await axios.delete(`/api/product/delete-product/${id}`)
      if (res.success) {
        toast.success(res.message ?? 'حذف شد')
        fetchProducts()
      } else toast.error(res.message)
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message : (err as Error)?.message
      toast.error(String(msg ?? 'خطا در حذف'))
    } finally {
      setDeletingId(null)
    }
  }

  const columns: ColumnDef<Product>[] = [
    {
      key: 'image',
      label: 'عکس',
      render: (r) => (
        <div className="w-10 h-10 rounded-lg border border-gold-200 bg-gold-50/50 overflow-hidden flex items-center justify-center shrink-0">
          {r.image ? (
            <img
              src={r.image.startsWith('http') ? r.image : (typeof window !== 'undefined' ? window.location.origin : '') + r.image}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-charcoal-soft text-xs">—</span>
          )}
        </div>
      )
    },
    { key: 'id', label: '#' },
    { key: 'productName', label: 'نام جنس' },
    { key: 'type', label: 'نوع' },
    { key: 'gram', label: 'وزن', render: (r) => r.gram.toLocaleString('fa-IR') },
    { key: 'karat', label: 'عیار', render: (r) => r.karat.toLocaleString('fa-IR') },
    {
      key: 'purchasePriceToAfn',
      label: 'قیمت خرید',
      render: (r) => r.purchasePriceToAfn?.toLocaleString('fa-IR') ?? '—'
    },
    { key: 'barcode', label: 'بارکود', className: 'phone-ltr', render: (r) => r.barcode || '—' },
    {
      key: 'isSold',
      label: 'وضعیت',
      render: (r) => (r.isSold ? <span className="text-rose-600">فروخته شده</span> : <span className="text-green-600">موجود</span>)
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
            onClick={() => router.push(`/products/${r.id}`)}
            className="btn-luxury btn-luxury-primary py-1.5 px-3 text-sm"
          >
            مشاهده
          </button>
          <button
            type="button"
            onClick={() => handleDelete(r.id)}
            disabled={deletingId === r.id}
            className="btn-luxury py-1.5 px-3 text-sm bg-rose-600 hover:bg-rose-700 text-white border-0 disabled:opacity-60"
          >
            {deletingId === r.id ? '...' : 'حذف'}
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal">اجناس</h1>
          <p className="mt-1 text-sm text-charcoal-soft">لیست اجناس را با فیلتر و صفحه‌بندی مشاهده کنید.</p>
        </div>
        <button type="button" onClick={openCreate} className="btn-luxury btn-luxury-primary px-6 py-2 shrink-0">
          افزودن جنس
        </button>
      </header>

      <section>
        <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">لیست اجناس</h2>
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="نام، نوع یا بارکود..."
          onReset={() => { setSearch(''); setIsSoldFilter('') }}
        />
        <div className="mt-2 flex gap-2 items-center">
          <label className="text-sm text-charcoal-soft">وضعیت:</label>
          <select
            value={isSoldFilter}
            onChange={(e) => setIsSoldFilter(e.target.value)}
            className="input-luxury w-40"
          >
            <option value="">همه</option>
            <option value="false">موجود</option>
            <option value="true">فروخته شده</option>
          </select>
        </div>
        <div className="mt-4">
          <DataTable<Product>
            columns={columns}
            data={data}
            keyField="id"
            loading={loading}
            emptyMessage="جنس یافت نشد"
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

      <ProductFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingProduct(null) }}
        mode={editingProduct ? 'edit' : 'create'}
        initialData={editingProduct ? (editingProduct as ProductFormData) : null}
        onSuccess={fetchProducts}
      />
    </div>
  )
}
