'use client'

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import FormField from '@/components/ui/FormField'
import FilterBar from '@/components/ui/FilterBar'
import DataTable from '@/components/ui/DataTable'
import type { ColumnDef } from '@/components/ui/DataTable'

interface Supplier {
  id: number
  name: string
  phone: string
  address: string | null
  isActive: boolean
}

export default function SuppliersPage() {
  const [data, setData] = useState<Supplier[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const [submitting, setSubmitting] = useState(false)

  const fetchSuppliers = useCallback(async () => {
    setLoading(true)
    try {
      const { data: res } = await axios.get<{ success: boolean; data: Supplier[]; total: number }>(
        '/api/supplier/get-all',
        { params: { page, limit, search: search || undefined } }
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
  }, [page, limit, search])

  useEffect(() => {
    fetchSuppliers()
  }, [fetchSuppliers])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('نام و شماره تماس الزامی است')
      return
    }
    setSubmitting(true)
    try {
      const { data: res } = await axios.post('/api/supplier/create', form)
      if (res.success) {
        toast.success(res.message ?? 'ذخیره شد')
        setForm({ name: '', phone: '', address: '' })
        fetchSuppliers()
      } else toast.error(res.message)
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const columns: ColumnDef<Supplier>[] = [
    { key: 'id', label: '#' },
    { key: 'name', label: 'نام' },
    { key: 'phone', label: 'شماره تماس' },
    { key: 'address', label: 'آدرس', render: (r) => r.address ?? '-' }
  ]

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold text-charcoal">لیست تمویل کنندگان</h1>
        <p className="mt-1 text-sm text-charcoal-soft">ثبت تمویل‌کننده و مشاهده لیست با فیلتر و صفحه‌بندی.</p>
      </header>

      <section className="card-luxury rounded-2xl border border-gold-200/50 p-6">
        <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">افزودن تمویل‌کننده</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormField label="نام">
            <input
              className="input-luxury w-full"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </FormField>
          <FormField label="شماره تماس">
            <input
              className="input-luxury w-full"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </FormField>
          <FormField label="آدرس">
            <input
              className="input-luxury w-full"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            />
          </FormField>
          <div className="flex items-end">
            <button type="submit" disabled={submitting} className="btn-luxury btn-luxury-primary px-6 py-2">
              {submitting ? 'در حال ثبت...' : 'ثبت تمویل‌کننده'}
            </button>
          </div>
        </form>
      </section>

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
          />
        </div>
      </section>
    </div>
  )
}
