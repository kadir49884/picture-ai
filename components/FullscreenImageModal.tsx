'use client'

import { X } from 'lucide-react'
import Image from 'next/image'

interface FullscreenImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  prompt: string
}

export default function FullscreenImageModal({
  isOpen,
  onClose,
  imageUrl,
  prompt
}: FullscreenImageModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
        title="Kapat"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Image Container */}
      <div className="absolute inset-0 flex items-center justify-center px-4 py-12">
        <Image
          src={imageUrl}
          alt={prompt}
          width={1200}
          height={900}
          className="object-contain w-full h-full max-w-none max-h-none"
          sizes="100vw"
          priority
        />
      </div>

      {/* Background Click to Close */}
      <div 
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  )
}