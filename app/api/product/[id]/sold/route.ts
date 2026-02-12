import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { isSold } = await request.json()

    const productIsSold = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    })

    if (!productIsSold) {
      return NextResponse.json({ success: false, message: 'جنس پیدا نشد' })
    }

    if (productIsSold.isSold === isSold) {
      return NextResponse.json({
        message: `محصول قبلاً ${isSold ? 'فروخته شده' : 'موجود'} است`
      })
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { isSold }
    })

    return NextResponse.json({
      success: true,
      message: 'وضعیت موفقانه تغیر خورده است',
      productIsSold: updatedProduct
    })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
