import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      supplierId,
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
      detail
    } = body

    if (!supplierId || !name || !karat || !weight || pasa == null || !wagePerGram || !totalWage) {
      return NextResponse.json({
        success: false,
        message: 'لطفا موارد مهم را وارد کنید'
      })
    }

    const suppliers = await query(
      'SELECT id, name FROM suppliers WHERE id = ?',
      [Number(supplierId)]
    ) as any[]

    if (!suppliers || suppliers.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'تمویل‌کننده یافت نشد'
      })
    }

    const supplierName = suppliers[0].name

    const result = await query(
      `INSERT INTO supplier_products (
        supplierId, supplierName, name, type, karat, weight,
        pasa, pasaReceipt, pasaRemaining, wagePerGram, totalWage,
        wageReceipt, wageRemaining, detail
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        Number(supplierId),
        supplierName,
        name,
        type || null,
        karat != null ? Number(karat) : null,
        Number(weight),
        Number(pasa),
        Number(pasaReceipt) || 0,
        Number(pasaRemaining),
        wagePerGram != null ? Number(wagePerGram) : null,
        Number(totalWage),
        Number(wageReceipt) || 0,
        Number(wageRemaining),
        detail || null
      ]
    ) as any

    const newProduct = {
      id: result.insertId,
      supplierId: Number(supplierId),
      supplierName,
      name,
      type: type || null,
      karat: karat != null ? Number(karat) : null,
      weight: Number(weight),
      pasa: Number(pasa),
      pasaReceipt: Number(pasaReceipt) || 0,
      pasaRemaining: Number(pasaRemaining),
      wagePerGram: wagePerGram != null ? Number(wagePerGram) : null,
      totalWage: Number(totalWage),
      wageReceipt: Number(wageReceipt) || 0,
      wageRemaining: Number(wageRemaining),
      detail: detail || null
    }

    return NextResponse.json({
      success: true,
      message: 'محصول تمویل‌کننده با موفقیت ثبت شد',
      data: newProduct
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
