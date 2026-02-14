import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { writeFile } from 'fs/promises'
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    const { customerId } = await params
    const id = parseInt(customerId, 10)
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: 'مشتری انتخاب نشد' }, { status: 400 })
    }

    const contentType = request.headers.get('content-type') || ''
    let customerName: string
    let phone: string
    let email: string | null
    let address: string | null
    let imagePath: string | null = undefined as any
    let secondaryPhone: string | null
    let companyName: string | null
    let notes: string | null
    let birthDate: string | null
    let nationalId: string | null
    let facebookUrl: string | null
    let instagramUrl: string | null
    let whatsappUrl: string | null
    let telegramUrl: string | null

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      customerName = getString(formData, 'customerName')
      phone = getString(formData, 'phone')
      email = getString(formData, 'email') || null
      address = getString(formData, 'address') || null
      secondaryPhone = getString(formData, 'secondaryPhone') || null
      companyName = getString(formData, 'companyName') || null
      notes = getString(formData, 'notes') || null
      birthDate = getDate(formData, 'birthDate')
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
        const filename = `customer-${Date.now()}-${(imageFile as File).name}`
        imagePath = `/uploads/${filename}`
        await writeFile(join(uploadDir, filename), buffer)
      }
    } else {
      const body = await request.json()
      customerName = body.customerName?.trim() ?? ''
      phone = body.phone?.trim() ?? ''
      email = body.email?.trim() || null
      address = body.address?.trim() || null
      secondaryPhone = body.secondaryPhone?.trim() || null
      companyName = body.companyName?.trim() || null
      notes = body.notes?.trim() || null
      birthDate = body.birthDate || null
      nationalId = body.nationalId?.trim() || null
      facebookUrl = body.facebookUrl?.trim() || null
      instagramUrl = body.instagramUrl?.trim() || null
      whatsappUrl = body.whatsappUrl?.trim() || null
      telegramUrl = body.telegramUrl?.trim() || null
    }

    const existing = (await query('SELECT id, image FROM customers WHERE id = ?', [id])) as any[]
    if (!existing || existing.length === 0) {
      return NextResponse.json({ success: false, message: 'مشتری یافت نشد' }, { status: 404 })
    }

    let finalImage: string | null
    if (imagePath !== undefined) {
      finalImage = imagePath
    } else {
      finalImage = existing[0].image ?? null
    }

    await query(
      `UPDATE customers SET
       customerName = ?, phone = ?, email = ?, address = ?,
       image = ?, secondaryPhone = ?, companyName = ?, notes = ?, birthDate = ?, nationalId = ?,
       facebookUrl = ?, instagramUrl = ?, whatsappUrl = ?, telegramUrl = ?
       WHERE id = ?`,
      [
        customerName,
        phone,
        email,
        address,
        finalImage,
        secondaryPhone,
        companyName,
        notes,
        birthDate,
        nationalId,
        facebookUrl,
        instagramUrl,
        whatsappUrl,
        telegramUrl,
        id
      ]
    )

    const updated = (await query(
      'SELECT id, customerName, phone, email, address, date, image, secondaryPhone, companyName, notes, birthDate, nationalId, facebookUrl, instagramUrl, whatsappUrl, telegramUrl FROM customers WHERE id = ?',
      [id]
    )) as any[]

    return NextResponse.json({
      success: true,
      message: 'اطلاعات مشتری آپدیت شد',
      newUpdatedCustomer: updated?.[0]
    })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
