import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="shell confirmation-page">
      <div className="confirmation-card">
        <span className="eyebrow">404 · NO ENCONTRADO</span>
        <h1>Esta página no está disponible.</h1>
        <p>Puede que el enlace haya cambiado o que el recurso ya no exista en la API.</p>
        <div className="confirmation-actions">
          <Link className="button button-primary" href="/"><ArrowLeft aria-hidden="true" size={15} /> Volver al inicio</Link>
          <Link className="button button-secondary" href="/products">Ver catálogo <ArrowRight aria-hidden="true" size={15} /></Link>
        </div>
      </div>
    </section>
  )
}
