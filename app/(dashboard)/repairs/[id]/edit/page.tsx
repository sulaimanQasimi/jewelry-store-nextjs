'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import RepairFormContent from '@/components/repair/RepairFormContent'
import type { RepairFormData } from '@/components/repair/RepairFormContent'

export default function EditRepairPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string | undefined
  const [initialData, setInitialData] = useState<RepairFormData | null>(null)
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
      .get<{ success?: boolean; data?: RepairFormData }>(`/api/repairs/${id}`)
      .then(({ data: res }) => {
        if (!cancelled && res?.success && res?.data) {
          const r = res.data
          setInitialData({
            id: r.id,
            customer_id: r.customer_id ?? 0,
            customer_name: r.customer_name ?? '',
            customer_phone: r.customer_phone ?? '',
            product_description: r.product_description ?? '',
            incoming_notes: r.incoming_notes ?? '',
            estimated_cost: r.estimated_cost ?? null,
            currency: r.currency ?? 'AFN',
            status: r.status ?? 'received',
            due_date: r.due_date ?? null
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
        <p className="text-slate-500 dark:text-slate-400">در حال بارگذاری...</p>
      </div>
    )
  }

  if (notFound || !initialData) {
    return (
      <div className="space-y-6">
        <Link href="/repairs" className="text-amber-600 hover:underline text-sm">
          بازگشت به لیست تعمیرات
        </Link>
        <p className="text-slate-500 dark:text-slate-400">تعمیر یافت نشد.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8" dir="rtl">
      <header className="flex items-center gap-4">
        <Link
          href={`/repairs/${id}`}
          className="text-amber-600 dark:text-amber-400 hover:underline text-sm font-stat"
        >
          بازگشت به جزئیات تعمیر
        </Link>
      </header>
      <div className="card-luxury rounded-2xl border border-amber-200/50 dark:border-slate-600/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-amber-200/60 dark:border-slate-600">
          <h1 className="font-heading text-2xl font-semibold text-charcoal dark:text-white">ویرایش تعمیر #{id}</h1>
        </div>
        <div className="p-6">
          <RepairFormContent
            mode="edit"
            initialData={initialData}
            onSuccess={() => router.push('/repairs')}
            onCancel={() => router.push(`/repairs/${id}`)}
          />
        </div>
      </div>
    </div>
  )
}
