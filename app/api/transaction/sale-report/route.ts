import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

function parseJson(val: unknown): any {
  if (typeof val === 'string') return JSON.parse(val)
  return val
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    let transactions: any[]

    if (dateFrom && dateTo) {
      const startOfDay = new Date(dateFrom)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(dateTo)
      endOfDay.setHours(23, 59, 59, 999)

      transactions = (await query(
        'SELECT * FROM transactions WHERE createdAt >= ? AND createdAt <= ?',
        [startOfDay, endOfDay]
      )) as any[]
    } else {
      transactions = (await query('SELECT * FROM transactions')) as any[]
    }

    if (transactions.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'هیچ فروشی صورت نگرفته'
      })
    }

    const today = new Date().toISOString().split('T')[0]
    const rates = (await query(
      'SELECT * FROM currency_rates WHERE date = ? LIMIT 1',
      [today]
    )) as any[]
    const rate = rates?.[0]

    let allProducts: any[] = []
    let totalGram = 0
    let totalAmount = 0
    let remainAmount = 0
    let totalDiscount = 0

    for (const trx of transactions) {
      const products = parseJson(trx.product) as any[]
      const receipt = parseJson(trx.receipt) as any

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
      })
    }

    return NextResponse.json({
      success: true,
      totalProducts: allProducts.length,
      totalGram,
      totalAmount,
      remainAmount,
      totalDiscount,
      products: allProducts
    })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
