import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

function toProduct(row: Record<string, unknown>) {
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
    isFragment: row.isFragment ?? row.isfragment,
    createdAt: row.createdAt ?? row.createdat,
    updatedAt: row.updatedAt ?? row.updatedat
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
    const product = rows?.[0] ? toProduct(rows[0]) : null
    if (!product) {
      return NextResponse.json({ success: false, message: 'محصول یافت نشد' }, { status: 404 })
    }
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

    await query(
      `UPDATE products SET 
        productName = ?, type = ?, gram = ?, karat = ?, 
        purchasePriceToAfn = ?, bellNumber = ?, wage = ?, auns = ?, updatedAt = NOW()
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
        productId
      ]
    )
    const rows = (await query('SELECT * FROM products WHERE id = ?', [productId])) as Record<string, unknown>[]
    const newUpdatedProduct = rows?.[0] ? toProduct(rows[0]) : null
    return NextResponse.json({ success: true, newUpdatedProduct })
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'خطا'
    })
  }
}
