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
    const { amount, currency } = await request.json()

    if (!transactionId) {
      return NextResponse.json({ success: false, message: 'transactionId موجود نیست' })
    }

    const paid = Number(amount)
    if (!paid || paid <= 0) {
      return NextResponse.json({ success: false, message: 'مبلغ پرداخت نادرست است' })
    }

    const today = new Date().toISOString().split('T')[0]
    const rates = (await query(
      'SELECT * FROM currency_rates WHERE date = ? LIMIT 1',
      [today]
    )) as any[]
    const rate = rates?.[0]

    if (!rate) {
      return NextResponse.json({ success: false, message: 'نرخ ارز امروز موجود نیست' })
    }

    const paidAmount = currency === 'دالر' ? paid * rate.usdToAfn : paid

    const transactions = (await query(
      'SELECT * FROM transactions WHERE id = ? LIMIT 1',
      [parseInt(transactionId)]
    )) as any[]
    const transaction = transactions?.[0]

    if (!transaction) {
      return NextResponse.json({ success: false, message: 'ترانسکشن یافت نشد' })
    }

    const receipt = parseJson(transaction.receipt) as any
    const remaining = receipt.remainingAmount

    if (remaining <= 0) {
      return NextResponse.json({ success: false, message: 'قبلاً تسویه شده است' })
    }

    const paidToApply = Math.min(paidAmount, remaining)

    const updatedReceipt = {
      ...receipt,
      paidAmount: receipt.paidAmount + paidToApply,
      remainingAmount: receipt.remainingAmount - paidToApply
    }

    await query(
      'UPDATE transactions SET receipt = ? WHERE id = ?',
      [JSON.stringify(updatedReceipt), parseInt(transactionId)]
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
      message: 'پرداخت موفقانه ثبت شد',
      transaction: updatedTransaction
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
