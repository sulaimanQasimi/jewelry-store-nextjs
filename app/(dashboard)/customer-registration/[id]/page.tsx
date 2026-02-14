'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { FacebookIcon, InstagramIcon, WhatsAppIcon, TelegramIcon } from '@/components/icons/SocialIcons'

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
      <Link href="/customer-registration" className="inline-flex items-center gap-1 text-gold-600 hover:underline text-sm">
        بازگشت به لیست مشتریان
      </Link>

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
                <dd className="font-medium text-charcoal">{customer.phone}</dd>
              </div>
              {customer.secondaryPhone && (
                <div>
                  <dt className="text-charcoal-soft">شماره ثانوی</dt>
                  <dd className="font-medium text-charcoal">{customer.secondaryPhone}</dd>
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
    </div>
  )
}
