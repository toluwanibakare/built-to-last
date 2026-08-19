import { useState } from 'react'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'
import { book } from '../data/book'
import { config } from '../config'

export default function Author() {
  const [showSocials, setShowSocials] = useState(false)

  return (
    <section id="author" className="scroll-mt-24 border-y border-line bg-cream/30 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <Reveal className="mx-auto w-full max-w-sm lg:max-w-none">
            <div 
              className="relative"
              onMouseEnter={() => setShowSocials(true)}
              onMouseLeave={() => setShowSocials(false)}
            >
              <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-cream">
                <img
                  src="/femi_bakare.png"
                  alt="Portrait of Femi Bakare, author of Built to Last"
                  className="h-full w-full object-cover"
                  width={446}
                  height={559}
                />
              </div>
              
              <div className="absolute bottom-4 right-4 flex flex-col items-center gap-2">
                <div className={`flex flex-col gap-2 transition-all duration-300 origin-bottom ${showSocials ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}>
                  <a href={config.social.facebook} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-night text-white shadow-lg transition-transform hover:scale-110" aria-label="Facebook">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href={config.social.instagram} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-night text-white shadow-lg transition-transform hover:scale-110" aria-label="Instagram">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.07M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                  <a href={config.social.whatsapp} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-night text-white shadow-lg transition-transform hover:scale-110" aria-label="WhatsApp">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.395 0 .003 5.392.003 12.029c0 2.122.553 4.195 1.605 6.012L.031 23.97l6.096-1.597a11.972 11.972 0 005.904 1.554c6.634 0 12.026-5.392 12.026-12.028C24.057 5.392 18.665 0 12.031 0zm7.14 17.15c-.302.852-1.737 1.572-2.428 1.67-.532.076-1.222.146-3.414-.761-2.695-1.115-4.42-3.86-4.553-4.04-.132-.178-1.085-1.446-1.085-2.76 0-1.312.68-1.956.924-2.222.242-.266.531-.334.707-.334.178 0 .356.002.51.01.163.007.382-.061.599.462.221.533.754 1.84.821 1.973.065.133.11.288.02.466-.089.177-.133.288-.266.443-.133.155-.282.327-.398.444-.132.132-.27.278-.116.544.156.266.69 1.137 1.481 1.843.914.814 1.761 1.07 2.028 1.196.265.127.42.106.577-.074.156-.178.672-.782.85-1.05.178-.266.355-.221.599-.133.243.089 1.53.722 1.796.855.265.133.442.199.508.31.066.111.066.643-.236 1.496z"/></svg>
                  </a>
                  <a href="mailto:voiceoftruthonline@gmail.com" className="flex h-10 w-10 items-center justify-center rounded-full bg-night text-white shadow-lg transition-transform hover:scale-110" aria-label="Email">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  </a>
                </div>
                
                <button 
                  onClick={() => setShowSocials(!showSocials)}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-brass text-white shadow-lg transition-colors hover:bg-brass-deep"
                  aria-label="Toggle social links"
                  aria-expanded={showSocials}
                >
                  <svg className={`h-6 w-6 transition-transform duration-300 ${showSocials ? 'rotate-45' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
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