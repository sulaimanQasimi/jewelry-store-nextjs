import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { customerName, phone, email, address, date } = await request.json()

    if (!customerName || !phone) {
      return NextResponse.json({ success: false, message: 'لطفا موارد مهم را خانه پری نمایید' })
    }

    const customer = {
      customerName,
      phone,
      email: email || null,
      address: address || null,
      date: date ? new Date(date) : new Date()
    }

    const newCustomer = await prisma.customer.create({
      data: customer
    })

    return NextResponse.json({ success: true, message: 'دیتا موفقانه ثبت شد', newCustomer })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
