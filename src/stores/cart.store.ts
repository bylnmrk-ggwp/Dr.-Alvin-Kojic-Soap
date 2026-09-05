import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { flatShippingCentavos, freeShippingThresholdCentavos } from '@/config/site'
import type { CartLine, CartTotals, ProductLike } from '@/types'

interface CartState {
  lines: CartLine[]
  isDrawerOpen: boolean
  /** The line just added, so the drawer can highlight it briefly. */
  lastAddedId: string | null
  add: (product: ProductLike, quantity?: number) => void
  setQuantity: (productId: string, quantity: number) => void
  remove: (productId: string) => void
  clear: () => void
  openDrawer: () => void
  closeDrawer: () => void
}

const MAX_PER_LINE = 20

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isDrawerOpen: false,
      lastAddedId: null,

      add: (product, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find((line) => line.productId === product.id)
          const lines = existing
            ? state.lines.map((line) =>
                line.productId === product.id
                  ? { ...line, quantity: Math.min(line.quantity + quantity, MAX_PER_LINE) }
                  : line,
              )
            : [
                ...state.lines,
                {
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  sizeLabel: product.sizeLabel,
                  unitPriceCentavos: product.priceCentavos,
                  quantity: Math.min(quantity, MAX_PER_LINE),
                  imageTone: product.imageTone,
                  image: product.images[0] ?? null,
                },
              ]
          return { lines, isDrawerOpen: true, lastAddedId: product.id }
        }),

      setQuantity: (productId, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((line) => line.productId !== productId)
              : state.lines.map((line) =>
                  line.productId === productId
                    ? { ...line, quantity: Math.min(quantity, MAX_PER_LINE) }
                    : line,
                ),
        })),

      remove: (productId) =>
        set((state) => ({ lines: state.lines.filter((line) => line.productId !== productId) })),

      clear: () => set({ lines: [], lastAddedId: null }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false, lastAddedId: null }),
    }),
    { name: 'dr-alvin-cart', partialize: (state) => ({ lines: state.lines }) },
  ),
)

export function selectTotals(lines: CartLine[]): CartTotals {
  const subtotalCentavos = lines.reduce(
    (sum, line) => sum + line.unitPriceCentavos * line.quantity,
    0,
  )
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0)
  const shippingCentavos =
    subtotalCentavos === 0 || subtotalCentavos >= freeShippingThresholdCentavos
      ? 0
      : flatShippingCentavos

  return {
    subtotalCentavos,
    shippingCentavos,
    totalCentavos: subtotalCentavos + shippingCentavos,
    itemCount,
  }
}
