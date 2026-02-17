'use client'

import React, { useContext, useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useReactToPrint } from 'react-to-print'
import { toast } from 'react-toastify'

const SALE_INVOICE_PRINT_KEY = 'saleInvoicePrint'
import { AppContext } from '@/lib/context/AppContext'
import { useCart } from '@/context/CartContext'
import SearchCustomer from '@/components/SearchCustomer'
import SearchProduct from '@/components/SearchProduct'
import Cart from '@/components/Cart'
import Barcode from 'react-barcode'
import SaleInvoice from '@/components/sale/SaleInvoice'
import { UserPlus, Save, Printer, RefreshCw, ShoppingCart, User, Calculator, X } from 'lucide-react'
import type { TransactionForPrint } from '@/components/sale/SaleBillPrint'
import type { CompanyInfo } from '@/components/sale/SaleInvoice'
import type { CartItem } from '@/context/CartContext'

type Customer = { id: number; customerName: string; phone: string }

export default function SaleProductPage() {
  const { backendUrl, companyData: contextCompany, getCompanyData } = useContext(AppContext)
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
  const cartState = useCart()
  const cart = cartState?.cart ?? []
  const clearCart = cartState?.clearCart ?? (() => { })
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
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [lastSoldForBarcode, setLastSoldForBarcode] = useState<TransactionForPrint | null>(null)
  const barcodePrintRef = useRef<HTMLDivElement>(null)

  const openPrintPage = () => {
    if (!transactionToPrint) return
    try {
      sessionStorage.setItem(
        SALE_INVOICE_PRINT_KEY,
        JSON.stringify({ transaction: transactionToPrint, company: companyForInvoice })
      )
      window.open('/sale-product/print', '_blank', 'noopener,noreferrer')
    } catch (e) {
      toast.error('خطا در باز کردن صفحه چاپ')
    }
  }

  const closeInvoiceModal = () => {
    setShowInvoiceModal(false)
    setTransactionToPrint(null)
  }

  const handleBarcodePrint = useReactToPrint({
    contentRef: barcodePrintRef
  })

  const base = backendUrl || ''

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setReceiptDate(today)
  }, [])

  useEffect(() => {
    if (typeof getCompanyData === 'function') getCompanyData()
  }, [])

  useEffect(() => {
    if (selectedCustomer) {
      try {
        localStorage.setItem('selectedCustomer', JSON.stringify(selectedCustomer))
      } catch (_) { }
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
    if (transactionToPrint) setShowInvoiceModal(true)
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
        } catch (_) { }
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
    <div className="flex flex-col gap-6 h-full">
      {/* Header & Product Search - Top Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-charcoal dark:text-white flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-gold-500" />
            فروش جنس
          </h1>
          <p className="text-sm text-charcoal-soft dark:text-slate-400 mt-1">
            مدیریت فروشات و ثبت بل
          </p>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3">
          <SearchProduct />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_20rem] xl:grid-cols-[1fr_24rem] gap-6 items-start">
        {/* Left: Cart List (Main Workspace) */}
        <div className="space-y-4">
          <Cart paidAmount={paidAmount} setPaidAmount={setPaidAmount} />
        </div>

        {/* Right: Control Panel (Customer, Summary, Actions) */}
        <div className="space-y-6 flex flex-col">

          {/* Customer Card */}
          <div className="card-luxury p-5 rounded-2xl border border-gold-200/50 dark:border-slate-600/50 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold-200/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 pointer-events-none" />

            <div className="flex items-center gap-2 mb-1">
              <User className="w-5 h-5 text-gold-600 dark:text-gold-400" />
              <h2 className="font-heading font-semibold text-charcoal dark:text-white">مشخصات مشتری</h2>
            </div>

            {/* Display Selected or Search */}
            {selectedCustomer ? (
              <div className="bg-gold-50 dark:bg-slate-700/50 rounded-xl p-4 border border-gold-100 dark:border-slate-600 relative group">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="absolute top-2 left-2 p-1 text-slate-400 hover:text-red-500 transition-colors"
                  title="تغییر مشتری"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <p className="font-bold text-lg text-charcoal dark:text-white">{selectedCustomer.customerName}</p>
                <p className="text-charcoal-soft dark:text-slate-300 text-sm mt-1" dir="ltr">{selectedCustomer.phone}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <SearchCustomer
                  fetchData={fetchCustomers}
                  query={customerQuery}
                  setQuery={setCustomerQuery}
                  handleKeyDown={handleCustomerKeyDown}
                />
                {customerLoading && <p className="text-xs text-charcoal-soft text-center animate-pulse">در حال جستجو...</p>}

                {/* Search Results Dropdown */}
                {customerResults.length > 0 && (
                  <div className="absolute z-10 left-4 right-4 mt-1 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gold-100 dark:border-slate-600 max-h-48 overflow-y-auto custom-scrollbar">
                    {customerResults.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => selectCustomer(c)}
                        className="py-2.5 px-4 cursor-pointer hover:bg-gold-50 dark:hover:bg-slate-700 transition-colors border-b border-gray-100 dark:border-slate-700 last:border-0"
                      >
                        <p className="font-medium text-sm text-charcoal dark:text-white">{c.customerName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400" dir="ltr">{c.phone}</p>
                      </div>
                    ))}
                  </div>
                )}

                <Link
                  href="/customer-registration"
                  className="flex items-center justify-center gap-2 text-sm text-gold-600 hover:text-gold-700 dark:text-gold-400 dark:hover:text-gold-300 font-medium py-2 rounded-lg hover:bg-gold-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>ثبت مشتری جدید</span>
                </Link>
              </div>
            )}
          </div>

          {/* Summary Card */}
          <div className="card-luxury p-5 rounded-2xl border border-gold-200/50 dark:border-slate-600/50 bg-gradient-to-br from-white to-gold-50/30 dark:from-slate-800 dark:to-slate-900">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-gold-600 dark:text-gold-400" />
              <h2 className="font-heading font-semibold text-charcoal dark:text-white">خلاصه حساب</h2>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-700">
                <span className="text-sm text-charcoal-soft dark:text-slate-400">تعداد اقلام</span>
                <span className="font-bold text-lg">{getTotalItems()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gold-500 text-white rounded-xl shadow-lg shadow-gold-500/20">
                <span className="text-sm font-medium opacity-90">مجموع کل</span>
                <span className="font-bold text-xl">{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={openCheckout}
              disabled={cart.length === 0}
              className="btn-luxury btn-luxury-primary w-full py-3.5 text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              <span>ثبت بل و نهایی سازی</span>
            </button>

            {lastSoldForBarcode && lastSoldForBarcode.product?.length > 0 && (
              <button
                type="button"
                onClick={() => handleBarcodePrint()}
                className="btn-luxury btn-luxury-outline w-full py-2.5 flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>چاپ بارکود</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Checkout modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-10">
          <div className="card-luxury p-6 rounded-2xl w-full max-w-md shadow-xl bg-white dark:bg-slate-800 border border-gold-200 dark:border-slate-700">
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

      {/* Invoice modal after successful sale */}
      {showInvoiceModal && transactionToPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 shadow-2xl">
            <button
              type="button"
              onClick={closeInvoiceModal}
              className="absolute top-4 left-4 z-10 p-2 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-600 dark:text-slate-300 transition-colors"
              aria-label="بستن"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-4 sm:p-6">
              <SaleInvoice data={transactionToPrint} company={companyForInvoice} forPrint={false} />
            </div>
            <div className="sticky bottom-0 left-0 right-0 flex gap-3 p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-700 rounded-b-2xl">
              <button
                type="button"
                onClick={openPrintPage}
                className="btn-luxury btn-luxury-primary flex-1 py-3 flex items-center justify-center gap-2"
              >
                <Printer className="w-5 h-5" />
                چاپ فاکتور
              </button>
              <button
                type="button"
                onClick={closeInvoiceModal}
                className="btn-luxury btn-luxury-outline flex-1 py-3"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

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
