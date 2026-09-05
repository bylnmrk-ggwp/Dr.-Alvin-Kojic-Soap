import { requireSupabase } from '@/lib/supabase/client'
import { mapOrderRow } from '@/features/orders/orders.api'
import type { Database } from '@/lib/supabase/database.types'
import type { DistributorApplication, DistributorApplicationStatus, Order, OrderStatus } from '@/types'

/** Everything the admin can change on a product; nulling featuredOrder clears it. */
export interface ProductPatch {
  priceCentavos?: number
  isFeatured?: boolean
  featuredOrder?: number | null
  isBestSeller?: boolean
  inStock?: boolean
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  topic: string
  message: string
  submittedAt: string
}

type ProductUpdate = Database['public']['Tables']['products']['Update']

/**
 * Every call here needs a signed-in admin; row-level security enforces that
 * on the server, and `requireSupabase` explains the missing project locally.
 */
export async function updateProduct(id: string, patch: ProductPatch): Promise<void> {
  const client = requireSupabase()

  const update: ProductUpdate = {}
  if (patch.priceCentavos !== undefined) update.price_centavos = patch.priceCentavos
  if (patch.isFeatured !== undefined) update.is_featured = patch.isFeatured
  if (patch.featuredOrder !== undefined) update.featured_order = patch.featuredOrder
  if (patch.isBestSeller !== undefined) update.is_best_seller = patch.isBestSeller
  if (patch.inStock !== undefined) update.in_stock = patch.inStock

  const { error } = await client.from('products').update(update).eq('id', id)
  if (error) throw new Error(`Could not save the product: ${error.message}`)
}

export async function fetchAllOrders(): Promise<Order[]> {
  const client = requireSupabase()

  const { data, error } = await client
    .from('orders')
    .select('*, order_items(*)')
    .order('placed_at', { ascending: false })

  if (error) throw new Error(`Could not load orders: ${error.message}`)
  return data.map(mapOrderRow)
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const client = requireSupabase()

  const { error } = await client.from('orders').update({ status }).eq('id', id)
  if (error) throw new Error(`Could not update the order: ${error.message}`)
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const client = requireSupabase()

  const { data, error } = await client
    .from('contact_messages')
    .select('*')
    .order('submitted_at', { ascending: false })

  if (error) throw new Error(`Could not load messages: ${error.message}`)
  return data.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    topic: row.topic,
    message: row.message,
    submittedAt: row.submitted_at,
  }))
}

export async function fetchDistributorApplications(): Promise<DistributorApplication[]> {
  const client = requireSupabase()

  const { data, error } = await client
    .from('distributor_applications')
    .select('*')
    .order('submitted_at', { ascending: false })

  if (error) throw new Error(`Could not load applications: ${error.message}`)
  return data.map((row) => ({
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    city: row.city,
    province: row.province,
    sellingExperience: row.selling_experience,
    message: row.message,
    status: row.status,
    submittedAt: row.submitted_at,
  }))
}

export async function updateApplicationStatus(
  id: string,
  status: DistributorApplicationStatus,
): Promise<void> {
  const client = requireSupabase()

  const { error } = await client.from('distributor_applications').update({ status }).eq('id', id)
  if (error) throw new Error(`Could not update the application: ${error.message}`)
}
