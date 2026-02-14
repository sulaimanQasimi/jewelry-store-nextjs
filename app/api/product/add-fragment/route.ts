import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { generateBarcode } from '@/lib/utils'
import { writeFile } from 'fs/promises'
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

    if (imageFile) {
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const uploadDir = join(process.cwd(), 'public', 'uploads')
      const filename = `${Date.now()}-${imageFile.name}`
      imagePath = `/uploads/${filename}`
      await writeFile(join(uploadDir, filename), buffer)
    }

    const newProduct = await prisma.product.create({
      data: {
        productName,
        type,
        gram,
        karat,
        purchasePriceToAfn: purchase,
        isSold: false,
        image: imagePath,
        barcode,
        isFragment: true
      }
    })

    return NextResponse.json({ success: true, message: 'جنس ثبت شد' })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
