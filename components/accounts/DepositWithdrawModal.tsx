'use client'

import React, { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { submitAccountTransaction } from '@/lib/actions/accounts'
import type { TransactionType } from '@/lib/actions/accounts'

interface DepositWithdrawModalProps {
  open: boolean
  onClose: () => void
  accountId: string
  accountName: string
  currency: string
  type: TransactionType
  onSuccess?: () => void
}

export default function DepositWithdrawModal({
  open,
  onClose,
  accountId,
  accountName,
  currency,
  type,
  onSuccess
}: DepositWithdrawModalProps) {
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const title = type === 'credit' ? 'Deposit' : 'Withdraw'
  const buttonLabel = type === 'credit' ? 'واریز' : 'برداشت'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const formData = new FormData(form)
    const amount = parseFloat((formData.get('amount') as string) || '0')
    const description = (formData.get('description') as string)?.trim() || null
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('مبلغ معتبر وارد کنید.')
      return
    }
    setSubmitting(true)
    try {
      const result = await submitAccountTransaction(accountId, amount, type, description)
      if (result.success) {
        onSuccess?.()
        onClose()
      } else {
        setError(result.error ?? 'عملیات ناموفق.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={`${title} — ${accountName}`} size="default">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            مبلغ ({currency})
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.0001"
            min="0.0001"
            required
            placeholder="0.00"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            توضیح (اختیاری)
          </label>
          <input
            id="description"
            name="description"
            type="text"
            placeholder="مثال: واریز نقدی"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}
        <div className="flex gap-3 justify-end pt-2 border-t border-slate-200 dark:border-slate-600">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            لغو
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-lg font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'در حال پردازش...' : buttonLabel}
          </button>
        </div>
      </form>
    </Modal>
  )
}
