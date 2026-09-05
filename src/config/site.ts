export const site = {
  name: 'Dr. Alvin',
  legalName: 'Dr. Alvin Professional Skin Care Formula',
  tagline: 'Your trusted skin care formula since 1998',
  foundedYear: 1998,
  description:
    'FDA-registered Filipino skincare, formulated with named actives and priced for everyday use. Rejuvenating sets, brightening soaps, toners and sun protection since 1998.',
  url: 'https://dr-alvin.com',
  email: 'info@dr-alvin.com',
  /** Globe line, also on Viber. */
  phone: '0917 881 5672',
  phoneAlt: '0999 992 1492',
  hours: 'Monday to Saturday, 9am to 6pm',
  address: {
    line1: '#23 F. Bautista St. cor. Tolentino St.',
    line2: 'San Francisco Del Monte, Quezon City',
    country: 'Philippines',
  },
  social: {
    facebook: 'https://www.facebook.com/DrAlvinOfficialPage/',
    instagram: 'https://www.instagram.com/dralvinmainpage/?hl=en',
    x: 'https://x.com/dralvinofficial',
    youtube: 'https://www.youtube.com/results?search_query=dr+alvin+skin+care',
  },
} as const

export const freeShippingThresholdCentavos = 150_000
export const flatShippingCentavos = 9_900
