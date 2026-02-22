import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { query } from '@/lib/db'
import authConfig from './auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email / Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const loginIdentifier = String(credentials.email).trim()
        const password = String(credentials.password)

        let rows: Record<string, unknown>[]
        try {
          rows = (await query(
            'SELECT id, username, email, password_hash, role FROM users WHERE (email = ? OR username = ?) AND is_active = 1 LIMIT 1',
            [loginIdentifier, loginIdentifier]
          )) as Record<string, unknown>[]
        } catch (e) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[auth] Credentials authorize DB error:', e)
          }
          return null
        }

        if (!rows?.length) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[auth] Credentials: no user found for', loginIdentifier)
          }
          return null
        }
        const row = rows[0]
        // Support different column casing from MySQL (password_hash, Password_hash, etc.)
        const hashRaw = row.password_hash ?? row.Password_hash
        const hash = typeof hashRaw === 'string' ? hashRaw : null
        if (!hash || !hash.startsWith('$2')) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[auth] Credentials: no valid bcrypt hash for user')
          }
          return null
        }
        const valid = await bcrypt.compare(password, hash)
        if (!valid) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[auth] Credentials: invalid password for', loginIdentifier)
          }
          return null
        }

        return {
          id: String(row.id),
          email: (row.email as string) ?? undefined,
          name: (row.username as string) ?? (row.email as string) ?? undefined,
          role: (row.role as string) ?? 'admin'
        }
      }
    })
  ]
})
