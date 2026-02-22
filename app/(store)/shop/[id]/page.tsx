import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import Button from '@/components/store/Button'
import { query } from '@/lib/db'

async function getProduct(id: number) {
  try {
    const rows = (await query('SELECT * FROM products WHERE id = ? AND isSold = 0', [id])) as Record<string, unknown>[]
    const row = rows?.[0]
    if (!row) return null
    const catRows = (await query(
      'SELECT c.id, c.name FROM product_categories pc JOIN categories c ON c.id = pc.category_id WHERE pc.product_id = ? ORDER BY c.name',
      [id]
    )) as { id: number; name: string }[]
    const categories = catRows ?? []
    return {
      id: row.id,
      productName: row.productName ?? row.productname ?? '',
      type: row.type ?? null,
      gram: row.gram ?? null,
      karat: row.karat ?? null,
      purchasePriceToAfn: row.purchasePriceToAfn ?? row.purchasepricetoafn ?? null,
      image: row.image ?? null,
      barcode: row.barcode ?? null,
      categories,
    }
  } catch {
    return null
  }
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

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const productId = parseInt(id, 10)
  if (isNaN(productId)) notFound()

  const product = await getProduct(productId)
  if (!product) notFound()

  const imgSrc = product.image?.startsWith('/') ? product.image : product.image ? `/${product.image}` : null

  return (
    <div className="store-product-detail min-h-screen bg-cream-50">
      <div className="max-w-6xl mx-auto py-8 md:py-12 px-4">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-[#2C2C2C]/80 hover:text-[#D4AF37] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Collection
        </Link>

        <div className="grid md:grid-cols-2 gap-10 md:gap-14">
          <div className="aspect-square relative bg-cream-200 rounded-sm overflow-hidden">
            {imgSrc ? (
              <Image
                src={imgSrc}
                alt={product.productName}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[#2C2C2C]/30">
                <span className="font-serif text-8xl">◆</span>
              </div>
            )}
          </div>

          <div>
            {product.categories?.length ? (
              <p className="text-sm text-[#D4AF37] tracking-wide uppercase mb-2">
                {product.categories.map((c: { name: string }) => c.name).join(', ')}
              </p>
            ) : null}
            <h1 className="font-serif text-3xl md:text-4xl font-light text-[#2C2C2C] mb-4">
              {product.productName}
            </h1>
            <p className="text-2xl font-medium text-[#D4AF37] mb-6">
              {formatPrice(product.purchasePriceToAfn)}
            </p>
            <dl className="space-y-2 text-[#2C2C2C]/80">
              {product.type && (
                <>
                  <dt className="font-medium text-[#2C2C2C]">Material / Type</dt>
                  <dd>{product.type}</dd>
                </>
              )}
              {product.karat != null && (
                <>
                  <dt className="font-medium text-[#2C2C2C]">Karat</dt>
                  <dd>{product.karat}</dd>
                </>
              )}
              {product.gram != null && (
                <>
                  <dt className="font-medium text-[#2C2C2C]">Weight (g)</dt>
                  <dd>{product.gram}</dd>
                </>
              )}
            </dl>
            <div className="mt-8 pt-8 border-t border-cream-200">
              <Link href="/contact">
                <Button variant="gold" size="lg">
                  Inquire
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
