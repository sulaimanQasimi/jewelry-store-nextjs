import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { name, phone } = await request.json()

    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json({ success: false, message: 'نام و شماره تماس الزامی است' })
    }

    const result = (await query(
      'INSERT INTO persons (name, phone) VALUES (?, ?)',
      [name.trim(), phone.trim()]
    )) as any

    return NextResponse.json({
      success: true,
      message: 'شخص با موفقیت ثبت شد',
      data: { id: result.insertId, name: name.trim(), phone: phone.trim() }
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
