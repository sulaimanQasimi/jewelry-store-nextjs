import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
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
    const sortOrder = typeof sort_order === 'number' ? sort_order : parseInt(String(sort_order || 0), 10) || 0

    if (isDefault) {
      await query('UPDATE currencies SET is_default = 0')
    }

    const result = (await query(
      'INSERT INTO currencies (code, name_fa, symbol, rate, is_default, active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [codeTrim, nameFaTrim, symbolVal, rateVal, isDefault, activeVal, sortOrder]
    )) as { insertId: number }

    return NextResponse.json({
      success: true,
      message: 'ارز با موفقیت اضافه شد',
      data: { id: result.insertId, code: codeTrim, name_fa: nameFaTrim, symbol: symbolVal, rate: rateVal, is_default: isDefault, active: activeVal, sort_order: sortOrder }
    })
  } catch (error: unknown) {
    console.error(error)
    const message = error instanceof Error ? error.message : 'خطا'
    if (String(message).includes('Duplicate') || String(message).includes('UNIQUE')) {
      return NextResponse.json({ success: false, message: 'این کد ارز قبلاً ثبت شده است' }, { status: 400 })
    }
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
