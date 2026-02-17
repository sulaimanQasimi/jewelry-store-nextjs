'use client'

import React, { useContext, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import axios from 'axios'
import FilterBar from '@/components/ui/FilterBar'
import DataTable from '@/components/ui/DataTable'
import type { ColumnDef } from '@/components/ui/DataTable'
import { AppContext } from '@/lib/context/AppContext'
import type { TransactionForPrint } from '@/components/sale/SaleBillPrint'
import type { CompanyInfo } from '@/components/sale/SaleInvoice'
import { Printer, ShoppingCart } from 'lucide-react'

const SALE_INVOICE_PRINT_KEY = 'saleInvoicePrint'

interface SaleRow {
  id: number
  customerId: number
  customerName: string
  customerPhone: string
  product: any[]
  receipt: { totalAmount: number; paidAmount: number; remainingAmount: number }
  bellNumber: number
  note: string | null
  createdAt: string
}

export default function SalesPage() {
  const { companyData: contextCompany } = useContext(AppContext)
  const companyForInvoice: CompanyInfo | null =
    Array.isArray(contextCompany) && contextCompany[0]
      ? {
          companyName: contextCompany[0].companyName ?? contextCompany[0].CompanyName,
          slogan: contextCompany[0].slogan,
          phone: contextCompany[0].phone,
          address: contextCompany[0].address,
          email: contextCompany[0].email,
          image: contextCompany[0].image
        }
      : typeof contextCompany === 'object' && contextCompany?.companyName
        ? {
            companyName: contextCompany.companyName,
            slogan: contextCompany.slogan,
            phone: contextCompany.phone,
            address: contextCompany.address,
            email: contextCompany.email,
            image: contextCompany.image
          }
        : null

  const [data, setData] = useState<SaleRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchSales = useCallback(async () => {
    setLoading(true)
    try {
      const { data: res } = await axios.get<{
        success?: boolean
        data?: SaleRow[]
        total?: number
      }>('/api/transactions/list', {
        params: {
          page,
          limit,
          search: search || undefined,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined
        }
      })
      const list = Array.isArray(res?.data) ? res.data : []
      setData(list)
      setTotal(Number(res?.total) >= 0 ? Number(res.total) : list.length)
    } catch (err: unknown) {
      console.error('Failed to load sales:', err)
      setData([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit, search, dateFrom, dateTo])

  useEffect(() => {
    fetchSales()
  }, [fetchSales])

  const openPrintInvoice = (row: SaleRow) => {
    const tx: TransactionForPrint = {
      customerName: row.customerName,
      customerPhone: row.customerPhone,
      product: Array.isArray(row.product) ? row.product : [],
      receipt: row.receipt ?? { totalAmount: 0, paidAmount: 0, remainingAmount: 0 },
      bellNumber: row.bellNumber,
      createdAt: row.createdAt,
      note: row.note ?? null
    }
    try {
      localStorage.setItem(
        SALE_INVOICE_PRINT_KEY,
        JSON.stringify({ transaction: tx, company: companyForInvoice })
      )
      window.open('/sale-product/print', '_blank', 'noopener,noreferrer')
    } catch (_) {
      // ignore
    }
  }

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

  const columns: ColumnDef<SaleRow>[] = [
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
      key: 'totalAmount',
      label: 'مبلغ کل',
      render: (r) => formatMoney(r.receipt?.totalAmount ?? 0)
    },
    {
      key: 'paidAmount',
      label: 'پرداختی',
      render: (r) => formatMoney(r.receipt?.paidAmount ?? 0)
    },
    {
      key: 'remainingAmount',
      label: 'باقی',
      render: (r) => formatMoney(r.receipt?.remainingAmount ?? 0)
    },
    {
      key: 'createdAt',
      label: 'تاریخ',
      render: (r) => formatDate(r.createdAt)
    },
    {
      key: 'actions',
      label: 'عملیات',
      render: (r) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => openPrintInvoice(r)}
            className="btn-luxury btn-luxury-outline py-1.5 px-3 text-sm inline-flex items-center gap-1"
          >
            <Printer className="w-4 h-4" />
            چاپ فاکتور
          </button>
        </div>
      )
    }
  ]

  const resetFilters = () => {
    setSearch('')
    setDateFrom('')
    setDateTo('')
    setPage(1)
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal dark:text-white flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-gold-500" />
            لیست فروشات
          </h1>
          <p className="mt-1 text-sm text-charcoal-soft dark:text-slate-400">
            تمام فروشات را با فیلتر و صفحه‌بندی مشاهده کنید.
          </p>
        </div>
        <Link
          href="/sale-product"
          className="btn-luxury btn-luxury-primary px-6 py-2 shrink-0"
        >
          فروش جدید
        </Link>
      </header>

      <section>
        <h2 className="font-heading text-lg font-semibold text-charcoal dark:text-white mb-4">
          لیست فروشات
        </h2>
        <FilterBar
          search={search}
          onSearchChange={(v) => { setSearch(v); setPage(1) }}
          searchPlaceholder="نام یا شماره مشتری..."
          onReset={resetFilters}
          extraFilters={
            <>
              <div className="min-w-[140px]">
                <label className="block text-sm font-medium text-charcoal dark:text-slate-300 mb-1">
                  از تاریخ
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => { setDateFrom(e.target.value); setPage(1) }}
                  className="input-luxury w-full"
                />
              </div>
              <div className="min-w-[140px]">
                <label className="block text-sm font-medium text-charcoal dark:text-slate-300 mb-1">
                  تا تاریخ
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => { setDateTo(e.target.value); setPage(1) }}
                  className="input-luxury w-full"
                />
              </div>
            </>
          }
        />
        <div className="mt-4">
          <DataTable<SaleRow>
            columns={columns}
            data={data}
            keyField="id"
            loading={loading}
            emptyMessage="فروشی یافت نشد"
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
