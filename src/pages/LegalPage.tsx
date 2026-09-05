import { PageMeta } from '@/components/common/PageMeta'

const documents = {
  privacy: {
    title: 'Privacy',
    updated: '1 August 2026',
    sections: [
      {
        heading: 'What we collect',
        body: 'Your name, delivery address, mobile number and email when you order or apply to sell. Payment details never touch our servers — GCash and bank transfers are handled by those providers.',
      },
      {
        heading: 'What we do with it',
        body: 'Fulfil your order, send delivery updates, and answer your messages. We do not sell or share personal data with advertisers. Couriers receive only what they need to deliver.',
      },
      {
        heading: 'Your rights',
        body: 'Under the Data Privacy Act of 2012 you can ask what we hold about you, correct it, or have it deleted. Email hello@dr-alvin.com and we respond within fifteen working days.',
      },
    ],
  },
  terms: {
    title: 'Terms of sale',
    updated: '1 August 2026',
    sections: [
      {
        heading: 'Orders',
        body: 'An order is confirmed when you receive the confirmation email. We may cancel and refund an order if stock is unavailable or a price was displayed in error, and we will tell you why.',
      },
      {
        heading: 'Delivery',
        body: 'Estimated times are in working days from dispatch, not from the order. Delays caused by weather, courier disruption or an incomplete address are outside our control, but we will help chase them.',
      },
      {
        heading: 'Returns',
        body: 'Unopened products within seven days of delivery for a full refund. Opened products only if damaged in transit or not what was ordered, reported with photos within 48 hours.',
      },
      {
        heading: 'Use of products',
        body: 'Products are cosmetics registered with FDA Philippines and are not a substitute for medical advice. Patch test first. Tretinoin products must not be used during pregnancy or breastfeeding.',
      },
    ],
  },
} as const

export default function LegalPage({ document: key }: { document: keyof typeof documents }) {
  const doc = documents[key]

  return (
    <>
      <PageMeta title={doc.title} />
      <div className="shell max-w-3xl pt-12 lg:pt-16">
        <h1 className="text-title">{doc.title}</h1>
        <p className="mt-3 text-sm text-ink-faint">Last updated {doc.updated}</p>
        <div className="mt-10 grid gap-8">
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-heading">{section.heading}</h2>
              <p className="prose-reading mt-3">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
