import { cn } from '@/lib/utils'

interface ToggleSwitchProps {
  checked: boolean
  onChange: (next: boolean) => void
  /** Read by assistive tech; the visual context (the table column) carries the label for everyone else. */
  label: string
  disabled?: boolean
  className?: string
}

/** A checkbox drawn as a switch, for on/off product flags in the admin table. */
export function ToggleSwitch({ checked, onChange, label, disabled, className }: ToggleSwitchProps) {
  return (
    <label className={cn('inline-flex cursor-pointer items-center', disabled && 'cursor-not-allowed', className)}>
      <input
        type="checkbox"
        role="switch"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        aria-label={label}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span
        aria-hidden
        className="relative h-6 w-10 rounded-full bg-rule-strong transition-colors after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:bg-violet peer-checked:after:translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-violet/30 peer-focus-visible:ring-offset-2 peer-disabled:opacity-45"
      />
    </label>
  )
}
