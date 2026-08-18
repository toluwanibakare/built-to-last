import { FacebookIcon, InstagramIcon, YouTubeIcon, MailIcon } from './icons/icons'
import { config } from '../config'
import { book } from '../data/book'

const SOCIALS = [
  { name: 'Facebook', href: config.social.facebook, Icon: FacebookIcon },
  { name: 'Instagram', href: config.social.instagram, Icon: InstagramIcon },
  { name: 'YouTube', href: config.social.youtube, Icon: YouTubeIcon },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr] md:gap-16">
          <div>
            <a href="#top" className="flex items-center gap-2.5" aria-label="Built to Last — back to top">
              <img
                src="/femi_logo.png"
                alt="Logo of Femi Bakare"
                className="h-10 w-10 rounded-full object-cover"
                width={40}
                height={40}
              />
              <span className="font-display text-xl text-ink">Built to Last</span>
            </a>
            <p className="mt-5 max-w-sm leading-relaxed text-slate">
              {book.subtitle} — by {book.author.name}.
            </p>

            <div className="mt-7 flex gap-3" aria-label="Follow the author">
              {SOCIALS.map(({ name, href, Icon }) => {
                const label = href
                  ? `Follow Femi Bakare on ${name}`
                  : `${name} link coming soon`
                return (
                  <a
                    key={name}
                    href={href || undefined}
                    aria-label={label}
                    title={label}
                    className="group flex h-10 w-10 items-center justify-center rounded-full border border-line text-slate transition-all duration-300 hover:border-brass hover:text-brass-deep"
                    {...(href ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    <Icon className="h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110" />
                  </a>
                )
              })}
            </div>
          </div>

          <nav aria-label="Footer navigation">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">Explore</p>
            <ul className="mt-5 space-y-3">
              {[
                { href: '#book', label: 'The Book' },
                { href: '#preview', label: 'Preview' },
                { href: '#author', label: 'Author' },
                { href: '#faq', label: 'FAQ' },
                { href: '#pre-order', label: 'Pre-order' },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-slate transition-colors duration-300 hover:text-ink">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">Contact</p>
            <a
              href={`mailto:${config.site.contactEmail}`}
              className="mt-5 inline-flex items-center gap-2.5 text-sm text-slate transition-colors duration-300 hover:text-ink"
            >
              <MailIcon className="h-4 w-4 text-brass" />
              {config.site.contactEmail}
            </a>
            <p className="mt-4 text-sm leading-relaxed text-mist">
              {book.author.ministry}
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-7 text-xs text-mist md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {book.authorFull}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {['Privacy Policy', 'Terms', 'Shipping & Refund Policy'].map((label) => (
              <li key={label}>
                <a href="#top" className="transition-colors duration-300 hover:text-ink">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}