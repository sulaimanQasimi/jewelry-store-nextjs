'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import RepairFormContent from '@/components/repair/RepairFormContent'

export default function NewRepairPage() {
  const router = useRouter()

  return (
    <div className="space-y-8" dir="rtl">
      <header className="flex items-center gap-4">
        <Link
          href="/repairs"
          className="text-amber-600 dark:text-amber-400 hover:underline text-sm font-stat"
        >
          بازگشت به لیست تعمیرات
        </Link>
      </header>
      <div className="card-luxury rounded-2xl border border-amber-200/50 dark:border-slate-600/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-amber-200/60 dark:border-slate-600">
          <h1 className="font-heading text-2xl font-semibold text-charcoal dark:text-white">ثبت تعمیر جدید</h1>
        </div>
        <div className="p-6">
          <RepairFormContent
            mode="create"
            initialData={null}
            onSuccess={() => router.push('/repairs')}
            onCancel={() => router.push('/repairs')}
          />
        </div>
      </div>
    </div>
  )
}
