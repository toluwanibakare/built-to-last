import { Suspense, lazy } from 'react'
import { Button } from './ui/Button'
import { book } from '../data/book'

const Book3D = lazy(() => import('./Book3D.jsx'))

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(52rem 30rem at 72% 18%, rgba(169, 142, 78, 0.08), transparent 60%), radial-gradient(44rem 26rem at 12% 82%, rgba(88, 100, 122, 0.07), transparent 60%)',
        }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-32 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-28 lg:pt-40">
        <div className="max-w-xl">
          <p className="hero-enter text-xs font-semibold uppercase tracking-[0.22em] text-brass" style={{ '--hero-delay': '60ms' }}>
            New Book by {book.author.name}
          </p>

          <h1
            className="hero-enter mt-5 font-display text-5xl leading-[1.04] tracking-tight text-ink md:text-6xl xl:text-7xl"
            style={{ '--hero-delay': '140ms' }}
          >
            {book.title}
            <span className="mt-4 block font-display text-2xl font-light italic leading-snug text-slate md:text-3xl xl:text-4xl">
              {book.subtitle}
            </span>
          </h1>

          <blockquote
            className="hero-enter mt-8 border-l-2 border-brass pl-5"
            style={{ '--hero-delay': '240ms' }}
          >
            <p className="font-display text-lg italic leading-relaxed text-ink-soft md:text-xl">
              {book.tagline}
            </p>
          </blockquote>

          <p
            className="hero-enter mt-7 max-w-lg text-base leading-relaxed text-slate md:text-lg"
            style={{ '--hero-delay': '320ms' }}
          >
            {book.shortDescription}
          </p>

          <div className="hero-enter mt-9 flex flex-wrap items-center gap-4" style={{ '--hero-delay': '400ms' }}>
            <Button href="#pre-order">Pre-order Your Copy</Button>
            <Button href="#preview" variant="outline">
              Explore the Book
            </Button>
          </div>

          <dl
            className="hero-enter mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-7"
            style={{ '--hero-delay': '480ms' }}
          >
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">
                Pages
              </dt>
              <dd className="mt-1 font-display text-2xl text-ink">{book.pages}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">
                Format
              </dt>
              <dd className="mt-1 font-display text-2xl text-ink">Hardcover</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">
                Status
              </dt>
              <dd className="mt-1 font-display text-2xl text-ink">Pre-order</dd>
            </div>
          </dl>
        </div>

        <div className="hero-enter relative mx-auto w-full max-w-md lg:max-w-none" style={{ '--hero-delay': '300ms' }}>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-line bg-white/40">
            <Suspense
              fallback={
                <div className="flex h-full w-full items-center justify-center">
                  <div className="skeleton h-[60%] w-[44%] rounded-sm" />
                </div>
              }
            >
              <Book3D />
            </Suspense>
          </div>
          <div
            className="pointer-events-none absolute -right-8 -top-8 -z-10 h-48 w-48 rounded-full border border-line"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-10 -left-8 -z-10 h-56 w-56 rounded-full border border-line"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  )
}