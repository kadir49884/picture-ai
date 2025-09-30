import { lemonSqueezySetup, createCheckout, getSubscription } from '@lemonsqueezy/lemonsqueezy.js'

// LemonSqueezy configuration
const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NGQ1OWNlZi1kYmI4LTRlYTUtYjE3OC1kMjU0MGZjZDY5MTkiLCJqdGkiOiI5Yzc3MmUyN2YwOTY0OTJmZmVmZDM1YmUzOWMwMTAyMmQ0ZGY3MDZmOTE2OWM2NGRlYTYzODM3NWZkMTk3NTU0N2FmY2JkOGUyZDVjMDVmZSIsImlhdCI6MTc1OTIzNDY2MS42Mzk0NDUsIm5iZiI6MTc1OTIzNDY2MS42Mzk0NDcsImV4cCI6MjA3NDc2NzQ2MS42MjUzNDcsInN1YiI6IjU2MTAzNTIiLCJzY29wZXMiOltdfQ.QkB0w9sEn6lNoyjigYQXRT7JNZUCY0n2lxEEgLIi0x1q0LVHeVngwvWmkLMW6N9XSLiRRVFU_oWtTlTGyHa0TCgsQatdFQ1YWThw7jq-b0EQGtpjH-so7NCW4y2uIfry4gVRe6T2aLeTitSPj5MMc5dPzPDZkmLbZaY1PD3lGNDGz51wfd4T0MRmy4GOPK6M44QlYBsLjCHAlYavijjmdSOlqUen-8G0TkkMID4YFGuULu46gRQn-xhKdaiN28awewrHcGKdYbMkF_HNRQIl-Gz9_4DWurOEVceByaABDY9pUXonvcicxtF339EPsnQHYr2Kn8uPNTIQ2kI4L85vbb7xZKoukf6NcFM1Ubcbe_E1PieRjLXV5qfakHtjyP9KwDQLXXFe0qc53GjLkJNB0y1RG5hquoOMmhRF5brCRHlqasY1_f5uuTmjPA7ZIr4-runxODb00eoWvB7RwFXkd7qzWDH-6lZgev5pmZumkCUhaqR7go04ObuWZzMTOShS5R7h3xuN4I7jD9Yziye04zAxNlKGp_0WJm7td1FMew7neEHyrELeYmoPjcEdUVRtFkv_tWV1adNMvDRMMOV_YlJ8wnPR5TCEft0LSYmopGovw5qryrcA2qeleQGTA3FkZGvVlWb7HiMG6nbjy8jmXHT0HzBXrg5i5p0tuS0HqCY'
const LEMONSQUEEZY_STORE_ID = process.env.LEMONSQUEEZY_STORE_ID || '226330'

// Initialize LemonSqueezy
lemonSqueezySetup({
  apiKey: LEMONSQUEEZY_API_KEY,
})

export interface CheckoutOptions {
  productId: string
  userId: string
  planName: string
  successUrl?: string
  cancelUrl?: string
}

export async function createLemonSqueezyCheckout(options: CheckoutOptions) {
  try {
    const checkout = await createCheckout(LEMONSQUEEZY_STORE_ID, options.productId, {
      checkoutOptions: {
        embed: false,
        media: false,
        logo: true,
      },
      checkoutData: {
        email: '', // Will be filled by user
        name: '', // Will be filled by user
        custom: {
          userId: options.userId,
          planName: options.planName,
        },
      },
      productOptions: {
        enabledVariants: [], // Use default variants
        redirectUrl: options.successUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/success`,
        receiptButtonText: 'Go to Dashboard',
        receiptThankYouNote: 'Thank you for your purchase!',
      },
    })

    return checkout.data?.data.attributes.url
  } catch (error) {
    console.error('LemonSqueezy checkout creation failed:', error)
    throw error
  }
}

export async function getLemonSqueezySubscription(subscriptionId: string) {
  try {
    const subscription = await getSubscription(subscriptionId)
    return subscription.data
  } catch (error) {
    console.error('Failed to get LemonSqueezy subscription:', error)
    throw error
  }
}

export function formatLemonSqueezyPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price / 100) // LemonSqueezy prices are in cents
}

// LemonSqueezy product IDs - IMPORTANT: Replace with actual product IDs from your LemonSqueezy dashboard
export const LEMONSQUEEZY_PRODUCTS = {
  PRO_MONTHLY: process.env.LEMONSQUEEZY_PRODUCT_ID || 'prod_01234567890', // Replace with actual product ID
  PRO_YEARLY: process.env.LEMONSQUEEZY_YEARLY_PRODUCT_ID || 'prod_01234567891', // Replace with actual product ID
}

export default {
  createCheckout: createLemonSqueezyCheckout,
  getSubscription: getLemonSqueezySubscription,
  formatPrice: formatLemonSqueezyPrice,
  PRODUCTS: LEMONSQUEEZY_PRODUCTS,
}
