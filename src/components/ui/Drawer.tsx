import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { useOnEscape } from '@/hooks/useOnEscape'
import { cn } from '@/lib/utils'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  side?: 'right' | 'left'
  children: ReactNode
  footer?: ReactNode
}

export function Drawer({ open, onClose, title, side = 'right', children, footer }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useLockBodyScroll(open)
  useOnEscape(open, onClose)

  useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex" role="presentation">
      <button
        type="button"
        aria-label="Close panel"
        onClick={onClose}
        className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          'relative flex h-full w-full max-w-[26.5rem] flex-col bg-paper shadow-[0_0_60px_rgba(30,26,56,0.22)] focus:outline-none',
          side === 'right' ? 'ml-auto' : 'mr-auto',
        )}
      >
        <header className="flex items-center justify-between border-b border-rule px-5 py-4">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="grid size-9 place-items-center rounded-[3px] text-ink-soft transition-colors hover:bg-chalk hover:text-ink"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">{children}</div>

        {footer && <div className="border-t border-rule bg-white px-5 py-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
