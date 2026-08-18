import { Reveal } from './Reveal'

export function SectionHeading({ eyebrow, title, lead, align = 'left', className = '' }) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'items-start'

  return (
    <div className={`flex flex-col gap-5 ${alignClass} ${className}`}>
      {eyebrow ? (
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">
            {eyebrow}
          </p>
        </Reveal>
      ) : null}
      <Reveal delay={80}>
        <h2 className="font-display text-3xl leading-tight text-ink md:text-5xl">{title}</h2>
      </Reveal>
      {lead ? (
        <Reveal delay={160}>
          <p className={`max-w-xl text-base leading-relaxed text-slate md:text-lg ${align === 'center' ? 'mx-auto' : ''}`}>
            {lead}
          </p>
        </Reveal>
      ) : null}
    </div>
  )
}
