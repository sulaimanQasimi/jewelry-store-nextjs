'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import axios from 'axios'
import LabelPrintModal from '@/components/product/LabelPrintModal'

interface Product {
  id: number
  productName: string
  type: string
  gram: number
  karat: number
  purchasePriceToAfn: number
  bellNumber?: number | null
  isSold: boolean
  image?: string | null
  barcode: string
  wage?: number | null
  auns?: number | null
  createdAt?: string
  updatedAt?: string
  categories?: { id: number; name: string }[]
}

function formatDate(d: string | null | undefined) {
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

export default function ProductDetailPage() {
  const params = useParams()
  const id = params?.id as string | undefined
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [labelModalOpen, setLabelModalOpen] = useState(false)

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
        if (!cancelled && res.success && res.data) {
          const r = res.data
          const categories = Array.isArray(r.categories)
            ? (r.categories as { id: number; name: string }[]).map((c) => ({ id: Number(c.id), name: String(c.name ?? '') }))
            : []
          setProduct({
            id: Number(r.id),
            productName: String(r.productName ?? r.productname ?? ''),
            type: String(r.type ?? ''),
            gram: Number(r.gram ?? 0),
            karat: Number(r.karat ?? 0),
            purchasePriceToAfn: Number(r.purchasePriceToAfn ?? r.purchasepricetoafn ?? 0),
            bellNumber: r.bellNumber != null || r.bellnumber != null ? Number(r.bellNumber ?? r.bellnumber) : null,
            isSold: Boolean(r.isSold ?? r.issold),
            image: r.image != null ? String(r.image) : null,
            barcode: String(r.barcode ?? ''),
            wage: r.wage != null ? Number(r.wage) : null,
            auns: r.auns != null ? Number(r.auns) : null,
            createdAt: r.createdAt != null ? String(r.createdAt) : undefined,
            updatedAt: r.updatedAt != null ? String(r.updatedAt) : undefined,
            categories
          })
        } else if (!cancelled) setNotFound(true)
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
        <Link href="/products" className="text-gold-600 hover:underline text-sm">
          بازگشت به لیست اجناس
        </Link>
        <p className="text-charcoal-soft">محصول یافت نشد.</p>
      </div>
    )
  }

  const imgSrc = product.image
    ? product.image.startsWith('http')
      ? product.image
      : (typeof window !== 'undefined' ? window.location.origin : '') + product.image
    : null

  return (
    <div className="space-y-6">
      <Link href="/products" className="inline-flex items-center gap-1 text-gold-600 hover:underline text-sm">
        بازگشت به لیست اجناس
      </Link>

      <div className="card-luxury rounded-2xl border border-gold-200/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gold-200 dark:border-slate-600 bg-gold-50/50 dark:bg-slate-800/50 flex flex-row items-center justify-between gap-3 flex-wrap">
          <h1 className="font-heading text-2xl font-semibold text-charcoal dark:text-white">{product.productName}</h1>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setLabelModalOpen(true)}
              className="py-2 px-4 rounded-xl border border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 font-medium text-sm transition-colors"
            >
              چاپ برچسب
            </button>
            <Link
              href={`/products/${product.id}/edit`}
              className="btn-luxury btn-luxury-primary py-2 px-4"
            >
              ویرایش
            </Link>
          </div>
        </div>
        <div className="p-6 flex flex-col sm:flex-row gap-6">
          {imgSrc && (
            <div className="shrink-0 w-48 h-48 rounded-xl border border-gold-200 overflow-hidden bg-gold-50/50">
              <img src={imgSrc} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm flex-1">
            <div>
              <dt className="text-charcoal-soft">نوع</dt>
              <dd className="font-medium text-charcoal">{product.type || '—'}</dd>
            </div>
            {(product.categories ?? []).length > 0 && (
              <div className="sm:col-span-2">
                <dt className="text-charcoal-soft">دسته‌ها</dt>
                <dd className="font-medium text-charcoal flex flex-wrap gap-2 mt-1">
                  {(product.categories ?? []).map((c) => (
                    <span key={c.id} className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200">
                      {c.name}
                    </span>
                  ))}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-charcoal-soft">وزن (گرام)</dt>
              <dd className="font-medium text-charcoal">{product.gram.toLocaleString('fa-IR')}</dd>
            </div>
            <div>
              <dt className="text-charcoal-soft">عیار</dt>
              <dd className="font-medium text-charcoal">{product.karat.toLocaleString('fa-IR')}</dd>
            </div>
            <div>
              <dt className="text-charcoal-soft">قیمت خرید (افغانی)</dt>
              <dd className="font-medium text-charcoal">{product.purchasePriceToAfn?.toLocaleString('fa-IR') ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-charcoal-soft">بارکود</dt>
              <dd className="font-medium text-charcoal phone-ltr" dir="ltr">{product.barcode || '—'}</dd>
            </div>
            <div>
              <dt className="text-charcoal-soft">شماره بل</dt>
              <dd className="font-medium text-charcoal">{product.bellNumber ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-charcoal-soft">وضعیت</dt>
              <dd className="font-medium">{product.isSold ? <span className="text-rose-600">فروخته شده</span> : <span className="text-green-600">موجود</span>}</dd>
            </div>
            <div>
              <dt className="text-charcoal-soft">اجرت</dt>
              <dd className="font-medium text-charcoal">{product.wage != null ? product.wage.toLocaleString('fa-IR') : '—'}</dd>
            </div>
            <div>
              <dt className="text-charcoal-soft">اونس</dt>
              <dd className="font-medium text-charcoal">{product.auns != null ? product.auns.toLocaleString('fa-IR') : '—'}</dd>
            </div>
            <div>
              <dt className="text-charcoal-soft">تاریخ ثبت</dt>
              <dd className="font-medium text-charcoal">{formatDate(product.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-charcoal-soft">آخرین به‌روزرسانی</dt>
              <dd className="font-medium text-charcoal">{formatDate(product.updatedAt)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <LabelPrintModal
        open={labelModalOpen}
        onClose={() => setLabelModalOpen(false)}
        product={product ? { id: product.id, productName: product.productName, barcode: product.barcode, gram: product.gram, karat: product.karat } : null}
      />
    </div>
  )
}
