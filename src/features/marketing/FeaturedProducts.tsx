import { Link } from 'react-router-dom'
import { useProducts } from '@/features/catalog/api/catalog.queries'
import { ProductGrid } from '@/features/catalog/components/ProductGrid'
import { SectionHeading } from '@/components/common/SectionHeading'

export function FeaturedProducts() {
  const { data: products = [], isLoading } = useProducts()
  const featured = products.filter((product) => product.isBestSeller && product.inStock).slice(0, 8)

  return (
    <section aria-labelledby="featured-heading" className="shell py-20 lg:py-28">
      <SectionHeading
        title="What people reorder"
        description="Eight products account for most of what leaves the warehouse. Between them they cover every step of the routine."
        action={
          <Link
            to="/shop"
            className="text-[0.9375rem] font-medium text-violet underline decoration-violet/30 underline-offset-[6px] transition-colors hover:decoration-violet"
          >
            See all 20 products
          </Link>
        }
      />
      <div className="mt-12">
        <ProductGrid products={featured} isLoading={isLoading} />
      </div>
    </section>
  )
}
