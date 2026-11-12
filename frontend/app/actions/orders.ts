'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { apiRequest, getApiErrorMessage } from '@/lib/api'
import { getAccessToken } from '@/lib/session'
import type { Order } from '@/lib/types'

export interface CheckoutActionState {
  orderId: number | null
  clientSecret: string | null
  error: string | null
}

export interface OrderActionState {
  error: string | null
}

const emptyCheckoutState: CheckoutActionState = {
  orderId: null,
  clientSecret: null,
  error: null,
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseOrderItems(value: FormDataEntryValue | null) {
  if (typeof value !== 'string') return null

  let parsed: unknown
  try {
    parsed = JSON.parse(value)
  } catch {
    return null
  }

  if (!Array.isArray(parsed) || parsed.length < 1 || parsed.length > 50) return null

  const quantities = new Map<number, number>()
  for (const line of parsed) {
    if (!isRecord(line)) return null
    const productId = line.product_id
    const quantity = line.quantity
    if (!Number.isInteger(productId) || Number(productId) < 1) return null
    if (!Number.isInteger(quantity) || Number(quantity) < 1 || Number(quantity) > 100) return null
    const id = Number(productId)
    const totalQuantity = (quantities.get(id) ?? 0) + Number(quantity)
    if (totalQuantity > 100) return null
    quantities.set(id, totalQuantity)
  }

  return Array.from(quantities, ([product_id, quantity]) => ({ product_id, quantity }))
}

async function createPaymentIntent(orderId: number, token: string) {
  const response = await apiRequest<{ client_secret: string }>(`/orders/${orderId}/payment`, {
    method: 'POST',
    token,
  })
  if (!response.data?.client_secret) throw new Error('La API no devolvió el client secret del pago.')
  return response.data.client_secret
}

export async function createOrderAction(
  _state: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const items = parseOrderItems(formData.get('items'))
  if (!items) return { ...emptyCheckoutState, error: 'Revisa los productos y las cantidades del carrito.' }

  const token = await getAccessToken()
  if (!token) return { ...emptyCheckoutState, error: 'Tu sesión terminó. Inicia sesión antes de pagar.' }

  let order: Order
  try {
    const response = await apiRequest<Order>('/orders', {
      method: 'POST',
      token,
      body: { items },
    })
    order = response.data
    if (!order || !Number.isInteger(order.id)) {
      return { ...emptyCheckoutState, error: 'La API no confirmó la creación de la orden.' }
    }
  } catch (error) {
    return { ...emptyCheckoutState, error: getApiErrorMessage(error, 'No se pudo crear la orden. Comprueba el stock e inténtalo de nuevo.') }
  }

  revalidatePath('/account/orders')
  revalidatePath(`/account/orders/${order.id}`)

  try {
    const clientSecret = await createPaymentIntent(order.id, token)
    return { orderId: order.id, clientSecret, error: null }
  } catch (error) {
    return {
      orderId: order.id,
      clientSecret: null,
      error: getApiErrorMessage(error, 'La orden se creó, pero no se pudo iniciar el pago. Puedes intentarlo de nuevo o cancelar la orden.'),
    }
  }
}

export async function retryPaymentAction(
  _state: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const orderId = Number(formData.get('order_id'))
  if (!Number.isInteger(orderId) || orderId < 1) {
    return { ...emptyCheckoutState, error: 'No se encontró una orden válida.' }
  }

  const token = await getAccessToken()
  if (!token) return { ...emptyCheckoutState, orderId, error: 'Tu sesión terminó. Inicia sesión para continuar.' }

  try {
    const clientSecret = await createPaymentIntent(orderId, token)
    revalidatePath(`/account/orders/${orderId}`)
    return { orderId, clientSecret, error: null }
  } catch (error) {
    return {
      ...emptyCheckoutState,
      orderId,
      error: getApiErrorMessage(error, 'No se pudo iniciar el pago. Inténtalo de nuevo.'),
    }
  }
}

export async function cancelOrderAction(
  _state: OrderActionState,
  formData: FormData,
): Promise<OrderActionState> {
  const orderId = Number(formData.get('order_id'))
  if (!Number.isInteger(orderId) || orderId < 1) return { error: 'No se encontró una orden válida.' }

  const token = await getAccessToken()
  if (!token) return { error: 'Tu sesión terminó. Inicia sesión e inténtalo de nuevo.' }

  try {
    await apiRequest(`/orders/${orderId}/cancel`, { method: 'POST', token })
  } catch (error) {
    return { error: getApiErrorMessage(error, 'No se pudo cancelar la orden. Puede que ya haya cambiado de estado.') }
  }

  revalidatePath('/account/orders')
  revalidatePath(`/account/orders/${orderId}`)
  redirect(`/checkout/cancelled?order_id=${orderId}`)
}
