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

        if (!users || users.length === 0) return null
        const user = users[0]

        let valid: boolean
        if (useHash && user.password_hash?.startsWith('$2')) {
          valid = await bcrypt.compare(password, user.password_hash)
        } else {
          valid = password === (user.password_hash ?? user.password)
        }
        if (!valid) return null

        return {
          id: String(user.id),
          email: user.email ?? undefined,
          name: user.username ?? user.email ?? undefined,
          role: user.role ?? 'admin'
        }
      }
    })
  ]
})
