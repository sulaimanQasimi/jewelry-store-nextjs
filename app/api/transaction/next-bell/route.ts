import { NextResponse } from 'next/server'
import { fnNextBellNumber } from '@/lib/db-sp'

export async function GET() {
  try {
    const nextNum = await fnNextBellNumber()
    return NextResponse.json({ success: true, nextBellNumber: nextNum })
  } catch (error: unknown) {
    console.error('next-bell error:', error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'خطا در دریافت شماره بل' },
      { status: 500 }
    )
  }
}
