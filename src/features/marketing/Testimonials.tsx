import { Link } from 'react-router-dom'
import { testimonials } from '@/data/testimonials'
import { SectionHeading } from '@/components/common/SectionHeading'

export function Testimonials() {
  return (
    <section aria-labelledby="reviews-heading" className="border-y border-rule bg-paper-sunk">
      <div className="shell py-20 lg:py-28">
        <SectionHeading
          title="Twenty-four thousand reviews, and the same three themes."
          description="People come for the price, stay for the results, and a good number end up selling it themselves. These are unedited, including the parts about peeling."
        />

        <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <figure key={item.id} className="flex flex-col border-t border-ink pt-6">
              <blockquote className="prose-reading flex-1 text-[1.0625rem] text-ink">
                {item.quote}
              </blockquote>
              <figcaption className="mt-6 text-[0.875rem]">
                <span className="block font-medium text-ink">{item.name}</span>
                <span className="mt-0.5 block text-ink-faint">
                  {item.role}, {item.location}
                </span>
                <Link
                  to={`/product/${item.productSlug}`}
                  className="mt-2 inline-block text-violet underline decoration-violet/30 underline-offset-4 transition-colors hover:decoration-violet"
                >
                  On this product
                </Link>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
