import { Link } from 'react-router-dom'
import { PageMeta } from '@/components/common/PageMeta'
import { Accordion, ButtonLink } from '@/components/ui'
import { faqGroups } from '@/data/faqs'

export default function FaqsPage() {
  return (
    <>
      <PageMeta
        title="Frequently asked questions"
        description="Starting out, building a routine, spotting a counterfeit, and how orders and delivery work."
      />

      <div className="shell grid gap-12 pt-12 lg:grid-cols-[14rem_1fr] lg:gap-20 lg:pt-16">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <h1 className="text-title lg:text-heading">Questions</h1>
          <nav aria-label="FAQ sections" className="mt-6">
            <ul className="grid gap-2 border-l border-rule">
              {faqGroups.map((group) => (
                <li key={group.id}>
                  <a
                    href={`#${group.id}`}
                    className="-ml-px block border-l border-transparent pl-4 text-[0.9375rem] text-ink-soft transition-colors hover:border-violet hover:text-ink"
                  >
                    {group.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-10 hidden lg:block">
            <p className="text-sm text-ink-faint">Not answered here?</p>
            <Link to="/contact" className="mt-1 block text-[0.9375rem] font-medium text-violet underline decoration-violet/30 underline-offset-4 hover:decoration-violet">
              Send us a message
            </Link>
          </div>
        </aside>

        <div className="grid gap-16">
          {faqGroups.map((group) => (
            <section key={group.id} id={group.id} aria-labelledby={`${group.id}-heading`} className="scroll-mt-28">
              <h2 id={`${group.id}-heading`} className="text-heading">
                {group.heading}
              </h2>
              {group.intro && <p className="prose-reading mt-3">{group.intro}</p>}
              <Accordion items={group.items} className="mt-6" />
            </section>
          ))}

          <div className="border border-rule bg-white px-8 py-8 lg:hidden">
            <p className="text-heading">Not answered here?</p>
            <ButtonLink to="/contact" variant="ink" className="mt-4">
              Send us a message
            </ButtonLink>
          </div>
        </div>
      </div>
    </>
  )
}
