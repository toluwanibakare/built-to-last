import { Button } from './ui/Button'
import { config } from '../config'

function Row({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-line pb-4 text-sm last:border-none last:pb-0">
      <dt className="text-mist">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  )
}

export default function OrderSuccess({ order, onContinue }) {
  const deliveryNote = order.edition === 'Soft Copy (E-book)' 
    ? `email (${order.customer.email})` 
    : `${order.customer.state}, Nigeria`

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-24">
      <div className="w-full max-w-2xl">
        <div className="rounded-3xl border border-line bg-cream p-8 text-center shadow-book md:p-14">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brass/15 text-brass-deep"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-current" strokeWidth={1.8}>
              <path d="m4.5 12.5 5 5 10-11" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 className="mt-8 font-display text-3xl leading-tight text-ink md:text-4xl">
            Thank you, {order.customer.name.split(' ')[0]}
          </h1>
          <p className="mt-4 leading-relaxed text-slate">
            Your pre-order for <strong className="font-medium text-ink">Built to Last</strong>{' '}
            has been received. A confirmation has been sent to{' '}
            <strong className="font-medium text-ink">{order.customer.email}</strong>.
          </p>

          <dl className="mt-10 space-y-3 text-left rounded-2xl bg-cream p-6 md:p-8">
            <Row label="Order number" value={order.reference} />
            <Row label="Book" value="Built to Last" />
            <Row label="Edition" value={order.edition} />
            <Row label="Quantity" value={`${order.quantity} copy${order.quantity > 1 ? 's' : ''}`} />
            <Row
              label="Total paid"
              value={`${order.currency} ${order.total.toLocaleString('en-NG')}`}
            />
            <Row label="Payment reference" value={order.paymentReference} />
            <Row label="Delivery to" value={deliveryNote} />
            <Row label="Order status" value="Successful" />
          </dl>

          <div className="mt-8 rounded-2xl border border-line p-6">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-mist">
              What happens next
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate">
              Your order is now being processed. You will receive delivery and shipping details
              by email once the book is ready to be dispatched at launch.
            </p>
          </div>

          <Button className="mt-10" variant="outline" onClick={onContinue}>
            Back to the site
          </Button>
        </div>
      </div>
    </main>
  )
}