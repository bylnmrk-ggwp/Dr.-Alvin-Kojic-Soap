import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Product, ProductSort, RegimenStep } from '@/types'

const sortOptions: { value: ProductSort; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'rating-desc', label: 'Best rated' },
  { value: 'price-asc', label: 'Price, low to high' },
  { value: 'price-desc', label: 'Price, high to low' },
  { value: 'name-asc', label: 'Name, A to Z' },
]

export { sortOptions }

export function useCatalogFilters(products: Product[]) {
  const [params, setParams] = useSearchParams()

  const category = params.get('category')
  const step = params.get('step') as RegimenStep | null
  const concern = params.get('concern')
  const search = params.get('q') ?? ''
  const sort = (params.get('sort') as ProductSort | null) ?? 'featured'

  const setParam = useCallback(
    (key: string, value: string | null) => {
      setParams(
        (previous) => {
          const next = new URLSearchParams(previous)
          if (value === null || value === '') next.delete(key)
          else next.set(key, value)
          return next
        },
        { replace: true },
      )
    },
    [setParams],
  )

  const clearAll = useCallback(() => setParams({}, { replace: true }), [setParams])

  const activeFilterCount = [category, step, concern, search || null].filter(Boolean).length

  const results = useMemo(() => {
    const query = search.trim().toLowerCase()

    const filtered = products.filter((product) => {
      if (category && product.categorySlug !== category) return false
      if (step && product.step !== step) return false
      if (concern && !product.skinConcerns.includes(concern)) return false
      if (query) {
        const haystack = [product.name, product.summary, ...product.actives, ...product.skinConcerns]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(query)) return false
      }
      return true
    })

    // Sorting is applied to a copy so the query cache stays untouched.
    return [...filtered].sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return a.priceCentavos - b.priceCentavos
        case 'price-desc':
          return b.priceCentavos - a.priceCentavos
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'rating-desc':
          return b.ratingAverage - a.ratingAverage || b.ratingCount - a.ratingCount
        default:
          return (
            Number(b.isBestSeller) - Number(a.isBestSeller) ||
            b.ratingCount - a.ratingCount
          )
      }
    })
  }, [products, category, step, concern, search, sort])

  return { category, step, concern, search, sort, results, activeFilterCount, setParam, clearAll }
}
