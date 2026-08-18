import { config } from '../config'

let scriptPromise = null

function loadScript(url) {
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${url}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Failed to load payment script')))
      return
    }
    const script = document.createElement('script')
    script.src = url
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      scriptPromise = null
      reject(new Error('Failed to load payment script'))
    }
    document.body.appendChild(script)
  })

  return scriptPromise
}

export function makeReference() {
  return `BTL-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export async function initializeCheckout({ reference, amount, currency, customer, metadata, narration, onSuccess, onFailed, onClose, onPending }) {
  const script = await loadScript(config.korapay.scriptUrl)

  if (!script || !window.Korapay || typeof window.Korapay.initialize !== 'function') {
    throw new Error('Payment gateway is unavailable')
  }

  const options = {
    key: config.korapay.publicKey,
    reference,
    amount: Math.round(amount),
    currency,
    customer: {
      name: customer.name,
      email: customer.email,
    },
    narration,
    onSuccess: (data) => onSuccess?.(data),
    onFailed: (data) => onFailed?.(data),
    onClose: () => onClose?.(),
    onPending: () => onPending?.(),
  }

  if (metadata) {
    options.metadata = Object.fromEntries(
      Object.entries(metadata).slice(0, 5).map(([k, v]) => [k, String(v)]),
    )
  }

  window.Korapay.initialize(options)
}

export function closeCheckout() {
  if (window.Korapay && typeof window.Korapay.close === 'function') {
    window.Korapay.close()
  }
}
