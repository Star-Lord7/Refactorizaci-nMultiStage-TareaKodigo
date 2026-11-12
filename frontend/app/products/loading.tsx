import { CatalogSkeleton } from '@/components/storefront/catalog-skeleton'

export default function ProductsLoading() {
  return <section className="shell page-section"><div className="page-loading" role="status">Cargando el catálogo…</div><CatalogSkeleton count={8} /></section>
}
