'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import axios from 'axios'

interface Supplier {
  id: number
  name: string
  phone: string
  address: string | null
  isActive: boolean
}

export default function SupplierShowPage() {
  const params = useParams()
  const id = params?.id as string | undefined
  const [supplier, setSupplier] = useState<Supplier | null>(null)
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
      .get<{ success: boolean; data: Supplier }>(`/api/supplier/${id}`)
      .then(({ data: res }) => {
        if (!cancelled && res.success && res.data) setSupplier(res.data)
        else if (!cancelled) setNotFound(true)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-charcoal-soft">در حال بارگذاری...</p>
      </div>
    )
  }

  if (notFound || !supplier) {
    return (
      <div className="space-y-6">
        <Link href="/suppliers" className="text-gold-600 hover:underline text-sm">
          بازگشت به لیست تمویل‌کنندگان
        </Link>
        <p className="text-charcoal-soft">تمویل‌کننده یافت نشد.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 transition-opacity duration-200">
      <Link href="/suppliers" className="inline-flex items-center gap-1 text-gold-600 hover:underline text-sm">
        بازگشت به لیست تمویل‌کنندگان
      </Link>

      <div className="card-luxury rounded-2xl border border-gold-200/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gold-200 bg-gold-50/50">
          <h1 className="font-heading text-2xl font-semibold text-charcoal">{supplier.name}</h1>
          <p className="mt-1 text-sm text-charcoal-soft">
            {supplier.isActive ? 'فعال' : 'غیرفعال'}
          </p>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 p-6 text-sm">
          <div>
            <dt className="text-charcoal-soft">نام</dt>
            <dd className="font-medium text-charcoal">{supplier.name}</dd>
          </div>
          <div>
            <dt className="text-charcoal-soft">شماره تماس</dt>
            <dd className="font-medium text-charcoal">{supplier.phone}</dd>
          </div>
          {supplier.address && (
            <div className="sm:col-span-2">
              <dt className="text-charcoal-soft">آدرس</dt>
              <dd className="font-medium text-charcoal">{supplier.address}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  )
}
