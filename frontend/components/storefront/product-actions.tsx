'use client'

import { useState } from 'react'
import { Check, Plus } from 'lucide-react'
import { useCart } from '@/components/storefront/cart-provider'
import type { Product } from '@/lib/types'

export function AddToCartButton({ product, compact = false, quantity = 1 }: {
  product: Product
  compact?: boolean
  quantity?: number
}) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)
  const disabled = product.stock < 1

  return (
    <button
      className={compact ? 'button button-add button-add-compact' : 'button button-primary button-add'}
      type="button"
      disabled={disabled}
      onClick={() => {
        add(product, quantity)
        setAdded(true)
      }}
      aria-live="polite"
    >
      {disabled ? 'Agotado' : added ? <><Check aria-hidden="true" size={16} /> Añadido</> : <><Plus aria-hidden="true" size={16} /> Añadir</>}
    </button>
  )
}

export function ProductDetailActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="detail-actions">
      <label className="quantity-field">
        <span>Cantidad</span>
        <input
          aria-label="Cantidad de productos"
          type="number"
          min={1}
          max={Math.min(product.stock, 100)}
          value={quantity}
          disabled={product.stock < 1}
          onChange={(event) => {
            const next = Number(event.currentTarget.value)
            if (Number.isInteger(next)) setQuantity(Math.max(1, Math.min(next, product.stock, 100)))
          }}
        />
      </label>
      <AddToCartButton product={product} quantity={quantity} />
    </div>
  )
}
