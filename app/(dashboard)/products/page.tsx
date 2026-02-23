'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-toastify'
import FilterBar from '@/components/ui/FilterBar'
import DataTable from '@/components/ui/DataTable'
import type { ColumnDef } from '@/components/ui/DataTable'
import LabelPrintModal from '@/components/product/LabelPrintModal'
import type { LabelPrintProduct } from '@/components/product/LabelPrintModal'
import { ChevronDown, ChevronUp, Filter } from 'lucide-react'
import PersianDatePicker from '@/components/ui/PersianDatePicker'

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
  categories?: { id: number; name: string }[]
}

function normalizeProduct(row: Record<string, unknown>): Product {
  const categories = Array.isArray(row.categories)
    ? (row.categories as { id: number; name: string }[]).map((c) => ({ id: Number(c.id), name: String(c.name ?? '') }))
    : undefined
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
    updatedAt: row.updatedAt != null ? String(row.updatedAt) : undefined,
    categories
  }
}

interface FilterState {
  search: string
  isSold: string
  type: string
  gramMin: string
  gramMax: string
  karatMin: string
  karatMax: string
  priceMin: string
  priceMax: string
  dateFrom: string
  dateTo: string
  isFragment: string
  sortBy: string
  sortOrder: string
}

const emptyFilters: FilterState = {
  search: '',
  isSold: '',
  type: '',
  gramMin: '',
  gramMax: '',
  karatMin: '',
  karatMax: '',
  priceMin: '',
  priceMax: '',
  dateFrom: '',
  dateTo: '',
  isFragment: '',
  sortBy: 'createdAt',
  sortOrder: 'desc'
}

function countActiveFilters(f: FilterState): number {
  let c = 0
  if (f.search) c++
  if (f.isSold !== '') c++
  if (f.type) c++
  if (f.gramMin) c++
  if (f.gramMax) c++
  if (f.karatMin) c++
  if (f.karatMax) c++
  if (f.priceMin) c++
  if (f.priceMax) c++
  if (f.dateFrom) c++
  if (f.dateTo) c++
  if (f.isFragment !== '') c++
  return c
}

