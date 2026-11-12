export interface ApiUser {
  id: number
  name: string
  email: string
}

export interface Product {
  id: number
  name: string
  description: string | null
  price: string | number
  stock: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface Payment {
  id: number
  amount: number
  currency: string
  status: string
  stripe_payment_intent_id?: string
}

export interface OrderItem {
  id: number
  product_id: number
  quantity: number
  price: string | number
  subtotal: string | number
  product: Pick<Product, 'id' | 'name'> | null
}

export interface Order {
  id: number
  total: string | number
  status: string
  created_at: string
  updated_at?: string
  items: OrderItem[]
  payment: Payment | null
}

export interface LaravelPagination<T> {
  current_page: number
  data: T[]
  last_page: number
  per_page: number
  total: number
}

export interface ApiEnvelope<T> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
}

export type CatalogResult =
  | {
      state: 'ready'
      products: Product[]
      page: number
      lastPage: number
      total: number
    }
  | { state: 'unconfigured'; message: string }
  | { state: 'unavailable'; message: string }

export type ProductResult =
  | { state: 'ready'; product: Product }
  | { state: 'not-found' }
  | { state: 'unconfigured'; message: string }
  | { state: 'unavailable'; message: string }

export type QueryResult<T> =
  | { state: 'ready'; data: T }
  | { state: 'not-found' }
  | { state: 'unconfigured'; message: string }
  | { state: 'unavailable'; message: string }
