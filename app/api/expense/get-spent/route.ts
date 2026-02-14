import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const spent = (await query(
      'SELECT * FROM expenses ORDER BY date DESC, id DESC'
    )) as any[]

    return NextResponse.json({ success: true, spent: spent ?? [] })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
