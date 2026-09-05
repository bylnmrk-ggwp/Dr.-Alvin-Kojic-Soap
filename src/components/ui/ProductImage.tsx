import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { ProductVisual } from './ProductVisual'

interface ProductImageProps {
  /** Local path under /products. Null or a failed load falls back to the drawn vessel. */
  src?: string | null
  alt: string
  tone: string
  categorySlug: string
  initials?: string
  className?: string
  /** Above-the-fold images should not be lazy. */
  priority?: boolean
  sizes?: string
}

/**
 * The product photograph, cropped square. The live catalogue ships every
 * photo as a 1:1 brand card, so object-cover keeps the frame intact. When
 * there is no photo, or the file is missing, the drawn vessel steps in so a
 * broken image never reaches the customer.
 */
export function ProductImage({
  src,
  alt,
  tone,
  categorySlug,
  initials,
  className,
  priority = false,
  sizes,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (!src || failed) {
    return (
      <div className={cn('relative overflow-hidden', className)}>
        <ProductVisual tone={tone} categorySlug={categorySlug} initials={initials} />
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden bg-marigold-wash', className)}>
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onError={() => setFailed(true)}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  )
}

interface ProductGalleryProps {
  images: string[]
  name: string
  tone: string
  categorySlug: string
}

/** Main photo with a thumbnail strip when a product has more than one. */
export function ProductGallery({ images, name, tone, categorySlug }: ProductGalleryProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
  }, [images])

  const current = images[index] ?? images[0] ?? null

  return (
    <div className="grid gap-3">
      <ProductImage
        src={current}
        alt={name}
        tone={tone}
        categorySlug={categorySlug}
        initials={name.slice(0, 2)}
        priority
        sizes="(min-width: 1024px) 40vw, 100vw"
        className="aspect-square w-full rounded-card"
      />

      {images.length > 1 && (
        <ul className="flex gap-2" aria-label={`${name} photos`}>
          {images.map((image, imageIndex) => (
            <li key={image}>
              <button
                type="button"
                onClick={() => setIndex(imageIndex)}
                aria-label={`Photo ${imageIndex + 1} of ${images.length}`}
                aria-pressed={imageIndex === index}
                className={cn(
                  'block size-16 overflow-hidden rounded-card border-2 transition-colors sm:size-20',
                  imageIndex === index ? 'border-violet' : 'border-transparent hover:border-rule-strong',
                )}
              >
                <ProductImage
                  src={image}
                  alt=""
                  tone={tone}
                  categorySlug={categorySlug}
                  sizes="80px"
                  className="size-full"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
