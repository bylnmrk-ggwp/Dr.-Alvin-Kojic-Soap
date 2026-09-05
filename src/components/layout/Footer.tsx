import { Link } from 'react-router-dom'
import { FacebookIcon, InstagramIcon, YoutubeIcon } from './SocialIcons'
import { footerNav } from '@/config/navigation'
import { site } from '@/config/site'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-rule bg-ink text-paper">
      <div className="shell py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo tone="paper" />
            <p className="mt-6 max-w-xs font-serif text-[1.0625rem] leading-relaxed text-paper/65">
              {site.legalName}. Formulated in the Philippines, registered with the FDA, and sold
              through a network of verified resellers.
            </p>

            <div className="mt-7 flex gap-2">
              {[
                { href: site.social.facebook, label: 'Facebook', Icon: FacebookIcon },
                { href: site.social.instagram, label: 'Instagram', Icon: InstagramIcon },
                { href: site.social.youtube, label: 'YouTube', Icon: YoutubeIcon },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="grid size-10 place-items-center border border-paper/20 text-paper/70 transition-colors hover:border-paper/60 hover:text-paper"
                >
                  <Icon size={17} strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {footerNav.map((group) => (
              <nav key={group.heading} aria-label={group.heading}>
                <h2 className="text-[0.9375rem] font-semibold text-paper">{group.heading}</h2>
                <ul className="mt-4 grid gap-2.5">
                  {group.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-[0.9375rem] text-paper/60 transition-colors hover:text-paper"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-paper/15 pt-6">
          <div className="flex flex-col gap-4 text-[0.8125rem] text-paper/50 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {site.legalName}. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link to="/privacy" className="transition-colors hover:text-paper">
                Privacy
              </Link>
              <Link to="/terms" className="transition-colors hover:text-paper">
                Terms
              </Link>
              <Link to="/faqs#orders" className="transition-colors hover:text-paper">
                Shipping and returns
              </Link>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-[0.8125rem] leading-relaxed text-paper/40">
            Information on this site is for general guidance and is not a substitute for advice
            from a licensed dermatologist. Patch test before first use, and stop if irritation
            persists.
          </p>
        </div>
      </div>
    </footer>
  )
}