export default function ProductsPage() {
  const router = useRouter()
  const [data, setData] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filters, setFilters] = useState<FilterState>(emptyFilters)
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(emptyFilters)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [labelModalProduct, setLabelModalProduct] = useState<LabelPrintProduct | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const f = appliedFilters
      const params: Record<string, string | number> = { page, limit }
      if (f.search) params.search = f.search
      if (f.isSold !== '') params.isSold = f.isSold
      if (f.type) params.type = f.type
      if (f.gramMin) params.gramMin = f.gramMin
      if (f.gramMax) params.gramMax = f.gramMax
      if (f.karatMin) params.karatMin = f.karatMin
      if (f.karatMax) params.karatMax = f.karatMax
      if (f.priceMin) params.priceMin = f.priceMin
      if (f.priceMax) params.priceMax = f.priceMax
      if (f.dateFrom) params.dateFrom = f.dateFrom
      if (f.dateTo) params.dateTo = f.dateTo
      if (f.isFragment !== '') params.isFragment = f.isFragment
      if (f.sortBy) params.sortBy = f.sortBy
      if (f.sortOrder) params.sortOrder = f.sortOrder

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
  }, [page, limit, appliedFilters])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const openCreate = () => router.push('/products/new')

  const openEdit = (row: Product) => router.push(`/products/${row.id}/edit`)

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

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters(emptyFilters)
    setAppliedFilters(emptyFilters)
    setPage(1)
  }

  const applyFilters = () => {
    setAppliedFilters(filters)
    setPage(1)
  }

  const activeCount = countActiveFilters(appliedFilters)

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
    {
      key: 'categories',
      label: 'دسته‌ها',
      render: (r) => (
        <div className="flex flex-wrap gap-1">
          {(r.categories ?? []).length === 0
            ? '—'
            : (r.categories ?? []).map((c) => (
                <span key={c.id} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200">
                  {c.name}
                </span>
              ))}
        </div>
      )
    },
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
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setLabelModalProduct({ id: r.id, productName: r.productName, barcode: r.barcode, gram: r.gram, karat: r.karat })}
            className="py-1.5 px-3 text-sm rounded-lg border border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
          >
            چاپ برچسب
          </button>
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
          search={filters.search}
          onSearchChange={(v) => updateFilter('search', v)}
          searchPlaceholder="نام، نوع یا بارکود..."
          onReset={resetFilters}
          extraFilters={
            <button
              type="button"
              onClick={applyFilters}
              className="btn-luxury btn-luxury-primary py-2 px-4"
            >
              اعمال
            </button>
          }
        />

        <div className="mt-4 space-y-4">
          <button
            type="button"
            onClick={() => setAdvancedOpen((o) => !o)}
            className="flex items-center gap-2 text-charcoal font-medium hover:text-gold-600 transition-colors"
          >
            <Filter className="h-4 w-4" />
            فیلتر پیشرفته
            {activeCount > 0 && (
              <span className="bg-gold-500 text-white text-xs px-2 py-0.5 rounded-full">
                {activeCount}
              </span>
            )}
            {advancedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {advancedOpen && (
            <div className="card-luxury p-6 border border-gold-200/60">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">وضعیت فروش</label>
                  <select
                    value={filters.isSold}
                    onChange={(e) => updateFilter('isSold', e.target.value)}
                    className="input-luxury w-full"
                  >
                    <option value="">همه</option>
                    <option value="false">موجود</option>
                    <option value="true">فروخته شده</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">نوع</label>
                  <input
                    type="text"
                    value={filters.type}
                    onChange={(e) => updateFilter('type', e.target.value)}
                    placeholder="مثال: انگشتر"
                    className="input-luxury w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">شکسته</label>
                  <select
                    value={filters.isFragment}
                    onChange={(e) => updateFilter('isFragment', e.target.value)}
                    className="input-luxury w-full"
                  >
                    <option value="">همه</option>
                    <option value="false">عادی</option>
                    <option value="true">شکسته</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">مرتب‌سازی</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => updateFilter('sortBy', e.target.value)}
                    className="input-luxury w-full"
                  >
                    <option value="createdAt">تاریخ ثبت</option>
                    <option value="productName">نام</option>
                    <option value="gram">وزن</option>
                    <option value="karat">عیار</option>
                    <option value="purchasePriceToAfn">قیمت خرید</option>
                    <option value="bellNumber">شماره بل</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">ترتیب</label>
                  <select
                    value={filters.sortOrder}
                    onChange={(e) => updateFilter('sortOrder', e.target.value)}
                    className="input-luxury w-full"
                  >
                    <option value="desc">نزولی</option>
                    <option value="asc">صعودی</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">وزن از (گرم)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={filters.gramMin}
                    onChange={(e) => updateFilter('gramMin', e.target.value)}
                    placeholder="حداقل"
                    className="input-luxury w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">وزن تا (گرم)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={filters.gramMax}
                    onChange={(e) => updateFilter('gramMax', e.target.value)}
                    placeholder="حداکثر"
                    className="input-luxury w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">عیار از</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={filters.karatMin}
                    onChange={(e) => updateFilter('karatMin', e.target.value)}
                    placeholder="حداقل"
                    className="input-luxury w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">عیار تا</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={filters.karatMax}
                    onChange={(e) => updateFilter('karatMax', e.target.value)}
                    placeholder="حداکثر"
                    className="input-luxury w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">قیمت از (افغانی)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={filters.priceMin}
                    onChange={(e) => updateFilter('priceMin', e.target.value)}
                    placeholder="حداقل"
                    className="input-luxury w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">قیمت تا (افغانی)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={filters.priceMax}
                    onChange={(e) => updateFilter('priceMax', e.target.value)}
                    placeholder="حداکثر"
                    className="input-luxury w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">از تاریخ</label>
                  <PersianDatePicker
                    value={filters.dateFrom || null}
                    onChange={(v) => updateFilter('dateFrom', v ?? '')}
                    className="input-luxury w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">تا تاریخ</label>
                  <PersianDatePicker
                    value={filters.dateTo || null}
                    onChange={(v) => updateFilter('dateTo', v ?? '')}
                    className="input-luxury w-full"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4 pt-4 border-t border-gold-200">
                <button type="button" onClick={applyFilters} className="btn-luxury btn-luxury-primary px-6 py-2">
                  اعمال فیلتر
                </button>
                <button type="button" onClick={resetFilters} className="btn-luxury btn-luxury-outline px-6 py-2">
                  پاک کردن همه
                </button>
              </div>
            </div>
          )}
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

      <LabelPrintModal
        open={labelModalProduct != null}
        onClose={() => setLabelModalProduct(null)}
        product={labelModalProduct}
      />
    </div>
  )
}
