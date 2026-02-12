import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { productName, type, weight, karat, purchasePrice, currency } = await request.json()

    const newUpdatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        productName,
        type,
        gram: weight,
        karat,
        purchasePriceToAfn: purchasePrice
      }
    })

    return NextResponse.json({ success: true, newUpdatedProduct })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
