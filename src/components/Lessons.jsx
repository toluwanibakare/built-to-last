import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'
import { book } from '../data/book'

export default function Lessons() {
  return (
    <section id="lessons" className="scroll-mt-24 border-y border-line bg-cream/30 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          align="center"
          eyebrow="Inside the Book"
          title="Six lessons that shape a lasting marriage"
          lead="From the foundation of salvation to the hard questions of covenant and safety, drawn directly from the book."
          className="mx-auto max-w-2xl"
        />

        <ol className="mt-16 grid gap-x-14 gap-y-12 md:grid-cols-2 lg:mt-20">
          {book.lessons.map((lesson, i) => (
            <li key={lesson.number} className="flex gap-6 md:gap-8">
              <Reveal delay={i % 2 === 0 ? 0 : 100} className="flex gap-6 md:gap-8">
                <span className="font-display text-4xl font-light text-line md:text-5xl" aria-hidden="true">
                  {lesson.number}
                </span>
                <div className="border-t border-line pt-4">
                  <h3 className="font-display text-xl leading-snug text-ink md:text-2xl">
                    {lesson.title}
                  </h3>
                  <p className="mt-3 max-w-md leading-relaxed text-slate">{lesson.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}