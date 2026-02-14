'use client'

import React, { useContext, useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useReactToPrint } from 'react-to-print'
import { toast } from 'react-toastify'
import { AppContext } from '@/lib/context/AppContext'
import { useCart } from '@/context/CartContext'
import SearchCustomer from '@/components/SearchCustomer'
import SearchProduct from '@/components/SearchProduct'
import Cart from '@/components/Cart'
import Barcode from 'react-barcode'
import SaleBillPrint from '@/components/sale/SaleBillPrint'
import type { TransactionForPrint } from '@/components/sale/SaleBillPrint'
import type { CartItem } from '@/context/CartContext'

type Customer = { id: number; customerName: string; phone: string }

export default function SaleProductPage() {
  const { backendUrl } = useContext(AppContext)
  const cartState = useCart()
  const cart = cartState?.cart ?? []
  const clearCart = cartState?.clearCart ?? (() => {})
  const getTotalPrice = cartState?.getTotalPrice ?? (() => 0)
  const getTotalItems = cartState?.getTotalItems ?? (() => 0)

  const [customerQuery, setCustomerQuery] = useState('')
  const [customerResults, setCustomerResults] = useState<Customer[]>([])
  const [customerLoading, setCustomerLoading] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [bellNumber, setBellNumber] = useState('')
  const [note, setNote] = useState('')
  const [paidAmount, setPaidAmount] = useState('')
  const [receiptDate, setReceiptDate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [transactionToPrint, setTransactionToPrint] = useState<TransactionForPrint | null>(null)
  const [lastSoldForBarcode, setLastSoldForBarcode] = useState<TransactionForPrint | null>(null)
  const printRef = useRef<HTMLDivElement>(null)
  const barcodePrintRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    onAfterPrint: () => setTransactionToPrint(null)
  })

  const handleBarcodePrint = useReactToPrint({
    contentRef: barcodePrintRef
  })

  const base = backendUrl || ''

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setReceiptDate(today)
  }, [])

  useEffect(() => {
    if (selectedCustomer) {
      try {
        localStorage.setItem('selectedCustomer', JSON.stringify(selectedCustomer))
      } catch (_) {}
    }
  }, [selectedCustomer])

  const convertToEnglish = (str: string) => {
    const map: Record<string, string> = {
      '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
      '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
      '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
      '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
    }
    return str.replace(/[۰-۹٠-٩]/g, (d) => map[d] ?? d)
  }

  const fetchCustomers = async () => {
    if (!customerQuery.trim()) {
      toast.warn('لطفا چیزی بنویسید')
      return
    }
    setCustomerLoading(true)
    try {
      const { data } = await axios.get<{ success?: boolean; data?: Customer[] }>(
        `${base}/api/customer/registered-customers`,
        { params: { search: customerQuery, limit: 20 } }
      )
      const list = Array.isArray(data?.data) ? data.data : []
      setCustomerResults(list)
      if (list.length === 0) toast.warn('مشتری یافت نشد')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'خطا در جستجو')
      setCustomerResults([])
    } finally {
      setCustomerLoading(false)
    }
  }

  const handleCustomerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') fetchCustomers()
  }

  const selectCustomer = (c: Customer) => {
    setSelectedCustomer(c)
    setCustomerQuery(c.customerName)
    setCustomerResults([])
  }

  const openCheckout = () => {
    if (!selectedCustomer) {
      toast.warn('لطفاً مشتری را انتخاب کنید')
      return
    }
    if (cart.length === 0) {
      toast.warn('سبد خرید خالی است')
      return
    }
    setShowCheckoutModal(true)
  }

  const productPayload = cart.map((item: CartItem) => ({
    productId: item.id ?? item._id,
    productName: item.productName,
    purchasePriceToAfn: item.purchasePriceToAfn ?? 0,
    salePrice: { price: item.salePrice, currency: item.saleCurrency },
    barcode: item.barcode ?? '',
    gram: item.gram ?? 0,
    karat: item.karat ?? 0
  }))

  const totalAmount = getTotalPrice()
  const paidNum = Number(convertToEnglish(paidAmount)) || 0
  const remainingAmount = totalAmount - paidNum

  useEffect(() => {
    if (!transactionToPrint || !printRef.current) return
    const t = setTimeout(() => {
      handlePrint()
    }, 400)
    return () => clearTimeout(t)
  }, [transactionToPrint])

  const createTransaction = async () => {
    if (!selectedCustomer) {
      toast.warn('لطفاً مشتری را انتخاب کنید')
      return
    }
    if (cart.length === 0) {
      toast.warn('سبد خرید خالی است')
      return
    }
    const bell = Number(convertToEnglish(bellNumber))
    if (!bell || isNaN(bell)) {
      toast.warn('شماره بل معتبر وارد کنید')
      return
    }
    if (paidAmount.trim() === '' || isNaN(paidNum)) {
      toast.warn('مقدار رسید را وارد کنید')
      return
    }

    const receipt = {
      totalAmount,
      paidAmount: paidNum,
      remainingAmount,
      totalQuantity: getTotalItems(),
      date: receiptDate || new Date().toISOString().split('T')[0]
    }

    setSubmitting(true)
    try {
      const { data } = await axios.post<{ success: boolean; message?: string; data?: unknown }>(
        `${base}/api/transaction/create-transaction`,
        {
          customerId: selectedCustomer.id,
          product: productPayload,
          receipt,
          bellNumber: bell,
          note: note || null
        }
      )
      if (data.success) {
        toast.success('ترانسکشن با موفقیت ثبت شد')
        clearCart()
        setShowCheckoutModal(false)
        setBellNumber('')
        setNote('')
        setPaidAmount('')
        setSelectedCustomer(null)
        setCustomerQuery('')
        try {
          localStorage.removeItem('selectedCustomer')
        } catch (_) {}
        const tx = data.data as TransactionForPrint
        if (tx && tx.customerName && tx.receipt) {
          setTransactionToPrint(tx)
          setLastSoldForBarcode(tx)
        }
      } else {
        toast.error(data.message || 'خطا در ثبت تراکنش')
      }
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message : (err as Error)?.message
      toast.error(msg || 'خطا در ثبت تراکنش')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-heading text-2xl font-semibold text-charcoal dark:text-white">فروش جنس</h1>
        <p className="mt-1 text-sm text-charcoal-soft dark:text-slate-400">
          جستجوی بارکود، انتخاب مشتری و ثبت فروش
        </p>
      </header>

      <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-6">
        {/* Left: customer + actions */}
        <div className="space-y-4">
          <div className="card-luxury p-4 rounded-2xl border border-gold-200/50 dark:border-slate-600/50">
            <h2 className="font-heading text-lg font-semibold text-charcoal dark:text-white mb-3">مشتری</h2>
            <SearchCustomer
              fetchData={fetchCustomers}
              query={customerQuery}
              setQuery={setCustomerQuery}
              handleKeyDown={handleCustomerKeyDown}
            />
            {customerLoading && <p className="text-sm mt-2 text-charcoal-soft">در حال جستجو...</p>}
            {customerResults.length > 0 && (
              <ul className="mt-2 space-y-1 bg-champagne/30 dark:bg-slate-800/50 rounded-lg p-2 max-h-48 overflow-y-auto">
                {customerResults.map((c) => (
                  <li
                    key={c.id}
                    onClick={() => selectCustomer(c)}
                    className="py-2 px-3 cursor-pointer rounded-md hover:bg-gold-100 dark:hover:bg-slate-700 transition-colors text-sm"
                  >
                    <p className="font-medium text-charcoal dark:text-white">{c.customerName}</p>
                    <p className="text-charcoal-soft dark:text-slate-400 text-xs mt-0.5" dir="ltr">{c.phone}</p>
                  </li>
                ))}
              </ul>
            )}
            {selectedCustomer && (
              <p className="mt-2 text-sm text-gold-700 dark:text-gold-400">
                انتخاب شده: {selectedCustomer.customerName}
              </p>
            )}
          </div>

          <Link
            href="/customer-registration"
            className="btn-luxury btn-luxury-outline w-full flex items-center justify-center gap-2 py-2.5"
          >
            افزودن مشتری
          </Link>
          <button
            type="button"
            onClick={openCheckout}
            className="btn-luxury btn-luxury-primary w-full py-2.5"
          >
            ثبت فروش / ذخیره
          </button>
          {lastSoldForBarcode && lastSoldForBarcode.product?.length > 0 && (
            <button
              type="button"
              onClick={() => handleBarcodePrint()}
              className="btn-luxury btn-luxury-outline w-full py-2.5"
            >
              چاپ بارکود
            </button>
          )}
        </div>

        {/* Right: barcode search + cart */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <SearchProduct />
          </div>
          <Cart paidAmount={paidAmount} setPaidAmount={setPaidAmount} />
        </div>
      </div>

      {/* Checkout modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card-luxury p-6 rounded-2xl w-full max-w-md shadow-xl">
            <h3 className="font-heading text-lg font-semibold text-charcoal dark:text-white mb-4">ثبت رسید</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-charcoal dark:text-slate-200 mb-1">شماره بل</label>
                <input
                  type="text"
                  value={bellNumber}
                  onChange={(e) => setBellNumber(convertToEnglish(e.target.value))}
                  className="input-luxury w-full"
                  inputMode="numeric"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal dark:text-slate-200 mb-1">تاریخ</label>
                <input
                  type="date"
                  value={receiptDate}
                  onChange={(e) => setReceiptDate(e.target.value)}
                  className="input-luxury w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal dark:text-slate-200 mb-1">جزئیات</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="input-luxury w-full min-h-[80px]"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal dark:text-slate-200 mb-1">مقدار رسید</label>
                <input
                  type="text"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(convertToEnglish(e.target.value))}
                  className="input-luxury w-full"
                  inputMode="numeric"
                />
              </div>
              <div className="flex justify-between text-sm py-2 border-t border-gold-200 dark:border-slate-600">
                <span className="text-charcoal-soft">قیمت نهایی</span>
                <span className="font-semibold text-charcoal dark:text-white">{totalAmount}</span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span className="text-charcoal-soft">باقی</span>
                <span className="font-semibold text-charcoal dark:text-white">{remainingAmount}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="btn-luxury btn-luxury-outline flex-1 py-2"
              >
                لغو
              </button>
              <button
                type="button"
                onClick={createTransaction}
                disabled={submitting}
                className="btn-luxury btn-luxury-primary flex-1 py-2 disabled:opacity-60"
              >
                {submitting ? 'در حال ثبت...' : 'ثبت'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden bill for printing */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }} ref={printRef}>
        {transactionToPrint && <SaleBillPrint data={transactionToPrint} />}
      </div>

      {/* Hidden barcode labels for printing */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }} ref={barcodePrintRef}>
        {lastSoldForBarcode && Array.isArray(lastSoldForBarcode.product) && (
          <div className="p-4 grid grid-cols-2 gap-4 bg-white" dir="rtl">
            {lastSoldForBarcode.product.map((p, i) => (
              <div
                key={i}
                className="w-[5cm] h-[2.5cm] p-2 text-center border border-gold-200 rounded-lg bg-cream"
              >
                <p className="text-sm font-bold text-charcoal">صداقت</p>
                <Barcode
                  value={p.barcode ?? ''}
                  format="CODE128"
                  width={1}
                  height={40}
                  displayValue
                  fontSize={12}
                  margin={0}
                />
                <div className="text-xs mt-1 text-charcoal-soft">
                  <span>{p.gram ?? '—'} گرام</span> · <span>{p.karat ?? '—'} عیار</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
