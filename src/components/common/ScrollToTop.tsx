import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** A new route should start at the top, unless it carries a hash target. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])

  return null
}
