import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { customerId, product, receipt, bellNumber, note } = await request.json()

    if (!customerId) {
      return NextResponse.json({ success: false, message: 'مشتری وجود ندارد' })
    }

    const customerData = await prisma.customer.findUnique({
      where: { id: parseInt(customerId) }
    })

    if (!customerData) {
      return NextResponse.json({ success: false, message: 'مشتری یافت نشد' })
    }

    const { customerName, phone } = customerData

    if (!product || !Array.isArray(product) || product.length === 0) {
      return NextResponse.json({ success: false, message: 'سبد خرید خالی است' })
    }

    if (!receipt) {
      return NextResponse.json({ success: false, message: 'رسید موجود نیست' })
    }

    const today = new Date().toISOString().split('T')[0]
    const rate = await prisma.currencyRate.findUnique({
      where: { date: today }
    })

    if (!rate) {
      return NextResponse.json({
        success: false,
        message: 'نرخ ارز برای امروز موجود نیست'
      })
    }

    // Mark products as sold
    for (const item of product) {
      const prod = await prisma.product.findUnique({
        where: { id: parseInt(item.productId) }
      })

      if (!prod) {
        throw new Error(`محصول با آی‌دی ${item.productId} پیدا نشد`)
      }

      if (prod.isSold) {
        throw new Error(`محصول ${prod.productName} قبلاً فروخته شده`)
      }

      await prisma.product.update({
        where: { id: parseInt(item.productId) },
        data: { isSold: true }
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
            price: item.salePrice.price * rate.usdToAfn,
            currency: 'افغانی'
          }
        }
      }
      return item
    })

    let processedReceipt = { ...receipt }
    if (isDollarSale) {
      processedReceipt.totalAmount *= rate.usdToAfn
      processedReceipt.paidAmount *= rate.usdToAfn
      processedReceipt.remainingAmount *= rate.usdToAfn
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        customerId: parseInt(customerId),
        customerName,
        customerPhone: phone,
        product: processedProduct as any,
        receipt: processedReceipt as any,
        bellNumber,
        note: note || null
      }
    })

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
