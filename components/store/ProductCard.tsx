'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Eye } from 'lucide-react'

export interface StoreProduct {
  id: number
  productName: string
  type?: string | null
  gram?: number | null
  karat?: number | null
  purchasePriceToAfn?: number | null
  image?: string | null
  categories?: { id: number; name: string }[]
}

interface ProductCardProps {
  product: StoreProduct
  className?: string
}

function formatPrice(value: number | null | undefined): string {
  if (value == null || isNaN(Number(value))) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value))
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const price = product.purchasePriceToAfn ?? (product as Record<string, unknown>).purchasePriceToAfn
  const imgSrc = product.image?.startsWith('/') ? product.image : product.image ? `/${product.image}` : null

  return (
    <article
      className={`
        group relative bg-cream-50 rounded-sm overflow-hidden
        border border-cream-200 shadow-sm hover:shadow-xl
        transition-all duration-300 ease-out
        ${className}
      `}
    >
      <Link
        href={`/shop/${product.id}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 rounded-sm"
      >
        <div className="aspect-square relative bg-cream-100 overflow-hidden">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={product.productName}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[#2C2C2C]/30">
              <span className="font-serif text-4xl">◆</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2C]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-4">
          <h3 className="font-serif text-[#2C2C2C] font-medium text-lg mb-1 line-clamp-2">
            {product.productName}
          </h3>
          {product.categories?.length ? (
            <p className="text-sm text-[#2C2C2C]/70 mb-2">
              {product.categories.map((c) => c.name).join(', ')}
            </p>
          ) : null}
          <p className="font-medium text-[#D4AF37] mb-4">
            {formatPrice(Number(price))}
          </p>
          <span
            className="
              inline-flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium
              rounded-sm border border-[#2C2C2C] text-[#2C2C2C]
              bg-transparent hover:bg-[#2C2C2C] hover:text-cream-50
              transition-all duration-300
            "
          >
            View Details
            <Eye className="w-4 h-4 shrink-0" aria-hidden />
          </span>
        </div>
      </Link>
    </article>
  )
}
