import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

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
      className={cn('group inline-flex flex-col leading-none', className)}
      aria-label="Dr. Alvin, home"
    >
      <span
        className={cn(
          'text-[1.375rem] font-semibold tracking-[-0.04em] transition-colors',
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
    </Link>
  )
}
