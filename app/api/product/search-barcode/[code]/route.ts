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
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params

    const rows = (await query(
      'SELECT * FROM products WHERE barcode = ? AND (isSold = 0 OR isSold = false) LIMIT 1',
      [code]
    )) as Record<string, unknown>[]

    const productByBarcode = rows?.[0] ? toProduct(rows[0]) : null

    if (!productByBarcode) {
      return NextResponse.json({
        success: false,
        message: 'جنس یافت نشد'
      })
    }

    return NextResponse.json({
      success: true,
      productByBarcode
    })
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'خطا در جستجو'
    })
  }
}
