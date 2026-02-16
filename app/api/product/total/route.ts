import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const products = (await query(
      'SELECT * FROM products WHERE isSold = 0'
    )) as any[]

    // Group by productName and karat
    const grouped = products.reduce((acc: any, product: any) => {
      const key = `${product.productName}-${product.karat}`
      if (!acc[key]) {
        acc[key] = {
          detail: { name: product.productName, karat: product.karat },
          totalGold: 0,
          totalAmountToAfghani: 0,
          count: 0
        }
      }
      acc[key].totalGold += product.gram
      acc[key].totalAmountToAfghani += product.purchasePriceToAfn
      acc[key].count += 1
      return acc
    }, {})

    const totalProduct = Object.values(grouped)

    return NextResponse.json({ success: true, totalProduct })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
