import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const transactionId = searchParams.get('transactionId')
    const productId = searchParams.get('productId')

    if (!transactionId || !productId) {
      return NextResponse.json({
        success: false,
        message: 'transactionId و productId الزامی است'
      })
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(transactionId) }
    })

    if (!transaction) {
      return NextResponse.json({
        success: false,
        message: 'ترانسکشن پیدا نشد'
      })
    }

    const products = transaction.product as any[]
    const receipt = transaction.receipt as any

    const productIndex = products.findIndex(
      (p: any) => p.productId.toString() === productId
    )

    if (productIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'محصول در ترانسکشن وجود ندارد'
      })
    }

    const removedProduct = products[productIndex]

    // Mark product as not sold
    await prisma.product.update({
      where: { id: parseInt(removedProduct.productId) },
      data: { isSold: false }
    })

    const productAmount = removedProduct.salePrice.price
    const updatedProducts = products.filter((_, index) => index !== productIndex)

    const updatedReceipt = {
      ...receipt,
      totalAmount: receipt.totalAmount - productAmount,
      paidAmount: receipt.paidAmount - productAmount,
      totalQuantity: (receipt.totalQuantity || products.length) - 1,
      remainingAmount: Math.max(0, receipt.totalAmount - receipt.paidAmount - productAmount)
    }

    // If no products left, delete transaction
    if (updatedProducts.length === 0) {
      await prisma.transaction.delete({
        where: { id: parseInt(transactionId) }
      })
      return NextResponse.json({
        success: true,
        message: 'تمام محصولات حذف شد، ترانسکشن پاک گردید'
      })
    }

    // Update transaction
    const updatedTransaction = await prisma.transaction.update({
      where: { id: parseInt(transactionId) },
      data: {
        product: updatedProducts as any,
        receipt: updatedReceipt as any
      }
    })

    return NextResponse.json({
      success: true,
      message: 'محصول با موفقیت برگشت داده شد',
      transaction: updatedTransaction
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({
      success: false,
      message: 'خطای سرور'
    })
  }
}
