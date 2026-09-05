import { ButtonLink } from '@/components/ui'

export function DistributorCta() {
  return (
    <section aria-labelledby="seller-heading" className="shell pb-8 pt-4">
      <div className="grid gap-10 bg-marigold px-6 py-12 text-ink sm:px-10 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:px-14 lg:py-16">
        <div>
          <h2 id="seller-heading" className="text-title text-ink">
            Sell Dr. Alvin in your barangay.
          </h2>
          <p className="mt-5 max-w-xl font-serif text-[1.125rem] leading-relaxed text-ink/80">
            Around four in ten of our customers buy from a neighbour, a cousin, or a stall they
            already trust. Authorised sellers buy at wholesale, get a reseller ID customers can
            verify, and start with as little as one maintenance set.
          </p>
        </div>

        <div className="flex flex-col gap-4 lg:items-end">
          <dl className="grid grid-cols-2 gap-6 text-ink lg:text-right">
            <div>
              <dt className="text-[0.8125rem] text-ink/60">Starting order</dt>
              <dd className="tabular mt-1 text-[1.75rem] font-semibold leading-none tracking-tight">
                ₱1,500
              </dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-ink/60">Active sellers</dt>
              <dd className="tabular mt-1 text-[1.75rem] font-semibold leading-none tracking-tight">
                3,200+
              </dd>
            </div>
          </dl>
          <ButtonLink to="/distributor" variant="ink" size="lg" className="w-full sm:w-auto">
            Apply to become a seller
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
