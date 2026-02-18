'use client'

import React, { useState, useCallback, useContext, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useCart } from '@/context/CartContext'
import type { CartItem } from '@/context/CartContext'
import { AppContext } from '@/lib/context/AppContext'
import type { CompanyInfo } from '@/components/sale/SaleInvoice'
import StepIndicator from './StepIndicator'
import StepProductSelection from './steps/StepProductSelection'
import StepCustomerInfo from './steps/StepCustomerInfo'
import StepPayment from './steps/StepPayment'
import StepSuccess from './steps/StepSuccess'
import type { WizardStepId, CustomerOption, PaymentFormData, TransactionResult } from './types'
import { WIZARD_PERSIST_KEY, WIZARD_STEPS, type PersistedWizardState } from './types'
import { useReducedMotion } from './useReducedMotion'

const SALE_INVOICE_PRINT_KEY = 'saleInvoicePrint'
const PERSIST_DEBOUNCE_MS = 400
const PERSIST_MAX_AGE_MS = 24 * 60 * 60 * 1000 // 24 hours

function getSlideVariants(reducedMotion: boolean) {
  if (reducedMotion) {
    return {
      enter: () => ({ opacity: 0 }),
      center: { opacity: 1 },
      exit: () => ({ opacity: 0 })
    }
  }
  return {
    enter: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 24 : -24
    }),
    center: { opacity: 1, x: 0 },
    exit: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? -24 : 24
    })
  }
}

function getDefaultPayment(): PaymentFormData {
  if (typeof window === 'undefined') {
    return {
      bellNumber: '',
      receiptDate: '',
      paidAmount: '',
      note: ''
    }
  }
  const today = new Date().toISOString().split('T')[0]
  return {
    bellNumber: '',
    receiptDate: today,
    paidAmount: '',
    note: ''
  }
}

