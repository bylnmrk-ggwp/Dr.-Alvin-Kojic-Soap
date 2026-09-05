export type RegimenStep = 'cleanse' | 'tone' | 'treat' | 'protect'

export interface Category {
  id: string
  slug: string
  name: string
  /** One line explaining what the category does for the skin. */
  blurb: string
  step: RegimenStep
  sortOrder: number
}

export interface Product {
  id: string
  slug: string
  name: string
  /** Short shelf description — one or two sentences. */
  summary: string
  description: string
  /** The named active(s). This is what distinguishes one product from the next. */
  actives: string[]
  categorySlug: string
  step: RegimenStep
  priceCentavos: number
  compareAtCentavos: number | null
  sizeLabel: string
  /** How to work it into a routine. */
  howToUse: string[]
  skinConcerns: string[]
  isFdaRegistered: boolean
  isBestSeller: boolean
  inStock: boolean
  ratingAverage: number
  ratingCount: number
  imageTone: string
}

export interface ProductFilters {
  category: string | null
  step: RegimenStep | null
  concern: string | null
  search: string
  sort: ProductSort
}

export type ProductSort = 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'rating-desc'
