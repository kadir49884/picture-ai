'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, CheckCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function Success() {
  const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null)
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    // Get subscription info from localStorage
    const subscription = localStorage.getItem('subscription')
    const storedUserId = localStorage.getItem('userId') || 'Anonymous User'
    
    if (subscription) {
      setSubscriptionInfo(JSON.parse(subscription))
    }
    setUserId(storedUserId)

    // Clean up temporary data (optional)
    // localStorage.removeItem('subscription')
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="container max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/"
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-3xl font-bold text-white">Payment Successful</h1>
        </div>

        {/* Success Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center">
          
          {/* Success Icon */}
          <div className="mb-8">
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-white mb-2">Thank You!</h2>
            <p className="text-xl text-gray-300">
              Your subscription has been activated successfully
            </p>
          </div>

          {/* Subscription Details */}
          {subscriptionInfo && (
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-lg rounded-2xl p-6 border border-green-500/20 mb-8">
              <h3 className="text-2xl font-semibold text-white mb-4">Subscription Details</h3>
              
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Plan</h4>
                  <p className="text-green-400 text-lg font-semibold">
                    {subscriptionInfo.plan}
                  </p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Status</h4>
                  <p className="text-green-400 text-lg font-semibold">
                    {subscriptionInfo.active ? 'Active' : 'Inactive'}
                  </p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">User ID</h4>
                  <p className="text-gray-300">{userId}</p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Purchase Date</h4>
                  <p className="text-gray-300">
                    {subscriptionInfo.purchaseDate 
                      ? new Date(subscriptionInfo.purchaseDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* What's Next */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">What's Next?</h3>
            
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h4 className="text-white font-medium mb-1">Unlimited Access</h4>
                <p className="text-gray-300 text-sm">
                  Generate as many AI images as you want
                </p>
              </div>
              
              <div>
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h4 className="text-white font-medium mb-1">High Quality</h4>
                <p className="text-gray-300 text-sm">
                  Professional-grade AI image generation
                </p>
              </div>
              
              <div>
                <ArrowLeft className="w-8 h-8 text-blue-400 mx-auto mb-2 transform rotate-180" />
                <h4 className="text-white font-medium mb-1">Priority Support</h4>
                <p className="text-gray-300 text-sm">
                  Get help when you need it
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              Start Creating Images
            </Link>
            
            <Link 
              href="/pricing"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-white/20"
            >
              View Pricing Details
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-200 text-sm">
              <strong>Need help?</strong> Contact our support team through{' '}
              <a 
                href="https://github.com/kadir49884/picture-ai/issues" 
                className="text-blue-400 hover:text-blue-300 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Issues
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
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
