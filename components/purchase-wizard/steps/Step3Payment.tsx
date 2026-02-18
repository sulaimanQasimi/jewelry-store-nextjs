'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, CreditCard, Banknote, Building2 } from 'lucide-react'
import { paymentModeOptions } from '../types'
import type { PurchaseWizardState, PaymentMode } from '../types'

const subtotalFromItems = (state: PurchaseWizardState) =>
  state.items.reduce((sum, i) => sum + (i.total || 0), 0)

interface Step3PaymentProps {
  state: PurchaseWizardState
  onPaymentChange: (paymentMode: PaymentMode, amountPaid: number, balanceDue: number) => void
  onNext: () => void
}

export default function Step3Payment({ state, onPaymentChange, onNext }: Step3PaymentProps) {
  const subtotal = subtotalFromItems(state)
  const [amountPaid, setAmountPaid] = useState(String(state.amountPaid || ''))
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(state.paymentMode)

  const paidNum = parseFloat(amountPaid) || 0
  const balanceDue = Math.max(0, subtotal - paidNum)

  useEffect(() => {
    onPaymentChange(paymentMode, paidNum, balanceDue)
  }, [paymentMode, paidNum, balanceDue])

  const canNext = true

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <p className="text-slate-600 dark:text-slate-400 text-sm">
        روش پرداخت و مبلغ پرداختی را انتخاب کنید. باقیمانده به‌صورت خودکار محاسبه می‌شود.
      </p>

      {/* Secure entry animation - lock/shield style (no Lottie) */}
      <div className="flex justify-center py-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-600 p-6 inline-flex flex-col items-center gap-3"
        >
          <motion.div
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-4"
          >
            <Lock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </motion.div>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">ورود امن مالی</span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
            روش پرداخت
          </label>
          <div className="space-y-2">
            {paymentModeOptions.map((opt) => (
              <label
                key={opt.value}
                className={`
                  flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors
                  ${paymentMode === opt.value ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-900/10' : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'}
                `}
              >
                <input
                  type="radio"
                  name="paymentMode"
                  value={opt.value}
                  checked={paymentMode === opt.value}
                  onChange={() => setPaymentMode(opt.value as PaymentMode)}
                  className="sr-only"
                />
                {opt.value === 'cash' && <Banknote className="w-5 h-5 text-slate-500" />}
                {opt.value === 'bank' && <Building2 className="w-5 h-5 text-slate-500" />}
                {opt.value === 'credit' && <CreditCard className="w-5 h-5 text-slate-500" />}
                <span className="font-medium text-slate-800 dark:text-slate-200">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              مبلغ پرداختی
            </label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              placeholder="0"
              className="input-luxury w-full rounded-xl border-slate-300 dark:border-slate-600 focus:border-amber-500"
            />
          </div>
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-600">
            <p className="text-sm text-slate-500 dark:text-slate-400">باقیمانده</p>
            <p className="text-xl font-semibold text-slate-800 dark:text-white tabular-nums" dir="ltr">
              {Math.max(0, subtotal - paidNum).toLocaleString('fa-IR')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <motion.button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          whileTap={canNext ? { scale: 0.98 } : undefined}
          className="px-6 py-2.5 rounded-xl font-semibold bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
        >
          مرحله بعد: بررسی
        </motion.button>
      </div>
    </motion.div>
  )
}
