'use client'

import { ArrowLeft, Check, Sparkles, CreditCard } from 'lucide-react'
import Link from 'next/link'

export default function Pricing() {
  const pricingPlans = [
    {
      name: "Starter",
      credits: 10,
      price: 5,
      priceId: "starter_pack",
      popular: false,
      features: [
        "10 AI image generations",
        "High-quality outputs",
        "Text-to-image & Image-to-image",
        "Download full resolution",
        "No expiration"
      ]
    },
    {
      name: "Popular",
      credits: 25,
      price: 10,
      priceId: "popular_pack",
      popular: true,
      features: [
        "25 AI image generations",
        "High-quality outputs",
        "Text-to-image & Image-to-image",
        "Download full resolution",
        "No expiration",
        "Best value for money"
      ]
    },
    {
      name: "Pro",
      credits: 50,
      price: 18,
      priceId: "pro_pack",
      popular: false,
      features: [
        "50 AI image generations",
        "High-quality outputs",
        "Text-to-image & Image-to-image",
        "Download full resolution",
        "No expiration",
        "Perfect for professionals"
      ]
    },
    {
      name: "Ultimate",
      credits: 100,
      price: 30,
      priceId: "ultimate_pack",
      popular: false,
      features: [
        "100 AI image generations",
        "High-quality outputs",
        "Text-to-image & Image-to-image",
        "Download full resolution",
        "No expiration",
        "Maximum value"
      ]
    }
  ]

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

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border transition-all duration-200 hover:scale-105 ${
                plan.popular 
                  ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
                  : 'border-white/20 hover:border-purple-400/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400 ml-1">USD</span>
                </div>
                <div className="bg-white/10 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-center gap-2">
                    <CreditCard className="w-5 h-5 text-purple-400" />
                    <span className="text-lg font-semibold text-white">{plan.credits} Credits</span>
                  </div>
                  <p className="text-gray-300 text-sm mt-1">
                    ${(plan.price / plan.credits).toFixed(2)} per image
                  </p>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
                onClick={() => {
                  // TODO: Implement Paddle checkout
                  console.log(`Purchase ${plan.name} package`)
                }}
              >
                Buy {plan.name}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">How do credits work?</h3>
              <p className="text-gray-300 text-sm mb-4">
                Each image generation (text-to-image or image-to-image) consumes 1 credit. 
                Credits never expire and remain in your account until used.
              </p>

              <h3 className="text-lg font-medium text-white mb-2">What if generation fails?</h3>
              <p className="text-gray-300 text-sm mb-4">
                If image generation fails due to technical issues, your credit will be 
                automatically refunded to your account.
              </p>

              <h3 className="text-lg font-medium text-white mb-2">Can I get a refund?</h3>
              <p className="text-gray-300 text-sm">
                Credits are digital products and generally non-refundable. However, we offer 
                refunds for technical issues. See our{' '}
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
                through our secure Paddle payment system.
              </p>

              <h3 className="text-lg font-medium text-white mb-2">Is my payment information secure?</h3>
              <p className="text-gray-300 text-sm mb-4">
                Yes! We use Paddle for payment processing, which is PCI DSS compliant. 
                We never store your payment information on our servers.
              </p>

              <h3 className="text-lg font-medium text-white mb-2">Can I buy more credits anytime?</h3>
              <p className="text-gray-300 text-sm">
                Absolutely! You can purchase additional credit packages at any time. 
                Credits are added to your existing balance.
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
              <h3 className="text-lg font-medium text-white mb-2">No Expiration</h3>
              <p className="text-gray-300 text-sm">
                Your credits never expire. Use them at your own pace, whenever inspiration 
                strikes.
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
