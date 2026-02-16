import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const companyName = (formData.get('companyName') as string)?.trim() ?? ''
    const slogan = (formData.get('slogan') as string)?.trim() || null
    const phone = (formData.get('phone') as string)?.trim() ?? ''
    const email = (formData.get('email') as string)?.trim() || null
    const address = (formData.get('address') as string)?.trim() ?? ''
    const dateVal = formData.get('date') as string | null
    const date = dateVal ? new Date(dateVal) : null
    const imageFile = formData.get('image') as File | null

    if (!companyName || !phone || !address) {
      return NextResponse.json({ success: false, message: 'لطفا موارد مهم را خانه پری نمایید' })
    }

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
      `INSERT INTO companies (companyName, slogan, phone, email, address, date, image)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [companyName, slogan, phone, email, address, date, imagePath]
    )

    const companyInformation = {
      companyName,
      slogan,
      phone,
      email,
      address,
      date,
      image: imagePath
    }

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
