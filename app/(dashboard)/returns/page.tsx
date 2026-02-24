'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import axios from 'axios'
import FilterBar from '@/components/ui/FilterBar'
import DataTable from '@/components/ui/DataTable'
import type { ColumnDef } from '@/components/ui/DataTable'
import CustomerCombobox from '@/components/ui/CustomerCombobox'
import type { CustomerOption } from '@/components/ui/CustomerCombobox'
import Link from 'next/link'
import { RotateCcw, Hash, X, FileText, Receipt } from 'lucide-react'
import PersianDatePicker from '@/components/ui/PersianDatePicker'

const BILL_NUMBER_DEBOUNCE_MS = 320

interface ReturnRow {
  id: number
  transactionId: number | null
  productId: number
  customerName: string
  customerPhone: string
  bellNumber: number
  productSnapshot: {
    productName?: string
    barcode?: string
    gram?: number
    karat?: number
    salePrice?: { price?: number; currency?: string }
  }
  note: string | null
  returnedAt: string
}

function useQueryState() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const params = useMemo(() => ({
    customerId: searchParams.get('customerId')?.trim() || '',
    search: searchParams.get('search')?.trim() || '',
    dateFrom: searchParams.get('dateFrom')?.trim() || '',
    dateTo: searchParams.get('dateTo')?.trim() || '',
    billNumber: searchParams.get('billNumber')?.trim() || '',
    page: searchParams.get('page')?.trim() || '1',
    limit: searchParams.get('limit')?.trim() || '10'
  }), [searchParams])

  const setParams = useCallback(
    (updates: Record<string, string>) => {
      const next = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value === '' || (key === 'page' && value === '1') || (key === 'limit' && value === '10')) {
          next.delete(key)
        } else {
          next.set(key, value)
        }
      })
      const qs = next.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  return [params, setParams] as const
}

