'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Package } from 'lucide-react'
import PurchaseWizard from '@/components/purchase-wizard/PurchaseWizard'

export default function NewPurchasePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/purchases"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
              aria-label="بازگشت به لیست خریدها"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-slate-800 dark:bg-slate-700">
                <Package className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold text-slate-800 dark:text-white">
                  ثبت خرید جدید
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  مراحل را طی کنید تا خرید به موجودی اضافه شود
                </p>
              </div>
            </div>
          </div>
        </header>

        <PurchaseWizard />
      </div>
    </div>
  )
}
