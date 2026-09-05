import { Link } from 'react-router-dom'
import { useProducts } from '@/features/catalog/api/catalog.queries'
import { ProductGrid } from '@/features/catalog/components/ProductGrid'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Reveal } from '@/components/common/Reveal'
import type { Product } from '@/types'

/** What the admin has marked as featured, in their order; best sellers if nothing is. */
export function selectFeatured(products: Product[], limit = 8): Product[] {
  const featured = products
    .filter((product) => product.isFeatured && product.inStock)
    .sort((a, b) => (a.featuredOrder ?? Number.MAX_SAFE_INTEGER) - (b.featuredOrder ?? Number.MAX_SAFE_INTEGER))

  const chosen = featured.length > 0 ? featured : products.filter((product) => product.isBestSeller && product.inStock)
  return chosen.slice(0, limit)
}

export function FeaturedProducts() {
  const { data: products = [], isLoading } = useProducts()
  const featured = selectFeatured(products)

  return (
    <section aria-labelledby="featured-heading" className="shell py-20 lg:py-28">
      <Reveal>
      <SectionHeading
        title="What people reorder"
        description="The products that leave the warehouse most. Between them they cover every step of the routine."
        action={
          <Link
            to="/shop"
            className="text-[0.9375rem] font-medium text-violet underline decoration-violet/30 underline-offset-[6px] transition-colors hover:decoration-violet"
          >
            {isLoading ? 'See all products' : `See all ${products.length} products`}
          </Link>
        }
      />
      </Reveal>
      <Reveal delay={120} className="mt-12">
        <ProductGrid products={featured} isLoading={isLoading} skeletonCount={4} />
      </Reveal>
    </section>
  )
}
