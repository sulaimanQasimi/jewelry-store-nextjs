import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

function parseJson(val: unknown): any {
  if (typeof val === 'string') return JSON.parse(val)
  return val
}

export async function GET(request: NextRequest) {
  try {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const transactions = (await query(
      `SELECT * FROM transactions 
       WHERE createdAt >= ? AND createdAt <= ? 
       ORDER BY createdAt DESC`,
      [startOfDay, endOfDay]
    )) as any[]

    const daily = transactions.map((trx) => {
      const products = parseJson(trx.product) as any[]
      const receipt = parseJson(trx.receipt) as any

      return {
        _id: trx.id,
        customerName: trx.customerName,
        customerPhone: trx.customerPhone,
        discount: receipt.discount,
        totalAmount: receipt.totalAmount,
        paidAmount: receipt.paidAmount,
        remainingAmount: receipt.remainingAmount,
        bellNumber: trx.bellNumber,
        date: trx.createdAt,
        product: products.map((p: any) => ({
          productId: p.productId,
          name: p.productName,
          purchase: p.purchasePriceToAfn,
          sold: p.salePrice?.price,
          barcode: p.barcode,
          gram: p.gram,
          karat: p.karat
        }))
      }
    })

    if (daily.length === 0) {
      return NextResponse.json({ success: false, message: 'دیتا وجود ندارد' })
    }

    return NextResponse.json({ success: true, daily })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
