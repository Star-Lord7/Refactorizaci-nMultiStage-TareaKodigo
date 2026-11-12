import type { Product } from '@/lib/types'
import { ProductCard } from '@/components/storefront/product-card'
import { EmptyProducts } from '@/components/storefront/api-feedback'

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) return <EmptyProducts />

  return (
    <div className="product-grid">
      {products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  )
}
