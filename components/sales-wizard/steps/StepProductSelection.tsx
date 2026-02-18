'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Search, ShoppingBag, Loader2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import type { CartItem } from '@/context/CartContext'

export interface ProductRecord {
  id: number
  productName: string
  type: string
  gram: number
  karat: number
  barcode: string
  purchasePriceToAfn: number
  isSold: boolean
  image?: string | null
}

interface StepProductSelectionProps {
  onNext: () => void
}

function normalizeProduct(row: Record<string, unknown>): ProductRecord {
  return {
    id: Number(row.id),
    productName: String(row.productName ?? row.productname ?? ''),
    type: String(row.type ?? ''),
    gram: Number(row.gram ?? 0),
    karat: Number(row.karat ?? 0),
    barcode: String(row.barcode ?? ''),
    purchasePriceToAfn: Number(row.purchasePriceToAfn ?? row.purchasepricetoafn ?? 0),
    isSold: Boolean(row.isSold ?? row.issold),
    image: row.image != null ? String(row.image) : null
  }
}

export default function StepProductSelection({ onNext }: StepProductSelectionProps) {
  const cart = useCart()
  const cartItems = cart?.cart ?? []
  const addToCart = cart?.addToCart ?? (() => {})
  const getTotalItems = cart?.getTotalItems ?? (() => 0)

  const [products, setProducts] = useState<ProductRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<ProductRecord | null>(null)
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    if (!selectedProduct) return
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProduct(null)
    }
    document.addEventListener('keydown', onEscape)
    return () => document.removeEventListener('keydown', onEscape)
  }, [selectedProduct])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await axios.get<{ success?: boolean; data?: Record<string, unknown>[] }>(
        '/api/product/list',
        {
          params: {
            limit: 100,
            isSold: 'false',
            search: search.trim() || undefined,
            page: 1
          }
        }
      )
      const list = Array.isArray(data?.data) ? data.data : []
      setProducts(list.map(normalizeProduct))
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    const t = setTimeout(fetchProducts, 300)
    return () => clearTimeout(t)
  }, [fetchProducts])

  const isInCart = (id: number) => cartItems.some((item) => (item.id ?? item._id) === id)

  const openPriceModal = (product: ProductRecord) => {
    if (product.isSold) return
    setSelectedProduct(product)
    setPrice('')
    setCurrency('')
  }

  const convertToEnglish = (str: string) => {
    const map: Record<string, string> = {
      '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
      '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
      '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
      '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
    }
    return str.replace(/[۰-۹٠-٩]/g, (d) => map[d] ?? d)
  }

  const handleAddToCart = () => {
    if (!selectedProduct || !price || Number(price) <= 0 || !currency) return
    setAdding(true)
    addToCart(
      { ...selectedProduct, id: selectedProduct.id } as unknown as CartItem & { id: number },
      Number(convertToEnglish(price)),
      currency
    )
    setAdding(false)
    setSelectedProduct(null)
    setPrice('')
    setCurrency('')
    toast.success('محصول به سبد خرید اضافه شد')
  }

  const totalItems = getTotalItems()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <p className="text-charcoal-soft dark:text-slate-400 text-sm">
          محصولات موجود را انتخاب کنید و با وارد کردن قیمت به سبد اضافه کنید.
        </p>
          <div className="relative w-full sm:w-72">
          <label htmlFor="product-search" className="sr-only">
            جستجوی محصول
          </label>
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden />
          <input
            id="product-search"
            type="search"
            placeholder="جستجو نام، نوع، بارکد..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-luxury w-full pl-4 pr-10"
            aria-label="جستجوی محصول بر اساس نام، نوع یا بارکد"
            autoComplete="off"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-gold-500 animate-spin" />
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.04 } },
            hidden: {}
          }}
        >
          {products.map((product) => {
            const selected = isInCart(product.id)
            return (
              <motion.div
                key={product.id}
                role="button"
                tabIndex={product.isSold ? -1 : 0}
                aria-label={`${product.productName}، ${product.type}، ${product.gram} گرم. ${selected ? 'در سبد' : 'برای تعیین قیمت کلیک کنید'}`}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 }
                }}
                className={`
                  relative rounded-2xl border-2 p-4 cursor-pointer transition-all duration-300
                  bg-white dark:bg-slate-800/80 shadow-sm
                  hover:shadow-lg hover:shadow-gold-500/10 hover:-translate-y-1
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2
                  ${selected
                    ? 'border-gold-500 bg-gold-50/50 dark:bg-gold-900/20 ring-2 ring-gold-500/30'
                    : 'border-slate-200 dark:border-slate-600 hover:border-gold-300 dark:hover:border-slate-500'
                  }
                `}
                onClick={() => !product.isSold && openPriceModal(product)}
                onKeyDown={(e) => {
                  if (!product.isSold && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    openPriceModal(product)
                  }
                }}
              >
                {selected && (
                  <div className="absolute top-3 left-3 rounded-full bg-gold-500 text-white p-1">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                )}
                {product.image && (
                  <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 mb-3">
                    <img
                      src={product.image.startsWith('http') ? product.image : `/${product.image}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h3 className="font-semibold text-charcoal dark:text-white truncate">
                  {product.productName}
                </h3>
                <p className="text-sm text-charcoal-soft dark:text-slate-400 mt-0.5">
                  {product.type} · {product.gram} گرم · {product.karat} عیار
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1" dir="ltr">
                  {product.barcode || '—'}
                </p>
                <p className="text-sm font-medium text-gold-600 dark:text-gold-400 mt-2">
                  {Number(product.purchasePriceToAfn).toLocaleString('fa-IR')} افغانی
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {products.length === 0 && !loading && (
        <p className="text-center text-charcoal-soft dark:text-slate-400 py-12">
          محصولی یافت نشد.
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center pt-4 border-t border-slate-200 dark:border-slate-700">
        <p className="text-sm text-charcoal-soft dark:text-slate-400">
          {totalItems} قلم در سبد
        </p>
        <motion.button
          type="button"
          onClick={onNext}
          disabled={totalItems === 0}
          whileTap={totalItems > 0 ? { scale: 0.98 } : undefined}
          className="btn-luxury btn-luxury-primary px-6 py-2.5 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
          aria-label="ادامه به مرحله مشخصات مشتری"
        >
          ادامه به مشخصات مشتری
        </motion.button>
      </div>

      {/* Price modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
            role="presentation"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="price-modal-title"
              aria-describedby="price-modal-desc"
              className="card-luxury p-6 rounded-2xl w-full max-w-sm shadow-xl border border-gold-200 dark:border-slate-600"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 id="price-modal-title" className="font-heading font-semibold text-charcoal dark:text-white mb-1">
                {selectedProduct.productName}
              </h3>
              <p id="price-modal-desc" className="text-sm text-charcoal-soft dark:text-slate-400 mb-4">
                {selectedProduct.type} · {selectedProduct.gram} گرم
              </p>
              <div className="space-y-3 mb-5">
                <label className="block text-sm font-medium text-charcoal dark:text-slate-200">
                  قیمت فروش
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(convertToEnglish(e.target.value))}
                  placeholder="مبلغ"
                  inputMode="numeric"
                  className="input-luxury w-full"
                />
                <label className="block text-sm font-medium text-charcoal dark:text-slate-200">
                  واحد پول
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="input-luxury w-full cursor-pointer"
                >
                  <option value="">انتخاب کنید</option>
                  <option value="افغانی">افغانی</option>
                  <option value="دالر">دالر</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="btn-luxury btn-luxury-outline flex-1 py-2"
                >
                  لغو
                </button>
                <motion.button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!price || Number(price) <= 0 || !currency || adding}
                  whileTap={!adding ? { scale: 0.98 } : undefined}
                  className="btn-luxury btn-luxury-primary flex-1 py-2 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
                  aria-label="افزودن به سبد خرید"
                >
                  افزودن به سبد
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
