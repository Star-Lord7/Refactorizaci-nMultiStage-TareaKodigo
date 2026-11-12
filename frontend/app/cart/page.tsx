import { CartPageContent } from '@/components/storefront/cart-page-content'

export const metadata = {
  title: 'Tu carrito | NODO',
  description: 'Revisa los productos de tu carrito NODO.',
}

export default function CartPage() {
  return (
    <section className="shell cart-page">
      <div className="page-heading"><span className="eyebrow">TU ESPACIO NODO / CARRITO</span><h1>Antes de continuar.</h1></div>
      <CartPageContent />
    </section>
  )
}
