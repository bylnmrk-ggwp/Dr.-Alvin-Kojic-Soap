import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react'
import { PageMeta } from '@/components/common/PageMeta'
import { SectionHeading } from '@/components/common/SectionHeading'
import { ActiveTag, Badge, Button, ButtonLink, EmptyState, ProductGallery, Rating, Skeleton } from '@/components/ui'
import { useProduct, useProducts } from '@/features/catalog/api/catalog.queries'
import { ProductGrid } from '@/features/catalog/components/ProductGrid'
import { QuantityStepper } from '@/features/cart/QuantityStepper'
import { useAddedFlash } from '@/features/cart/useAddedFlash'
import { useCartStore } from '@/stores/cart.store'
import { regimenSteps } from '@/data/categories'
import { cn, formatPrice } from '@/lib/utils'
import { freeShippingThresholdCentavos } from '@/config/site'

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: product, isLoading } = useProduct(slug)
  const { data: allProducts = [] } = useProducts()
  const add = useCartStore((state) => state.add)
  const [quantity, setQuantity] = useState(1)
  const [justAdded, flashAdded] = useAddedFlash()

  // On phones a sticky bar takes over once the main add-to-cart control scrolls away.
  const ctaRef = useRef<HTMLDivElement>(null)
  const [isCtaVisible, setIsCtaVisible] = useState(true)
  const productId = product?.id

  useEffect(() => {
    const element = ctaRef.current
    if (!element || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setIsCtaVisible(entry.isIntersecting), {
      rootMargin: '-72px 0px 0px 0px',
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [productId])

  useEffect(() => {
    document.body.classList.toggle('has-sticky-bar', !isCtaVisible && Boolean(productId))
    return () => document.body.classList.remove('has-sticky-bar')
  }, [isCtaVisible, productId])

  if (isLoading) {
    return (
      <div className="shell grid gap-12 py-12 lg:grid-cols-2 lg:py-16">
        <Skeleton className="aspect-square w-full" />
        <div className="grid content-start gap-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="mt-6 h-24 w-full" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="shell py-16">
        <EmptyState
          title="We could not find that product"
          description="It may have been renamed or retired. The full range is one click away."
          action={<ButtonLink to="/shop">Browse all products</ButtonLink>}
        />
      </div>
    )
  }

  const step = regimenSteps.find((item) => item.step === product.step)
  const hasPrice = product.priceCentavos > 0
  const orderable = product.inStock && hasPrice
  const related = allProducts
    .filter((item) => item.id !== product.id && (item.step === product.step || item.categorySlug === product.categorySlug))
    .slice(0, 4)

  return (
    <>
      <PageMeta title={product.name} description={product.summary} />

      <nav aria-label="Breadcrumb" className="shell pt-6 text-sm text-ink-faint">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link to="/shop" className="transition-colors hover:text-ink">
              Shop
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link to={`/shop?category=${product.categorySlug}`} className="capitalize transition-colors hover:text-ink">
              {product.categorySlug.replace(/-/g, ' ')}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-ink" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <article className="shell grid gap-12 py-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-12">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductGallery
            images={product.images}
            name={product.name}
            tone={product.imageTone}
            categorySlug={product.categorySlug}
          />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            {step && (
              <Link to={`/shop?step=${step.step}`}>
                <Badge tone="violet">
                  Step {step.ordinal}: {step.title}
                </Badge>
              </Link>
            )}
            {product.isBestSeller && <Badge tone="muted">Best seller</Badge>}
            {!product.inStock && <Badge tone="neutral">{hasPrice ? 'Back in stock soon' : 'Ask about availability'}</Badge>}
          </div>

          <h1 className="mt-4 text-[clamp(2rem,4vw,2.75rem)] font-semibold leading-[1.04] tracking-[-0.028em]">
            {product.name}
          </h1>

          <p className="prose-reading mt-4 text-[1.125rem]">{product.summary}</p>

          {product.ratingCount > 0 && (
            <div className="mt-5">
              <Rating value={product.ratingAverage} count={product.ratingCount} size="md" />
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            {product.actives.map((active) => (
              <ActiveTag key={active}>{active}</ActiveTag>
            ))}
          </div>

          <div className="mt-8 flex items-end justify-between gap-6 border-t border-rule pt-6">
            <div>
              <p className="tabular text-[2rem] font-semibold leading-none tracking-tight">
                {hasPrice ? formatPrice(product.priceCentavos) : <span className="text-[1.375rem] text-ink-soft">Price on request</span>}
                {product.compareAtCentavos && (
                  <span className="ml-3 text-lg font-normal text-ink-faint line-through">
                    {formatPrice(product.compareAtCentavos)}
                  </span>
                )}
              </p>
              {product.sizeLabel && <p className="mt-2 text-sm text-ink-faint">{product.sizeLabel}</p>}
            </div>
          </div>

          {hasPrice ? (
            <div ref={ctaRef} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <QuantityStepper value={quantity} onChange={setQuantity} label={product.name} className="h-13" />
              <Button
                size="lg"
                className={cn('flex-1', justAdded && 'bg-verified hover:bg-verified')}
                disabled={!orderable}
                onClick={() => {
                  add(product, quantity)
                  flashAdded()
                  setQuantity(1)
                }}
              >
                {justAdded ? (
                  <span className="added-pop inline-flex items-center gap-2">
                    <Check size={18} strokeWidth={2.5} />
                    Added to cart
                  </span>
                ) : orderable ? (
                  `Add to cart, ${formatPrice(product.priceCentavos * quantity)}`
                ) : (
                  'Sold out'
                )}
              </Button>
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/contact" size="lg" className="flex-1">
                Ask about this product
              </ButtonLink>
            </div>
          )}

          <ul className="mt-6 grid gap-2.5 text-sm text-ink-soft">
            <li className="flex items-center gap-2.5">
              <ShieldCheck size={16} className="text-verified" strokeWidth={1.75} />
              FDA Philippines registered. Check the number on the box against the portal.
            </li>
            <li className="flex items-center gap-2.5">
              <Truck size={16} className="text-ink-faint" strokeWidth={1.75} />
              Free shipping over {formatPrice(freeShippingThresholdCentavos)}. Metro Manila in 1–2 days.
            </li>
            <li className="flex items-center gap-2.5">
              <RotateCcw size={16} className="text-ink-faint" strokeWidth={1.75} />
              Unopened returns within 7 days.
            </li>
          </ul>

          <div className="mt-10 grid gap-8 border-t border-rule pt-8">
            <section>
              <h2 className="text-heading">About this product</h2>
              <div className="mt-3 grid gap-3">
                {product.description.split(/\n\n+/).map((paragraph) => (
                  <p key={paragraph} className="prose-reading">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            {product.howToUse.length > 0 && (
            <section>
              <h2 className="text-heading">How to use it</h2>
              <ol className="mt-4 grid gap-3">
                {product.howToUse.map((instruction, index) => (
                  <li key={instruction} className="flex gap-4">
                    <span className="tabular w-5 shrink-0 text-sm font-medium text-violet">{index + 1}</span>
                    <span className="font-serif text-[1.0625rem] leading-relaxed text-ink-soft">
                      {instruction}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
            )}

            {product.skinConcerns.length > 0 && (
            <section>
              <h2 className="text-heading">Good for</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.skinConcerns.map((concern) => (
                  <Link
                    key={concern}
                    to={`/shop?concern=${encodeURIComponent(concern)}`}
                    className="border border-rule-strong px-2.5 py-1 text-sm text-ink-soft transition-colors hover:border-violet hover:text-violet"
                  >
                    {concern}
                  </Link>
                ))}
              </div>
            </section>
            )}
          </div>
        </div>
      </article>

      {hasPrice && (
        <div
          aria-hidden={isCtaVisible}
          className={cn(
            'fixed inset-x-0 bottom-0 z-30 border-t border-rule bg-white/95 px-4 py-3 backdrop-blur transition-transform duration-300 ease-out-quint lg:hidden',
            isCtaVisible ? 'translate-y-full' : 'translate-y-0',
          )}
        >
          <div className="mx-auto flex max-w-lg items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.875rem] font-medium">{product.name}</p>
              <p className="tabular text-base font-semibold">{formatPrice(product.priceCentavos)}</p>
            </div>
            <Button
              size="md"
              tabIndex={isCtaVisible ? -1 : 0}
              className={cn('shrink-0', justAdded && 'bg-verified hover:bg-verified')}
              disabled={!orderable}
              onClick={() => {
                add(product, quantity)
                flashAdded()
              }}
            >
              {justAdded ? (
                <span className="added-pop inline-flex items-center gap-1.5">
                  <Check size={16} strokeWidth={2.5} />
                  Added
                </span>
              ) : orderable ? (
                'Add to cart'
              ) : (
                'Sold out'
              )}
            </Button>
          </div>
        </div>
      )}

      {related.length > 0 && (
        <section className="shell border-t border-rule py-16 lg:py-20">
          <SectionHeading
            title={step ? `More for step ${step.ordinal}` : 'You might also need'}
            description="Products that sit at the same point in the routine, or do a similar job."
          />
          <div className="mt-10">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </>
  )
}
