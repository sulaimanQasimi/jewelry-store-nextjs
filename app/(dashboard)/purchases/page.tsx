'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import DataTable from '@/components/ui/DataTable'
import type { ColumnDef } from '@/components/ui/DataTable'

interface Purchase {
  id: number
  supplierId: number
  supplierName: string
  totalAmount: number | null
  bellNumber: number
  currency: string
  paidAmount: number
  date: string
}

export default function PurchasesPage() {
  const router = useRouter()
  const [data, setData] = useState<Purchase[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [supplierId, setSupplierId] = useState('')
  const [suppliers, setSuppliers] = useState<{ id: number; name: string }[]>([])
  const [loading, setLoading] = useState(false)

  const fetchSuppliers = useCallback(async () => {
    try {
      const { data: res } = await axios.get<{ success?: boolean; data?: { id: number; name: string }[] }>(
        '/api/supplier/get-all',
        { params: { limit: 500 } }
      )
      setSuppliers(Array.isArray(res?.data) ? res.data : [])
    } catch {
      setSuppliers([])
    }
  }, [])

  const fetchPurchases = useCallback(async () => {
    setLoading(true)
    try {
      const { data: res } = await axios.get<{ success?: boolean; data?: Purchase[]; total?: number }>(
        '/api/purchase/list',
        { params: { page, limit, supplierId: supplierId || undefined } }
      )
      const list = Array.isArray(res?.data) ? res.data : []
      setData(list)
      setTotal(Number(res?.total) >= 0 ? Number(res.total) : list.length)
    } catch (err: unknown) {
      console.error('Failed to load purchases:', err)
      setData([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit, supplierId])

  useEffect(() => {
    fetchSuppliers()
  }, [fetchSuppliers])

  useEffect(() => {
    fetchPurchases()
  }, [fetchPurchases])

  const formatDate = (d: string) => {
    if (!d) return '—'
    try {
      return new Date(d).toLocaleDateString('fa-IR')
    } catch {
      return d
    }
  }

  const columns: ColumnDef<Purchase>[] = [
    { key: 'id', label: '#' },
    { key: 'bellNumber', label: 'شماره بل' },
    { key: 'supplierName', label: 'تمویل‌کننده' },
    { key: 'totalAmount', label: 'مبلغ کل', render: (r) => (r.totalAmount != null ? r.totalAmount.toLocaleString('fa-IR') : '—') },
    { key: 'paidAmount', label: 'پرداختی', render: (r) => r.paidAmount.toLocaleString('fa-IR') },
    { key: 'currency', label: 'واحد' },
    { key: 'date', label: 'تاریخ', render: (r) => formatDate(r.date) },
    {
      key: 'actions',
      label: 'عملیات',
      render: (r) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.push(`/purchases/${r.id}`)}
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
          <h1 className="font-heading text-2xl font-semibold text-charcoal">لیست خریدها</h1>
          <p className="mt-1 text-sm text-charcoal-soft">لیست خریدها را با فیلتر و صفحه‌بندی مشاهده کنید.</p>
        </div>
        <button
          type="button"
          onClick={() => router.push('/purchases/new')}
          className="btn-luxury btn-luxury-primary px-6 py-2 shrink-0"
        >
          افزودن خرید
        </button>
      </header>

      <section>
        <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">لیست خریدها</h2>
        <div className="flex flex-wrap gap-4 items-end mb-4">
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-charcoal mb-1">تمویل‌کننده</label>
            <select
              className="input-luxury w-full"
              value={supplierId}
              onChange={(e) => {
                setSupplierId(e.target.value)
                setPage(1)
              }}
            >
              <option value="">همه</option>
              {suppliers.map((s) => (
                <option key={s.id} value={String(s.id)}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => { setSupplierId(''); setPage(1); fetchPurchases() }}
            className="btn-luxury btn-luxury-outline py-2 px-4"
          >
            پاک کردن فیلتر
          </button>
        </div>
        <div className="mt-4">
          <DataTable<Purchase>
            columns={columns}
            data={data}
            keyField="id"
            loading={loading}
            emptyMessage="خریدی یافت نشد"
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
      </section>
    </div>
  )
}
