import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

function parseJson(val: unknown): any {
  if (typeof val === 'string') return JSON.parse(val)
  return val
}

export async function GET(request: NextRequest) {
  try {
    const transactions = (await query(
      'SELECT * FROM transactions ORDER BY createdAt DESC'
    )) as any[]

    const soldProduct: any[] = []

    transactions.forEach((trx) => {
      const products = parseJson(trx.product) as any[]
      products.forEach((p: any) => {
        soldProduct.push({
          transactionId: trx.id,
          customerName: trx.customerName,
          customerPhone: trx.customerPhone,
          productName: p.productName,
          productId: p.productId,
          salePrice: p.salePrice,
          gram: p.gram,
          karat: p.karat,
          barcode: p.barcode,
          image: p.image,
          createdAt: trx.createdAt
        })
      })
    })

    if (soldProduct.length === 0) {
      return NextResponse.json({ success: false, message: 'هیچ فروشی صورت نگرفته' })
    }

    return NextResponse.json({ success: true, soldProduct })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
