import { config } from '../config'
import { makeReference } from './korapay'

function apiUrl(path) {
  if (!config.api.baseUrl) return null
  const base = config.api.baseUrl.replace(/\/$/, '')
  return `${base}${path}`
}

import { supabase } from './supabase'

export async function createOrder(payload) {
  const { error } = await supabase.from('preorders').insert([{
    reference: payload.reference,
    name: payload.customer.name,
    email: payload.customer.email,
    whatsapp: payload.customer.phone,
    country: payload.customer.country,
    state: payload.customer.state,
    address: payload.customer.address,
    quantity: payload.quantity,
    edition: payload.edition,
    total: payload.amount,
    currency: payload.currency,
    payment_status: 'pending',
    status: 'pending'
  }])

  if (error) {
    console.error('Error creating order:', error)
    throw new Error('Could not create your order')
  }

  return { ok: true }
}

export async function verifyPayment({ reference, orderId }) {
  // In a real app, you would verify with Korapay backend here.
  // For now, we update the status in Supabase directly assuming it was paid successfully (since it's a client side callback).
  const { error } = await supabase
    .from('preorders')
    .update({ 
      payment_status: 'paid', 
      status: 'successful', 
      payment_reference: reference 
    })
    .eq('reference', orderId)

  if (error) {
    console.error('Error verifying order:', error)
    throw new Error('Could not verify your payment')
  }

  return { ok: true, verified: true, local: false, data: {} }
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
