import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'
import { SupabaseNotice } from '@/pages/auth/SupabaseNotice'
import { ButtonLink } from '@/components/ui'

/**
 * Wraps the admin portal: waits for the session and the profile that carries
 * the role, sends guests to sign in and everyone who is not an admin home.
 */
export function AdminRoute() {
  const { user, profile, isLoading, isConfigured } = useAuth()
  const location = useLocation()

  if (!isConfigured) {
    return (
      <div className="shell max-w-2xl py-16">
        <h1 className="text-title">Store admin</h1>
        <SupabaseNotice className="mt-6" />
        <ButtonLink to="/shop" variant="ink" className="mt-8">
          Back to the shop
        </ButtonLink>
      </div>
    )
  }

  // The profile row (created by a database trigger on sign-up) arrives a beat after the session.
  if (isLoading || (user && !profile)) {
    return (
      <div className="shell py-24" aria-busy="true">
        <div className="h-10 w-1/3 animate-pulse rounded-[3px] bg-paper-sunk" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (profile?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
