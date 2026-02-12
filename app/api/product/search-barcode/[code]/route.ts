import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params

    const productByBarcode = await prisma.product.findFirst({
      where: {
        barcode: code,
        isSold: false
      }
    })

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
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({
      success: false,
      message: error.message
    })
  }
}
