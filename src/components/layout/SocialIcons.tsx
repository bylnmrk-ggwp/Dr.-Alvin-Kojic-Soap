import type { SVGProps } from 'react'

/** Brand marks are not part of lucide any more, so the three we use live here. */
type IconProps = SVGProps<SVGSVGElement> & { size?: number }

export function FacebookIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.5-1.5h1.5V4.9c-.3 0-1.2-.1-2.2-.1-2.2 0-3.8 1.4-3.8 3.9V11H8v3h2.5v7h3Z" />
    </svg>
  )
}

export function InstagramIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function YoutubeIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M2.5 12c0-2.6.3-4.3.6-5.2.3-.8.9-1.4 1.8-1.6C6.3 4.9 9 4.8 12 4.8s5.7.1 7.1.4c.9.2 1.5.8 1.8 1.6.3.9.6 2.6.6 5.2s-.3 4.3-.6 5.2c-.3.8-.9 1.4-1.8 1.6-1.4.3-4.1.4-7.1.4s-5.7-.1-7.1-.4c-.9-.2-1.5-.8-1.8-1.6-.3-.9-.6-2.6-.6-5.2Z" />
      <path d="M10 9.2v5.6l4.8-2.8L10 9.2Z" fill="currentColor" stroke="none" />
    </svg>
  )
}
