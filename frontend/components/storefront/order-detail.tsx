import Link from 'next/link'
import { ArrowLeft, CheckCircle2, PackageCheck } from 'lucide-react'
import { formatDate, formatPrice } from '@/lib/format'
import type { Order } from '@/lib/types'
import { CancelOrderForm } from '@/components/storefront/cancel-order-form'
import { PendingOrderPayment } from '@/components/storefront/pending-order-payment'
import { OrderStatus, PaymentStatus } from '@/components/storefront/order-status'

export function OrderDetail({ order }: { order: Order }) {
  return (
    <div className="order-detail-wrap">
      <Link className="back-link" href="/account/orders"><ArrowLeft aria-hidden="true" size={15} /> Volver a mis órdenes</Link>
      <section className="order-detail-card">
        <div className="order-detail-header">
          <div className="order-detail-icon" aria-hidden="true"><PackageCheck size={24} /></div>
          <div className="order-detail-title"><span className="eyebrow">ORDEN #{order.id}</span><h1>Detalle de compra</h1><p>Creada el {formatDate(order.created_at)}</p></div>
          <OrderStatus status={order.status} />
        </div>
        {order.status === 'paid' ? <div className="order-callout order-callout-success"><CheckCircle2 aria-hidden="true" size={18} /><span>El pago está confirmado por la API.</span></div> : null}
        <div className="order-items-heading"><h2>Productos</h2><span>{order.items.reduce((sum, item) => sum + item.quantity, 0)} unidades</span></div>
        <div className="order-detail-items">
          {order.items.map((item) => (
            <div className="order-detail-item" key={item.id}>
              <div><strong>{item.product?.name ?? `Producto #${item.product_id}`}</strong><span>Cantidad: {item.quantity}</span></div>
              <strong>{formatPrice(item.subtotal)}</strong>
            </div>
          ))}
        </div>
        <div className="order-detail-total"><span>Total de la orden</span><strong>{formatPrice(order.total)}</strong></div>
        {order.payment ? <div className="order-payment-state"><span>Estado del pago</span><PaymentStatus status={order.payment.status} /></div> : null}
        {order.status === 'pending' ? <div className="order-cancel-block"><p>Esta orden reservó el stock. Puedes pagarla o cancelarla mientras siga pendiente.</p><PendingOrderPayment orderId={order.id} stripeReady={Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)} /><CancelOrderForm orderId={order.id} /></div> : null}
      </section>
    </div>
  )
}
