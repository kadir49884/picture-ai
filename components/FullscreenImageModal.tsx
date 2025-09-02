'use client'

import { useState } from 'react'
import { X, Download, ZoomIn, ZoomOut, RotateCcw, Info } from 'lucide-react'
import Image from 'next/image'

interface FullscreenImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  prompt: string
  modelType?: string
  mode?: string
}

export default function FullscreenImageModal({
  isOpen,
  onClose,
  imageUrl,
  prompt,
  modelType = 'flux-pro',
  mode = 'text-to-image'
}: FullscreenImageModalProps) {
  const [zoom, setZoom] = useState(1)
  const [showInfo, setShowInfo] = useState(false)

  if (!isOpen) return null

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `picture-ai-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const resetZoom = () => setZoom(1)
  const zoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3))
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.25))

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        {/* Left Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            title="Bilgi"
          >
            <Info className="w-5 h-5" />
          </button>
          
          {/* Model Badge */}
          <div className="px-4 py-2 bg-black/50 text-white rounded-full text-sm font-medium">
            {modelType === 'nano-banana' ? '🍌 Nano-Banana' : '🚀 Flux Pro'}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            title="Uzaklaştır"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          
          <div className="px-3 py-2 bg-black/50 text-white rounded-full text-sm font-mono">
            {Math.round(zoom * 100)}%
          </div>
          
          <button
            onClick={zoomIn}
            className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            title="Yakınlaştır"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          
          <button
            onClick={resetZoom}
            className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            title="Sıfırla"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleDownload}
            className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors"
            title="İndir"
          >
            <Download className="w-5 h-5" />
          </button>
          
          <button
            onClick={onClose}
            className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="absolute top-20 left-4 z-10 bg-black/80 backdrop-blur-lg text-white p-6 rounded-2xl max-w-md">
          <h3 className="text-lg font-bold mb-3">Görsel Bilgileri</h3>
          <div className="space-y-2 text-sm">
            <div><strong>Model:</strong> {modelType === 'nano-banana' ? 'Nano-Banana/Edit' : 'Flux Pro'}</div>
            <div><strong>Mod:</strong> {mode === 'image-to-image' ? 'Görsel → Görsel' : 'Metin → Görsel'}</div>
            <div><strong>Prompt:</strong> {prompt}</div>
            <div><strong>Oluşturma:</strong> {new Date().toLocaleString('tr-TR')}</div>
          </div>
        </div>
      )}

      {/* Image Container */}
      <div className="absolute inset-0 flex items-center justify-center pt-20 pb-4">
        <div 
          className="relative overflow-hidden"
          style={{ transform: `scale(${zoom})` }}
        >
          <Image
            src={imageUrl}
            alt={prompt}
            width={1200}
            height={900}
            className="object-contain max-w-screen max-h-screen"
            sizes="100vw"
            priority
          />
        </div>
      </div>

      {/* Background Click to Close */}
      <div 
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  )
}