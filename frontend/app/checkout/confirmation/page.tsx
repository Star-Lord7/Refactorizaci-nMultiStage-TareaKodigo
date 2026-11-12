import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2, Clock3 } from 'lucide-react'
import { ClearCartLink } from '@/components/storefront/clear-cart-link'
import { ApiNotice, RouteProblem } from '@/components/storefront/api-feedback'
import { OrderStatus } from '@/components/storefront/order-status'
import { formatPrice } from '@/lib/format'
import { getOrder } from '@/lib/queries'
import { requireUser } from '@/lib/session'

export const metadata = {
  title: 'Estado de tu pago | NODO',
  description: 'Consulta la confirmación de tu pago y orden.',
}

export default async function PaymentConfirmationPage({ searchParams }: { searchParams: Promise<{ order_id?: string }> }) {
  const params = await searchParams
  const orderId = Number(params.order_id)
  if (!Number.isInteger(orderId) || orderId < 1) notFound()
  const { token } = await requireUser(`/checkout/confirmation?order_id=${orderId}`)
  const result = await getOrder(orderId, token)
  if (result.state === 'not-found') notFound()
  if (result.state === 'unconfigured') return <section className="shell confirmation-page"><ApiNotice message={result.message} /></section>
  if (result.state === 'unavailable') return <section className="shell confirmation-page"><RouteProblem title="No se pudo verificar la orden" message={result.message} href="/account/orders" label="Ver mis órdenes" /></section>

  const order = result.data
  const isPaid = order.status === 'paid'
  const isCancelled = order.status === 'cancelled'

  return (
    <section className="shell confirmation-page">
      <div className={`confirmation-card ${isPaid ? 'confirmation-success' : ''}`}>
        <div className="confirmation-icon" aria-hidden="true">{isPaid ? <CheckCircle2 size={30} /> : <Clock3 size={30} />}</div>
        <span className="eyebrow">ORDEN #{order.id}</span>
        <h1>{isPaid ? 'Pago confirmado.' : isCancelled ? 'Orden cancelada.' : 'Estamos verificando tu pago.'}</h1>
        <p>{isPaid ? 'La API confirmó el estado pagado. Gracias por elegir NODO.' : isCancelled ? 'La API confirmó la cancelación de esta orden.' : 'Stripe está procesando la respuesta. El estado que muestra Laravel todavía está pendiente; vuelve a consultar en un momento.'}</p>
        <div className="confirmation-order-row"><span>Estado de la orden</span><OrderStatus status={order.status} /></div>
        <div className="confirmation-order-row"><span>Total</span><strong>{formatPrice(order.total)}</strong></div>
        <div className="confirmation-actions">
          {isPaid ? <ClearCartLink /> : <Link className="button button-primary" href="/account/orders">Consultar mis órdenes</Link>}
          {!isPaid && !isCancelled ? <Link className="button button-secondary" href={`/checkout/confirmation?order_id=${order.id}`}>Actualizar estado</Link> : null}
        </div>
      </div>
    </section>
  )
}
