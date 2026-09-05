import type { Category } from '@/types'

export const categories: Category[] = [
  {
    id: 'cat-cleansers',
    slug: 'cleansers',
    name: 'Cleansers',
    blurb: 'Lift the day off without stripping the barrier.',
    step: 'cleanse',
    sortOrder: 1,
  },
  {
    id: 'cat-soaps',
    slug: 'soaps',
    name: 'Soaps',
    blurb: 'The bars that built the brand — kojic, arbutin, glutathione.',
    step: 'cleanse',
    sortOrder: 2,
  },
  {
    id: 'cat-toners',
    slug: 'toners',
    name: 'Toners',
    blurb: 'Rebalance after cleansing and prep skin for actives.',
    step: 'tone',
    sortOrder: 3,
  },
  {
    id: 'cat-serums',
    slug: 'serums',
    name: 'Serums',
    blurb: 'High-concentration actives for a single, specific job.',
    step: 'treat',
    sortOrder: 4,
  },
  {
    id: 'cat-creams',
    slug: 'creams',
    name: 'Creams',
    blurb: 'Seal in moisture and hold the results you have earned.',
    step: 'treat',
    sortOrder: 5,
  },
  {
    id: 'cat-sets',
    slug: 'sets',
    name: 'Sets',
    blurb: 'A full routine in one box, sequenced for you.',
    step: 'treat',
    sortOrder: 6,
  },
  {
    id: 'cat-sun-care',
    slug: 'sun-care',
    name: 'Sun care',
    blurb: 'Non-negotiable in tropical sun, especially on actives.',
    step: 'protect',
    sortOrder: 7,
  },
  {
    id: 'cat-body-hair',
    slug: 'body-and-hair',
    name: 'Body & hair',
    blurb: 'The same formulations, scaled past the face.',
    step: 'protect',
    sortOrder: 8,
  },
]

export const regimenSteps = [
  {
    step: 'cleanse' as const,
    ordinal: 1,
    title: 'Cleanse',
    description: 'Twice daily. A clean surface is what lets everything after it work.',
  },
  {
    step: 'tone' as const,
    ordinal: 2,
    title: 'Tone',
    description: 'Sweep on while skin is still damp to rebalance pH and clear residue.',
  },
  {
    step: 'treat' as const,
    ordinal: 3,
    title: 'Treat',
    description: 'Your actives — tretinoin, kojic acid, arbutin, AHA. Start slow, build up.',
  },
  {
    step: 'protect' as const,
    ordinal: 4,
    title: 'Protect',
    description: 'SPF 50+ every morning. Without it, the treat step undoes itself.',
  },
]

export const skinConcerns = [
  'Dark spots',
  'Acne',
  'Uneven tone',
  'Dryness',
  'Oiliness',
  'Sensitivity',
  'Fine lines',
  'Sun damage',
] as const
