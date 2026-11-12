import 'server-only'

import type { ApiEnvelope } from '@/lib/types'

export class ApiConfigurationError extends Error {
  constructor() {
    super('La URL de la API no está configurada.')
    this.name = 'ApiConfigurationError'
  }
}

export class ApiConnectionError extends Error {
  constructor() {
    super('No se pudo conectar con la API.')
    this.name = 'ApiConnectionError'
  }
}

export class ApiHttpError extends Error {
  constructor(
    readonly status: number,
    readonly payload: unknown,
  ) {
    super(readMessage(payload) ?? `La API respondió con el estado ${status}.`)
    this.name = 'ApiHttpError'
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readMessage(value: unknown): string | null {
  if (!isRecord(value)) return null
  return typeof value.message === 'string' ? value.message : null
}

function getApiBaseUrl() {
  const value = process.env.LARAVEL_API_BASE_URL?.trim().replace(/\/+$/, '')
  if (!value) throw new ApiConfigurationError()

  let url: URL
  try {
    url = new URL(value)
  } catch {
    throw new ApiConfigurationError()
  }

  if (!value.endsWith('/api')) throw new ApiConfigurationError()

  const isInternalComposeHttpUrl =
    url.protocol === 'http:' &&
    url.hostname === 'api-nginx' &&
    (url.port === '' || url.port === '80') &&
    url.pathname === '/api' &&
    !url.username &&
    !url.password &&
    !url.search &&
    !url.hash

  if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:' && !isInternalComposeHttpUrl) {
    throw new ApiConfigurationError()
  }

  return value
}

interface ApiRequestOptions {
  method?: 'GET' | 'POST'
  token?: string
  body?: unknown
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}) {
  const url = `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  if (options.body !== undefined) headers['Content-Type'] = 'application/json'
  if (options.token) headers.Authorization = `Bearer ${options.token}`

  let response: Response
  try {
    response = await fetch(url, {
      method: options.method ?? 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    })
  } catch {
    throw new ApiConnectionError()
  }

  let payload: unknown
  try {
    payload = await response.json()
  } catch {
    throw new ApiConnectionError()
  }

  if (!response.ok || (isRecord(payload) && payload.success === false)) {
    throw new ApiHttpError(response.status, payload)
  }

  return payload as ApiEnvelope<T>
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiConfigurationError) {
    return 'La API todavía no está configurada. Añade su URL en LARAVEL_API_BASE_URL.'
  }

  if (error instanceof ApiHttpError) {
    if (error.status === 422) {
      const payload = error.payload
      if (isRecord(payload) && isRecord(payload.errors)) {
        const firstMessages = Object.values(payload.errors).find(
          (messages) => Array.isArray(messages) && messages.length > 0,
        )
        if (Array.isArray(firstMessages) && typeof firstMessages[0] === 'string') {
          return firstMessages[0]
        }
      }
      return 'Revisa los datos e inténtalo de nuevo.'
    }

    if (error.status === 401 || error.status === 403) {
      return 'La sesión no es válida. Inicia sesión e inténtalo de nuevo.'
    }

    if (error.status === 429) {
      return 'Se hicieron demasiados intentos. Espera un momento y vuelve a probar.'
    }
  }

  return fallback
}
