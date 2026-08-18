import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'
import { book } from '../data/book'

export default function Author() {
  return (
    <section id="author" className="scroll-mt-24 border-y border-line bg-white/50 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <Reveal className="mx-auto w-full max-w-sm lg:max-w-none">
            <div className="relative">
              <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-cream">
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-cream p-8">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-night">
                    <img
                      src="/femi_logo.png"
                      alt=""
                      className="h-16 w-16 rounded-full object-cover"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="font-display text-2xl text-ink">Femi Bakare</p>
                  <p className="text-center text-xs uppercase tracking-[0.18em] text-mist">
                    Author photograph to be added
                  </p>
                </div>
              </div>
              <div
                className="pointer-events-none absolute -right-5 -top-5 -z-10 h-40 w-40 rounded-full border border-line"
                aria-hidden="true"
              />
            </div>
          </Reveal>

          <div>
            <SectionHeading
              eyebrow="About the Author"
              title={book.author.name}
              lead={book.author.role}
            />

            <div className="mt-8 space-y-5">
              {book.author.bio.map((paragraph, i) => (
                <Reveal key={i} delay={i * 100}>
                  <p className="leading-relaxed text-slate md:text-lg">{paragraph}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={220} className="mt-8">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-mist">
                {book.author.ministry}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}