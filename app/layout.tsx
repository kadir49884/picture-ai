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