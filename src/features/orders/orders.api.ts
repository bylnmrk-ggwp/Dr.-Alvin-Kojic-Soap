import { supabase } from '@/lib/supabase/client'
import { orderReference } from '@/lib/utils'
import type { CartLine, Order, OrderStatus, PaymentMethod, ShippingAddress } from '@/types'
import type { Json } from '@/lib/supabase/database.types'

const LOCAL_ORDERS_KEY = 'dr-alvin-orders'

interface PlaceOrderInput {
  lines: CartLine[]
  shipTo: ShippingAddress
  paymentMethod: PaymentMethod
  subtotalCentavos: number
  shippingCentavos: number
  totalCentavos: number
  userId: string | null
}

/**
 * Orders go to Supabase when it is configured. Without it they are kept in
 * localStorage so the checkout flow can be exercised end to end on a fresh
 * clone — the confirmation page and order history both read from here.
 */
export async function placeOrder(input: PlaceOrderInput): Promise<Order> {
  const reference = orderReference()
  const placedAt = new Date().toISOString()

  const order: Order = {
    id: crypto.randomUUID(),
    reference,
    status: 'pending',
    placedAt,
    items: input.lines.map((line) => ({
      productId: line.productId,
      name: line.name,
      sizeLabel: line.sizeLabel,
      unitPriceCentavos: line.unitPriceCentavos,
      quantity: line.quantity,
    })),
    subtotalCentavos: input.subtotalCentavos,
    shippingCentavos: input.shippingCentavos,
    totalCentavos: input.totalCentavos,
    shipTo: input.shipTo,
    paymentMethod: input.paymentMethod,
  }

  if (!supabase) {
    const existing = readLocalOrders()
    writeLocalOrders([order, ...existing])
    return order
  }

  const { data: inserted, error } = await supabase
    .from('orders')
    .insert({
      user_id: input.userId,
      reference,
      status: 'pending',
      subtotal_centavos: input.subtotalCentavos,
      shipping_centavos: input.shippingCentavos,
      total_centavos: input.totalCentavos,
      payment_method: input.paymentMethod,
      ship_to: input.shipTo as unknown as Json,
      placed_at: placedAt,
    })
    .select('id')
    .single()

  if (error) throw new Error(`Could not place the order: ${error.message}`)

  const { error: itemsError } = await supabase.from('order_items').insert(
    order.items.map((item) => ({
      order_id: inserted.id,
      product_id: item.productId,
      name: item.name,
      size_label: item.sizeLabel,
      unit_price_centavos: item.unitPriceCentavos,
      quantity: item.quantity,
    })),
  )

  if (itemsError) throw new Error(`Order saved but items failed: ${itemsError.message}`)

  // Guests get a local copy so the confirmation page can render without a session.
  if (!input.userId) writeLocalOrders([{ ...order, id: inserted.id }, ...readLocalOrders()])

  return { ...order, id: inserted.id }
}

export async function fetchOrderByReference(reference: string): Promise<Order | null> {
  const local = readLocalOrders().find((order) => order.reference === reference)
  if (!supabase) return local ?? null

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('reference', reference)
    .maybeSingle()

  if (error || !data) return local ?? null
  return mapOrderRow(data)
}

export async function fetchMyOrders(userId: string | null): Promise<Order[]> {
  if (!supabase || !userId) return readLocalOrders()

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', userId)
    .order('placed_at', { ascending: false })

  if (error) throw new Error(`Could not load your orders: ${error.message}`)
  return data.map(mapOrderRow)
}

type OrderWithItems = {
  id: string
  reference: string
  status: OrderStatus
  placed_at: string
  subtotal_centavos: number
  shipping_centavos: number
  total_centavos: number
  payment_method: PaymentMethod
  ship_to: Json
  order_items: {
    product_id: string | null
    name: string
    size_label: string
    unit_price_centavos: number
    quantity: number
  }[]
}

function mapOrderRow(row: OrderWithItems): Order {
  return {
    id: row.id,
    reference: row.reference,
    status: row.status,
    placedAt: row.placed_at,
    subtotalCentavos: row.subtotal_centavos,
    shippingCentavos: row.shipping_centavos,
    totalCentavos: row.total_centavos,
    paymentMethod: row.payment_method,
    shipTo: row.ship_to as unknown as ShippingAddress,
    items: row.order_items.map((item) => ({
      productId: item.product_id ?? '',
      name: item.name,
      sizeLabel: item.size_label,
      unitPriceCentavos: item.unit_price_centavos,
      quantity: item.quantity,
    })),
  }
}

function readLocalOrders(): Order[] {
  try {
    const raw = window.localStorage.getItem(LOCAL_ORDERS_KEY)
    return raw ? (JSON.parse(raw) as Order[]) : []
  } catch {
    return []
  }
}

function writeLocalOrders(orders: Order[]) {
  try {
    window.localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders.slice(0, 25)))
  } catch {
    // Storage can be unavailable in private windows; the order still completed.
  }
}
