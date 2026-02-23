'use client'

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import DataTable from '@/components/ui/DataTable'
import type { ColumnDef } from '@/components/ui/DataTable'
import PersianDatePicker from '@/components/ui/PersianDatePicker'
import FragmentFormModal from '@/components/fragment/FragmentFormModal'
import type { FragmentFormData } from '@/components/fragment/FragmentFormModal'
import StorageFormModal from '@/components/storage/StorageFormModal'
import type { StorageFormData } from '@/components/storage/StorageFormModal'

interface Storage {
  id: number
  date: string
  usd: number
  afn: number
}

interface Fragment {
  id: number
  gram: number
  wareHouse: number
  changedToPasa: number
  remain: number | null
  amount: number
  detail: string | null
  isCompleted: boolean
  date: string
}

export default function WareHousePage() {
  const [activeTab, setActiveTab] = useState<'storages' | 'fragments'>('storages')

  const [storages, setStorages] = useState<Storage[]>([])
  const [storageTotal, setStorageTotal] = useState(0)
  const [storagePage, setStoragePage] = useState(1)
  const [storageLimit, setStorageLimit] = useState(10)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [storageLoading, setStorageLoading] = useState(false)
  const [storageModalOpen, setStorageModalOpen] = useState(false)
  const [editingStorage, setEditingStorage] = useState<StorageFormData | null>(null)

  const [fragments, setFragments] = useState<Fragment[]>([])
  const [fragmentTotal, setFragmentTotal] = useState(0)
  const [fragmentPage, setFragmentPage] = useState(1)
  const [fragmentLimit, setFragmentLimit] = useState(10)
  const [fragmentLoading, setFragmentLoading] = useState(false)
  const [fragmentModalOpen, setFragmentModalOpen] = useState(false)
  const [editingFragment, setEditingFragment] = useState<Fragment | null>(null)

  const fetchStorages = useCallback(async () => {
    setStorageLoading(true)
    try {
      const { data: res } = await axios.get<{ success?: boolean; data?: Storage[]; total?: number }>(
        '/api/storage/list',
        { params: { page: storagePage, limit: storageLimit, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined } }
      )
      const list = Array.isArray(res?.data) ? res.data : []
      setStorages(list)
      setStorageTotal(Number(res?.total) >= 0 ? Number(res.total) : list.length)
    } catch (err: unknown) {
      console.error('Failed to load storages:', err)
      setStorages([])
      setStorageTotal(0)
    } finally {
      setStorageLoading(false)
    }
  }, [storagePage, storageLimit, dateFrom, dateTo])

  const fetchFragments = useCallback(async () => {
    setFragmentLoading(true)
    try {
      const { data: res } = await axios.get<{ success?: boolean; data?: Fragment[]; total?: number }>(
        '/api/fragment/list',
        { params: { page: fragmentPage, limit: fragmentLimit } }
      )
      const list = Array.isArray(res?.data) ? res.data : []
      setFragments(list)
      setFragmentTotal(Number(res?.total) >= 0 ? Number(res.total) : list.length)
    } catch (err: unknown) {
      console.error('Failed to load fragments:', err)
      setFragments([])
      setFragmentTotal(0)
    } finally {
      setFragmentLoading(false)
    }
  }, [fragmentPage, fragmentLimit])

  useEffect(() => {
    if (activeTab === 'storages') fetchStorages()
  }, [activeTab, fetchStorages])

  useEffect(() => {
    if (activeTab === 'fragments') fetchFragments()
  }, [activeTab, fetchFragments])

  const formatDate = (d: string) => {
    if (!d) return '—'
    try {
      return new Date(d).toLocaleDateString('fa-IR')
    } catch {
      return d
    }
  }

  const storageColumns: ColumnDef<Storage>[] = [
    { key: 'id', label: '#' },
    { key: 'date', label: 'تاریخ', render: (r) => formatDate(r.date) },
    { key: 'usd', label: 'دلار', render: (r) => r.usd.toLocaleString('fa-IR') },
    { key: 'afn', label: 'افغانی', render: (r) => r.afn.toLocaleString('fa-IR') },
    {
      key: 'actions',
      label: 'عملیات',
      render: (r) => (
        <button
          type="button"
          onClick={() => {
            setEditingStorage({ date: r.date, usd: r.usd, afn: r.afn })
            setStorageModalOpen(true)
          }}
          className="btn-luxury btn-luxury-outline py-1.5 px-3 text-sm"
        >
          ویرایش
        </button>
      )
    }
  ]

  const fragmentColumns: ColumnDef<Fragment>[] = [
    { key: 'id', label: '#' },
    { key: 'gram', label: 'گرم', render: (r) => r.gram.toLocaleString('fa-IR') },
    { key: 'wareHouse', label: 'انبار', render: (r) => r.wareHouse.toLocaleString('fa-IR') },
    { key: 'changedToPasa', label: 'تبدیل به پاسا', render: (r) => r.changedToPasa.toLocaleString('fa-IR') },
    { key: 'remain', label: 'باقی‌مانده', render: (r) => (r.remain != null ? r.remain.toLocaleString('fa-IR') : '—') },
    { key: 'amount', label: 'مبلغ', render: (r) => r.amount.toLocaleString('fa-IR') },
    { key: 'detail', label: 'توضیحات', render: (r) => (r.detail ? String(r.detail).slice(0, 30) + (String(r.detail).length > 30 ? '…' : '') : '—') },
    { key: 'isCompleted', label: 'وضعیت', render: (r) => (r.isCompleted ? 'تکمیل' : 'در حال') },
    { key: 'date', label: 'تاریخ', render: (r) => formatDate(r.date) },
    {
      key: 'actions',
      label: 'عملیات',
      render: (r) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingFragment(r)
              setFragmentModalOpen(true)
            }}
            className="btn-luxury btn-luxury-outline py-1.5 px-3 text-sm"
          >
            ویرایش
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold text-charcoal">انبار</h1>
        <p className="mt-1 text-sm text-charcoal-soft">مدیریت دخل و شکسته‌ها</p>
      </header>

      <div className="flex gap-2 border-b border-gold-200">
        <button
          type="button"
          onClick={() => setActiveTab('storages')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'storages'
              ? 'text-gold-600 border-b-2 border-gold-600'
              : 'text-charcoal-soft hover:text-charcoal'
          }`}
        >
          دخل (تاریخ / USD / AFN)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('fragments')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'fragments'
              ? 'text-gold-600 border-b-2 border-gold-600'
              : 'text-charcoal-soft hover:text-charcoal'
          }`}
        >
          شکسته‌ها
        </button>
      </div>

      {activeTab === 'storages' && (
        <section>
          <div className="flex flex-wrap gap-4 items-end mb-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">از تاریخ</label>
              <PersianDatePicker
                value={dateFrom || null}
                onChange={(v) => { setDateFrom(v ?? ''); setStoragePage(1) }}
                className="input-luxury"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">تا تاریخ</label>
              <PersianDatePicker
                value={dateTo || null}
                onChange={(v) => { setDateTo(v ?? ''); setStoragePage(1) }}
                className="input-luxury"
              />
            </div>
            <button
              type="button"
              onClick={() => { setDateFrom(''); setDateTo(''); setStoragePage(1); fetchStorages() }}
              className="btn-luxury btn-luxury-outline py-2 px-4"
            >
              پاک کردن فیلتر
            </button>
          </div>
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={() => {
                setEditingStorage(null)
                setStorageModalOpen(true)
              }}
              className="btn-luxury btn-luxury-primary px-6 py-2"
            >
              افزودن دخل
            </button>
          </div>
          <DataTable<Storage>
            columns={storageColumns}
            data={storages}
            keyField="id"
            loading={storageLoading}
            emptyMessage="دخلی یافت نشد"
            pagination={{
              page: storagePage,
              limit: storageLimit,
              total: storageTotal,
              onPageChange: setStoragePage,
              onLimitChange: setStorageLimit
            }}
            minWidth="600px"
          />
        </section>
      )}

      {activeTab === 'fragments' && (
        <section>
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={() => {
                setEditingFragment(null)
                setFragmentModalOpen(true)
              }}
              className="btn-luxury btn-luxury-primary px-6 py-2"
            >
              افزودن شکسته
            </button>
          </div>
          <DataTable<Fragment>
            columns={fragmentColumns}
            data={fragments}
            keyField="id"
            loading={fragmentLoading}
            emptyMessage="شکسته‌ای یافت نشد"
            pagination={{
              page: fragmentPage,
              limit: fragmentLimit,
              total: fragmentTotal,
              onPageChange: setFragmentPage,
              onLimitChange: setFragmentLimit
            }}
            minWidth="800px"
          />
        </section>
      )}

      <StorageFormModal
        open={storageModalOpen}
        onClose={() => {
          setStorageModalOpen(false)
          setEditingStorage(null)
        }}
        initialData={editingStorage}
        onSuccess={fetchStorages}
      />

      <FragmentFormModal
        open={fragmentModalOpen}
        onClose={() => {
          setFragmentModalOpen(false)
          setEditingFragment(null)
        }}
        mode={editingFragment ? 'edit' : 'create'}
        initialData={editingFragment ? (editingFragment as FragmentFormData) : null}
        onSuccess={fetchFragments}
      />
    </div>
  )
}
