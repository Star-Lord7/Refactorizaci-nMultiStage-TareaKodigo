import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/storefront/auth-form'
import { getCurrentUser } from '@/lib/session'

export const metadata = {
  title: 'Crear cuenta | NODO',
  description: 'Crea tu cuenta NODO para consultar tus compras.',
}

function safeNext(value: string | undefined) {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : '/account/orders'
}

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams
  const next = safeNext(params.next)
  const user = await getCurrentUser()
  if (user) redirect(next)

  return (
    <section className="shell auth-page">
      <div className="auth-aside auth-aside-register">
        <span className="eyebrow">EMPIEZA AQUÍ</span>
        <h1>Tu día a día,<br /><em>un poco mejor.</em></h1>
        <p>Crea una cuenta para guardar el seguimiento de tus órdenes y pagos.</p>
        <span className="auth-aside-mark" aria-hidden="true">N.</span>
      </div>
      <AuthForm
        mode="register"
        nextPath={next}
        notice={!process.env.LARAVEL_API_BASE_URL
          ? 'Configura LARAVEL_API_BASE_URL con la dirección pública de la API para habilitar el registro.'
          : undefined}
      />
    </section>
  )
}
