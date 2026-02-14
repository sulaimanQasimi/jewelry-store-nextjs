import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const dailyProduct = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    if (dailyProduct.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'امروز هیچ جنسی ثبت نشده'
      })
    }

    return NextResponse.json({
      success: true,
      count: dailyProduct.length,
      dailyProduct
    })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
