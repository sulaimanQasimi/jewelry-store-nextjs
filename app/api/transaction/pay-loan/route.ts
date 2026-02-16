import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { spPayLoan, fnGetCurrencyRate, parseJson } from '@/lib/db-sp'

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const transactionId = searchParams.get('transactionId')
    const { amount, currency } = await request.json()

    if (!transactionId) {
      return NextResponse.json({ success: false, message: 'transactionId موجود نیست' })
    }

    const paid = Number(amount)
    if (!paid || paid <= 0) {
      return NextResponse.json({ success: false, message: 'مبلغ پرداخت نادرست است' })
    }

    const today = new Date().toISOString().split('T')[0]
    const rate = await fnGetCurrencyRate(today)

    if (!rate) {
      return NextResponse.json({ success: false, message: 'نرخ ارز امروز موجود نیست' })
    }

    const { success, errorMsg } = await spPayLoan(
      parseInt(transactionId),
      paid,
      currency || 'افغانی',
      rate
    )

    if (!success) {
      return NextResponse.json({ success: false, message: errorMsg || 'خطا در پرداخت' })
    }

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
      message: 'پرداخت موفقانه ثبت شد',
      transaction: updatedTransaction
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
