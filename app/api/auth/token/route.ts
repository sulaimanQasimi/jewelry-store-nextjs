import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { query } from '@/lib/db'

const JWT_SECRET = process.env.AUTH_SECRET || process.env.JWT_SECRET || 'galaxy'
const MAX_AGE = 60 * 60 * 24 // 1 day

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const loginIdentifier = body?.email?.trim?.()
    const password = body?.password

    if (!loginIdentifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    let users: any[]
    let useHash = true
    try {
      users = (await query(
        'SELECT id, username, email, password_hash, role FROM users WHERE (email = ? OR username = ?) AND is_active = 1 LIMIT 1',
        [loginIdentifier, loginIdentifier]
      )) as any[]
    } catch (e: any) {
      if (e?.message?.includes('password_hash') || e?.code === 'ER_BAD_FIELD_ERROR') {
        useHash = false
        users = (await query(
          'SELECT id, username, email, password AS password_hash FROM users WHERE (email = ? OR username = ?) LIMIT 1',
          [loginIdentifier, loginIdentifier]
        )) as any[]
      } else {
        throw e
      }
    }

    if (!users || users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const user = users[0]
    let valid: boolean
    if (useHash && user.password_hash?.startsWith('$2')) {
      valid = await bcrypt.compare(password, user.password_hash)
    } else {
      valid = password === (user.password_hash ?? user.password)
    }

    if (!valid) {
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

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: MAX_AGE })

    return NextResponse.json({
      success: true,
      token,
      user: payload
    })
  } catch (error: any) {
    console.error('Token login error:', error)
    return NextResponse.json(
      { success: false, message: error?.message || 'Server error' },
      { status: 500 }
    )
  }
}
