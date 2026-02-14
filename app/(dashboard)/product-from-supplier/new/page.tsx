'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SupplierProductFormContent from '@/components/supplier/SupplierProductFormContent'

export default function NewProductFromSupplierPage() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <Link
        href="/product-from-supplier"
        className="inline-flex items-center gap-1 text-gold-600 hover:underline text-sm"
      >
        بازگشت به لیست خرید جنس از تمویل‌کننده
      </Link>

      <div className="card-luxury rounded-2xl border border-gold-200/50 dark:border-slate-600/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gold-200 dark:border-slate-600 bg-gold-50/50 dark:bg-slate-800/50">
          <h1 className="font-heading text-2xl font-semibold text-charcoal dark:text-slate-200">افزودن خرید جنس از تمویل‌کننده</h1>
        </div>
        <div className="p-6">
          <SupplierProductFormContent
            mode="create"
            initialData={null}
            onSuccess={() => router.push('/product-from-supplier')}
            onCancel={() => router.push('/product-from-supplier')}
          />
        </div>
      </div>
    </div>
  )
}
