export function formatPrice(value: string | number, currency = 'EUR') {
  const amount = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(amount)) return '—'

  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Fecha no disponible'

  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function orderStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    paid: 'Pagada',
    cancelled: 'Cancelada',
  }
  return labels[status] ?? status
}

export function paymentStatusLabel(status: string | undefined) {
  if (!status) return 'Sin pago'
  const labels: Record<string, string> = {
    succeeded: 'Confirmado',
    processing: 'En proceso',
    requires_payment_method: 'Requiere pago',
    requires_action: 'Acción requerida',
    canceled: 'Cancelado',
  }
  return labels[status] ?? status
}
