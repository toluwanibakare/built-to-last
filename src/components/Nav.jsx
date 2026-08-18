import { useEffect, useState } from 'react'
import { Button } from './ui/Button'

const LINKS = [
  { href: '#book', label: 'The Book' },
  { href: '#lessons', label: 'Inside' },
  { href: '#preview', label: 'Preview' },
  { href: '#author', label: 'Author' },
  { href: '#faq', label: 'FAQ' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    }
    return 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled ? 'border-b border-line bg-paper/85 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8"
        aria-label="Main navigation"
      >
        <a
          href="#top"
          className="flex items-center gap-2.5"
          aria-label="Built to Last, home"
        >
          <img
            src="/femi_logo.png"
            alt="Logo of Femi Bakare"
            className="h-9 w-auto"
            width={36}
            height={36}
          />
          <span className="font-display text-lg font-medium tracking-tight text-ink whitespace-nowrap">
            Built to Last
          </span>
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-ink-soft transition-colors duration-300 hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Button
            href="#pre-order"
            className="!hidden lg:!inline-flex px-5 py-2.5 text-sm"
            onClick={() => setOpen(false)}
          >
            Pre-order
          </Button>

          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-cream/30 text-ink backdrop-blur transition-colors hover:border-ink/40"
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth={1.8}>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m12.72-12.72l-1.41 1.41" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth={1.8}>
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-cream/30 text-ink backdrop-blur transition-colors hover:border-ink/40 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(!open)}
          >
            <span className="relative block h-3 w-5" aria-hidden="true">
              <span
                className={`absolute left-0 top-0 h-px w-full bg-current transition-all duration-300 ${
                  open ? 'top-1/2 rotate-45' : ''
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 h-px w-full bg-current transition-all duration-300 ${
                  open ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-px w-full bg-current transition-all duration-300 ${
                  open ? 'bottom-auto top-1/2 -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`overflow-hidden border-line bg-paper transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
          open ? 'max-h-[70vh] border-b' : 'max-h-0'
        }`}
      >
        <ul className="flex flex-col gap-1 px-5 py-6">
          {LINKS.map((link, i) => (
            <li
              key={link.href}
              className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
              }`}
              style={{ transitionDelay: open ? `${80 + i * 50}ms` : '0ms' }}
            >
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-3 font-display text-2xl text-ink transition-colors hover:text-brass-deep"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="pt-4">
            <Button href="#pre-order" className="w-full" onClick={() => setOpen(false)}>
              Pre-order Your Copy
            </Button>
          </li>
        </ul>
      </div>
    </header>
    </>
  )
}