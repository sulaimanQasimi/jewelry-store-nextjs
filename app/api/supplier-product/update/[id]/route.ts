import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam, 10)
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: 'شناسه نامعتبر' }, { status: 400 })
    }

    const body = await request.json()
    const {
      supplierId,
      supplierName,
      name,
      type,
      karat,
      weight,
      pasa,
      pasaReceipt,
      pasaRemaining,
      wagePerGram,
      totalWage,
      wageReceipt,
      wageRemaining,
      detail,
      bellNumber
    } = body

    if (!name || weight == null || pasa == null || totalWage == null) {
      return NextResponse.json({
        success: false,
        message: 'لطفا نام، وزن، پاسه و مجموع وجوره را وارد کنید'
      }, { status: 400 })
    }

    let finalSupplierId = Number(supplierId)
    let finalSupplierName = supplierName
    if (supplierId != null) {
      const suppliers = (await query(
        'SELECT id, name FROM suppliers WHERE id = ?',
        [Number(supplierId)]
      )) as { id: number; name: string }[]
      if (suppliers?.length) {
        finalSupplierName = suppliers[0].name
        finalSupplierId = suppliers[0].id
      }
    }

    await query(
      `UPDATE supplier_products SET
        supplierId = ?, supplierName = ?, name = ?, type = ?, karat = ?, weight = ?,
        pasa = ?, pasaReceipt = ?, pasaRemaining = ?, wagePerGram = ?, totalWage = ?,
        wageReceipt = ?, wageRemaining = ?, detail = ?, bellNumber = ?
       WHERE id = ?`,
      [
        finalSupplierId,
        finalSupplierName ?? '',
        name,
        type || null,
        karat != null ? Number(karat) : null,
        Number(weight),
        Number(pasa),
        Number(pasaReceipt) ?? 0,
        Number(pasaRemaining),
        wagePerGram != null ? Number(wagePerGram) : null,
        Number(totalWage),
        Number(wageReceipt) ?? 0,
        Number(wageRemaining),
        detail || null,
        bellNumber != null ? Number(bellNumber) : null,
        id
      ]
    )

    return NextResponse.json({
      success: true,
      message: 'جنس تمویل با موفقیت به‌روزرسانی شد'
    })
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'خطا' },
      { status: 500 }
    )
  }
}
