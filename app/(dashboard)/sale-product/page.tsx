'use client'

import React from 'react'
import { ShoppingCart } from 'lucide-react'
import SalesWizard from '@/components/sales-wizard/SalesWizard'

export default function SaleProductPage() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <header>
        <h1 className="font-heading text-2xl font-bold text-charcoal dark:text-white flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-gold-500" />
          فروش جنس
        </h1>
        <p className="text-sm text-charcoal-soft dark:text-slate-400 mt-1">
          مراحل را طی کنید: انتخاب محصول، مشخصات مشتری، پرداخت و تکمیل.
        </p>
      </header>

      <div className="card-luxury p-6 sm:p-8 rounded-2xl border border-gold-200/50 dark:border-slate-600/50 shadow-sm">
        <SalesWizard />
      </div>
    </div>
  )
}
