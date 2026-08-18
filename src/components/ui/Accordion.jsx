import { useState } from 'react'

export function AccordionItem({ index, question, answer, open = false, onToggle }) {
  const isOpen = open
  const buttonId = `faq-button-${index}`
  const panelId = `faq-panel-${index}`

  return (
    <div className="border-b border-line">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => onToggle(index)}
          className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors duration-300 hover:text-brass-deep"
        >
          <span className="font-display text-lg leading-snug text-ink md:text-xl">{question}</span>
          <span
            className="relative h-3 w-3 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
            aria-hidden="true"
          >
            <span className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 bg-ink" />
            <span className="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-ink" />
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="accordion-panel"
        data-open={isOpen}
      >
        <div>
          <p className="max-w-2xl pb-7 leading-relaxed text-slate">{answer}</p>
        </div>
      </div>
    </div>
  )
}

export function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="border-t border-line">
      {items.map((item, i) => (
        <AccordionItem
          key={item.question}
          index={i}
          question={item.question}
          answer={item.answer}
          open={openIndex === i}
          onToggle={(idx) => setOpenIndex(idx === openIndex ? -1 : idx)}
        />
      ))}
    </div>
  )
}
