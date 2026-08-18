const env = import.meta.env || {}

export const config = {
  site: {
    name: 'Built to Last',
    canonicalUrl: 'https://built-to-last.example.com',
    contactEmail: env.VITE_CONTACT_EMAIL || 'hello@built-to-last.example',
  },
  order: {
    bookTitle: 'Built to Last: Discovering God’s Pattern for Marriage That Endures',
    currency: env.VITE_CURRENCY || 'NGN',
    price: Number(env.VITE_BOOK_PRICE || 0),
    shippingCost: Number(env.VITE_SHIPPING_COST || 0),
    priceLabel: env.VITE_PRICE_LABEL || 'To be announced',
  },
  korapay: {
    publicKey: env.VITE_KORAPAY_PUBLIC_KEY || 'pk_test_placeholder',
    scriptUrl:
      'https://korablobstorage.blob.core.windows.net/modal-bucket/korapay-collections.min.js',
  },
  api: {
    baseUrl: env.VITE_API_BASE_URL || '',
    orderEndpoint: '/api/orders',
    verifyEndpoint: '/api/verify',
  },
  social: {
    facebook: env.VITE_SOCIAL_FACEBOOK || '',
    instagram: env.VITE_SOCIAL_INSTAGRAM || '',
    youtube: env.VITE_SOCIAL_YOUTUBE || '',
  },
}
