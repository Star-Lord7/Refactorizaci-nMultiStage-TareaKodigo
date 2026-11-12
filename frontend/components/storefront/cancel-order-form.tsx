'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { LoaderCircle, X } from 'lucide-react'
import { cancelOrderAction, type OrderActionState } from '@/app/actions/orders'

const initialState: OrderActionState = { error: null }

function CancelButton() {
  const { pending } = useFormStatus()
  return (
    <button className="button button-quiet button-danger" type="submit" disabled={pending}>
      {pending ? <LoaderCircle className="spin" aria-hidden="true" size={15} /> : <X aria-hidden="true" size={15} />}
      {pending ? 'Cancelando…' : 'Cancelar orden'}
    </button>
  )
}

export function CancelOrderForm({ orderId }: { orderId: number }) {
  const [state, action] = useActionState(cancelOrderAction, initialState)
  return (
    <div className="cancel-order-wrap">
      <form action={action}>
        <input type="hidden" name="order_id" value={orderId} />
        <CancelButton />
      </form>
      {state.error ? <p className="form-error" role="alert">{state.error}</p> : null}
    </div>
  )
}
