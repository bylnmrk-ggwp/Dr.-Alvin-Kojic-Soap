import { X } from 'lucide-react'
import { regimenSteps, skinConcerns } from '@/data/categories'
import { cn } from '@/lib/utils'
import type { Category, RegimenStep } from '@/types'

interface CatalogFiltersProps {
  categories: Category[]
  category: string | null
  step: RegimenStep | null
  concern: string | null
  activeFilterCount: number
  onChange: (key: string, value: string | null) => void
  onClear: () => void
}

export function CatalogFilters({
  categories,
  category,
  step,
  concern,
  activeFilterCount,
  onChange,
  onClear,
}: CatalogFiltersProps) {
  return (
    <div className="grid gap-8">
      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-1.5 self-start text-sm font-medium text-violet transition-colors hover:text-violet-deep"
        >
          <X size={14} />
          Clear {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'}
        </button>
      )}

      <FilterGroup heading="Step in your routine">
        <div className="grid gap-1.5">
          {regimenSteps.map((item) => (
            <FilterToggle
              key={item.step}
              active={step === item.step}
              onClick={() => onChange('step', step === item.step ? null : item.step)}
            >
              <span className="tabular mr-2.5 text-ink-faint">{item.ordinal}</span>
              {item.title}
            </FilterToggle>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup heading="Product type">
        <div className="grid gap-1.5">
          {categories.map((item) => (
            <FilterToggle
              key={item.slug}
              active={category === item.slug}
              onClick={() => onChange('category', category === item.slug ? null : item.slug)}
            >
              {item.name}
            </FilterToggle>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup heading="What you are treating">
        <div className="flex flex-wrap gap-1.5">
          {skinConcerns.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onChange('concern', concern === item ? null : item)}
              aria-pressed={concern === item}
              className={cn(
                'border px-2.5 py-1 text-sm transition-colors',
                concern === item
                  ? 'border-violet bg-violet text-white'
                  : 'border-rule-strong text-ink-soft hover:border-violet hover:text-violet',
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </FilterGroup>
    </div>
  )
}

function FilterGroup({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-[0.9375rem] font-semibold">{heading}</h3>
      {children}
    </div>
  )
}

function FilterToggle({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex items-center py-1 text-left text-[0.9375rem] transition-colors',
        active ? 'font-medium text-violet' : 'text-ink-soft hover:text-ink',
      )}
    >
      {children}
    </button>
  )
}
