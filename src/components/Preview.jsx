import { useState, useEffect, useCallback } from 'react'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'
import { book } from '../data/book'

function TocColumn({ part }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">{part.part}</p>
      <h3 className="mt-2 font-display text-xl leading-snug text-ink md:text-2xl">{part.heading}</h3>
      <ul className="mt-5 space-y-2.5">
        {part.chapters.map((chapter) => (
          <li key={chapter} className="flex gap-3 text-sm leading-relaxed text-slate md:text-base">
            <span className="mt-[0.6em] h-px w-4 shrink-0 bg-brass/50" aria-hidden="true" />
            {chapter}
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
    <figure className="relative flex flex-col justify-center px-2 py-4 md:px-8">
      <span className="pointer-events-none absolute left-0 top-0 select-none font-display text-8xl leading-none text-brass/20 md:text-9xl" aria-hidden="true">
        “
      </span>
      <blockquote
        className="min-h-[11rem] md:min-h-[12rem]"
        aria-live="polite"
      >
        <p
          className="transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            opacity: fading ? 0 : 1,
            transform: fading ? 'translateY(10px)' : 'none',
            transition: reduced ? 'none' : undefined,
          }}
        >
          {book.quotes[index]}
        </p>
      </blockquote>
      <figcaption className="mt-6 flex items-center justify-between">
        <span className="text-sm text-mist">
          From the book · {book.quotes.length} reflections
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
              className={`h-1.5 rounded-full transition-all duration-500 ${
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
    <section id="preview" className="scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Preview"
          title="A guided path from courtship to covenant"
          lead={`The book unfolds in four parts across ${book.pages} pages — from the foundations laid before marriage to the final appeal.`}
          className="max-w-2xl"
        />

        <div className="mt-16 grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="grid gap-12 rounded-2xl border border-line bg-white p-8 md:grid-cols-2 md:p-10">
              <TocColumn part={colA[0]} />
              <TocColumn part={colA[1]} />
            </div>
          </Reveal>

          <div className="flex flex-col gap-14">
            <Reveal delay={120}>
              <div className="grid gap-12 rounded-2xl border border-line bg-white p-8 md:grid-cols-2 md:p-10">
                <TocColumn part={colB[0]} />
                <TocColumn part={colB[1]} />
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="rounded-2xl bg-night p-8 text-paper md:p-10">
                <QuoteRotation />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}