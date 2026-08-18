import { useState } from 'react'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'
import { Field } from './ui/Field'
import { Button } from './ui/Button'
import { book } from '../data/book'
import { config } from '../config'
import { initializeCheckout } from '../lib/korapay'
import { buildOrder, createOrder, verifyPayment } from '../lib/orders'

const NIGERIA_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'FCT (Abuja)', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
  'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
  'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
]

function formatMoney(amount) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount)
}

export default function Preorder({ onOrderConfirmed }) {
  const [edition, setEdition] = useState('hard')
  const [form, setForm] = useState({
    name: '',
    email: '',
    whatsapp: '',
    country: 'Nigeria',
    state: 'Abia',
    address: '',
    quantity: '1',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const PRICING = {
    hard: { regular: 7000, preorder: 6500 },
    soft: { regular: 6000, preorder: 5500 },
  }
  const currentPricing = PRICING[edition]

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
      const totalAmount = currentPricing.preorder * quantity
      const order = buildOrder({
        customer: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.whatsapp.trim(),
          country: edition === 'hard' ? 'Nigeria' : 'N/A',
          state: edition === 'hard' ? form.state : 'N/A',
          address: edition === 'hard' ? form.address.trim() : 'N/A',
        },
        quantity,
      })
      
      order.total = totalAmount
      order.edition = edition === 'hard' ? 'Hard Copy (Paperback)' : 'Soft Copy (E-book)'

      await createOrder({
        reference: order.reference,
        customer: order.customer,
        quantity,
        amount: order.total,
        currency: order.currency,
      })

      setStatus('paying')
      initializeCheckout({
        reference: order.reference,
        amount: order.total,
        currency: order.currency,
        customer: { name: order.customer.name, email: order.customer.email },
        narration: `Pre-order: ${config.order.bookTitle} (${quantity} copy${quantity > 1 ? 's' : ''})`,
        metadata: { orderId: order.reference, qty: String(quantity), edition: order.edition },
        onSuccess: async (data) => {
          try {
            await verifyPayment({ reference: data.reference || order.reference, orderId: order.reference })
          } catch {
            setStatus('idle')
            setMessage('Payment was received, but we could not confirm it automatically. Please contact us with your order number.')
            return
          }
          onOrderConfirmed({
            ...order,
            paymentReference: data.reference || order.reference,
            paymentStatus: 'paid',
            status: 'processing',
          })
        },
        onFailed: () => {
          setStatus('idle')
          setMessage('The payment did not go through. Please try again.')
        },
        onClose: () => {
          setStatus((current) => (current === 'paying' ? 'idle' : current))
        },
        onPending: () => {
          setMessage('Your bank transfer is being confirmed. We will confirm your order once it clears.')
        },
      })
    } catch {
      setStatus('idle')
      setMessage('Something went wrong while starting your payment. Please try again.')
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
                  <dd className="flex items-baseline gap-2">
                    <span className="line-through text-mist text-sm">{formatMoney(currentPricing.regular)}</span>
                    <span className="font-display text-lg font-semibold text-brass">{formatMoney(currentPricing.preorder)}</span>
                    <span className="text-xs text-brass/80 font-medium">Pre-order</span>
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-6">
                  <dt className="text-mist">Format</dt>
                  <dd className="font-medium text-ink">Paperback &amp; E-book editions</dd>
                </div>
                <div className="flex items-start justify-between gap-6">
                  <dt className="text-mist">Delivery</dt>
                  <dd className="text-right text-ink text-sm">Buyer bears delivery cost. Details shared at launch.</dd>
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
                      {NIGERIA_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
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

                <div className="md:col-span-2 md:max-w-[12rem] flex flex-col gap-2">
                  <label htmlFor="order-quantity" className="text-sm font-medium text-ink-soft">
                    Quantity
                    <span className="text-brass-deep" aria-hidden="true"> *</span>
                  </label>
                  <div className="flex items-center rounded-lg border border-line bg-cream">
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, quantity: Math.max(1, parseInt(f.quantity || 1, 10) - 1).toString() }))}
                      className="px-4 py-3 text-ink-soft hover:text-ink hover:bg-line/30 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8h10" strokeLinecap="round"/></svg>
                    </button>
                    <input
                      id="order-quantity"
                      type="number"
                      min="1"
                      max="20"
                      value={form.quantity}
                      onChange={setField('quantity')}
                      className="w-full bg-transparent px-2 py-3 text-center text-base text-ink focus:outline-none appearance-none"
                      style={{ MozAppearance: 'textfield' }}
                    />
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, quantity: Math.min(20, parseInt(f.quantity || 1, 10) + 1).toString() }))}
                      className="px-4 py-3 text-ink-soft hover:text-ink hover:bg-line/30 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v10M3 8h10" strokeLinecap="round"/></svg>
                    </button>
                  </div>
                  {errors.quantity ? (
                    <p className="text-sm text-red-600" role="alert">{errors.quantity}</p>
                  ) : (
                    <p className="text-sm text-mist">How many copies would you like?</p>
                  )}
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4 border-t border-line pt-7">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-mist">Total ({form.quantity || 1} copy)</span>
                  <span className="font-display text-2xl text-ink">
                    {formatMoney(currentPricing.preorder * Math.max(1, parseInt(form.quantity || 1, 10)))}
                  </span>
                </div>

                {message ? (
                  <p role="status" className="rounded-lg bg-cream/45 px-4 py-3 text-sm text-ink-soft">
                    {message}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  loading={status === 'creating' || status === 'paying'}
                  disabled={status === 'paying'}
                  className="w-full"
                >
                  Pre-order Your Copy
                </Button>

                <p className="text-center text-xs leading-relaxed text-mist">
                  Payments are processed securely by Korapay. You will receive an order confirmation after payment.
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}