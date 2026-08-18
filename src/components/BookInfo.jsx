import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'
import { book } from '../data/book'

export default function BookInfo() {
  return (
    <section id="book" className="scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div>
            <SectionHeading
              eyebrow="The Book"
              title="A biblical pattern for a marriage that endures"
            />
            <Reveal delay={220} className="mt-10 space-y-5 text-base leading-relaxed text-slate md:text-lg">
              <p>
                {book.fullDescription[0]}
              </p>
              <p>{book.fullDescription[1]}</p>
            </Reveal>
          </div>

          <div className="flex flex-col gap-10">
            {book.fullDescription.slice(2).map((paragraph, i) => (
              <Reveal key={i} delay={i * 100} className="border-l-2 border-line pl-6 md:pl-8">
                <p className="text-base leading-relaxed text-slate md:text-lg">{paragraph}</p>
              </Reveal>
            ))}

            <Reveal delay={120}>
              <div className="rounded-2xl bg-cream p-8 md:p-10">
                <h3 className="font-display text-xl text-ink md:text-2xl">
                  What the book solves
                </h3>
                <ul className="mt-6 space-y-5">
                  {book.problemsSolved.map((problem) => (
                    <li key={problem.title} className="flex gap-4">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" aria-hidden="true" />
                      <div>
                        <p className="font-medium text-ink">{problem.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-slate">{problem.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}