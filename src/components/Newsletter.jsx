import { useState } from 'react'
import { Reveal } from './ui/Reveal'
import { Button } from './ui/Button'
import { Field } from './ui/Field'

export default function Newsletter() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }
    setStatus('success')
    setMessage(
      name.trim()
        ? `Thank you, ${name.trim().split(' ')[0]}. You will hear from us when the book launches.`
        : 'Thank you. You will hear from us when the book launches.',
    )
  }

  return (
    <section className="py-24 md:py-28" aria-labelledby="newsletter-title">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="rounded-3xl bg-night px-8 py-14 text-center md:px-16 md:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">
              Stay close
            </p>
            <h2 id="newsletter-title" className="mx-auto mt-4 max-w-2xl font-display text-3xl leading-tight text-ink md:text-4xl">
              Be the first to know when Built to Last is available
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-ink-soft">
              Get book updates, launch news, and pre-order openings — no noise, just the essentials.
            </p>

            <form onSubmit={submit} className="mx-auto mt-9 flex max-w-2xl flex-col gap-3 sm:flex-row" noValidate>
              <div className="sm:flex-[1.4] flex-1">
                <input
                  type="text"
                  id="newsletter-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name (optional)"
                  className="w-full rounded-lg border border-ink/20 bg-night-soft px-4 py-3 text-base text-ink placeholder:text-ink/40 transition-all duration-300 focus:border-brass focus:ring-2 focus:ring-brass/30 focus:outline-none"
                  aria-label="Your name"
                />
              </div>
              <div className="sm:flex-[1] flex-1">
                <input
                  type="email"
                  id="newsletter-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="w-full rounded-lg border border-ink/20 bg-night-soft px-4 py-3 text-base text-ink placeholder:text-ink/40 transition-all duration-300 focus:border-brass focus:ring-2 focus:ring-brass/30 focus:outline-none"
                  aria-label="Your email"
                />
              </div>
              <Button type="submit" variant="primary" className="shrink-0">
                Get Book Updates
              </Button>
            </form>

            {message ? (
              <p
                role={status === 'error' ? 'alert' : 'status'}
                className={`mx-auto mt-5 max-w-md text-sm ${
                  status === 'error' ? 'text-red-300' : 'text-ink-soft'
                }`}
              >
                {message}
              </p>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  )
}