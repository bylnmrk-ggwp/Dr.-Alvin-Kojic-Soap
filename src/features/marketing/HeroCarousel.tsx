import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { heroSlides } from '@/data/homepage'
import { cn } from '@/lib/utils'

const AUTOPLAY_MS = 6000
const SWIPE_THRESHOLD = 40

/**
 * Full-width banner slider mirroring the live site's opening. The copy is
 * printed on each banner, so the component only has to move between them:
 * arrows, dots, keyboard, swipe, and an autoplay that stops whenever the
 * visitor is interacting or has asked for reduced motion.
 */
export function HeroCarousel() {
  const slides = heroSlides
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const pointerStart = useRef<number | null>(null)

  const count = slides.length
  const goTo = useCallback((next: number) => setIndex(((next % count) + count) % count), [count])
  const previous = useCallback(() => goTo(index - 1), [goTo, index])
  const next = useCallback(() => goTo(index + 1), [goTo, index])

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (isPaused || reduceMotion || count < 2) return
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % count), AUTOPLAY_MS)
    return () => window.clearInterval(timer)
  }, [isPaused, reduceMotion, count])

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      previous()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      next()
    }
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointerStart.current = event.clientX
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (pointerStart.current === null) return
    const delta = event.clientX - pointerStart.current
    pointerStart.current = null
    if (Math.abs(delta) < SWIPE_THRESHOLD) return
    if (delta > 0) previous()
    else next()
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Dr. Alvin highlights"
      className="group/carousel relative bg-paper-sunk"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={onKeyDown}
    >
      <div
        className="relative aspect-[1140/500] w-full touch-pan-y select-none overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (pointerStart.current = null)}
        aria-live={isPaused ? 'polite' : 'off'}
      >
        <div
          className="flex h-full transition-transform duration-700 ease-out-quint motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, slideIndex) => {
            const isActive = slideIndex === index
            return (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${slideIndex + 1} of ${count}`}
                aria-hidden={!isActive}
                className="relative h-full w-full shrink-0"
              >
                <Link
                  to={slide.to}
                  tabIndex={isActive ? 0 : -1}
                  draggable={false}
                  className="block h-full w-full focus-visible:outline-offset-[-4px]"
                >
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    width={1140}
                    height={500}
                    draggable={false}
                    loading={slideIndex === 0 ? 'eager' : 'lazy'}
                    fetchPriority={slideIndex === 0 ? 'high' : 'auto'}
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </Link>
              </div>
            )
          })}
        </div>

        {count > 1 && (
          <>
            <CarouselArrow direction="previous" onClick={previous} />
            <CarouselArrow direction="next" onClick={next} />
          </>
        )}
      </div>

      {count > 1 && (
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2 sm:bottom-5" role="tablist" aria-label="Choose a slide">
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={slideIndex === index}
              aria-label={`Slide ${slideIndex + 1}`}
              onClick={() => goTo(slideIndex)}
              className="group/dot -m-1 p-1"
            >
              <span
                className={cn(
                  'block h-2 rounded-full bg-white/70 shadow-[0_0_0_1px_rgba(30,26,56,0.15)] transition-all duration-300',
                  slideIndex === index ? 'w-7 bg-white' : 'w-2 group-hover/dot:bg-white',
                )}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

function CarouselArrow({ direction, onClick }: { direction: 'previous' | 'next'; onClick: () => void }) {
  const Icon = direction === 'previous' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'previous' ? 'Previous slide' : 'Next slide'}
      className={cn(
        'absolute top-1/2 z-10 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-ink/55 text-white shadow-lg backdrop-blur-sm transition-[opacity,background-color,transform] duration-300 hover:bg-ink/80 sm:grid',
        'opacity-80 group-hover/carousel:opacity-100 focus-visible:opacity-100',
        direction === 'previous' ? 'left-3 sm:left-6' : 'right-3 sm:right-6',
      )}
    >
      <Icon size={22} strokeWidth={2} />
    </button>
  )
}
