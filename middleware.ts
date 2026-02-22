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

/** True if path is root (any variant: "", "/", "//", /index, encoded, etc.). */
function isRootPath(pathname: string): boolean {
  if (pathname == null) return true
  let s = String(pathname).trim()
  try {
    if (s.includes('%')) s = decodeURIComponent(s).trim()
  } catch {
    // ignore
  }
  if (s === '' || s === '/') return true
  // Any path that has no "content" segments is root (handles "//", "///", trailing slashes, proxy oddities)
  const segments = s.split('/').filter(Boolean)
  if (segments.length === 0) return true
  const lower = s.toLowerCase()
  if (lower === '/index' || lower === '/index.html' || lower === '/index.htm') return true
  return false
}

/** Public paths: skip auth entirely so root and storefront never hit NextAuth redirect. */
function isPublicPath(pathname: string): boolean {
  const path = (pathname ?? '').trim() || '/'
  const normalized = path.replace(/\/+$/, '') || '/'
  if (isRootPath(normalized) || isRootPath(path)) return true
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

/** Normalize path for comparison: strip query/fragment, collapse slashes, lowercase index variants. */
function toNormalPath(p: string): string {
  let s = (p ?? '').trim()
  try {
    if (s.includes('%')) s = decodeURIComponent(s)
  } catch {
    // ignore
  }
  s = s.replace(/\?.*$/, '').replace(/#.*$/, '').trim() || '/'
  s = '/' + s.replace(/^\/+|\/+$/g, '').replace(/\/+/g, '/') || '/'
  return s === '' ? '/' : s
}

export default async function middleware(request: NextRequest) {
  // CORS preflight: return 204 immediately so Flutter web cross-origin requests succeed
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: corsHeaders })
  }
  const pathname = getPathname(request)
  let urlPathname = '/'
  try {
    urlPathname = new URL(request.url).pathname || '/'
  } catch {
    // keep '/'
  }
  // Root: allow immediately without ever calling auth (handles all server/proxy variants)
  if (isRootPath(pathname) || isRootPath(urlPathname)) {
    return NextResponse.next()
  }
  const publicAccess = isPublicPath(pathname) || isPublicPath(urlPathname)
  // Final safety: never send root to auth (handles server/proxy path quirks)
  const normalPath = toNormalPath(pathname)
  const normalUrl = toNormalPath(urlPathname)
  if (isRootPath(normalPath) || isRootPath(normalUrl)) {
    return NextResponse.next()
  }
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
