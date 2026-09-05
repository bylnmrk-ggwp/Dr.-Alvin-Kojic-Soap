import { createPortal } from 'react-dom'
import { Check, Info, TriangleAlert, X } from 'lucide-react'
import { useToastStore, type ToastTone } from '@/stores/toast.store'
import { cn } from '@/lib/utils'

const icons: Record<ToastTone, typeof Check> = {
  success: Check,
  error: TriangleAlert,
  info: Info,
}

const tones: Record<ToastTone, string> = {
  success: 'text-verified',
  error: 'text-alert',
  info: 'text-violet',
}

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts)
  const dismiss = useToastStore((state) => state.dismiss)

  if (toasts.length === 0) return null

  return createPortal(
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:items-end"
    >
      {toasts.map((item) => {
        const Icon = icons[item.tone]
        return (
          <div
            key={item.id}
            className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-[3px] border border-rule bg-white px-4 py-3 shadow-[0_12px_32px_rgba(30,26,56,0.16)]"
          >
            <Icon size={17} className={cn('mt-0.5 shrink-0', tones[item.tone])} />
            <div className="flex-1">
              <p className="text-sm font-medium text-ink">{item.title}</p>
              {item.description && (
                <p className="mt-0.5 text-[0.8125rem] leading-snug text-ink-soft">
                  {item.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              aria-label="Dismiss"
              className="-mr-1 shrink-0 rounded-[3px] p-1 text-ink-faint transition-colors hover:bg-chalk hover:text-ink"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>,
    document.body,
  )
}
