export interface FaqGroup {
  id: string
  heading: string
  intro?: string
  items: { question: string; answer: string }[]
}

export const faqGroups: FaqGroup[] = [
  {
    id: 'starting',
    heading: 'Starting out',
    intro:
      'Most problems people have with actives come from starting too fast. These are the questions worth reading before your first order.',
    items: [
      {
        question: 'Which set should I start with?',
        answer:
          'If your main concern is dark spots or acne marks that have not shifted in a year, start with the Rejuvenating Set and treat it as a six-to-eight week course. For everything else — general dullness, uneven tone, keeping results you already have — start with the All in 1 Maintenance Set and stay on it.',
      },
      {
        question: 'How long before I see a difference?',
        answer:
          'Texture and brightness usually shift at four to six weeks. Pigment is slower: eight to twelve weeks for surface spots, and melasma can take longer than that. If nothing has changed by week twelve on a consistent routine, message us rather than escalating strength on your own.',
      },
      {
        question: 'Will my skin peel?',
        answer:
          'On the Rejuvenating Set, yes — that is the mechanism, and it typically runs from day five to week three. On the maintenance range it should not. Peeling that leaves skin raw, stinging or weeping is not normal at any strength: stop, switch to Ceramoist twice daily, and restart at a lower frequency after two weeks.',
      },
      {
        question: 'Can I use these while pregnant or breastfeeding?',
        answer:
          'Not the tretinoin products — Beautamin A at either strength, and the Rejuvenating Set, which contains it. Kojic acid soaps, the Ceramoist range, the maintenance toner and the sunscreen are generally considered fine, but confirm with your OB first.',
      },
    ],
  },
  {
    id: 'routine',
    heading: 'Building a routine',
    items: [
      {
        question: 'What order do the products go in?',
        answer:
          'Cleanse, tone, treat, protect. Within the treat step, thinnest to thickest — serum before cream. Sunscreen is always last in the morning, over everything else.',
      },
      {
        question: 'Can I use tretinoin and the AHA serum together?',
        answer:
          'Not on the same night. Alternate them: tretinoin on three nights, AHA on one, and nothing but moisturiser on the rest. Layering them is the fastest way to break your barrier.',
      },
      {
        question: 'Do I really need sunscreen if I stay indoors?',
        answer:
          'Yes. UVA passes through window glass and is the wavelength that drives pigmentation, which is the exact thing most of this range is treating. Skipping SPF while on actives means you are working against yourself every day.',
      },
      {
        question: 'Can I use Dr. Alvin with products from other brands?',
        answer:
          'Usually, as long as you are not stacking two exfoliating actives. Keep one brand for the treat step so you know what is doing what, and introduce anything new on its own for two weeks before adding the next thing.',
      },
    ],
  },
  {
    id: 'authenticity',
    heading: 'Spotting a fake',
    intro:
      'Counterfeit Dr. Alvin products are common on marketplaces and they can contain mercury. Four checks take under a minute.',
    items: [
      {
        question: 'How do I know my product is genuine?',
        answer:
          'Check the FDA registration number printed on the box against the FDA Philippines verification portal. Genuine packaging has a holographic seal that shifts colour when tilted, a batch code laser-etched rather than printed on a sticker, and a manufacturing date within the last eighteen months.',
      },
      {
        question: 'Why is the price on some marketplaces so much lower?',
        answer:
          'Because it is not our product. Our authorised sellers buy at a fixed wholesale price and cannot profitably sell below roughly thirty percent under retail. Anything far cheaper than that is either counterfeit or expired stock.',
      },
      {
        question: 'How do I check whether a seller is authorised?',
        answer:
          'Every authorised seller has a reseller ID we can confirm. Send us the seller name and their ID through the contact form and we will verify it, usually the same day.',
      },
      {
        question: 'I think I bought a fake. What now?',
        answer:
          'Stop using it immediately, especially if it is a cream that has separated, smells metallic, or bleached your skin unevenly within days. Send us photos of the packaging and where you bought it — we log every report and pursue the sellers.',
      },
    ],
  },
  {
    id: 'orders',
    heading: 'Orders and delivery',
    items: [
      {
        question: 'How long does delivery take?',
        answer:
          'Metro Manila is one to two working days. Provincial Luzon is two to four, Visayas and Mindanao three to six. Orders placed after 2pm ship the next working day.',
      },
      {
        question: 'What payment methods do you accept?',
        answer:
          'Cash on delivery nationwide, GCash, and bank transfer. Cash on delivery is available on orders up to ₱5,000; above that we ask for GCash or a transfer.',
      },
      {
        question: 'Can I return something?',
        answer:
          'Unopened products can be returned within seven days of delivery for a full refund. Opened products can only be returned if the item arrived damaged or is not what you ordered — send a photo within 48 hours of delivery and we will replace it.',
      },
      {
        question: 'Do you ship outside the Philippines?',
        answer:
          'To Singapore, Hong Kong, the UAE and the United States through our appointed distributors. Rates and lead times differ by destination — use the contact form and tell us where you are.',
      },
    ],
  },
]
