import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/components/storefront/cart-provider'
import { SiteFooter } from '@/components/storefront/site-footer'
import { SiteHeader } from '@/components/storefront/site-header'
import { getCurrentUser } from '@/lib/session'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'NODO — Tecnología de uso diario',
    template: '%s | NODO',
  },
  description: 'Accesorios tecnológicos seleccionados para trabajar, jugar y crear con más comodidad.',
  applicationName: 'NODO',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'NODO',
    title: 'NODO — Tecnología de uso diario',
    description: 'Accesorios tecnológicos seleccionados para trabajar, jugar y crear con más comodidad.',
  },
}

export const viewport: Viewport = {
  themeColor: '#f6f5f1',
  colorScheme: 'light',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser()

  return (
    <html lang="es">
      <body>
        <CartProvider>
          <SiteHeader user={user} />
          <main className="site-main">{children}</main>
          <SiteFooter />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
