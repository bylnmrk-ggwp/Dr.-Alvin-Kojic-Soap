import { useQuery } from '@tanstack/react-query'
import { fetchCategories, fetchProductBySlug, fetchProducts } from './catalog.api'

export const catalogKeys = {
  all: ['catalog'] as const,
  categories: () => [...catalogKeys.all, 'categories'] as const,
  products: () => [...catalogKeys.all, 'products'] as const,
  product: (slug: string) => [...catalogKeys.all, 'product', slug] as const,
}

export function useCategories() {
  return useQuery({
    queryKey: catalogKeys.categories(),
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000,
  })
}

export function useProducts() {
  return useQuery({
    queryKey: catalogKeys.products(),
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  })
}

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: catalogKeys.product(slug ?? ''),
    queryFn: () => fetchProductBySlug(slug!),
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
  })
}
