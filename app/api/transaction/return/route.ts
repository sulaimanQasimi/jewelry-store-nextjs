import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

function parseJson(val: unknown): any {
  if (typeof val === 'string') return JSON.parse(val)
  return val
}

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

    const transactions = (await query(
      'SELECT * FROM transactions WHERE id = ? LIMIT 1',
      [parseInt(transactionId)]
    )) as any[]
    const transaction = transactions?.[0]

    if (!transaction) {
      return NextResponse.json({
        success: false,
        message: 'ترانسکشن پیدا نشد'
      })
    }

    const products = parseJson(transaction.product) as any[]
    const receipt = parseJson(transaction.receipt) as any

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
    await query(
      'UPDATE products SET isSold = 0 WHERE id = ?',
      [parseInt(removedProduct.productId)]
    )

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
      await query('DELETE FROM transactions WHERE id = ?', [parseInt(transactionId)])
      return NextResponse.json({
        success: true,
        message: 'تمام محصولات حذف شد، ترانسکشن پاک گردید'
      })
    }

    // Update transaction
    await query(
      'UPDATE transactions SET product = ?, receipt = ? WHERE id = ?',
      [JSON.stringify(updatedProducts), JSON.stringify(updatedReceipt), parseInt(transactionId)]
    )

    const updated = (await query(
      'SELECT * FROM transactions WHERE id = ? LIMIT 1',
      [parseInt(transactionId)]
    )) as any[]
    const updatedTransaction = updated?.[0] ?? null
    if (updatedTransaction) {
      updatedTransaction.product = parseJson(updatedTransaction.product)
      updatedTransaction.receipt = parseJson(updatedTransaction.receipt)
    }

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
