import { Suspense, lazy } from 'react'
import { Button } from './ui/Button'
import { book } from '../data/book'

const Book3D = lazy(() => import('./Book3D.jsx'))

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen flex-col overflow-hidden lg:h-screen lg:min-h-[700px] lg:max-h-[900px] xl:max-h-[1000px]">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(50rem 35rem at 72% 20%, rgba(169, 142, 78, 0.12), transparent 65%), radial-gradient(40rem 30rem at 12% 82%, rgba(24, 32, 45, 0.4), transparent 70%)',
        }}
      />

      {/* Top spacer to clear the fixed navbar */}
      <div className="h-[76px] shrink-0" />

      <div className="relative mx-auto flex-1 grid w-full max-w-7xl items-center gap-8 px-5 pb-8 pt-2 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:pb-10 lg:pt-4">
        <div className="max-w-xl">
          <p className="hero-enter text-xs font-semibold uppercase tracking-[0.22em] text-brass" style={{ '--hero-delay': '60ms' }}>
            New Book by {book.author.name}
          </p>

          <h1
            className="hero-enter mt-3 font-display text-4xl leading-[1.04] tracking-tight text-ink md:text-6xl lg:text-[3.5rem] xl:text-[4.2rem]"
            style={{ '--hero-delay': '140ms' }}
          >
            {book.title}
            <span className="mt-2 block font-display text-lg font-light italic leading-snug text-brass md:text-xl xl:text-2xl">
              {book.subtitle}
            </span>
          </h1>

          <blockquote
            className="hero-enter mt-4 border-l-2 border-brass pl-4"
            style={{ '--hero-delay': '240ms' }}
          >
            <p className="font-display text-sm italic leading-relaxed text-ink-soft md:text-base">
              {book.tagline}
            </p>
          </blockquote>

          <p
            className="hero-enter mt-3.5 max-w-lg text-xs leading-relaxed text-slate md:text-sm"
            style={{ '--hero-delay': '320ms' }}
          >
            {book.shortDescription}
          </p>

          <div className="hero-enter mt-5 flex flex-wrap items-center gap-4" style={{ '--hero-delay': '400ms' }}>
            <Button href="#pre-order">Pre-order Your Copy</Button>
            <Button href="#preview" variant="outline">
              Explore the Book
            </Button>
          </div>

          <dl
            className="hero-enter mt-6 flex justify-between gap-6 border-t border-line pt-4"
            style={{ '--hero-delay': '480ms' }}
          >
            <div className="whitespace-nowrap">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">
                Pages
              </dt>
              <dd className="mt-1 font-display text-2xl text-ink">{book.pages}</dd>
            </div>
            <div className="whitespace-nowrap">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">
                Format
              </dt>
              <dd className="mt-1 font-display text-2xl text-ink">Paperback</dd>
            </div>
            <div className="whitespace-nowrap">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">
                Status
              </dt>
              <dd className="mt-1 font-display text-2xl text-ink">Pre-order</dd>
            </div>
          </dl>
        </div>

        <div className="hero-enter relative mx-auto w-full max-w-md lg:max-w-none" style={{ '--hero-delay': '300ms' }}>
          <div className="relative h-[450px] sm:h-[500px] lg:h-auto lg:aspect-[4/5] w-full overflow-hidden rounded-2xl border border-line bg-cream/15 backdrop-blur-sm lg:max-h-[480px] xl:max-h-[540px]">
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