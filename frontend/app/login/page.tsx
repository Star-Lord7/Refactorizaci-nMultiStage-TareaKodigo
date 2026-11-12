import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/storefront/auth-form'
import { getCurrentUser } from '@/lib/session'

export const metadata = {
  title: 'Iniciar sesión | NODO',
  description: 'Accede a tu cuenta NODO y revisa tus órdenes.',
}

function safeNext(value: string | undefined) {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : '/account/orders'
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; expired?: string }> }) {
  const params = await searchParams
  const next = safeNext(params.next)
  const user = await getCurrentUser()
  if (user) redirect(next)

  return (
    <section className="shell auth-page">
      <div className="auth-aside">
        <span className="eyebrow">BIENVENIDO DE VUELTA</span>
        <h1>Tu espacio,<br /><em>a un paso.</em></h1>
        <p>Entra para consultar tus órdenes y continuar con una compra.</p>
        <span className="auth-aside-mark" aria-hidden="true">N.</span>
      </div>
      <AuthForm
        mode="login"
        nextPath={next}
        notice={params.expired === '1'
          ? 'Tu sesión anterior terminó. Vuelve a iniciar sesión para continuar.'
          : !process.env.LARAVEL_API_BASE_URL
            ? 'Configura LARAVEL_API_BASE_URL con la dirección pública de la API para habilitar el acceso.'
            : undefined}
      />
    </section>
  )
}
