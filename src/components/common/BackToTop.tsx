import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Appears once the visitor has scrolled a screen or so, bottom-left so it never fights the chat bubble. */
export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > 900)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      tabIndex={isVisible ? 0 : -1}
      aria-hidden={!isVisible}
      className={cn(
        'bottom-widget fixed bottom-5 left-5 z-30 grid size-11 place-items-center rounded-full border border-rule bg-white/90 text-ink shadow-[0_14px_30px_-16px_rgba(30,26,56,0.5)] backdrop-blur transition-[opacity,transform,background-color] duration-300 ease-out-quint hover:bg-white sm:bottom-6 sm:left-6',
        isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
      )}
    >
      <ArrowUp size={18} strokeWidth={2} />
    </button>
  )
}
