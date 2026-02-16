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

    const { name, type, gram, karat, isActive } = await request.json()

    if (!name?.trim() || !type?.trim()) {
      return NextResponse.json({ success: false, message: 'نام و نوع الزامی است' }, { status: 400 })
    }

    const g = parseFloat(gram)
    const k = parseFloat(karat)
    if (isNaN(g) || isNaN(k) || g <= 0 || k <= 0) {
      return NextResponse.json({ success: false, message: 'وزن و عیار باید عدد مثبت باشد' })
    }

    await query(
      'UPDATE product_masters SET name = ?, type = ?, gram = ?, karat = ?, isActive = ? WHERE id = ?',
      [name.trim(), type.trim(), g, k, isActive !== false ? 1 : 0, idNum]
    )

    return NextResponse.json({
      success: true,
      message: 'محصول اصلی با موفقیت به‌روزرسانی شد'
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
