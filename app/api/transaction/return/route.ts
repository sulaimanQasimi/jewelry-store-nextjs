import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { spReturnProduct, parseJson } from '@/lib/db-sp'

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const transactionIdParam = searchParams.get('transactionId')
    const productIdParam = searchParams.get('productId')
    let note: string | null = null
    try {
      const body = await request.json().catch(() => ({}))
      note = typeof body.note === 'string' ? body.note.trim() || null : null
    } catch {
      // no body
    }

    if (!transactionIdParam || !productIdParam) {
      return NextResponse.json({
        success: false,
        message: 'transactionId و productId الزامی است'
      })
    }

    const transactionId = parseInt(transactionIdParam)
    const productId = parseInt(productIdParam)
    if (Number.isNaN(transactionId) || Number.isNaN(productId)) {
      return NextResponse.json({
        success: false,
        message: 'شناسه ترانسکشن یا محصول نامعتبر است'
      })
    }

    const transactions = (await query(
      'SELECT id, product, customerName, customerPhone, bellNumber FROM transactions WHERE id = ? LIMIT 1',
      [transactionId]
    )) as any[]
    const tx = transactions?.[0]
    const productJson = tx ? parseJson(tx.product) : null
    const products = Array.isArray(productJson) ? productJson : []
    const productSnapshot = products.find((p: any) => Number(p?.productId) === productId) ?? null
    const customerName = tx?.customerName ?? ''
    const customerPhone = tx?.customerPhone ?? ''
    const bellNumber = Number(tx?.bellNumber) ?? 0

    const { success, errorMsg } = await spReturnProduct(transactionId, productId)

    if (!success) {
      return NextResponse.json({
        success: false,
        message: errorMsg || 'خطا در برگشت محصول'
      })
    }

    await query(
      `INSERT INTO returns (transactionId, productId, customerName, customerPhone, bellNumber, productSnapshot, note)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        transactionId,
        productId,
        customerName,
        customerPhone,
        bellNumber,
        JSON.stringify(productSnapshot ?? { productId, note: 'returned' }),
        note
      ]
    )

    await query(
      'UPDATE transactions SET returned_count = returned_count + 1, return_status = ? WHERE id = ?',
      ['partial_return', transactionId]
    )

    const updatedRows = (await query(
      'SELECT * FROM transactions WHERE id = ? LIMIT 1',
      [transactionId]
    )) as any[]
    const updatedTransaction = updatedRows?.[0] ?? null

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
