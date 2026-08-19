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

function ReviewRotation() {
  const [index, setIndex] = useState(0)
  const [fading, setFading] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const advance = useCallback(() => {
    if (expanded) return // pause auto-rotate if reading
    setFading(true)
    setTimeout(() => {
      setIndex((i) => (i + 1) % book.reviews.length)
      setFading(false)
      setExpanded(false)
    }, 400)
  }, [expanded])

  useEffect(() => {
    const timer = setInterval(advance, 8000)
    return () => clearInterval(timer)
  }, [advance])

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const review = book.reviews[index] || {}
  const text = review.text || ''
  const isLong = text.length > 200
  const displayText = expanded || !isLong ? text : text.slice(0, 200).trim() + '...'

  return (
    <figure className="relative flex flex-col justify-center items-center px-6 py-10 md:px-16 md:py-14">
      <span className="pointer-events-none absolute left-1/2 -top-4 -translate-x-1/2 select-none font-display text-[9rem] leading-none text-brass/10 md:text-[11rem]" aria-hidden="true">
        “
      </span>
      <blockquote
        className="min-h-[14rem] md:min-h-[16rem] w-full max-w-3xl text-center relative z-10 flex flex-col items-center justify-center"
        aria-live="polite"
      >
        <div
          className="transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] w-full"
          style={{
            opacity: fading ? 0 : 1,
            transform: fading ? 'translateY(12px)' : 'none',
            transition: reduced ? 'none' : undefined,
          }}
        >
          <p className="font-sans text-base leading-relaxed text-ink md:text-lg">
            "{displayText}"
          </p>
          {isLong && (
            <button 
              onClick={() => setExpanded(!expanded)} 
              className="inline-block mt-3 text-sm font-medium text-brass hover:text-brass-deep transition-colors"
            >
              {expanded ? 'Read less' : 'Read more'}
            </button>
          )}
          <footer className="mt-6 flex flex-col items-center justify-center">
            <cite className="font-display font-medium text-ink not-italic text-lg">{review.author}</cite>
            {review.title && <span className="text-sm text-mist block mt-1">{review.title}</span>}
          </footer>
        </div>
      </blockquote>
      <figcaption className="mt-8 flex w-full items-center justify-between border-t border-line/20 pt-5 relative z-10">
        <span className="text-xs tracking-wider text-mist">
          Reviews · {index + 1} of {book.reviews?.length || 1}
        </span>
        <div className="flex gap-2" role="group" aria-label="Reviews">
          {book.reviews?.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show review ${i + 1}`}
              aria-pressed={i === index}
              onClick={() => {
                setFading(true)
                setTimeout(() => {
                  setIndex(i)
                  setFading(false)
                  setExpanded(false)
                }, 300)
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

        <div id="reviews" className="mx-auto mt-24 max-w-4xl scroll-mt-24">
          <Reveal delay={200}>
            <div className="rounded-2xl border border-line bg-night text-ink shadow-soft overflow-hidden">
              <ReviewRotation />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}