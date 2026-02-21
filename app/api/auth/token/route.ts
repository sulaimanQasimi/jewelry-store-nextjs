import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { query } from '@/lib/db'
import { TokenLoginSchema } from '@/lib/validations'
import { isRateLimited, recordAttempt } from '@/lib/rate-limit'

const MAX_AGE = 60 * 60 * 24 // 1 day

function getJwtSecret(): string {
  const secret = process.env.AUTH_SECRET || process.env.JWT_SECRET
  if (secret && secret.length >= 16) return secret
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      'AUTH_SECRET or JWT_SECRET missing or shorter than 16 characters. Using dev-only placeholder. Set AUTH_SECRET in .env for production.'
    )
    return 'dev-only-secret-min-16-chars'
  }
  throw new Error('AUTH_SECRET or JWT_SECRET must be set (min 16 characters)')
}

export async function POST(request: Request) {
  if (isRateLimited(request)) {
    return NextResponse.json(
      { success: false, message: 'Too many login attempts. Try again later.' },
      { status: 429 }
    )
  }
  try {
    const raw = await request.json()
    const parsed = TokenLoginSchema.safeParse(raw)
    if (!parsed.success) {
      recordAttempt(request)
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }
    const { email: loginIdentifier, password } = parsed.data

    let users: { id: unknown; username?: string; email?: string; password_hash?: string; role?: string }[]
    try {
      users = (await query(
        'SELECT id, username, email, password_hash, role FROM users WHERE (email = ? OR username = ?) AND is_active = 1 LIMIT 1',
        [loginIdentifier, loginIdentifier]
      )) as typeof users
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    if (!users || users.length === 0) {
      recordAttempt(request)
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const user = users[0]
    const hash = user.password_hash
    if (!hash || !hash.startsWith('$2')) {
      recordAttempt(request)
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }
    const valid = await bcrypt.compare(password, hash)
    if (!valid) {
      recordAttempt(request)
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const payload = {
      id: String(user.id),
      email: user.email ?? undefined,
      name: user.username ?? user.email ?? undefined,
      role: user.role ?? 'admin'
    }

    const secret = getJwtSecret()
    const token = jwt.sign(payload, secret, { expiresIn: MAX_AGE })

    return NextResponse.json({
      success: true,
      token,
      user: payload
    })
  } catch (err) {
    console.error('Token login error:', err)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
