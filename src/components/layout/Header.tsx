import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, Search, ShoppingBag, User } from 'lucide-react'
import { primaryNav } from '@/config/navigation'
import { useCartStore, selectTotals } from '@/stores/cart.store'
import { useAuth } from '@/features/auth/useAuth'
import { cn } from '@/lib/utils'
import { Logo } from './Logo'
import { MobileNav } from './MobileNav'
import { SearchOverlay } from './SearchOverlay'

export function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isStuck, setIsStuck] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const location = useLocation()

  const lines = useCartStore((state) => state.lines)
  const openDrawer = useCartStore((state) => state.openDrawer)
  const { itemCount } = selectTotals(lines)
  const { user } = useAuth()

  useEffect(() => {
    setOpenMenu(null)
    setIsMobileOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    const onScroll = () => setIsStuck(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpenMenu(null)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  return (
    <>
      {/* The counterfeit problem is real enough to earn the top line. */}
      <div className="bg-ink text-paper">
        <div className="shell flex h-9 items-center justify-between text-[0.8125rem]">
          <p className="truncate">
            FDA-registered formulas, shipped nationwide from Quezon City
          </p>
          <Link
            to="/faqs#authenticity"
            className="hidden shrink-0 text-paper/70 underline decoration-paper/30 underline-offset-4 transition-colors hover:text-paper sm:block"
          >
            Check you have the real thing
          </Link>
        </div>
      </div>

      <header
        className={cn(
          'sticky top-0 z-40 border-b bg-paper/90 backdrop-blur-md transition-[border-color,box-shadow]',
          isStuck ? 'border-rule shadow-[0_1px_16px_rgba(30,26,56,0.06)]' : 'border-transparent',
        )}
      >
        <div className="shell flex h-[4.5rem] items-center justify-between gap-6">
          <Logo />

          <nav ref={navRef} aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {primaryNav.map((item) => (
                <li key={item.label} className="relative">
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        aria-expanded={openMenu === item.label}
                        onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                        onMouseEnter={() => setOpenMenu(item.label)}
                        className={cn(
                          'rounded-[3px] px-3 py-2 text-[0.9375rem] font-medium transition-colors',
                          openMenu === item.label ? 'bg-chalk text-ink' : 'text-ink-soft hover:text-ink',
                        )}
                      >
                        {item.label}
                      </button>
                      {openMenu === item.label && (
                        <div
                          onMouseLeave={() => setOpenMenu(null)}
                          className="absolute left-0 top-[calc(100%+0.5rem)] w-72 border border-rule bg-white p-2 shadow-[0_18px_44px_rgba(30,26,56,0.14)]"
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.to}
                              to={child.to}
                              className="block rounded-[3px] px-3 py-2.5 transition-colors hover:bg-paper-sunk"
                            >
                              <span className="block text-[0.9375rem] font-medium text-ink">
                                {child.label}
                              </span>
                              {child.hint && (
                                <span className="mt-0.5 block text-[0.8125rem] text-ink-faint">
                                  {child.hint}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          'block rounded-[3px] px-3 py-2 text-[0.9375rem] font-medium transition-colors',
                          isActive ? 'text-violet' : 'text-ink-soft hover:text-ink',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search products"
              className="grid size-10 place-items-center rounded-[3px] text-ink-soft transition-colors hover:bg-chalk hover:text-ink"
            >
              <Search size={19} strokeWidth={1.75} />
            </button>

            <Link
              to={user ? '/account' : '/login'}
              aria-label={user ? 'Your account' : 'Sign in'}
              className="hidden size-10 place-items-center rounded-[3px] text-ink-soft transition-colors hover:bg-chalk hover:text-ink sm:grid"
            >
              <User size={19} strokeWidth={1.75} />
            </Link>

            <button
              type="button"
              onClick={openDrawer}
              className="relative grid size-10 place-items-center rounded-[3px] text-ink-soft transition-colors hover:bg-chalk hover:text-ink"
              aria-label={`Cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
            >
              <ShoppingBag size={19} strokeWidth={1.75} />
              {itemCount > 0 && (
                <span className="tabular absolute right-1 top-1 grid min-w-[1.05rem] place-items-center rounded-full bg-marigold px-1 text-[0.6875rem] font-semibold leading-[1.05rem] text-white">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open menu"
              className="grid size-10 place-items-center rounded-[3px] text-ink-soft transition-colors hover:bg-chalk hover:text-ink lg:hidden"
            >
              <Menu size={20} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
      <SearchOverlay open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
