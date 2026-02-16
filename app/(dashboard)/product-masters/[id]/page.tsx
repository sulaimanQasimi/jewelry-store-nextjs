'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'

interface ProductMaster {
  id: number
  name: string
  type: string
  gram: number
  karat: number
  isActive: boolean
}

export default function ProductMasterDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [data, setData] = useState<ProductMaster | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    axios
      .get<{ success: boolean; data?: ProductMaster }>(`/api/product-master/${id}`)
      .then(({ data: res }) => {
        if (res.success && res.data) {
          setData(res.data)
        } else {
          setError('محصول اصلی یافت نشد')
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
        <p className="text-red-600">{error ?? 'محصول اصلی یافت نشد'}</p>
        <Link href="/product-masters" className="btn-luxury btn-luxury-outline">
          بازگشت به لیست
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal">جزئیات محصول اصلی</h1>
          <p className="mt-1 text-sm text-charcoal-soft">{data.name}</p>
        </div>
        <Link href="/product-masters" className="btn-luxury btn-luxury-outline px-6 py-2 shrink-0">
          بازگشت به لیست
        </Link>
      </header>

      <section className="card-luxury rounded-2xl p-6 max-w-2xl">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-charcoal-soft">نام</dt>
            <dd className="font-medium text-charcoal">{data.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-charcoal-soft">نوع</dt>
            <dd className="font-medium text-charcoal">{data.type}</dd>
          </div>
          <div>
            <dt className="text-sm text-charcoal-soft">وزن (گرام)</dt>
            <dd className="font-medium text-charcoal">{data.gram != null ? Number(data.gram).toLocaleString() : '—'}</dd>
          </div>
          <div>
            <dt className="text-sm text-charcoal-soft">عیار</dt>
            <dd className="font-medium text-charcoal">{data.karat != null ? Number(data.karat).toLocaleString() : '—'}</dd>
          </div>
          <div>
            <dt className="text-sm text-charcoal-soft">وضعیت</dt>
            <dd className="font-medium text-charcoal">{data.isActive ? 'فعال' : 'غیرفعال'}</dd>
          </div>
        </dl>
      </section>
    </div>
  )
}
