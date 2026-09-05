import { Link } from 'react-router-dom'
import { Quote, Star } from 'lucide-react'
import { testimonials } from '@/data/testimonials'
import { Reveal } from '@/components/common/Reveal'
import { cn } from '@/lib/utils'
import { VideoEmbed } from './VideoEmbed'

const ENDORSEMENT = {
  videoId: 'rZAf623mNp0',
  title: 'Joshua Garcia x Dr. Alvin Family',
  poster: '/video/joshua-garcia-endorsement.webp',
}

export function Testimonials() {
  const average = testimonials.reduce((sum, item) => sum + item.rating, 0) / testimonials.length

  return (
    <section aria-labelledby="testimonials-heading" className="relative overflow-hidden border-y border-rule bg-paper-sunk">
      {/* A soft brand wash behind the video side so the section does not read as flat. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-10 size-[36rem] rounded-full bg-marigold/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-0 size-[28rem] rounded-full bg-violet/10 blur-3xl"
      />

      <div className="shell relative py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <Reveal>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-violet">Testimonials</p>
            <h2 id="testimonials-heading" className="mt-3 text-title">
              What our clients say
            </h2>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <span className="tabular text-[4.5rem] font-semibold leading-none tracking-[-0.04em] text-ink sm:text-[5.5rem]">
                {average.toFixed(1)}
              </span>
              <div>
                <StarRow value={average} size={26} animate />
                <p className="mt-2 text-[1.0625rem] font-medium text-ink">Perfect customer rating</p>
                <p className="text-[0.875rem] text-ink-faint">Across reviews shared with us by customers and resellers</p>
              </div>
            </div>

            <p className="prose-reading mt-8">
              People come for the price, stay for the results, and a good number end up selling it
              themselves. These are unedited, including the parts about peeling.
            </p>
          </Reveal>

          <Reveal delay={120} className="lg:justify-self-end">
            <figure className="mx-auto w-full max-w-[19rem] sm:max-w-[21rem]">
              <VideoEmbed
                videoId={ENDORSEMENT.videoId}
                title={ENDORSEMENT.title}
                poster={ENDORSEMENT.poster}
                aspect="portrait"
                className="ring-1 ring-ink/10"
              />
              <figcaption className="mt-4 text-center text-[0.875rem] text-ink-faint">
                Joshua Garcia on joining the Dr. Alvin family.
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <ul className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <li key={item.id} className="flex min-w-0">
              <Reveal delay={(index % 3) * 90} className="flex w-full">
                <figure className="group/card relative flex w-full flex-col rounded-card border border-rule bg-white p-6 transition-[transform,box-shadow,border-color] duration-500 ease-out-quint hover:-translate-y-1.5 hover:border-rule-strong hover:shadow-[0_28px_48px_-28px_rgba(30,26,56,0.35)]">
                  <Quote
                    size={40}
                    strokeWidth={1}
                    aria-hidden
                    className="absolute right-5 top-5 text-marigold/25 transition-colors duration-500 group-hover/card:text-marigold/50"
                  />

                  <StarRow value={item.rating} size={16} />

                  <blockquote className="prose-reading mt-4 flex-1 text-[1.0625rem] text-ink">
                    {item.quote}
                  </blockquote>

                  <figcaption className="mt-6 flex items-center gap-3 border-t border-rule pt-5 text-[0.875rem]">
                    <Avatar name={item.name} src={item.avatar} />
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium text-ink">{item.name}</span>
                      <span className="block truncate text-ink-faint">
                        {item.role}, {item.location}
                      </span>
                    </span>
                    <Link
                      to={`/product/${item.productSlug}`}
                      className="shrink-0 text-violet underline decoration-violet/30 underline-offset-4 transition-colors hover:decoration-violet"
                    >
                      Product
                    </Link>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function StarRow({ value, size, animate = false }: { value: number; size: number; animate?: boolean }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
      {[0, 1, 2, 3, 4].map((index) => (
        <Star
          key={index}
          size={size}
          strokeWidth={1.5}
          aria-hidden
          style={animate ? { animationDelay: `${180 + index * 110}ms` } : undefined}
          className={cn(
            animate && 'star-pop',
            index < Math.round(value) ? 'fill-marigold text-marigold' : 'text-rule-strong',
          )}
        />
      ))}
    </div>
  )
}

function Avatar({ name, src }: { name: string; src?: string }) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        width={44}
        height={44}
        loading="lazy"
        decoding="async"
        className="size-11 shrink-0 rounded-full object-cover ring-2 ring-paper"
      />
    )
  }
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
  return (
    <span
      aria-hidden
      className="grid size-11 shrink-0 place-items-center rounded-full bg-violet-wash text-[0.8125rem] font-semibold text-violet ring-2 ring-paper"
    >
      {initials}
    </span>
  )
}
