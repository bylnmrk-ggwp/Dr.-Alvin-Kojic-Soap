import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useProducts } from '@/features/catalog/api/catalog.queries'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { useOnEscape } from '@/hooks/useOnEscape'
import { formatPrice } from '@/lib/utils'
import { ProductVisual } from '@/components/ui'

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [term, setTerm] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { data: products = [] } = useProducts()

  useLockBodyScroll(open)
  useOnEscape(open, onClose)

  useEffect(() => {
    if (open) {
      setTerm('')
      window.requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  const matches = useMemo(() => {
    const query = term.trim().toLowerCase()
    if (query.length < 2) return []
    return products
      .filter((product) =>
        [product.name, product.summary, ...product.actives, ...product.skinConcerns]
          .join(' ')
          .toLowerCase()
          .includes(query),
      )
      .slice(0, 6)
  }, [term, products])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
        className="relative mx-auto mt-[12vh] w-[min(42rem,calc(100%-2rem))] border border-rule bg-paper shadow-[0_24px_64px_rgba(30,26,56,0.24)]"
      >
        <div className="flex items-center gap-3 border-b border-rule px-4">
          <Search size={19} className="shrink-0 text-ink-faint" strokeWidth={1.75} />
          <input
            ref={inputRef}
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search by product, ingredient or concern"
            className="h-14 flex-1 bg-transparent text-[1.0625rem] text-ink placeholder:text-ink-faint focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="grid size-8 place-items-center rounded-[3px] text-ink-faint transition-colors hover:bg-chalk hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>

        {term.trim().length < 2 ? (
          <div className="px-4 py-6">
            <p className="text-sm text-ink-faint">Try an ingredient</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Kojic acid', 'Tretinoin', 'Ceramides', 'Alpha arbutin', 'SPF 50'].map((seed) => (
                <button
                  key={seed}
                  type="button"
                  onClick={() => setTerm(seed)}
                  className="border border-rule-strong px-2.5 py-1 text-sm text-ink-soft transition-colors hover:border-violet hover:text-violet"
                >
                  {seed}
                </button>
              ))}
            </div>
          </div>
        ) : matches.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-ink-soft">
            Nothing matches “{term.trim()}”. Try an ingredient name, or browse the full range.
          </p>
        ) : (
          <ul className="max-h-[50vh] overflow-y-auto py-2">
            {matches.map((product) => (
              <li key={product.id}>
                <button
                  type="button"
                  onClick={() => {
                    navigate(`/product/${product.slug}`)
                    onClose()
                  }}
                  className="flex w-full items-center gap-3.5 px-4 py-2.5 text-left transition-colors hover:bg-chalk"
                >
                  <div className="size-12 shrink-0 overflow-hidden">
                    <ProductVisual tone={product.imageTone} categorySlug={product.categorySlug} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.9375rem] font-medium text-ink">{product.name}</p>
                    <p className="truncate text-[0.8125rem] text-ink-faint">
                      {product.actives.join(', ')}
                    </p>
                  </div>
                  <span className="tabular shrink-0 text-sm font-medium text-ink">
                    {formatPrice(product.priceCentavos)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>,
    document.body,
  )
}
