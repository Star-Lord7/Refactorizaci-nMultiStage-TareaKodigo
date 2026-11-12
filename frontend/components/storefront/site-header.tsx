import Link from 'next/link'
import { ArrowUpRight, UserRound } from 'lucide-react'
import type { ApiUser } from '@/lib/types'
import { CartLink } from '@/components/storefront/cart-link'

export function SiteHeader({ user }: { user: ApiUser | null }) {
  return (
    <>
      <div className="announcement-bar">
        <div className="shell announcement-inner">
          <span>Accesorios para una rutina digital más cómoda</span>
          <span className="announcement-note">Pagos procesados de forma segura por Stripe</span>
        </div>
      </div>
      <header className="site-header">
        <div className="shell header-inner">
          <Link href="/" className="brand" aria-label="NODO, inicio">
            <span className="brand-mark" aria-hidden="true">N</span>
            <span>NODO<span className="brand-period">.</span></span>
          </Link>
          <nav className="main-nav" aria-label="Navegación principal">
            <Link href="/products">Tienda</Link>
            <Link href="/#enfoque">Nuestro enfoque</Link>
            {user ? <Link href="/account/orders">Mis compras</Link> : null}
          </nav>
          <div className="header-actions">
            {user ? (
              <Link className="nav-account" href="/account/orders" aria-label={`Cuenta de ${user.name}`}>
                <UserRound aria-hidden="true" size={18} />
                <span className="account-name">{user.name.split(' ')[0]}</span>
                <ArrowUpRight aria-hidden="true" size={14} />
              </Link>
            ) : (
              <Link className="nav-account" href="/login" aria-label="Iniciar sesión">
                <UserRound aria-hidden="true" size={18} />
                <span>Entrar</span>
              </Link>
            )}
            <CartLink />
          </div>
        </div>
      </header>
    </>
  )
}
