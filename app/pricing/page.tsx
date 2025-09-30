'use client'

import { ArrowLeft, Check, Sparkles, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { createLemonSqueezyCheckout, LEMONSQUEEZY_PRODUCTS } from '@/lib/lemonsqueezy'

export default function Pricing() {
  const pricingPlan = {
    name: "Pro Monthly",
    price: 0.99,
    priceId: LEMONSQUEEZY_PRODUCTS.PRO_MONTHLY, // LemonSqueezy product ID from environment
    period: "month",
    features: [
      "Unlimited AI image generations",
      "High-quality outputs",
      "Text-to-image & Image-to-image",
      "Download full resolution",
      "Priority support",
      "Commercial usage rights"
    ]
  }

  const handleLemonSqueezyCheckout = async () => {
    try {
      // Get user ID from session/localStorage
      const userId = localStorage.getItem('userId') || 'anonymous'
      
      // Create LemonSqueezy checkout
      const checkoutUrl = await createLemonSqueezyCheckout({
        productId: pricingPlan.priceId,
        userId: userId,
        planName: pricingPlan.name,
        successUrl: window.location.origin + '/success',
        cancelUrl: window.location.origin + '/pricing'
      })
      
      if (checkoutUrl) {
        // Redirect to LemonSqueezy checkout
        window.location.href = checkoutUrl
      } else {
        throw new Error('Failed to create checkout URL')
      }
    } catch (error) {
      console.error('LemonSqueezy checkout failed:', error)
      // Fallback for development
      if (confirm('LemonSqueezy checkout failed. Simulate successful payment for testing?')) {
        localStorage.setItem('subscription', JSON.stringify({
          active: true,
          plan: pricingPlan.name,
          purchaseDate: new Date().toISOString()
        }))
        window.location.href = '/success'
      }
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/"
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Pricing Plans</h1>
            <p className="text-gray-300 mt-2">Choose the perfect credit package for your needs</p>
          </div>
        </div>

        {/* Free Credits Info */}
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-lg rounded-2xl p-6 border border-green-500/20 mb-12">
          <div className="text-center">
            <Sparkles className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h2 className="text-2xl font-semibold text-white mb-2">Start Free!</h2>
            <p className="text-gray-300 mb-4">
              New users get <span className="text-green-400 font-semibold">3 free credits</span> to try Picture AI
            </p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              Try Free Now
            </Link>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="flex justify-center mb-12">
          <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-500 shadow-lg shadow-purple-500/20 max-w-md w-full">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                Pro Plan
              </span>
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-white mb-4">{pricingPlan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">${pricingPlan.price}</span>
                <span className="text-gray-400 ml-2">/ {pricingPlan.period}</span>
              </div>
              <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  <span className="text-xl font-semibold text-white">Unlimited Access</span>
                </div>
                <p className="text-gray-300 text-sm mb-2">
                  Generate as many images as you want
                </p>
                <p className="text-blue-200 text-xs">
                  Billing handled by LemonSqueezy • Taxes included where applicable
                </p>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {pricingPlan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-200 text-lg"
              onClick={() => {
                handleLemonSqueezyCheckout()
              }}
            >
              Subscribe to Pro
            </button>
            
            <p className="text-center text-gray-400 text-sm mt-4">
              Cancel anytime • No hidden fees • Monthly renewal
            </p>
            
            {/* Detailed Deliverables - Professional Table */}
            <div className="mt-6 bg-gradient-to-r from-white/10 to-white/5 rounded-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 p-4 border-b border-white/10">
                <h4 className="text-white font-semibold text-lg">📦 Complete Package Deliverables</h4>
                <p className="text-gray-300 text-sm mt-1">Everything included in your $0.99/month subscription</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Core Features */}
                  <div className="space-y-3">
                    <h5 className="text-purple-400 font-medium text-sm uppercase tracking-wide">Core Features</h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-white text-sm">Unlimited AI image generations</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-white text-sm">Text-to-image creation</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-white text-sm">Image-to-image editing</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-white text-sm">High-resolution downloads (1152×896)</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Premium Benefits */}
                  <div className="space-y-3">
                    <h5 className="text-cyan-400 font-medium text-sm uppercase tracking-wide">Premium Benefits</h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-white text-sm">Commercial usage rights</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-white text-sm">No watermarks</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-white text-sm">Priority customer support</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-white text-sm">Instant access activation</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Technical Specifications */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                  <h5 className="text-blue-400 font-medium mb-3">🔧 Technical Specifications</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-white font-medium">Resolution</div>
                      <div className="text-gray-300">1152×896px</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-medium">AI Models</div>
                      <div className="text-gray-300">Flux Pro + Nano-Banana</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-medium">Format</div>
                      <div className="text-gray-300">JPEG/PNG</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-medium">Usage</div>
                      <div className="text-gray-300">Commercial OK</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">How does the Pro subscription work?</h3>
              <p className="text-gray-300 text-sm mb-4">
                For just $0.99/month, you get unlimited AI image generations with no limits. 
                Perfect for regular users and professionals.
              </p>

              <h3 className="text-lg font-medium text-white mb-2">What if generation fails?</h3>
              <p className="text-gray-300 text-sm mb-4">
                If image generation fails due to technical issues, you can simply try again. 
                No limits means no worries about failed generations.
              </p>

              <h3 className="text-lg font-medium text-white mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-300 text-sm">
                Yes! You can cancel your subscription at any time. No long-term commitments 
                or cancellation fees. See our{' '}
                <Link href="/refund" className="text-purple-400 hover:text-purple-300">
                  Refund Policy
                </Link>{' '}
                for details.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-300 text-sm mb-4">
                We accept all major credit cards, PayPal, and other payment methods 
                through our secure LemonSqueezy payment system.
              </p>

              <h3 className="text-lg font-medium text-white mb-2">Is my payment information secure?</h3>
              <p className="text-gray-300 text-sm mb-4">
                Yes! We use LemonSqueezy for payment processing, which is PCI DSS compliant. 
                We never store your payment information on our servers.
              </p>

              <h3 className="text-lg font-medium text-white mb-2">Do I get free credits too?</h3>
              <p className="text-gray-300 text-sm">
                New users still get 3 free credits to try Picture AI before subscribing. 
                Once you subscribe, you get unlimited generations.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">What You Get</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">AI-Powered Generation</h3>
              <p className="text-gray-300 text-sm">
                Advanced AI models (Flux Pro & Nano-Banana) for high-quality image generation 
                and editing.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">High Resolution</h3>
              <p className="text-gray-300 text-sm">
                Generate and download images in full resolution, perfect for both personal 
                and commercial use.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Unlimited Access</h3>
              <p className="text-gray-300 text-sm">
                Generate as many images as you want with your Pro subscription. 
                No limits, no restrictions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
