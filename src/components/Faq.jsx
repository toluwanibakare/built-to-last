import { SectionHeading } from './ui/SectionHeading'
import { Accordion } from './ui/Accordion'
import { Reveal } from './ui/Reveal'
import { book } from '../data/book'

const FAQS = [
  {
    question: 'Who is this book for?',
    answer:
      'Singles preparing for marriage, engaged and newlywed couples, married couples at any stage, pastors and Christian counselors, and believers navigating separation, divorce, or abusive situations.',
  },
  {
    question: 'What makes this book different from other books on marriage?',
    answer:
      'It rejects modern, shifting cultural standards and returns to the authority of Scripture, drawing on the author’s over twenty-one years of marriage, ministry, and biblical study. It addresses difficult topics with rare candor, including physical intimacy, abuse, divorce, and remarriage.',
  },
  {
    question: 'Why is salvation called the foundation?',
    answer:
      'As the book puts it, for Christ to govern your home, He must first govern your heart. The starting point is not a wedding ceremony: it is salvation.',
  },
  {
    question: 'What are the premarital red flags the book warns about?',
    answer:
      'A lack of self-control, dishonesty, financial irresponsibility, and a lack of respect for authority. The book teaches that marriage does not cure character; it only reveals it.',
  },
  {
    question: 'Does the book really talk about physical intimacy?',
    answer:
      'Yes, with unusual candor for Christian circles. It discusses God’s design for sexual pleasure, debunks common myths, and offers guidance on mutual respect in the bedroom.',
  },
  {
    question: 'What does the book say about divorce, abuse, and remarriage?',
    answer:
      'Grounding its arguments in Matthew 19 and 1 Corinthians 7, the book outlines the biblical boundaries under which a covenant may be dissolved, such as sexual immorality, death, or unbelieving abandonment, while teaching that physical or mental abuse justifies separation for safety but does not authorize remarriage.',
  },
  {
    question: 'How many pages does the book have?',
    answer: `The book runs ${book.pages} pages across four parts and seventeen chapters, from "Before You Say I Do" to a final appeal.`,
  },
  {
    question: 'Will there be an e-book edition?',
    answer:
      'The physical book is the focus of this pre-order phase. An e-book edition will be made available later.',
  },
]

export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 border-t border-line bg-cream/30 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Questions"
            title="Answers, straight from the book"
            lead="Everything below is drawn from the book’s actual content and the pre-order details."
            className="lg:sticky lg:top-32"
          />
        </div>
        <Reveal delay={120}>
          <Accordion items={FAQS} />
        </Reveal>
      </div>
    </section>
  )
}