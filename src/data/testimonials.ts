export interface Testimonial {
  id: string
  quote: string
  name: string
  role: string
  location: string
  /** Which product the review is actually about. */
  productSlug: string
  yearsUsing: number
  /** Out of five. */
  rating: number
  /** Local photo under /reviews, when the reviewer shared one. */
  avatar?: string
}

export const testimonials: Testimonial[] = [
  {
    id: 't-1',
    quote:
      'I used to need a filter for every photo because of the pimple marks on my cheeks. Four months on the rejuvenating set and I stopped reaching for it. The peeling in weeks two and three was real, but it passed.',
    name: 'Joan Torrita',
    role: 'Skincare user',
    location: 'Cebu City',
    productSlug: 'rejuvenating-set',
    yearsUsing: 3,
    rating: 5,
    avatar: '/reviews/reviewer-1.webp',
  },
  {
    id: 't-2',
    quote:
      'My barrier was wrecked from over-exfoliating with another brand. Ceramoist was the only thing that stopped the stinging. Two weeks of just cleanser and cream and I could use actives again.',
    name: 'Sheena Sanchez',
    role: 'Skincare user',
    location: 'Davao',
    productSlug: 'ceramoist-barrier-repair-cleanser',
    yearsUsing: 2,
    rating: 5,
    avatar: '/reviews/reviewer-2.webp',
  },
  {
    id: 't-3',
    quote:
      'Four years selling Dr. Alvin now. The margin is honest and the products actually repeat — customers come back on their own, I do not have to chase anyone. It has paid for my sister to finish school.',
    name: 'Winnie Drou',
    role: 'Architect and authorised seller',
    location: 'Quezon City',
    productSlug: 'all-in-1-maintenance-set',
    yearsUsing: 4,
    rating: 5,
    avatar: '/reviews/reviewer-3.webp',
  },
  {
    id: 't-4',
    quote:
      'I started on the 0.025% tretinoin twice a week like the guide said instead of jumping straight in. No purge worth complaining about, and my texture is the best it has been since my twenties.',
    name: 'Mark Villanueva',
    role: 'Customer since 2024',
    location: 'Makati',
    productSlug: 'beautamin-a-tretinoin-0-025',
    yearsUsing: 1,
    rating: 5,
  },
  {
    id: 't-5',
    quote:
      'The sunscreen is the one I finally finished a whole bottle of. No white cast on my skin tone and it does not slide off in Manila heat, which is the only test that matters here.',
    name: 'Aira Bautista',
    role: 'Customer since 2023',
    location: 'Manila',
    productSlug: 'whitening-sunscreen-cream-gel-spf50',
    yearsUsing: 2,
    rating: 5,
  },
  {
    id: 't-6',
    quote:
      'Bought the maintenance set for my mother after her melasma came back. Six months later her dermatologist asked what she had changed. That was enough for me.',
    name: 'Rico Lim',
    role: 'Customer since 2021',
    location: 'Iloilo',
    productSlug: 'all-in-1-maintenance-set',
    yearsUsing: 4,
    rating: 5,
  },
]
