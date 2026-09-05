import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { ActiveTag, Badge, ProductImage, Rating } from '@/components/ui'
import { useCartStore } from '@/stores/cart.store'
import { useAddedFlash } from '@/features/cart/useAddedFlash'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

export function ProductCard({ product }: { product: Product }) {
  const add = useCartStore((state) => state.add)
  const [justAdded, flashAdded] = useAddedFlash()
  const orderable = product.inStock && product.priceCentavos > 0
  const hasPrice = product.priceCentavos > 0

  return (
    <article className="group relative flex flex-col">
      <Link
        to={`/product/${product.slug}`}
        className="block overflow-hidden rounded-card border border-rule bg-marigold-wash transition-[border-color,box-shadow] duration-300 group-hover:border-rule-strong group-hover:shadow-[0_12px_32px_-16px_rgba(30,26,56,0.35)]"
      >
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          tone={product.imageTone}
          categorySlug={product.categorySlug}
          initials={product.name.slice(0, 2)}
          sizes="(min-width: 1280px) 18vw, (min-width: 768px) 30vw, 45vw"
          className="aspect-square w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </Link>

      {(product.isBestSeller || !product.inStock || product.compareAtCentavos) && (
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {!product.inStock && <Badge tone="neutral">{hasPrice ? 'Back in stock soon' : 'Ask about this'}</Badge>}
          {product.inStock && product.compareAtCentavos && (
            <Badge tone="marigold">Save {formatPrice(product.compareAtCentavos - product.priceCentavos)}</Badge>
          )}
          {product.inStock && !product.compareAtCentavos && product.isBestSeller && (
            <Badge tone="muted">Best seller</Badge>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col pt-4">
        {product.actives[0] && <ActiveTag className="self-start">{product.actives[0]}</ActiveTag>}

        <h3 className="mt-3 text-[1.0625rem] font-medium leading-snug tracking-tight">
          <Link to={`/product/${product.slug}`} className="transition-colors hover:text-violet">
            <span className="absolute inset-0 lg:hidden" aria-hidden />
            {product.name}
          </Link>
        </h3>

        <p className="mt-1.5 line-clamp-2 font-serif text-[0.9375rem] leading-relaxed text-ink-soft">
          {product.summary}
        </p>

        {product.ratingCount > 0 && (
          <div className="mt-3">
            <Rating value={product.ratingAverage} count={product.ratingCount} />
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-rule pt-3.5">
          <div>
            <p className="tabular text-[1.0625rem] font-semibold">
              {hasPrice ? formatPrice(product.priceCentavos) : <span className="text-[0.9375rem] font-medium text-ink-soft">Price on request</span>}
              {product.compareAtCentavos && (
                <span className="ml-2 text-sm font-normal text-ink-faint line-through">
                  {formatPrice(product.compareAtCentavos)}
                </span>
              )}
            </p>
            {product.sizeLabel && <p className="text-[0.8125rem] text-ink-faint">{product.sizeLabel}</p>}
          </div>

          {hasPrice ? (
            <button
              type="button"
              disabled={!orderable}
              onClick={() => {
                add(product)
                flashAdded()
              }}
              className={cn(
                'relative z-10 min-w-[4.25rem] rounded-[3px] border px-3.5 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:border-rule-strong disabled:text-ink-faint disabled:hover:bg-transparent',
                justAdded
                  ? 'border-verified bg-verified text-white'
                  : 'border-ink text-ink hover:bg-ink hover:text-paper',
              )}
            >
              {justAdded ? (
                <span className="added-pop inline-flex items-center gap-1">
                  <Check size={14} strokeWidth={2.5} />
                  Added
                </span>
              ) : orderable ? (
                'Add'
              ) : (
                'Sold out'
              )}
            </button>
          ) : (
            <Link
              to="/contact"
              className="relative z-10 rounded-[3px] border border-rule-strong px-3.5 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink"
            >
              Enquire
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
