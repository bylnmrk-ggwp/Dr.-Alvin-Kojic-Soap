import type { Category, Product } from '@/types'
import type { CategoryRow, ProductRow } from '@/lib/supabase/database.types'

export function toCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    blurb: row.blurb,
    step: row.step,
    sortOrder: row.sort_order,
  }
}

export function toProduct(row: ProductRow, categorySlugById: Map<string, string>): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    summary: row.summary,
    description: row.description,
    actives: row.actives ?? [],
    categorySlug: categorySlugById.get(row.category_id) ?? 'uncategorised',
    step: row.step,
    priceCentavos: row.price_centavos,
    compareAtCentavos: row.compare_at_centavos,
    sizeLabel: row.size_label,
    howToUse: row.how_to_use ?? [],
    skinConcerns: row.skin_concerns ?? [],
    isFdaRegistered: row.is_fda_registered,
    isBestSeller: row.is_best_seller,
    inStock: row.in_stock,
    ratingAverage: Number(row.rating_average),
    ratingCount: row.rating_count,
    imageTone: row.image_tone,
    images: row.images ?? [],
    isFeatured: row.is_featured,
    featuredOrder: row.featured_order,
  }
}
