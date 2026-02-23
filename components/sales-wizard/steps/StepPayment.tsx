'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { CreditCard, Calendar, FileText, Banknote, Sparkles } from 'lucide-react'
import type { PaymentFormData } from '../types'
import PersianDatePicker from '@/components/ui/PersianDatePicker'

interface StepPaymentProps {
  totalAmount: number
  initialPayment: PaymentFormData
  onSubmit: (data: PaymentFormData) => void
  isSubmitting: boolean
}

export default function StepPayment({
  totalAmount,
  initialPayment,
  onSubmit,
  isSubmitting
}: StepPaymentProps) {
  const [bellNumber, setBellNumber] = useState(initialPayment.bellNumber)
  const [receiptDate, setReceiptDate] = useState(initialPayment.receiptDate)
  const [paidAmount, setPaidAmount] = useState(initialPayment.paidAmount)
  const [note, setNote] = useState(initialPayment.note)
  const [loadingNextBell, setLoadingNextBell] = useState(false)

  // Sync from parent when initialPayment or totalAmount changes (e.g. returning to step 3 or cart updated)
  useEffect(() => {
    setBellNumber(initialPayment.bellNumber)
    setReceiptDate(initialPayment.receiptDate)
    setPaidAmount(initialPayment.paidAmount)
    setNote(initialPayment.note)
  }, [initialPayment.bellNumber, initialPayment.receiptDate, initialPayment.paidAmount, initialPayment.note])

  const fetchNextBellNumber = async () => {
    setLoadingNextBell(true)
    try {
      const { data } = await axios.get<{ success?: boolean; nextBellNumber?: number }>('/api/transaction/next-bell')
      if (data.success && data.nextBellNumber != null) {
        setBellNumber(String(data.nextBellNumber))
      }
    } catch {
      // ignore
    } finally {
      setLoadingNextBell(false)
    }
  }

  const convertToEnglish = (str: string) => {
    const map: Record<string, string> = {
      '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
      '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
      '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
      '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
    }
    return str.replace(/[۰-۹٠-٩]/g, (d) => map[d] ?? d)
  }

  const paidNum = Number(typeof paidAmount === 'string' ? convertToEnglish(paidAmount) : paidAmount) || 0
  const remaining = Math.max(0, Number(totalAmount) - paidNum)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      bellNumber,
      receiptDate,
      paidAmount,
      note
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <p className="text-charcoal-soft dark:text-slate-400 text-sm">
        شماره بل، تاریخ و مبلغ پرداختی را وارد کنید.
      </p>

      {/* Card-style layout: light in light mode, dark in dark mode */}
      <motion.div
        className="rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-700 p-6 sm:p-8 text-charcoal dark:text-white shadow-xl shadow-slate-200/50 dark:shadow-none"
        initial={{ scale: 0.98 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="w-5 h-5 text-gold-600 dark:text-gold-400" />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">اطلاعات رسید</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="payment-bell" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                شماره بل
              </label>
              <div className="flex gap-2">
                <input
                  id="payment-bell"
                  type="number"
                  min={1}
                  value={bellNumber}
                  onChange={(e) => setBellNumber(e.target.value)}
                  required
                  className="w-full rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 px-4 py-3 text-charcoal dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="مثال: 1234"
                  aria-required="true"
                />
                <button
                  type="button"
                  onClick={fetchNextBellNumber}
                  disabled={loadingNextBell}
                  className="btn-luxury btn-luxury-outline shrink-0 px-3 py-2 flex items-center gap-1.5 text-sm disabled:opacity-60"
                  title="تولید خودکار شماره بل"
                >
                  {loadingNextBell ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      تولید
                    </>
                  )}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="payment-date" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" aria-hidden />
                تاریخ
              </label>
              <PersianDatePicker
                value={receiptDate || null}
                onChange={(v) => setReceiptDate(v ?? '')}
                className="w-full rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 px-4 py-3 text-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="payment-amount" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1">
              <Banknote className="w-3.5 h-3.5" aria-hidden />
              مبلغ پرداختی (رسید)
            </label>
            <motion.input
              id="payment-amount"
              type="number"
              min={0}
              step={1}
              value={paidAmount ? (typeof paidAmount === 'string' ? paidAmount : String(paidAmount)) : ''}
              onChange={(e) => setPaidAmount(e.target.value)}
              required
              className="w-full rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 px-4 py-4 text-xl text-charcoal dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
              whileFocus={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            />
          </div>

          <div>
            <label htmlFor="payment-note" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" aria-hidden />
              یادداشت (اختیاری)
            </label>
            <textarea
              id="payment-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="w-full rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 px-4 py-3 text-charcoal dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all resize-none"
              placeholder="توضیحات..."
              aria-label="یادداشت اختیاری"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-200 dark:border-white/10">
            <div className="flex-1 rounded-xl bg-slate-100/80 dark:bg-white/5 p-4">
              <p className="text-xs text-slate-600 dark:text-slate-400">مجموع کل</p>
              <p className="text-2xl font-bold text-charcoal dark:text-white mt-0.5" dir="ltr">
                {Number(totalAmount).toLocaleString('fa-IR')}
              </p>
            </div>
            <div className="flex-1 rounded-xl bg-slate-100/80 dark:bg-white/5 p-4">
              <p className="text-xs text-slate-600 dark:text-slate-400">باقی‌مانده</p>
              <p className="text-2xl font-bold text-gold-600 dark:text-gold-400 mt-0.5" dir="ltr">
                {Number(remaining).toLocaleString('fa-IR')}
              </p>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileTap={!isSubmitting ? { scale: 0.98 } : undefined}
            className="w-full btn-luxury btn-luxury-primary py-3.5 text-lg mt-4 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
            aria-busy={isSubmitting}
            aria-label={isSubmitting ? 'در حال ثبت فروش' : 'ثبت فروش'}
          >
            {isSubmitting ? 'در حال ثبت...' : 'ثبت فروش'}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  )
}
