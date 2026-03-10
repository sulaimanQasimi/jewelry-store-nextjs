'use client'

import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '@/lib/context/AppContext'
import { MapPin, Mail, Phone, Clock, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Loading from '@/components/Loading'

const GALAXY_SERVICES = [
  { label: 'توسعه پایگاه داده', en: 'Database Development' },
  { label: 'توسعه وب و میزبانی', en: 'Web Development & Hosting' },
  { label: 'توسعه اپلیکیشن موبایل', en: 'Mobile App Development' },
  { label: 'دوربین مداربسته و خدمات', en: 'CCTV Operation & Services' },
  { label: 'شبکه', en: 'Networking' },
  { label: 'دیجیتال مارکتینگ و برندینگ', en: 'Digital Marketing & Branding' },
]

export default function CompanyInformationPage() {
  const { companyData, getCompanyData } = useContext(AppContext)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    getCompanyData?.()
  }, [getCompanyData])

  if (!mounted) {
    return (
      <Loading />
    )
  }

  return (
    <div className="w-full py-8 px-4 sm:px-8 md:px-16" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">اطلاعات شرکت</h1>

        {/* Store company data from API (if any) */}
        {companyData && typeof companyData === 'object' && companyData.companyName ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-600 pb-2 mb-4">اطلاعات فروشگاه</h2>
            <p className="dark:text-slate-200"><span className="font-medium text-slate-600 dark:text-slate-400">نام شرکت:</span> {companyData.companyName}</p>
            <p className="dark:text-slate-200"><span className="font-medium text-slate-600 dark:text-slate-400">شعار:</span> {companyData.slogan || '-'}</p>
            <p className="dark:text-slate-200"><span className="font-medium text-slate-600 dark:text-slate-400">تلفن:</span> <span className="phone-ltr" dir="ltr">{companyData.phone}</span></p>
            <p className="dark:text-slate-200"><span className="font-medium text-slate-600 dark:text-slate-400">ایمیل:</span> {companyData.email || '-'}</p>
            <p className="dark:text-slate-200"><span className="font-medium text-slate-600 dark:text-slate-400">آدرس:</span> {companyData.address}</p>
          </div>
        ) : null}

        {/* Galaxy Technology Company */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 space-y-6">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-600 pb-2">
            شرکت گلکسی تکنولوژی
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            ارائه‌دهنده راه‌حل‌های نرم‌افزاری و فناوری اطلاعات برای کسب‌وکار شما. تیم متخصص ما آماده است تا بهترین خدمات فناوری را در اختیار شما قرار دهد.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm">
              <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>مزار شریف، بازار مظفر</span>
            </p>
            <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm">
              <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <a href="mailto:info@galaxytechology.com" className="hover:underline">info@galaxytechology.com</a>
            </p>
            <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm">
              <Phone className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <a href="tel:+93797548234" className="phone-ltr" dir="ltr">+93 797 548 234</a>
            </p>
            <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>شنبه تا پنج‌شنبه ۰۸:۰۰ – ۱۷:۰۰</span>
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-2">خدمات:</p>
            <ul className="flex flex-wrap gap-2">
              {GALAXY_SERVICES.map(({ label }) => (
                <li key={label} className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs">
                  {label}
                </li>
              ))}
            </ul>
          </div>
          <p className="pt-2">
            <Link
              href="https://www.galaxytechology.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium text-sm hover:underline"
            >
              <span>galaxytechology.com</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
