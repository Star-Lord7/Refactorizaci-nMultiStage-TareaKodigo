import { notFound } from 'next/navigation'
import { ProductDetailContent } from '@/components/storefront/product-detail-content'
import { ApiNotice } from '@/components/storefront/api-feedback'
import { getProduct } from '@/lib/queries'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params
  const id = Number(rawId)
  if (!Number.isInteger(id) || id < 1) notFound()

  const result = await getProduct(id)
  if (result.state === 'not-found') notFound()
  if (result.state !== 'ready') {
    return <section className="shell product-unavailable"><ApiNotice message={result.message} configured={result.state === 'unavailable'} /></section>
  }

  return <ProductDetailContent product={result.product} />
}
