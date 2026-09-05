import { ButtonLink } from '@/components/ui'
import { ShieldCheck } from 'lucide-react'

/**
 * Sits under the banner carousel. The banners carry the imagery, so this
 * band is the one line that distinguishes the brand, the two ways in, and
 * three facts.
 */
export function Hero() {
  return (
    <section className="border-b border-rule bg-paper">
      <div className="shell grid items-center gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 lg:py-16">
        <div className="rise">
          <p className="flex items-center gap-2 text-[0.9375rem] font-medium text-verified">
            <ShieldCheck size={17} strokeWidth={1.75} />
            Registered with FDA Philippines
          </p>

          <h1 className="mt-4 text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
            The actives are printed on the label.
          </h1>

          <p className="prose-reading mt-5 max-w-2xl text-[1.0625rem]">
            Tretinoin at 0.025%. Kojic acid, alpha arbutin, ceramides, SPF 50+ PA++++. Dr. Alvin has
            formulated in the Philippines since 1998, and a full four-step routine still costs less
            than a single imported serum.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink to="/shop" size="lg">
              Shop the range
            </ButtonLink>
            <ButtonLink to="/regimen" variant="outline" size="lg">
              Build my routine
            </ButtonLink>
          </div>
        </div>

        <dl className="rise grid grid-cols-3 gap-4 border-t border-rule pt-6 lg:grid-cols-1 lg:gap-0 lg:border-t-0 lg:border-l lg:pl-10 lg:pt-0 [animation-delay:120ms]">
          {[
            { value: '1998', label: 'Formulating since' },
            { value: '85', label: 'Products in the range' },
            { value: 'FDA', label: 'Registered formulas' },
          ].map((stat, index) => (
            <div key={stat.label} className={index > 0 ? 'lg:mt-6 lg:border-t lg:border-rule lg:pt-6' : ''}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="tabular block text-[1.75rem] font-semibold leading-none tracking-tight lg:text-[2.25rem]">
                  {stat.value}
                </span>
                <span className="mt-2 block text-[0.8125rem] leading-snug text-ink-faint">{stat.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
