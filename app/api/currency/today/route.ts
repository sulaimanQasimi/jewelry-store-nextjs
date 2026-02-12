import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const today = new Date().toISOString().split('T')[0]

    const rate = await prisma.currencyRate.findUnique({
      where: { date: today }
    })

    if (!rate) {
      return NextResponse.json({ success: false, message: 'نرخ را تعیین کنید' })
    }

    return NextResponse.json({ success: true, rate })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { usdToAfn } = await request.json()
    const today = new Date().toISOString().split('T')[0]

    const rate = await prisma.currencyRate.upsert({
      where: { date: today },
      update: { usdToAfn },
      create: { date: today, usdToAfn }
    })

    return NextResponse.json({ success: true, rate })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
