import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCompactCount } from '@/lib/utils'

export function Rating({
  value,
  count,
  size = 'sm',
  className,
}: {
  value: number
  count?: number
  size?: 'sm' | 'md'
  className?: string
}) {
  const starSize = size === 'sm' ? 13 : 16

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-px" aria-hidden>
        {[0, 1, 2, 3, 4].map((index) => (
          <Star
            key={index}
            size={starSize}
            strokeWidth={1.5}
            className={index < Math.round(value) ? 'fill-marigold text-marigold' : 'text-rule-strong'}
          />
        ))}
      </div>
      <span className={cn('tabular text-ink-soft', size === 'sm' ? 'text-xs' : 'text-sm')}>
        {value.toFixed(1)}
        {count !== undefined && (
          <span className="text-ink-faint"> ({formatCompactCount(count)})</span>
        )}
      </span>
      <span className="sr-only">
        Rated {value.toFixed(1)} out of 5{count !== undefined && ` from ${count} reviews`}
      </span>
    </div>
  )
}
