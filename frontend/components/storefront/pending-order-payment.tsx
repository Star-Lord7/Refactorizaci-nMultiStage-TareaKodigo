'use client'

import { useActionState } from 'react'
import { ArrowRight, LoaderCircle } from 'lucide-react'
import { retryPaymentAction, type CheckoutActionState } from '@/app/actions/orders'
import { PaymentElements } from '@/components/storefront/payment-elements'

export function PendingOrderPayment({ orderId, stripeReady }: { orderId: number; stripeReady: boolean }) {
  const initialState: CheckoutActionState = { orderId, clientSecret: null, error: null }
  const [state, action, pending] = useActionState(retryPaymentAction, initialState)

  if (!stripeReady) {
    return (
      <div className="inline-alert" role="status">
        <strong>El pago no está configurado en este entorno.</strong>
        <span>Añade NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY para volver a pagar esta orden.</span>
      </div>
    )
  }

  if (state.clientSecret && state.orderId) {
    return <PaymentElements clientSecret={state.clientSecret} orderId={state.orderId} />
  }

  return (
    <div className="pending-payment">
      {state.error ? <p className="form-error" role="alert">{state.error}</p> : <p>Si no terminaste el pago, puedes iniciarlo de nuevo desde aquí.</p>}
      <form action={action}>
        <input type="hidden" name="order_id" value={orderId} />
        <button className="button button-primary" type="submit" disabled={pending}>
          {pending ? <><LoaderCircle className="spin" aria-hidden="true" size={16} /> Preparando pago…</> : <>Pagar esta orden <ArrowRight aria-hidden="true" size={16} /></>}
        </button>
      </form>
    </div>
  )
}
