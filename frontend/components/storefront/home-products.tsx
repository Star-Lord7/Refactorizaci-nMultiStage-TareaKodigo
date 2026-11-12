import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getProducts } from '@/lib/queries'
import { ApiNotice } from '@/components/storefront/api-feedback'
import { ProductGrid } from '@/components/storefront/product-grid'

export async function HomeProducts() {
  const result = await getProducts()
  return (
    <section className="home-products-section shell" aria-labelledby="home-products-title">
      <div className="section-heading">
        <div><span className="eyebrow">SELECCIÓN NODO</span><h2 id="home-products-title">Menos ruido.<br /><em>Más intención.</em></h2></div>
        {result.state === 'ready' && result.total > 4 ? <Link className="text-link" href="/products">Ver todo el catálogo <ArrowRight aria-hidden="true" size={15} /></Link> : null}
      </div>
      {result.state === 'ready' ? <ProductGrid products={result.products.slice(0, 4)} /> : <ApiNotice message={result.message} configured={result.state === 'unavailable'} />}
      {result.state === 'ready' && result.products.length === 0 ? null : null}
    </section>
  )
}
