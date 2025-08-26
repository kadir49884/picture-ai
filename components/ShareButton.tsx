'use client'

import { useState, useRef, useEffect } from 'react'
import { Share2, Copy, Twitter, MessageCircle, Mail, X, Check, Linkedin } from 'lucide-react'

interface ShareButtonProps {
  title?: string
  description?: string
  url?: string
  className?: string
}

export default function ShareButton({ 
  title = "Picture AI - AI ile Görsel Oluştur",
  description = "Hayal gücünüzü gerçeğe dönüştürün! Picture AI ile sadece birkaç kelime yazarak muhteşem görseller oluşturun.",
  url = "https://picture-ai-olive.vercel.app",
  className = ""
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState<'left' | 'right'>('right')
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Dropdown pozisyonunu hesapla
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const dropdownWidth = 288 // w-72 = 18rem = 288px
      
      // Mobilde (768px altı) her zaman sağdan hizala
      if (viewportWidth < 768) {
        setDropdownPosition('right')
        return
      }
      
      // Desktop'ta butonun sağında yeterli alan var mı?
      const spaceOnRight = viewportWidth - buttonRect.right
      
      if (spaceOnRight < dropdownWidth) {
        setDropdownPosition('left')
      } else {
        setDropdownPosition('right')
      }
    }
  }, [isOpen])

  const shareData = {
    title,
    text: description,
    url
  }

  // Native share API support check
  const canNativeShare = typeof navigator !== 'undefined' && navigator.share

  const handleNativeShare = async () => {
    if (canNativeShare) {
      try {
        await navigator.share(shareData)
        setIsOpen(false)
      } catch (error) {
        console.log('Share cancelled or failed:', error)
      }
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'hover:bg-blue-500',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'hover:bg-blue-600',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'hover:bg-green-500',
      url: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'hover:bg-gray-600',
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`
    }
  ]

  return (
    <div className={`relative ${className}`}>
      {/* Share Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
        aria-label="Paylaş"
      >
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">Paylaş</span>
      </button>

      {/* Share Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Share Dropdown */}
          <div 
            ref={dropdownRef}
            className={`absolute top-full mt-2 w-72 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 shadow-2xl z-50 max-h-96 overflow-y-auto ${
              dropdownPosition === 'left' ? 'right-0' : 'right-0 md:left-0'
            }`}
            style={{
              maxWidth: 'calc(100vw - 2rem)', // Viewport'tan taşmasın
              minWidth: '280px'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-sm">Paylaş</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
                aria-label="Kapat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Native Share (if supported) */}
            {canNativeShare && (
              <>
                <button
                  onClick={handleNativeShare}
                  className="w-full flex items-center gap-3 p-3 text-white hover:bg-white/10 rounded-lg transition-colors mb-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <Share2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm">Paylaş</span>
                </button>
                
                {/* Divider */}
                <div className="border-t border-white/20 my-3" />
              </>
            )}

            {/* Social Links */}
            <div className="space-y-2 mb-3">
              {shareLinks.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className={`w-full flex items-center gap-3 p-3 text-white hover:bg-white/10 rounded-lg transition-colors ${platform.color}`}
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <platform.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm">{platform.name}</span>
                </a>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-white/20 my-3" />

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-3 p-3 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </div>
              <span className="text-sm">
                {copied ? 'Kopyalandı!' : 'Linki Kopyala'}
              </span>
            </button>

            {/* URL Preview */}
            <div className="mt-3 p-2 bg-black/20 rounded-lg">
              <p className="text-xs text-gray-400 truncate">{url}</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}