'use client'

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import FilterBar from '@/components/ui/FilterBar'
import DataTable from '@/components/ui/DataTable'
import type { ColumnDef } from '@/components/ui/DataTable'

export interface SupplierProductRow {
  id: number
  supplierId: number
  supplierName: string
  name: string
  type: string | null
  karat: number | null
  weight: number
  pasa: number
  pasaReceipt: number
  pasaRemaining: number
  wagePerGram: number | null
  totalWage: number
  wageReceipt: number
  wageRemaining: number
  detail: string | null
  createdAt: string
  updatedAt: string
}

interface SupplierProductTableProps {
  supplierId: number | null
  refreshKey?: number | string
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('fa-IR', {
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

export default function SupplierProductTable({ supplierId, refreshKey }: SupplierProductTableProps) {
  const [products, setProducts] = useState<SupplierProductRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchProducts = useCallback(async () => {
    if (!supplierId) {
      setProducts([])
      setTotal(0)
      return
    }
    setLoading(true)
    try {
      const { data } = await axios.get<{ success: boolean; data: SupplierProductRow[]; total: number }>(
        '/api/supplier-product/get',
        { params: { supplierId, page, limit, search: search || undefined } }
      )
      if (data.success) {
        setProducts(Array.isArray(data.data) ? data.data : [])
        setTotal(data.total ?? 0)
      } else {
        setProducts([])
        setTotal(0)
      }
    } catch {
      setProducts([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [supplierId, page, limit, search])

  useEffect(() => {
    setPage(1)
  }, [supplierId, refreshKey, search])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  if (supplierId == null) {
    return (
      <div className="card-luxury rounded-2xl border border-gold-200/50 p-8 text-center text-charcoal-soft">
        <p>برای مشاهده لیست اجناس، ابتدا یک تمویل‌کننده انتخاب کنید.</p>
      </div>
    )
  }

  const columns: ColumnDef<SupplierProductRow>[] = [
    { key: 'name', label: 'نام جنس' },
    { key: 'type', label: 'نوعیت', render: (r) => r.type ?? '—' },
    { key: 'karat', label: 'عیار', render: (r) => r.karat ?? '—' },
    { key: 'weight', label: 'وزن' },
    { key: 'pasa', label: 'پاسه' },
    { key: 'pasaReceipt', label: 'رسید پاسه' },
    { key: 'pasaRemaining', label: 'صرف باقی پاسه' },
    { key: 'wagePerGram', label: 'وجوره/گرم', render: (r) => r.wagePerGram ?? '—' },
    { key: 'totalWage', label: 'مجموع وجوره' },
    { key: 'wageReceipt', label: 'رسید وجوره' },
    { key: 'wageRemaining', label: 'صرف باقی وجوره' },
    { key: 'createdAt', label: 'تاریخ', render: (r) => formatDate(r.createdAt) }
  ]

  return (
    <>
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="نام یا نوع جنس..."
        onReset={() => setSearch('')}
      />
      <div className="mt-4">
        <DataTable<SupplierProductRow>
          columns={columns}
          data={products}
          keyField="id"
          loading={loading}
          emptyMessage="هنوز جنسی برای این تمویل‌کننده ثبت نشده است."
          pagination={{
            page,
            limit,
            total,
            onPageChange: setPage,
            onLimitChange: setLimit
          }}
          minWidth="900px"
        />
      </div>
    </>
  )
}
