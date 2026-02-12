import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const all = await prisma.expenses.findMany({
      orderBy: { date: 'desc' }
    })

    if (all.length === 0) {
      return NextResponse.json({ success: false, message: 'دیتا وجود ندارد' })
    }

    // Calculate totals by currency
    const totals = all.reduce((acc: any, expense) => {
      if (!acc[expense.currency]) {
        acc[expense.currency] = { currency: expense.currency, price: 0 }
      }
      acc[expense.currency].price += expense.price
      return acc
    }, {})

    const total = Object.values(totals)

    return NextResponse.json({ success: true, all, total })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
