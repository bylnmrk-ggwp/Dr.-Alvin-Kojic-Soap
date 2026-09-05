import { PageMeta } from '@/components/common/PageMeta'
import { ButtonLink, ProductVisual } from '@/components/ui'

const milestones = [
  { year: '1998', event: 'First kojic acid soap formulated and sold from a single clinic in Quezon City.' },
  { year: '2004', event: 'Rejuvenating Set launched. Still the best-known product in the range.' },
  { year: '2011', event: 'Reseller programme opens. Sellers get a verifiable ID within the first year.' },
  { year: '2017', event: 'Ceramoist barrier range added after years of customers over-treating.' },
  { year: '2021', event: 'Holographic anti-counterfeit seal and laser-etched batch codes introduced.' },
  { year: '2024', event: 'Direct shipping to Singapore, Hong Kong, the UAE and the United States.' },
]

export default function AboutPage() {
  return (
    <>
      <PageMeta
        title="Our story"
        description="Dr. Alvin has formulated FDA-registered skincare in the Philippines since 1998. Here is how the range came to be, and what it stands for."
      />

      <header className="shell grid gap-12 pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:pt-16">
        <div>
          <h1 className="text-title">Twenty-seven years of the same promise.</h1>
          <p className="prose-reading mt-5 text-[1.125rem]">
            Dr. Alvin started in 1998 with one kojic acid soap and a conviction that the actives
            dermatologists prescribed should not cost a week&apos;s wages. Everything since has been an
            extension of that: name the ingredient, state the concentration, and price it for the
            people who actually live in this climate.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="aspect-3/4 overflow-hidden"><ProductVisual tone="marigold" categorySlug="soaps" initials="98" /></div>
          <div className="aspect-3/4 overflow-hidden translate-y-6"><ProductVisual tone="violet" categorySlug="creams" initials="DA" /></div>
          <div className="aspect-3/4 overflow-hidden"><ProductVisual tone="leaf" categorySlug="sun-care" initials="50" /></div>
        </div>
      </header>

      <section className="shell mt-20 grid gap-12 lg:mt-28 lg:grid-cols-3 lg:gap-10">
        <div>
          <h2 className="text-heading">What we make</h2>
          <p className="prose-reading mt-3 text-[1rem]">
            Skincare built around a handful of well-evidenced actives — tretinoin, kojic acid,
            alpha arbutin, ceramides, glycolic acid — at concentrations that are printed on the
            box. Every product is registered with FDA Philippines and manufactured in our own
            facility.
          </p>
        </div>
        <div>
          <h2 className="text-heading">Where we are going</h2>
          <p className="prose-reading mt-3 text-[1rem]">
            To be the skincare manufacturer the region reaches for first — across Southeast Asia, then
            the Filipino communities in the Gulf, North America and Europe who already ask relatives
            to bring it home in their luggage.
          </p>
        </div>
        <div>
          <h2 className="text-heading">Why it matters here</h2>
          <p className="prose-reading mt-3 text-[1rem]">
            The company employs Filipinos at every step, sources botanicals like papaya and calamansi
            from local farms, and pays more than three thousand independent sellers a wholesale margin
            that many families depend on.
          </p>
        </div>
      </section>

      <section aria-labelledby="timeline-heading" className="shell mt-20 lg:mt-28">
        <h2 id="timeline-heading" className="text-heading">
          How the range grew
        </h2>
        <ol className="mt-8 border-t border-ink">
          {milestones.map((item) => (
            <li key={item.year} className="grid gap-2 border-b border-rule py-5 sm:grid-cols-[6rem_1fr] sm:gap-8">
              <span className="tabular text-[1.125rem] font-semibold tracking-tight text-violet">{item.year}</span>
              <p className="font-serif text-[1.0625rem] leading-relaxed text-ink-soft">{item.event}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="shell mt-20 lg:mt-28">
        <div className="grid gap-8 border border-rule bg-white px-8 py-10 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:px-12 lg:py-14">
          <div>
            <h2 className="text-heading">Not sure where to begin?</h2>
            <p className="prose-reading mt-3">
              The regimen guide sorts the whole range into four steps and three routines. Ten minutes
              of reading saves most people their first month of trial and error.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <ButtonLink to="/regimen" variant="ink">
              Read the regimen guide
            </ButtonLink>
            <ButtonLink to="/shop" variant="outline">
              Shop the range
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  )
}
