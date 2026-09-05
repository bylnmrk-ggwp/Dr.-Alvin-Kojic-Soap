import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageMeta } from '@/components/common/PageMeta'
import { Button, ButtonLink, EmptyState, Field, ProductImage, TextArea, TextInput } from '@/components/ui'
import { checkoutSchema, type CheckoutValues } from '@/lib/validation/schemas'
import { useCartStore, selectTotals } from '@/stores/cart.store'
import { usePlaceOrder } from '@/features/orders/orders.queries'
import { useProducts } from '@/features/catalog/api/catalog.queries'
import { useAuth } from '@/features/auth/useAuth'
import { QuantityStepper } from '@/features/cart/QuantityStepper'
import { formatPrice } from '@/lib/utils'
import { freeShippingThresholdCentavos } from '@/config/site'
import { toast } from '@/stores/toast.store'
import { cn } from '@/lib/utils'

const paymentOptions: { value: CheckoutValues['paymentMethod']; label: string; detail: string }[] = [
  { value: 'cod', label: 'Cash on delivery', detail: 'Pay the courier. Available on orders up to ₱5,000.' },
  { value: 'gcash', label: 'GCash', detail: 'We send a payment request to your mobile number after you place the order.' },
  { value: 'bank-transfer', label: 'Bank transfer', detail: 'BPI or BDO details are on the confirmation page. Ships once cleared.' },
]

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { lines, setQuantity, clear } = useCartStore()
  const totals = selectTotals(lines)
  const { data: products = [] } = useProducts()
  const { user, profile } = useAuth()
  const placeOrder = usePlaceOrder()

  const productById = new Map(products.map((product) => [product.id, product]))

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: profile?.fullName ?? '',
      email: user?.email ?? '',
      phone: profile?.phone ?? '',
      paymentMethod: 'cod',
    },
  })

  const paymentMethod = form.watch('paymentMethod')
  const codBlocked = paymentMethod === 'cod' && totals.totalCentavos > 500_000

  const onSubmit = form.handleSubmit(async ({ paymentMethod: method, ...shipTo }) => {
    if (codBlocked) {
      form.setError('paymentMethod', { message: 'Cash on delivery is limited to ₱5,000. Choose GCash or bank transfer.' })
      return
    }
    try {
      const order = await placeOrder.mutateAsync({
        lines,
        shipTo,
        paymentMethod: method,
        subtotalCentavos: totals.subtotalCentavos,
        shippingCentavos: totals.shippingCentavos,
        totalCentavos: totals.totalCentavos,
        userId: user?.id ?? null,
      })
      clear()
      navigate(`/order/${order.reference}`, { replace: true })
    } catch (error) {
      toast.error('Order not placed', error instanceof Error ? error.message : 'Try again in a moment.')
    }
  })

  if (lines.length === 0) {
    return (
      <div className="shell py-16">
        <PageMeta title="Checkout" />
        <EmptyState
          title="Nothing to check out yet"
          description="Your cart is empty. Add a product and come back."
          action={<ButtonLink to="/shop">Browse products</ButtonLink>}
        />
      </div>
    )
  }

  return (
    <>
      <PageMeta title="Checkout" />
      <div className="shell pt-12 lg:pt-16">
        <h1 className="text-title">Checkout</h1>

        <form onSubmit={onSubmit} noValidate className="mt-10 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div className="grid gap-12">
            <section aria-labelledby="delivery-heading" className="grid gap-5">
              <h2 id="delivery-heading" className="text-heading">
                Delivery
              </h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Recipient name" required error={form.formState.errors.fullName?.message}>
                  {(props) => <TextInput {...props} autoComplete="name" {...form.register('fullName')} />}
                </Field>
                <Field label="Mobile number" required hint="The courier will text this number." error={form.formState.errors.phone?.message}>
                  {(props) => <TextInput {...props} type="tel" autoComplete="tel" placeholder="0917 123 4567" {...form.register('phone')} />}
                </Field>
              </div>
              <Field label="Email" required hint="For the order confirmation and tracking updates." error={form.formState.errors.email?.message}>
                {(props) => <TextInput {...props} type="email" autoComplete="email" {...form.register('email')} />}
              </Field>
              <Field label="House number and street" required error={form.formState.errors.street?.message}>
                {(props) => <TextInput {...props} autoComplete="address-line1" {...form.register('street')} />}
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Barangay" required error={form.formState.errors.barangay?.message}>
                  {(props) => <TextInput {...props} autoComplete="address-line2" {...form.register('barangay')} />}
                </Field>
                <Field label="City or municipality" required error={form.formState.errors.city?.message}>
                  {(props) => <TextInput {...props} autoComplete="address-level2" {...form.register('city')} />}
                </Field>
                <Field label="Province" required error={form.formState.errors.province?.message}>
                  {(props) => <TextInput {...props} autoComplete="address-level1" {...form.register('province')} />}
                </Field>
                <Field label="Postal code" required error={form.formState.errors.postalCode?.message}>
                  {(props) => <TextInput {...props} inputMode="numeric" autoComplete="postal-code" maxLength={4} {...form.register('postalCode')} />}
                </Field>
              </div>
              <Field label="Delivery notes" error={form.formState.errors.notes?.message}>
                {(props) => <TextArea {...props} rows={2} placeholder="Landmarks, gate colour, best time to deliver." {...form.register('notes')} />}
              </Field>
            </section>

            <section aria-labelledby="payment-heading">
              <h2 id="payment-heading" className="text-heading">
                Payment
              </h2>
              <div role="radiogroup" aria-labelledby="payment-heading" className="mt-5 grid gap-2">
                {paymentOptions.map((option) => {
                  const selected = paymentMethod === option.value
                  return (
                    <label
                      key={option.value}
                      className={cn(
                        'flex cursor-pointer items-start gap-3.5 border bg-white px-4 py-3.5 transition-colors',
                        selected ? 'border-violet' : 'border-rule hover:border-rule-strong',
                      )}
                    >
                      <input
                        type="radio"
                        value={option.value}
                        className="mt-1 size-4 accent-violet"
                        {...form.register('paymentMethod')}
                      />
                      <span>
                        <span className="block text-[0.9375rem] font-medium">{option.label}</span>
                        <span className="mt-0.5 block text-[0.8125rem] leading-snug text-ink-faint">{option.detail}</span>
                      </span>
                    </label>
                  )
                })}
              </div>
              {(form.formState.errors.paymentMethod || codBlocked) && (
                <p className="mt-3 text-[0.8125rem] font-medium text-alert">
                  {form.formState.errors.paymentMethod?.message ??
                    'Cash on delivery is limited to ₱5,000. Choose GCash or bank transfer for this order.'}
                </p>
              )}
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-rule bg-white p-6">
              <h2 className="text-heading">Your order</h2>

              <ul className="mt-5 divide-y divide-rule">
                {lines.map((line) => (
                  <li key={line.productId} className="flex gap-4 py-4">
                    <div className="size-16 shrink-0 overflow-hidden rounded-card border border-rule">
                      <ProductImage
                        src={line.image ?? productById.get(line.productId)?.images[0]}
                        alt=""
                        tone={line.imageTone}
                        categorySlug={productById.get(line.productId)?.categorySlug ?? 'creams'}
                        sizes="64px"
                        className="size-full"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <p className="truncate text-[0.9375rem] font-medium">{line.name}</p>
                        <p className="text-[0.8125rem] text-ink-faint">{line.sizeLabel}</p>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <QuantityStepper
                          size="sm"
                          label={line.name}
                          value={line.quantity}
                          min={0}
                          onChange={(next) => setQuantity(line.productId, next)}
                        />
                        <span className="tabular text-sm font-medium">{formatPrice(line.unitPriceCentavos * line.quantity)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <dl className="mt-2 grid gap-2 border-t border-rule pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Subtotal</dt>
                  <dd className="tabular">{formatPrice(totals.subtotalCentavos)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Shipping</dt>
                  <dd className="tabular">{totals.shippingCentavos === 0 ? 'Free' : formatPrice(totals.shippingCentavos)}</dd>
                </div>
                {totals.shippingCentavos > 0 && (
                  <p className="text-[0.8125rem] text-ink-faint">
                    Free shipping from {formatPrice(freeShippingThresholdCentavos)}.
                  </p>
                )}
                <div className="flex justify-between border-t border-rule pt-3 text-lg font-semibold">
                  <dt>Total</dt>
                  <dd className="tabular">{formatPrice(totals.totalCentavos)}</dd>
                </div>
              </dl>

              <Button type="submit" size="lg" className="mt-6 w-full" disabled={form.formState.isSubmitting || placeOrder.isPending}>
                {placeOrder.isPending ? 'Placing order' : `Place order, ${formatPrice(totals.totalCentavos)}`}
              </Button>
              <p className="mt-3 text-center text-[0.8125rem] leading-snug text-ink-faint">
                By placing the order you agree to the terms and the seven-day return policy.
              </p>
            </div>
          </aside>
        </form>
      </div>
    </>
  )
}
