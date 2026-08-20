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

function formatMoney(amount, currency = 'NGN') {
  return new Intl.NumberFormat(currency === 'NGN' ? 'en-NG' : 'en-US', { 
    style: 'currency', 
    currency: currency, 
    maximumFractionDigits: currency === 'NGN' ? 0 : 2 
  }).format(amount)
}

const EXCHANGE_RATES = {
  NGN: 1,
  USD: 1 / 1500,
  EUR: 1 / 1600,
  GBP: 1 / 1900,
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
    currency: 'NGN',
    acceptTerms: false,
    acceptShipping: false,
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const PRICING = {
    hard: { regular: 7000, preorder: 6500 },
    soft: { regular: 6000, preorder: 5500 },
  }
  const currentPricing = PRICING[edition]
  const rate = EXCHANGE_RATES[form.currency] || 1

  const setField = (name) => (e) => {
    const val = e.target.value
    setForm((f) => ({ ...f, [name]: val }))
    setErrors((er) => ({ ...er, [name]: undefined }))

    if (name === 'currency' && val !== 'NGN') {
      setEdition('soft')
      setForm((f) => ({ ...f, country: '', state: '' }))
    } else if (name === 'currency' && val === 'NGN') {
      // Optional: don't auto-switch back to hard, let them choose
    }
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Please enter your full name'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Please enter a valid email address'
    if (!form.whatsapp.trim()) next.whatsapp = 'Please enter your WhatsApp number'
    if (!form.country.trim()) next.country = 'Please enter your country'
    
    if (edition === 'hard') {
      if (!form.state.trim()) next.state = 'Please enter your state or region'
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

    if (!validate()) {
      if (!form.acceptTerms || (edition === 'hard' && !form.acceptShipping)) {
        setMessage('Please accept the terms and shipping policies to continue.')
      }
      return
    }

    if (!form.acceptTerms) {
      setMessage('Please accept the terms and privacy policy.')
      return
    }
    if (edition === 'hard' && !form.acceptShipping) {
      setMessage('Please accept the shipping and refund policy.')
      return
    }

    setStatus('creating')
    try {
      const quantity = parseInt(form.quantity, 10)
      const baseTotal = currentPricing.preorder * quantity
      const totalAmount = form.currency === 'NGN' ? baseTotal : Number((baseTotal * rate).toFixed(2))
      const order = buildOrder({
        customer: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.whatsapp.trim(),
          country: form.country.trim(),
          state: edition === 'hard' ? form.state : 'N/A',
          address: edition === 'hard' ? form.address.trim() : 'N/A',
        },
        quantity,
      })
      
      order.total = totalAmount
      order.currency = form.currency
      order.edition = edition === 'hard' ? 'Hard Copy (Paperback)' : 'Soft Copy (E-book)'

      const isRequest = form.currency !== 'NGN'
      order.isRequest = isRequest

      await createOrder({
        reference: order.reference,
        customer: order.customer,
        quantity,
        amount: order.total,
        currency: order.currency,
        edition: order.edition,
        status: isRequest ? 'requested' : 'pending'
      })

      if (isRequest) {
        setStatus('idle')
        onOrderConfirmed({
          ...order,
          paymentReference: 'N/A',
          paymentStatus: 'pending',
          status: 'requested',
        })
        return
      }

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
            status: 'successful',
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
    } catch (err) {
      setStatus('idle')
      console.error(err)
      setMessage(err.message || 'Something went wrong while starting your payment. Please try again.')
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
                    <span className="line-through text-mist text-sm">{formatMoney(currentPricing.regular * rate, form.currency)}</span>
                    <span className="font-display text-lg font-semibold text-brass">{formatMoney(currentPricing.preorder * rate, form.currency)}</span>
                    <span className="text-xs text-brass/80 font-medium">Pre-order</span>
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-6">
                  <dt className="text-mist">Format</dt>
                  <dd className="font-medium text-ink">
                    {edition === 'hard' ? 'Paperback' : 'E-book'}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-6">
                  <dt className="text-mist">Delivery</dt>
                  <dd className="text-right text-ink text-sm">
                    {edition === 'hard'
                      ? 'Available to any part of Nigeria. Customer pays delivery cost when the book launches.'
                      : 'E-book will be sent to your registered email address.'}
                  </dd>
                </div>
              </dl>

              <p className="text-sm leading-relaxed text-mist">
                The paperback edition will be delivered to any part of Nigeria when the book launches, with delivery costs borne by the customer. The soft copy (e-book) will be sent to your registered email address.
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
                      disabled={form.currency !== 'NGN'}
                      onClick={() => {
                        setEdition('hard')
                        setForm((f) => ({ ...f, country: 'Nigeria', state: 'Abia' }))
                        setErrors({})
                      }}
                      className={`rounded-lg border p-4 text-center transition-all duration-300 ${
                        form.currency !== 'NGN' ? 'opacity-50 cursor-not-allowed border-line bg-cream/40 text-slate' :
                        edition === 'hard'
                          ? 'border-brass bg-brass/10 text-ink font-semibold cursor-pointer'
                          : 'border-line bg-cream/40 text-slate hover:border-ink/20 cursor-pointer'
                      }`}
                    >
                      Hard Copy (Paperback)
                      {form.currency !== 'NGN' && <span className="block text-xs mt-1 font-normal opacity-70">Naira only</span>}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEdition('soft')
                        setForm((f) => ({ ...f, country: '', state: '' }))
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

                {edition === 'hard' ? (
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
                ) : (
                  <Field
                    id="order-country"
                    label="Country"
                    placeholder="e.g. USA, UK, Canada"
                    value={form.country}
                    onChange={setField('country')}
                    error={errors.country}
                    required
                    className="md:col-span-2"
                  />
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

                {edition === 'soft' && (
                  <Field
                    id="order-currency"
                    as="select"
                    label="Select Currency"
                    value={form.currency}
                    onChange={setField('currency')}
                    className="md:col-span-2"
                    required
                  >
                    <option value="NGN">Naira (NGN)</option>
                    <option value="USD">Dollars (USD)</option>
                    <option value="EUR">Euros (EUR)</option>
                    <option value="GBP">Pounds (GBP)</option>
                  </Field>
                )}
              </div>

              <div className="mt-8 flex flex-col gap-4 border-t border-line pt-7">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.acceptTerms}
                    onChange={(e) => setForm(f => ({ ...f, acceptTerms: e.target.checked }))}
                    required
                    className="mt-1 h-4 w-4 shrink-0 rounded border-ink/20 text-brass focus:ring-brass"
                  />
                  <span className="text-sm text-ink-soft">
                    I accept the <a href="#terms" className="underline hover:text-ink text-brass">terms</a> and <a href="#privacy" className="underline hover:text-ink text-brass">privacy policy</a> for this pre-order.
                  </span>
                </label>
                
                {edition === 'hard' && (
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.acceptShipping}
                      onChange={(e) => setForm(f => ({ ...f, acceptShipping: e.target.checked }))}
                      required
                      className="mt-1 h-4 w-4 shrink-0 rounded border-ink/20 text-brass focus:ring-brass"
                    />
                    <span className="text-sm text-ink-soft">
                      I accept the <a href="#shipping" className="underline hover:text-ink text-brass">shipping and refund policy</a>. I understand that I will bear the cost of delivery to any location when the book launches.
                    </span>
                  </label>
                )}

                <div className="flex items-baseline justify-between mt-4">
                  <span className="text-sm text-mist">Total ({form.quantity || 1} copy)</span>
                  <span className="font-display text-2xl text-ink">
                    {formatMoney(currentPricing.preorder * Math.max(1, parseInt(form.quantity || 1, 10)) * rate, form.currency)}
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
                  className="w-full mt-2"
                >
                  {form.currency !== 'NGN' ? 'Submit Request' : 'Pre-order Your Copy'}
                </Button>

                <p className="text-center text-xs leading-relaxed text-mist">
                  {form.currency !== 'NGN' 
                    ? 'Your request will be sent to our team, and we will email you with payment details.'
                    : 'Payments are processed securely by Korapay. You will receive an order confirmation after payment.'}
                </p>
                <p className="text-center text-xs leading-relaxed text-mist mt-2">
                  If you have issues pre-ordering, contact <a href="mailto:builttolastfm@gmail.com" className="underline hover:text-ink">builttolastfm@gmail.com</a> or <a href="mailto:mosesbakare48@gmail.com" className="underline hover:text-ink">mosesbakare48@gmail.com</a>.
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}