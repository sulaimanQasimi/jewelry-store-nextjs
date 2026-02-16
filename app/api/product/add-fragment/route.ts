import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { generateBarcode } from '@/lib/utils'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const productName = formData.get('productName') as string
    const type = formData.get('type') as string
    const gram = parseFloat(formData.get('gram') as string)
    const karat = parseFloat(formData.get('karat') as string)
    const purchase = parseFloat(formData.get('purchase') as string)
    const imageFile = formData.get('image') as File | null

    if (productName === '' || type === '' || !gram || !karat || !purchase) {
      return NextResponse.json({ success: false, message: 'لطفا موارد مهم را وارد کنید' })
    }

    const barcode = generateBarcode()
    let imagePath: string | null = null

    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const uploadDir = join(process.cwd(), 'public', 'uploads')
      await mkdir(uploadDir, { recursive: true })
      const filename = `${Date.now()}-${(imageFile.name || 'image').replace(/[^a-zA-Z0-9.-]/g, '_')}`
      imagePath = `/uploads/${filename}`
      await writeFile(join(uploadDir, filename), buffer)
    }

    await query(
      `INSERT INTO products (productName, type, gram, karat, purchasePriceToAfn, isSold, image, barcode, isFragment)
       VALUES (?, ?, ?, ?, ?, 0, ?, ?, 1)`,
      [productName, type, gram, karat, purchase, imagePath ?? null, barcode]
    )

    return NextResponse.json({ success: true, message: 'جنس ثبت شد' })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
