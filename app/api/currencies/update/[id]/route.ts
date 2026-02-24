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
    const { code, name_fa, symbol, rate, is_default, active, sort_order } = body

    if (!code?.trim() || !name_fa?.trim()) {
      return NextResponse.json(
        { success: false, message: 'کد و نام فارسی ارز الزامی است' },
        { status: 400 }
      )
    }

    const codeTrim = String(code).trim().toUpperCase()
    const nameFaTrim = String(name_fa).trim()
    const symbolVal = symbol != null ? String(symbol).trim() || null : null
    const rateVal = rate != null && rate !== '' ? parseFloat(String(rate)) : null
    const isDefault = is_default === true || is_default === 1 ? 1 : 0
    const activeVal = active === false || active === 0 ? 0 : 1
    const sortOrder = typeof sort_order === 'number' ? sort_order : parseInt(String(sort_order ?? 0), 10) || 0

    if (isDefault) {
      await query('UPDATE currencies SET is_default = 0 WHERE id != ?', [id])
    }

    await query(
      `UPDATE currencies SET code = ?, name_fa = ?, symbol = ?, rate = ?, is_default = ?, active = ?, sort_order = ?
       WHERE id = ?`,
      [codeTrim, nameFaTrim, symbolVal, rateVal, isDefault, activeVal, sortOrder, id]
    )

    return NextResponse.json({
      success: true,
      message: 'ارز با موفقیت به‌روزرسانی شد'
    })
  } catch (error: unknown) {
    console.error(error)
    const message = error instanceof Error ? error.message : 'خطا'
    if (String(message).includes('Duplicate') || String(message).includes('UNIQUE')) {
      return NextResponse.json({ success: false, message: 'این کد ارز قبلاً ثبت شده است' }, { status: 400 })
    }
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    )
  }
}
