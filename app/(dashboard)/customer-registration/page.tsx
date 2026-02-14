'use client'

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import FormField from '@/components/ui/FormField'
import FilterBar from '@/components/ui/FilterBar'
import DataTable from '@/components/ui/DataTable'
import type { ColumnDef } from '@/components/ui/DataTable'

interface Customer {
  id: number
  customerName: string
  phone: string
  email: string | null
  address: string | null
  date: string
}

export default function CustomerRegistrationPage() {
  const [data, setData] = useState<Customer[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    try {
      const { data: res } = await axios.get<{ success: boolean; data: Customer[]; total: number }>(
        '/api/customer/registred-customers',
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
    fetchCustomers()
  }, [fetchCustomers])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.customerName.trim() || !form.phone.trim()) {
      toast.error('نام و شماره تماس الزامی است')
      return
    }
    setSubmitting(true)
    try {
      const { data: res } = await axios.post('/api/customer/new-customer', {
        ...form,
        date: new Date().toISOString()
      })
      if (res.success) {
        toast.success(res.message ?? 'ثبت شد')
        setForm({ customerName: '', phone: '', email: '', address: '' })
        fetchCustomers()
      } else toast.error(res.message)
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const columns: ColumnDef<Customer>[] = [
    { key: 'id', label: '#' },
    { key: 'customerName', label: 'نام مشتری' },
    { key: 'phone', label: 'شماره تماس' },
    { key: 'email', label: 'ایمیل', render: (r) => r.email ?? '—' },
    { key: 'address', label: 'آدرس', render: (r) => r.address ?? '—' }
  ]

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold text-charcoal">ثبت مشتریان</h1>
        <p className="mt-1 text-sm text-charcoal-soft">مشتری جدید اضافه کنید و لیست را با فیلتر و صفحه‌بندی مشاهده کنید.</p>
      </header>

      <section className="card-luxury rounded-2xl border border-gold-200/50 p-6">
        <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">افزودن مشتری</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormField label="نام مشتری">
            <input
              className="input-luxury w-full"
              value={form.customerName}
              onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
            />
          </FormField>
          <FormField label="شماره تماس">
            <input
              className="input-luxury w-full"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </FormField>
          <FormField label="ایمیل">
            <input
              type="email"
              className="input-luxury w-full"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </FormField>
          <FormField label="آدرس">
            <input
              className="input-luxury w-full"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            />
          </FormField>
          <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
            <button type="submit" disabled={submitting} className="btn-luxury btn-luxury-primary px-6 py-2">
              {submitting ? 'در حال ثبت...' : 'ثبت مشتری'}
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">لیست مشتریان</h2>
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="نام یا شماره تماس..."
          onReset={() => setSearch('')}
        />
        <div className="mt-4">
          <DataTable<Customer>
            columns={columns}
            data={data}
            keyField="id"
            loading={loading}
            emptyMessage="مشتری یافت نشد"
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
