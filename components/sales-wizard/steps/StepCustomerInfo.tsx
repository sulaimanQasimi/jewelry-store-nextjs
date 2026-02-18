'use client'

import React, { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import axios from 'axios'
import { motion } from 'framer-motion'
import { User, Search, Loader2, UserPlus } from 'lucide-react'
import type { CustomerOption } from '../types'

const customerSchema = z.object({
  customerId: z.number().min(1, 'لطفاً یک مشتری انتخاب کنید'),
  customerName: z.string().min(1, 'نام مشتری الزامی است'),
  phone: z.string().min(1, 'شماره تماس الزامی است')
})

type CustomerFormData = z.infer<typeof customerSchema>

interface StepCustomerInfoProps {
  initialCustomer: CustomerOption | null
  onNext: (customer: CustomerOption) => void
}

export default function StepCustomerInfo({ initialCustomer, onNext }: StepCustomerInfoProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<CustomerOption[]>([])
  const [searching, setSearching] = useState(false)

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      customerId: initialCustomer?.id ?? 0,
      customerName: initialCustomer?.customerName ?? '',
      phone: initialCustomer?.phone ?? ''
    }
  })

  const customerId = watch('customerId')
  const customerName = watch('customerName')
  const phone = watch('phone')
  const hasSelection = customerId > 0 && customerName && phone

  const doSearch = useCallback(async () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const { data } = await axios.get<{ success?: boolean; data?: CustomerOption[] }>(
        '/api/customer/registered-customers',
        { params: { search: searchQuery.trim(), limit: 20 } }
      )
      setResults(Array.isArray(data?.data) ? data.data : [])
    } catch {
      setResults([])
    } finally {
      setSearching(false)
    }
  }, [searchQuery])

  const selectCustomer = (c: CustomerOption) => {
    setValue('customerId', c.id)
    setValue('customerName', c.customerName)
    setValue('phone', c.phone)
    setResults([])
    setSearchQuery('')
  }

  const clearSelection = () => {
    setValue('customerId', 0)
    setValue('customerName', '')
    setValue('phone', '')
  }

  const onSubmit = (data: CustomerFormData) => {
    onNext({ id: data.customerId, customerName: data.customerName, phone: data.phone })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <p className="text-charcoal-soft dark:text-slate-400 text-sm">
        مشتری را جستجو کنید یا از لیست انتخاب کنید.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {!hasSelection ? (
          <div className="space-y-4">
            <label htmlFor="customer-search" className="block text-sm font-medium text-charcoal dark:text-slate-200">
              جستجوی مشتری
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden />
                <input
                  id="customer-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), doSearch())}
                  placeholder="نام یا شماره تماس"
                  className="input-luxury w-full pl-4 pr-10"
                  aria-describedby={errors.customerId ? 'customer-error' : undefined}
                  aria-invalid={!!errors.customerId}
                  autoComplete="off"
                />
              </div>
              <button
                type="button"
                onClick={doSearch}
                disabled={searching}
                className="btn-luxury btn-luxury-primary px-4 py-2.5 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
                aria-label="جستجوی مشتری"
              >
                {searching ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden /> : 'جستجو'}
              </button>
            </div>
            {errors.customerId && (
              <p id="customer-error" className="text-sm text-red-500 dark:text-red-400" role="alert">
                {errors.customerId.message}
              </p>
            )}

            {results.length > 0 && (
              <ul
                className="rounded-xl border border-slate-200 dark:border-slate-600 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700 max-h-60 overflow-y-auto"
                aria-label="نتایج جستجوی مشتری"
              >
                {results.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => selectCustomer(c)}
                      className="w-full text-right py-3 px-4 hover:bg-gold-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-inset"
                      aria-label={`انتخاب ${c.customerName}`}
                    >
                      <User className="w-5 h-5 text-gold-500 shrink-0" />
                      <div>
                        <p className="font-medium text-charcoal dark:text-white">{c.customerName}</p>
                        <p className="text-sm text-charcoal-soft dark:text-slate-400" dir="ltr">
                          {c.phone}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <Link
              href="/customer-registration"
              className="inline-flex items-center gap-2 text-sm text-gold-600 dark:text-gold-400 hover:underline"
            >
              <UserPlus className="w-4 h-4" />
              ثبت مشتری جدید
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-gold-200 dark:border-gold-800 bg-gold-50/50 dark:bg-slate-800/50 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="rounded-full bg-gold-500/20 p-3">
                  <User className="w-6 h-6 text-gold-600 dark:text-gold-400" />
                </div>
                <div>
                  <p className="font-semibold text-charcoal dark:text-white">{customerName}</p>
                  <p className="text-charcoal-soft dark:text-slate-400 mt-0.5" dir="ltr">
                    {phone}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={clearSelection}
                className="text-sm text-slate-500 hover:text-charcoal dark:hover:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 rounded px-1"
                aria-label="تغییر مشتری انتخاب شده"
              >
                تغییر
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <motion.button
            type="submit"
            disabled={!hasSelection}
            whileTap={hasSelection ? { scale: 0.98 } : undefined}
            className="btn-luxury btn-luxury-primary px-6 py-2.5 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
            aria-label="ادامه به مرحله پرداخت"
          >
            ادامه به پرداخت
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}
