import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

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

    const transactions = await prisma.transaction.findMany({
      where: { customerId: parseInt(customerId) },
      orderBy: { createdAt: 'desc' }
    })

    const loan = transactions.map((trx) => {
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

    if (loan.length === 0) {
      return NextResponse.json({ success: false, message: 'دیتا وجود ندارد' })
    }

    return NextResponse.json({ success: true, loan })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
