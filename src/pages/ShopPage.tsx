import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { PageMeta } from '@/components/common/PageMeta'
import { Button, Drawer, EmptyState, Select } from '@/components/ui'
import { useCategories, useProducts } from '@/features/catalog/api/catalog.queries'
import { CatalogFilters } from '@/features/catalog/components/CatalogFilters'
import { ProductGrid } from '@/features/catalog/components/ProductGrid'
import { sortOptions, useCatalogFilters } from '@/features/catalog/useCatalogFilters'
import { regimenSteps } from '@/data/categories'
import { pluralise } from '@/lib/utils'
import type { ProductSort } from '@/types'

export default function ShopPage() {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  const { data: products = [], isLoading, isError, refetch } = useProducts()
  const { data: categories = [] } = useCategories()
  const filters = useCatalogFilters(products)

  const activeCategory = categories.find((item) => item.slug === filters.category)
  const activeStep = regimenSteps.find((item) => item.step === filters.step)

  const title = activeCategory?.name ?? (activeStep ? `Step ${activeStep.ordinal}: ${activeStep.title}` : 'All products')
  const description =
    activeCategory?.blurb ??
    activeStep?.description ??
    'Twenty products across four steps. Filter by where it sits in your routine, what it is, or what you are trying to fix.'

  const filterPanel = (
    <CatalogFilters
      categories={categories}
      category={filters.category}
      step={filters.step}
      concern={filters.concern}
      activeFilterCount={filters.activeFilterCount}
      onChange={filters.setParam}
      onClear={filters.clearAll}
    />
  )

  return (
    <>
      <PageMeta title={title} description={description} />

      <div className="shell pt-12 lg:pt-16">
        <header className="max-w-2xl">
          <h1 className="text-title">{title}</h1>
          <p className="prose-reading mt-4">{description}</p>
        </header>

        <div className="mt-12 grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-14">
          <aside className="hidden lg:block">
            <div className="sticky top-24">{filterPanel}</div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-4">
              <p className="text-sm text-ink-soft" aria-live="polite">
                {isLoading
                  ? 'Loading products'
                  : `${filters.results.length} ${pluralise(filters.results.length, 'product')}`}
                {filters.search && ` matching “${filters.search}”`}
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setIsFilterDrawerOpen(true)}
                >
                  <SlidersHorizontal size={15} />
                  Filters
                  {filters.activeFilterCount > 0 && (
                    <span className="tabular grid size-5 place-items-center rounded-full bg-violet text-[0.6875rem] text-white">
                      {filters.activeFilterCount}
                    </span>
                  )}
                </Button>

                <label className="flex items-center gap-2 text-sm text-ink-soft">
                  <span className="hidden sm:inline">Sort</span>
                  <Select
                    value={filters.sort}
                    onChange={(event) => filters.setParam('sort', event.target.value as ProductSort)}
                    className="h-9 w-auto min-w-[11rem] text-sm"
                    aria-label="Sort products"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </label>
              </div>
            </div>

            <div className="mt-8">
              {isError ? (
                <EmptyState
                  title="The catalogue did not load"
                  description="Check your connection and try again. If this keeps happening, the Supabase project may be paused."
                  action={<Button onClick={() => void refetch()}>Try again</Button>}
                />
              ) : !isLoading && filters.results.length === 0 ? (
                <EmptyState
                  title="Nothing matches those filters"
                  description="Try removing one, or search by an ingredient name instead — kojic, tretinoin, ceramide."
                  action={
                    <Button variant="outline" onClick={filters.clearAll}>
                      Clear all filters
                    </Button>
                  }
                />
              ) : (
                <ProductGrid products={filters.results} isLoading={isLoading} />
              )}
            </div>
          </div>
        </div>
      </div>

      <Drawer
        open={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        title="Filter products"
        side="left"
        footer={
          <Button className="w-full" onClick={() => setIsFilterDrawerOpen(false)}>
            Show {filters.results.length} {pluralise(filters.results.length, 'product')}
          </Button>
        }
      >
        <div className="px-5 py-6">{filterPanel}</div>
      </Drawer>
    </>
  )
}
