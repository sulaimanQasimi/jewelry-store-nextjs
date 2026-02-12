import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

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
      },
      orderBy: { createdAt: 'desc' }
    })

    const daily = transactions.map((trx) => {
      const products = trx.product as any[]
      const receipt = trx.receipt as any

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
