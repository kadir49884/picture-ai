'use client'

import { ErrorBoundary } from './ErrorBoundary'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface ImageGenerationErrorProps {
  onRetry: () => void
}

function ImageGenerationError({ onRetry }: ImageGenerationErrorProps) {
  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
      <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">
        Görsel Oluşturma Hatası
      </h3>
      <p className="text-gray-300 mb-4">
        Görsel oluştururken bir hata oluştu. Lütfen tekrar deneyin.
      </p>
      <button
        onClick={onRetry}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Tekrar Dene
      </button>
    </div>
  )
}

interface Props {
  children: React.ReactNode
  onRetry: () => void
}

export function ImageGenerationErrorBoundary({ children, onRetry }: Props) {
  return (
    <ErrorBoundary
      fallback={<ImageGenerationError onRetry={onRetry} />}
      onError={(error, errorInfo) => {
        console.error('Image generation error:', error, errorInfo)
        // Log to monitoring service if available
      }}
    >
      {children}
    </ErrorBoundary>
  )
}