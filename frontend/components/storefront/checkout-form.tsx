'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { ArrowRight, LoaderCircle, ShieldCheck } from 'lucide-react'
import { createOrderAction, retryPaymentAction, type CheckoutActionState } from '@/app/actions/orders'
import { useCart } from '@/components/storefront/cart-provider'
import { CancelOrderForm } from '@/components/storefront/cancel-order-form'
import { PaymentElements } from '@/components/storefront/payment-elements'
import { formatPrice } from '@/lib/format'

const initialState: CheckoutActionState = { orderId: null, clientSecret: null, error: null }

function CreateOrderButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button className="button button-primary button-full" type="submit" disabled={disabled || pending}>
      {pending ? <><LoaderCircle className="spin" aria-hidden="true" size={16} /> Creando orden…</> : <>Crear orden y pagar <ArrowRight aria-hidden="true" size={16} /></>}
    </button>
  )
}

function RetryPayment({ orderId, initialError }: { orderId: number; initialError: string | null }) {
  const [state, action, pending] = useActionState(retryPaymentAction, { ...initialState, orderId, error: initialError })
  if (state.clientSecret) {
    return (
      <div className="payment-step">
        <div className="payment-step-heading"><span className="step-number">02</span><div><span className="eyebrow">ORDEN #{orderId}</span><h2>Completa el pago</h2></div></div>
        <PaymentElements clientSecret={state.clientSecret} orderId={orderId} />
        <CancelOrderForm orderId={orderId} />
      </div>
    )
  }

  return (
    <div className="payment-retry">
      <div className="inline-alert" role="status"><strong>La orden ya está creada.</strong><span>{state.error ?? 'Puedes volver a solicitar el pago o cancelar la orden.'}</span></div>
      <form action={action}>
        <input type="hidden" name="order_id" value={orderId} />
        <button className="button button-primary" type="submit" disabled={pending}>
          {pending ? <><LoaderCircle className="spin" aria-hidden="true" size={16} /> Preparando pago…</> : <>Volver a intentarlo <ArrowRight aria-hidden="true" size={16} /></>}
        </button>
      </form>
      <CancelOrderForm orderId={orderId} />
    </div>
  )
}

export function CheckoutForm({ stripeReady }: { stripeReady: boolean }) {
  const { items, total } = useCart()
  const [state, action] = useActionState(createOrderAction, initialState)

  if (items.length === 0 && !state.orderId) {
    return (
      <div className="empty-state cart-empty">
        <span className="empty-state-mark" aria-hidden="true">N.</span>
        <h1>Tu carrito está vacío.</h1>
        <p>Añade productos antes de continuar con el pago.</p>
        <Link className="button button-primary" href="/products">Explorar la tienda <ArrowRight aria-hidden="true" size={16} /></Link>
      </div>
    )
  }

  if (state.orderId && state.clientSecret) {
    return (
      <div className="checkout-layout">
        <section className="checkout-main">
          <div className="payment-step">
            <div className="payment-step-heading"><span className="step-number">02</span><div><span className="eyebrow">ORDEN #{state.orderId}</span><h2>Completa el pago</h2></div></div>
            <PaymentElements clientSecret={state.clientSecret} orderId={state.orderId} />
            <CancelOrderForm orderId={state.orderId} />
          </div>
        </section>
        <OrderSummary items={items} total={total} />
      </div>
    )
  }

  if (state.orderId) {
    return (
      <div className="checkout-layout">
        <section className="checkout-main">
          <RetryPayment orderId={state.orderId} initialError={state.error} />
        </section>
        <OrderSummary items={items} total={total} />
      </div>
    )
  }

  return (
    <div className="checkout-layout">
      <section className="checkout-main">
        <div className="payment-step-heading"><span className="step-number">01</span><div><span className="eyebrow">REVISIÓN</span><h2>Confirma tu orden</h2></div></div>
        <p className="checkout-explainer">La API de Laravel validará el stock y calculará el total. El contrato recibido aún no contempla dirección ni tarifas de envío.</p>
        {!stripeReady ? (
          <div className="inline-alert" role="status">
            <strong>Falta la clave pública de Stripe.</strong>
            <span>Configura NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY antes de crear una orden. Usa la clave pública correspondiente a STRIPE_KEY en Laravel.</span>
          </div>
        ) : null}
        {state.error ? <p className="form-error checkout-error" role="alert">{state.error}</p> : null}
        <form action={action}>
          <input type="hidden" name="items" value={JSON.stringify(items.map(({ product, quantity }) => ({ product_id: product.id, quantity })))} />
          <CreateOrderButton disabled={!stripeReady || items.length === 0} />
        </form>
        <p className="secure-note"><ShieldCheck aria-hidden="true" size={15} /> Los precios y las cantidades se verifican en el servidor.</p>
      </section>
      <OrderSummary items={items} total={total} />
    </div>
  )
}

function OrderSummary({ items, total }: { items: ReturnType<typeof useCart>['items']; total: number }) {
  return (
    <aside className="cart-summary checkout-summary">
      <span className="eyebrow">RESUMEN</span>
      <h2>Tu orden</h2>
      <div className="checkout-summary-lines">
        {items.map(({ product, quantity }) => (
          <div className="summary-product" key={product.id}>
            <span className="summary-product-qty">{quantity}</span>
            <span className="summary-product-name">{product.name}</span>
            <strong>{formatPrice(Number(product.price) * quantity)}</strong>
          </div>
        ))}
      </div>
      <div className="summary-total"><span>Subtotal</span><strong>{formatPrice(total)}</strong></div>
      <p className="summary-note">El importe definitivo se calcula en Laravel con los precios actuales.</p>
    </aside>
  )
}
