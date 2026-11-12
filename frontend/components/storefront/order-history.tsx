import Link from 'next/link'
import { ArrowLeft, ArrowRight, PackageOpen } from 'lucide-react'
import { getOrders } from '@/lib/queries'
import type { ApiUser } from '@/lib/types'
import { ApiNotice, RouteProblem } from '@/components/storefront/api-feedback'
import { OrderCard } from '@/components/storefront/order-card'
import { logoutAction } from '@/app/actions/auth'

export async function OrderHistory({ token, user, page }: { token: string; user: ApiUser; page: number }) {
  const result = await getOrders(token, page)
  return (
    <>
      <div className="account-heading">
        <div><span className="eyebrow">TU CUENTA</span><h1>Hola, {user.name.split(' ')[0]}.</h1><p>Un lugar sencillo para seguir tus compras.</p></div>
        <form action={logoutAction}><button className="button button-quiet" type="submit">Cerrar sesión</button></form>
      </div>
      <div className="orders-section-heading"><div><span className="eyebrow">HISTORIAL</span><h2>Mis órdenes</h2></div><Link className="text-link" href="/products">Ir a la tienda <ArrowRight aria-hidden="true" size={15} /></Link></div>
      {result.state === 'unconfigured' ? <ApiNotice message={result.message} /> : null}
      {result.state === 'unavailable' ? <RouteProblem title="No se pudo cargar el historial" message={result.message} href="/account/orders" label="Volver a intentar" /> : null}
      {result.state === 'ready' && result.data.orders.length === 0 ? (
        <div className="empty-state order-empty"><PackageOpen aria-hidden="true" size={26} /><h3>Aún no hay órdenes</h3><p>Cuando completes tu primera compra, aparecerá aquí.</p><Link className="text-link" href="/products">Explorar el catálogo <ArrowRight aria-hidden="true" size={15} /></Link></div>
      ) : null}
      {result.state === 'ready' && result.data.orders.length > 0 ? <div className="order-list">{result.data.orders.map((order) => <OrderCard key={order.id} order={order} />)}</div> : null}
      {result.state === 'ready' && result.data.lastPage > 1 ? (
        <nav className="catalog-pagination" aria-label="Páginas del historial">
          {result.data.page > 1 ? <Link href={`/account/orders?page=${result.data.page - 1}`}><ArrowLeft aria-hidden="true" size={15} /> Anterior</Link> : <span aria-disabled="true"><ArrowLeft aria-hidden="true" size={15} /> Anterior</span>}
          <span className="pagination-current">Página {result.data.page} de {result.data.lastPage} · {result.data.total} órdenes</span>
          {result.data.page < result.data.lastPage ? <Link href={`/account/orders?page=${result.data.page + 1}`}>Siguiente <ArrowRight aria-hidden="true" size={15} /></Link> : <span aria-disabled="true">Siguiente <ArrowRight aria-hidden="true" size={15} /></span>}
        </nav>
      ) : null}
    </>
  )
}
