const env = import.meta.env || {}

export const config = {
  site: {
    name: 'Built to Last',
    canonicalUrl: env.VITE_CANONICAL_URL || 'https://voiceoftruthonline.com',
    contactEmail: env.VITE_CONTACT_EMAIL || 'voiceoftruthonline@gmail.com',
  },
  order: {
    bookTitle: 'Built to Last: Discovering God’s Pattern for Marriage That Endures',
    currency: env.VITE_CURRENCY || 'NGN',
    regularPrice: 7000,
    price: Number(env.VITE_BOOK_PRICE || 6500),
    shippingCost: Number(env.VITE_SHIPPING_COST || 0),
    priceLabel: env.VITE_PRICE_LABEL || '₦6,500',
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
    facebook: env.VITE_SOCIAL_FACEBOOK || 'https://facebook.com/femi.bakare2',
    instagram: env.VITE_SOCIAL_INSTAGRAM || 'https://instagram.com/voiceoftruthonline',
    youtube: env.VITE_SOCIAL_YOUTUBE || 'https://youtube.com/@TheFemisola',
    whatsapp: env.VITE_SOCIAL_WHATSAPP || 'https://wa.me/2348184940002',
  },
}
