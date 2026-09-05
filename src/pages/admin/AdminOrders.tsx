import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useAdminOrders, useUpdateOrderStatus } from '@/features/admin/admin.queries'
import { StatusSelect } from '@/features/admin/components/StatusSelect'
import { OrderLines, StatusBadge, paymentLabels, statusLabels } from '@/features/orders/OrderSummary'
import { EmptyState, Skeleton } from '@/components/ui'
import { cn, formatDateTime, formatPrice } from '@/lib/utils'
import type { Order, OrderStatus } from '@/types'

export default function AdminOrders() {
  const { data: orders = [], isLoading, error } = useAdminOrders()
  const updateStatus = useUpdateOrderStatus()

  return (
    <section aria-labelledby="admin-orders-heading">
      <h2 id="admin-orders-heading" className="text-heading">
        Orders
      </h2>
      <p className="mt-2 text-[0.9375rem] text-ink-soft">
        Newest first. Change the status as an order moves through packing and delivery; the customer sees it on their account page.
      </p>

      <div className="mt-6">
        {isLoading ? (
          <div className="grid gap-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : error ? (
          <p className="border border-alert/30 bg-white px-4 py-3.5 text-sm text-alert">{error.message}</p>
        ) : orders.length === 0 ? (
          <EmptyState title="No orders yet" description="Orders appear here the moment a customer places one." />
        ) : (
          <ul className="grid gap-3">
            {orders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                onStatusChange={(status) => updateStatus.mutate({ id: order.id, status })}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

function OrderRow({ order, onStatusChange }: { order: Order; onStatusChange: (status: OrderStatus) => void }) {
  const [open, setOpen] = useState(false)
  const detailsId = `order-${order.id}-details`

  return (
    <li className="border border-rule bg-white">
      <div className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto] lg:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <p className="tabular font-semibold">{order.reference}</p>
            <StatusBadge status={order.status} />
          </div>
          <p className="mt-1.5 text-sm text-ink-soft">
            {formatDateTime(order.placedAt)}, {paymentLabels[order.paymentMethod]}
          </p>
          <p className="mt-1 truncate text-sm">
            <span className="font-medium">{order.shipTo.fullName}</span>
            <span className="text-ink-faint">, </span>
            <a href={`mailto:${order.shipTo.email}`} className="text-ink-soft underline decoration-rule-strong underline-offset-4 hover:text-violet">
              {order.shipTo.email}
            </a>
          </p>
        </div>

        <p className="tabular text-lg font-semibold lg:px-4">{formatPrice(order.totalCentavos)}</p>

        <StatusSelect
          value={order.status}
          labels={statusLabels}
          label={`Status of order ${order.reference}`}
          onChange={onStatusChange}
        />

        <button
          type="button"
          aria-expanded={open}
          aria-controls={detailsId}
          onClick={() => setOpen((current) => !current)}
          className="inline-flex h-9 items-center gap-1.5 justify-self-start rounded-[3px] px-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-chalk hover:text-ink lg:justify-self-end"
        >
          {open ? 'Hide details' : 'Details'}
          <ChevronDown size={16} strokeWidth={1.75} className={cn('transition-transform', open && 'rotate-180')} />
        </button>
      </div>

      {open && (
        <div id={detailsId} className="grid gap-8 border-t border-rule bg-paper p-5 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-ink-faint">Items</h3>
            <div className="mt-2">
              <OrderLines order={order} />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-ink-faint">Ship to</h3>
            <address className="mt-2 text-[0.9375rem] not-italic leading-relaxed">
              <p className="font-medium">{order.shipTo.fullName}</p>
              <p>{order.shipTo.street}</p>
              <p>
                {order.shipTo.barangay}, {order.shipTo.city}
              </p>
              <p>
                {order.shipTo.province} {order.shipTo.postalCode}
              </p>
              <p className="mt-2 text-ink-soft">{order.shipTo.phone}</p>
              <p className="text-ink-soft">{order.shipTo.email}</p>
            </address>
            {order.shipTo.notes && (
              <p className="mt-3 border-l-2 border-rule-strong pl-3 text-sm text-ink-soft whitespace-pre-line">
                {order.shipTo.notes}
              </p>
            )}
          </div>
        </div>
      )}
    </li>
  )
}
