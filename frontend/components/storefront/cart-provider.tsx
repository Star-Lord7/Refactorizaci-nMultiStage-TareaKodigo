'use client'

import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react'
import type { Product } from '@/lib/types'

export interface CartLine {
  product: Product
  quantity: number
}

interface CartState {
  items: CartLine[]
}

type CartAction =
  | { type: 'add'; product: Product; quantity: number }
  | { type: 'set-quantity'; productId: number; quantity: number }
  | { type: 'remove'; productId: number }
  | { type: 'clear' }

function cartReducer(state: CartState, action: CartAction): CartState {
  if (action.type === 'clear') return { items: [] }
  if (action.type === 'remove') {
    return { items: state.items.filter((line) => line.product.id !== action.productId) }
  }

  if (action.type === 'set-quantity') {
    return {
      items: state.items
        .map((line) =>
          line.product.id === action.productId
            ? { ...line, quantity: Math.min(Math.max(1, action.quantity), line.product.stock, 100) }
            : line,
        )
        .filter((line) => line.product.stock > 0),
    }
  }

  const existing = state.items.find((line) => line.product.id === action.product.id)
  if (!existing) {
    return {
      items: [
        ...state.items,
        { product: action.product, quantity: Math.min(action.quantity, action.product.stock, 100) },
      ],
    }
  }

  return {
    items: state.items.map((line) =>
      line.product.id === action.product.id
        ? {
            ...line,
            product: action.product,
            quantity: Math.min(line.quantity + action.quantity, action.product.stock, 100),
          }
        : line,
    ),
  }
}

interface CartContextValue {
  items: CartLine[]
  count: number
  total: number
  add: (product: Product, quantity?: number) => void
  setQuantity: (productId: number, quantity: number) => void
  remove: (productId: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })
  const add = useCallback((product: Product, quantity = 1) => {
    if (product.stock < 1) return
    dispatch({ type: 'add', product, quantity: Math.max(1, Math.floor(quantity)) })
  }, [])
  const setQuantity = useCallback((productId: number, quantity: number) => {
    dispatch({ type: 'set-quantity', productId, quantity: Math.floor(quantity) })
  }, [])
  const remove = useCallback((productId: number) => dispatch({ type: 'remove', productId }), [])
  const clear = useCallback(() => dispatch({ type: 'clear' }), [])

  const value = useMemo<CartContextValue>(() => {
    const count = state.items.reduce((total, line) => total + line.quantity, 0)
    const total = state.items.reduce(
      (sum, line) => sum + Number(line.product.price) * line.quantity,
      0,
    )
    return { items: state.items, count, total, add, setQuantity, remove, clear }
  }, [state.items, add, setQuantity, remove, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart debe utilizarse dentro de CartProvider.')
  return context
}
