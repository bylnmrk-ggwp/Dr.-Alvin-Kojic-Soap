import { useEffect } from 'react'

/** Keeps the page behind an overlay from scrolling while it is open. */
export function useLockBodyScroll(active: boolean) {
  useEffect(() => {
    if (!active) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [active])
}
