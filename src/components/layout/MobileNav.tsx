import { Link } from 'react-router-dom'
import { Drawer, ButtonLink } from '@/components/ui'
import { primaryNav } from '@/config/navigation'
import { useAuth } from '@/features/auth/useAuth'

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, signOut } = useAuth()

  return (
    <Drawer open={open} onClose={onClose} title="Menu" side="right">
      <nav aria-label="Mobile" className="px-5 py-2">
        {primaryNav.map((item) => (
          <div key={item.label} className="border-b border-rule py-4 last:border-b-0">
            <Link
              to={item.to}
              onClick={onClose}
              className="text-[1.125rem] font-medium tracking-tight text-ink"
            >
              {item.label}
            </Link>
            {item.children && (
              <ul className="mt-3 grid gap-2.5">
                {item.children.map((child) => (
                  <li key={child.to}>
                    <Link
                      to={child.to}
                      onClick={onClose}
                      className="text-[0.9375rem] text-ink-soft transition-colors hover:text-violet"
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>

      <div className="mt-2 grid gap-2 border-t border-rule px-5 py-5">
        {user ? (
          <>
            <ButtonLink to="/account" variant="outline" onClick={onClose}>
              Your account
            </ButtonLink>
            <button
              type="button"
              onClick={() => {
                void signOut()
                onClose()
              }}
              className="text-sm text-ink-soft underline underline-offset-4"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <ButtonLink to="/login" variant="ink" onClick={onClose}>
              Sign in
            </ButtonLink>
            <ButtonLink to="/register" variant="outline" onClick={onClose}>
              Create an account
            </ButtonLink>
          </>
        )}
      </div>
    </Drawer>
  )
}
