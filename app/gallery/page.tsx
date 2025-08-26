'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Trash2, Upload, Download, Eye } from 'lucide-react'

interface UserImage {
  id: string
  filename: string
  originalName: string
  mimeType: string
  fileSize: number
  uploadDate: string
}

interface ImageWithData extends UserImage {
  imageData?: string
}

export default function GalleryPage() {
  const { data: session } = useSession()
  const [images, setImages] = useState<UserImage[]>([])
  const [selectedImage, setSelectedImage] = useState<ImageWithData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Görselleri yükle
  const fetchImages = async () => {
    if (!session) return

    try {
      setIsLoading(true)
      const response = await fetch('/api/user-images')
      const data = await response.json()

      if (data.success) {
        setImages(data.images)
      } else {
        console.error('Görseller alınamadı:', data.error)
      }
    } catch (error) {
      console.error('API hatası:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Belirli bir görseli tam boyutlu al
  const viewImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/user-images/${imageId}`)
      const data = await response.json()

      if (data.success) {
        setSelectedImage(data.image)
      } else {
        console.error('Görsel alınamadı:', data.error)
      }
    } catch (error) {
      console.error('Görsel yükleme hatası:', error)
    }
  }

  // Görsel sil
  const deleteImage = async (imageId: string) => {
    if (!confirm('Bu görseli silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/user-images/${imageId}`, {
        method: 'DELETE'
      })
      const data = await response.json()

      if (data.success) {
        setImages(images.filter(img => img.id !== imageId))
        if (selectedImage?.id === imageId) {
          setSelectedImage(null)
        }
        alert('Görsel silindi!')
      } else {
        alert('Görsel silinemedi: ' + data.error)
      }
    } catch (error) {
      console.error('Silme hatası:', error)
      alert('Silme hatası oluştu')
    }
  }

  // Dosya yükleme
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    try {
      setIsUploading(true)
      const response = await fetch('/api/user-images', {
        method: 'POST',
        body: formData
      })
      const data = await response.json()

      if (data.success) {
        alert('Görsel başarıyla yüklendi!')
        fetchImages() // Listeyi yenile
      } else {
        alert('Yükleme hatası: ' + data.error)
      }
    } catch (error) {
      console.error('Upload hatası:', error)
      alert('Yükleme hatası oluştu')
    } finally {
      setIsUploading(false)
      event.target.value = '' // Input'u temizle
    }
  }

  // Dosya boyutunu formatla
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Tarihi formatla
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  useEffect(() => {
    fetchImages()
  }, [session])

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Görsel Galerim</h1>
          <p className="text-gray-600">Galeriye erişmek için giriş yapmanız gerekiyor.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🖼️ Görsel Galerim</h1>
          <p className="text-gray-600">Yüklediğiniz görselleri burada görebilir ve yönetebilirsiniz</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Yeni Görsel Yükle
          </h2>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
            {isUploading && (
              <div className="text-purple-600 font-medium">Yükleniyor...</div>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Desteklenen formatlar: JPG, PNG, WebP, GIF (Max: 10MB)
          </p>
        </div>

        {/* Images Grid */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            Yüklenen Görseller ({images.length})
          </h2>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="mt-2 text-gray-600">Görseller yükleniyor...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Upload className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Henüz görsel yüklenmemiş. Yukarıdan görsel yükleyebilirsiniz.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <div className="text-center p-4">
                      <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Eye className="w-8 h-8 text-purple-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {image.originalName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(image.fileSize)}
                      </p>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-500 mb-2">
                      {formatDate(image.uploadDate)}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => viewImage(image.id)}
                        className="flex-1 bg-purple-600 text-white text-sm py-1 px-2 rounded hover:bg-purple-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        Görüntüle
                      </button>
                      <button
                        onClick={() => deleteImage(image.id)}
                        className="bg-red-600 text-white text-sm py-1 px-2 rounded hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">{selectedImage.originalName}</h3>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                <div className="text-center">
                  {selectedImage.imageData && (
                    <img
                      src={selectedImage.imageData}
                      alt={selectedImage.originalName}
                      className="max-w-full max-h-[60vh] object-contain mx-auto rounded-lg"
                    />
                  )}
                  <div className="mt-4 text-sm text-gray-600">
                    <p>Boyut: {formatFileSize(selectedImage.fileSize)}</p>
                    <p>Format: {selectedImage.mimeType}</p>
                    <p>Yüklenme: {formatDate(selectedImage.uploadDate)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}