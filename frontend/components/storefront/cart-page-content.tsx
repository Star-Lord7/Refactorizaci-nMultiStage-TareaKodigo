'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '@/components/storefront/cart-provider'
import { formatPrice } from '@/lib/format'

export function CartPageContent() {
  const { items, total, setQuantity, remove } = useCart()

  if (items.length === 0) {
    return (
      <div className="empty-state cart-empty">
        <span className="empty-state-mark" aria-hidden="true">N.</span>
        <p className="eyebrow">TU CARRITO</p>
        <h1>Por aquí todavía no hay nada.</h1>
        <p>Explora el catálogo y añade lo que te guste. El precio final lo valida la API al crear la orden.</p>
        <Link className="button button-primary" href="/products">Ir a la tienda <ArrowRight aria-hidden="true" size={16} /></Link>
      </div>
    )
  }

  return (
    <div className="cart-layout">
      <section className="cart-list" aria-label="Productos en el carrito">
        <div className="cart-list-heading"><span>Producto</span><span>Cantidad</span><span>Subtotal</span></div>
        {items.map(({ product, quantity }) => (
          <article className="cart-line" key={product.id}>
            <div className="cart-line-visual" aria-hidden="true"><span>N.</span></div>
            <div className="cart-line-info">
              <Link href={`/products/${product.id}`} className="cart-line-name">{product.name}</Link>
              <span className="cart-line-price">{formatPrice(product.price)} por unidad</span>
              <button className="cart-remove" type="button" onClick={() => remove(product.id)} aria-label={`Eliminar ${product.name} del carrito`}>
                <Trash2 aria-hidden="true" size={14} /> Quitar
              </button>
            </div>
            <div className="cart-quantity-control" aria-label={`Cantidad de ${product.name}`}>
              <button type="button" aria-label={`Quitar una unidad de ${product.name}`} disabled={quantity <= 1} onClick={() => setQuantity(product.id, quantity - 1)}><Minus aria-hidden="true" size={14} /></button>
              <span aria-live="polite">{quantity}</span>
              <button type="button" aria-label={`Añadir una unidad de ${product.name}`} disabled={quantity >= Math.min(product.stock, 100)} onClick={() => setQuantity(product.id, quantity + 1)}><Plus aria-hidden="true" size={14} /></button>
            </div>
            <strong className="cart-line-subtotal">{formatPrice(Number(product.price) * quantity)}</strong>
          </article>
        ))}
        <Link className="back-link" href="/products"><ArrowLeft aria-hidden="true" size={15} /> Seguir explorando</Link>
      </section>
      <aside className="cart-summary">
        <span className="eyebrow">RESUMEN</span>
        <h2>Tu orden</h2>
        <div className="summary-row"><span>Productos ({items.reduce((sum, line) => sum + line.quantity, 0)})</span><strong>{formatPrice(total)}</strong></div>
        <div className="summary-total"><span>Subtotal</span><strong>{formatPrice(total)}</strong></div>
        <p className="summary-note">El precio y el stock definitivos se validan en Laravel. La API actual no incluye dirección ni tarifa de envío.</p>
        <Link className="button button-primary button-full" href="/checkout">Continuar al pago <ArrowRight aria-hidden="true" size={16} /></Link>
        <p className="secure-note"><span aria-hidden="true">●</span> Pago seguro procesado por Stripe</p>
      </aside>
    </div>
  )
}
