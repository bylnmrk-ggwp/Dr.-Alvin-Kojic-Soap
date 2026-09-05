import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'
import { useMyOrders } from '@/features/orders/orders.queries'
import { StatusBadge } from '@/features/orders/OrderSummary'
import { formatDate, formatPrice } from '@/lib/utils'
import { ButtonLink } from '@/components/ui'

export default function AccountOverview() {
  const { user, profile } = useAuth()
  const { data: orders = [] } = useMyOrders(user?.id ?? null)
  const latest = orders[0]

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
      <section>
        <h2 className="text-heading">Details</h2>
        <dl className="mt-4 grid gap-3 border-t border-rule pt-4 text-[0.9375rem]">
          <div className="grid grid-cols-[8rem_1fr] gap-4">
            <dt className="text-ink-faint">Name</dt>
            <dd>{profile?.fullName || (user?.user_metadata?.full_name as string | undefined) || 'Not set'}</dd>
          </div>
          <div className="grid grid-cols-[8rem_1fr] gap-4">
            <dt className="text-ink-faint">Email</dt>
            <dd className="break-all">{user?.email}</dd>
          </div>
          <div className="grid grid-cols-[8rem_1fr] gap-4">
            <dt className="text-ink-faint">Mobile</dt>
            <dd>{profile?.phone || (user?.user_metadata?.phone as string | undefined) || 'Not set'}</dd>
          </div>
          <div className="grid grid-cols-[8rem_1fr] gap-4">
            <dt className="text-ink-faint">Member since</dt>
            <dd>{user?.created_at ? formatDate(user.created_at) : 'Today'}</dd>
          </div>
        </dl>
      </section>

      <section>
        <h2 className="text-heading">Latest order</h2>
        {latest ? (
          <Link
            to={`/order/${latest.reference}`}
            className="mt-4 block border border-rule bg-white p-5 transition-colors hover:border-violet"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="tabular font-semibold">{latest.reference}</p>
                <p className="mt-0.5 text-sm text-ink-faint">{formatDate(latest.placedAt)}</p>
              </div>
              <StatusBadge status={latest.status} />
            </div>
            <p className="mt-4 text-sm text-ink-soft">
              {latest.items.length} {latest.items.length === 1 ? 'item' : 'items'}, {formatPrice(latest.totalCentavos)}
            </p>
          </Link>
        ) : (
          <div className="mt-4 border border-rule bg-white p-6">
            <p className="text-[0.9375rem] text-ink-soft">No orders yet. The maintenance set is where most people begin.</p>
            <ButtonLink to="/product/all-in-1-maintenance-set" variant="ink" size="sm" className="mt-4">
              See the maintenance set
            </ButtonLink>
          </div>
        )}
      </section>
    </div>
  )
}
