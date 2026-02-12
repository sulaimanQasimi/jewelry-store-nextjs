import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' }
    })

    const soldProduct: any[] = []

    transactions.forEach((trx) => {
      const products = trx.product as any[]
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
