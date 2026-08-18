import { Suspense, lazy } from 'react'
import { Button } from './ui/Button'
import { book } from '../data/book'

const Book3D = lazy(() => import('./Book3D.jsx'))

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden lg:h-screen lg:min-h-[700px] lg:max-h-[950px] xl:max-h-[1080px]">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(50rem 35rem at 72% 20%, rgba(169, 142, 78, 0.12), transparent 65%), radial-gradient(40rem 30rem at 12% 82%, rgba(24, 32, 45, 0.4), transparent 70%)',
        }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 pb-12 pt-24 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:pb-12 lg:pt-28">
        <div className="max-w-xl">
          <p className="hero-enter text-xs font-semibold uppercase tracking-[0.22em] text-brass" style={{ '--hero-delay': '60ms' }}>
            New Book by {book.author.name}
          </p>

          <h1
            className="hero-enter mt-4 font-display text-5xl leading-[1.02] tracking-tight text-ink md:text-7xl lg:text-[4.2rem] xl:text-[5rem]"
            style={{ '--hero-delay': '140ms' }}
          >
            {book.title}
            <span className="mt-3 block font-display text-xl font-light italic leading-snug text-brass md:text-2xl xl:text-3xl">
              {book.subtitle}
            </span>
          </h1>

          <blockquote
            className="hero-enter mt-5 border-l-2 border-brass pl-4"
            style={{ '--hero-delay': '240ms' }}
          >
            <p className="font-display text-base italic leading-relaxed text-ink-soft md:text-lg">
              {book.tagline}
            </p>
          </blockquote>

          <p
            className="hero-enter mt-5 max-w-lg text-sm leading-relaxed text-slate md:text-base"
            style={{ '--hero-delay': '320ms' }}
          >
            {book.shortDescription}
          </p>

          <div className="hero-enter mt-6 flex flex-wrap items-center gap-4" style={{ '--hero-delay': '400ms' }}>
            <Button href="#pre-order">Pre-order Your Copy</Button>
            <Button href="#preview" variant="outline">
              Explore the Book
            </Button>
          </div>

          <dl
            className="hero-enter mt-8 flex flex-wrap gap-x-10 gap-y-3 border-t border-line pt-5"
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
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-line bg-cream/15 backdrop-blur-sm lg:max-h-[500px] xl:max-h-[550px]">
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