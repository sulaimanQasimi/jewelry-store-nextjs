import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const companyName = formData.get('companyName') as string
    const slogan = formData.get('slogan') as string | null
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string | null
    const address = formData.get('address') as string
    const date = formData.get('date') ? new Date(formData.get('date') as string) : null
    const imageFile = formData.get('image') as File | null

    if (!companyName || !phone || !address) {
      return NextResponse.json({ success: false, message: 'لطفا موارد مهم را خانه پری نمایید' })
    }

    let imagePath: string | null = null

    if (imageFile) {
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const uploadDir = join(process.cwd(), 'public', 'uploads')
      const filename = `${Date.now()}-${imageFile.name}`
      imagePath = `/uploads/${filename}`
      
      // Ensure directory exists (simplified - in production use mkdir -p)
      await writeFile(join(uploadDir, filename), buffer)
    }

    const companyInformation = {
      companyName,
      slogan,
      phone,
      email,
      address,
      date,
      image: imagePath
    }

    const newInfo = await prisma.company.create({
      data: companyInformation
    })

    return NextResponse.json({
      success: true,
      message: 'اطلاعات شرکت موفقانه ویرایش شد',
      data: { company: companyInformation }
    })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
