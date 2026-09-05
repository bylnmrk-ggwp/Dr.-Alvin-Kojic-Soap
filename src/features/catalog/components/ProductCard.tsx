import { Link } from 'react-router-dom'
import { ActiveTag, Badge, ProductVisual, Rating } from '@/components/ui'
import { useCartStore } from '@/stores/cart.store'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

export function ProductCard({ product }: { product: Product }) {
  const add = useCartStore((state) => state.add)

  return (
    <article className="group relative flex flex-col">
      <Link to={`/product/${product.slug}`} className="block overflow-hidden bg-chalk">
        <div className="aspect-4/5 transition-transform duration-500 ease-out group-hover:scale-[1.03]">
          <ProductVisual
            tone={product.imageTone}
            categorySlug={product.categorySlug}
            initials={product.name.slice(0, 2)}
          />
        </div>
      </Link>

      {(product.isBestSeller || !product.inStock || product.compareAtCentavos) && (
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {!product.inStock && <Badge tone="neutral">Back in stock soon</Badge>}
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

        <div className="mt-3">
          <Rating value={product.ratingAverage} count={product.ratingCount} />
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-rule pt-3.5">
          <div>
            <p className="tabular text-[1.0625rem] font-semibold">
              {formatPrice(product.priceCentavos)}
              {product.compareAtCentavos && (
                <span className="ml-2 text-sm font-normal text-ink-faint line-through">
                  {formatPrice(product.compareAtCentavos)}
                </span>
              )}
            </p>
            <p className="text-[0.8125rem] text-ink-faint">{product.sizeLabel}</p>
          </div>

          <button
            type="button"
            disabled={!product.inStock}
            onClick={() => add(product)}
            className="relative z-10 border border-ink px-3.5 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:border-rule-strong disabled:text-ink-faint disabled:hover:bg-transparent"
          >
            {product.inStock ? 'Add' : 'Sold out'}
          </button>
        </div>
      </div>
    </article>
  )
}
