'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { ArrowRight, Edit, Building2, Calendar, FileText, Package, Sparkles, Gem } from 'lucide-react'
import FormField from '@/components/ui/FormField'

interface PurchaseItem {
  id?: number
  productMasterId: number
  name: string
  type: string
  gram: number
  karat: number
  quantity: number
  remainingQty: number
  price: number
}

interface Purchase {
  id: number
  supplierId: number
  supplierName: string
  totalAmount: number | null
  bellNumber: number
  currency: string
  paidAmount: number
  date: string
  items: PurchaseItem[]
}

interface Supplier {
  id: number
  name: string
}

interface ProductMaster {
  id: number
  name: string
  type: string
  gram: number
  karat: number
}

const formatDate = (d: string) => {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return d
  }
}

const formatMoney = (n: number) => Number(n).toLocaleString('fa-IR', { useGrouping: true })

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

export default function PurchaseDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [purchase, setPurchase] = useState<Purchase | null>(null)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [productMasters, setProductMasters] = useState<ProductMaster[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    supplierId: '',
    supplierName: '',
    bellNumber: '',
    currency: 'AFN',
    paidAmount: '',
    date: '',
    items: [] as { productMasterId: string; name: string; type: string; gram: string; karat: string; quantity: string; price: string }[]
  })

  useEffect(() => {
    if (!id) return
    axios.get<{ success?: boolean; data?: Purchase }>(`/api/purchase/${id}`)
      .then(({ data: res }) => {
        if (res?.success && res.data) {
          const p = res.data
          const itemList = (p.items || []).map((it) => ({
            productMasterId: String(it.productMasterId),
            name: it.name,
            type: it.type,
            gram: String(it.gram),
            karat: String(it.karat),
            quantity: String(it.quantity),
            price: String(it.price)
          }))
          setPurchase(p)
          setForm({
            supplierId: String(p.supplierId),
            supplierName: p.supplierName,
            bellNumber: String(p.bellNumber),
            currency: p.currency,
            paidAmount: String(p.paidAmount),
            date: p.date ? new Date(p.date).toISOString().slice(0, 10) : '',
            items: itemList.length ? itemList : [{ productMasterId: '', name: '', type: '', gram: '', karat: '', quantity: '1', price: '' }]
          })
        }
      })
      .catch(() => setPurchase(null))
      .finally(() => setLoading(false))

    axios.get<{ success?: boolean; data?: Supplier[] }>('/api/supplier/get-all', { params: { limit: 500 } })
      .then(({ data: res }) => setSuppliers(Array.isArray(res?.data) ? res.data : []))
      .catch(() => setSuppliers([]))
    axios.get<{ success?: boolean; data?: ProductMaster[] }>('/api/product-master/list', { params: { limit: 500 } })
      .then(({ data: res }) => setProductMasters(Array.isArray(res?.data) ? res.data : []))
      .catch(() => setProductMasters([]))
  }, [id])

  const addItem = () => setForm((f) => ({
    ...f,
    items: [...f.items, { productMasterId: '', name: '', type: '', gram: '', karat: '', quantity: '1', price: '' }]
  }))

  const removeItem = (idx: number) => {
    if (form.items.length <= 1) return
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }))
  }

  const updateItem = (idx: number, field: string, value: string) => {
    setForm((f) => {
      const next = [...f.items]
      next[idx] = { ...next[idx], [field]: value }
      if (field === 'productMasterId') {
        const pm = productMasters.find((p) => String(p.id) === value)
        if (pm) {
          next[idx].name = pm.name
          next[idx].type = pm.type
          next[idx].gram = String(pm.gram)
          next[idx].karat = String(pm.karat)
        }
      }
      return { ...f, items: next }
    })
  }

  const totalAmount = form.items.reduce((sum, it) => {
    const q = parseInt(it.quantity) || 0
    const p = parseFloat(it.price) || 0
    return sum + q * p
  }, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.supplierId || !form.supplierName.trim()) {
      toast.error('تمویل‌کننده الزامی است')
      return
    }
    if (!form.bellNumber.trim()) {
      toast.error('شماره بل الزامی است')
      return
    }
    const paid = parseFloat(form.paidAmount)
    if (isNaN(paid) || paid < 0) {
      toast.error('مبلغ پرداختی نامعتبر است')
      return
    }

    setSubmitting(true)
    try {
      const { data } = await axios.put(`/api/purchase/update/${id}`, {
        supplierId: parseInt(form.supplierId),
        supplierName: form.supplierName.trim(),
        totalAmount,
        bellNumber: parseInt(form.bellNumber),
        currency: form.currency.trim(),
        paidAmount: paid,
        date: form.date || new Date().toISOString().slice(0, 10),
        items: form.items
          .filter((it) => (it.name?.trim() || it.productMasterId) && (parseInt(it.quantity) || 0) > 0)
          .map((it) => ({
            productMasterId: it.productMasterId ? parseInt(it.productMasterId) : 0,
            name: it.name?.trim() || '',
            type: it.type?.trim() || '',
            gram: parseFloat(it.gram) || 0,
            karat: parseFloat(it.karat) || 0,
            quantity: parseInt(it.quantity) || 1,
            price: parseFloat(it.price) || 0
          }))
      })
      if (data.success) {
        toast.success(data.message ?? 'به‌روزرسانی شد')
        setEditing(false)
        const { data: res } = await axios.get<{ success?: boolean; data?: Purchase }>(`/api/purchase/${id}`)
        if (res?.success && res.data) setPurchase(res.data)
      } else {
        toast.error(data.message ?? 'خطا')
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null
      toast.error(msg ?? (err instanceof Error ? err.message : 'خطا'))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f1e3]" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(112, 111, 211, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(212, 175, 55, 0.05) 0%, transparent 50%)' }}>
        <div className="animate-pulse text-[#706fd3] font-medium">در حال بارگذاری...</div>
      </div>
    )
  }

  if (!purchase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f1e3]">
        <div className="text-center">
          <p className="text-slate-600 mb-4">خرید یافت نشد</p>
          <Link href="/purchases" className="inline-flex items-center gap-2 text-[#706fd3] hover:text-[#5a59b8] font-medium">
            <ArrowRight className="w-4 h-4" />
            بازگشت به لیست
          </Link>
        </div>
      </div>
    )
  }

  const balanceDue = (purchase.totalAmount ?? 0) - purchase.paidAmount
  const isPaid = balanceDue <= 0

  return (
    <div
      className="min-h-screen bg-[#f7f1e3] relative"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(112, 111, 211, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(212, 175, 55, 0.06) 0%, transparent 50%),
          url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23706fd3' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
        `
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header with back button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between flex-wrap gap-4"
        >
          <Link
            href="/purchases"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-[#706fd3] transition-colors font-medium"
          >
            <ArrowRight className="w-5 h-5" />
            بازگشت
          </Link>
          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/80 backdrop-blur-md border border-[#D4AF37]/30 text-slate-700 hover:bg-white hover:border-[#D4AF37]/50 transition-all shadow-sm hover:shadow-md"
            >
              <Edit className="w-4 h-4" />
              ویرایش
            </button>
          )}
        </motion.div>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Edit form - keep existing edit form but with updated styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#D4AF37]/20 shadow-lg p-6 sm:p-8"
            >
              <h2 className="font-luxury-serif text-xl font-semibold text-slate-800 mb-6">ویرایش خرید</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField label="تمویل‌کننده">
                  <select
                    className="input-luxury w-full"
                    value={form.supplierId}
                    onChange={(e) => {
                      const v = e.target.value
                      const s = suppliers.find((x) => String(x.id) === v)
                      setForm((f) => ({ ...f, supplierId: v, supplierName: s ? s.name : '' }))
                    }}
                    required
                  >
                    <option value="">انتخاب کنید</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={String(s.id)}>{s.name}</option>
                    ))}
                  </select>
                </FormField>
                <FormField label="نام تمویل‌کننده">
                  <input
                    className="input-luxury w-full"
                    value={form.supplierName}
                    onChange={(e) => setForm((f) => ({ ...f, supplierName: e.target.value }))}
                    required
                  />
                </FormField>
                <FormField label="شماره بل">
                  <input
                    type="number"
                    className="input-luxury w-full"
                    value={form.bellNumber}
                    onChange={(e) => setForm((f) => ({ ...f, bellNumber: e.target.value }))}
                    required
                  />
                </FormField>
                <FormField label="واحد پول">
                  <select
                    className="input-luxury w-full"
                    value={form.currency}
                    onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                  >
                    <option value="AFN">افغانی</option>
                    <option value="USD">دلار</option>
                  </select>
                </FormField>
                <FormField label="مبلغ پرداختی">
                  <input
                    type="number"
                    step="0.01"
                    className="input-luxury w-full"
                    value={form.paidAmount}
                    onChange={(e) => setForm((f) => ({ ...f, paidAmount: e.target.value }))}
                    required
                  />
                </FormField>
                <FormField label="تاریخ">
                  <input
                    type="date"
                    className="input-luxury w-full"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  />
                </FormField>
              </div>
              <p className="text-sm text-slate-500 mt-4">مبلغ کل اقلام: {totalAmount.toLocaleString('fa-IR')} {form.currency}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#D4AF37]/20 shadow-lg p-6 sm:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-luxury-serif text-xl font-semibold text-slate-800">اقلام خرید</h2>
                <button type="button" onClick={addItem} className="btn-luxury btn-luxury-outline py-2 px-4 text-sm">
                  افزودن ردیف
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#D4AF37]/30">
                      <th className="text-right py-2 px-2">محصول</th>
                      <th className="text-right py-2 px-2">نام</th>
                      <th className="text-right py-2 px-2">نوع</th>
                      <th className="text-right py-2 px-2">گرم</th>
                      <th className="text-right py-2 px-2">عیار</th>
                      <th className="text-right py-2 px-2">تعداد</th>
                      <th className="text-right py-2 px-2">قیمت</th>
                      <th className="text-right py-2 px-2 w-16"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.items.map((it, idx) => (
                      <tr key={idx} className="border-b border-slate-100">
                        <td className="py-2 px-2">
                          <select
                            className="input-luxury w-full min-w-[120px]"
                            value={it.productMasterId}
                            onChange={(e) => updateItem(idx, 'productMasterId', e.target.value)}
                          >
                            <option value="">دستی</option>
                            {productMasters.map((p) => (
                              <option key={p.id} value={String(p.id)}>{p.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2 px-2">
                          <input
                            className="input-luxury w-full min-w-[100px]"
                            value={it.name}
                            onChange={(e) => updateItem(idx, 'name', e.target.value)}
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            className="input-luxury w-full min-w-[80px]"
                            value={it.type}
                            onChange={(e) => updateItem(idx, 'type', e.target.value)}
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="number"
                            step="0.01"
                            className="input-luxury w-full min-w-[70px]"
                            value={it.gram}
                            onChange={(e) => updateItem(idx, 'gram', e.target.value)}
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="number"
                            step="0.01"
                            className="input-luxury w-full min-w-[70px]"
                            value={it.karat}
                            onChange={(e) => updateItem(idx, 'karat', e.target.value)}
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="number"
                            min="1"
                            className="input-luxury w-full min-w-[60px]"
                            value={it.quantity}
                            onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="number"
                            step="0.01"
                            className="input-luxury w-full min-w-[80px]"
                            value={it.price}
                            onChange={(e) => updateItem(idx, 'price', e.target.value)}
                          />
                        </td>
                        <td className="py-2 px-2">
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            disabled={form.items.length <= 1}
                            className="text-red-600 hover:underline disabled:opacity-40"
                          >
                            حذف
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setEditing(false)} className="btn-luxury btn-luxury-outline px-6 py-2">
                انصراف
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-luxury btn-luxury-primary px-6 py-2 disabled:opacity-60"
              >
                {submitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
              </button>
            </div>
          </form>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Hero Card - Neumorphism with Bill Number & Status */}
            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <div
                className="bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-10 shadow-[20px_20px_60px_rgba(0,0,0,0.08),_-20px_-20px_60px_rgba(255,255,255,0.8)] border border-white/50"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(247,241,227,0.9) 100%)'
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#706fd3]/10 to-[#706fd3]/5 border border-[#706fd3]/20">
                        <FileText className="w-6 h-6 text-[#706fd3]" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1 font-luxury-sans">شماره بل</p>
                        <h1 className="font-luxury-serif text-3xl sm:text-4xl font-bold text-slate-800 tabular-nums">
                          #{purchase.bellNumber}
                        </h1>
                      </div>
                    </div>
                        <p className="text-slate-500 text-sm font-luxury-sans">خرید #{purchase.id}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                      className="relative"
                    >
                      <div className={`px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 ${isPaid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                        {isPaid && (
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                            className="relative"
                          >
                            <Gem className="w-5 h-5 text-[#706fd3]" />
                            <motion.div
                              className="absolute inset-0 rounded-full"
                              animate={{
                                boxShadow: [
                                  '0 0 0 0 rgba(112, 111, 211, 0.6)',
                                  '0 0 0 10px rgba(112, 111, 211, 0)',
                                  '0 0 0 0 rgba(112, 111, 211, 0)'
                                ]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                            <motion.div
                              className="absolute inset-0"
                              animate={{
                                opacity: [0.3, 0.8, 0.3]
                              }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                            </motion.div>
                          </motion.div>
                        )}
                        <span className="font-luxury-sans">{isPaid ? 'پرداخت شده' : 'در انتظار پرداخت'}</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Supplier & Payment Info - Glassmorphism Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div
                variants={itemVariants}
                className="lg:col-span-2 space-y-6"
              >
                {/* Supplier Card */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white/70 backdrop-blur-md rounded-2xl border border-[#D4AF37]/20 shadow-lg p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/10 border border-[#D4AF37]/30">
                      <Building2 className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-luxury-serif text-lg font-semibold text-slate-800 mb-3">تمویل‌کننده</h3>
                      <p className="text-xl font-medium text-slate-700 mb-2 font-luxury-sans">{purchase.supplierName}</p>
                      <p className="text-sm text-slate-500 font-luxury-sans">شناسه: #{purchase.supplierId}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Payment Summary */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white/70 backdrop-blur-md rounded-2xl border border-[#706fd3]/20 shadow-lg p-6"
                >
                  <h3 className="font-luxury-serif text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#706fd3]" />
                    خلاصه پرداخت
                  </h3>
                  <dl className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <dt className="text-slate-600 font-luxury-sans">مبلغ کل</dt>
                      <dd className="font-semibold text-slate-800 tabular-nums font-luxury-sans" dir="ltr">
                        {formatMoney(purchase.totalAmount ?? 0)} {purchase.currency}
                      </dd>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <dt className="text-slate-600 font-luxury-sans">پرداختی</dt>
                      <dd className="font-semibold text-emerald-700 tabular-nums font-luxury-sans" dir="ltr">
                        {formatMoney(purchase.paidAmount)} {purchase.currency}
                      </dd>
                    </div>
                    {balanceDue > 0 && (
                      <div className="flex justify-between items-center py-2">
                        <dt className="text-slate-600 font-luxury-sans">باقیمانده</dt>
                        <dd className="font-semibold text-amber-700 tabular-nums font-luxury-sans" dir="ltr">
                          {formatMoney(balanceDue)} {purchase.currency}
                        </dd>
                      </div>
                    )}
                  </dl>
                </motion.div>
              </motion.div>

              {/* Date Card */}
              <motion.div
                variants={itemVariants}
                className="bg-white/70 backdrop-blur-md rounded-2xl border border-[#706fd3]/20 shadow-lg p-6"
              >
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#706fd3]/20 to-[#706fd3]/10 border border-[#706fd3]/30">
                    <Calendar className="w-6 h-6 text-[#706fd3]" />
                  </div>
                  <div>
                    <h3 className="font-luxury-serif text-sm font-semibold text-slate-600 mb-2">تاریخ خرید</h3>
                    <p className="text-lg font-medium text-slate-800 font-luxury-sans">{formatDate(purchase.date)}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Items Table */}
            <motion.div variants={itemVariants}>
              <h2 className="font-luxury-serif text-2xl font-semibold text-slate-800 mb-6 flex items-center gap-3">
                <Package className="w-6 h-6 text-[#706fd3]" />
                اقلام خرید ({purchase.items?.length ?? 0})
              </h2>
              <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#D4AF37]/20 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-luxury-sans">
                    <thead>
                      <tr className="bg-gradient-to-r from-[#706fd3]/10 to-[#706fd3]/5 border-b border-[#706fd3]/20">
                        <th className="text-right py-4 px-4 font-luxury-serif font-semibold text-slate-800">نام</th>
                        <th className="text-right py-4 px-4 font-luxury-serif font-semibold text-slate-800">نوع</th>
                        <th className="text-right py-4 px-4 font-luxury-serif font-semibold text-slate-800">وزن (گرم)</th>
                        <th className="text-right py-4 px-4 font-luxury-serif font-semibold text-slate-800">عیار</th>
                        <th className="text-right py-4 px-4 font-luxury-serif font-semibold text-slate-800">تعداد</th>
                        <th className="text-right py-4 px-4 font-luxury-serif font-semibold text-slate-800">باقی‌مانده</th>
                        <th className="text-right py-4 px-4 font-luxury-serif font-semibold text-slate-800">قیمت</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(purchase.items || []).map((item, idx) => (
                        <motion.tr
                          key={idx}
                          variants={itemVariants}
                          className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="py-4 px-4 font-medium text-slate-800">{item.name || '—'}</td>
                          <td className="py-4 px-4 text-slate-600">{item.type || '—'}</td>
                          <td className="py-4 px-4 text-slate-700 tabular-nums" dir="ltr">{item.gram}</td>
                          <td className="py-4 px-4 text-slate-700 tabular-nums" dir="ltr">{item.karat || '—'}</td>
                          <td className="py-4 px-4 text-slate-700">{item.quantity}</td>
                          <td className="py-4 px-4">
                            {item.remainingQty !== item.quantity ? (
                              <span className="text-amber-700 font-medium">{item.remainingQty}</span>
                            ) : (
                              <span className="text-slate-500">{item.remainingQty ?? item.quantity}</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-luxury-serif font-bold text-[#D4AF37] tabular-nums" dir="ltr">
                              {formatMoney(item.price)}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
