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
  }
  bellNumber: number
  createdAt?: string
  note?: string | null
}

const formatDate = (d: string | undefined) => {
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

export default function SaleBillPrint({ data }: { data: TransactionForPrint }) {
  const { customerName, customerPhone, product, receipt, bellNumber, createdAt } = data
  return (
    <div className="bg-white text-black p-6 max-w-lg mx-auto" dir="rtl" style={{ fontFamily: 'Tahoma, Arial, sans-serif' }}>
      <div className="text-center border-b border-gray-300 pb-3 mb-3">
        <h1 className="text-xl font-bold">رسید فروش</h1>
        <p className="text-sm text-gray-600 mt-1">زرگری صداقت</p>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mb-4">
        <div><span className="text-gray-600">شماره بل:</span> {bellNumber}</div>
        <div><span className="text-gray-600">تاریخ:</span> {formatDate(createdAt)}</div>
        <div><span className="text-gray-600">مشتری:</span> {customerName}</div>
        <div><span className="text-gray-600">تماس:</span> <span dir="ltr">{customerPhone}</span></div>
      </div>
      <table className="w-full text-sm border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 py-2 px-2 text-right">نام جنس</th>
            <th className="border border-gray-300 py-2 px-2 text-right">بارکود</th>
            <th className="border border-gray-300 py-2 px-2 text-right">وزن</th>
            <th className="border border-gray-300 py-2 px-2 text-right">عیار</th>
            <th className="border border-gray-300 py-2 px-2 text-right">قیمت</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(product) && product.map((row, i) => (
            <tr key={i}>
              <td className="border border-gray-300 py-1.5 px-2">{row.productName}</td>
              <td className="border border-gray-300 py-1.5 px-2" dir="ltr">{row.barcode ?? '—'}</td>
              <td className="border border-gray-300 py-1.5 px-2">{row.gram ?? '—'}</td>
              <td className="border border-gray-300 py-1.5 px-2">{row.karat ?? '—'}</td>
              <td className="border border-gray-300 py-1.5 px-2">
                {row.salePrice?.price != null ? Number(row.salePrice.price).toLocaleString('fa-IR') : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 space-y-1 text-sm">
        <div className="flex justify-between"><span>مجموع:</span><strong>{Number(receipt.totalAmount).toLocaleString('fa-IR')}</strong></div>
        <div className="flex justify-between"><span>پرداخت:</span><strong>{Number(receipt.paidAmount).toLocaleString('fa-IR')}</strong></div>
        <div className="flex justify-between"><span>باقی:</span><strong>{Number(receipt.remainingAmount).toLocaleString('fa-IR')}</strong></div>
      </div>
      <p className="text-center text-gray-500 text-xs mt-6">با تشکر از خرید شما</p>
    </div>
  )
}
