import { useEffect, useRef, useState } from 'react'
import { FacebookIcon } from '@/components/layout/SocialIcons'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Reveal } from '@/components/common/Reveal'
import { ButtonLink } from '@/components/ui'
import { facebookVideos } from '@/data/homepage'
import { site } from '@/config/site'

/**
 * Facebook reels and videos from the official page, embedded with the
 * Facebook video plugin. Each player is created only when it scrolls into
 * view, so the homepage does not load Facebook for people who never reach
 * this section. Renders nothing until at least one video URL is listed.
 */
export function FacebookVideos() {
  if (facebookVideos.length === 0) return null

  return (
    <section id="facebook-videos" aria-label="Watch us on Facebook" className="border-t border-rule bg-white py-16 lg:py-20">
      <Reveal className="shell">
        <SectionHeading
          title="Watch us on Facebook"
          description="Product launches, skincare tips and reseller stories from the official Dr. Alvin page."
          action={
            <ButtonLink
              to={site.social.facebook}
              target="_blank"
              rel="noreferrer"
              variant="outline"
              className="gap-2"
            >
              <FacebookIcon size={16} />
              Follow the page
            </ButtonLink>
          }
        />
      </Reveal>

      <Reveal delay={120} className="shell mt-10">
        <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-visible lg:grid-cols-4">
          {facebookVideos.map((video) => (
            <li key={video.url} className="w-[76%] shrink-0 snap-start sm:w-[48%] md:w-auto">
              <FacebookPlayer url={video.url} title={video.title} />
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}

function FacebookPlayer({ url, title }: { url: string; title: string }) {
  const holder = useRef<HTMLDivElement>(null)
  // Browsers without IntersectionObserver load the player straight away.
  const [isNear, setIsNear] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const element = holder.current
    if (!element || isNear) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsNear(true)
          observer.disconnect()
        }
      },
      { rootMargin: '300px 0px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [isNear])

  const src = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=false&allowfullscreen=true`

  return (
    <figure className="overflow-hidden rounded-card border border-rule bg-ink shadow-[0_24px_48px_-28px_rgba(30,26,56,0.5)]">
      <div ref={holder} className="relative aspect-[9/16] w-full bg-ink">
        {isNear ? (
          <iframe
            src={src}
            title={title}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-white/60" aria-hidden>
            <FacebookIcon size={28} />
          </div>
        )}
      </div>
      <figcaption className="bg-white px-4 py-3 text-[0.875rem] font-medium text-ink">{title}</figcaption>
    </figure>
  )
}
