import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const products = await query(
      'SELECT * FROM products WHERE isSold = ? ORDER BY createdAt DESC',
      [false]
    ) as any[]

    if (!products || products.length === 0) {
      return NextResponse.json({ success: false, message: 'هیچ دیتایی وجود ندارد' })
    }

    return NextResponse.json({ success: true, products })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
