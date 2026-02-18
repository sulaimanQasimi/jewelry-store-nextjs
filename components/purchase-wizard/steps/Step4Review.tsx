'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Building2, FileText, Package, CreditCard } from 'lucide-react'
import { paymentModeOptions } from '../types'
import type { PurchaseWizardState } from '../types'

const formatNum = (n: number) => Number(n).toLocaleString('fa-IR', { useGrouping: true })
const paymentLabel = (mode: string) => paymentModeOptions.find((o) => o.value === mode)?.label ?? mode

interface Step4ReviewProps {
  state: PurchaseWizardState
  onConfirm: () => void
  submitting: boolean
  onBack: () => void
}

const CONFETTI_COLORS = ['#f59e0b', '#d97706', '#b45309', '#78716c', '#fbbf24', '#fcd34d']
const PARTICLE_COUNT = 60

function ConfettiBurst({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 2500)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: '50vw',
            y: '50vh',
            opacity: 1,
            scale: 1,
            rotate: 0
          }}
          animate={{
            x: `${Math.random() * 100 - 50}vw`,
            y: `${Math.random() * 100 + 50}vh`,
            opacity: 0,
            scale: 0.2,
            rotate: Math.random() * 720 - 360
          }}
          transition={{
            duration: 1.5 + Math.random() * 0.5,
            delay: Math.random() * 0.2
          }}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            left: '50%',
            top: '40%'
          }}
        />
      ))}
    </div>
  )
}

export default function Step4Review({ state, onConfirm, submitting, onBack }: Step4ReviewProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const subtotal = state.items.reduce((sum, i) => sum + (i.total || 0), 0)
  const balanceDue = Math.max(0, subtotal - state.amountPaid)

  const handleConfirm = () => {
    setShowConfetti(true)
    onConfirm()
  }

  return (
    <>
      <AnimatePresence>
        {showConfetti && (
          <ConfettiBurst onComplete={() => setShowConfetti(false)} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          خلاصه خرید را بررسی کنید و با تأیید، به موجودی اضافه می‌شود.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30 p-5 space-y-4">
            <h3 className="font-heading font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-600" />
              تمویل‌کننده و بل
            </h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-slate-500">تمویل‌کننده</dt>
              <dd className="font-medium text-slate-800 dark:text-slate-200">{state.supplierName}</dd>
              <dt className="text-slate-500">شماره بل</dt>
              <dd className="font-medium tabular-nums" dir="ltr">{state.billNumber}</dd>
              <dt className="text-slate-500">تاریخ</dt>
              <dd className="font-medium">{state.purchaseDate}</dd>
              {state.invoiceFile && (
                <>
                  <dt className="text-slate-500">فایل فاکتور</dt>
                  <dd className="font-medium truncate">{state.invoiceFile.name}</dd>
                </>
              )}
            </dl>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30 p-5 space-y-4">
            <h3 className="font-heading font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-600" />
              پرداخت
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">روش</dt>
                <dd className="font-medium">{paymentLabel(state.paymentMode)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">پرداختی</dt>
                <dd className="font-medium tabular-nums" dir="ltr">{formatNum(state.amountPaid)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">باقیمانده</dt>
                <dd className="font-medium tabular-nums" dir="ltr">{formatNum(balanceDue)}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-600 overflow-hidden">
          <h3 className="font-heading font-semibold text-slate-800 dark:text-white flex items-center gap-2 p-4 bg-slate-100 dark:bg-slate-800/50">
            <Package className="w-5 h-5 text-amber-600" />
            اقلام ({state.items.length})
          </h3>
          <div className="max-h-48 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-700 text-white dark:bg-slate-800">
                  <th className="text-right py-2 px-3">نام</th>
                  <th className="text-right py-2 px-3">دسته</th>
                  <th className="text-right py-2 px-3">وزن</th>
                  <th className="text-right py-2 px-3">جمع</th>
                </tr>
              </thead>
              <tbody>
                {state.items.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100 dark:border-slate-600/50">
                    <td className="py-2 px-3">{item.name || '—'}</td>
                    <td className="py-2 px-3">{item.category || '—'}</td>
                    <td className="py-2 px-3 tabular-nums" dir="ltr">{item.weight}</td>
                    <td className="py-2 px-3 font-medium tabular-nums" dir="ltr">{formatNum(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-600 flex justify-between items-center bg-slate-50 dark:bg-slate-800/30">
            <span className="font-semibold text-slate-800 dark:text-white">جمع کل</span>
            <span className="font-heading text-xl font-bold text-amber-700 dark:text-amber-400 tabular-nums" dir="ltr">
              {formatNum(subtotal)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl font-medium border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
          >
            بازگشت
          </button>
          <motion.button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            whileTap={!submitting ? { scale: 0.98 } : undefined}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
          >
            {submitting ? (
              'در حال ثبت...'
            ) : (
              <>
                <Check className="w-5 h-5" />
                تأیید و افزودن به موجودی
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </>
  )
}
