import { useState, useEffect, useCallback } from 'react'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'
import { book } from '../data/book'

function TocColumn({ part }) {
  return (
    <div className="flex flex-col h-full">
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-brass">{part.part}</p>
      <h3 className="mt-2.5 font-display text-xl font-medium leading-snug text-ink md:text-2xl pb-4 border-b border-line">
        {part.heading}
      </h3>
      <ul className="mt-5 flex-1 space-y-1">
        {part.chapters.map((chapter) => (
          <li
            key={chapter}
            className="group flex items-baseline gap-3 py-2.5 border-b border-line/40 last:border-none text-sm text-slate hover:text-ink transition-all duration-300 hover:pl-1.5"
          >
            <span className="h-1 w-1 shrink-0 rounded-full bg-brass/70 group-hover:bg-brass transition-colors duration-300" aria-hidden="true" />
            <span className="leading-relaxed">{chapter}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function QuoteRotation() {
  const [index, setIndex] = useState(0)
  const [fading, setFading] = useState(false)

  const advance = useCallback(() => {
    setFading(true)
    setTimeout(() => {
      setIndex((i) => (i + 1) % book.quotes.length)
      setFading(false)
    }, 400)
  }, [])

  useEffect(() => {
    const timer = setInterval(advance, 7000)
    return () => clearInterval(timer)
  }, [advance])

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  return (
    <figure className="relative flex flex-col justify-center items-center px-6 py-10 md:px-16 md:py-14">
      <span className="pointer-events-none absolute left-1/2 -top-2 -translate-x-1/2 select-none font-display text-[9rem] leading-none text-brass/10 md:text-[11rem]" aria-hidden="true">
        “
      </span>
      <blockquote
        className="min-h-[10rem] md:min-h-[12rem] max-w-3xl text-center relative z-10"
        aria-live="polite"
      >
        <p
          className="font-display text-xl italic leading-relaxed text-ink md:text-2xl lg:text-[2rem] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            opacity: fading ? 0 : 1,
            transform: fading ? 'translateY(12px)' : 'none',
            transition: reduced ? 'none' : undefined,
          }}
        >
          {book.quotes[index]}
        </p>
      </blockquote>
      <figcaption className="mt-8 flex w-full items-center justify-between border-t border-line/20 pt-5 relative z-10">
        <span className="text-xs tracking-wider text-mist">
          Reflections · {index + 1} of {book.quotes.length}
        </span>
        <div className="flex gap-2" role="group" aria-label="Quotes">
          {book.quotes.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show quote ${i + 1}`}
              aria-pressed={i === index}
              onClick={() => {
                setIndex(i)
              }}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === index ? 'w-6 bg-brass' : 'w-1.5 bg-line hover:bg-mist'
              }`}
            />
          ))}
        </div>
      </figcaption>
    </figure>
  )
}

export default function Preview() {
  const parts = book.tableOfContents
  const colA = [parts[0], parts[1]]
  const colB = [parts[2], parts[3]]

  return (
    <section id="preview" className="scroll-mt-24 py-24 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Preview"
          title="A guided path from courtship to covenant"
          lead={`The book unfolds in four parts across ${book.pages} pages, from the foundations laid before marriage to the final appeal.`}
          className="max-w-2xl"
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <Reveal className="h-full">
            <div className="grid gap-10 rounded-2xl border border-line border-t-2 border-t-brass bg-cream p-8 md:grid-cols-2 md:p-10 shadow-soft h-full">
              <TocColumn part={colA[0]} />
              <TocColumn part={colA[1]} />
            </div>
          </Reveal>

          <Reveal delay={120} className="h-full">
            <div className="grid gap-10 rounded-2xl border border-line border-t-2 border-t-brass bg-cream p-8 md:grid-cols-2 md:p-10 shadow-soft h-full">
              <TocColumn part={colB[0]} />
              <TocColumn part={colB[1]} />
            </div>
          </Reveal>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <Reveal delay={200}>
            <div className="rounded-2xl border border-line bg-night text-ink shadow-soft overflow-hidden">
              <QuoteRotation />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}