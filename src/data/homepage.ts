/**
 * Homepage media, mirrored from dr-alvin.com. Swap the files under
 * public/brand/slides and public/community to change what shows.
 */
export interface HeroSlide {
  id: string
  image: string
  /** Describes the banner for screen readers; the copy is baked into the image. */
  alt: string
  to: string
}

export const heroSlides: HeroSlide[] = [
  {
    id: 'science-backed',
    image: '/brand/slides/slide-1.webp',
    alt: 'Dr. Alvin. Science backed skincare for any skin type.',
    to: '/shop',
  },
  {
    id: 'kojic-3-days',
    image: '/brand/slides/slide-2.webp',
    alt: 'Dr. Alvin Kojic Acid Soap. Whitens your skin in as early as 3 days.',
    to: '/product/kojic-acid-soap',
  },
  {
    id: 'full-range',
    image: '/brand/slides/slide-3.webp',
    alt: 'The full Dr. Alvin range: rejuvenating sets, soaps, toners, creams, sunscreens and lotions.',
    to: '/shop',
  },
  {
    id: 'rejuvenating-set-5',
    image: '/brand/slides/slide-4.webp',
    alt: 'Discover Rejuvenating Set No. 5. Dermatologist-approved acne treatment and targeted skincare for oily skin.',
    to: '/product/rejuvenating-set-5',
  },
  {
    id: 'sun-protection',
    image: '/brand/slides/slide-5.webp',
    alt: 'Professional sun protection. Skincare backed by science for all skin types.',
    to: '/shop?category=sun-care',
  },
  {
    id: 'shop-now',
    image: '/brand/slides/slide-6.webp',
    alt: 'Dr. Alvin, your trusted skin care formula since 1998. Shop now.',
    to: '/shop',
  },
]

export interface CommunityPhoto {
  id: string
  image: string
  alt: string
}

export const communityPhotos: CommunityPhoto[] = [
  { id: 'c1', image: '/community/community-1.webp', alt: 'Dr. Alvin handing a certificate to a new authorised distributor.' },
  { id: 'c2', image: '/community/community-2.webp', alt: 'Dr. Alvin distributor event.' },
  { id: 'c3', image: '/community/community-3.webp', alt: 'Dr. Alvin community gathering.' },
  { id: 'c4', image: '/community/community-4.webp', alt: 'Dr. Alvin resellers at a product launch.' },
  { id: 'c5', image: '/community/community-5.webp', alt: 'Dr. Alvin team with distributors.' },
  { id: 'c6', image: '/community/community-6.webp', alt: 'Dr. Alvin beauty caravan.' },
  { id: 'c7', image: '/community/community-7.webp', alt: 'Dr. Alvin Rejumax banner carried at a town parade.' },
  { id: 'c8', image: '/community/community-8.webp', alt: 'Dr. Alvin distributors on a street parade.' },
]
