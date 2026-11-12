import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CheckoutForm } from '@/components/storefront/checkout-form'
import { requireUser } from '@/lib/session'

export const metadata = {
  title: 'Pago seguro | NODO',
  description: 'Confirma tu orden y completa el pago con Stripe.',
}

export default async function CheckoutPage() {
  await requireUser('/checkout')
  const stripeReady = Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

  return (
    <section className="shell checkout-page">
      <Link className="back-link" href="/cart"><ArrowLeft aria-hidden="true" size={15} /> Volver al carrito</Link>
      <div className="page-heading"><span className="eyebrow">PAGO / PASO FINAL</span><h1>Un último vistazo.</h1><p>Revisa tu orden antes de continuar con el pago.</p></div>
      <CheckoutForm stripeReady={stripeReady} />
    </section>
  )
}
