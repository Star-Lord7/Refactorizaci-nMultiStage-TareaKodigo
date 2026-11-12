'use client'

import { useState, type FormEvent } from 'react'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { ArrowRight, LoaderCircle, LockKeyhole } from 'lucide-react'

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = publishableKey ? loadStripe(publishableKey) : null

function PaymentForm({ orderId }: { orderId: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const [pending, setPending] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const returnUrl = typeof window === 'undefined'
    ? ''
    : `${window.location.origin}/checkout/confirmation?order_id=${orderId}`

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!stripe || !elements || !returnUrl) return

    setPending(true)
    setErrorMessage(null)
    const validation = await elements.submit()
    if (validation.error) {
      setErrorMessage(validation.error.message ?? 'Revisa los datos de pago.')
      setPending(false)
      return
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
      redirect: 'if_required',
    })

    if (result.error) {
      setErrorMessage(result.error.message ?? 'No se pudo confirmar el pago. Revisa el método de pago e inténtalo de nuevo.')
      setPending(false)
      return
    }

    if (result.paymentIntent?.status === 'succeeded' || result.paymentIntent?.status === 'processing') {
      window.location.assign(returnUrl)
      return
    }

    setErrorMessage('El pago todavía está pendiente de confirmación. Puedes volver a intentarlo en unos segundos.')
    setPending(false)
  }

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <PaymentElement options={{ layout: 'tabs' }} />
      {errorMessage ? <p className="form-error" role="alert">{errorMessage}</p> : null}
      <button className="button button-primary button-full" type="submit" disabled={!stripe || pending}>
        {pending ? <><LoaderCircle className="spin" aria-hidden="true" size={16} /> Confirmando pago…</> : <>Pagar ahora <ArrowRight aria-hidden="true" size={16} /></>}
      </button>
      <p className="secure-note"><LockKeyhole aria-hidden="true" size={14} /> Datos de pago cifrados y procesados por Stripe.</p>
    </form>
  )
}

export function PaymentElements({ clientSecret, orderId }: { clientSecret: string; orderId: number }) {
  if (!stripePromise) {
    return (
      <div className="inline-alert" role="status">
        <strong>Falta configurar Stripe en el frontend.</strong>
        <span>Añade NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY con la clave pública de Stripe usada por Laravel.</span>
      </div>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#e75f3e',
            colorBackground: '#fffefa',
            colorText: '#17212b',
            borderRadius: '12px',
          },
        },
      }}
    >
      <PaymentForm orderId={orderId} />
    </Elements>
  )
}
