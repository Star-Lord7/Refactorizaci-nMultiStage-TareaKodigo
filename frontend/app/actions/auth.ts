'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { apiRequest, ApiHttpError, getApiErrorMessage } from '@/lib/api'
import { clearAccessToken, getAccessToken, setAccessToken } from '@/lib/session'
import type { ApiUser } from '@/lib/types'

export interface AuthActionState {
  error: string | null
}

interface AuthPayload {
  user: ApiUser
  token: string
  token_type: 'Bearer' | string
}

function safeNextPath(value: FormDataEntryValue | null) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) {
    return '/'
  }
  return value
}

function stringField(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === 'string' ? value.trim() : ''
}

export async function loginAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = stringField(formData, 'email').toLowerCase()
  const password = stringField(formData, 'password')
  const nextPath = safeNextPath(formData.get('next'))

  if (!email || !/^\S+@\S+\.\S+$/.test(email) || !password) {
    return { error: 'Escribe un correo válido y tu contraseña.' }
  }

  try {
    const response = await apiRequest<AuthPayload>('/login', {
      method: 'POST',
      body: { email, password },
    })
    if (!response.data?.token) return { error: 'La API no devolvió una sesión válida.' }
    await setAccessToken(response.data.token)
  } catch (error) {
    if (error instanceof ApiHttpError && error.status === 401) {
      return { error: 'El correo o la contraseña no son correctos.' }
    }
    return { error: getApiErrorMessage(error, 'No se pudo iniciar sesión. Revisa tus datos e inténtalo de nuevo.') }
  }

  revalidatePath('/')
  redirect(nextPath)
}

export async function registerAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const name = stringField(formData, 'name')
  const email = stringField(formData, 'email').toLowerCase()
  const password = stringField(formData, 'password')
  const passwordConfirmation = stringField(formData, 'password_confirmation')
  const nextPath = safeNextPath(formData.get('next'))

  if (name.length < 2) return { error: 'Escribe tu nombre para continuar.' }
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: 'Escribe un correo electrónico válido.' }
  if (password.length < 8) return { error: 'La contraseña debe tener al menos 8 caracteres.' }
  if (password !== passwordConfirmation) return { error: 'Las contraseñas no coinciden.' }

  try {
    const response = await apiRequest<AuthPayload>('/register', {
      method: 'POST',
      body: { name, email, password, password_confirmation: passwordConfirmation },
    })
    if (!response.data?.token) return { error: 'La API no devolvió una sesión válida.' }
    await setAccessToken(response.data.token)
  } catch (error) {
    return { error: getApiErrorMessage(error, 'No se pudo crear la cuenta. Revisa los datos e inténtalo de nuevo.') }
  }

  revalidatePath('/')
  redirect(nextPath)
}

export async function logoutAction() {
  const token = await getAccessToken()

  if (token) {
    try {
      await apiRequest('/logout', { method: 'POST', token })
    } catch {
      // The local session must be cleared even if Laravel is temporarily unavailable.
    }
  }

  await clearAccessToken()
  revalidatePath('/')
  redirect('/')
}
