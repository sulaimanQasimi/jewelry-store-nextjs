import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { isSold } = await request.json()

    const products = (await query(
      'SELECT * FROM products WHERE id = ? LIMIT 1',
      [parseInt(id)]
    )) as any[]
    const productIsSold = products?.[0]

    if (!productIsSold) {
      return NextResponse.json({ success: false, message: 'جنس پیدا نشد' })
    }

    if (productIsSold.isSold === isSold) {
      return NextResponse.json({
        message: `محصول قبلاً ${isSold ? 'فروخته شده' : 'موجود'} است`
      })
    }

    await query(
      'UPDATE products SET isSold = ? WHERE id = ?',
      [isSold ? 1 : 0, parseInt(id)]
    )

    const updated = (await query(
      'SELECT * FROM products WHERE id = ? LIMIT 1',
      [parseInt(id)]
    )) as any[]
    const updatedProduct = updated?.[0]

    return NextResponse.json({
      success: true,
      message: 'وضعیت موفقانه تغیر خورده است',
      productIsSold: updatedProduct
    })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
