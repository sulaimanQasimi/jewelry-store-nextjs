import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

const MANUAL_PRODUCT_MASTER_NAME = 'دستی'
const MANUAL_PRODUCT_MASTER_TYPE = 'سایر'

/** Get or create the default "manual" product master used when no product master is selected. */
async function getOrCreateManualProductMasterId(): Promise<number> {
  const existing = (await query(
    'SELECT id FROM product_masters WHERE name = ? AND type = ? LIMIT 1',
    [MANUAL_PRODUCT_MASTER_NAME, MANUAL_PRODUCT_MASTER_TYPE]
  )) as any[]
  if (existing?.length > 0 && existing[0].id) {
    return Number(existing[0].id)
  }
  const insert = (await query(
    'INSERT INTO product_masters (name, type, gram, karat, isActive) VALUES (?, ?, ?, ?, ?)',
    [MANUAL_PRODUCT_MASTER_NAME, MANUAL_PRODUCT_MASTER_TYPE, 0.01, 1, 1]
  )) as any
  return Number(insert.insertId)
}

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
    const manualProductMasterId = await getOrCreateManualProductMasterId()

    if (Array.isArray(items) && items.length > 0) {
      for (const it of items) {
        const qty = parseInt(it.quantity) || 0
        const price = parseFloat(it.price) || 0
        const productMasterId = it.productMasterId ? parseInt(it.productMasterId) : manualProductMasterId
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
