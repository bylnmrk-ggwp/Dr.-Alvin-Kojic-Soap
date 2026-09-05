import { useState } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AccordionItem {
  question: string
  answer: string
}

export function Accordion({ items, className }: { items: AccordionItem[]; className?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className={cn('border-t border-rule', className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div key={item.question} className="border-b border-rule">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-start justify-between gap-6 py-5 text-left"
              >
                <span className="text-[1.0625rem] font-medium leading-snug tracking-tight text-ink">
                  {item.question}
                </span>
                <Plus
                  size={18}
                  strokeWidth={1.75}
                  aria-hidden
                  className={cn(
                    'mt-1 shrink-0 text-violet transition-transform duration-200',
                    isOpen && 'rotate-45',
                  )}
                />
              </button>
            </h3>
            <div
              className={cn(
                'grid transition-[grid-template-rows] duration-200 ease-out',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <p className="prose-reading pb-6 pr-10">{item.answer}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
