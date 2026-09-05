import { Link } from 'react-router-dom'
import { PageMeta } from '@/components/common/PageMeta'
import { ButtonLink, ProductVisual } from '@/components/ui'
import { useProducts } from '@/features/catalog/api/catalog.queries'
import { regimenSteps } from '@/data/categories'
import { formatPrice } from '@/lib/utils'

const routines = [
  {
    id: 'maintenance',
    name: 'Maintenance',
    who: 'Most people. Keeping skin even, clear and protected without a course of peeling.',
    slugs: ['gluta-kojic-acid-soap', 'all-in-1-maintenance-toner', 'all-in-1-maintenance-cream', 'whitening-sunscreen-cream-gel-spf50'],
    setSlug: 'all-in-1-maintenance-set',
  },
  {
    id: 'rejuvenating',
    name: 'Rejuvenating course',
    who: 'Stubborn dark spots, acne marks, or texture that has not moved in a year. Six to eight weeks, then back to maintenance.',
    slugs: ['kojic-acid-soap', 'rejuvenating-toner', 'beautamin-a-tretinoin-0-025', 'whitening-sunscreen-cream-gel-spf50'],
    setSlug: 'rejuvenating-set',
  },
  {
    id: 'barrier',
    name: 'Barrier repair',
    who: 'Skin that stings, flakes or burns from over-treatment. Two weeks of this before touching an active again.',
    slugs: ['ceramoist-barrier-repair-cleanser', 'all-in-1-maintenance-toner-travel', 'ceramoist-barrier-repair-cream', 'whitening-sunscreen-cream-gel-spf50'],
    setSlug: null,
  },
]

export default function RegimenPage() {
  const { data: products = [] } = useProducts()
  const bySlug = new Map(products.map((product) => [product.slug, product]))

  return (
    <>
      <PageMeta
        title="Build a regimen"
        description="The four-step Dr. Alvin routine, and three ways to fill it depending on what your skin needs right now."
      />

      <header className="shell pt-12 lg:pt-16">
        <div className="max-w-2xl">
          <h1 className="text-title">Build a regimen</h1>
          <p className="prose-reading mt-5 text-[1.125rem]">
            Every Dr. Alvin product sits at one of four steps. Pick the routine that matches where
            your skin is right now, then follow the order every day. The order is not a
            suggestion — it is most of the result.
          </p>
        </div>
      </header>

      <section aria-labelledby="steps-heading" className="shell mt-16">
        <h2 id="steps-heading" className="sr-only">
          The four steps
        </h2>
        <ol className="grid gap-px border-y border-ink sm:grid-cols-2 lg:grid-cols-4">
          {regimenSteps.map((item) => (
            <li key={item.step} className="border-b border-rule py-7 sm:pr-8 lg:border-b-0">
              <span className="tabular block text-[2.5rem] font-semibold leading-none tracking-tighter text-violet">
                {item.ordinal}
              </span>
              <h3 className="mt-3 text-[1.25rem] font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-2 font-serif text-[1rem] leading-relaxed text-ink-soft">{item.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="routines-heading" className="shell mt-20 grid gap-20 lg:mt-28">
        <h2 id="routines-heading" className="sr-only">
          Three routines
        </h2>
        {routines.map((routine) => {
          const lineup = routine.slugs.map((slug) => bySlug.get(slug)).filter(Boolean)
          const total = lineup.reduce((sum, product) => sum + (product?.priceCentavos ?? 0), 0)
          const set = routine.setSlug ? bySlug.get(routine.setSlug) : null

          return (
            <article key={routine.id} className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <div>
                <h3 className="text-heading">{routine.name}</h3>
                <p className="prose-reading mt-3">{routine.who}</p>

                <dl className="mt-6 grid gap-3 border-t border-rule pt-5 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-soft">Bought separately</dt>
                    <dd className="tabular font-medium">{formatPrice(total)}</dd>
                  </div>
                  {set && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-soft">As the {set.name}</dt>
                      <dd className="tabular font-medium text-verified">{formatPrice(set.priceCentavos)}</dd>
                    </div>
                  )}
                </dl>

                <div className="mt-6">
                  {set ? (
                    <ButtonLink to={`/product/${set.slug}`} variant="ink">
                      View the set
                    </ButtonLink>
                  ) : (
                    <ButtonLink to="/shop?concern=Sensitivity" variant="ink">
                      Shop barrier repair
                    </ButtonLink>
                  )}
                </div>
              </div>

              <ol className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                {lineup.map((product, index) =>
                  product ? (
                    <li key={product.id}>
                      <Link to={`/product/${product.slug}`} className="group block">
                        <div className="aspect-4/5 overflow-hidden bg-chalk">
                          <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]">
                            <ProductVisual
                              tone={product.imageTone}
                              categorySlug={product.categorySlug}
                              initials={product.name.slice(0, 2)}
                            />
                          </div>
                        </div>
                        <p className="tabular mt-3 text-xs font-medium text-violet">Step {index + 1}</p>
                        <p className="mt-1 text-[0.9375rem] font-medium leading-snug tracking-tight group-hover:text-violet">
                          {product.name}
                        </p>
                        <p className="tabular mt-1 text-sm text-ink-faint">{formatPrice(product.priceCentavos)}</p>
                      </Link>
                    </li>
                  ) : null,
                )}
              </ol>
            </article>
          )
        })}
      </section>
    </>
  )
}
