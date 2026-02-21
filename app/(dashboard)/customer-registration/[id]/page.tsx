'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { FacebookIcon, InstagramIcon, WhatsAppIcon, TelegramIcon } from '@/components/icons/SocialIcons'
import { Receipt, Gift } from 'lucide-react'

interface Customer {
  id: number
  customerName: string
  phone: string
  email: string | null
  address: string | null
  date: string
  image: string | null
  secondaryPhone: string | null
  companyName: string | null
  notes: string | null
  birthDate: string | null
  anniversary_date: string | null
  nationalId: string | null
  facebookUrl: string | null
  instagramUrl: string | null
  whatsappUrl: string | null
  telegramUrl: string | null
}

function formatDate(d: string | null) {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' })
  } catch {
    return d
  }
}

export default function CustomerShowPage() {
  const params = useParams()
  const id = params?.id as string | undefined
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [purchases, setPurchases] = useState<{ purchases: { id: number; bellNumber: number; createdAt: string; totalAmount: number; productCount: number }[]; totalSpent: number; lastPurchaseAt: string | null } | null>(null)
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
      .get<{ success: boolean; data: Customer }>(`/api/customer/${id}`)
      .then(({ data: res }) => {
        if (!cancelled && res.success && res.data) setCustomer(res.data)
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

  useEffect(() => {
    if (!id || !customer?.id) return
    axios
      .get<{ success?: boolean; data?: { purchases: { id: number; bellNumber: number; createdAt: string; totalAmount: number; productCount: number }[]; totalSpent: number; lastPurchaseAt: string | null } }>(`/api/customer/${id}/purchases`)
      .then(({ data }) => {
        if (data?.success && data?.data) setPurchases(data.data)
        else setPurchases(null)
      })
      .catch(() => setPurchases(null))
  }, [id, customer?.id])

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
        <Link href="/customer-registration" className="text-gold-600 hover:underline text-sm">
          بازگشت به لیست مشتریان
        </Link>
        <p className="text-charcoal-soft">مشتری یافت نشد.</p>
      </div>
    )
  }

  const imageUrl = customer.image
    ? (customer.image.startsWith('http') ? customer.image : (typeof window !== 'undefined' ? window.location.origin : '') + customer.image)
    : null

  const socialLinks = [
    { url: customer.facebookUrl, Icon: FacebookIcon, label: 'Facebook', color: 'text-[#1877F2]' },
    { url: customer.instagramUrl, Icon: InstagramIcon, label: 'Instagram', color: 'text-[#E4405F]' },
    { url: customer.whatsappUrl, Icon: WhatsAppIcon, label: 'WhatsApp', color: 'text-[#25D366]' },
    { url: customer.telegramUrl, Icon: TelegramIcon, label: 'Telegram', color: 'text-[#26A5E4]' }
  ]

  return (
    <div className="space-y-6 transition-opacity duration-200">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/customer-registration" className="inline-flex items-center gap-1 text-gold-600 hover:underline text-sm">
          بازگشت به لیست مشتریان
        </Link>
        <Link
          href={`/customer-registration/${customer.id}/edit`}
          className="btn-luxury btn-luxury-outline py-1.5 px-4 text-sm"
        >
          ویرایش
        </Link>
      </div>

      <div className="card-luxury rounded-2xl border border-gold-200/50 overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-8 p-6 sm:p-8">
          <div className="shrink-0">
            <div className="w-40 h-40 rounded-2xl border-2 border-gold-200 bg-gold-50/50 overflow-hidden flex items-center justify-center">
              {imageUrl ? (
                <img src={imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-charcoal-soft">بدون عکس</span>
              )}
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <h1 className="font-heading text-2xl font-semibold text-charcoal">{customer.customerName}</h1>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <dt className="text-charcoal-soft">شماره تماس</dt>
                <dd className="font-medium text-charcoal phone-ltr" dir="ltr">{customer.phone}</dd>
              </div>
              {customer.secondaryPhone && (
                <div>
                  <dt className="text-charcoal-soft">شماره ثانوی</dt>
                  <dd className="font-medium text-charcoal phone-ltr" dir="ltr">{customer.secondaryPhone}</dd>
                </div>
              )}
              {customer.email && (
                <div>
                  <dt className="text-charcoal-soft">ایمیل</dt>
                  <dd className="font-medium text-charcoal">{customer.email}</dd>
                </div>
              )}
              {customer.address && (
                <div className="sm:col-span-2">
                  <dt className="text-charcoal-soft">آدرس</dt>
                  <dd className="font-medium text-charcoal">{customer.address}</dd>
                </div>
              )}
              {customer.companyName && (
                <div>
                  <dt className="text-charcoal-soft">نام شرکت</dt>
                  <dd className="font-medium text-charcoal">{customer.companyName}</dd>
                </div>
              )}
              {customer.birthDate && (
                <div>
                  <dt className="text-charcoal-soft">تاریخ تولد</dt>
                  <dd className="font-medium text-charcoal">{formatDate(customer.birthDate)}</dd>
                </div>
              )}
              {customer.anniversary_date && (
                <div>
                  <dt className="text-charcoal-soft">سالگرد</dt>
                  <dd className="font-medium text-charcoal">{formatDate(customer.anniversary_date)}</dd>
                </div>
              )}
              {customer.nationalId && (
                <div>
                  <dt className="text-charcoal-soft">شناسه ملی</dt>
                  <dd className="font-medium text-charcoal">{customer.nationalId}</dd>
                </div>
              )}
              <div>
                <dt className="text-charcoal-soft">تاریخ ثبت</dt>
                <dd className="font-medium text-charcoal">{formatDate(customer.date)}</dd>
              </div>
            </dl>
            {customer.notes && (
              <div>
                <dt className="text-charcoal-soft text-sm mb-1">یادداشت</dt>
                <dd className="text-charcoal bg-gold-50/50 rounded-xl p-4 text-sm">{customer.notes}</dd>
              </div>
            )}
            <div className="flex flex-wrap gap-3 pt-2">
              {socialLinks.map(({ url, Icon, label, color }) =>
                url ? (
                  <a
                    key={label}
                    href={url.startsWith('http') ? url : `https://${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 rounded-xl border border-gold-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gold-50 ${color}`}
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </a>
                ) : null
              )}
            </div>
          </div>
        </div>
      </div>

      {(customer.birthDate || customer.anniversary_date) && (
        <div className="card-luxury rounded-2xl border border-amber-200/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-amber-200/60 dark:border-slate-600 flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h2 className="font-heading text-lg font-semibold text-charcoal dark:text-white">مناسبت‌های نزدیک</h2>
          </div>
          <div className="p-6 space-y-2">
            {customer.birthDate && (() => {
              const [_, m, d] = customer.birthDate.split('-').map(Number)
              const now = new Date()
              let next = new Date(now.getFullYear(), m - 1, d)
              if (next < now) next = new Date(now.getFullYear() + 1, m - 1, d)
              const days = Math.ceil((next.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
              return <p className="text-sm text-slate-600 dark:text-slate-400 font-stat">{days <= 30 ? `${days} روز تا تولد` : `تولد: ${formatDate(customer.birthDate)}`}</p>
            })()}
            {customer.anniversary_date && (() => {
              const [_, m, d] = customer.anniversary_date.split('-').map(Number)
              const now = new Date()
              let next = new Date(now.getFullYear(), m - 1, d)
              if (next < now) next = new Date(now.getFullYear() + 1, m - 1, d)
              const days = Math.ceil((next.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
              return <p className="text-sm text-slate-600 dark:text-slate-400 font-stat">{days <= 30 ? `${days} روز تا سالگرد` : `سالگرد: ${formatDate(customer.anniversary_date)}`}</p>
            })()}
          </div>
        </div>
      )}

      <div className="card-luxury rounded-2xl border border-amber-200/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-amber-200/60 dark:border-slate-600 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h2 className="font-heading text-lg font-semibold text-charcoal dark:text-white">تاریخچه خرید</h2>
          {purchases && (
            <span className="text-sm text-slate-500 dark:text-slate-400 font-stat mr-auto">
              مجموع: {purchases.totalSpent.toLocaleString('fa-IR')} افغانی
            </span>
          )}
        </div>
        <div className="p-6 overflow-x-auto">
          {!purchases ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">در حال بارگذاری...</p>
          ) : purchases.purchases.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">خریدی ثبت نشده است</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-amber-200/60 dark:border-slate-600">
                  <th className="text-right py-2 px-2 font-medium text-slate-600 dark:text-slate-400">تاریخ</th>
                  <th className="text-right py-2 px-2 font-medium text-slate-600 dark:text-slate-400">شماره بل</th>
                  <th className="text-right py-2 px-2 font-medium text-slate-600 dark:text-slate-400">مبلغ</th>
                  <th className="text-right py-2 px-2 font-medium text-slate-600 dark:text-slate-400">تعداد اقلام</th>
                  <th className="text-right py-2 px-2 font-medium text-slate-600 dark:text-slate-400">لینک</th>
                </tr>
              </thead>
              <tbody>
                {purchases.purchases.map((p) => (
                  <tr key={p.id} className="border-b border-amber-100 dark:border-slate-700/50">
                    <td className="py-2 px-2 font-stat">{formatDate(p.createdAt)}</td>
                    <td className="py-2 px-2 font-stat">{p.bellNumber.toLocaleString('fa-IR')}</td>
                    <td className="py-2 px-2 font-stat">{p.totalAmount.toLocaleString('fa-IR')}</td>
                    <td className="py-2 px-2 font-stat">{p.productCount.toLocaleString('fa-IR')}</td>
                    <td className="py-2 px-2">
                      <Link href={`/sales/${p.id}`} className="text-amber-600 dark:text-amber-400 hover:underline text-xs">
                        مشاهده فاکتور
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
