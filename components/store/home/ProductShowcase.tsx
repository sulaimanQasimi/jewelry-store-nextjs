'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ProductCard, { type StoreProduct } from '@/components/store/ProductCard'

function normalizeProduct(raw: Record<string, unknown>): StoreProduct {
  return {
    id: Number(raw.id),
    productName: String(raw.productName ?? raw.productname ?? ''),
    type: raw.type != null ? String(raw.type) : null,
    gram: raw.gram != null ? Number(raw.gram) : null,
    karat: raw.karat != null ? Number(raw.karat) : null,
    purchasePriceToAfn: raw.purchasePriceToAfn != null ? Number(raw.purchasePriceToAfn) : (raw.purchasepricetoafn != null ? Number(raw.purchasepricetoafn) : null),
    image: raw.image != null ? String(raw.image) : null,
    imageSecondary: (raw as { imageSecondary?: string }).imageSecondary != null ? String((raw as { imageSecondary?: string }).imageSecondary) : null,
    categories: Array.isArray(raw.categories) ? (raw.categories as { id: number; name: string }[]) : [],
  }
}

export default function ProductShowcase() {
  const [products, setProducts] = useState<StoreProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const params = new URLSearchParams({ isSold: 'false', page: '1', limit: '8', sortBy: 'createdAt', sortOrder: 'desc' })
    fetch(`/api/product/list?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return
        if (json?.success && Array.isArray(json.data)) {
          setProducts(json.data.map((p: Record<string, unknown>) => normalizeProduct(p)))
        }
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return (
    <section className="py-24 md:py-32 px-4 bg-[#0C0C0C] text-white">
      <div className="max-w-7xl mx-auto">
        <motion.p
          className="font-[var(--font-playfair)] text-[#D4AF37] tracking-[0.35em] text-xs text-center mb-3 uppercase"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          پرفروش‌ترین‌ها
        </motion.p>
        <motion.h2
          className="font-[var(--font-playfair)] text-3xl md:text-5xl font-light text-white text-center mb-16 tracking-tight"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          گزیده جواهرات
        </motion.h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-none bg-white/10 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-white/70">
            <p className="font-[var(--font-playfair)] text-xl text-white mb-3">قطعه‌ای یافت نشد</p>
            <Link href="/shop" className="text-sm font-semibold tracking-widest uppercase text-[#D4AF37] hover:underline">مشاهده مجموعه</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductCard product={product} variant="dark" />
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href="/shop"
            className="inline-flex items-center justify-center min-w-[180px] px-8 py-4 text-xs font-semibold tracking-widest uppercase border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#0C0C0C] transition-all duration-300"
          >
            مشاهده همه
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
