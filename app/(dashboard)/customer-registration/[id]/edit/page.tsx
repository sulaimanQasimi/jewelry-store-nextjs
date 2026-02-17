'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import CustomerForm from '@/components/customer/CustomerForm'
import type { CustomerFormData } from '@/components/customer/CustomerForm'

export default function EditCustomerPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string | undefined
  const [customer, setCustomer] = useState<CustomerFormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) {
      setNotFound(true)
      setLoading(false)
      return
    }
    let cancelled = false
    axios
      .get<{ success: boolean; data: CustomerFormData & { date?: string } }>(`/api/customer/${id}`)
      .then(({ data: res }) => {
        if (!cancelled && res.success && res.data) {
          setCustomer({
            id: res.data.id,
            customerName: res.data.customerName ?? '',
            phone: res.data.phone ?? '',
            email: res.data.email ?? null,
            address: res.data.address ?? null,
            image: res.data.image ?? null,
            secondaryPhone: res.data.secondaryPhone ?? null,
            companyName: res.data.companyName ?? null,
            notes: res.data.notes ?? null,
            birthDate: res.data.birthDate ?? null,
            nationalId: res.data.nationalId ?? null,
            facebookUrl: res.data.facebookUrl ?? null,
            instagramUrl: res.data.instagramUrl ?? null,
            whatsappUrl: res.data.whatsappUrl ?? null,
            telegramUrl: res.data.telegramUrl ?? null
          })
        } else if (!cancelled) setNotFound(true)
      })
      .catch(() => {
        if (!cancelled) setNotFound(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const handleSuccess = () => {
    router.push(`/customer-registration/${id}`)
  }

  const handleCancel = () => {
    router.push(`/customer-registration/${id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-charcoal-soft">در حال بارگذاری...</p>
      </div>
    )
  }

  if (notFound || !customer) {
    return (
      <div className="space-y-6">
        <Link
          href="/customer-registration"
          className="text-gold-600 hover:underline text-sm"
        >
          بازگشت به لیست مشتریان
        </Link>
        <p className="text-charcoal-soft">مشتری یافت نشد.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link
        href={`/customer-registration/${id}`}
        className="inline-flex items-center gap-1 text-gold-600 hover:underline text-sm"
      >
        بازگشت به مشتری
      </Link>
      <div className="card-luxury rounded-2xl border border-gold-200/50 p-6 sm:p-8">
        <h1 className="font-heading text-2xl font-semibold text-charcoal mb-6">ویرایش مشتری</h1>
        <CustomerForm
          mode="edit"
          initialData={customer}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
