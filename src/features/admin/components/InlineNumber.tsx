import { useState } from 'react'
import { TextInput } from '@/components/ui'
import { cn } from '@/lib/utils'

interface InlineNumberProps {
  value: number | null
  /** Called on blur or Enter, only when the number actually changed. */
  onCommit: (next: number | null) => void
  label: string
  /** An emptied field commits null when allowed; otherwise it snaps back. */
  allowEmpty?: boolean
  prefix?: string
  min?: number
  step?: number | 'any'
  disabled?: boolean
  className?: string
}

/**
 * A number cell that edits in place. Render it with `key={value}` so a saved
 * or rolled-back value resets the draft instead of fighting the typist.
 */
export function InlineNumber({
  value,
  onCommit,
  label,
  allowEmpty = false,
  prefix,
  min = 0,
  step = 1,
  disabled,
  className,
}: InlineNumberProps) {
  const initial = value === null ? '' : String(value)
  const [draft, setDraft] = useState(initial)

  const commit = () => {
    const trimmed = draft.trim()
    if (trimmed === '') {
      if (allowEmpty && value !== null) onCommit(null)
      else setDraft(initial)
      return
    }

    const next = Number(trimmed)
    if (!Number.isFinite(next) || next < min) {
      setDraft(initial)
      return
    }
    if (next !== value) onCommit(next)
  }

  return (
    <div className={cn('relative', className)}>
      {prefix && (
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-ink-faint"
        >
          {prefix}
        </span>
      )}
      <TextInput
        type="number"
        inputMode="decimal"
        min={min}
        step={step}
        value={draft}
        disabled={disabled}
        aria-label={label}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          // Enter blurs, and the blur commits, so a value is never saved twice.
          if (event.key === 'Enter') event.currentTarget.blur()
          if (event.key === 'Escape') setDraft(initial)
        }}
        className={cn('tabular h-9 text-sm', prefix && 'pl-7')}
      />
    </div>
  )
}
