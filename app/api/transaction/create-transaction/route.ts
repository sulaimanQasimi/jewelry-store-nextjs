import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { spCreateTransaction, fnGetCurrencyRate, parseJson } from '@/lib/db-sp'
import { processTransaction } from '@/lib/actions/accounts'

export async function POST(request: NextRequest) {
  try {
    const { customerId, product, receipt, bellNumber, note, depositAccountId } = await request.json()

    if (!customerId) {
      return NextResponse.json({ success: false, message: 'مشتری وجود ندارد' })
    }

    if (!product || !Array.isArray(product) || product.length === 0) {
      return NextResponse.json({ success: false, message: 'سبد خرید خالی است' })
    }

    if (!receipt) {
      return NextResponse.json({ success: false, message: 'رسید موجود نیست' })
    }

    const today = new Date().toISOString().split('T')[0]
    const rate = await fnGetCurrencyRate(today)

    if (!rate) {
      return NextResponse.json({
        success: false,
        message: 'نرخ ارز برای امروز موجود نیست'
      })
    }

    // Convert dollar sales to AFN
    let isDollarSale = false
    const processedProduct = product.map((item: any) => {
      if (item.salePrice?.currency === 'دالر') {
        isDollarSale = true
        return {
          ...item,
          salePrice: {
            ...item.salePrice,
            price: item.salePrice.price * rate,
            currency: 'افغانی'
          }
        }
      }
      return item
    })

    let processedReceipt = { ...receipt }
    if (isDollarSale) {
      processedReceipt.totalAmount *= rate
      processedReceipt.paidAmount *= rate
      processedReceipt.remainingAmount *= rate
    }

    const { transactionId, errorMsg } = await spCreateTransaction(
      parseInt(customerId),
      JSON.stringify(processedProduct),
      JSON.stringify(processedReceipt),
      bellNumber,
      note || null
    )

    if (errorMsg) {
      return NextResponse.json({ success: false, message: errorMsg })
    }

    if (!transactionId) {
      return NextResponse.json({ success: false, message: 'خطا در ثبت ترانسکشن' })
    }

    // If deposit account provided and there is a paid amount, credit the account
    const paidAmount = Number(processedReceipt?.paidAmount) || 0
    if (depositAccountId && paidAmount > 0) {
      const creditResult = await processTransaction(
        depositAccountId,
        paidAmount,
        'credit',
        `فروش — بل ${bellNumber}`
      )
      if (!creditResult.success) {
        return NextResponse.json({
          success: false,
          message: creditResult.error || 'خطا در واریز به حساب'
        })
      }
    }

    const inserted = (await query(
      'SELECT * FROM transactions WHERE id = ? LIMIT 1',
      [transactionId]
    )) as any[]
    const newTransaction = inserted?.[0] ?? null
    if (newTransaction) {
      newTransaction.product = parseJson(newTransaction.product)
      newTransaction.receipt = parseJson(newTransaction.receipt)
    }

    return NextResponse.json({
      success: true,
      message: 'ترانسکشن موفقانه اجرا شد',
      data: newTransaction
    })
  } catch (error: any) {
    console.error('ERROR:', error)
    return NextResponse.json({
      success: false,
      message: error.message
    })
  }
}
