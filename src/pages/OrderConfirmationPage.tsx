import { Link, useParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import { PageMeta } from '@/components/common/PageMeta'
import { ButtonLink, EmptyState, Skeleton } from '@/components/ui'
import { useOrderByReference } from '@/features/orders/orders.queries'
import { OrderLines, StatusBadge, paymentLabels } from '@/features/orders/OrderSummary'
import { formatDateTime } from '@/lib/utils'

export default function OrderConfirmationPage() {
  const { reference } = useParams<{ reference: string }>()
  const { data: order, isLoading } = useOrderByReference(reference)

  if (isLoading) {
    return (
      <div className="shell grid gap-6 py-16">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="shell py-16">
        <PageMeta title="Order not found" />
        <EmptyState
          title="We could not find that order"
          description="Check the reference in your confirmation email, or sign in to see your order history."
          action={<ButtonLink to="/account/orders">Go to my orders</ButtonLink>}
        />
      </div>
    )
  }

  return (
    <>
      <PageMeta title={`Order ${order.reference}`} />
      <div className="shell grid gap-12 pt-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20 lg:pt-16">
        <div>
          <p className="inline-flex items-center gap-2 text-[0.9375rem] font-medium text-verified">
            <span className="grid size-6 place-items-center rounded-full bg-verified text-white">
              <Check size={14} strokeWidth={2.5} />
            </span>
            Order placed
          </p>
          <h1 className="mt-4 text-title">
            Thanks, {order.shipTo.fullName.split(' ')[0]}. It is on the way to being packed.
          </h1>
          <p className="prose-reading mt-5">
            Your reference is <span className="tabular font-sans font-semibold text-ink">{order.reference}</span>.
            A confirmation has gone to {order.shipTo.email}, and the courier will text{' '}
            {order.shipTo.phone} when it is out for delivery.
          </p>

          {order.paymentMethod === 'gcash' && (
            <div className="mt-8 border border-rule bg-white p-5">
              <h2 className="text-[1.0625rem] font-semibold">Next: pay by GCash</h2>
              <p className="prose-reading mt-2 text-[0.9375rem]">
                A payment request for the total will arrive on {order.shipTo.phone} within a few minutes.
                The order ships once it is paid.
              </p>
            </div>
          )}

          {order.paymentMethod === 'bank-transfer' && (
            <div className="mt-8 border border-rule bg-white p-5">
              <h2 className="text-[1.0625rem] font-semibold">Next: transfer the total</h2>
              <dl className="mt-3 grid gap-1.5 text-[0.9375rem]">
                <div className="grid grid-cols-[7rem_1fr]"><dt className="text-ink-faint">Bank</dt><dd>BPI</dd></div>
                <div className="grid grid-cols-[7rem_1fr]"><dt className="text-ink-faint">Account name</dt><dd>Dr. Alvin Professional Skin Care</dd></div>
                <div className="grid grid-cols-[7rem_1fr]"><dt className="text-ink-faint">Account no.</dt><dd className="tabular">0000 0000 00</dd></div>
                <div className="grid grid-cols-[7rem_1fr]"><dt className="text-ink-faint">Reference</dt><dd className="tabular font-medium">{order.reference}</dd></div>
              </dl>
              <p className="mt-3 text-[0.8125rem] text-ink-faint">Send the deposit slip to hello@dr-alvin.com with the reference in the subject.</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink to="/shop" variant="ink">
              Keep shopping
            </ButtonLink>
            <Link to="/account/orders" className="inline-flex h-11 items-center text-[0.9375rem] font-medium text-violet underline decoration-violet/30 underline-offset-4 hover:decoration-violet">
              View all my orders
            </Link>
          </div>
        </div>

        <aside className="self-start border border-rule bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-heading">Order {order.reference}</h2>
              <p className="mt-1 text-sm text-ink-faint">{formatDateTime(order.placedAt)}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <div className="mt-5">
            <OrderLines order={order} />
          </div>

          <dl className="mt-6 grid gap-4 border-t border-rule pt-5 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-medium">Delivering to</dt>
              <dd className="mt-1 leading-relaxed text-ink-soft">
                {order.shipTo.fullName}
                <br />
                {order.shipTo.street}, {order.shipTo.barangay}
                <br />
                {order.shipTo.city}, {order.shipTo.province} {order.shipTo.postalCode}
              </dd>
            </div>
            <div>
              <dt className="font-medium">Payment</dt>
              <dd className="mt-1 text-ink-soft">{paymentLabels[order.paymentMethod]}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </>
  )
}
