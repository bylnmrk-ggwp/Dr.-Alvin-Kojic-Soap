import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  label,
  size = 'md',
  className,
}: {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
  label: string
  size?: 'sm' | 'md'
  className?: string
}) {
  const buttonSize = size === 'sm' ? 'size-8' : 'size-10'

  return (
    <div
      className={cn('inline-flex items-center border border-rule-strong', className)}
      role="group"
      aria-label={`Quantity for ${label}`}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Remove one ${label}`}
        className={cn(
          buttonSize,
          'grid place-items-center text-ink-soft transition-colors hover:bg-chalk hover:text-ink disabled:opacity-35 disabled:hover:bg-transparent',
        )}
      >
        <Minus size={14} />
      </button>
      <span
        className={cn('tabular grid place-items-center text-sm font-medium', size === 'sm' ? 'w-8' : 'w-10')}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`Add one ${label}`}
        className={cn(
          buttonSize,
          'grid place-items-center text-ink-soft transition-colors hover:bg-chalk hover:text-ink disabled:opacity-35 disabled:hover:bg-transparent',
        )}
      >
        <Plus size={14} />
      </button>
    </div>
  )
}
