export function CatalogSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="product-grid" aria-label="Cargando productos" aria-busy="true">
      {Array.from({ length: count }, (_, index) => (
        <div className="skeleton-product" key={index}>
          <div className="skeleton-block skeleton-product-visual" />
          <div className="skeleton-block skeleton-line skeleton-line-short" />
          <div className="skeleton-block skeleton-line" />
          <div className="skeleton-block skeleton-line skeleton-line-medium" />
        </div>
      ))}
    </div>
  )
}

export function PageLoading({ label = 'Cargando' }: { label?: string }) {
  return (
    <div className="page-loading" role="status" aria-live="polite">
      <span className="loading-mark" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
