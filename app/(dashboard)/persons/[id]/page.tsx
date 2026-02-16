'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'

interface Person {
  id: number
  name: string
  phone: string
}

export default function PersonDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [data, setData] = useState<Person | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    axios
      .get<{ success: boolean; data?: Person }>(`/api/person/${id}`)
      .then(({ data: res }) => {
        if (res.success && res.data) {
          setData(res.data)
        } else {
          setError('شخص یافت نشد')
        }
      })
      .catch(() => setError('خطا در بارگذاری'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <span className="text-charcoal-soft">در حال بارگذاری...</span>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <p className="text-red-600">{error ?? 'شخص یافت نشد'}</p>
        <Link href="/persons" className="btn-luxury btn-luxury-outline">
          بازگشت به لیست
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal">جزئیات شخص</h1>
          <p className="mt-1 text-sm text-charcoal-soft">{data.name}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/personal-expenses" className="btn-luxury btn-luxury-primary px-6 py-2 shrink-0">
            مصارف شخصی
          </Link>
          <Link href="/persons" className="btn-luxury btn-luxury-outline px-6 py-2 shrink-0">
            بازگشت به لیست
          </Link>
        </div>
      </header>

      <section className="card-luxury rounded-2xl p-6 max-w-2xl">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-charcoal-soft">نام</dt>
            <dd className="font-medium text-charcoal">{data.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-charcoal-soft">شماره تماس</dt>
            <dd className="font-medium text-charcoal phone-ltr" dir="ltr">{data.phone}</dd>
          </div>
        </dl>
      </section>
    </div>
  )
}
