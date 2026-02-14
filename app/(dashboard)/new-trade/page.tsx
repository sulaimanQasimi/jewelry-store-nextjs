'use client'

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import FormField from '@/components/ui/FormField'
import FilterBar from '@/components/ui/FilterBar'
import DataTable from '@/components/ui/DataTable'
import type { ColumnDef } from '@/components/ui/DataTable'

interface Trader {
  id: number
  name: string
  phone: string
  address: string | null
  createdAt: string
  updatedAt: string
}

export default function NewTradePage() {
  const [traders, setTraders] = useState<Trader[]>([])
  const [totalTraders, setTotalTraders] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const [submitting, setSubmitting] = useState(false)

  const fetchTraders = useCallback(async () => {
    setLoading(true)
    try {
      const { data: res } = await axios.get<{ success: boolean; data: Trader[]; total: number }>(
        '/api/trader/list',
        { params: { page, limit, search: search || undefined } }
      )
      if (res.success) {
        setTraders(res.data ?? [])
        setTotalTraders(res.total ?? 0)
      }
    } catch {
      setTraders([])
      setTotalTraders(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit, search])

  useEffect(() => {
    fetchTraders()
  }, [fetchTraders])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('نام و شماره تماس الزامی است')
      return
    }
    setSubmitting(true)
    try {
      const { data: res } = await axios.post('/api/trader/create', form)
      if (res.success) {
        toast.success(res.message ?? 'ثبت شد')
        setForm({ name: '', phone: '', address: '' })
        fetchTraders()
      } else toast.error(res.message)
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const traderColumns: ColumnDef<Trader>[] = [
    { key: 'id', label: '#' },
    { key: 'name', label: 'نام' },
    { key: 'phone', label: 'شماره تماس' },
    { key: 'address', label: 'آدرس', render: (r) => r.address ?? '-' }
  ]

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold text-charcoal">معامله داران</h1>
        <p className="mt-1 text-sm text-charcoal-soft">ثبت معامله‌دار و مشاهده لیست با فیلتر و صفحه‌بندی.</p>
      </header>

      <section className="card-luxury rounded-2xl border border-gold-200/50 p-6">
        <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">افزودن معامله‌دار</h2>
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
              {submitting ? 'در حال ثبت...' : 'ثبت معامله‌دار'}
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">لیست معامله‌داران</h2>
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="نام یا شماره تماس..."
          onReset={() => setSearch('')}
        />
        <div className="mt-4">
          <DataTable<Trader>
            columns={traderColumns}
            data={traders}
            keyField="id"
            loading={loading}
            emptyMessage="معامله‌دار یافت نشد"
            pagination={{
              page,
              limit,
              total: totalTraders,
              onPageChange: setPage,
              onLimitChange: setLimit
            }}
          />
        </div>
      </section>
    </div>
  )
}
