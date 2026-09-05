import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Tone = 'violet' | 'marigold' | 'verified' | 'neutral' | 'muted'

const tones: Record<Tone, string> = {
  violet: 'bg-violet-wash text-violet-deep',
  marigold: 'bg-marigold-wash text-marigold-deep',
  verified: 'bg-verified-wash text-verified',
  neutral: 'bg-ink text-paper',
  muted: 'bg-paper-sunk text-ink-soft',
}

export function Badge({
  tone = 'muted',
  className,
  children,
}: {
  tone?: Tone
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[2px] px-2 py-[3px] text-[0.75rem] font-medium leading-tight',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/**
 * The active ingredient is what separates one Dr. Alvin product from the
 * next, so it gets a consistent mark everywhere a product appears.
 */
export function ActiveTag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border border-violet/25 px-2 py-[3px] text-[0.75rem] font-medium leading-tight text-violet-deep',
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-violet" />
      {children}
    </span>
  )
}
