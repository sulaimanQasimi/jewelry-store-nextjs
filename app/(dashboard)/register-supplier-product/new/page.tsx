'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SupplierProductFormContent from '@/components/supplier/SupplierProductFormContent'

export default function NewSupplierProductPage() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <Link
        href="/register-supplier-product"
        className="inline-flex items-center gap-1 text-gold-600 hover:underline text-sm"
      >
        بازگشت به لیست اجناس تمویل
      </Link>

      <div className="card-luxury rounded-2xl border border-gold-200/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gold-200 bg-gold-50/50">
          <h1 className="font-heading text-2xl font-semibold text-charcoal">افزودن جنس تمویل</h1>
        </div>
        <div className="p-6">
          <SupplierProductFormContent
            mode="create"
            initialData={null}
            onSuccess={() => router.push('/register-supplier-product')}
            onCancel={() => router.push('/register-supplier-product')}
          />
        </div>
      </div>
    </div>
  )
}
