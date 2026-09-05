import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { SectionHeading } from '@/components/common/SectionHeading'
import { communityPhotos } from '@/data/homepage'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { useOnEscape } from '@/hooks/useOnEscape'
import { cn } from '@/lib/utils'

/**
 * The photo strip that closes the live homepage: a scroll-snap row of
 * community photos with arrows, and a lightbox for a closer look.
 */
export function CommunityGallery() {
  const photos = communityPhotos
  const scroller = useRef<HTMLUListElement>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const scrollByPage = (direction: -1 | 1) => {
    const element = scroller.current
    if (!element) return
    element.scrollBy({ left: direction * element.clientWidth, behavior: 'smooth' })
  }

  return (
    <section id="community" aria-label="Out in the community" className="border-t border-rule bg-paper py-16 lg:py-20">
      <div className="shell">
        <SectionHeading
          title="Out in the community"
          description="Distributor launches, beauty caravans and town parades. Nearly three decades of showing up in person."
        />
      </div>

      <div className="group/strip relative mt-10">
        <ul
          ref={scroller}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:px-10 [&::-webkit-scrollbar]:hidden"
          aria-label="Community photos"
        >
          {photos.map((photo, index) => (
            <li
              key={photo.id}
              className="w-[68%] shrink-0 snap-start sm:w-[calc((100%-0.75rem)/2)] md:w-[calc((100%-1.5rem)/3)] xl:w-[calc((100%-3rem)/5)]"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-label={`Open photo ${index + 1} of ${photos.length}`}
                className="group/photo block w-full overflow-hidden rounded-card border border-rule bg-paper-sunk"
              >
                <img
                  src={photo.image}
                  alt={photo.alt}
                  width={600}
                  height={460}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[600/460] w-full object-cover transition-transform duration-500 ease-out group-hover/photo:scale-[1.04]"
                />
              </button>
            </li>
          ))}
        </ul>

        <StripArrow direction="previous" onClick={() => scrollByPage(-1)} />
        <StripArrow direction="next" onClick={() => scrollByPage(1)} />
      </div>

      {openIndex !== null && (
        <Lightbox
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onNavigate={(nextIndex) => setOpenIndex(((nextIndex % photos.length) + photos.length) % photos.length)}
        />
      )}
    </section>
  )
}

function StripArrow({ direction, onClick }: { direction: 'previous' | 'next'; onClick: () => void }) {
  const Icon = direction === 'previous' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'previous' ? 'Scroll photos left' : 'Scroll photos right'}
      className={cn(
        'absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-ink/55 text-white shadow-lg backdrop-blur-sm transition-[opacity,background-color] duration-300 hover:bg-ink/80 md:grid',
        'opacity-80 group-hover/strip:opacity-100 focus-visible:opacity-100',
        direction === 'previous' ? 'left-3' : 'right-3',
      )}
    >
      <Icon size={22} strokeWidth={2} />
    </button>
  )
}

function Lightbox({
  index,
  onClose,
  onNavigate,
}: {
  index: number
  onClose: () => void
  onNavigate: (index: number) => void
}) {
  const photos = communityPhotos
  const photo = photos[index]
  const closeButton = useRef<HTMLButtonElement>(null)

  useLockBodyScroll(true)
  useOnEscape(true, onClose)

  useEffect(() => {
    closeButton.current?.focus()
  }, [])

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') onNavigate(index - 1)
      if (event.key === 'ArrowRight') onNavigate(index + 1)
    },
    [index, onNavigate],
  )

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onKeyDown])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8" role="presentation">
      <button
        type="button"
        aria-label="Close photo"
        onClick={onClose}
        className="absolute inset-0 bg-ink/85 backdrop-blur-[2px]"
      />

      <figure
        role="dialog"
        aria-modal="true"
        aria-label={`Photo ${index + 1} of ${photos.length}`}
        className="relative inline-block max-w-5xl"
      >
        <img
          src={photo.image}
          alt={photo.alt}
          width={600}
          height={460}
          className="mx-auto max-h-[80vh] w-auto max-w-full rounded-card shadow-2xl"
        />
        <figcaption className="mt-3 text-center text-sm text-paper/80">
          {index + 1} / {photos.length}
        </figcaption>

        <button
          ref={closeButton}
          type="button"
          onClick={onClose}
          aria-label="Close photo"
          className="absolute -top-3 -right-3 grid size-10 place-items-center rounded-full bg-white text-ink shadow-lg transition-colors hover:bg-paper-sunk"
        >
          <X size={18} strokeWidth={2} />
        </button>

        <button
          type="button"
          onClick={() => onNavigate(index - 1)}
          aria-label="Previous photo"
          className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-lg transition-colors hover:bg-white sm:-left-14"
        >
          <ChevronLeft size={22} strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={() => onNavigate(index + 1)}
          aria-label="Next photo"
          className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-lg transition-colors hover:bg-white sm:-right-14"
        >
          <ChevronRight size={22} strokeWidth={2} />
        </button>
      </figure>
    </div>
  )
}
