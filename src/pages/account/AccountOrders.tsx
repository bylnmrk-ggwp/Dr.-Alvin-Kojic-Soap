import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'
import { useMyOrders } from '@/features/orders/orders.queries'
import { StatusBadge, paymentLabels } from '@/features/orders/OrderSummary'
import { ButtonLink, EmptyState, Skeleton } from '@/components/ui'
import { formatDate, formatPrice } from '@/lib/utils'

export default function AccountOrders() {
  const { user } = useAuth()
  const { data: orders = [], isLoading } = useMyOrders(user?.id ?? null)

  if (isLoading) {
    return (
      <div className="grid gap-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        description="When you place one it will appear here with its status and a reorder option."
        action={<ButtonLink to="/shop">Start shopping</ButtonLink>}
      />
    )
  }

  return (
    <ul className="grid gap-3">
      {orders.map((order) => (
        <li key={order.id}>
          <Link
            to={`/order/${order.reference}`}
            className="grid gap-4 border border-rule bg-white p-5 transition-colors hover:border-violet sm:grid-cols-[1fr_auto] sm:items-center"
          >
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="tabular font-semibold">{order.reference}</p>
                <StatusBadge status={order.status} />
              </div>
              <p className="mt-1.5 text-sm text-ink-soft">
                {formatDate(order.placedAt)}, {paymentLabels[order.paymentMethod]}
              </p>
              <p className="mt-2 truncate text-sm text-ink-faint">
                {order.items.map((item) => `${item.name} × ${item.quantity}`).join(', ')}
              </p>
            </div>
            <p className="tabular text-lg font-semibold sm:text-right">{formatPrice(order.totalCentavos)}</p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
