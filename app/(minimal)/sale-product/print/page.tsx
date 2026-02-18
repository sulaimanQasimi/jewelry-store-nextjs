'use client'

import React, { useState, useEffect } from 'react'
import SaleInvoice from '@/components/sale/SaleInvoice'
import type { TransactionForPrint } from '@/components/sale/SaleBillPrint'
import type { CompanyInfo } from '@/components/sale/SaleInvoice'

const SALE_INVOICE_PRINT_KEY = 'saleInvoicePrint'

export default function SaleProductPrintPage() {
  const [data, setData] = useState<TransactionForPrint | null>(null)
  const [company, setCompany] = useState<CompanyInfo | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(SALE_INVOICE_PRINT_KEY) : null
      if (raw) {
        const parsed = JSON.parse(raw) as { transaction: TransactionForPrint; company?: CompanyInfo | null }
        if (parsed.transaction?.customerName && parsed.transaction?.receipt) {
          setData(parsed.transaction)
          setCompany(parsed.company ?? null)
          setReady(true)
          window.localStorage.removeItem(SALE_INVOICE_PRINT_KEY)
          return
        }
      }
    } catch (_) {
      // invalid or missing
    }
    setReady(true)
    setData(null)
  }, [])

  useEffect(() => {
    if (!data || !ready) return
    const t = setTimeout(() => {
      window.print()
    }, 500)
    return () => clearTimeout(t)
  }, [data, ready])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white" dir="rtl">
        <p className="text-gray-500">در حال آماده‌سازی چاپ...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white" dir="rtl">
        <p className="text-gray-500">اطلاعات فاکتور یافت نشد.</p>
        <button
          type="button"
          onClick={() => window.close()}
          className="btn-luxury btn-luxury-outline px-4 py-2"
        >
          بستن
        </button>
      </div>
    )
  }

  return (
    <>
      <style data-print-styles>
        {`@page { size: A4; margin: 15mm; }
@media print {
  body { background: #fff !important; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .print-root.print-invoice-wrapper { position: relative !important; width: 100% !important; min-height: 100vh; box-sizing: border-box; padding: 0 !important; }
  .print-invoice-a4 { width: 100% !important; max-width: 180mm !important; margin: 0 auto !important; box-sizing: border-box; }
}
@media screen {
  .print-invoice-a4 { width: 100%; max-width: 210mm; margin: 0 auto; min-height: 297mm; box-sizing: border-box; box-shadow: 0 0 0 1px rgba(0,0,0,0.1); background: #fff; }
}`}
      </style>
      <div className="print-root print-invoice-wrapper py-6 px-4">
        <div className="print-invoice-a4">
          <SaleInvoice data={data} company={company} forPrint />
        </div>
      </div>
    </>
  )
}
