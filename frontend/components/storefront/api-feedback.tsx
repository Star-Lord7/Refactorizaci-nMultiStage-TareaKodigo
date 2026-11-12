import Link from 'next/link'
import { AlertCircle, ArrowRight, PlugZap } from 'lucide-react'

export function ApiNotice({ message, configured = false }: { message: string; configured?: boolean }) {
  return (
    <section className="api-notice" aria-live="polite">
      <div className="api-notice-icon" aria-hidden="true">
        {configured ? <AlertCircle size={20} /> : <PlugZap size={20} />}
      </div>
      <div className="api-notice-copy">
        <h3>{configured ? 'No se pudo cargar el catálogo' : 'Conecta tu catálogo'}</h3>
        <p>{message}</p>
        {!configured ? (
          <p className="api-notice-hint">
            Configura <code>LARAVEL_API_BASE_URL</code> con la URL pública de Laravel terminada en <code>/api</code>.
          </p>
        ) : null}
      </div>
      <Link className="text-link" href="/products">
        Volver a intentar <ArrowRight aria-hidden="true" size={15} />
      </Link>
    </section>
  )
}

export function EmptyProducts() {
  return (
    <div className="empty-state">
      <span className="empty-state-mark" aria-hidden="true">N.</span>
      <h3>El catálogo está tranquilo por ahora</h3>
      <p>Cuando la API publique productos activos, aparecerán aquí.</p>
    </div>
  )
}

export function RouteProblem({ title, message, href = '/products', label = 'Ir a la tienda' }: {
  title: string
  message: string
  href?: string
  label?: string
}) {
  return (
    <div className="route-problem" role="status">
      <div className="route-problem-icon" aria-hidden="true"><AlertCircle size={22} /></div>
      <h2>{title}</h2>
      <p>{message}</p>
      <Link className="button button-secondary" href={href}>{label}</Link>
    </div>
  )
}
