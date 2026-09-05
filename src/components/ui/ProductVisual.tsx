import { cn } from '@/lib/utils'

/**
 * Product photography stands in as drawn vessels until real assets land.
 * The silhouette is chosen from the category so a soap never renders as a
 * pump bottle, and the ground tint comes from the product's own tone.
 */
type Vessel = 'bar' | 'bottle' | 'jar' | 'tube' | 'pump' | 'box' | 'sachet'

const vesselByCategory: Record<string, Vessel> = {
  soaps: 'bar',
  toners: 'bottle',
  creams: 'jar',
  serums: 'tube',
  cleansers: 'pump',
  sets: 'box',
  'sun-care': 'tube',
  'body-and-hair': 'pump',
}

const grounds: Record<string, { from: string; to: string; vessel: string; cap: string }> = {
  marigold: { from: '#FFE7CC', to: '#FFD1A3', vessel: '#FF7A00', cap: '#C24E00' },
  violet: { from: '#E7E1FB', to: '#D3C8F7', vessel: '#4B2ED4', cap: '#2C1580' },
  chalk: { from: '#F1EFF9', to: '#DED8F0', vessel: '#8C82C4', cap: '#4A4468' },
  leaf: { from: '#E2F0E9', to: '#C7E2D5', vessel: '#0F6B4F', cap: '#08432F' },
  sand: { from: '#F6EFE2', to: '#E8DBC2', vessel: '#B08A4E', cap: '#7A5A29' },
  ink: { from: '#E3E1EC', to: '#C9C5DA', vessel: '#1E1A38', cap: '#4B2ED4' },
}

interface ProductVisualProps {
  tone: string
  categorySlug: string
  /** Rendered inside the vessel as the label mark. */
  initials?: string
  className?: string
}

