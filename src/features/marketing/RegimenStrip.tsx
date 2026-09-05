import { Link } from 'react-router-dom'
import { regimenSteps } from '@/data/categories'

/**
 * The one place numbering is honest — a regimen genuinely is a sequence,
 * and getting the order wrong is the most common reason results stall.
 */
export function RegimenStrip() {
  return (
    <section aria-labelledby="regimen-heading" className="border-b border-rule bg-ink text-paper">
      <div className="shell py-16 lg:py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 id="regimen-heading" className="max-w-xl text-title">
            Four steps, in this order, every day.
          </h2>
          <Link
            to="/regimen"
            className="shrink-0 text-[0.9375rem] font-medium text-paper underline decoration-paper/30 underline-offset-[6px] transition-colors hover:decoration-paper"
          >
            Read the full regimen guide
          </Link>
        </div>

        <ol className="mt-12 grid gap-px border-t border-paper/15 sm:grid-cols-2 lg:grid-cols-4">
          {regimenSteps.map((item) => (
            <li key={item.step} className="border-b border-paper/15 pb-8 pt-7 lg:border-b-0 lg:pr-8">
              <Link to={`/shop?step=${item.step}`} className="group block">
                <span className="tabular block text-[3.25rem] font-semibold leading-none tracking-tighter text-paper/25 transition-colors group-hover:text-marigold">
                  {item.ordinal}
                </span>
                <h3 className="mt-4 text-[1.375rem] font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-2.5 max-w-xs font-serif text-[1rem] leading-relaxed text-paper/60">
                  {item.description}
                </p>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
