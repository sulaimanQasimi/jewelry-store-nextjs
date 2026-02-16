import { NextRequest, NextResponse } from 'next/server'
import { spGetDailyTransactions, parseJson } from '@/lib/db-sp'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dateStr = searchParams.get('date')?.trim() || new Date().toISOString().slice(0, 10)

    const startOfDay = new Date(dateStr)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(dateStr)
    endOfDay.setHours(23, 59, 59, 999)

    const transactions = await spGetDailyTransactions(startOfDay, endOfDay)

    const daily = transactions.map((trx: any) => {
      const products = parseJson(trx.product) as any[]
      const receipt = parseJson(trx.receipt) as any

      return {
        _id: trx.id,
        customerName: trx.customerName,
        customerPhone: trx.customerPhone,
        discount: receipt?.discount ?? 0,
        totalAmount: receipt?.totalAmount ?? 0,
        paidAmount: receipt?.paidAmount ?? 0,
        remainingAmount: receipt?.remainingAmount ?? 0,
        bellNumber: trx.bellNumber,
        date: trx.createdAt,
        product: (products || []).map((p: any) => ({
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

    return NextResponse.json({ success: true, daily })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
