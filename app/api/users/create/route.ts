import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { auth } from '@/auth'
import { query } from '@/lib/db'
import { CreateUserSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const currentUser = session?.user as { id?: string; role?: string } | undefined
    if (!currentUser?.role || currentUser.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    const raw = await request.json()
    const parsed = CreateUserSchema.safeParse(raw)
    if (!parsed.success) {
      const msg = parsed.error.errors[0]?.message ?? 'نام کاربری، ایمیل و رمز عبور الزامی است'
      return NextResponse.json({ success: false, message: msg }, { status: 400 })
    }
    const { username: usernameTrim, email: emailTrim, password, role: validRole } = parsed.data

    const existing = (await query(
      'SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1',
      [usernameTrim, emailTrim]
    )) as any[]
    if (existing?.length) {
      return NextResponse.json(
        { success: false, message: 'نام کاربری یا ایمیل قبلاً استفاده شده است' },
        { status: 400 }
      )
    }

    const password_hash = await bcrypt.hash(String(password), 10)

    const result = (await query(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [usernameTrim, emailTrim, password_hash, validRole]
    )) as any

    return NextResponse.json({
      success: true,
      message: 'کاربر با موفقیت ایجاد شد',
      data: {
        id: result.insertId,
        username: usernameTrim,
        email: emailTrim,
        role: validRole
      }
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
