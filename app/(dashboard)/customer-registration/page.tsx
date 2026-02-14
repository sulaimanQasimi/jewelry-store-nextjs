'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import FilterBar from '@/components/ui/FilterBar'
import DataTable from '@/components/ui/DataTable'
import type { ColumnDef } from '@/components/ui/DataTable'
import CustomerFormModal from '@/components/customer/CustomerFormModal'
import type { CustomerFormData } from '@/components/customer/CustomerFormModal'

interface Customer {
  id: number
  customerName: string
  phone: string
  email: string | null
  address: string | null
  date: string
  image?: string | null
  secondaryPhone?: string | null
  companyName?: string | null
  notes?: string | null
  birthDate?: string | null
  nationalId?: string | null
  facebookUrl?: string | null
  instagramUrl?: string | null
  whatsappUrl?: string | null
  telegramUrl?: string | null
}

export default function CustomerRegistrationPage() {
  const router = useRouter()
  const [data, setData] = useState<Customer[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    try {
      const { data: res } = await axios.get<{ success?: boolean; data?: Customer[]; customers?: Customer[]; total?: number }>(
        '/api/customer/registered-customers',
        { params: { page, limit, search: search || undefined } }
      )
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res?.customers) ? res.customers : []
      setData(list)
      setTotal(Number(res?.total) >= 0 ? Number(res.total) : list.length)
    } catch (err: unknown) {
      console.error('Failed to load customers:', err)
      setData([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit, search])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const openCreate = () => {
    setEditingCustomer(null)
    setModalOpen(true)
  }

  const openEdit = (row: Customer) => {
    setEditingCustomer(row)
    setModalOpen(true)
  }

  const columns: ColumnDef<Customer>[] = [
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
    { key: 'customerName', label: 'نام مشتری' },
    { key: 'phone', label: 'شماره تماس' },
    { key: 'email', label: 'ایمیل', render: (r) => r.email ?? '—' },
    { key: 'secondaryPhone', label: 'شماره ثانوی', render: (r) => r.secondaryPhone ?? '—' },
    { key: 'address', label: 'آدرس', render: (r) => (r.address ? String(r.address).slice(0, 30) + (String(r.address).length > 30 ? '…' : '') : '—') },
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
            onClick={() => router.push(`/customer-registration/${r.id}`)}
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
          <h1 className="font-heading text-2xl font-semibold text-charcoal">ثبت مشتریان</h1>
          <p className="mt-1 text-sm text-charcoal-soft">لیست مشتریان را با فیلتر و صفحه‌بندی مشاهده کنید.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="btn-luxury btn-luxury-primary px-6 py-2 shrink-0"
        >
          افزودن مشتری
        </button>
      </header>

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
            minWidth="800px"
          />
        </div>
      </section>

      <CustomerFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingCustomer(null) }}
        mode={editingCustomer ? 'edit' : 'create'}
        initialData={editingCustomer ? (editingCustomer as CustomerFormData) : null}
        onSuccess={fetchCustomers}
      />
    </div>
  )
}
