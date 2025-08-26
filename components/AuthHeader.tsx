'use client'

import { useState, useEffect } from 'react'
import { User, LogOut, CreditCard } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import AuthModal from './AuthModal'

interface AuthHeaderProps {
  userCredits?: number
}

export default function AuthHeader({ userCredits }: AuthHeaderProps) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<any>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [isLoading, setIsLoading] = useState(false)

  // Session değiştiğinde kullanıcı bilgilerini güncelle
  useEffect(() => {
    if (status !== 'loading') {
      if (session?.user) {
        console.log('Session user found:', session.user)
        fetchUserData()
      } else {
        setUser(null)
      }
    }
  }, [session, status])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        console.log('Google auth user data:', data.user)
      } else {
        console.log('Auth me failed, response:', response.status)
        setUser(null)
      }
    } catch (error) {
      console.error('Fetch user data error:', error)
      setUser(null)
    }
  }

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      // Google OAuth çıkışı
      await signOut({ callbackUrl: '/', redirect: false })
      setUser(null)
    } catch (error) {
      console.error('Sign-out error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center gap-3">
        <div className="animate-pulse bg-white/20 rounded-lg w-20 h-9"></div>
        <div className="animate-pulse bg-white/20 rounded-lg w-20 h-9"></div>
      </div>
    )
  }

  // Authenticated user - Google OAuth session data
  const currentUser = user || session?.user
  if (currentUser) {
    return (
      <div className="flex items-center gap-4">
        {/* Credit Display */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg px-3 py-2 border border-white/20 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-yellow-400" />
          <span className="text-white font-semibold text-sm">
            {userCredits !== undefined ? userCredits : (user?.credits || currentUser?.credits || 3)}
          </span>
          <span className="text-gray-300 text-xs">kredi</span>
        </div>
        
        {/* User Menu */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg px-3 py-2 border border-white/20 flex items-center gap-3">
          {/* Profile Image */}
          {session?.user?.image ? (
            <img 
              src={session.user.image} 
              alt={session.user.name || ''} 
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <User className="w-4 h-4 text-purple-400" />
          )}
          
          {/* User Info */}
          <div className="hidden md:flex flex-col">
            <span className="text-white text-sm font-medium leading-tight">
              {currentUser?.name || user?.email?.split('@')[0] || 'Kullanıcı'}
            </span>
            <span className="text-gray-400 text-xs leading-tight">
              {currentUser?.email || user?.email}
            </span>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50 p-1"
            title="Çıkış Yap"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  // Not authenticated
  return (
    <>
      <div className="flex items-center gap-3">
        {/* Login Button */}
        <button
          onClick={() => openAuthModal('login')}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-white/20 text-sm"
        >
          Giriş Yap
        </button>
        
        {/* Register Button */}
        <button
          onClick={() => openAuthModal('register')}
          className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm shadow-lg"
        >
          Kayıt Ol
        </button>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSuccess={(userData) => {
          setUser(userData)
          setShowAuthModal(false)
        }}
      />
    </>
  )
}
