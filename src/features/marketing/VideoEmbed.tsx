import { useState } from 'react'
import { Play } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VideoEmbedProps {
  /** YouTube video id, the part after `v=` or `youtu.be/`. */
  videoId: string
  title: string
  /** Local poster so nothing loads from YouTube until the visitor presses play. */
  poster: string
  /** Portrait for vertical clips such as Shorts; the poster should match. */
  aspect?: 'video' | 'portrait'
  className?: string
}

/**
 * A click-to-play YouTube facade. Shows a poster and a play button; the
 * real player (privacy-enhanced domain, autoplaying) is only created once
 * someone asks for it, which keeps the homepage light and tracker-free.
 */
export function VideoEmbed({ videoId, title, poster, aspect = 'video', className }: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-card bg-ink shadow-[0_32px_64px_-32px_rgba(30,26,56,0.6)]',
        aspect === 'portrait' ? 'aspect-[9/16]' : 'aspect-video',
        className,
      )}
    >
      {isPlaying ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          aria-label={`Play video: ${title}`}
          className="group/play absolute inset-0 block h-full w-full text-left"
        >
          <img
            src={poster}
            alt=""
            width={aspect === 'portrait' ? 540 : 1280}
            height={aspect === 'portrait' ? 960 : 720}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-out-quint group-hover/play:scale-[1.04]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" aria-hidden />

          <span className="absolute inset-0 grid place-items-center" aria-hidden>
            <span className="play-pulse relative grid size-[4.5rem] place-items-center rounded-full bg-marigold text-white shadow-xl transition-transform duration-300 group-hover/play:scale-110 sm:size-20">
              <Play size={30} strokeWidth={2} className="ml-1 fill-current" />
            </span>
          </span>

          <span className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6" aria-hidden>
            <span className="block text-[0.75rem] font-medium uppercase tracking-[0.14em] text-white/70">Watch</span>
            <span className="mt-1 block text-[1.125rem] font-semibold leading-snug sm:text-[1.25rem]">{title}</span>
          </span>
        </button>
      )}
    </div>
  )
}
