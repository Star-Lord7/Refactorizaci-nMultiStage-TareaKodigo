'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useCart } from '@/components/storefront/cart-provider'

export function ClearCartLink({ href = '/products', children = 'Seguir comprando' }: { href?: string; children?: string }) {
  const { clear } = useCart()
  return (
    <Link className="button button-primary" href={href} onClick={() => clear()}>
      {children} <ArrowRight aria-hidden="true" size={16} />
    </Link>
  )
}
