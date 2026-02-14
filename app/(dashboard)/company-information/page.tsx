'use client'

import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '@/lib/context/AppContext'

export default function CompanyInformationPage() {
  const { companyData, getCompanyData } = useContext(AppContext)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    getCompanyData?.()
  }, [getCompanyData])

  if (!mounted) {
    return (
      <div className="w-full py-8 px-16 flex items-center justify-center min-h-[50vh]">
        <p className="text-slate-500">در حال بارگذاری...</p>
      </div>
    )
  }

  return (
    <div className="w-full py-8 px-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">اطلاعات شرکت</h1>
        {companyData && typeof companyData === 'object' && companyData.companyName ? (
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <p><span className="font-medium text-slate-600">نام شرکت:</span> {companyData.companyName}</p>
            <p><span className="font-medium text-slate-600">شعار:</span> {companyData.slogan || '-'}</p>
            <p><span className="font-medium text-slate-600">تلفن:</span> {companyData.phone}</p>
            <p><span className="font-medium text-slate-600">ایمیل:</span> {companyData.email || '-'}</p>
            <p><span className="font-medium text-slate-600">آدرس:</span> {companyData.address}</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-slate-600">خوش آمدید به پنل مدیریت. از منوی کنار برای دسترسی به بخش‌ها استفاده کنید.</p>
            <p className="text-slate-500 text-sm mt-2">برای ثبت اطلاعات شرکت، به زودی فرم ویرایش در این صفحه قرار می‌گیرد.</p>
          </div>
        )}
      </div>
    </div>
  )
}
