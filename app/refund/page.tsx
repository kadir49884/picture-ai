'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function RefundPolicy() {
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
          <h1 className="text-3xl font-bold text-white">Refund Policy</h1>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
          <div className="prose prose-invert max-w-none">
            
            <div className="mb-8">
              <p className="text-gray-300 text-sm mb-6">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US')}
              </p>
              <p className="text-gray-300 mb-4">
                At Picture AI, we want to clearly and transparently state our refund policy 
                regarding digital credit packages.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">1. General Refund Policy</h2>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
                <p className="text-blue-200 font-medium">
                  📋 Digital Content Notice: Our subscription service provides digital content that is supplied immediately upon purchase. 
                  By purchasing, you consent to immediate supply and acknowledge that you lose the statutory withdrawal right, 
                  except where required by applicable law.
                </p>
              </div>
              <p className="text-gray-300 mb-4">
                As our service provides unlimited access to AI image generation (digital content) that begins immediately 
                after subscription activation, standard withdrawal rights do not apply. However, we provide refunds in 
                specific circumstances outlined below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">2. Exception Cases</h2>
              <p className="text-gray-300 mb-4">
                You can contact our support team if you encounter the following situations:
              </p>
              
              <h3 className="text-xl font-medium text-white mb-3">Technical Issues</h3>
              <ul className="text-gray-300 space-y-2 list-disc list-inside mb-4">
                <li>Payment was completed but subscription was not activated</li>
                <li>Service unavailable due to system error</li>
                <li>Double payment/billing error</li>
                <li>Subscription not working due to technical failure</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3">Fraud</h3>
              <ul className="text-gray-300 space-y-2 list-disc list-inside mb-4">
                <li>Unauthorized access to your account</li>
                <li>Misuse of your credit card</li>
                <li>Receiving fake payment notifications</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3">Accidental Purchase</h3>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>Accidentally purchasing multiple packages (within 24 hours)</li>
                <li>Unauthorized purchase by children (with parental consent)</li>
                <li>Errors in Paddle payment system</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">3. Refund Request Process</h2>
              <p className="text-gray-300 mb-4">
                If you are experiencing one of the exception cases, follow these steps:
              </p>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 mb-4">
                <h4 className="text-blue-200 font-medium mb-3">📞 Contact Information</h4>
                <ul className="text-blue-200 space-y-2">
                  <li>• Website: https://picture-ai-olive.vercel.app</li>
                  <li>• GitHub Issues: https://github.com/kadir49884/picture-ai/issues</li>
                  <li>• Response time: Within 24-48 hours</li>
                </ul>
              </div>

              <h3 className="text-xl font-medium text-white mb-3">Required Information</h3>
              <ul className="text-gray-300 space-y-2 list-disc list-inside mb-4">
                <li>Your account email address</li>
                <li>Purchase date and time</li>
                <li>Paddle transaction ID (if available)</li>
                <li>Detailed description of the problem experienced</li>
                <li>Screenshots (if available)</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3">Evaluation Process</h3>
              <ol className="text-gray-300 space-y-2 list-decimal list-inside">
                <li>We receive and start reviewing your request within 24 hours</li>
                <li>We check technical logs and payment records</li>
                <li>We coordinate with Paddle when necessary</li>
                <li>We inform you about the result within 48-72 hours</li>
                <li>Approved refunds return to your account within 5-10 business days</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">4. Refund Methods</h2>
              <p className="text-gray-300 mb-4">
                Approved refunds are processed through the following methods:
              </p>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li><strong>Credit Card Refund:</strong> Returns to your original payment method</li>
                <li><strong>Account Credit:</strong> May be given as extra credit depending on the situation</li>
                <li><strong>Paddle Refund:</strong> Processed through Paddle payment system</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">5. Non-Refundable Situations</h2>
              <p className="text-gray-300 mb-4">
                The following situations are definitely not covered by refunds:
              </p>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>Being unsatisfied after using credits</li>
                <li>Being unsatisfied with the quality of generated images</li>
                <li>Preferring a different AI model</li>
                <li>Deciding to close account</li>
                <li>Credit package price decreasing</li>
                <li>Missing promotional campaigns</li>
                <li>Account closure due to terms of service violations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">6. Chargeback and Disputes</h2>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
                <p className="text-yellow-200">
                  ⚠️ Please contact us before initiating a banking chargeback process.
                </p>
              </div>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>Your account may be temporarily suspended in case of chargeback</li>
                <li>Please try to find a solution with our support team first</li>
                <li>Official dispute process is available through Paddle payment system</li>
                <li>We reserve the right to initiate legal action in case of unjust chargeback</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">7. Credit Package Information</h2>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                <h4 className="text-green-200 font-medium mb-2">💡 Pre-Purchase Information</h4>
                <ul className="text-green-200 space-y-1 text-sm">
                  <li>• Credits remain in your account indefinitely</li>
                  <li>• Each image generation consumes 1 credit</li>
                  <li>• New users receive 3 free credits</li>
                  <li>• Credits are refunded in case of failed image generation</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">8. Customer Satisfaction</h2>
              <p className="text-gray-300 mb-4">
                Although our refund policy is strict, customer satisfaction is important to us:
              </p>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>We focus on quickly resolving technical issues</li>
                <li>We continuously make platform improvements</li>
                <li>We take user feedback into consideration</li>
                <li>We strive to provide fair and transparent service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">9. Legal Rights</h2>
              <p className="text-gray-300 mb-4">
                This refund policy has been prepared within the framework of applicable 
                consumer protection laws. Your legal rights are reserved.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">10. Policy Updates</h2>
              <p className="text-gray-300 mb-4">
                This refund policy may be updated from time to time. Changes will be announced 
                on the website and the effective date will be specified.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">11. Contact</h2>
              <p className="text-gray-300 mb-4">
                You can contact us for refund requests or questions:
              </p>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <ul className="text-purple-200 space-y-2">
                  <li>🌐 Website: https://picture-ai-olive.vercel.app</li>
                  <li>📧 GitHub: https://github.com/kadir49884/picture-ai</li>
                  <li>⏰ Response Time: 24-48 hours</li>
                  <li>🕐 Working Hours: 24/7 (Automated system)</li>
                </ul>
              </div>
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