'use client'

import React, { useEffect } from 'react'
import { useFormStatus, useActionState } from 'react-dom'
import Modal from '@/components/ui/Modal'
import { submitAccountTransactionForm } from '@/lib/actions/accounts'
import type { TransactionType, TransactionFormState } from '@/lib/actions/accounts'

interface DepositWithdrawModalProps {
  open: boolean
  onClose: () => void
  accountId: string
  accountName: string
  currency: string
  type: TransactionType
  onSuccess?: () => void
}

function SubmitButton({ type }: { type: TransactionType }) {
  const { pending } = useFormStatus()
  const label = type === 'credit' ? 'Deposit' : 'Withdraw'
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 rounded-lg font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? 'Processing...' : label}
    </button>
  )
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
  const initialState: TransactionFormState = { success: false }
  const [state, formAction] = useActionState(submitAccountTransactionForm, initialState)
  const error = state?.error ?? null

  const title = type === 'credit' ? 'Deposit' : 'Withdraw'

  useEffect(() => {
    if (state?.success) {
      onSuccess?.()
      onClose()
    }
  }, [state?.success, onSuccess, onClose])

  return (
    <Modal open={open} onClose={onClose} title={`${title} — ${accountName}`} size="default">
      <form action={formAction} className="p-6 space-y-4">
        <input type="hidden" name="accountId" value={accountId} />
        <input type="hidden" name="type" value={type} />
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Amount ({currency})
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
            Description (optional)
          </label>
          <input
            id="description"
            name="description"
            type="text"
            placeholder="e.g. Cash deposit"
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
            Cancel
          </button>
          <SubmitButton type={type} />
        </div>
      </form>
    </Modal>
  )
}
