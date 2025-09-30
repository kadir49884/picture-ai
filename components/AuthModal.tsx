'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, CreditCard } from 'lucide-react'
import { signIn } from 'next-auth/react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'login' | 'register'
  onSuccess: (user: any) => void
}

export default function AuthModal({ isOpen, onClose, mode, onSuccess }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  // Client-side mounting kontrolü
  useEffect(() => {
    setMounted(true)
  }, [])

  // Modal açıkken body scroll'unu engelle
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = '0px'
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = '0px'
    }
    
    // Cleanup
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = '0px'
    }
  }, [isOpen])

  if (!isOpen || !mounted) return null

  const handleGoogleAuth = async () => {
    setIsLoading(true)
    try {
      // Google Ads conversion tracking'i tetikle
      if (typeof window !== 'undefined' && window.gtag_report_conversion) {
        console.log(`${mode} için conversion tracking tetikleniyor`)
        window.gtag_report_conversion()
      }
      
      // Sonra Google auth'u başlat
      await signIn('google', { 
        callbackUrl: '/',
        redirect: true // Redirect'i true yap
      })
      
      onClose()
    } catch (error) {
      console.error('Google auth error:', error)
      setError('Google ile giriş başarısız')
    } finally {
      setIsLoading(false)
    }
  }

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]" 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div 
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20 relative"
        style={{
          margin: 'auto',
          transform: 'translateY(0)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CreditCard className="w-8 h-8 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">
              {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
            </h2>
          </div>
          <p className="text-gray-300">
            {mode === 'login' 
              ? 'Google hesabınızla giriş yapın' 
              : 'Google ile kayıt olun ve 3 ücretsiz kredi kazanın!'}
          </p>
        </div>

        {/* Google Auth Button */}
        <button
          onClick={handleGoogleAuth}
          disabled={isLoading}
          className="w-full py-4 bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
          ) : (
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          <span className="text-lg">Google ile {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}</span>
        </button>

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Benefits for register */}
        {mode === 'register' && (
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <h4 className="text-green-400 font-medium mb-2">🎁 Kayıt Avantajları:</h4>
            <ul className="text-green-300 text-sm space-y-1">
              <li>• 3 ücretsiz kredi</li>
              <li>• Görsel geçmişinizi saklayın</li>
              <li>• Kredi paketi indirimleri</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )

  // Portal ile modal'ı body'ye mount et
  return createPortal(modalContent, document.body)
}
