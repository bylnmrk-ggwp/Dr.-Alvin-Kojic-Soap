import { Select } from '@/components/ui'
import { cn } from '@/lib/utils'

interface StatusSelectProps<T extends string> {
  value: T
  /** Label per status, in the order the options should appear. */
  labels: Record<T, string>
  onChange: (next: T) => void
  label: string
  disabled?: boolean
  className?: string
}

/** A compact select for moving an order or application through its statuses. */
export function StatusSelect<T extends string>({
  value,
  labels,
  onChange,
  label,
  disabled,
  className,
}: StatusSelectProps<T>) {
  return (
    <Select
      aria-label={label}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value as T)}
      className={cn('h-9 w-auto min-w-44 text-sm', className)}
    >
      {(Object.keys(labels) as T[]).map((status) => (
        <option key={status} value={status}>
          {labels[status]}
        </option>
      ))}
    </Select>
  )
}
