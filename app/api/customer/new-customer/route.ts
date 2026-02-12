import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { customerName, phone, email, address, date } = await request.json()

    if (!customerName || !phone) {
      return NextResponse.json({ success: false, message: 'لطفا موارد مهم را خانه پری نمایید' })
    }

    const result = await query(
      'INSERT INTO customers (customerName, phone, email, address, date) VALUES (?, ?, ?, ?, ?)',
      [customerName, phone, email || null, address || null, date ? new Date(date) : new Date()]
    ) as any

    const newCustomer = {
      id: result.insertId,
      customerName,
      phone,
      email: email || null,
      address: address || null,
      date: date ? new Date(date) : new Date()
    }

    return NextResponse.json({ success: true, message: 'دیتا موفقانه ثبت شد', newCustomer })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
