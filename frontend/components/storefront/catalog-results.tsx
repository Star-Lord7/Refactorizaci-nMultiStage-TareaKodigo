import { getProducts } from '@/lib/queries'
import { ApiNotice } from '@/components/storefront/api-feedback'
import { CatalogPagination } from '@/components/storefront/catalog-pagination'
import { ProductGrid } from '@/components/storefront/product-grid'

export async function CatalogResults({ page }: { page: number }) {
  const result = await getProducts(page)
  if (result.state !== 'ready') {
    return <ApiNotice message={result.message} configured={result.state === 'unavailable'} />
  }

  return (
    <>
      <div className="catalog-results-meta"><span>{result.total} {result.total === 1 ? 'producto' : 'productos'}</span><span>Información en tiempo real desde la API</span></div>
      <ProductGrid products={result.products} />
      {result.products.length === 0 ? null : <CatalogPagination page={result.page} lastPage={result.lastPage} />}
    </>
  )
}
