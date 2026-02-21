import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

function getString(formData: FormData, key: string): string {
  const v = formData.get(key)
  return v != null ? String(v).trim() : ''
}

function getDate(formData: FormData, key: string): string | null {
  const v = formData.get(key)
  if (v == null || String(v).trim() === '') return null
  return String(v)
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let customerName: string
    let phone: string
    let email: string | null
    let address: string | null
    let date: Date
    let imagePath: string | null = null
    let secondaryPhone: string | null = null
    let companyName: string | null = null
    let notes: string | null = null
    let birthDate: string | null = null
    let anniversary_date: string | null = null
    let nationalId: string | null = null
    let facebookUrl: string | null = null
    let instagramUrl: string | null = null
    let whatsappUrl: string | null = null
    let telegramUrl: string | null = null

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      customerName = getString(formData, 'customerName')
      phone = getString(formData, 'phone')
      email = getString(formData, 'email') || null
      address = getString(formData, 'address') || null
      const dateVal = getString(formData, 'date')
      date = dateVal ? new Date(dateVal) : new Date()
      secondaryPhone = getString(formData, 'secondaryPhone') || null
      companyName = getString(formData, 'companyName') || null
      notes = getString(formData, 'notes') || null
      birthDate = getDate(formData, 'birthDate')
      anniversary_date = getDate(formData, 'anniversary_date')
      nationalId = getString(formData, 'nationalId') || null
      facebookUrl = getString(formData, 'facebookUrl') || null
      instagramUrl = getString(formData, 'instagramUrl') || null
      whatsappUrl = getString(formData, 'whatsappUrl') || null
      telegramUrl = getString(formData, 'telegramUrl') || null

      const imageFile = formData.get('image') as File | null
      if (imageFile && imageFile.size > 0) {
        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const uploadDir = join(process.cwd(), 'public', 'uploads')
        await mkdir(uploadDir, { recursive: true })
        const ext = (imageFile as File).name?.split('.').pop() || 'png'
        const filename = `customer-${Date.now()}.${ext}`
        imagePath = `/uploads/${filename}`
        await writeFile(join(uploadDir, filename), buffer)
      }
    } else {
      const body = await request.json()
      customerName = body.customerName?.trim() ?? ''
      phone = body.phone?.trim() ?? ''
      email = body.email?.trim() || null
      address = body.address?.trim() || null
      date = body.date ? new Date(body.date) : new Date()
      secondaryPhone = body.secondaryPhone?.trim() || null
      companyName = body.companyName?.trim() || null
      notes = body.notes?.trim() || null
      birthDate = body.birthDate || null
      anniversary_date = body.anniversary_date || body.anniversaryDate || null
      nationalId = body.nationalId?.trim() || null
      facebookUrl = body.facebookUrl?.trim() || null
      instagramUrl = body.instagramUrl?.trim() || null
      whatsappUrl = body.whatsappUrl?.trim() || null
      telegramUrl = body.telegramUrl?.trim() || null
    }

    if (!customerName || !phone) {
      return NextResponse.json({ success: false, message: 'لطفا موارد مهم را خانه پری نمایید' })
    }

    const result = (await query(
      `INSERT INTO customers (
        customerName, phone, email, address, date, image, secondaryPhone,
        companyName, notes, birthDate, anniversary_date, nationalId, facebookUrl, instagramUrl, whatsappUrl, telegramUrl
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customerName,
        phone,
        email,
        address,
        date,
        imagePath,
        secondaryPhone,
        companyName,
        notes,
        birthDate,
        anniversary_date ?? null,
        nationalId,
        facebookUrl,
        instagramUrl,
        whatsappUrl,
        telegramUrl
      ]
    )) as any

    const newCustomer = {
      id: result.insertId,
      customerName,
      phone,
      email,
      address,
      date,
      image: imagePath,
      secondaryPhone,
      companyName,
      notes,
      birthDate,
      nationalId,
      facebookUrl,
      instagramUrl,
      whatsappUrl,
      telegramUrl
    }

    return NextResponse.json({ success: true, message: 'دیتا موفقانه ثبت شد', newCustomer })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
