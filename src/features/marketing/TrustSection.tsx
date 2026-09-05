import { Link } from 'react-router-dom'
import { ButtonLink } from '@/components/ui'

/**
 * Counterfeits containing mercury are the brand's real-world problem, so the
 * trust section teaches the four checks rather than listing generic badges.
 */
const checks = [
  {
    title: 'FDA registration number on the box',
    detail: 'Every genuine product carries one. Look it up on the FDA Philippines portal — it takes under a minute.',
  },
  {
    title: 'Holographic seal that shifts colour',
    detail: 'Tilt it. Printed imitations stay flat. Missing seal, missing product.',
  },
  {
    title: 'Laser-etched batch code',
    detail: 'Etched into the packaging, never a sticker. A sticker means someone else printed it.',
  },
  {
    title: 'A price that makes sense',
    detail: 'Authorised sellers cannot go far below retail. Half price is not a bargain, it is a different product.',
  },
]

export function TrustSection() {
  return (
    <section aria-labelledby="trust-heading" className="shell py-20 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <h2 id="trust-heading" className="text-title">
            Fakes are common. Checking is quick.
          </h2>
          <p className="prose-reading mt-5">
            Dr. Alvin is one of the most counterfeited skincare brands in the Philippines, and
            imitations have tested positive for mercury. Buy from this site or an authorised seller,
            and run these four checks on anything you did not.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to="/contact?topic=authenticity" variant="ink">
              Verify a seller
            </ButtonLink>
            <Link
              to="/faqs#authenticity"
              className="inline-flex h-11 items-center text-[0.9375rem] font-medium text-violet underline decoration-violet/30 underline-offset-4 transition-colors hover:decoration-violet"
            >
              More on spotting a fake
            </Link>
          </div>
        </div>

        <ol className="grid gap-px border-t border-ink sm:grid-cols-2">
          {checks.map((check, index) => (
            <li
              key={check.title}
              className="border-b border-rule py-6 sm:pr-8 sm:odd:border-r sm:even:pl-8"
            >
              <span className="tabular text-sm font-medium text-ink-faint">Check {index + 1}</span>
              <h3 className="mt-2 text-[1.0625rem] font-semibold leading-snug tracking-tight">
                {check.title}
              </h3>
              <p className="mt-2 font-serif text-[0.9375rem] leading-relaxed text-ink-soft">
                {check.detail}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
