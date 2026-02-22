import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

function toProduct(row: Record<string, unknown>, categories?: { id: number; name: string }[]) {
  return {
    id: row.id,
    productName: row.productName ?? row.productname,
    type: row.type,
    gram: row.gram,
    karat: row.karat,
    purchasePriceToAfn: row.purchasePriceToAfn ?? row.purchasepricetoafn,
    bellNumber: row.bellNumber ?? row.bellnumber,
    isSold: Boolean(row.isSold ?? row.issold),
    image: row.image,
    barcode: row.barcode,
    wage: row.wage,
    auns: row.auns,
    pricing_mode: row.pricing_mode ?? 'fixed',
    wage_per_gram: row.wage_per_gram,
    isFragment: row.isFragment ?? row.isfragment,
    createdAt: row.createdAt ?? row.createdat,
    updatedAt: row.updatedAt ?? row.updatedat,
    categoryIds: categories?.map((c) => c.id) ?? [],
    categories: categories ?? []
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const productId = parseInt(id, 10)
    if (isNaN(productId)) {
      return NextResponse.json({ success: false, message: 'شناسه نامعتبر' }, { status: 400 })
    }
    const rows = (await query('SELECT * FROM products WHERE id = ?', [productId])) as Record<string, unknown>[]
    const row = rows?.[0]
    if (!row) {
      return NextResponse.json({ success: false, message: 'محصول یافت نشد' }, { status: 404 })
    }
    const catRows = (await query(
      'SELECT c.id, c.name FROM product_categories pc JOIN categories c ON c.id = pc.category_id WHERE pc.product_id = ? ORDER BY c.name',
      [productId]
    )) as { id: number; name: string }[]
    const categories = catRows ?? []
    const product = toProduct(row, categories)
    return NextResponse.json({ success: true, data: product })
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'خطا'
    })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const productId = parseInt(id, 10)
    if (isNaN(productId)) {
      return NextResponse.json({ success: false, message: 'شناسه نامعتبر' }, { status: 400 })
    }
    const body = await request.json()
    const productName = body.productName ?? body.productname
    const type = body.type
    const gram = body.gram ?? body.weight
    const karat = body.karat
    const purchasePriceToAfn = body.purchasePriceToAfn ?? body.purchasePrice
    const bellNumber = body.bellNumber ?? body.bellnumber
    const wage = body.wage
    const auns = body.auns
    const pricing_mode = body.pricing_mode === 'gold_based' ? 'gold_based' : 'fixed'
    const wage_per_gram = body.wage_per_gram != null ? parseFloat(body.wage_per_gram) : null
    let categoryIds: number[] = []
    if (Array.isArray(body.categoryIds)) {
      categoryIds = body.categoryIds.filter((x: unknown) => typeof x === 'number' && x > 0)
    }

    await query(
      `UPDATE products SET 
        productName = ?, type = ?, gram = ?, karat = ?, 
        purchasePriceToAfn = ?, bellNumber = ?, wage = ?, auns = ?,
        pricing_mode = ?, wage_per_gram = ?, updatedAt = NOW()
       WHERE id = ?`,
      [
        productName ?? '',
        type ?? '',
        gram ?? 0,
        karat ?? 0,
        purchasePriceToAfn ?? 0,
        bellNumber ?? null,
        wage ?? null,
        auns ?? null,
        pricing_mode,
        wage_per_gram,
        productId
      ]
    )
    await query('DELETE FROM product_categories WHERE product_id = ?', [productId])
    for (const catId of categoryIds) {
      await query('INSERT IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)', [productId, catId])
    }
    const rows = (await query('SELECT * FROM products WHERE id = ?', [productId])) as Record<string, unknown>[]
    const catRows = (await query(
      'SELECT c.id, c.name FROM product_categories pc JOIN categories c ON c.id = pc.category_id WHERE pc.product_id = ? ORDER BY c.name',
      [productId]
    )) as { id: number; name: string }[]
    const newUpdatedProduct = rows?.[0] ? toProduct(rows[0], catRows ?? []) : null
    return NextResponse.json({ success: true, newUpdatedProduct })
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'خطا'
    })
  }
}
