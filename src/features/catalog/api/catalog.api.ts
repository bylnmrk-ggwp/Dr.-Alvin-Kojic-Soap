import { supabase } from '@/lib/supabase/client'
import { products as seedProducts } from '@/data/products'
import { categories as seedCategories } from '@/data/categories'
import type { Category, Product } from '@/types'
import { toCategory, toProduct } from './mappers'

/**
 * Every read goes through Supabase when it is configured and falls back to
 * the local seed otherwise, so the catalogue renders identically either way.
 */
export async function fetchCategories(): Promise<Category[]> {
  if (!supabase) return seedCategories

  const { data, error } = await supabase.from('categories').select('*').order('sort_order')
  if (error) throw new Error(`Could not load categories: ${error.message}`)
  return data.map(toCategory)
}

export async function fetchProducts(): Promise<Product[]> {
  if (!supabase) return seedProducts

  const [categoriesResult, productsResult] = await Promise.all([
    supabase.from('categories').select('id, slug'),
    supabase.from('products').select('*').order('name'),
  ])

  if (categoriesResult.error) {
    throw new Error(`Could not load categories: ${categoriesResult.error.message}`)
  }
  if (productsResult.error) {
    throw new Error(`Could not load products: ${productsResult.error.message}`)
  }

  const slugById = new Map(categoriesResult.data.map((row) => [row.id, row.slug]))
  return productsResult.data.map((row) => toProduct(row, slugById))
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  if (!supabase) return seedProducts.find((product) => product.slug === slug) ?? null

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw new Error(`Could not load product: ${error.message}`)
  if (!data) return null

  const { data: categoryRows, error: categoryError } = await supabase
    .from('categories')
    .select('id, slug')
  if (categoryError) throw new Error(`Could not load categories: ${categoryError.message}`)

  return toProduct(data, new Map(categoryRows.map((row) => [row.id, row.slug])))
}
