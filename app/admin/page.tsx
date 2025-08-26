'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Upload {
  id: number
  user_id: number
  email: string
  image_size: number
  prompt_used: string
  generated_image_url: string
  upload_type: string
  created_at: string
  image_preview: string
}

interface UploadDetail extends Upload {
  image_data: string
}

export default function AdminPanel() {
  const { data: session, status } = useSession()
  const [uploads, setUploads] = useState<Upload[]>([])
  const [selectedUpload, setSelectedUpload] = useState<UploadDetail | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)

  const LIMIT = 10

  useEffect(() => {
    if (status === 'authenticated') {
      loadUploads()
      loadStats()
    }
  }, [status, currentPage])

  const loadUploads = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/uploads?action=list&limit=${LIMIT}&offset=${currentPage * LIMIT}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Uploads yüklenemedi')
      }
      
      setUploads(data.uploads)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/uploads?action=stats')
      const data = await response.json()
      
      if (response.ok) {
        setStats(data.stats)
      }
    } catch (err) {
      console.error('Stats yüklenemedi:', err)
    }
  }

  const loadUploadDetail = async (uploadId: number) => {
    try {
      const response = await fetch(`/api/admin/uploads?action=detail&id=${uploadId}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload detayı yüklenemedi')
      }
      
      setSelectedUpload(data.upload)
      setShowImageModal(true)
    } catch (err: any) {
      alert('Hata: ' + err.message)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB'
    return Math.round(bytes / (1024 * 1024)) + ' MB'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR')
  }

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Yükleniyor...</div>
  }

  if (status === 'unauthenticated') {
    return <div className="flex justify-center items-center min-h-screen">Giriş yapmanız gerekli</div>
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Hata: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📊 Admin Panel - Kullanıcı Upload'ları</h1>
      
      {/* Stats */}
      {stats && stats.length > 0 && (
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-3">📈 İstatistikler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats[0]?.total_uploads || 0}</div>
              <div className="text-sm text-gray-600">Toplam Upload</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats[0]?.unique_users || 0}</div>
              <div className="text-sm text-gray-600">Unique Kullanıcı</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatFileSize(parseInt(stats[0]?.total_size_bytes || '0'))}
              </div>
              <div className="text-sm text-gray-600">Toplam Boyut</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {formatFileSize(parseInt(stats[0]?.avg_size_bytes || '0'))}
              </div>
              <div className="text-sm text-gray-600">Ortalama Boyut</div>
            </div>
          </div>
        </div>
      )}

      {/* Uploads List */}
      <div className="bg-white shadow-lg rounded-lg">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">🖼️ Son Upload'lar</h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">Yükleniyor...</div>
        ) : uploads.length === 0 ? (
          <div className="p-6 text-center text-gray-500">Henüz upload yok</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kullanıcı</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prompt</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Boyut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {uploads.map((upload) => (
                  <tr key={upload.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{upload.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {upload.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={upload.prompt_used}>
                        {upload.prompt_used || 'Prompt yok'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatFileSize(upload.image_size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(upload.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => loadUploadDetail(upload.id)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        👁️ Görüntüle
                      </button>
                      {upload.generated_image_url && (
                        <a
                          href={upload.generated_image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-900"
                        >
                          🎨 Sonuç
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t flex justify-between items-center">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            ← Önceki
          </button>
          <span className="text-gray-600">Sayfa {currentPage + 1}</span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={uploads.length < LIMIT}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Sonraki →
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && selectedUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Upload #{selectedUpload.id}</h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">📤 Yüklenen Görsel:</h4>
                <img
                  src={selectedUpload.image_data}
                  alt="Uploaded"
                  className="w-full h-auto border rounded"
                />
              </div>
              
              {selectedUpload.generated_image_url && (
                <div>
                  <h4 className="font-medium mb-2">🎨 Oluşturulan Görsel:</h4>
                  <img
                    src={selectedUpload.generated_image_url}
                    alt="Generated"
                    className="w-full h-auto border rounded"
                  />
                </div>
              )}
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div><strong>Kullanıcı:</strong> {selectedUpload.email}</div>
              <div><strong>Boyut:</strong> {formatFileSize(selectedUpload.image_size)}</div>
              <div><strong>Tarih:</strong> {formatDate(selectedUpload.created_at)}</div>
              <div><strong>Prompt:</strong> {selectedUpload.prompt_used || 'Yok'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}