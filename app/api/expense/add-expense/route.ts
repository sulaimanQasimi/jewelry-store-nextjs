import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { type, detail, price, currency, date } = await request.json()

    if (!type || !detail || !price || !currency) {
      return NextResponse.json({ success: false, message: 'لطفا خانه های خالی را پر نمایید' })
    }

    const expense = await prisma.expenses.create({
      data: {
        type,
        detail,
        price,
        currency,
        date: date ? new Date(date) : new Date()
      }
    })

    return NextResponse.json({ success: true, message: 'دیتا موفقانه ثبت شد' })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
