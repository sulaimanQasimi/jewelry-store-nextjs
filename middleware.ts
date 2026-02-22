import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import authConfig from './auth.config'

const { auth } = NextAuth(authConfig)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
  'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Authorization, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, token',
}

/** Public paths: skip auth entirely so root and storefront never hit NextAuth redirect. */
function isPublicPath(pathname: string): boolean {
  const path = (pathname ?? '').trim() || '/'
  const normalized = path.replace(/\/+$/, '') || '/'
  // Root (server/proxy may send "" or "/")
  if (normalized === '/' || normalized === '') return true
  // Optional base path when app is served at e.g. /app (set BASE_PATH on server)
  const basePath = (process.env.BASE_PATH || process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/+$/, '')
  if (basePath && (normalized === basePath || normalized === `${basePath}/`)) return true
  if (normalized === '/login' || normalized === '/about' || normalized === '/contact') return true
  if (normalized === '/shop' || normalized.startsWith('/shop/')) return true
  if (normalized.startsWith('/api/auth') || normalized.startsWith('/_next')) return true
  return false
}

function getPathname(request: NextRequest): string {
  const fromNext = request.nextUrl?.pathname ?? ''
  if (fromNext !== '' && fromNext !== undefined) return fromNext
  try {
    const fromUrl = new URL(request.url).pathname || '/'
    return fromUrl
  } catch {
    return '/'
  }
}

export default async function middleware(request: NextRequest) {
  // CORS preflight: return 204 immediately so Flutter web cross-origin requests succeed
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: corsHeaders })
  }
  // Use both nextUrl.pathname and request.url pathname (can differ behind proxy on server)
  const pathname = getPathname(request)
  const urlPathname = (() => {
    try {
      return new URL(request.url).pathname || '/'
    } catch {
      return '/'
    }
  })()
  const publicAccess = isPublicPath(pathname) || isPublicPath(urlPathname)
  if (process.env.DEBUG_AUTH_PATH === '1') {
    console.log('[middleware] pathname:', JSON.stringify(pathname), 'urlPathname:', JSON.stringify(urlPathname), 'public:', publicAccess)
  }
  if (publicAccess) {
    return NextResponse.next()
  }
  return auth(request as any, {} as any)
}

export const config = {
  matcher: [
    // Explicitly match root so middleware always runs for "" or "/"
    '/',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
