import Link from 'next/link'
import { CircleCheck, PackageCheck } from 'lucide-react'

export const metadata = {
  title: 'Orden cancelada | NODO',
  description: 'La orden pendiente fue cancelada.',
}

export default async function CancelledPage({ searchParams }: { searchParams: Promise<{ order_id?: string }> }) {
  const params = await searchParams
  const orderId = Number(params.order_id)
  return (
    <section className="shell confirmation-page">
      <div className="confirmation-card">
        <div className="confirmation-icon" aria-hidden="true"><CircleCheck size={30} /></div>
        <span className="eyebrow">ORDEN {Number.isInteger(orderId) && orderId > 0 ? `#${orderId}` : ''}</span>
        <h1>Orden cancelada.</h1>
        <p>La API confirmó la cancelación. El stock reservado se liberó para otros clientes.</p>
        <div className="cancel-note"><PackageCheck aria-hidden="true" size={17} /><span>Puedes volver al catálogo cuando quieras.</span></div>
        <Link className="button button-primary" href="/products">Volver a la tienda</Link>
      </div>
    </section>
  )
}
