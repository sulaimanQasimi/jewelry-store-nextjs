'use client'

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import FilterBar from '@/components/ui/FilterBar'
import DataTable from '@/components/ui/DataTable'
import type { ColumnDef } from '@/components/ui/DataTable'

interface LoanRow {
  customerId: number
  transactionId: number
  customerName: string
  customerPhone: string
  totalAmount: number
  totalLoan: number
  totalPaid: number
  totalDiscount: number
  transactionsCount: number
}

export default function LoanManagementPage() {
  const [data, setData] = useState<LoanRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchLoans = useCallback(async () => {
    setLoading(true)
    try {
      const { data: res } = await axios.get<{ success: boolean; data: LoanRow[]; total: number }>(
        '/api/transaction/loan-list',
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
    fetchLoans()
  }, [fetchLoans])

  const columns: ColumnDef<LoanRow>[] = [
    { key: 'customerId', label: '#' },
    { key: 'customerName', label: 'نام مشتری' },
    { key: 'customerPhone', label: 'شماره تماس' },
    { key: 'totalAmount', label: 'مجموع مبلغ', render: (r) => r.totalAmount?.toLocaleString() ?? '—' },
    { key: 'totalLoan', label: 'باقی‌مانده قرض', render: (r) => r.totalLoan?.toLocaleString() ?? '—' },
    { key: 'totalPaid', label: 'پرداخت شده', render: (r) => r.totalPaid?.toLocaleString() ?? '—' },
    { key: 'totalDiscount', label: 'تخفیف', render: (r) => r.totalDiscount?.toLocaleString() ?? '—' },
    { key: 'transactionsCount', label: 'تعداد تراکنش' }
  ]

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold text-charcoal">بلانس مشتریان</h1>
        <p className="mt-1 text-sm text-charcoal-soft">لیست مشتریان قرضدار با فیلتر و صفحه‌بندی.</p>
      </header>

      <section>
        <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">لیست قرضداران</h2>
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="نام یا شماره مشتری..."
          onReset={() => setSearch('')}
        />
        <div className="mt-4">
          <DataTable<LoanRow>
            columns={columns}
            data={data}
            keyField="customerId"
            loading={loading}
            emptyMessage="قرضدار یافت نشد"
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