export function ProductVisual({ tone, categorySlug, initials, className }: ProductVisualProps) {
  const ground = grounds[tone] ?? grounds.chalk
  const vessel = vesselByCategory[categorySlug] ?? 'bottle'
  const gradientId = `ground-${tone}-${categorySlug}`

  return (
    <svg
      viewBox="0 0 320 320"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${categorySlug} product illustration`}
      className={cn('block h-full w-full', className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor={ground.from} />
          <stop offset="100%" stopColor={ground.to} />
        </linearGradient>
      </defs>

      <rect width="320" height="320" fill={`url(#${gradientId})`} />
      {/* A low horizon gives the vessel something to stand on. */}
      <ellipse cx="160" cy="248" rx="96" ry="12" fill={ground.cap} opacity="0.12" />

      <g transform="translate(160 160)">
        <VesselShape vessel={vessel} colors={ground} initials={initials} />
      </g>
    </svg>
  )
}

function VesselShape({
  vessel,
  colors,
  initials,
}: {
  vessel: Vessel
  colors: { vessel: string; cap: string }
  initials?: string
}) {
  const label = initials?.slice(0, 2).toUpperCase()

  switch (vessel) {
    case 'bar':
      return (
        <g>
          <rect x="-78" y="-42" width="156" height="126" rx="16" fill={colors.vessel} />
          <rect x="-78" y="-42" width="156" height="30" rx="16" fill="#fff" opacity="0.22" />
          <rect x="-46" y="4" width="92" height="40" rx="6" fill="#fff" opacity="0.9" />
          {label && (
            <text
              x="0"
              y="32"
              textAnchor="middle"
              fontFamily="Familjen Grotesk, sans-serif"
              fontSize="24"
              fontWeight="600"
              fill={colors.cap}
            >
              {label}
            </text>
          )}
        </g>
      )

    case 'bottle':
      return (
        <g>
          <rect x="-14" y="-104" width="28" height="24" rx="4" fill={colors.cap} />
          <path
            d="M-38 -80 h76 a10 10 0 0 1 10 10 v14 l-8 12 v128 a12 12 0 0 1 -12 12 h-56 a12 12 0 0 1 -12 -12 v-128 l-8 -12 v-14 a10 10 0 0 1 10 -10 z"
            fill={colors.vessel}
          />
          <rect x="-44" y="6" width="88" height="52" rx="4" fill="#fff" opacity="0.92" />
          {label && (
            <text
              x="0"
              y="42"
              textAnchor="middle"
              fontFamily="Familjen Grotesk, sans-serif"
              fontSize="26"
              fontWeight="600"
              fill={colors.cap}
            >
              {label}
            </text>
          )}
        </g>
      )

    case 'jar':
      return (
        <g>
          <rect x="-66" y="-56" width="132" height="30" rx="8" fill={colors.cap} />
          <path
            d="M-60 -26 h120 v92 a18 18 0 0 1 -18 18 h-84 a18 18 0 0 1 -18 -18 z"
            fill={colors.vessel}
          />
          <rect x="-44" y="2" width="88" height="46" rx="4" fill="#fff" opacity="0.92" />
          {label && (
            <text
              x="0"
              y="34"
              textAnchor="middle"
              fontFamily="Familjen Grotesk, sans-serif"
              fontSize="24"
              fontWeight="600"
              fill={colors.cap}
            >
              {label}
            </text>
          )}
        </g>
      )

    case 'tube':
      return (
        <g>
          <rect x="-18" y="-108" width="36" height="20" rx="5" fill={colors.cap} />
          <path
            d="M-40 -88 h80 v146 a14 14 0 0 1 -14 14 h-52 a14 14 0 0 1 -14 -14 z"
            fill={colors.vessel}
          />
          <path d="M-40 62 h80 v10 h-80 z" fill={colors.cap} opacity="0.7" />
          <rect x="-30" y="-30" width="60" height="60" rx="4" fill="#fff" opacity="0.92" />
          {label && (
            <text
              x="0"
              y="8"
              textAnchor="middle"
              fontFamily="Familjen Grotesk, sans-serif"
              fontSize="24"
              fontWeight="600"
              fill={colors.cap}
            >
              {label}
            </text>
          )}
        </g>
      )

    case 'pump':
      return (
        <g>
          <path d="M-6 -122 h34 a6 6 0 0 1 0 12 h-22 v14 h-12 z" fill={colors.cap} />
          <rect x="-12" y="-96" width="24" height="20" rx="4" fill={colors.cap} />
          <rect x="-46" y="-76" width="92" height="150" rx="14" fill={colors.vessel} />
          <rect x="-46" y="-16" width="92" height="56" rx="3" fill="#fff" opacity="0.92" />
          {label && (
            <text
              x="0"
              y="22"
              textAnchor="middle"
              fontFamily="Familjen Grotesk, sans-serif"
              fontSize="26"
              fontWeight="600"
              fill={colors.cap}
            >
              {label}
            </text>
          )}
        </g>
      )

    case 'box':
      return (
        <g>
          <path d="M-84 -50 l84 -32 l84 32 l-84 32 z" fill={colors.cap} />
          <path d="M-84 -50 v106 l84 32 v-106 z" fill={colors.vessel} />
          <path d="M84 -50 v106 l-84 32 v-106 z" fill={colors.vessel} opacity="0.78" />
          <rect x="-62" y="-12" width="56" height="44" rx="3" fill="#fff" opacity="0.9" />
          {label && (
            <text
              x="-34"
              y="18"
              textAnchor="middle"
              fontFamily="Familjen Grotesk, sans-serif"
              fontSize="22"
              fontWeight="600"
              fill={colors.cap}
            >
              {label}
            </text>
          )}
        </g>
      )

    default:
      return (
        <g>
          <rect x="-58" y="-72" width="116" height="144" rx="8" fill={colors.vessel} />
          <rect x="-58" y="-72" width="116" height="18" rx="8" fill={colors.cap} />
        </g>
      )
  }
}
