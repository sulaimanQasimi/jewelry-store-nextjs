import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { query } from '@/lib/db'
import { z } from 'zod'

const SignupSchema = z.object({
  username: z.string().min(1, 'نام کاربری الزامی است').max(100).transform((s) => s.trim()),
  email: z.string().email('ایمیل معتبر نیست').max(255).transform((s) => s.trim()),
  password: z.string().min(8, 'رمز عبور حداقل ۸ کاراکتر باشد').max(128)
})

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json()
    const parsed = SignupSchema.safeParse(raw)
    if (!parsed.success) {
      const msg = parsed.error.errors[0]?.message ?? 'نام کاربری، ایمیل و رمز عبور الزامی است'
      return NextResponse.json({ success: false, message: msg }, { status: 400 })
    }
    const { username: usernameTrim, email: emailTrim, password } = parsed.data

    const existing = (await query(
      'SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1',
      [usernameTrim, emailTrim]
    )) as { id: number }[]
    if (existing?.length) {
      return NextResponse.json(
        { success: false, message: 'نام کاربری یا ایمیل قبلاً استفاده شده است' },
        { status: 400 }
      )
    }

    const password_hash = await bcrypt.hash(String(password), 10)

    const result = (await query(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [usernameTrim, emailTrim, password_hash, 'user']
    )) as { insertId: number }

    return NextResponse.json({
      success: true,
      message: 'ثبت‌نام با موفقیت انجام شد. اکنون می‌توانید وارد شوید.',
      data: {
        id: result.insertId,
        username: usernameTrim,
        email: emailTrim,
        role: 'user'
      }
    })
  } catch (error: unknown) {
    console.error('[signup]', error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'خطا در ثبت‌نام' },
      { status: 500 }
    )
  }
}
