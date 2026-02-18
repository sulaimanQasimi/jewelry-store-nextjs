'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import ProductFormContent from '@/components/product/ProductFormContent'
import type { ProductFormData } from '@/components/product/ProductFormModal'

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string | undefined
  const [initialData, setInitialData] = useState<ProductFormData | null>(null)
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
      .get<{ success: boolean; data?: Record<string, unknown> }>(`/api/product/${id}`)
      .then(({ data: res }) => {
        if (cancelled) return
        if (res.success && res.data) {
          const r = res.data
          setInitialData({
            id: Number(r.id),
            productName: String(r.productName ?? r.productname ?? ''),
            type: String(r.type ?? ''),
            gram: Number(r.gram ?? 0),
            karat: Number(r.karat ?? 0),
            purchasePriceToAfn: Number(r.purchasePriceToAfn ?? r.purchasepricetoafn ?? 0),
            bellNumber: r.bellNumber != null || r.bellnumber != null ? Number(r.bellNumber ?? r.bellnumber) : null,
            wage: r.wage != null ? Number(r.wage) : null,
            auns: r.auns != null ? Number(r.auns) : null,
            barcode: r.barcode != null ? String(r.barcode) : '',
            image: r.image != null ? String(r.image) : null
          })
        } else setNotFound(true)
      })
      .catch(() => setNotFound(true))
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-charcoal-soft dark:text-slate-400">در حال بارگذاری...</p>
      </div>
    )
  }

  if (notFound || !initialData) {
    return (
      <div className="space-y-6">
        <Link href="/products" className="text-gold-600 hover:underline text-sm">
          بازگشت به لیست اجناس
        </Link>
        <p className="text-charcoal-soft dark:text-slate-400">محصول یافت نشد.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        <Link
          href={`/products/${id}`}
          className="btn-luxury btn-luxury-outline py-2 px-4"
        >
          بازگشت
        </Link>
        <h1 className="font-heading text-2xl font-semibold text-charcoal dark:text-white">
          ویرایش جنس
        </h1>
      </header>

      <div className="card-luxury p-6 rounded-2xl border border-gold-200/50 dark:border-slate-600/50">
        <ProductFormContent
          mode="edit"
          initialData={initialData}
          onSuccess={() => router.push(`/products/${id}`)}
          onCancel={() => router.push(`/products/${id}`)}
        />
      </div>
    </div>
  )
}
