import Link from 'next/link'
import { ArrowLeft, Check, PackageCheck, ShieldCheck } from 'lucide-react'
import type { Product } from '@/lib/types'
import { formatPrice } from '@/lib/format'
import { ProductDetailActions } from '@/components/storefront/product-actions'

export function ProductDetailContent({ product }: { product: Product }) {
  return (
    <section className="shell product-detail-page">
      <Link className="back-link" href="/products"><ArrowLeft aria-hidden="true" size={15} /> Volver al catálogo</Link>
      <div className="product-detail-layout">
        <div className="product-detail-reference">
          <span className="eyebrow">FICHA DE CATÁLOGO</span>
          <strong>#{product.id}</strong>
          <span>Datos cargados directamente desde Laravel</span>
        </div>
        <div className="product-detail-info">
          <span className="eyebrow">CATÁLOGO NODO <span className="detail-dot" /> #{product.id}</span>
          <h1>{product.name}</h1>
          <p className="product-detail-description">{product.description || 'La API no proporciona una descripción para este producto.'}</p>
          <p className="product-detail-price">{formatPrice(product.price)}</p>
          <p className={`availability ${product.stock > 0 ? '' : 'availability-out'}`}>
            <span aria-hidden="true" />{product.stock > 0 ? `${product.stock} disponibles según la API` : 'Agotado'}
          </p>
          <ProductDetailActions product={product} />
          <div className="product-assurances">
            <div><Check aria-hidden="true" size={15} /><span>Stock comprobado por Laravel al crear la orden</span></div>
            <div><ShieldCheck aria-hidden="true" size={15} /><span>Pago procesado por Stripe</span></div>
            <div><PackageCheck aria-hidden="true" size={15} /><span>Seguimiento en tu cuenta</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}
