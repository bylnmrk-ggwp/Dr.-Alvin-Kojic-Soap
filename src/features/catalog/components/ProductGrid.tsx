import { ProductCardSkeleton } from '@/components/ui'
import type { Product } from '@/types'
import { ProductCard } from './ProductCard'

export function ProductGrid({
  products,
  isLoading,
  skeletonCount = 8,
}: {
  products: Product[]
  isLoading?: boolean
  skeletonCount?: number
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
