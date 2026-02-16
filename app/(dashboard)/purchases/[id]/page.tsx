'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-toastify'
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

  const formatDate = (d: string) => {
    if (!d) return '—'
    try {
      return new Date(d).toLocaleDateString('fa-IR')
    } catch {
      return d
    }
  }

  if (loading) return <div className="p-4">در حال بارگذاری...</div>
  if (!purchase) return <div className="p-4">خرید یافت نشد</div>

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => router.back()} className="btn-luxury btn-luxury-outline py-2 px-4">
            بازگشت
          </button>
          <h1 className="font-heading text-2xl font-semibold text-charcoal">
            خرید #{purchase.id} — بل {purchase.bellNumber}
          </h1>
        </div>
        {!editing ? (
          <button type="button" onClick={() => setEditing(true)} className="btn-luxury btn-luxury-primary py-2 px-4">
            ویرایش
          </button>
        ) : (
          <button type="button" onClick={() => setEditing(false)} className="btn-luxury btn-luxury-outline py-2 px-4">
            انصراف
          </button>
        )}
      </header>

      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="card-luxury p-6 space-y-4">
            <h2 className="font-heading text-lg font-semibold text-charcoal">اطلاعات خرید</h2>
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
            <p className="text-sm text-charcoal-soft">مبلغ کل اقلام: {totalAmount.toLocaleString('fa-IR')} {form.currency}</p>
          </section>

          <section className="card-luxury p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-charcoal">اقلام خرید</h2>
              <button type="button" onClick={addItem} className="btn-luxury btn-luxury-outline py-2 px-4 text-sm">
                افزودن ردیف
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold-200">
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
                    <tr key={idx} className="border-b border-gold-100">
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
          </section>

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
        <div className="space-y-6">
          <section className="card-luxury p-6">
            <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">اطلاعات خرید</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><dt className="text-charcoal-soft text-sm">تمویل‌کننده</dt><dd className="font-medium">{purchase.supplierName}</dd></div>
              <div><dt className="text-charcoal-soft text-sm">شماره بل</dt><dd className="font-medium">{purchase.bellNumber}</dd></div>
              <div><dt className="text-charcoal-soft text-sm">مبلغ کل</dt><dd className="font-medium">{(purchase.totalAmount ?? 0).toLocaleString('fa-IR')} {purchase.currency}</dd></div>
              <div><dt className="text-charcoal-soft text-sm">پرداختی</dt><dd className="font-medium">{purchase.paidAmount.toLocaleString('fa-IR')} {purchase.currency}</dd></div>
              <div><dt className="text-charcoal-soft text-sm">تاریخ</dt><dd className="font-medium">{formatDate(purchase.date)}</dd></div>
            </dl>
          </section>

          <section className="card-luxury p-6">
            <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">اقلام خرید</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold-200">
                    <th className="text-right py-2 px-2">نام</th>
                    <th className="text-right py-2 px-2">نوع</th>
                    <th className="text-right py-2 px-2">گرم</th>
                    <th className="text-right py-2 px-2">عیار</th>
                    <th className="text-right py-2 px-2">تعداد</th>
                    <th className="text-right py-2 px-2">باقی‌مانده</th>
                    <th className="text-right py-2 px-2">قیمت</th>
                  </tr>
                </thead>
                <tbody>
                  {(purchase.items || []).map((it, idx) => (
                    <tr key={idx} className="border-b border-gold-100">
                      <td className="py-2 px-2">{it.name}</td>
                      <td className="py-2 px-2">{it.type}</td>
                      <td className="py-2 px-2">{it.gram}</td>
                      <td className="py-2 px-2">{it.karat}</td>
                      <td className="py-2 px-2">{it.quantity}</td>
                      <td className="py-2 px-2">{it.remainingQty ?? it.quantity}</td>
                      <td className="py-2 px-2">{it.price.toLocaleString('fa-IR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
