import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { PageMeta } from '@/components/common/PageMeta'
import { Button } from '@/components/ui'
import { useAuth } from '@/features/auth/useAuth'
import { cn } from '@/lib/utils'

const tabs = [
  { to: '/account', label: 'Overview', end: true },
  { to: '/account/orders', label: 'Orders', end: false },
]

export default function AccountPage() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  const displayName = profile?.fullName || (user?.user_metadata?.full_name as string | undefined) || user?.email || 'Your account'

  return (
    <>
      <PageMeta title="Your account" />
      <div className="shell pt-12 lg:pt-16">
        <header className="flex flex-col gap-6 border-b border-rule pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-ink-faint">Signed in as {user?.email}</p>
            <h1 className="mt-1 text-title">{displayName}</h1>
            {profile?.isDistributor && (
              <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-verified">
                Authorised seller
              </p>
            )}
          </div>
          <div className="flex gap-3">
            {!profile?.isDistributor && (
              <Link to="/distributor" className="inline-flex h-11 items-center text-[0.9375rem] font-medium text-violet underline decoration-violet/30 underline-offset-4 hover:decoration-violet">
                Become a seller
              </Link>
            )}
            <Button
              variant="outline"
              onClick={async () => {
                await signOut()
                navigate('/')
              }}
            >
              Sign out
            </Button>
          </div>
        </header>

        <nav aria-label="Account sections" className="mt-6 flex gap-1 border-b border-rule">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                cn(
                  '-mb-px border-b-2 px-3 py-3 text-[0.9375rem] font-medium transition-colors',
                  isActive ? 'border-violet text-violet' : 'border-transparent text-ink-soft hover:text-ink',
                )
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>

        <div className="py-10">
          <Outlet />
        </div>
      </div>
    </>
  )
}
