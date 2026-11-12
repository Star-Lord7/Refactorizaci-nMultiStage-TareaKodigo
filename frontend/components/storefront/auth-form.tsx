'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { ArrowRight, LoaderCircle } from 'lucide-react'
import { loginAction, registerAction, type AuthActionState } from '@/app/actions/auth'

const initialState: AuthActionState = { error: null }

export function AuthForm({ mode, nextPath = '/', notice }: { mode: 'login' | 'register'; nextPath?: string; notice?: string }) {
  const action = mode === 'login' ? loginAction : registerAction
  const [state, formAction, pending] = useActionState(action, initialState)
  const isRegister = mode === 'register'

  return (
    <section className="auth-card">
      <div className="auth-card-topline"><span className="brand-mark" aria-hidden="true">N</span><span>CUENTA NODO</span></div>
      <h1>{isRegister ? 'Empieza por aquí.' : 'Qué bueno verte.'}</h1>
      <p className="auth-intro">{isRegister ? 'Crea tu cuenta para guardar tus compras y seguir cada orden.' : 'Inicia sesión para continuar con tu compra y consultar tus órdenes.'}</p>
      {notice ? <p className="form-hint" role="status">{notice}</p> : null}

      <form className="form-stack" action={formAction}>
        <input type="hidden" name="next" value={nextPath} />
        {isRegister ? (
          <label className="form-field">
            <span>Nombre</span>
            <input name="name" type="text" autoComplete="name" minLength={2} maxLength={255} required />
          </label>
        ) : null}
        <label className="form-field">
          <span>Correo electrónico</span>
          <input name="email" type="email" autoComplete="email" maxLength={255} required />
        </label>
        <label className="form-field">
          <span>Contraseña</span>
          <input name="password" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} minLength={isRegister ? 8 : undefined} required />
          {isRegister ? <small>Al menos 8 caracteres.</small> : null}
        </label>
        {isRegister ? (
          <label className="form-field">
            <span>Confirma tu contraseña</span>
            <input name="password_confirmation" type="password" autoComplete="new-password" minLength={8} required />
          </label>
        ) : null}

        {state.error ? <p className="form-error" role="alert">{state.error}</p> : null}

        <button className="button button-primary button-full" type="submit" disabled={pending}>
          {pending ? <><LoaderCircle className="spin" aria-hidden="true" size={16} /> Procesando…</> : <>{isRegister ? 'Crear cuenta' : 'Iniciar sesión'} <ArrowRight aria-hidden="true" size={16} /></>}
        </button>
      </form>

      <p className="auth-switch">
        {isRegister ? '¿Ya tienes una cuenta?' : '¿Primera vez por aquí?'}{' '}
        <Link href={isRegister ? `/login?next=${encodeURIComponent(nextPath)}` : `/register?next=${encodeURIComponent(nextPath)}`}>
          {isRegister ? 'Inicia sesión' : 'Crea una cuenta'}
        </Link>
      </p>
      <p className="auth-security">Tu sesión se guarda en una cookie segura, no en el almacenamiento del navegador.</p>
    </section>
  )
}
