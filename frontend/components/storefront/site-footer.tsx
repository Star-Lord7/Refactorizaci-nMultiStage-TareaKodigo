import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <div className="footer-brand-block">
          <Link href="/" className="brand brand-footer" aria-label="NODO, inicio">
            <span className="brand-mark" aria-hidden="true">N</span>
            <span>NODO<span className="brand-period">.</span></span>
          </Link>
          <p>Herramientas pequeñas para hacer grandes cosas.</p>
        </div>
        <div className="footer-links">
          <span className="footer-label">Explora</span>
          <Link href="/products">Tienda <ArrowUpRight aria-hidden="true" size={14} /></Link>
          <Link href="/cart">Carrito <ArrowUpRight aria-hidden="true" size={14} /></Link>
          <Link href="/account/orders">Mis compras <ArrowUpRight aria-hidden="true" size={14} /></Link>
        </div>
        <div className="footer-links">
          <span className="footer-label">Tu cuenta</span>
          <Link href="/login">Iniciar sesión <ArrowUpRight aria-hidden="true" size={14} /></Link>
          <Link href="/register">Crear cuenta <ArrowUpRight aria-hidden="true" size={14} /></Link>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} NODO. Interfaz conectada a la API de Laravel.</span>
        <span>Diseñado para comprar con claridad.</span>
      </div>
    </footer>
  )
}
