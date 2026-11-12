import 'server-only'

import { apiRequest, ApiConfigurationError, ApiHttpError, getApiErrorMessage } from '@/lib/api'
import type {
  ApiUser,
  CatalogResult,
  LaravelPagination,
  Order,
  Product,
  ProductResult,
  QueryResult,
} from '@/lib/types'

export async function getProducts(page = 1): Promise<CatalogResult> {
  try {
    const response = await apiRequest<LaravelPagination<Product>>(`/products?page=${page}`)
    const pagination = response.data
    if (!pagination || !Array.isArray(pagination.data)) {
      return { state: 'unavailable', message: 'La API devolvió un catálogo con un formato inesperado.' }
    }

    return {
      state: 'ready',
      products: pagination.data,
      page: pagination.current_page,
      lastPage: pagination.last_page,
      total: pagination.total,
    }
  } catch (error) {
    return {
      state: error instanceof ApiConfigurationError ? 'unconfigured' : 'unavailable',
      message: getApiErrorMessage(error, 'No se pudo cargar el catálogo. Comprueba la conexión con la API.'),
    }
  }
}

export async function getProduct(id: number): Promise<ProductResult> {
  try {
    const response = await apiRequest<Product>(`/products/${id}`)
    if (!response.data || typeof response.data.id !== 'number') {
      return { state: 'unavailable', message: 'La API devolvió un producto con un formato inesperado.' }
    }
    return { state: 'ready', product: response.data }
  } catch (error) {
    if (error instanceof ApiHttpError && error.status === 404) return { state: 'not-found' }
    return {
      state: error instanceof ApiConfigurationError ? 'unconfigured' : 'unavailable',
      message: getApiErrorMessage(error, 'No se pudo cargar este producto. Inténtalo de nuevo más tarde.'),
    }
  }
}

export async function getOrders(token: string, page = 1): Promise<QueryResult<{ orders: Order[]; page: number; lastPage: number; total: number }>> {
  try {
    const response = await apiRequest<LaravelPagination<Order>>(`/orders?page=${page}`, { token })
    const pagination = response.data
    if (!pagination || !Array.isArray(pagination.data)) {
      return { state: 'unavailable', message: 'La API devolvió un historial con un formato inesperado.' }
    }
    return {
      state: 'ready',
      data: {
        orders: pagination.data,
        page: pagination.current_page,
        lastPage: pagination.last_page,
        total: pagination.total,
      },
    }
  } catch (error) {
    return {
      state: error instanceof ApiConfigurationError ? 'unconfigured' : 'unavailable',
      message: getApiErrorMessage(error, 'No se pudo cargar tu historial de compras.'),
    }
  }
}

export async function getOrder(id: number, token: string): Promise<QueryResult<Order>> {
  try {
    const response = await apiRequest<Order>(`/orders/${id}`, { token })
    if (!response.data || typeof response.data.id !== 'number') {
      return { state: 'unavailable', message: 'La API devolvió una orden con un formato inesperado.' }
    }
    return { state: 'ready', data: response.data }
  } catch (error) {
    if (error instanceof ApiHttpError && error.status === 404) return { state: 'not-found' }
    return {
      state: error instanceof ApiConfigurationError ? 'unconfigured' : 'unavailable',
      message: getApiErrorMessage(error, 'No se pudo consultar esta orden.'),
    }
  }
}

export async function getApiUser(token: string) {
  const response = await apiRequest<ApiUser>('/me', { token })
  return response.data
}
