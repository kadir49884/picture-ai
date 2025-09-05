import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Picture AI - Görsel Oluşturucu',
  description: 'AI ile hayal gücünüzü görselleştirin. Prompt yazın, muhteşem görseller oluşturun.',
  keywords: 'AI, görsel oluşturma, yapay zeka, resim, art, sanat',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-951509513"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-951509513');
              
              // Conversion tracking function
              function gtag_report_conversion(url) {
                var callback = function () {
                  if (typeof(url) != 'undefined') {
                    window.location = url;
                  }
                };
                gtag('event', 'conversion', {
                    'send_to': 'AW-951509513/H6PbCNXv5ZIbEInE28UD',
                    'event_callback': callback
                });
                return false;
              }
              
              // Global function for easy access
              window.gtag_report_conversion = gtag_report_conversion;
            `
          }}
        />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
              {children}
            </div>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}