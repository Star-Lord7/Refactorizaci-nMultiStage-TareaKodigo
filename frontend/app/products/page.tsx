import { Suspense } from 'react'
import { CatalogResults } from '@/components/storefront/catalog-results'
import { CatalogSkeleton } from '@/components/storefront/catalog-skeleton'

export const metadata = {
  title: 'Tienda | NODO',
  description: 'Explora el catálogo de accesorios tecnológicos NODO.',
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams
  const page = Number(params.page)
  const safePage = Number.isInteger(page) && page > 0 && page <= 10000 ? page : 1

  return (
    <section className="shell catalog-page">
      <div className="catalog-page-heading">
        <span className="eyebrow">TIENDA / CATÁLOGO</span>
        <h1>Encuentra tu <em>siguiente favorito.</em></h1>
        <p>Productos, precios y disponibilidad cargados en tiempo real desde la API.</p>
      </div>
      <Suspense fallback={<CatalogSkeleton count={8} />}>
        <CatalogResults page={safePage} />
      </Suspense>
    </section>
  )
}
