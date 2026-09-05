import { Link, useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { Button, ButtonLink, Drawer, ProductImage } from '@/components/ui'
import { useCartStore, selectTotals } from '@/stores/cart.store'
import { useProducts } from '@/features/catalog/api/catalog.queries'
import { formatPrice, pluralise } from '@/lib/utils'
import { freeShippingThresholdCentavos } from '@/config/site'
import { QuantityStepper } from './QuantityStepper'

export function CartDrawer() {
  const navigate = useNavigate()
  const { lines, isDrawerOpen, closeDrawer, setQuantity, remove } = useCartStore()
  const totals = selectTotals(lines)
  const { data: products = [] } = useProducts()

  const productById = new Map(products.map((product) => [product.id, product]))
  const remainingForFreeShipping = freeShippingThresholdCentavos - totals.subtotalCentavos

  return (
    <Drawer
      open={isDrawerOpen}
      onClose={closeDrawer}
      title={`Cart (${totals.itemCount} ${pluralise(totals.itemCount, 'item')})`}
      footer={
        lines.length > 0 && (
          <div className="grid gap-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-ink-soft">Subtotal</span>
              <span className="tabular text-lg font-semibold">
                {formatPrice(totals.subtotalCentavos)}
              </span>
            </div>
            <p className="text-[0.8125rem] text-ink-faint">
              {totals.shippingCentavos === 0
                ? 'Free shipping applied.'
                : `Add ${formatPrice(remainingForFreeShipping)} for free shipping.`}
            </p>
            <Button
              size="lg"
              onClick={() => {
                closeDrawer()
                navigate('/checkout')
              }}
            >
              Checkout
            </Button>
            <button
              type="button"
              onClick={closeDrawer}
              className="text-sm text-ink-soft underline underline-offset-4 transition-colors hover:text-ink"
            >
              Keep shopping
            </button>
          </div>
        )
      }
    >
      {lines.length === 0 ? (
        <div className="px-5 py-14 text-center">
          <p className="text-[1.0625rem] font-medium">Your cart is empty</p>
          <p className="prose-reading mx-auto mt-2 text-[0.9375rem]">
            Not sure where to begin? The regimen guide sorts the range into four steps and tells you
            which one you actually need.
          </p>
          <div className="mt-6 grid gap-2">
            <ButtonLink to="/shop" onClick={closeDrawer}>
              Browse products
            </ButtonLink>
            <ButtonLink to="/regimen" variant="outline" onClick={closeDrawer}>
              Read the regimen guide
            </ButtonLink>
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-rule px-5">
          {lines.map((line) => (
            <li key={line.productId} className="flex gap-4 py-4">
              <Link
                to={`/product/${line.slug}`}
                onClick={closeDrawer}
                className="size-20 shrink-0 overflow-hidden rounded-card border border-rule"
              >
                <ProductImage
                  src={line.image ?? productById.get(line.productId)?.images[0]}
                  alt=""
                  tone={line.imageTone}
                  categorySlug={productById.get(line.productId)?.categorySlug ?? 'creams'}
                  sizes="80px"
                  className="size-full"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <Link
                    to={`/product/${line.slug}`}
                    onClick={closeDrawer}
                    className="block text-[0.9375rem] font-medium leading-snug text-ink transition-colors hover:text-violet"
                  >
                    {line.name}
                  </Link>
                  <p className="mt-0.5 text-[0.8125rem] text-ink-faint">{line.sizeLabel}</p>
                </div>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <QuantityStepper
                    size="sm"
                    label={line.name}
                    value={line.quantity}
                    min={0}
                    onChange={(next) => setQuantity(line.productId, next)}
                  />
                  <span className="tabular text-sm font-medium">
                    {formatPrice(line.unitPriceCentavos * line.quantity)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => remove(line.productId)}
                aria-label={`Remove ${line.name} from cart`}
                className="-mt-1 -mr-1 h-fit rounded-[3px] p-1.5 text-ink-faint transition-colors hover:bg-chalk hover:text-alert"
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  )
}
