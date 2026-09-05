import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const control =
  'w-full rounded-[3px] border border-rule-strong bg-white px-3.5 text-[0.9375rem] text-ink placeholder:text-ink-faint transition-colors focus:border-violet focus:outline-none focus:ring-2 focus:ring-violet/15 disabled:bg-paper-sunk disabled:text-ink-faint'

interface FieldShellProps {
  label: string
  hint?: string
  error?: string
  required?: boolean
  /** Spread straight onto the control — the keys are already valid DOM attributes. */
  children: (props: { id: string; 'aria-describedby': string | undefined; invalid: boolean }) => ReactNode
}

export function Field({ label, hint, error, required, children }: FieldShellProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = error ? errorId : hint ? hintId : undefined

  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {!required && (
          <>
            {' '}
            <span className="ml-1 font-normal text-ink-faint">optional</span>
          </>
        )}
      </label>
      {hint && !error && (
        <p id={hintId} className="text-[0.8125rem] leading-snug text-ink-faint">
          {hint}
        </p>
      )}
      {children({ id, 'aria-describedby': describedBy, invalid: Boolean(error) })}
      {error && (
        <p id={errorId} className="text-[0.8125rem] font-medium text-alert">
          {error}
        </p>
      )}
    </div>
  )
}

export const TextInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }
>(function TextInput({ className, invalid, ...props }, ref) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(control, 'h-11', invalid && 'border-alert focus:border-alert focus:ring-alert/15', className)}
      {...props}
    />
  )
})

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }
>(function TextArea({ className, invalid, rows = 4, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(control, 'resize-y py-2.5 leading-relaxed', invalid && 'border-alert focus:border-alert focus:ring-alert/15', className)}
      {...props}
    />
  )
})

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }
>(function Select({ className, invalid, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        control,
        'h-11 appearance-none bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 12 8\' fill=\'none\'%3E%3Cpath d=\'M1 1.5L6 6.5L11 1.5\' stroke=\'%234a4468\' stroke-width=\'1.5\' stroke-linecap=\'round\'/%3E%3C/svg%3E")] bg-[length:12px] bg-[right_0.9rem_center] bg-no-repeat pr-10',
        invalid && 'border-alert focus:border-alert focus:ring-alert/15',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
})
