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

        let users: { id: unknown; username?: string; email?: string; password_hash?: string; role?: string }[]
        try {
          users = (await query(
            'SELECT id, username, email, password_hash, role FROM users WHERE (email = ? OR username = ?) AND is_active = 1 LIMIT 1',
            [loginIdentifier, loginIdentifier]
          )) as typeof users
        } catch {
          return null
        }

        if (!users || users.length === 0) return null
        const user = users[0]
        const hash = user.password_hash
        if (!hash || !hash.startsWith('$2')) return null
        const valid = await bcrypt.compare(password, hash)
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
