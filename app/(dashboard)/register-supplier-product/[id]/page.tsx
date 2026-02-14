'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import axios from 'axios'

interface SupplierProduct {
  id: number
  supplierId: number
  supplierName: string
  name: string
  type: string | null
  karat: number | null
  weight: number
  registeredWeight: number | null
  remainWeight: number | null
  pasa: number
  pasaReceipt: number
  pasaRemaining: number
  wagePerGram: number | null
  totalWage: number
  wageReceipt: number
  wageRemaining: number
  bellNumber: number | null
  detail: string | null
  createdAt: string
  updatedAt: string
}

function formatDate(d: string | null) {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return d
  }
}

function num(v: unknown): string {
  if (v == null) return '—'
  const n = Number(v)
  return isNaN(n) ? '—' : n.toFixed(2)
}

export default function SupplierProductShowPage() {
  const params = useParams()
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
    return () => { cancelled = true }
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

  return (
    <div className="space-y-6 transition-opacity duration-200">
      <Link href="/register-supplier-product" className="inline-flex items-center gap-1 text-gold-600 hover:underline text-sm">
        بازگشت به لیست اجناس تمویل
      </Link>

      <div className="card-luxury rounded-2xl border border-gold-200/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gold-200 bg-gold-50/50">
          <h1 className="font-heading text-2xl font-semibold text-charcoal">
            {product.name}
            {product.type ? ` — ${product.type}` : ''}
          </h1>
          <p className="mt-1 text-sm text-charcoal-soft">تمویل‌کننده: {product.supplierName}</p>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 p-6 text-sm">
          <div>
            <dt className="text-charcoal-soft">نام جنس</dt>
            <dd className="font-medium text-charcoal">{product.name}</dd>
          </div>
          <div>
            <dt className="text-charcoal-soft">تمویل‌کننده</dt>
            <dd className="font-medium text-charcoal">{product.supplierName}</dd>
          </div>
          <div>
            <dt className="text-charcoal-soft">نوعیت</dt>
            <dd className="font-medium text-charcoal">{product.type ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-charcoal-soft">عیار</dt>
            <dd className="font-medium text-charcoal">{product.karat ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-charcoal-soft">وزن</dt>
            <dd className="font-medium text-charcoal">{num(product.weight)}</dd>
          </div>
          <div>
            <dt className="text-charcoal-soft">پاسه</dt>
            <dd className="font-medium text-charcoal">{num(product.pasa)}</dd>
          </div>
          <div>
            <dt className="text-charcoal-soft">رسید پاسه</dt>
            <dd className="font-medium text-charcoal">{num(product.pasaReceipt)}</dd>
          </div>
          <div>
            <dt className="text-charcoal-soft">صرف باقی پاسه</dt>
            <dd className="font-medium text-charcoal">{num(product.pasaRemaining)}</dd>
          </div>
          <div>
            <dt className="text-charcoal-soft">وجوره هر گرم</dt>
            <dd className="font-medium text-charcoal">{product.wagePerGram != null ? num(product.wagePerGram) : '—'}</dd>
          </div>
          <div>
            <dt className="text-charcoal-soft">مجموع وجوره</dt>
            <dd className="font-medium text-charcoal">{num(product.totalWage)}</dd>
          </div>
          <div>
            <dt className="text-charcoal-soft">رسید وجوره</dt>
            <dd className="font-medium text-charcoal">{num(product.wageReceipt)}</dd>
          </div>
          <div>
            <dt className="text-charcoal-soft">صرف باقی وجوره</dt>
            <dd className="font-medium text-charcoal">{num(product.wageRemaining)}</dd>
          </div>
          {product.bellNumber != null && (
            <div>
              <dt className="text-charcoal-soft">شماره بل</dt>
              <dd className="font-medium text-charcoal">{product.bellNumber}</dd>
            </div>
          )}
          <div>
            <dt className="text-charcoal-soft">تاریخ ثبت</dt>
            <dd className="font-medium text-charcoal">{formatDate(product.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-charcoal-soft">آخرین به‌روزرسانی</dt>
            <dd className="font-medium text-charcoal">{formatDate(product.updatedAt)}</dd>
          </div>
        </dl>
        {product.detail && (
          <div className="px-6 pb-6">
            <dt className="text-charcoal-soft text-sm mb-1">جزئیات</dt>
            <dd className="text-charcoal bg-gold-50/50 rounded-xl p-4 text-sm">{product.detail}</dd>
          </div>
        )}
      </div>
    </div>
  )
}
