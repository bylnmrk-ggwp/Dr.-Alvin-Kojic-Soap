import { useMemo, useState } from 'react'
import { useCategories, useProducts } from '@/features/catalog/api/catalog.queries'
import { useUpdateProduct } from '@/features/admin/admin.queries'
import { InlineNumber } from '@/features/admin/components/InlineNumber'
import { ToggleSwitch } from '@/features/admin/components/ToggleSwitch'
import { Button, EmptyState, ProductImage, Skeleton, TextInput } from '@/components/ui'
import type { ProductPatch } from '@/features/admin/admin.api'
import type { Product } from '@/types'

export default function AdminProducts() {
  const { data: products = [], isLoading, error } = useProducts()
  const { data: categories = [] } = useCategories()
  const updateProduct = useUpdateProduct()
  const [search, setSearch] = useState('')

  const categoryNames = useMemo(
    () => new Map(categories.map((category) => [category.slug, category.name])),
    [categories],
  )

  const query = search.trim().toLowerCase()
  const visible = query ? products.filter((product) => product.name.toLowerCase().includes(query)) : products
  const featuredCount = products.filter((product) => product.isFeatured).length

  const save = (id: string, patch: ProductPatch) => updateProduct.mutate({ id, patch })

  return (
    <section aria-labelledby="admin-products-heading">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="admin-products-heading" className="text-heading">
            Products
          </h2>
          <p className="mt-2 text-[0.9375rem] text-ink-soft">
            Featured products appear on the homepage in this order.
            {featuredCount > 0 && ` ${featuredCount} featured right now.`}
          </p>
        </div>
        <TextInput
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name"
          aria-label="Search products by name"
          className="md:w-72"
        />
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="grid gap-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : error ? (
          <p className="border border-alert/30 bg-white px-4 py-3.5 text-sm text-alert">{error.message}</p>
        ) : visible.length === 0 ? (
          <EmptyState
            title={query ? 'No products match' : 'No products yet'}
            description={
              query
                ? `Nothing in the catalogue is called "${search.trim()}". Try a shorter search.`
                : 'Run the catalogue import and the products will appear here.'
            }
            action={
              query ? (
                <Button variant="outline" onClick={() => setSearch('')}>
                  Clear search
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto border border-rule bg-white">
            <table className="w-full min-w-[56rem] text-[0.9375rem]">
              <thead>
                <tr className="text-left text-sm text-ink-faint">
                  <th scope="col" className="px-4 py-3 font-medium" colSpan={2}>
                    Product
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Category
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Price
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Featured
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Best seller
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    In stock
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    categoryName={categoryNames.get(product.categorySlug) ?? product.categorySlug}
                    onSave={(patch) => save(product.id, patch)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

function ProductRow({
  product,
  categoryName,
  onSave,
}: {
  product: Product
  categoryName: string
  onSave: (patch: ProductPatch) => void
}) {
  return (
    <tr className="border-t border-rule align-middle">
      <td className="w-16 py-3 pr-0 pl-4">
        <ProductImage
          src={product.images[0] ?? null}
          alt=""
          tone={product.imageTone}
          categorySlug={product.categorySlug}
          className="size-12 rounded-[3px]"
        />
      </td>
      <td className="px-4 py-3">
        <p className="font-medium">{product.name}</p>
        <p className="text-[0.8125rem] text-ink-faint">{product.sizeLabel}</p>
      </td>
      <td className="px-4 py-3 text-ink-soft">{categoryName}</td>
      <td className="px-4 py-3">
        <InlineNumber
          key={product.priceCentavos}
          value={product.priceCentavos / 100}
          prefix="₱"
          step={0.01}
          label={`Price for ${product.name} in pesos`}
          onCommit={(pesos) => {
            if (pesos !== null) onSave({ priceCentavos: Math.round(pesos * 100) })
          }}
          className="w-32"
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <ToggleSwitch
            checked={product.isFeatured}
            label={`Feature ${product.name} on the homepage`}
            onChange={(next) => onSave({ isFeatured: next })}
          />
          {product.isFeatured && (
            <InlineNumber
              key={product.featuredOrder ?? 'unset'}
              value={product.featuredOrder}
              allowEmpty
              min={1}
              label={`Homepage position for ${product.name}`}
              onCommit={(order) => onSave({ featuredOrder: order })}
              className="w-16"
            />
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <ToggleSwitch
          checked={product.isBestSeller}
          label={`Mark ${product.name} as a best seller`}
          onChange={(next) => onSave({ isBestSeller: next })}
        />
      </td>
      <td className="px-4 py-3">
        <ToggleSwitch
          checked={product.inStock}
          label={`${product.name} is in stock`}
          onChange={(next) => onSave({ inStock: next })}
        />
      </td>
    </tr>
  )
}
