import { useMemo, useState } from 'react'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'
import { Field } from './ui/Field'
import { Button } from './ui/Button'
import { Accordion } from './ui/Accordion'
import { book } from '../data/book'
import { config } from '../config'
import { initializeCheckout } from '../lib/korapay'
import { buildOrder, createOrder, verifyPayment } from '../lib/orders'

const COUNTRIES = [
  'Nigeria',
  'United States',
  'United Kingdom',
  'Canada',
  'Ghana',
  'Kenya',
  'South Africa',
  'Other',
]

function formatMoney(amount, currency) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(amount)
}

export default function Preorder({ onOrderConfirmed }) {
  const [edition, setEdition] = useState('hard')
  const [form, setForm] = useState({
    name: '',
    email: '',
    whatsapp: '',
    country: 'Nigeria',
    state: 'Lagos',
    address: '',
    quantity: '1',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const setField = (name) => (e) => {
    setForm((f) => ({ ...f, [name]: e.target.value }))
    setErrors((er) => ({ ...er, [name]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Please enter your full name'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Please enter a valid email address'
    if (!form.whatsapp.trim()) next.whatsapp = 'Please enter your WhatsApp number'
    if (edition === 'hard') {
      if (!form.address.trim()) next.address = 'Please enter your delivery address'
    }
    const qty = parseInt(form.quantity, 10)
    if (!qty || qty < 1 || qty > 20) next.quantity = 'Choose a quantity between 1 and 20'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    if (!validate()) return

    setStatus('creating')
    try {
      const quantity = parseInt(form.quantity, 10)
      const order = {
        reference: 'PRE-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        customer: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.whatsapp.trim(),
          country: edition === 'hard' ? 'Nigeria' : 'N/A',
          state: edition === 'hard' ? form.state : 'N/A',
          address: edition === 'hard' ? form.address.trim() : 'N/A',
        },
        quantity,
        total: 0,
        currency: 'NGN',
        paymentReference: 'PRE-ORDER-WAITLIST',
        paymentStatus: 'pending',
        status: 'processing',
        edition: edition === 'hard' ? 'Hard Copy (Paperback)' : 'Soft Copy (E-book)',
      }

      // High-end feel loading delay
      await new Promise((resolve) => setTimeout(resolve, 800))
      onOrderConfirmed(order)
    } catch {
      setStatus('idle')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <section id="pre-order" className="scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Pre-order"
              title="Reserve your copy today"
              lead="Secure your copy of Built to Last and be among the first to receive it when the book launches."
            />

            <Reveal delay={200} className="mt-10 space-y-6">
              <dl className="space-y-4 border-t border-line pt-8 text-sm">
                <div className="flex items-baseline justify-between gap-6">
                  <dt className="text-mist">Book</dt>
                  <dd className="text-right font-medium text-ink">{config.order.bookTitle}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-6">
                  <dt className="text-mist">Price per copy</dt>
                  <dd className="font-medium text-ink">To be announced</dd>
                </div>
                <div className="flex items-baseline justify-between gap-6">
                  <dt className="text-mist">Format</dt>
                  <dd className="font-medium text-ink">Paperback & E-book editions</dd>
                </div>
                <div className="flex items-baseline justify-between gap-6">
                  <dt className="text-mist">Shipping</dt>
                  <dd className="text-right text-ink">Details announced at launch</dd>
                </div>
              </dl>

              <p className="text-sm leading-relaxed text-mist">
                The paperback edition will be shipped directly at launch. The soft copy (e-book) will be sent to your registered email address.
              </p>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-2xl border border-line bg-cream p-8 shadow-soft md:p-10"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-sm font-medium text-ink-soft">Select Book Edition</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEdition('hard')
                        setErrors({})
                      }}
                      className={`rounded-lg border p-4 text-center transition-all duration-300 cursor-pointer ${
                        edition === 'hard'
                          ? 'border-brass bg-brass/10 text-ink font-semibold'
                          : 'border-line bg-cream/40 text-slate hover:border-ink/20'
                      }`}
                    >
                      Hard Copy (Paperback)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEdition('soft')
                        setErrors({})
                      }}
                      className={`rounded-lg border p-4 text-center transition-all duration-300 cursor-pointer ${
                        edition === 'soft'
                          ? 'border-brass bg-brass/10 text-ink font-semibold'
                          : 'border-line bg-cream/40 text-slate hover:border-ink/20'
                      }`}
                    >
                      Soft Copy (E-book)
                    </button>
                  </div>
                </div>

                <Field
                  id="order-name"
                  label="Full name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={setField('name')}
                  error={errors.name}
                  required
                  autoComplete="name"
                  className="md:col-span-2"
                />
                <Field
                  id="order-email"
                  type="email"
                  label="Email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={setField('email')}
                  error={errors.email}
                  required
                  autoComplete="email"
                />
                <Field
                  id="order-whatsapp"
                  type="tel"
                  label="WhatsApp number"
                  placeholder="+234 818 494 0002"
                  value={form.whatsapp}
                  onChange={setField('whatsapp')}
                  error={errors.whatsapp}
                  required
                />

                {edition === 'hard' && (
                  <>
                    <Field
                      id="order-country"
                      as="select"
                      label="Country"
                      value={form.country}
                      onChange={setField('country')}
                      required
                    >
                      <option value="Nigeria">Nigeria</option>
                    </Field>
                    <Field
                      id="order-state"
                      as="select"
                      label="State"
                      value={form.state}
                      onChange={setField('state')}
                      error={errors.state}
                      required
                    >
                      <option value="Lagos">Lagos</option>
                      <option value="Port Harcourt">Port Harcourt</option>
                    </Field>
                    <Field
                      id="order-address"
                      label="Delivery address"
                      placeholder="Street name, area"
                      value={form.address}
                      onChange={setField('address')}
                      error={errors.address}
                      required
                      className="md:col-span-2"
                    />
                  </>
                )}

                <Field
                  id="order-quantity"
                  type="number"
                  label="Quantity"
                  min="1"
                  max="20"
                  value={form.quantity}
                  onChange={setField('quantity')}
                  error={errors.quantity}
                  hint="How many copies would you like?"
                  className="md:col-span-2 md:max-w-[12rem]"
                />
              </div>

              <div className="mt-8 flex flex-col gap-4 border-t border-line pt-7">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-mist">Total ({form.quantity || 1} copy)</span>
                  <span className="font-display text-2xl text-ink">
                    To be announced
                  </span>
                </div>

                {message ? (
                  <p role="status" className="rounded-lg bg-cream/45 px-4 py-3 text-sm text-ink-soft">
                    {message}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  loading={status === 'creating'}
                  className="w-full"
                >
                  Join the Pre-order Waitlist
                </Button>

                <p className="text-center text-xs leading-relaxed text-mist">
                  Pricing will be announced soon. Joining the waitlist reserves your place, and you will receive a notification with order details at launch.
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}