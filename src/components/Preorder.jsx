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
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: COUNTRIES[0],
    state: '',
    address: '',
    quantity: '1',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const priceConfigured = config.order.price > 0

  const total = useMemo(() => {
    const qty = Math.max(1, parseInt(form.quantity, 10) || 1)
    return qty * config.order.price + config.order.shippingCost
  }, [form.quantity])

  const setField = (name) => (e) => {
    setForm((f) => ({ ...f, [name]: e.target.value }))
    setErrors((er) => ({ ...er, [name]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Please enter your full name'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Please enter a valid email address'
    if (!form.phone.trim()) next.phone = 'Please enter your phone number'
    if (!form.state.trim()) next.state = 'Please enter your state or region'
    if (!form.address.trim()) next.address = 'Please enter your delivery address'
    const qty = parseInt(form.quantity, 10)
    if (!qty || qty < 1 || qty > 20) next.quantity = 'Choose a quantity between 1 and 20'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    if (!priceConfigured) {
      setMessage('Pricing will be announced soon — check back to place your pre-order.')
      return
    }

    if (!validate()) return

    setStatus('creating')
    try {
      const quantity = parseInt(form.quantity, 10)
      const order = buildOrder({
        customer: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          country: form.country,
          state: form.state.trim(),
          address: form.address.trim(),
        },
        quantity,
      })

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
        metadata: { orderId: order.reference, qty: String(quantity) },
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
                  <dd className="font-medium text-ink">{config.order.priceLabel}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-6">
                  <dt className="text-mist">Format</dt>
                  <dd className="font-medium text-ink">Paperback · {book.pages} pages</dd>
                </div>
                <div className="flex items-baseline justify-between gap-6">
                  <dt className="text-mist">Shipping</dt>
                  <dd className="text-right text-ink">Details announced at launch</dd>
                </div>
              </dl>

              <p className="text-sm leading-relaxed text-mist">
                An e-book edition will be made available later. The physical book remains the
                focus of this pre-order.
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
                  id="order-phone"
                  type="tel"
                  label="Phone number"
                  placeholder="+234 800 000 0000"
                  value={form.phone}
                  onChange={setField('phone')}
                  error={errors.phone}
                  required
                  autoComplete="tel"
                />
                <Field
                  id="order-country"
                  as="select"
                  label="Country"
                  value={form.country}
                  onChange={setField('country')}
                  required
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Field>
                <Field
                  id="order-state"
                  label="State / region"
                  placeholder="State or region"
                  value={form.state}
                  onChange={setField('state')}
                  error={errors.state}
                  required
                />
                <Field
                  id="order-address"
                  label="Delivery address"
                  placeholder="Street, city"
                  value={form.address}
                  onChange={setField('address')}
                  error={errors.address}
                  required
                  className="md:col-span-2"
                />
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
                    {priceConfigured ? formatMoney(total, config.order.currency) : config.order.priceLabel}
                  </span>
                </div>

                {message ? (
                  <p role="status" className="rounded-lg bg-cream px-4 py-3 text-sm text-ink-soft">
                    {message}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  loading={status === 'creating' || status === 'paying'}
                  disabled={status === 'paying'}
                  className="w-full"
                >
                  {priceConfigured ? 'Pre-order Your Copy' : 'Join the Pre-order List'}
                </Button>

                <p className="text-center text-xs leading-relaxed text-mist">
                  Payments are processed securely by Korapay. You will receive an order
                  confirmation after payment.
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}