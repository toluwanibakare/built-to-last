import { config } from '../config'
import { makeReference } from './korapay'

function apiUrl(path) {
  if (!config.api.baseUrl) return null
  const base = config.api.baseUrl.replace(/\/$/, '')
  return `${base}${path}`
}

export async function createOrder(payload) {
  const url = apiUrl(config.api.orderEndpoint)
  if (!url) {
    return { ok: true, local: true }
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Could not create your order')
  return { ok: true, data: await res.json(), local: false }
}

export async function verifyPayment({ reference, orderId }) {
  const url = apiUrl(config.api.verifyEndpoint)
  if (!url) {
    return { ok: true, verified: true, local: true }
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reference, orderId }),
  })
  if (!res.ok) throw new Error('Could not verify your payment')
  return { ok: true, verified: true, local: false, data: await res.json() }
}

export function buildOrder({ customer, quantity }) {
  const now = new Date()
  const reference = makeReference()
  const unitPrice = config.order.price
  const shipping = config.order.shippingCost
  const total = unitPrice * quantity + shipping

  return {
    id: reference,
    reference,
    customer,
    quantity,
    unitPrice,
    shipping,
    total,
    currency: config.order.currency,
    paymentStatus: 'pending',
    status: 'pending',
    createdAt: now.toISOString(),
  }
}
