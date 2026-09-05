import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'
import { SupabaseNotice } from '@/pages/auth/SupabaseNotice'
import { ButtonLink } from '@/components/ui'

/** Wraps account routes: waits for the session, then redirects guests to sign in. */
export function ProtectedRoute() {
  const { user, isLoading, isConfigured } = useAuth()
  const location = useLocation()

  if (!isConfigured) {
    return (
      <div className="shell max-w-2xl py-16">
        <h1 className="text-title">Your account</h1>
        <SupabaseNotice className="mt-6" />
        <ButtonLink to="/shop" variant="ink" className="mt-8">
          Back to the shop
        </ButtonLink>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="shell py-24" aria-busy="true">
        <div className="h-10 w-1/3 animate-pulse rounded-[3px] bg-paper-sunk" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