export default function SalesWizard() {
  const { backendUrl, companyData: contextCompany } = useContext(AppContext)
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

  const cart = useCart()
  const cartItems = cart?.cart ?? []
  const clearCart = cart?.clearCart ?? (() => {})
  const getTotalPrice = cart?.getTotalPrice ?? (() => 0)
  const getTotalItems = cart?.getTotalItems ?? (() => 0)

  const [step, setStep] = useState<WizardStepId>(1)
  const [direction, setDirection] = useState(0)
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerOption | null>(null)
  const [payment, setPayment] = useState<PaymentFormData>(getDefaultPayment())
  const [transactionResult, setTransactionResult] = useState<TransactionResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const stepContentRef = useRef<HTMLDivElement>(null)
  const liveRegionRef = useRef<HTMLDivElement>(null)
  const persistTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reducedMotion = useReducedMotion()
  const slideVariants = getSlideVariants(reducedMotion)

  // Restore persisted wizard state on mount (skip if stale or invalid)
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = sessionStorage.getItem(WIZARD_PERSIST_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as PersistedWizardState
      if (!parsed || typeof parsed.step !== 'number' || parsed.step < 1 || parsed.step > 4) return
      const age = Date.now() - (parsed.persistedAt ?? 0)
      if (age > PERSIST_MAX_AGE_MS) {
        sessionStorage.removeItem(WIZARD_PERSIST_KEY)
        return
      }
      setStep(parsed.step as WizardStepId)
      if (parsed.selectedCustomer && typeof parsed.selectedCustomer.id === 'number') {
        setSelectedCustomer(parsed.selectedCustomer)
      }
      if (parsed.payment && typeof parsed.payment.receiptDate === 'string') {
        setPayment((prev) => ({ ...prev, ...parsed.payment }))
      }
    } catch {
      sessionStorage.removeItem(WIZARD_PERSIST_KEY)
    }
  }, [])

  // Persist state when step, customer, or payment changes (debounced)
  useEffect(() => {
    if (step === 4 || transactionResult) return
    persistTimeoutRef.current = setTimeout(() => {
      try {
        const payload: PersistedWizardState = {
          step,
          selectedCustomer,
          payment,
          persistedAt: Date.now()
        }
        sessionStorage.setItem(WIZARD_PERSIST_KEY, JSON.stringify(payload))
      } catch {
        // ignore
      }
      persistTimeoutRef.current = null
    }, PERSIST_DEBOUNCE_MS)
    return () => {
      if (persistTimeoutRef.current) clearTimeout(persistTimeoutRef.current)
    }
  }, [step, selectedCustomer, payment, transactionResult])

  // Focus step content when step changes (accessibility)
  useEffect(() => {
    stepContentRef.current?.focus({ preventScroll: true })
  }, [step])

  // Announce step change to screen readers
  useEffect(() => {
    const label = WIZARD_STEPS.find((s) => s.id === step)?.label
    if (liveRegionRef.current && label) {
      liveRegionRef.current.textContent = `مرحله ${step} از ۴: ${label}`
    }
  }, [step])

  useEffect(() => {
    setPayment((prev) => ({
      ...prev,
      receiptDate: new Date().toISOString().split('T')[0]
    }))
  }, [])

  const goTo = useCallback((next: WizardStepId) => {
    setDirection(next > step ? 1 : -1)
    setStep(next)
  }, [step])

  const convertToEnglish = useCallback((str: string) => {
    const map: Record<string, string> = {
      '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
      '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
      '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
      '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
    }
    return str.replace(/[۰-۹٠-٩]/g, (d) => map[d] ?? d)
  }, [])

  const productPayload = cartItems.map((item: CartItem) => ({
    productId: item.id ?? item._id,
    productName: item.productName,
    purchasePriceToAfn: item.purchasePriceToAfn ?? 0,
    salePrice: { price: item.salePrice, currency: item.saleCurrency },
    barcode: item.barcode ?? '',
    gram: item.gram ?? 0,
    karat: item.karat ?? 0
  }))

  const handlePaymentSubmit = useCallback(async (data: PaymentFormData) => {
    if (!selectedCustomer) {
      toast.warn('مشتری انتخاب نشده است')
      return
    }
    if (cartItems.length === 0) {
      toast.warn('سبد خرید خالی است')
      return
    }
    const bell = Number(convertToEnglish(data.bellNumber))
    if (!bell || isNaN(bell)) {
      toast.warn('شماره بل معتبر وارد کنید')
      return
    }
    const paidNum = Number(convertToEnglish(data.paidAmount)) || 0
    const totalAmount = getTotalPrice()
    const remainingAmount = totalAmount - paidNum

    const receipt = {
      totalAmount,
      paidAmount: paidNum,
      remainingAmount,
      totalQuantity: getTotalItems(),
      date: data.receiptDate || new Date().toISOString().split('T')[0]
    }

    setSubmitting(true)
    try {
      const base = backendUrl || ''
      const { data: res } = await axios.post<{ success: boolean; message?: string; data?: TransactionResult }>(
        `${base}/api/transaction/create-transaction`,
        {
          customerId: selectedCustomer.id,
          product: productPayload,
          receipt,
          bellNumber: bell,
          note: data.note || null
        }
      )
      if (res.success && res.data) {
        clearCart()
        setTransactionResult(res.data)
        setPayment(data)
        try {
          sessionStorage.removeItem(WIZARD_PERSIST_KEY)
        } catch {
          // ignore
        }
        goTo(4)
      } else {
        toast.error(res.message || 'خطا در ثبت تراکنش')
      }
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message : (err as Error)?.message
      toast.error(String(msg || 'خطا در ثبت تراکنش'))
    } finally {
      setSubmitting(false)
    }
  }, [selectedCustomer, cartItems, productPayload, getTotalPrice, getTotalItems, clearCart, backendUrl, convertToEnglish, goTo])

  const openPrint = useCallback(() => {
    if (!transactionResult) return
    try {
      localStorage.setItem(
        SALE_INVOICE_PRINT_KEY,
        JSON.stringify({ transaction: transactionResult, company: companyForInvoice })
      )
      window.open('/sale-product/print', '_blank', 'noopener,noreferrer')
    } catch {
      toast.error('خطا در باز کردن صفحه چاپ')
    }
  }, [transactionResult, companyForInvoice])

  const startNewSale = useCallback(() => {
    setStep(1)
    setDirection(0)
    setSelectedCustomer(null)
    setPayment(getDefaultPayment())
    setTransactionResult(null)
    try {
      sessionStorage.removeItem(WIZARD_PERSIST_KEY)
    } catch {
      // ignore
    }
  }, [])

  const totalAmount = getTotalPrice()

  const currentStepLabel = WIZARD_STEPS.find((s) => s.id === step)?.label

  return (
    <div className="max-w-4xl mx-auto">
      {/* Screen reader announcement when step changes */}
      <div
        ref={liveRegionRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      <div className="mb-8 sm:mb-10">
        <StepIndicator
          currentStep={step}
          onStepClick={step < 4 ? goTo : undefined}
        />
      </div>

      <div
        ref={stepContentRef}
        tabIndex={-1}
        role="region"
        aria-labelledby="wizard-step-heading"
        className="min-h-[420px] outline-none"
      >
        <h2 id="wizard-step-heading" className="sr-only">
          {currentStepLabel}
        </h2>
        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <StepProductSelection onNext={() => goTo(2)} />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <div className="flex flex-col gap-4">
                <StepCustomerInfo
                  initialCustomer={selectedCustomer}
                  onNext={(customer) => {
                    setSelectedCustomer(customer)
                    goTo(3)
                  }}
                />
                <div className="flex justify-start pt-2">
                  <motion.button
                    type="button"
                    onClick={() => goTo(1)}
                    whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                    className="text-sm text-charcoal-soft dark:text-slate-400 hover:text-gold-600 dark:hover:text-gold-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 rounded px-1 py-0.5"
                    aria-label="بازگشت به مرحله انتخاب محصول"
                  >
                    ← بازگشت به انتخاب محصول
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <div className="flex flex-col gap-4">
                <StepPayment
                  totalAmount={totalAmount}
                  initialPayment={payment}
                  onSubmit={handlePaymentSubmit}
                  isSubmitting={submitting}
                />
                <div className="flex justify-start pt-2">
                  <motion.button
                    type="button"
                    onClick={() => goTo(2)}
                    whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                    className="text-sm text-charcoal-soft dark:text-slate-400 hover:text-gold-600 dark:hover:text-gold-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 rounded px-1 py-0.5"
                    aria-label="بازگشت به مرحله مشخصات مشتری"
                  >
                    ← بازگشت به مشخصات مشتری
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
          {step === 4 && transactionResult && (
            <motion.div
              key="step4"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <StepSuccess
                transaction={transactionResult}
                onPrint={openPrint}
                onStartNewSale={startNewSale}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
