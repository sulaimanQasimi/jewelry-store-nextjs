'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import CustomerForm from '@/components/customer/CustomerForm'
import type { CustomerCreateResponse } from '@/components/customer/CustomerForm'

export default function NewCustomerPage() {
  const router = useRouter()

  const handleSuccess = (data?: CustomerCreateResponse) => {
    const id = data?.newCustomer?.id
    if (id) router.push(`/customer-registration/${id}`)
    else router.push('/customer-registration')
  }

  const handleCancel = () => {
    router.push('/customer-registration')
  }

  return (
    <div className="space-y-6">
      <Link
        href="/customer-registration"
        className="inline-flex items-center gap-1 text-gold-600 hover:underline text-sm"
      >
        بازگشت به لیست مشتریان
      </Link>
      <div className="card-luxury rounded-2xl border border-gold-200/50 p-6 sm:p-8">
        <h1 className="font-heading text-2xl font-semibold text-charcoal mb-6">افزودن مشتری</h1>
        <CustomerForm
          mode="create"
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
