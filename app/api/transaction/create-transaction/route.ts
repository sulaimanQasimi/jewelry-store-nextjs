import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

function parseJson(val: unknown): any {
  if (typeof val === 'string') return JSON.parse(val)
  return val
}

export async function POST(request: NextRequest) {
  try {
    const { customerId, product, receipt, bellNumber, note } = await request.json()

    if (!customerId) {
      return NextResponse.json({ success: false, message: 'مشتری وجود ندارد' })
    }

    const customers = (await query(
      'SELECT id, customerName, phone FROM customers WHERE id = ? LIMIT 1',
      [parseInt(customerId)]
    )) as any[]

    const customerData = customers?.[0]
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
    const rates = (await query(
      'SELECT * FROM currency_rates WHERE date = ? LIMIT 1',
      [today]
    )) as any[]
    const rate = rates?.[0]

    if (!rate) {
      return NextResponse.json({
        success: false,
        message: 'نرخ ارز برای امروز موجود نیست'
      })
    }

    // Mark products as sold
    for (const item of product) {
      const prods = (await query(
        'SELECT id, productName, isSold FROM products WHERE id = ? LIMIT 1',
        [parseInt(item.productId)]
      )) as any[]
      const prod = prods?.[0]

      if (!prod) {
        throw new Error(`محصول با آی‌دی ${item.productId} پیدا نشد`)
      }

      if (prod.isSold) {
        throw new Error(`محصول ${prod.productName} قبلاً فروخته شده`)
      }

      await query(
        'UPDATE products SET isSold = 1 WHERE id = ?',
        [parseInt(item.productId)]
      )
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

    await query(
      `INSERT INTO transactions (customerId, customerName, customerPhone, product, receipt, bellNumber, note)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        parseInt(customerId),
        customerName,
        phone,
        JSON.stringify(processedProduct),
        JSON.stringify(processedReceipt),
        bellNumber,
        note || null
      ]
    )

    const inserted = (await query(
      'SELECT * FROM transactions WHERE bellNumber = ? ORDER BY id DESC LIMIT 1',
      [bellNumber]
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
