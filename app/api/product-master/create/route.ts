import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { name, type, gram, karat, isActive } = await request.json()

    if (!name?.trim() || !type?.trim()) {
      return NextResponse.json({ success: false, message: 'نام و نوع الزامی است' })
    }

    const g = parseFloat(gram)
    const k = parseFloat(karat)
    if (isNaN(g) || isNaN(k) || g <= 0 || k <= 0) {
      return NextResponse.json({ success: false, message: 'وزن و عیار باید عدد مثبت باشد' })
    }

    const result = (await query(
      'INSERT INTO product_masters (name, type, gram, karat, isActive) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), type.trim(), g, k, isActive !== false ? 1 : 0]
    )) as any

    return NextResponse.json({
      success: true,
      message: 'محصول اصلی با موفقیت ثبت شد',
      data: { id: result.insertId, name: name.trim(), type: type.trim(), gram: g, karat: k, isActive: isActive !== false }
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
