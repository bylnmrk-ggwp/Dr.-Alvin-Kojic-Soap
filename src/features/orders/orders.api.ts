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
 * With Supabase configured, orders are created by the `place_order` database
 * function, which re-prices every line from the catalogue and writes the
 * order and its items in one transaction. The browser never inserts into the
 * order tables directly. Without Supabase, orders live in localStorage so the
 * checkout flow can be exercised end to end on a fresh clone.
 */
export async function placeOrder(input: PlaceOrderInput): Promise<Order> {
  if (!supabase) {
    const order = buildLocalOrder(input)
    writeLocalOrders([order, ...readLocalOrders()])
    return order
  }

  const { data, error } = await supabase.rpc('place_order', {
    p_items: input.lines.map((line) => ({ product_id: line.productId, quantity: line.quantity })),
    p_ship_to: input.shipTo as unknown as Json,
    p_payment_method: input.paymentMethod,
  })

  if (error) throw new Error(friendlyOrderError(error.message))
  const order = mapOrderJson(data)

  // Guests get a local copy so the confirmation page can render offline too.
  if (!input.userId) writeLocalOrders([order, ...readLocalOrders()])

  return order
}

export async function fetchOrderByReference(reference: string): Promise<Order | null> {
  const local = readLocalOrders().find((order) => order.reference === reference)
  if (!supabase) return local ?? null

  const { data, error } = await supabase.rpc('get_order_by_reference', { p_reference: reference })
  if (error || !data) return local ?? null
  return mapOrderJson(data)
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

// ------------------------------------------------------------------ mapping

/** Shape returned by place_order and get_order_by_reference. */
interface OrderJson {
  id: string
  reference: string
  status: OrderStatus
  placed_at: string
  subtotal_centavos: number
  shipping_centavos: number
  total_centavos: number
  payment_method: PaymentMethod
  ship_to: ShippingAddress
  items: {
    product_id: string | null
    name: string
    size_label: string
    unit_price_centavos: number
    quantity: number
  }[]
}

function mapOrderJson(json: Json): Order {
  const row = json as unknown as OrderJson
  return {
    id: row.id,
    reference: row.reference,
    status: row.status,
    placedAt: row.placed_at,
    subtotalCentavos: row.subtotal_centavos,
    shippingCentavos: row.shipping_centavos,
    totalCentavos: row.total_centavos,
    paymentMethod: row.payment_method,
    shipTo: row.ship_to,
    items: (row.items ?? []).map((item) => ({
      productId: item.product_id ?? '',
      name: item.name,
      sizeLabel: item.size_label,
      unitPriceCentavos: item.unit_price_centavos,
      quantity: item.quantity,
    })),
  }
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

export function mapOrderRow(row: OrderWithItems): Order {
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

/** Database errors carry the text we raised; strip the Postgres framing. */
function friendlyOrderError(message: string): string {
  return message.replace(/^.*?:\s*/, '').trim() || 'Could not place the order. Try again in a moment.'
}

function buildLocalOrder(input: PlaceOrderInput): Order {
  return {
    id: crypto.randomUUID(),
    reference: orderReference(),
    status: 'pending',
    placedAt: new Date().toISOString(),
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
