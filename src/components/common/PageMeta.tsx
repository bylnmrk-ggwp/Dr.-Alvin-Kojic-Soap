import { useEffect } from 'react'
import { site } from '@/config/site'

/** Keeps the tab title and meta description in step with the route. */
export function PageMeta({ title, description }: { title: string; description?: string }) {
  useEffect(() => {
    document.title = `${title} — ${site.name}`
  }, [title])

  useEffect(() => {
    if (!description) return
    const tag = document.querySelector('meta[name="description"]')
    const previous = tag?.getAttribute('content')
    tag?.setAttribute('content', description)
    return () => {
      if (previous) tag?.setAttribute('content', previous)
    }
  }, [description])

  return null
}
