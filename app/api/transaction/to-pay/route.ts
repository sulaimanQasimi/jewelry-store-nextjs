import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

function parseJson(val: unknown): any {
  if (typeof val === 'string') return JSON.parse(val)
  return val
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const customerId = searchParams.get('customerId')

    if (!customerId) {
      return NextResponse.json({
        success: false,
        message: 'customerId الزامی است'
      })
    }

    const transactions = (await query(
      'SELECT * FROM transactions WHERE customerId = ? ORDER BY createdAt DESC',
      [parseInt(customerId)]
    )) as any[]

    const loan = transactions.map((trx) => {
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

    if (loan.length === 0) {
      return NextResponse.json({ success: false, message: 'دیتا وجود ندارد' })
    }

    return NextResponse.json({ success: true, loan })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
