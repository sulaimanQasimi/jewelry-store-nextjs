import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { spReturnProduct, parseJson } from '@/lib/db-sp'

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

    const { success, errorMsg } = await spReturnProduct(
      parseInt(transactionId),
      parseInt(productId)
    )

    if (!success) {
      return NextResponse.json({
        success: false,
        message: errorMsg || 'خطا در برگشت محصول'
      })
    }

    const transactions = (await query(
      'SELECT * FROM transactions WHERE id = ? LIMIT 1',
      [parseInt(transactionId)]
    )) as any[]

    const updatedTransaction = transactions?.[0] ?? null

    if (updatedTransaction) {
      updatedTransaction.product = parseJson(updatedTransaction.product)
      updatedTransaction.receipt = parseJson(updatedTransaction.receipt)
      return NextResponse.json({
        success: true,
        message: 'محصول با موفقیت برگشت داده شد',
        transaction: updatedTransaction
      })
    }

    return NextResponse.json({
      success: true,
      message: 'تمام محصولات حذف شد، ترانسکشن پاک گردید'
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({
      success: false,
      message: 'خطای سرور'
    })
  }
}
