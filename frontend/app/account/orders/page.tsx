import { OrderHistory } from '@/components/storefront/order-history'
import { requireUser } from '@/lib/session'

export const metadata = {
  title: 'Mis órdenes | NODO',
  description: 'Consulta el estado de tus compras en NODO.',
}

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { token, user } = await requireUser('/account/orders')
  const params = await searchParams
  const requestedPage = Number(params.page)
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
  return <section className="shell account-page"><OrderHistory token={token} user={user} page={page} /></section>
}
