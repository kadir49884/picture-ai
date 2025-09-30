'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPolicy() {
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
          <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
          <div className="prose prose-invert max-w-none">
            
            <div className="mb-8">
              <p className="text-gray-300 text-sm mb-6">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US')}
              </p>
              <p className="text-gray-300 mb-4">
                At Picture AI, we are committed to protecting the privacy of our users. 
                This privacy policy explains how we collect, use, and protect your personal data.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-white mb-3">Personal Information</h3>
              <ul className="text-gray-300 space-y-2 list-disc list-inside mb-4">
                <li>From your Google account: Name, email address, profile photo</li>
                <li>Account creation date</li>
                <li>Credit balance and purchase history</li>
                <li>Number of images generated</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3">Usage Data</h3>
              <ul className="text-gray-300 space-y-2 list-disc list-inside mb-4">
                <li>Text prompts entered</li>
                <li>Images uploaded (temporarily)</li>
                <li>Images generated (temporarily)</li>
                <li>Service usage statistics</li>
                <li>Error logs and performance data</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3">Technical Information</h3>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Device information</li>
                <li>Cookies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">2. Purpose of Information Use</h2>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li><strong>Service Provision:</strong> To provide AI image generation services</li>
                <li><strong>Account Management:</strong> To manage user accounts and authentication</li>
                <li><strong>Payment Processing:</strong> To process credit purchases</li>
                <li><strong>Customer Support:</strong> To provide technical support and answer user questions</li>
                <li><strong>Service Improvement:</strong> To enhance platform performance</li>
                <li><strong>Security:</strong> To prevent fraud and abuse</li>
                <li><strong>Legal Obligations:</strong> To fulfill legal requirements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">3. Information Sharing</h2>
              <p className="text-gray-300 mb-4">
                We do not share your personal data with third parties except in the following situations:
              </p>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li><strong>Service Providers:</strong> FAL AI (image generation), LemonSqueezy (payments)</li>
                <li><strong>Legal Obligation:</strong> Court order or legal request</li>
                <li><strong>Security:</strong> Fraud detection and prevention</li>
                <li><strong>User Consent:</strong> When you have given explicit consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">4. Data Retention</h2>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li><strong>Account Information:</strong> Stored while account is active</li>
                <li><strong>Generated Images:</strong> Temporarily stored for 24 hours</li>
                <li><strong>Uploaded Images:</strong> Deleted after processing is complete</li>
                <li><strong>Payment Information:</strong> Securely processed by LemonSqueezy</li>
                <li><strong>Log Data:</strong> Stored for maximum 90 days</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">5. Data Security</h2>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>Data transmission is protected using HTTPS encryption</li>
                <li>Data is securely stored with database encryption</li>
                <li>Regular security updates are performed</li>
                <li>Access logs are maintained and monitored</li>
                <li>Security vulnerabilities are proactively scanned</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies</h2>
              <p className="text-gray-300 mb-4">
                We use the following cookies to improve our service:
              </p>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li><strong>Essential Cookies:</strong> Session management and security</li>
                <li><strong>Analytics Cookies:</strong> Usage analysis with Google Analytics</li>
                <li><strong>Functional Cookies:</strong> Remembering user preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">7. Your Rights (GDPR/KVKK)</h2>
              <p className="text-gray-300 mb-4">
                Under data protection laws, you have the following rights:
              </p>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>Right to know if your personal data is being processed</li>
                <li>Right to request information about processed personal data</li>
                <li>Right to know the purpose of processing and whether it is used appropriately</li>
                <li>Right to know third parties to whom data is transferred domestically or internationally</li>
                <li>Right to request correction if processed incompletely or incorrectly</li>
                <li>Right to request deletion or destruction</li>
                <li>Right to request notification of correction, deletion and destruction to third parties</li>
                <li>Right to object to analysis solely by automated systems resulting in adverse consequences</li>
                <li>Right to claim compensation for damages caused by unlawful processing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">8. Third-Party Services</h2>
              
              <h3 className="text-xl font-medium text-white mb-3">Google OAuth</h3>
              <p className="text-gray-300 mb-4">
                We use Google OAuth for authentication. Google's privacy policy: 
                <a href="https://policies.google.com/privacy" className="text-purple-400 hover:text-purple-300" target="_blank" rel="noopener noreferrer">
                  https://policies.google.com/privacy
                </a>
              </p>

              <h3 className="text-xl font-medium text-white mb-3">FAL AI</h3>
              <p className="text-gray-300 mb-4">
                We use FAL AI service for image generation. Your prompts and images are processed temporarily.
              </p>

              <h3 className="text-xl font-medium text-white mb-3">LemonSqueezy</h3>
              <p className="text-gray-300 mb-4">
                We use LemonSqueezy for payment processing. Your payment information is processed directly by LemonSqueezy.
              </p>

              <h3 className="text-xl font-medium text-white mb-3">Vercel</h3>
              <p className="text-gray-300 mb-4">
                We use Vercel for hosting. Technical logs are kept on Vercel servers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">9. Children's Privacy</h2>
              <p className="text-gray-300 mb-4">
                Our service is not intended for children under 13. We do not knowingly collect 
                personal data from children under 13. If we discover that a child under 13 has 
                provided data, we immediately delete this data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">10. International Data Transfer</h2>
              <p className="text-gray-300 mb-4">
                Your data may be processed on servers located in the following countries:
              </p>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>United States (Vercel, Google, FAL AI)</li>
                <li>United States (LemonSqueezy)</li>
              </ul>
              <p className="text-gray-300 mt-4">
                All data transfers are carried out with appropriate security measures.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">11. Policy Updates</h2>
              <p className="text-gray-300 mb-4">
                This privacy policy may be updated from time to time. When there are significant 
                changes, users will be notified via email or through the platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">12. Contact</h2>
              <p className="text-gray-300 mb-4">
                If you have questions about this privacy policy or want to exercise your data rights, 
                you can contact us:
              </p>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>Website: https://picture-ai-olive.vercel.app</li>
                <li>GitHub: https://github.com/kadir49884/picture-ai</li>
              </ul>
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