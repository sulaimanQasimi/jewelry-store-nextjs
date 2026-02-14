'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import type { SupplierProduct } from '@/types/supplierProduct'
import type { SupplierProductFormData } from '@/types/supplierProduct'
import SupplierProductFormContent from '@/components/supplier/SupplierProductFormContent'

export default function EditSupplierProductPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string | undefined
  const [product, setProduct] = useState<SupplierProduct | null>(null)
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
      .get<{ success: boolean; data: SupplierProduct }>(`/api/supplier-product/${id}`)
      .then(({ data: res }) => {
        if (!cancelled && res.success && res.data) setProduct(res.data)
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

  if (notFound || !product) {
    return (
      <div className="space-y-6">
        <Link href="/register-supplier-product" className="text-gold-600 hover:underline text-sm">
          بازگشت به لیست اجناس تمویل
        </Link>
        <p className="text-charcoal-soft">جنس تمویل یافت نشد.</p>
      </div>
    )
  }

  const initialData: SupplierProductFormData = {
    id: product.id,
    supplierId: product.supplierId,
    supplierName: product.supplierName,
    name: product.name,
    type: product.type,
    karat: product.karat,
    weight: product.weight,
    pasa: product.pasa,
    pasaReceipt: product.pasaReceipt,
    pasaRemaining: product.pasaRemaining,
    wagePerGram: product.wagePerGram,
    totalWage: product.totalWage,
    wageReceipt: product.wageReceipt,
    wageRemaining: product.wageRemaining,
    detail: product.detail,
    bellNumber: product.bellNumber
  }

  return (
    <div className="space-y-6">
      <Link
        href={`/register-supplier-product/${id}`}
        className="inline-flex items-center gap-1 text-gold-600 hover:underline text-sm"
      >
        بازگشت به مشاهده جنس
      </Link>

      <div className="card-luxury rounded-2xl border border-gold-200/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gold-200 bg-gold-50/50">
          <h1 className="font-heading text-2xl font-semibold text-charcoal">ویرایش جنس تمویل</h1>
          <p className="mt-1 text-sm text-charcoal-soft">{product.name}</p>
        </div>
        <div className="p-6">
          <SupplierProductFormContent
            mode="edit"
            initialData={initialData}
            onSuccess={() => router.push('/register-supplier-product')}
            onCancel={() => router.push(`/register-supplier-product/${id}`)}
          />
        </div>
      </div>
    </div>
  )
}
