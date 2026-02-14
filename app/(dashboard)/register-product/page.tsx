'use client'

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import FilterBar from '@/components/ui/FilterBar'
import DataTable from '@/components/ui/DataTable'
import type { ColumnDef } from '@/components/ui/DataTable'

interface Product {
  id: number
  productName: string
  type: string
  gram: number
  karat: number
  purchasePriceToAfn: number
  bellNumber: number | null
  isSold: boolean
  image: string | null
  barcode: string
  wage: number | null
  auns: number | null
  isFragment: boolean
  createdAt: string
  updatedAt: string
}

export default function RegisterProductPage() {
  const [data, setData] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [isSoldFilter, setIsSoldFilter] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = { page: String(page), limit: String(limit) }
      if (search) params.search = search
      if (isSoldFilter !== '') params.isSold = isSoldFilter
      const { data: res } = await axios.get<{ success: boolean; data: Product[]; total: number }>(
        '/api/product/list',
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
  }, [page, limit, search, isSoldFilter])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const columns: ColumnDef<Product>[] = [
    { key: 'id', label: '#' },
    { key: 'productName', label: 'نام جنس' },
    { key: 'type', label: 'نوعیت' },
    { key: 'gram', label: 'گرام' },
    { key: 'karat', label: 'عیار' },
    { key: 'purchasePriceToAfn', label: 'قیمت خرید', render: (r) => r.purchasePriceToAfn?.toLocaleString() ?? '-' },
    { key: 'barcode', label: 'بارکود' },
    { key: 'isSold', label: 'فروخته شده', render: (r) => (r.isSold ? 'بله' : 'خیر') }
  ]

  const extraFilters = (
    <div className="flex items-end gap-2">
      <label className="text-sm font-medium text-charcoal">وضعیت فروش</label>
      <select
        value={isSoldFilter}
        onChange={(e) => setIsSoldFilter(e.target.value)}
        className="input-luxury min-w-[100px]"
      >
        <option value="">همه</option>
        <option value="false">فروخته نشده</option>
        <option value="true">فروخته شده</option>
      </select>
    </div>
  )

  const resetFilters = () => {
    setSearch('')
    setIsSoldFilter('')
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold text-charcoal">ثبت اجناس شکسته</h1>
        <p className="mt-1 text-sm text-charcoal-soft">لیست اجناس با فیلتر و صفحه‌بندی.</p>
      </header>

      <section>
        <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">لیست اجناس</h2>
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="نام، نوع یا بارکود..."
          extraFilters={extraFilters}
          onReset={resetFilters}
        />
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
          />
        </div>
      </section>
    </div>
  )
}
