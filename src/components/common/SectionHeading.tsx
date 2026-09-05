import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  title: string
  description?: string
  /** Sits to the right on wide screens — usually a link into the section. */
  action?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  title,
  description,
  action,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'md:flex-col md:items-center md:text-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        <h2 className="text-title">{title}</h2>
        {description && (
          <p className={cn('prose-reading mt-4', align === 'center' && 'mx-auto')}>{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
