'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Receipt } from 'lucide-react'
import ExpenseForm from '@/components/expense/ExpenseForm'

export default function NewExpensePage() {
  const router = useRouter()

  return (
    <div className="space-y-8" dir="rtl">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/expenses"
              className="text-amber-600 dark:text-amber-400 hover:underline text-sm inline-flex items-center gap-1"
            >
              <ArrowRight className="w-4 h-4" />
              بازگشت به لیست مصارف
            </Link>
          </div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal dark:text-white flex items-center gap-2">
            <Receipt className="w-7 h-7 text-amber-600 dark:text-amber-400" />
            افزودن مصرف
          </h1>
          <p className="mt-1 text-sm text-charcoal-soft dark:text-gray-400">
            نوع، مبلغ، حساب برداشت و جزئیات را وارد کنید.
          </p>
        </div>
      </header>

      <section className="max-w-2xl">
        <ExpenseForm
          mode="create"
          initialData={null}
          onSuccess={() => router.push('/expenses')}
          onCancel={() => router.push('/expenses')}
          cancelLabel="لغو و بازگشت"
        />
      </section>
    </div>
  )
}
