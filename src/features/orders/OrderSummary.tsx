import { Badge } from '@/components/ui'
import { formatPrice } from '@/lib/utils'
import type { Order, OrderStatus, PaymentMethod } from '@/types'

export const statusLabels: Record<OrderStatus, string> = {
  pending: 'Awaiting confirmation',
  paid: 'Payment received',
  packed: 'Packed',
  shipped: 'On its way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export const paymentLabels: Record<PaymentMethod, string> = {
  cod: 'Cash on delivery',
  gcash: 'GCash',
  'bank-transfer': 'Bank transfer',
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  const tone =
    status === 'delivered' ? 'verified' : status === 'cancelled' ? 'muted' : status === 'shipped' ? 'violet' : 'marigold'
  return <Badge tone={tone}>{statusLabels[status]}</Badge>
}

export function OrderLines({ order }: { order: Order }) {
  return (
    <div>
      <ul className="divide-y divide-rule">
        {order.items.map((item) => (
          <li key={`${item.productId}-${item.name}`} className="flex items-baseline justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-[0.9375rem] font-medium">{item.name}</p>
              <p className="text-[0.8125rem] text-ink-faint">
                {item.sizeLabel}, × {item.quantity}
              </p>
            </div>
            <span className="tabular shrink-0 text-[0.9375rem]">
              {formatPrice(item.unitPriceCentavos * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <dl className="mt-3 grid gap-2 border-t border-rule pt-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink-soft">Subtotal</dt>
          <dd className="tabular">{formatPrice(order.subtotalCentavos)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-soft">Shipping</dt>
          <dd className="tabular">{order.shippingCentavos === 0 ? 'Free' : formatPrice(order.shippingCentavos)}</dd>
        </div>
        <div className="flex justify-between border-t border-rule pt-2 text-base font-semibold">
          <dt>Total</dt>
          <dd className="tabular">{formatPrice(order.totalCentavos)}</dd>
        </div>
      </dl>
    </div>
  )
}
