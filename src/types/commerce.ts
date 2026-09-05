import type { Product } from './catalog'

export interface CartLine {
  productId: string
  slug: string
  name: string
  sizeLabel: string
  unitPriceCentavos: number
  quantity: number
  imageTone: string
}

export interface CartTotals {
  subtotalCentavos: number
  shippingCentavos: number
  totalCentavos: number
  itemCount: number
}

export type OrderStatus = 'pending' | 'paid' | 'packed' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  productId: string
  name: string
  sizeLabel: string
  unitPriceCentavos: number
  quantity: number
}

export interface Order {
  id: string
  reference: string
  status: OrderStatus
  placedAt: string
  items: OrderItem[]
  subtotalCentavos: number
  shippingCentavos: number
  totalCentavos: number
  shipTo: ShippingAddress
  paymentMethod: PaymentMethod
}

export type PaymentMethod = 'cod' | 'gcash' | 'bank-transfer'

export interface ShippingAddress {
  fullName: string
  phone: string
  email: string
  street: string
  barangay: string
  city: string
  province: string
  postalCode: string
  notes?: string
}

export type ProductLike = Pick<
  Product,
  'id' | 'slug' | 'name' | 'sizeLabel' | 'priceCentavos' | 'imageTone'
>
