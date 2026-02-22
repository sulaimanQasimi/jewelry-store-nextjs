'use client'

import { useState, useEffect, useMemo } from 'react'
import FilterSidebar, { type FilterState, type CategoryOption } from '@/components/store/FilterSidebar'
import ProductCard, { type StoreProduct } from '@/components/store/ProductCard'

const DEFAULT_PRICE_MIN = 0
const DEFAULT_PRICE_MAX = 100000

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

export default function ShopPage() {
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [products, setProducts] = useState<StoreProduct[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterState>({
    categoryId: '',
    priceMin: '',
    priceMax: '',
    material: '',
    availability: true,
  })

  const limit = 12
  const priceRange = useMemo(() => ({ min: DEFAULT_PRICE_MIN, max: DEFAULT_PRICE_MAX }), [])

  useEffect(() => {
    let cancelled = false
    async function run() {
      const res = await fetch('/api/categories/list')
      if (cancelled) return
      const json = await res.json()
      if (json?.success && Array.isArray(json.data)) {
        setCategories(json.data.map((c: { id: number; name: string }) => ({ id: c.id, name: c.name })))
      }
    }
    run()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const params = new URLSearchParams()
    params.set('isSold', 'false')
    params.set('page', String(page))
    params.set('limit', String(limit))
    params.set('sortBy', 'createdAt')
    params.set('sortOrder', 'desc')
    if (filter.categoryId) params.set('categoryId', filter.categoryId)
    if (filter.material) params.set('type', filter.material)
    if (filter.availability) params.set('isSold', 'false')
    if (filter.priceMin !== '') params.set('priceMin', filter.priceMin)
    if (filter.priceMax !== '') params.set('priceMax', filter.priceMax)

    fetch(`/api/product/list?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return
        if (json?.success && Array.isArray(json.data)) {
          setProducts(json.data.map((p: Record<string, unknown>) => normalizeProduct(p)))
          setTotal(Number(json.total) ?? 0)
        } else {
          setProducts([])
          setTotal(0)
        }
      })
      .catch(() => {
        if (!cancelled) setProducts([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [page, filter.categoryId, filter.material, filter.priceMin, filter.priceMax, filter.availability])

  const onFilterChange = (next: Partial<FilterState>) => {
    setFilter((prev) => ({ ...prev, ...next }))
    setPage(1)
  }

  const onClearFilters = () => {
    setFilter({
      categoryId: '',
      priceMin: '',
      priceMax: '',
      material: '',
      availability: true,
    })
    setPage(1)
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="store-products min-h-screen" style={{ backgroundColor: '#FDFBF7' }}>
      <section className="py-12 md:py-14 px-4 sm:px-6 lg:px-8 border-b border-[#F0EDE8]">
        <div className="max-w-[1600px] mx-auto">
          <p className="text-[#D4AF37] tracking-[0.2em] text-sm mb-1 font-medium">مجموعه</p>
          <h1 className="text-2xl md:text-4xl font-semibold text-[#2D2D2D]">
            جواهرات ما
          </h1>
          <p className="text-[#2D2D2D]/70 mt-2 text-sm">فقط قطعات موجود نمایش داده می‌شوند.</p>
        </div>
      </section>

      <div className="max-w-[1600px] mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
          <div className="w-full lg:w-72 shrink-0">
            <FilterSidebar
              categories={categories}
              filter={filter}
              onFilterChange={onFilterChange}
              priceRange={priceRange}
              onClearFilters={onClearFilters}
            />
          </div>

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] rounded-sm bg-[#F0EDE8]/50 animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 text-[#2D2D2D]/70">
                <p className="text-xl font-semibold text-[#2D2D2D] mb-2">قطعه‌ای یافت نشد</p>
                <p className="text-sm">فیلترها را تغییر دهید یا بعداً مراجعه کنید.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-3 mt-14">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="px-5 py-2.5 rounded-sm border border-[#E5E0D9] text-[#2D2D2D] disabled:opacity-40 hover:bg-[#F0EDE8]/60 transition-all duration-300 text-sm font-medium"
                    >
                      قبلی
                    </button>
                    <span className="px-4 py-2 text-[#2D2D2D]/80 text-sm">
                      صفحهٔ {page} از {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="px-5 py-2.5 rounded-sm border border-[#E5E0D9] text-[#2D2D2D] disabled:opacity-40 hover:bg-[#F0EDE8]/60 transition-all duration-300 text-sm font-medium"
                    >
                      بعدی
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
