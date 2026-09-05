import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

/**
 * The brand mark from the live site next to the wordmark. The image is
 * decorative; the link's accessible name carries the brand.
 */
export function Logo({
  className,
  tone = 'ink',
}: {
  className?: string
  tone?: 'ink' | 'paper'
}) {
  return (
    <Link
      to="/"
      className={cn('group inline-flex items-center gap-3', className)}
      aria-label="Dr. Alvin, home"
    >
      <img
        src="/brand/logo.webp"
        alt=""
        width={40}
        height={40}
        className="size-10 shrink-0 rounded-[6px] shadow-[0_1px_2px_rgba(30,26,56,0.12)]"
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'text-[1.25rem] font-semibold tracking-[-0.04em] transition-colors',
            tone === 'ink' ? 'text-ink group-hover:text-violet' : 'text-paper',
          )}
        >
          Dr.&nbsp;Alvin
          <span className="align-super text-[0.5em] font-normal">®</span>
        </span>
        <span
          className={cn(
            'mt-1 text-[0.6875rem] font-medium tracking-tight',
            tone === 'ink' ? 'text-ink-faint' : 'text-paper/55',
          )}
        >
          Skin care formula since 1998
        </span>
      </span>
    </Link>
  )
}
