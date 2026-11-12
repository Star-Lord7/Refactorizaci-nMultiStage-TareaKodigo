'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/components/storefront/cart-provider'

export function CartLink() {
  const { count } = useCart()

  return (
    <Link className="nav-cart" href="/cart" aria-label={`Carrito, ${count} productos`}>
      <ShoppingBag aria-hidden="true" size={18} />
      <span>Carrito</span>
      <span className="cart-count" aria-live="polite">{count}</span>
    </Link>
  )
}
