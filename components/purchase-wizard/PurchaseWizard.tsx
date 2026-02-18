'use client'

import React, { useReducer, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { purchaseWizardReducer } from './reducer'
import type { PurchaseWizardAction } from './reducer'
import { PURCHASE_WIZARD_STEPS, getInitialState } from './types'
import type { PurchaseWizardState, PurchaseStepId } from './types'
import Step1SupplierBill from './steps/Step1SupplierBill'
import Step2Items from './steps/Step2Items'
import Step3Payment from './steps/Step3Payment'
import Step4Review from './steps/Step4Review'

function getSlideVariants(direction: number) {
  return {
    enter: { opacity: 0, x: direction > 0 ? 24 : -24 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: direction > 0 ? -24 : 24 }
  }
}

export default function PurchaseWizard() {
  const router = useRouter()
  const [state, dispatch] = useReducer(purchaseWizardReducer, undefined, getInitialState)
  const [direction, setDirection] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const setStep = useCallback((step: PurchaseStepId) => {
    setDirection(step > state.step ? 1 : -1)
    dispatch({ type: 'SET_STEP', payload: step })
  }, [state.step])

  const handleSupplierChange = useCallback((id: number, supplier: { id: number; name: string } | null) => {
    dispatch({ type: 'SET_SUPPLIER', payload: { supplierId: id, supplierName: supplier?.name ?? '' } })
  }, [])

  const handleBillChange = useCallback((billNumber: string, purchaseDate: string) => {
    dispatch({ type: 'SET_BILL', payload: { billNumber, purchaseDate } })
  }, [])

  const handleFileChange = useCallback((file: File | null) => {
    dispatch({ type: 'SET_INVOICE_FILE', payload: file } as PurchaseWizardAction)
  }, [])

  const handleAddItem = useCallback(() => dispatch({ type: 'ADD_ITEM' }), [])
  const handleRemoveItem = useCallback((id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id }), [])
  const handleUpdateItem = useCallback((id: string, patch: Partial<typeof state.items[0]>) => {
    dispatch({ type: 'UPDATE_ITEM', payload: { id, patch } })
  }, [])

  const handlePaymentChange = useCallback((paymentMode: typeof state.paymentMode, amountPaid: number, balanceDue: number) => {
    dispatch({ type: 'SET_PAYMENT', payload: { paymentMode, amountPaid, balanceDue } })
  }, [])

  const handleConfirm = useCallback(async () => {
    const totalAmount = state.items.reduce((sum, i) => sum + (i.total || 0), 0)
    setSubmitting(true)
    try {
      const { data } = await axios.post('/api/purchase/create', {
        supplierId: state.supplierId,
        supplierName: state.supplierName.trim(),
        totalAmount,
        bellNumber: parseInt(state.billNumber, 10) || 0,
        currency: 'AFN',
        paidAmount: state.amountPaid,
        date: state.purchaseDate,
        items: state.items
          .filter((i) => (i.name?.trim() || i.total > 0))
          .map((i) => ({
            productMasterId: 0,
            name: i.name?.trim() || '',
            type: i.category?.trim() || '',
            gram: i.weight || 0,
            karat: i.carat || 0,
            quantity: 1,
            price: i.total || 0
          }))
      })
      if (data?.success && data?.data?.id) {
        toast.success(data.message ?? 'خرید با موفقیت ثبت شد')
        router.push(`/purchases/${data.data.id}`)
      } else {
        toast.error(data?.message ?? 'خطا در ثبت')
      }
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : null
      toast.error(msg ?? (err instanceof Error ? err.message : 'خطا در ثبت'))
    } finally {
      setSubmitting(false)
    }
  }, [state, router])

  const stepLabels = PURCHASE_WIZARD_STEPS.map((s) => s.label)
  const currentStepIndex = state.step - 1
  const variants = getSlideVariants(direction)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step indicator - Industrial Luxury: clean gray/gold */}
      <nav aria-label="مراحل" className="mb-8">
        <ol className="flex flex-wrap items-center gap-2">
          {stepLabels.map((label, i) => (
            <li key={i} className="flex items-center gap-2">
              <span
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium
                  ${i === currentStepIndex ? 'bg-amber-600 text-white' : i < currentStepIndex ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}
                `}
              >
                {i + 1}. {label}
              </span>
              {i < stepLabels.length - 1 && (
                <ArrowLeft className="w-4 h-4 text-slate-400" aria-hidden />
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Step content */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 shadow-xl p-6 sm:p-8">
        <AnimatePresence mode="wait" initial={false}>
          {state.step === 1 && (
            <motion.div
              key="step1"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <Step1SupplierBill
                state={state}
                onSupplierChange={handleSupplierChange}
                onBillChange={handleBillChange}
                onFileChange={handleFileChange}
                onNext={() => setStep(2)}
              />
            </motion.div>
          )}
          {state.step === 2 && (
            <motion.div
              key="step2"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <Step2Items
                state={state}
                onAddItem={handleAddItem}
                onRemoveItem={handleRemoveItem}
                onUpdateItem={handleUpdateItem}
                onNext={() => setStep(3)}
              />
            </motion.div>
          )}
          {state.step === 3 && (
            <motion.div
              key="step3"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <Step3Payment
                state={state}
                onPaymentChange={handlePaymentChange}
                onNext={() => setStep(4)}
              />
            </motion.div>
          )}
          {state.step === 4 && (
            <motion.div
              key="step4"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <Step4Review
                state={state}
                onConfirm={handleConfirm}
                submitting={submitting}
                onBack={() => setStep(3)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Back button when not on step 1 */}
      {state.step > 1 && state.step < 4 && (
        <div className="mt-6 flex justify-start">
          <button
            type="button"
            onClick={() => setStep((state.step - 1) as PurchaseStepId)}
            className="inline-flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
          >
            <ArrowRight className="w-4 h-4" />
            مرحله قبل
          </button>
        </div>
      )}
    </div>
  )
}
