import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const daily = await prisma.expenses.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      orderBy: { date: 'desc' }
    })

    if (daily.length === 0) {
      return NextResponse.json({ success: false, message: 'دیتا وجود ندارد' })
    }

    // Calculate totals by currency
    const totals = daily.reduce((acc: any, expense) => {
      if (!acc[expense.currency]) {
        acc[expense.currency] = { currency: expense.currency, price: 0 }
      }
      acc[expense.currency].price += expense.price
      return acc
    }, {})

    const total = Object.values(totals)

    return NextResponse.json({ success: true, daily, total })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
