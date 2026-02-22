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
    <div className="store-products min-h-screen bg-cream-50">
      <section className="py-10 px-4 border-b border-cream-200">
        <div className="max-w-7xl mx-auto">
          <p className="font-serif text-[#D4AF37] tracking-[0.2em] uppercase text-sm mb-1">Collection</p>
          <h1 className="font-serif text-3xl md:text-4xl font-light text-[#2C2C2C]">
            Our Jewelry
          </h1>
          <p className="text-[#2C2C2C]/70 mt-2">Showing only pieces currently available.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-64 shrink-0">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-cream-200 rounded-sm animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 text-[#2C2C2C]/70">
                <p className="font-serif text-xl text-[#2C2C2C] mb-2">No pieces found</p>
                <p>Try adjusting filters or check back later.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="px-4 py-2 rounded-sm border border-cream-300 text-[#2C2C2C] disabled:opacity-50 hover:bg-cream-200 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-[#2C2C2C]/80">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="px-4 py-2 rounded-sm border border-cream-300 text-[#2C2C2C] disabled:opacity-50 hover:bg-cream-200 transition-colors"
                    >
                      Next
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
