import Link from 'next/link'
import { formatPrice } from '@/lib/format'
import type { Product } from '@/lib/types'
import { AddToCartButton } from '@/components/storefront/product-actions'

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <div className="product-card-topline">
        <span className="product-card-label">NODO / TECNOLOGÍA</span>
        <span className="product-id">#{product.id}</span>
      </div>
      <div className="product-card-body">
        <div className="product-card-meta">
          <span className={product.stock > 0 ? 'stock-label' : 'stock-label stock-label-out'}>
            <span aria-hidden="true" className="stock-dot" />
            {product.stock > 0 ? 'Disponible' : 'Agotado'}
          </span>
        </div>
        <h3><Link href={`/products/${product.id}`}>{product.name}</Link></h3>
        {product.description ? <p className="product-description">{product.description}</p> : null}
        <div className="product-card-bottom">
          <span className="product-price">{formatPrice(product.price)}</span>
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </article>
  )
}
