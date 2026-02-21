'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProductFormContent from '@/components/product/ProductFormContent'

export default function NewProductPage() {
  const router = useRouter()

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        <Link
          href="/products"
          className="btn-luxury btn-luxury-outline py-2 px-4"
        >
          بازگشت
        </Link>
        <h1 className="font-heading text-2xl font-semibold text-charcoal dark:text-white">
          افزودن جنس
        </h1>
      </header>

      <div className="bg-white dark:bg-slate-800/90 p-6 sm:p-8 rounded-2xl border border-amber-100 dark:border-slate-600/50 shadow-sm">
        <ProductFormContent
          mode="create"
          initialData={null}
          onSuccess={() => router.push('/products')}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  )
}
