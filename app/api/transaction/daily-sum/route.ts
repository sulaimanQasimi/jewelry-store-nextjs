import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const transactions = await prisma.transaction.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    })

    if (transactions.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'هیچ فروشی صورت نگرفته'
      })
    }

    const today = new Date().toISOString().split('T')[0]
    const rate = await prisma.currencyRate.findUnique({
      where: { date: today }
    })

    let allProducts: any[] = []
    let totalPurchase = 0
    let totalGram = 0
    let totalAmount = 0
    let remainAmount = 0
    let totalDiscount = 0

    for (const trx of transactions) {
      const products = trx.product as any[]
      const receipt = trx.receipt as any

      const isDollarSale = products.some((p: any) => p.salePrice?.currency === 'دالر')

      if (isDollarSale) {
        if (!rate) {
          return NextResponse.json({
            success: false,
            message: 'نرخ امروز دالر ثبت نشده'
          })
        }
        totalAmount += receipt.totalAmount * rate.usdToAfn
        remainAmount += receipt.remainingAmount * rate.usdToAfn
        totalDiscount += receipt.discount * rate.usdToAfn
      } else {
        totalAmount += receipt.totalAmount
        remainAmount += receipt.remainingAmount
        totalDiscount += receipt.discount
      }

      products.forEach((p: any) => {
        allProducts.push({
          name: p.productName,
          barcode: p.barcode,
          gram: p.gram,
          price: p.salePrice
        })

        totalGram += p.gram
        totalPurchase += p.purchasePriceToAfn
      })
    }

    return NextResponse.json({
      success: true,
      totalProducts: allProducts.length,
      totalGram,
      totalPurchase,
      totalAmount,
      remainAmount,
      totalDiscount,
      products: allProducts
    })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({
      success: false,
      message: error.message
    })
  }
}
