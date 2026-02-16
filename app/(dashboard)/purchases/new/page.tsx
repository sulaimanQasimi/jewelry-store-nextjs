'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-toastify'
import FormField from '@/components/ui/FormField'

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

interface PurchaseItem {
  productMasterId: string
  name: string
  type: string
  gram: string
  karat: string
  quantity: string
  price: string
}

const emptyItem: PurchaseItem = {
  productMasterId: '',
  name: '',
  type: '',
  gram: '',
  karat: '',
  quantity: '1',
  price: ''
}

export default function NewPurchasePage() {
  const router = useRouter()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [productMasters, setProductMasters] = useState<ProductMaster[]>([])
  const [supplierId, setSupplierId] = useState('')
  const [supplierName, setSupplierName] = useState('')
  const [bellNumber, setBellNumber] = useState('')
  const [currency, setCurrency] = useState('AFN')
  const [paidAmount, setPaidAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [items, setItems] = useState<PurchaseItem[]>([{ ...emptyItem }])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    axios.get<{ success?: boolean; data?: Supplier[] }>('/api/supplier/get-all', { params: { limit: 500 } })
      .then(({ data: res }) => setSuppliers(Array.isArray(res?.data) ? res.data : []))
      .catch(() => setSuppliers([]))
    axios.get<{ success?: boolean; data?: ProductMaster[] }>('/api/product-master/list', { params: { limit: 500 } })
      .then(({ data: res }) => setProductMasters(Array.isArray(res?.data) ? res.data : []))
      .catch(() => setProductMasters([]))
  }, [])

  const addItem = () => setItems((prev) => [...prev, { ...emptyItem }])
  const removeItem = (idx: number) => {
    if (items.length <= 1) return
    setItems((prev) => prev.filter((_, i) => i !== idx))
  }

  const updateItem = (idx: number, field: keyof PurchaseItem, value: string) => {
    setItems((prev) => {
      const next = [...prev]
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
      return next
    })
  }

  const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value
    setSupplierId(id)
    const s = suppliers.find((x) => String(x.id) === id)
    setSupplierName(s ? s.name : '')
  }

  const totalAmount = items.reduce((sum, it) => {
    const q = parseInt(it.quantity) || 0
    const p = parseFloat(it.price) || 0
    return sum + q * p
  }, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supplierId || !supplierName.trim()) {
      toast.error('تمویل‌کننده الزامی است')
      return
    }
    if (!bellNumber.trim()) {
      toast.error('شماره بل الزامی است')
      return
    }
    if (!currency.trim()) {
      toast.error('واحد پول الزامی است')
      return
    }
    const paid = parseFloat(paidAmount)
    if (isNaN(paid) || paid < 0) {
      toast.error('مبلغ پرداختی نامعتبر است')
      return
    }

    setSubmitting(true)
    try {
      const { data } = await axios.post('/api/purchase/create', {
        supplierId: parseInt(supplierId),
        supplierName: supplierName.trim(),
        totalAmount,
        bellNumber: parseInt(bellNumber),
        currency: currency.trim(),
        paidAmount: paid,
        date,
        items: items
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
        toast.success(data.message ?? 'خرید ثبت شد')
        router.push(`/purchases/${data.data?.id ?? ''}`)
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

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-luxury btn-luxury-outline py-2 px-4"
        >
          بازگشت
        </button>
        <h1 className="font-heading text-2xl font-semibold text-charcoal">افزودن خرید</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="card-luxury p-6 space-y-4">
          <h2 className="font-heading text-lg font-semibold text-charcoal">اطلاعات خرید</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField label="تمویل‌کننده">
              <select
                className="input-luxury w-full"
                value={supplierId}
                onChange={handleSupplierChange}
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
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="نام"
                required
              />
            </FormField>
            <FormField label="شماره بل">
              <input
                type="number"
                className="input-luxury w-full"
                value={bellNumber}
                onChange={(e) => setBellNumber(e.target.value)}
                placeholder="شماره بل"
                required
              />
            </FormField>
            <FormField label="واحد پول">
              <select
                className="input-luxury w-full"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
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
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                placeholder="0"
                required
              />
            </FormField>
            <FormField label="تاریخ">
              <input
                type="date"
                className="input-luxury w-full"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </FormField>
          </div>
          <p className="text-sm text-charcoal-soft">مبلغ کل اقلام: {totalAmount.toLocaleString('fa-IR')} {currency}</p>
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
                {items.map((it, idx) => (
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
                        placeholder="نام"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        className="input-luxury w-full min-w-[80px]"
                        value={it.type}
                        onChange={(e) => updateItem(idx, 'type', e.target.value)}
                        placeholder="نوع"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        step="0.01"
                        className="input-luxury w-full min-w-[70px]"
                        value={it.gram}
                        onChange={(e) => updateItem(idx, 'gram', e.target.value)}
                        placeholder="0"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        step="0.01"
                        className="input-luxury w-full min-w-[70px]"
                        value={it.karat}
                        onChange={(e) => updateItem(idx, 'karat', e.target.value)}
                        placeholder="0"
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
                        placeholder="قیمت"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        disabled={items.length <= 1}
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
          <button type="button" onClick={() => router.back()} className="btn-luxury btn-luxury-outline px-6 py-2">
            لغو
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn-luxury btn-luxury-primary px-6 py-2 disabled:opacity-60"
          >
            {submitting ? 'در حال ذخیره...' : 'ذخیره خرید'}
          </button>
        </div>
      </form>
    </div>
  )
}
