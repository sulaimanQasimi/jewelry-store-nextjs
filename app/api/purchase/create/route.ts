import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { supplierId, supplierName, totalAmount, bellNumber, currency, paidAmount, date, items } = body

    if (!supplierId || !supplierName?.trim()) {
      return NextResponse.json({ success: false, message: 'تمویل‌کننده الزامی است' })
    }
    if (!bellNumber) {
      return NextResponse.json({ success: false, message: 'شماره بل الزامی است' })
    }
    if (!currency?.trim()) {
      return NextResponse.json({ success: false, message: 'واحد پول الزامی است' })
    }

    const paid = parseFloat(paidAmount)
    if (isNaN(paid) || paid < 0) {
      return NextResponse.json({ success: false, message: 'مبلغ پرداختی نامعتبر است' })
    }

    const total = totalAmount != null ? parseFloat(totalAmount) : 0

    const result = (await query(
      `INSERT INTO purchases (supplierId, supplierName, totalAmount, bellNumber, currency, paidAmount, date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        parseInt(supplierId),
        supplierName.trim(),
        total || null,
        parseInt(bellNumber),
        currency.trim(),
        paid,
        date ? new Date(date) : new Date()
      ]
    )) as any

    const purchaseId = result.insertId

    if (Array.isArray(items) && items.length > 0) {
      for (const it of items) {
        const qty = parseInt(it.quantity) || 0
        const price = parseFloat(it.price) || 0
        const productMasterId = it.productMasterId ? parseInt(it.productMasterId) : null
        await query(
          `INSERT INTO purchase_items (purchaseId, productMasterId, name, type, gram, karat, quantity, remainingQty, price)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            purchaseId,
            productMasterId,
            it.name?.trim() || '',
            it.type?.trim() || '',
            parseFloat(it.gram) || 0,
            parseFloat(it.karat) || 0,
            qty,
            qty,
            price
          ]
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: 'خرید با موفقیت ثبت شد',
      data: { id: purchaseId }
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
