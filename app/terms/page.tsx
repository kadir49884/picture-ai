'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function TermsOfService() {
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
          <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
          <div className="prose prose-invert max-w-none">
            
            {/* Service Provider Statement - Top Priority */}
            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border-2 border-green-500/40 rounded-xl p-6 mb-8">
              <h2 className="text-white font-bold text-xl mb-3 flex items-center gap-2">
                ⚖️ Service Provider
              </h2>
              <p className="text-white text-lg leading-relaxed">
                This service is provided by <strong>Kadir Çelik</strong> (sole proprietor), trading as <strong>"Picture AI"</strong>.
              </p>
            </div>
            
            <div className="mb-8">
              <p className="text-gray-300 text-sm mb-6">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US')}
              </p>
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-2 border-blue-500/40 rounded-xl p-6 mb-8">
                <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                  🏢 Legal Information
                </h3>
                <div className="space-y-3">
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-blue-200 font-medium mb-1">Service Provider:</p>
                    <p className="text-white text-lg">
                      This service is provided by <strong>Kadir Çelik</strong> (sole proprietor), trading as <strong>"Picture AI"</strong>.
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-purple-200 font-medium mb-1">Merchant of Record:</p>
                    <p className="text-white text-lg">
                      <strong>Paddle.com Market Ltd</strong> is the Merchant of Record for all orders; Paddle handles billing, tax and receipts.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">1. Service Description</h2>
              <p className="text-gray-300 mb-4">
                Picture AI is a web application that uses artificial intelligence technology to generate 
                images from text descriptions and edit existing images. Our service is powered by 
                FAL AI Flux Pro and Nano-Banana/Edit models.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">2. User Accounts</h2>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>You must sign in with your Google account to use our service</li>
                <li>You are responsible for the accuracy and security of your account information</li>
                <li>One person may only create one account</li>
                <li>You may not share your account with others</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">3. Credit System and Payments</h2>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>New users start with 3 free credits</li>
                <li>Each image generation consumes 1 credit</li>
                <li>Credit packages can be purchased through the Paddle payment system</li>
                <li>Credits are non-refundable but remain in your account indefinitely</li>
                <li>Payments are processed securely and we do not store personal payment information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">4. Acceptable Use</h2>
              <p className="text-gray-300 mb-4">When using our service, you must comply with the following rules:</p>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>You may not create illegal, harmful, threatening, harassing content</li>
                <li>You may not create content that infringes copyright</li>
                <li>You may not create pornographic, violent or hate speech content</li>
                <li>You may not create content that impersonates others</li>
                <li>You may not abuse our service with automated tools</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">5. Intellectual Property Rights</h2>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>Commercial rights to images you create belong to you</li>
                <li>The Picture AI platform itself is our intellectual property</li>
                <li>You may not copy our service through reverse engineering</li>
                <li>Legal responsibility for generated content belongs to the user</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">6. Privacy and Data Security</h2>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>Your personal data is processed under our Privacy Policy</li>
                <li>Images you create are temporarily stored on our servers</li>
                <li>Your account information is protected with encryption</li>
                <li>We do not share your data with third parties</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">7. Service Limitations</h2>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>The service does not guarantee 100% uptime</li>
                <li>Temporary interruptions may occur during technical maintenance and updates</li>
                <li>Image generation times may vary</li>
                <li>Your account may be temporarily restricted in case of excessive use</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">8. Refund Policy</h2>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>Credit packages cannot be refunded as they are digital products</li>
                <li>If you experience credit loss due to technical issues, contact our support team</li>
                <li>If fraud is detected, the account will be closed and no refund will be made</li>
                <li>For erroneous payments, contact support within 14 days</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">9. Account Termination</h2>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>You can close your account at any time</li>
                <li>We reserve the right to close your account in case of rule violations</li>
                <li>Remaining credits are not refunded when account is closed</li>
                <li>Your personal data is deleted after account closure</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">10. Disclaimer</h2>
              <p className="text-gray-300 mb-4">
                Picture AI is not responsible for direct or indirect damages that may arise from 
                the use of the service. The service is provided "as is" and no warranty is given.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">11. Changes</h2>
              <p className="text-gray-300 mb-4">
                These terms of service may be updated from time to time. Users will be notified 
                when there are significant changes. Continuing to use the service after updates 
                means you accept the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">12. Contact</h2>
              <p className="text-gray-300 mb-4">
                If you have questions about these terms of service, you can contact us:
              </p>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>Website: https://picture-ai-olive.vercel.app</li>
                <li>GitHub: https://github.com/kadir49884/picture-ai</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">13. Governing Law</h2>
              <p className="text-gray-300">
                These terms of service are subject to the laws of the Republic of Turkey. 
                Any disputes that may arise will be resolved in Turkish courts.
              </p>
            </section>

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