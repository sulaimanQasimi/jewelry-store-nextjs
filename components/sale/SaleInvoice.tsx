'use client'

import React from 'react'

export type TransactionForPrint = {
  customerName: string
  customerPhone: string
  product: Array<{
    productName: string
    barcode?: string
    gram?: number
    karat?: number
    salePrice?: { price: number; currency?: string }
  }>
  receipt: {
    totalAmount: number
    paidAmount: number
    remainingAmount: number
    totalQuantity?: number
    date?: string
  }
  bellNumber: number
  createdAt?: string
  note?: string | null
}

export type CompanyInfo = {
  companyName?: string
  slogan?: string
  phone?: string
  address?: string
  email?: string
  image?: string
}

const formatDate = (d: string | undefined) => {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return d
  }
}

const formatMoney = (n: number) =>
  Number(n).toLocaleString('fa-IR', { useGrouping: true })

interface SaleInvoiceProps {
  data: TransactionForPrint
  company?: CompanyInfo | null
  /** When true, use compact styling for print; when false, allow richer screen styling */
  forPrint?: boolean
}

export default function SaleInvoice({ data, company, forPrint = false }: SaleInvoiceProps) {
  const { customerName, customerPhone, product, receipt, bellNumber, createdAt, note } = data
  const displayDate = createdAt ?? receipt?.date

  return (
    <div
      className={`bg-white text-gray-900 ${forPrint ? '' : 'rounded-2xl shadow-xl overflow-hidden'} max-w-2xl mx-auto`}
      dir="rtl"
      style={{ fontFamily: 'Vazirmatn, Tahoma, Arial, sans-serif' }}
    >
      {/* Decorative top band */}
      <div className="h-1.5 bg-gradient-to-l from-amber-700 via-amber-500 to-amber-300" />

      <div className="p-8 sm:p-10">
        {/* Header */}
        <header className="text-center mb-8">
          {company?.companyName && (
            <h1 className="text-2xl sm:text-3xl font-bold text-amber-900 tracking-tight">
              {company.companyName}
            </h1>
          )}
          {company?.slogan && (
            <p className="text-amber-700/90 text-sm mt-1 font-medium">
              {company.slogan}
            </p>
          )}
          {!company?.companyName && (
            <h1 className="text-2xl font-bold text-amber-900">زرگری صداقت</h1>
          )}
          <div className="mt-4 pt-4 border-t border-amber-200/60">
            <p className="text-lg font-semibold text-amber-800 uppercase tracking-widest">
              فاکتور فروش
            </p>
          </div>
        </header>

        {/* Invoice meta */}
        <div className="flex flex-wrap justify-between gap-4 mb-6 pb-4 border-b border-amber-100">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-amber-700/80 font-medium">شماره بل</span>
            <span className="text-xl font-bold text-amber-900 tabular-nums">#{bellNumber}</span>
          </div>
          <div className="flex flex-col gap-1 text-left">
            <span className="text-xs text-amber-700/80 font-medium">تاریخ و زمان</span>
            <span className="text-sm font-medium text-gray-700">{formatDate(displayDate)}</span>
          </div>
        </div>

        {/* Customer */}
        <div className="mb-6 p-4 rounded-xl bg-amber-50/80 border border-amber-100">
          <p className="text-xs font-medium text-amber-700/90 mb-2">مشتری</p>
          <p className="font-semibold text-gray-900 text-lg">{customerName}</p>
          <p className="text-sm text-gray-600 mt-1" dir="ltr">
            {customerPhone}
          </p>
        </div>

        {/* Items table */}
        <div className="rounded-xl border border-amber-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-amber-100/70 text-amber-900">
                <th className="text-right py-3 px-4 font-semibold">ردیف</th>
                <th className="text-right py-3 px-4 font-semibold">نام جنس</th>
                <th className="text-right py-3 px-4 font-semibold">بارکود</th>
                <th className="text-right py-3 px-4 font-semibold">وزن (گرم)</th>
                <th className="text-right py-3 px-4 font-semibold">عیار</th>
                <th className="text-right py-3 px-4 font-semibold">قیمت</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(product) &&
                product.map((row, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-amber-50/40 border-t border-amber-50'}
                  >
                    <td className="py-2.5 px-4 text-gray-600">{i + 1}</td>
                    <td className="py-2.5 px-4 font-medium text-gray-900">
                      {row.productName}
                    </td>
                    <td className="py-2.5 px-4 text-gray-600 font-mono" dir="ltr">
                      {row.barcode ?? '—'}
                    </td>
                    <td className="py-2.5 px-4 text-gray-700">
                      {row.gram != null ? row.gram : '—'}
                    </td>
                    <td className="py-2.5 px-4 text-gray-700">
                      {row.karat != null ? row.karat : '—'}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-gray-900">
                      {row.salePrice?.price != null
                        ? formatMoney(row.salePrice.price)
                        : '—'}{' '}
                      افغانی
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/60">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-amber-800/90">مجموع کل</span>
              <span className="font-bold text-amber-900 tabular-nums">
                {formatMoney(receipt.totalAmount)} افغانی
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-amber-800/90">مبلغ پرداخت شده</span>
              <span className="font-bold text-green-800 tabular-nums">
                {formatMoney(receipt.paidAmount)} افغانی
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-amber-200/80">
              <span className="text-amber-900 font-semibold">باقیمانده</span>
              <span className="font-bold text-lg text-amber-900 tabular-nums">
                {formatMoney(receipt.remainingAmount)} افغانی
              </span>
            </div>
          </div>
        </div>

        {note && note.trim() && (
          <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">یادداشت</p>
            <p className="text-sm text-gray-700">{note.trim()}</p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-amber-100 text-center">
          <p className="text-amber-700/90 text-sm font-medium">
            با تشکر از اعتماد شما
          </p>
          {company?.phone && (
            <p className="text-gray-500 text-xs mt-1" dir="ltr">
              {company.phone}
            </p>
          )}
        </footer>
      </div>

      <div className="h-1 bg-gradient-to-l from-amber-300 via-amber-400 to-amber-200" />
    </div>
  )
}
