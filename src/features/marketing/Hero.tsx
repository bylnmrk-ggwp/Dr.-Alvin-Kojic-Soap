import { ButtonLink } from '@/components/ui'
import { ShieldCheck } from 'lucide-react'

/**
 * Opens on what actually distinguishes this brand: the actives are printed
 * on the label at stated concentrations. No centred headline over a wash.
 */
export function Hero() {
  return (
    <section className="border-b border-rule bg-paper">
      <div className="shell grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
        <div className="rise">
          <p className="flex items-center gap-2 text-[0.9375rem] font-medium text-verified">
            <ShieldCheck size={17} strokeWidth={1.75} />
            Registered with FDA Philippines
          </p>

          <h1 className="mt-5 text-[clamp(2.75rem,7vw,4.5rem)] font-semibold leading-[0.94] tracking-[-0.035em]">
            The actives are printed on the label.
          </h1>

          <p className="prose-reading mt-6 text-[1.125rem]">
            Tretinoin at 0.025%. Kojic acid, alpha arbutin, ceramides, SPF 50+ PA++++. Dr. Alvin has
            formulated in the Philippines since 1998, and a full four-step routine still costs less
            than a single imported serum.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink to="/shop" size="lg">
              Shop the range
            </ButtonLink>
            <ButtonLink to="/regimen" variant="outline" size="lg">
              Build my routine
            </ButtonLink>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 border-t border-rule pt-6">
            {[
              { value: '1998', label: 'Formulating since' },
              { value: '85', label: 'Products in the range' },
              { value: 'FDA', label: 'Registered formulas' },
            ].map((stat, index) => (
              <div key={stat.label} className={index > 0 ? 'border-l border-rule pl-5' : 'pr-5'}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="tabular block text-[1.75rem] font-semibold leading-none tracking-tight">
                    {stat.value}
                  </span>
                  <span className="mt-2 block text-[0.8125rem] leading-snug text-ink-faint">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Three best sellers, overlapped, standing in for the routine itself. */}
        <div className="rise relative mx-auto aspect-square w-full max-w-[34rem] [animation-delay:120ms]">
          <img
            src="/products/all-in-1-maintenance-set-1.webp"
            alt="Dr. Alvin All in 1 Maintenance Set"
            width={750}
            height={750}
            fetchPriority="high"
            className="absolute left-0 top-[6%] aspect-square w-[68%] rounded-card object-cover shadow-[0_24px_48px_-24px_rgba(30,26,56,0.45)]"
          />
          <img
            src="/products/all-in-1-maintenance-toner-2-1.webp"
            alt="Dr. Alvin All in 1 Maintenance Toner"
            width={750}
            height={750}
            loading="lazy"
            className="absolute bottom-0 right-0 aspect-square w-[46%] rounded-card border-[6px] border-paper object-cover shadow-[0_24px_48px_-24px_rgba(30,26,56,0.45)]"
          />
          <img
            src="/products/gluta-kojic-acid-soap-1.webp"
            alt="Dr. Alvin Gluta-Kojic Acid Soap"
            width={750}
            height={750}
            loading="lazy"
            className="absolute right-[8%] top-0 aspect-square w-[30%] rounded-card border-[6px] border-paper object-cover shadow-[0_16px_32px_-20px_rgba(30,26,56,0.45)]"
          />
        </div>
      </div>
    </section>
  )
}
