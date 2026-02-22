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
    const params = new URLSearchParams({
      isSold: 'false',
      page: '1',
      limit: '8',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    })
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
    <section className="py-20 md:py-28 px-4 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto">
        <motion.p
          className="font-[var(--font-playfair)] text-[#D4AF37] tracking-[0.25em] text-sm text-center mb-2"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          پرفروش‌ترین‌ها
        </motion.p>
        <motion.h2
          className="font-[var(--font-playfair)] text-3xl md:text-4xl font-light text-[#2C2C2C] text-center mb-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          گزیدهٔ جواهرات
        </motion.h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-sm bg-[#E5E0D9]/50 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-[#2C2C2C]/70">
            <p className="font-[var(--font-playfair)] text-xl text-[#2C2C2C] mb-2">قطعه‌ای یافت نشد</p>
            <Link href="/shop" className="text-[#D4AF37] font-medium hover:underline">مشاهدهٔ مجموعه</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          className="text-center mt-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-8 py-3 text-sm font-medium border border-[#2C2C2C] text-[#2C2C2C] bg-transparent hover:bg-[#2C2C2C] hover:text-[#FDFBF7] transition-all duration-300"
          >
            مشاهدهٔ همه
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
