import { Link, NavLink, Outlet } from 'react-router-dom'
import { PageMeta } from '@/components/common/PageMeta'
import { useAuth } from '@/features/auth/useAuth'
import { cn } from '@/lib/utils'

const tabs = [
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/inbox', label: 'Inbox' },
]

export default function AdminLayout() {
  const { user } = useAuth()

  return (
    <>
      <PageMeta title="Store admin" />
      <div className="shell pt-12 lg:pt-16">
        <header className="flex flex-col gap-6 border-b border-rule pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-ink-faint">Signed in as {user?.email}</p>
            <h1 className="mt-1 text-title">Store admin</h1>
          </div>
          <Link
            to="/account"
            className="inline-flex h-11 items-center text-[0.9375rem] font-medium text-violet underline decoration-violet/30 underline-offset-4 hover:decoration-violet"
          >
            Your account
          </Link>
        </header>

        <nav aria-label="Admin sections" className="mt-6 flex gap-1 border-b border-rule">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
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
