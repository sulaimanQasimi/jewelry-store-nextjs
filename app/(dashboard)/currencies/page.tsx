'use client'

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import FilterBar from '@/components/ui/FilterBar'
import DataTable from '@/components/ui/DataTable'
import type { ColumnDef } from '@/components/ui/DataTable'
import CurrencyFormModal from '@/components/currency/CurrencyFormModal'
import type { CurrencyFormData } from '@/components/currency/CurrencyFormModal'

interface Currency {
  id: number
  code: string
  name_fa: string
  symbol: string | null
  rate: number | null
  is_default: number | boolean
  active: number | boolean
  sort_order: number
}

export default function CurrenciesPage() {
  const [data, setData] = useState<Currency[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Currency | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = { page: String(page), limit: String(limit) }
      if (search) params.search = search
      const { data: res } = await axios.get<{ success?: boolean; data?: Currency[]; total?: number }>(
        '/api/currencies/list',
        { params }
      )
      const list = Array.isArray(res?.data) ? res.data : []
      setData(list)
      setTotal(Number(res?.total) >= 0 ? Number(res.total) : list.length)
    } catch (err: unknown) {
      console.error('Failed to load currencies:', err)
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

  const openEdit = (row: Currency) => {
    setEditing(row)
    setModalOpen(true)
  }

  const handleSetDefault = async (row: Currency) => {
    try {
      const { data: res } = await axios.post(`/api/currencies/set-default/${row.id}`)
      if (res?.success) {
        toast.success(res.message ?? 'تنظیم شد')
        fetchData()
      } else {
        toast.error(res?.message ?? 'خطا')
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null
      toast.error(msg ?? (err instanceof Error ? err.message : 'خطا'))
    }
  }

  const handleDelete = async (row: Currency) => {
    if (!confirm(`آیا از حذف ارز «${row.name_fa}» مطمئن هستید؟`)) return
    try {
      const { data: res } = await axios.delete(`/api/currencies/delete/${row.id}`)
      if (res?.success) {
        toast.success(res.message ?? 'حذف شد')
        fetchData()
      } else {
        toast.error(res?.message ?? 'خطا')
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null
      toast.error(msg ?? (err instanceof Error ? err.message : 'خطا'))
    }
  }

  const columns: ColumnDef<Currency>[] = [
    { key: 'id', label: '#' },
    { key: 'code', label: 'کد', className: 'font-mono' },
    { key: 'name_fa', label: 'نام فارسی' },
    { key: 'symbol', label: 'نماد', render: (r) => (r.symbol ? String(r.symbol) : '—') },
    {
      key: 'rate',
      label: 'نرخ',
      render: (r) => (r.rate != null ? Number(r.rate).toLocaleString() : '—')
    },
    {
      key: 'is_default',
      label: 'پیش‌فرض',
      render: (r) => (r.is_default ? 'بله' : '—')
    },
    {
      key: 'active',
      label: 'وضعیت',
      render: (r) => (r.active ? 'فعال' : 'غیرفعال')
    },
    { key: 'sort_order', label: 'ترتیب' },
    {
      key: 'actions',
      label: 'عملیات',
      render: (r) => (
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => openEdit(r)}
            className="btn-luxury btn-luxury-outline py-1.5 px-3 text-sm"
          >
            ویرایش
          </button>
          {!r.is_default && (
            <button
              type="button"
              onClick={() => handleSetDefault(r)}
              className="btn-luxury btn-luxury-outline py-1.5 px-3 text-sm"
            >
              پیش‌فرض
            </button>
          )}
          {!r.is_default && (
            <button
              type="button"
              onClick={() => handleDelete(r)}
              className="btn-luxury py-1.5 px-3 text-sm bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
            >
              حذف
            </button>
          )}
        </div>
      )
    }
  ]

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal">مدیریت ارزها</h1>
          <p className="mt-1 text-sm text-charcoal-soft">
            تعریف ارزها و نرخ هر ارز (واحد پول پایه به ازای ۱ واحد این ارز).
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="btn-luxury btn-luxury-primary px-6 py-2 shrink-0"
        >
          افزودن ارز
        </button>
      </header>

      <section>
        <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">لیست ارزها</h2>
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="کد یا نام ارز..."
          onReset={() => setSearch('')}
        />
        <div className="mt-4">
          <DataTable<Currency>
            columns={columns}
            data={data}
            keyField="id"
            loading={loading}
            emptyMessage="ارزی یافت نشد"
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

      <CurrencyFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        mode={editing ? 'edit' : 'create'}
        initialData={editing ? (editing as unknown as CurrencyFormData) : null}
        onSuccess={fetchData}
      />
    </div>
  )
}
