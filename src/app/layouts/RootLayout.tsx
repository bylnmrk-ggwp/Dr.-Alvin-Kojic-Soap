import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ScrollToTop } from '@/components/common/ScrollToTop'
import { CartDrawer } from '@/features/cart/CartDrawer'
import { ChatWidget } from '@/features/chat/ChatWidget'
import { BackToTop } from '@/components/common/BackToTop'
import { Toaster } from '@/components/ui'

export function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>

      <Header />

      <main id="main" className="flex-1">
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
      <CartDrawer />
      <ChatWidget />
      <BackToTop />
      <Toaster />
    </div>
  )
}

function RouteFallback() {
  return (
    <div className="shell py-24" aria-busy="true" aria-live="polite">
      <div className="h-10 w-1/3 animate-pulse rounded-[3px] bg-paper-sunk" />
      <div className="mt-6 h-5 w-2/3 animate-pulse rounded-[3px] bg-paper-sunk" />
      <div className="mt-3 h-5 w-1/2 animate-pulse rounded-[3px] bg-paper-sunk" />
    </div>
  )
}
