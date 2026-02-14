import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

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
    const rate = await prisma.currencyRate.findUnique({
      where: { date: today }
    })

    if (!rate) {
      return NextResponse.json({ success: false, message: 'نرخ ارز امروز موجود نیست' })
    }

    const paidAmount = currency === 'دالر' ? paid * rate.usdToAfn : paid

    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(transactionId) }
    })

    if (!transaction) {
      return NextResponse.json({ success: false, message: 'ترانسکشن یافت نشد' })
    }

    const receipt = transaction.receipt as any
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

    const updatedTransaction = await prisma.transaction.update({
      where: { id: parseInt(transactionId) },
      data: {
        receipt: updatedReceipt as any
      }
    })

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
