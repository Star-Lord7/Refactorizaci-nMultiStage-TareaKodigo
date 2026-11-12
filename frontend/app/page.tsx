import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, CreditCard, RefreshCw } from 'lucide-react'
import { Hero } from '@/components/storefront/hero'
import { HomeProducts } from '@/components/storefront/home-products'
import { CatalogSkeleton } from '@/components/storefront/catalog-skeleton'

export default function HomePage() {
  return (
    <div className="home-page">
      <Hero />
      <Suspense fallback={<section className="home-products-section shell"><CatalogSkeleton /></section>}>
        <HomeProducts />
      </Suspense>
      <section id="enfoque" className="approach-section shell">
        <div className="approach-heading"><span className="eyebrow">LA IDEA ES SIMPLE</span><h2>Lo útil también<br /><em>puede emocionar.</em></h2></div>
        <div className="approach-copy"><p>Elegimos accesorios que acompañan tu rutina digital sin complicarla. La información de productos, stock y órdenes viene directamente de la API de la tienda.</p><Link className="text-link" href="/products">Descubrir el catálogo <ArrowRight aria-hidden="true" size={15} /></Link></div>
        <div className="approach-points">
          <div><span className="approach-icon"><Check aria-hidden="true" size={17} /></span><strong>Datos reales</strong><p>Productos y disponibilidad consultados en Laravel.</p></div>
          <div><span className="approach-icon"><CreditCard aria-hidden="true" size={17} /></span><strong>Pago seguro</strong><p>Stripe confirma los pagos a través de la API.</p></div>
          <div><span className="approach-icon"><RefreshCw aria-hidden="true" size={17} /></span><strong>Órdenes claras</strong><p>Revisa el estado de tus compras desde tu cuenta.</p></div>
        </div>
      </section>
      <section className="closing-cta shell">
        <div><span className="eyebrow">TU SIGUIENTE MEJORA</span><h2>Empieza por algo<br /><em>pequeño.</em></h2></div>
        <Link className="button button-light" href="/products">Ver la tienda <ArrowRight aria-hidden="true" size={16} /></Link>
      </section>
    </div>
  )
}
