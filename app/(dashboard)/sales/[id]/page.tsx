'use client'

import React, { useContext, useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Printer,
  User,
  Copy,
  Check,
  ShoppingBag
} from 'lucide-react'
import { toast } from 'react-toastify'
import { AppContext } from '@/lib/context/AppContext'
import type { TransactionForPrint } from '@/components/sale/SaleBillPrint'
import type { CompanyInfo } from '@/components/sale/SaleInvoice'

const SALE_INVOICE_PRINT_KEY = 'saleInvoicePrint'

interface ProductItem {
  productId?: number
  productName?: string
  barcode?: string
  gram?: number
  karat?: number
  salePrice?: { price: number; currency?: string }
  image?: string
  quantity?: number
}

interface ReceiptData {
  totalAmount: number
  paidAmount: number
  remainingAmount: number
  discount?: number
  date?: string
}

interface SaleDetail {
  id: number
  customerId: number
  customerName: string
  customerPhone: string
  product: ProductItem[]
  receipt: ReceiptData
  bellNumber: number
  note: string | null
  createdAt: string
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
    return d ?? '—'
  }
}

const formatMoney = (n: number) =>
  Number(n).toLocaleString('fa-IR', { useGrouping: true })

export default function SaleDetailPage() {
  const params = useParams()
  const id = params?.id as string
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

  const [sale, setSale] = useState<SaleDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const openPrintInvoice = (row: SaleDetail) => {
    const product = Array.isArray(row.product)
      ? row.product.map((p) => ({
          productName: p.productName ?? '',
          barcode: p.barcode,
          gram: p.gram,
          karat: p.karat,
          salePrice: p.salePrice
        }))
      : []
    const tx: TransactionForPrint = {
      customerName: row.customerName,
      customerPhone: row.customerPhone,
      product,
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

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    axios
      .get<{ success: boolean; data?: SaleDetail }>(`/api/transactions/${id}`)
      .then((res) => {
        if (res.data?.success && res.data.data) {
          setSale(res.data.data)
        } else {
          setError('فروش یافت نشد')
        }
      })
      .catch(() => {
        setError('خطا در بارگذاری')
        setSale(null)
      })
      .finally(() => setLoading(false))
  }, [id])

  const copyLink = () => {
    if (typeof window === 'undefined') return
    const url = window.location.href
    navigator.clipboard.writeText(url).then(
      () => toast.success('لینک کپی شد'),
      () => toast.error('کپی نشد')
    )
  }

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="animate-pulse text-charcoal-soft dark:text-slate-400 font-medium">
          در حال بارگذاری...
        </div>
      </div>
    )
  }

  if (error || !sale) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <p className="text-red-500 dark:text-red-400 mb-4">{error ?? 'فروش یافت نشد'}</p>
        <Link
          href="/sales"
          className="btn-luxury btn-luxury-outline p-2 inline-flex items-center justify-center"
          aria-label="بازگشت به لیست فروشات"
          title="بازگشت به لیست فروشات"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  const receipt = sale.receipt ?? {}
  const products = Array.isArray(sale.product) ? sale.product : []
  const isPaid = (receipt.remainingAmount ?? 0) <= 0
  const statusLabel = isPaid ? 'پرداخت شده' : 'در انتظار پرداخت'
  const paymentMethodLabel = isPaid ? 'نقد' : 'اقساط'
  const discount = receipt.discount ?? 0
  const subtotal = (receipt.totalAmount ?? 0) + discount
  const tax = 0 // not in DB; optional for future

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-12">
      {/* Action bar: Back, Print, Copy Link */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <Link
          href="/sales"
          className="p-2 inline-flex items-center justify-center text-charcoal dark:text-slate-200 hover:text-gold-600 dark:hover:text-gold-400 transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50"
          aria-label="بازگشت به فروشات"
          title="بازگشت به فروشات"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyLink}
            className="btn-luxury btn-luxury-outline p-2 inline-flex items-center justify-center"
            aria-label="کپی لینک"
            title="کپی لینک"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => sale && openPrintInvoice(sale)}
            className="btn-luxury btn-luxury-primary p-2 inline-flex items-center justify-center"
            aria-label="چاپ"
            title="چاپ"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Receipt container - luxury card with jewelry border */}
      <div
        className="relative bg-white dark:bg-slate-800/95 rounded-2xl border-2 border-gold-200/60 dark:border-gold-800/50 shadow-lg overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,215,0,0.03) 0%, transparent 50%)'
        }}
      >
        {/* Subtle watermark / top border accent */}
        <div className="h-1 bg-gradient-to-l from-gold-700 via-gold-500 to-gold-300" />

        <div className="p-6 sm:p-8 md:p-10">
          {/* Header: Bill #, Date, Status badge */}
          <header className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-600">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-charcoal dark:text-white">
                بل #{sale.bellNumber}
              </h1>
              <span className="text-slate-500 dark:text-slate-400 text-sm">
                {formatDate(sale.createdAt)}
              </span>
              <span
                className={`
                  inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold
                  ${isPaid ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'}
                `}
              >
                {isPaid && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="inline-flex"
                  >
                    <Check className="w-4 h-4" strokeWidth={3} />
                  </motion.span>
                )}
                {statusLabel}
              </span>
            </div>
          </header>

          {/* Customer Profile Card */}
          <div className="mb-8 p-5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 flex flex-wrap items-start gap-4">
            <div className="rounded-full bg-gold-100 dark:bg-gold-900/30 p-3">
              <User className="w-8 h-8 text-gold-600 dark:text-gold-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                مشتری
              </p>
              <p className="font-heading text-lg font-semibold text-charcoal dark:text-white">
                {sale.customerName}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-1" dir="ltr">
                {sale.customerPhone}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                شناسه مشتری: #{sale.customerId}
              </p>
            </div>
          </div>

          {/* Items: Table on desktop, cards on mobile */}
          <h2 className="font-heading text-lg font-semibold text-charcoal dark:text-white mb-4">
            اقلام فروش
          </h2>

          {/* Desktop table */}
          <div className="hidden md:block rounded-xl border border-slate-200 dark:border-slate-600 overflow-hidden mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-700 text-white dark:bg-slate-800">
                  <th className="text-right py-3 px-4 font-medium w-16">تصویر</th>
                  <th className="text-right py-3 px-4 font-medium">نام / توضیحات</th>
                  <th className="text-right py-3 px-4 font-medium w-24">تعداد</th>
                  <th className="text-right py-3 px-4 font-medium w-32">قیمت واحد</th>
                  <th className="text-right py-3 px-4 font-medium w-32">جمع</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item, i) => {
                  const qty = item.quantity ?? 1
                  const unitPrice = item.salePrice?.price ?? 0
                  const lineTotal = unitPrice * qty
                  const desc = [item.gram != null && `وزن: ${item.gram} گرم`, item.karat != null && `عیار: ${item.karat}`]
                    .filter(Boolean)
                    .join(' · ')
                  const img = item.image
                  return (
                    <tr
                      key={i}
                      className="border-t border-slate-100 dark:border-slate-600/50 text-charcoal dark:text-slate-200"
                    >
                      <td className="py-3 px-4">
                        {img ? (
                          <img
                            src={img.startsWith('http') ? img : `/${img}`}
                            alt=""
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-slate-400" />
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium">{item.productName ?? '—'}</p>
                        {desc && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>}
                      </td>
                      <td className="py-3 px-4">{qty}</td>
                      <td className="py-3 px-4" dir="ltr">{formatMoney(unitPrice)}</td>
                      <td className="py-3 px-4 font-medium" dir="ltr">{formatMoney(lineTotal)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="md:hidden space-y-4 mb-8">
            {products.map((item, i) => {
              const qty = item.quantity ?? 1
              const unitPrice = item.salePrice?.price ?? 0
              const lineTotal = unitPrice * qty
              const desc = [item.gram != null && `${item.gram} گرم`, item.karat != null && `عیار ${item.karat}`]
                .filter(Boolean)
                .join(' · ')
              const img = item.image
              return (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/30 flex gap-4"
                >
                  {img ? (
                    <img
                      src={img.startsWith('http') ? img : `/${img}`}
                      alt=""
                      className="w-16 h-16 object-cover rounded-lg shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-slate-200 dark:bg-slate-600 flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-6 h-6 text-slate-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-charcoal dark:text-white">{item.productName ?? '—'}</p>
                    {desc && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>}
                    <p className="text-sm mt-2">
                      <span className="text-slate-500 dark:text-slate-400">تعداد: {qty}</span>
                      <span className="mx-2">·</span>
                      <span className="font-medium">جمع: {formatMoney(lineTotal)} افغانی</span>
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Payment Summary - bottom right */}
          <div className="flex justify-end">
            <div className="w-full max-w-sm rounded-xl border border-gold-200/60 dark:border-gold-800/50 bg-gradient-to-br from-gold-50/50 to-amber-50/30 dark:from-gold-900/20 dark:to-amber-900/10 p-6">
              <h3 className="font-heading font-semibold text-charcoal dark:text-white mb-4">
                خلاصه پرداخت
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-600 dark:text-slate-400">جمع کل</dt>
                  <dd dir="ltr">{formatMoney(subtotal)} افغانی</dd>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-amber-700 dark:text-amber-400">
                    <dt>تخفیف</dt>
                    <dd dir="ltr">−{formatMoney(discount)}</dd>
                  </div>
                )}
                {tax > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-slate-600 dark:text-slate-400">مالیات (VAT)</dt>
                    <dd dir="ltr">{formatMoney(tax)}</dd>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-600">
                  <dt className="text-slate-600 dark:text-slate-400">روش پرداخت</dt>
                  <dd>{paymentMethodLabel}</dd>
                </div>
              </dl>
              <div className="mt-4 pt-4 border-t-2 border-gold-200 dark:border-gold-800">
                <div className="flex justify-between items-baseline">
                  <span className="font-medium text-charcoal dark:text-slate-300">مبلغ نهایی</span>
                  <span
                    className="font-heading text-2xl font-bold text-gold-700 dark:text-gold-400 tabular-nums"
                    dir="ltr"
                  >
                    {formatMoney(receipt.totalAmount ?? 0)} افغانی
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1 text-slate-500 dark:text-slate-400">
                  <span>پرداخت شده</span>
                  <span dir="ltr">{formatMoney(receipt.paidAmount ?? 0)}</span>
                </div>
                {(receipt.remainingAmount ?? 0) > 0 && (
                  <div className="flex justify-between text-sm mt-0.5 text-amber-600 dark:text-amber-400">
                    <span>باقیمانده</span>
                    <span dir="ltr">{formatMoney(receipt.remainingAmount ?? 0)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {sale.note?.trim() && (
            <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">یادداشت</p>
              <p className="text-sm text-charcoal dark:text-slate-200">{sale.note.trim()}</p>
            </div>
          )}
        </div>

        <div className="h-1 bg-gradient-to-l from-gold-300 via-gold-500 to-gold-700" />
      </div>
    </div>
  )
}
