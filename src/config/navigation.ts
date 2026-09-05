export interface NavItem {
  label: string
  to: string
  children?: { label: string; to: string; hint?: string }[]
}

export const primaryNav: NavItem[] = [
  {
    label: 'Shop',
    to: '/shop',
    children: [
      { label: 'All products', to: '/shop', hint: 'The full formulary' },
      { label: 'Soaps', to: '/shop?category=soaps', hint: 'Kojic, arbutin, glutathione' },
      { label: 'Toners', to: '/shop?category=toners', hint: 'Balance and prep' },
      { label: 'Creams', to: '/shop?category=creams', hint: 'Repair and maintain' },
      { label: 'Serums', to: '/shop?category=serums', hint: 'Targeted actives' },
      { label: 'Sets', to: '/shop?category=sets', hint: 'Complete routines' },
      { label: 'Sun care', to: '/shop?category=sun-care', hint: 'Daily SPF' },
    ],
  },
  { label: 'Regimen', to: '/regimen' },
  { label: 'About', to: '/about' },
  { label: 'Become a seller', to: '/distributor' },
  {
    label: 'Help',
    to: '/faqs',
    children: [
      { label: 'FAQs', to: '/faqs' },
      { label: 'Contact us', to: '/contact' },
      { label: 'Spot a fake', to: '/faqs#authenticity' },
    ],
  },
]

export const footerNav = [
  {
    heading: 'Shop',
    links: [
      { label: 'All products', to: '/shop' },
      { label: 'Best sellers', to: '/shop?sort=rating-desc' },
      { label: 'Rejuvenating sets', to: '/shop?category=sets' },
      { label: 'Sun care', to: '/shop?category=sun-care' },
    ],
  },
  {
    heading: 'Learn',
    links: [
      { label: 'Build a regimen', to: '/regimen' },
      { label: 'Our story', to: '/about' },
      { label: 'FAQs', to: '/faqs' },
      { label: 'Spot a fake', to: '/faqs#authenticity' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { label: 'Sign in', to: '/login' },
      { label: 'Create account', to: '/register' },
      { label: 'My orders', to: '/account/orders' },
      { label: 'Become a seller', to: '/distributor' },
    ],
  },
] as const
