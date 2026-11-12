import 'server-only'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { apiRequest, ApiHttpError } from '@/lib/api'
import type { ApiUser } from '@/lib/types'

export const SESSION_COOKIE = 'nodo_laravel_token'
const SESSION_MAX_AGE = 60 * 60

export async function getAccessToken() {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE)?.value ?? null
}

export async function setAccessToken(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
}

export async function clearAccessToken() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function getCurrentUser(): Promise<ApiUser | null> {
  const token = await getAccessToken()
  if (!token) return null

  try {
    const response = await apiRequest<ApiUser>('/me', { token })
    return response.data
  } catch {
    return null
  }
}

export async function requireUser(nextPath = '/account/orders') {
  const encodedNextPath = encodeURIComponent(nextPath)
  const token = await getAccessToken()
  if (!token) redirect(`/login?next=${encodedNextPath}`)

  try {
    const response = await apiRequest<ApiUser>('/me', { token })
    return { token, user: response.data }
  } catch (error) {
    if (error instanceof ApiHttpError && (error.status === 401 || error.status === 403)) {
      redirect(`/login?next=${encodedNextPath}&expired=1`)
    }
    throw error
  }
}
