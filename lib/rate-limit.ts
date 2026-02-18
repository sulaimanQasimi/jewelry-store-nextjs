/**
 * In-memory rate limiter for login/token endpoint.
 * Use a proper store (e.g. Redis) in multi-instance deployments.
 */

const WINDOW_MS = 60 * 1000 // 1 minute
const MAX_ATTEMPTS = 10

const store = new Map<
  string,
  { count: number; resetAt: number }
>()

function getKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
  return `token:${ip}`
}

export function isRateLimited(request: Request): boolean {
  const key = getKey(request)
  const now = Date.now()
  const entry = store.get(key)
  if (!entry) return false
  if (now >= entry.resetAt) {
    store.delete(key)
    return false
  }
  return entry.count >= MAX_ATTEMPTS
}

export function recordAttempt(request: Request): void {
  const key = getKey(request)
  const now = Date.now()
  const entry = store.get(key)
  if (!entry) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return
  }
  if (now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return
  }
  entry.count += 1
}
