import type { NextAuthConfig } from 'next-auth'
import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const DEV_PLACEHOLDER_SECRET = 'dev-only-secret-min-16-chars'

function getAuthSecret(): Uint8Array {
  let secret = process.env.AUTH_SECRET || process.env.JWT_SECRET
  if (!secret || secret.length < 16) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'AUTH_SECRET or JWT_SECRET missing or too short. Using dev-only placeholder. Set AUTH_SECRET in .env for production.'
      )
      secret = DEV_PLACEHOLDER_SECRET
    } else {
      throw new Error(
        'AUTH_SECRET or JWT_SECRET must be set in environment (min 16 characters). Do not use default secrets in production.'
      )
    }
  }
  return new TextEncoder().encode(secret)
}

async function verifyBearerToken(request: Request): Promise<boolean> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return false
  const token = authHeader.slice(7)
  if (!token) return false
  try {
    const JWT_SECRET = getAuthSecret()
    await jwtVerify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

function getSecretForNextAuth(): string {
  const secret = process.env.AUTH_SECRET || process.env.JWT_SECRET
  if (secret && secret.length >= 16) return secret
  if (process.env.NODE_ENV === 'development') return DEV_PLACEHOLDER_SECRET
  throw new Error('AUTH_SECRET or JWT_SECRET must be set (min 16 characters)')
}

export default {
  secret: getSecretForNextAuth(),
  trustHost: true,
  providers: [],
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 // 1 day
  },
  callbacks: {
    async authorized({ auth: session, request }) {
      const { pathname } = request.nextUrl
      // Allow CORS preflight (OPTIONS) without auth - required for cross-origin Flutter web
      if (request.method === 'OPTIONS') return true
      if (pathname === '/' || pathname === '/login') return true
      if (pathname.startsWith('/api/auth')) return true
      if (pathname.startsWith('/_next')) return true
      if (pathname.startsWith('/api/')) {
        const bearerValid = await verifyBearerToken(request)
        if (bearerValid) return true
        if (!session?.user) {
          return NextResponse.json(
            { success: false, message: 'Not Authorized Login Again' },
            { status: 401 }
          )
        }
        return true
      }
      if (!session?.user) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
        token.name = user.name
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string; role?: string }).id = token.id as string
        (session.user as { id?: string; role?: string }).role = token.role as string
      }
      return session
    }
  }
} satisfies NextAuthConfig
