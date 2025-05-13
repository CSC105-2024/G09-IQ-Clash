import type { MiddlewareHandler } from 'hono'
import { verifyToken } from '../utils/jwtToken.js'

// Auth middleware to check JWT in cookie
export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const cookie = c.req.header('Cookie')
  if (!cookie) {
    return c.json({ error: 'Unauthorized: No cookie found' }, 401)
  }
  const token = getTokenFromCookie(cookie)
  if (!token) {
    return c.json({ error: 'Unauthorized: Token not found' }, 401)
  }
  const payload = verifyToken(token)
  if (!payload) {
    return c.json({ error: 'Unauthorized: Invalid or expired token' }, 401)
  }
  // Store userId in context for use in routes
  c.set('userId', payload.userId)
  await next()
}
// Helper function to extract "token=xyz" from cookie string
function getTokenFromCookie(cookieHeader: string): string | null {
  const cookies = cookieHeader.split(';').map(cookie => cookie.trim())
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=')
    if (key === 'token') {
      return value
    }
  }
  return null
}
