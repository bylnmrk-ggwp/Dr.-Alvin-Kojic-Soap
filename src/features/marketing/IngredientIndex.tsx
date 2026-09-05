import { Link } from 'react-router-dom'
import { SectionHeading } from '@/components/common/SectionHeading'

interface ActiveEntry {
  active: string
  does: string
  caution: string
  findIn: { label: string; slug: string }
}

/**
 * A formulary rather than a features grid: what each active does, what it
 * costs you, and which product to buy if you want it.
 */
const entries: ActiveEntry[] = [
  {
    active: 'Tretinoin',
    does: 'Speeds cell turnover, which shifts texture, acne and pigment at once.',
    caution: 'Peels for the first weeks. Not while pregnant.',
    findIn: { label: 'Beautamin A 0.025%', slug: 'beautamin-a-tretinoin-0-025' },
  },
  {
    active: 'Kojic acid',
    does: 'Blocks pigment as it forms, so dark spots fade rather than darken.',
    caution: 'Can sting on sensitive skin. Start once daily.',
    findIn: { label: 'Gluta-Kojic Acid Soap', slug: 'gluta-kojic-acid-soap' },
  },
  {
    active: 'Alpha arbutin',
    does: 'The same pigment pathway as kojic acid, far more quietly.',
    caution: 'Slower to show results. Give it eight weeks.',
    findIn: { label: 'Alpha Arbutin Soap', slug: 'alpha-arbutin-soap' },
  },
  {
    active: 'Ceramides',
    does: 'Rebuilds the lipid barrier after actives have gone too far.',
    caution: 'None. Safe alongside everything else here.',
    findIn: { label: 'Ceramoist Barrier Repair Cream', slug: 'ceramoist-barrier-repair-cream' },
  },
  {
    active: 'Glycolic acid',
    does: 'Resurfaces the top layer, evening out tone and rough texture.',
    caution: 'Never on the same night as tretinoin.',
    findIn: { label: 'AHA MAX Megadose Serum', slug: 'aha-max-megadose-serum' },
  },
  {
    active: 'SPF 50+ PA++++',
    does: 'Blocks the UVA that drives pigmentation, indoors and out.',
    caution: 'Skip it and every other step here works against you.',
    findIn: { label: 'Whitening Sunscreen Cream Gel', slug: 'whitening-sunscreen-cream-gel-spf50' },
  },
]

export function IngredientIndex() {
  return (
    <section aria-labelledby="actives-heading" className="shell py-20 lg:py-28">
      <SectionHeading
        title="What each active actually does"
        description="Most skincare marketing hides behind words like radiance and glow. These are the six ingredients doing the work across the range, what each one asks of you in return, and where to find it."
      />

      <div className="mt-12 border-t border-ink">
        {/* Column headings only make sense once the rows are side by side. */}
        <div className="hidden grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)_minmax(0,1.2fr)_minmax(0,1.1fr)] gap-8 border-b border-rule py-3 text-[0.8125rem] font-medium text-ink-faint lg:grid">
          <span>Active</span>
          <span>What it does</span>
          <span>What it asks of you</span>
          <span>Find it in</span>
        </div>

        {entries.map((entry) => (
          <div
            key={entry.active}
            className="grid gap-3 border-b border-rule py-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)_minmax(0,1.2fr)_minmax(0,1.1fr)] lg:items-baseline lg:gap-8"
          >
            <h3 className="text-[1.125rem] font-semibold tracking-tight text-violet">
              {entry.active}
            </h3>
            <p className="font-serif text-[1rem] leading-relaxed text-ink-soft">{entry.does}</p>
            <p className="font-serif text-[1rem] leading-relaxed text-ink-faint">{entry.caution}</p>
            <Link
              to={`/product/${entry.findIn.slug}`}
              className="text-[0.9375rem] font-medium text-ink underline decoration-rule-strong underline-offset-4 transition-colors hover:text-violet hover:decoration-violet"
            >
              {entry.findIn.label}
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
