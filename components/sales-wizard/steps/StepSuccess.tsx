'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Check, ShoppingBag, Printer } from 'lucide-react'
import type { TransactionResult } from '../types'
import { useReducedMotion } from '../useReducedMotion'

interface StepSuccessProps {
  transaction: TransactionResult
  onPrint?: () => void
  onStartNewSale: () => void
}

export default function StepSuccess({ transaction, onPrint, onStartNewSale }: StepSuccessProps) {
  const reducedMotion = useReducedMotion()
  const firstFocusRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    firstFocusRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 25 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <motion.div
        initial={reducedMotion ? false : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
        className="relative mb-8"
      >
        <motion.div
          initial={reducedMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.2 }}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gold-500 flex items-center justify-center mx-auto shadow-lg shadow-gold-500/30"
        >
          <Check className="w-12 h-12 sm:w-14 sm:h-14 text-white" strokeWidth={2.5} aria-hidden />
        </motion.div>
        {!reducedMotion && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-gold-400"
            initial={{ scale: 1.2, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
            aria-hidden
          />
        )}
      </motion.div>

      <motion.h2
        id="success-heading"
        initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="font-heading text-2xl sm:text-3xl font-bold text-charcoal dark:text-white mb-2"
      >
        فروش با موفقیت ثبت شد
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-charcoal-soft dark:text-slate-400 mb-8 max-w-md"
      >
        بل شماره {transaction.bellNumber} برای {transaction.customerName} ثبت شد.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 p-6 w-full max-w-sm text-right"
      >
        <div className="flex justify-between text-sm mb-2">
          <span className="text-charcoal-soft dark:text-slate-400">مشتری</span>
          <span className="font-medium text-charcoal dark:text-white">{transaction.customerName}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-charcoal-soft dark:text-slate-400">تماس</span>
          <span className="font-medium" dir="ltr">{transaction.customerPhone}</span>
        </div>
        <div className="flex justify-between text-sm pt-2 border-t border-slate-100 dark:border-slate-700">
          <span className="text-charcoal-soft dark:text-slate-400">مجموع</span>
          <span className="font-bold text-gold-600 dark:text-gold-400">
            {(transaction.receipt?.totalAmount ?? 0).toLocaleString('fa-IR')}
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-3 mt-8 w-full max-w-sm"
      >
        {onPrint && (
          <motion.button
            type="button"
            onClick={onPrint}
            whileTap={{ scale: 0.98 }}
            className="btn-luxury btn-luxury-outline flex-1 py-2.5 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
            aria-label="چاپ فاکتور"
          >
            <Printer className="w-5 h-5" aria-hidden />
            چاپ فاکتور
          </motion.button>
        )}
        <motion.button
          ref={firstFocusRef}
          type="button"
          onClick={onStartNewSale}
          whileTap={{ scale: 0.98 }}
          className="btn-luxury btn-luxury-primary flex-1 py-2.5 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
          aria-label="شروع فروش جدید"
        >
          <ShoppingBag className="w-5 h-5" aria-hidden />
          فروش جدید
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
