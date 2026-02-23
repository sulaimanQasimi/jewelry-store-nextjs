import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const idNum = parseInt(id, 10)
    if (isNaN(idNum)) {
      return NextResponse.json({ success: false, message: 'شناسه نامعتبر' }, { status: 400 })
    }

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

    const total = totalAmount != null ? parseFloat(totalAmount) : null

    await query(
      `UPDATE purchases SET supplierId = ?, supplierName = ?, totalAmount = ?, bellNumber = ?, currency = ?, paidAmount = ?, date = ? WHERE id = ?`,
      [
        parseInt(supplierId),
        supplierName.trim(),
        total,
        parseInt(bellNumber),
        currency.trim(),
        paid,
        date ? new Date(date) : new Date(),
        idNum
      ]
    )

    if (Array.isArray(items)) {
      await query('DELETE FROM purchase_items WHERE purchaseId = ?', [idNum])
      for (const it of items) {
        const qty = parseInt(it.quantity) || 0
        const price = parseFloat(it.price) || 0
        await query(
          `INSERT INTO purchase_items (purchaseId, productMasterId, name, type, gram, karat, quantity, remainingQty, price)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            idNum,
            null,
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
      message: 'خرید با موفقیت به‌روزرسانی شد'
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
