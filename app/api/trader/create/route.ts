import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { name, phone, address } = await request.json()

    if (!name || !phone) {
      return NextResponse.json({ success: false, message: 'لطفا نام و شماره تماس را وارد کنید' })
    }

    const result = (await query(
      'INSERT INTO traders (name, phone, address) VALUES (?, ?, ?)',
      [name, phone, address || null]
    )) as any

    return NextResponse.json({
      success: true,
      message: 'معامله‌دار با موفقیت ثبت شد',
      data: { id: result.insertId, name, phone, address: address || null }
    })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