export default function ReturnsPage() {
  const [urlParams, setUrlParams] = useQueryState()
  const [billNumberInput, setBillNumberInput] = useState(urlParams.billNumber)

  const [data, setData] = useState<ReturnRow[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerOption | null>(null)

  const page = Math.max(1, parseInt(urlParams.page, 10) || 1)
  const limit = Math.min(50, Math.max(1, parseInt(urlParams.limit, 10) || 10))
  const search = urlParams.search
  const dateFrom = urlParams.dateFrom
  const dateTo = urlParams.dateTo
  const customerIdParam = urlParams.customerId
  const billNumberParam = urlParams.billNumber

  useEffect(() => {
    setBillNumberInput(urlParams.billNumber)
  }, [urlParams.billNumber])

  useEffect(() => {
    const t = setTimeout(() => {
      if (billNumberInput !== urlParams.billNumber) {
        setUrlParams({ billNumber: billNumberInput, page: '1' })
      }
    }, BILL_NUMBER_DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [billNumberInput, urlParams.billNumber, setUrlParams])

  useEffect(() => {
    if (!customerIdParam) {
      setSelectedCustomer(null)
      return
    }
    const id = parseInt(customerIdParam, 10)
    if (Number.isNaN(id)) return
    if (selectedCustomer?.id === id) return
    axios
      .get<{ data?: { id: number; customerName?: string; phone?: string } }>(`/api/customer/${id}`)
      .then(({ data: res }) => {
        const c = res?.data
        if (c) {
          setSelectedCustomer({
            id: c.id,
            customerName: c.customerName ?? '',
            phone: c.phone ?? ''
          })
        } else {
          setSelectedCustomer(null)
        }
      })
      .catch(() => setSelectedCustomer(null))
  }, [customerIdParam])

  const fetchReturns = useCallback(async () => {
    setLoading(true)
    try {
      const { data: res } = await axios.get<{
        success?: boolean
        data?: ReturnRow[]
        total?: number
      }>('/api/returns/list', {
        params: {
          page,
          limit,
          search: search || undefined,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
          customerId: customerIdParam || undefined,
          billNumber: billNumberParam || undefined
        }
      })
      const list = Array.isArray(res?.data) ? res.data : []
      setData(list)
      setTotal(Number(res?.total) >= 0 ? Number(res.total) : list.length)
    } catch (err: unknown) {
      console.error('Failed to load returns:', err)
      setData([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit, search, dateFrom, dateTo, customerIdParam, billNumberParam])

  useEffect(() => {
    fetchReturns()
  }, [fetchReturns])

  const formatDate = (d: string) => {
    if (!d) return '—'
    try {
      return new Date(d).toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return d
    }
  }

  const formatMoney = (n: number) => Number(n).toLocaleString('fa-IR', { useGrouping: true })

  const setPage = useCallback(
    (p: number) => setUrlParams({ page: String(p) }),
    [setUrlParams]
  )
  const setLimit = useCallback(
    (l: number) => setUrlParams({ limit: String(l), page: '1' }),
    [setUrlParams]
  )

  const columns: ColumnDef<ReturnRow>[] = [
    { key: 'id', label: '#' },
    { key: 'bellNumber', label: 'شماره بل', render: (r) => `#${r.bellNumber}` },
    { key: 'customerName', label: 'مشتری' },
    {
      key: 'customerPhone',
      label: 'تماس',
      className: 'phone-ltr',
      render: (r) => <span dir="ltr">{r.customerPhone}</span>
    },
    {
      key: 'productName',
      label: 'محصول',
      render: (r) => r.productSnapshot?.productName ?? '—'
    },
    {
      key: 'amount',
      label: 'مبلغ',
      render: (r) => {
        const price = r.productSnapshot?.salePrice?.price
        if (price == null) return '—'
        return formatMoney(price)
      }
    },
    {
      key: 'returnedAt',
      label: 'تاریخ مرجوعی',
      render: (r) => formatDate(r.returnedAt)
    },
    {
      key: 'actions',
      label: 'عملیات',
      render: (r) => (
        <div className="flex gap-2 flex-wrap">
          <Link
            href={`/returns/${r.id}`}
            className="btn-luxury btn-luxury-outline p-2 inline-flex items-center justify-center"
            aria-label="مشاهده"
            title="مشاهده"
          >
            <FileText className="w-4 h-4" />
          </Link>
          {r.transactionId != null && (
            <Link
              href={`/sales/${r.transactionId}`}
              className="btn-luxury btn-luxury-outline p-2 inline-flex items-center justify-center"
              aria-label="فروش مرتبط"
              title="فروش مرتبط"
            >
              <Receipt className="w-4 h-4" />
            </Link>
          )}
        </div>
      )
    }
  ]

  const resetFilters = () => {
    setBillNumberInput('')
    setUrlParams({
      billNumber: '',
      customerId: '',
      search: '',
      dateFrom: '',
      dateTo: '',
      page: '1'
    })
    setSelectedCustomer(null)
  }

  const handleCustomerChange = useCallback(
    (customerId: number, customer: CustomerOption | null) => {
      setSelectedCustomer(customer)
      setUrlParams({ customerId: customerId ? String(customerId) : '', page: '1' })
    },
    [setUrlParams]
  )

  const clearBillNumber = () => {
    setBillNumberInput('')
    setUrlParams({ billNumber: '', page: '1' })
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal dark:text-white flex items-center gap-2">
            <RotateCcw className="w-6 h-6 text-gold-500" />
            مرجوعات
          </h1>
          <p className="mt-1 text-sm text-charcoal-soft dark:text-slate-400">
            لیست مرجوعات را با فیلتر و صفحه‌بندی مشاهده کنید.
          </p>
        </div>
      </header>

      <section>
        <h2 className="font-heading text-lg font-semibold text-charcoal dark:text-white mb-4">
          مرجوعات
        </h2>
        <FilterBar
          search={search}
          onSearchChange={(v) => setUrlParams({ search: v, page: '1' })}
          searchPlaceholder="نام یا شماره مشتری..."
          onReset={resetFilters}
          extraFilters={
            <>
              <div className="min-w-[140px]">
                <label className="block text-sm font-medium text-charcoal dark:text-slate-300 mb-1">
                  شماره بل
                </label>
                <div className="relative">
                  <Hash className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={billNumberInput}
                    onChange={(e) => setBillNumberInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="شماره بل"
                    className="input-luxury w-full pl-10 pr-9 focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                    aria-label="جستجوی شماره بل"
                  />
                  {billNumberInput ? (
                    <button
                      type="button"
                      onClick={clearBillNumber}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-charcoal dark:hover:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded"
                      aria-label="پاک کردن فیلتر شماره بل"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : null}
                </div>
              </div>
              <CustomerCombobox
                value={customerIdParam ? parseInt(customerIdParam, 10) : 0}
                selectedCustomer={selectedCustomer}
                onChange={handleCustomerChange}
                placeholder="نام، شماره تماس یا شناسه مشتری"
                label="مشتری"
                aria-label="فیلتر بر اساس مشتری"
              />
              <div className="min-w-[140px]">
                <label className="block text-sm font-medium text-charcoal dark:text-slate-300 mb-1">
                  از تاریخ
                </label>
                <PersianDatePicker
                  value={dateFrom || null}
                  onChange={(v) => setUrlParams({ dateFrom: v ?? '', page: '1' })}
                  className="input-luxury w-full"
                />
              </div>
              <div className="min-w-[140px]">
                <label className="block text-sm font-medium text-charcoal dark:text-slate-300 mb-1">
                  تا تاریخ
                </label>
                <PersianDatePicker
                  value={dateTo || null}
                  onChange={(v) => setUrlParams({ dateTo: v ?? '', page: '1' })}
                  className="input-luxury w-full"
                />
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="btn-luxury btn-luxury-outline py-2 px-4 inline-flex items-center gap-2"
                title="بازنشانی فیلترها"
              >
                <RotateCcw className="w-4 h-4" />
                بازنشانی
              </button>
            </>
          }
        />
        <div className="mt-4">
          <DataTable<ReturnRow>
            columns={columns}
            data={data}
            keyField="id"
            loading={loading}
            emptyMessage="مرجوعیه‌ای یافت نشد"
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
    </div>
  )
}
