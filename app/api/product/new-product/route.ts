import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
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
    const bellNumber = formData.get('bellNumber') ? parseInt(formData.get('bellNumber') as string) : null
    const wage = parseFloat(formData.get('wage') as string)
    const auns = parseFloat(formData.get('auns') as string)
    const imageFile = formData.get('image') as File | null

    if (!gram || !karat || !wage || !auns) {
      return NextResponse.json({ success: false, message: 'لطفا موارد مهم را برسانید' })
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

    const today = new Date().toISOString().split('T')[0]
    const rate = await prisma.currencyRate.findUnique({
      where: { date: today }
    })

    if (!rate) {
      return NextResponse.json({
        success: false,
        message: 'نرخ امروز دالر ثبت نشده'
      })
    }

    const purchase = (Number(auns / 12.15 / 24) * (Number(karat) + 0.12) + Number(wage)) * Number(rate.usdToAfn) * Number(gram)

    const newProduct = await prisma.product.create({
      data: {
        productName,
        type,
        gram,
        karat,
        purchasePriceToAfn: purchase,
        bellNumber,
        isSold: false,
        barcode,
        image: imagePath,
        wage,
        auns
      }
    })

    return NextResponse.json({
      success: true,
      message: 'دیتا موفقانه ثبت شد',
      newProduct
    })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({
      success: false,
      message: error.message
    })
  }
}
