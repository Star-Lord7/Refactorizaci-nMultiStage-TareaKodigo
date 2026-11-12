import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { formatDate, formatPrice } from '@/lib/format'
import type { Order } from '@/lib/types'
import { OrderStatus } from '@/components/storefront/order-status'

export function OrderCard({ order }: { order: Order }) {
  return (
    <article className="order-card">
      <div className="order-card-top">
        <div><span className="eyebrow">ORDEN #{order.id}</span><p>{formatDate(order.created_at)}</p></div>
        <OrderStatus status={order.status} />
      </div>
      <div className="order-card-items">
        {order.items.map((item) => (
          <div className="order-card-item" key={item.id}>
            <span>{item.product?.name ?? `Producto #${item.product_id}`}</span>
            <span>× {item.quantity}</span>
          </div>
        ))}
      </div>
      <div className="order-card-bottom">
        <strong>{formatPrice(order.total)}</strong>
        <Link href={`/account/orders/${order.id}`}>Ver detalle <ArrowUpRight aria-hidden="true" size={14} /></Link>
      </div>
    </article>
  )
}
