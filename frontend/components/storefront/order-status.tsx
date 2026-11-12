import { orderStatusLabel, paymentStatusLabel } from '@/lib/format'

export function OrderStatus({ status }: { status: string }) {
  return <span className={`status-badge status-${status}`}>{orderStatusLabel(status)}</span>
}

export function PaymentStatus({ status }: { status: string | undefined }) {
  return <span className="payment-status">Pago: {paymentStatusLabel(status)}</span>
}
