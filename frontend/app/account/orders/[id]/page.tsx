import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { ApiNotice, RouteProblem } from '@/components/storefront/api-feedback'
import { OrderDetail } from '@/components/storefront/order-detail'
import { getOrder } from '@/lib/queries'
import { requireUser } from '@/lib/session'

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params
  const id = Number(rawId)
  if (!Number.isInteger(id) || id < 1) notFound()
  const { token } = await requireUser(`/account/orders/${id}`)
  const result = await getOrder(id, token)
  if (result.state === 'not-found') notFound()
  if (result.state === 'unconfigured') return <section className="shell account-page"><ApiNotice message={result.message} /></section>
  if (result.state === 'unavailable') return <section className="shell account-page"><RouteProblem title="No se pudo consultar esta orden" message={result.message} href="/account/orders" label="Volver a mis órdenes" /></section>
  return <section className="shell account-page"><OrderDetail order={result.data} /></section>
}
