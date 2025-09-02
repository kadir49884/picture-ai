'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Download, Loader, ImageIcon, Wand2, Upload, RotateCcw, Maximize2, Minimize2 } from 'lucide-react'
import Image from 'next/image'
import AuthHeader from '@/components/AuthHeader'
import ShareButton from '@/components/ShareButton'
import FullscreenImageModal from '@/components/FullscreenImageModal'
import { useSession } from 'next-auth/react'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [mode, setMode] = useState<'text-to-image' | 'image-to-image'>('text-to-image')
  
  // Otomatik model seçimi: Görsel→Görsel=Banana, Metin→Görsel=Flux
  const modelType = mode === 'image-to-image' ? 'nano-banana' : 'flux-pro'
  const [user, setUser] = useState<any>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false)
  const { data: session, status } = useSession()

  // Kullanıcı durumunu kontrol et
  useEffect(() => {
    if (status !== 'loading') {
      if (session?.user) {
        // Google OAuth kullanıcısı varsa bilgilerini al
        fetchUserData()
      } else {
        // Normal auth kontrolü yap.
        checkAuthStatus()
      }
    }
  }, [session, status])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else if (response.status === 401 && session?.user?.email) {
        // Eğer Google OAuth ile giriş yapılmış ama kullanıcı veritabanında yoksa
        console.log('Kullanıcı kaydı oluşturuluyor:', session.user.email)
        // Kullanıcı henüz yoksa, sadece session verilerini kullan
        setUser({
          email: session.user.email,
          credits: 3, // Varsayılan kredi
          total_generated: 0
        })
      }
    } catch (error) {
      console.log('User data fetch failed:', error)
    } finally {
      setIsCheckingAuth(false)
    }
  }

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.log('Auth check failed:', error)
    } finally {
      setIsCheckingAuth(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      setGeneratedImage(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Dosya boyutu kontrolü (maksimum 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Dosya boyutu 10MB\'dan küçük olmalı')
        return
      }
      
      // Dosya tipi kontrolü
      if (!file.type.startsWith('image/')) {
        setError('Lütfen geçerli bir görsel dosyası seçin')
        return
      }
      
      setError(null) // Önceki hataları temizle
      
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        console.log('Görsel yüklendi:', result ? 'Başarılı' : 'Hatalı')
        setUploadedImage(result)
        setMode('image-to-image')
      }
      reader.onerror = () => {
        setError('Görsel yüklenirken hata oluştu')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    console.log('handleGenerate çalıştı - Mode:', mode, 'Prompt:', prompt, 'UploadedImage:', !!uploadedImage)
    
    if (!prompt.trim()) {
      setError('Lütfen bir prompt girin')
      return
    }

    if (mode === 'image-to-image' && !uploadedImage) {
      setError('Image-to-image modu için bir görsel yükleyin')
      return
    }

    // Giriş kontrolü - AuthHeader içinde modal açılacak
    if (!user && !session?.user) {
      setError('Giriş yapmanız gerekli. Lütfen sağ üstten giriş yapın.')
      return
    }

    // Kredi kontrolü (sadece user objesi varsa)
    if (user && user.credits < 1) {
      setError('Yetersiz kredi! Lütfen kredi satın alın.')
      return
    }

    setIsLoading(true)
    setError(null)
    setGeneratedImage(null)

    try {
      const requestBody: any = { 
        prompt: prompt.trim(),
        mode,
        modelType
      }
      
      if (mode === 'image-to-image' && uploadedImage) {
        requestBody.imageUrl = uploadedImage
        console.log('Image-to-image istek gönderiliyor:', {
          prompt: prompt.trim(),
          mode,
          imageUrlLength: uploadedImage.length
        })
      } else {
        console.log('Text-to-image istek gönderiliyor:', {
          prompt: prompt.trim(),
          mode
        })
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Bir hata oluştu')
      }

      if (data.success && data.imageUrl) {
        setGeneratedImage(data.imageUrl)
        
        // Kullanıcının kredi bilgisini güncelle
        console.log('API response remainingCredits:', data.remainingCredits)
        if (data.remainingCredits !== undefined) {
          console.log('Kredi güncelleniyor:', user?.credits, '->', data.remainingCredits)
          setUser((prev: any) => prev ? { ...prev, credits: data.remainingCredits } : null)
        } else {
          // Eğer API'den kredi bilgisi gelmezse, kullanıcı bilgilerini yeniden çek
          console.log('API\'den kredi bilgisi gelmedi, yeniden çekiliyor...')
          fetchUserData()
        }
      } else {
        throw new Error('Görsel oluşturulamadı')
      }
    } catch (err: any) {
      console.error('Generate error:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a')
      link.href = generatedImage
      link.download = `picture-ai-${Date.now()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const textToImagePrompts = [
    "Gün batımında sakin bir göl kenarında oturan kedi",
    "Neon ışıklarla aydınlatılmış fütüristik şehir manzarası", 
    "Renkli çiçeklerle dolu büyülü orman",
    "Uzayda yüzen astronot ve gezegenler",
    "Steampunk tarzında uçan makine"
  ]

  const imageToImagePrompts = [
    "Bu görsele gökkuşağı ekle",
    "Arka planı büyülü ormana çevir",
    "Vintage fotoğraf efekti ekle",
    "Kış mevsimi atmosferi katmak",
    "Görseli fantastik sanat tarzına dönüştür"
  ]

  const examplePrompts = mode === 'text-to-image' ? textToImagePrompts : imageToImagePrompts

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow"></div>
      </div>

      <div className="container max-w-4xl mx-auto relative z-10">
        {/* Header with Auth and Share */}
        <div className="w-full flex justify-between items-center mb-8">
          <ShareButton className="" />
          <AuthHeader userCredits={user?.credits} />
        </div>

        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              Picture AI
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Hayal gücünüzü gerçeğe dönüştürün. Sadece birkaç kelime yazın, 
            AI muhteşem görseller oluştursun.
          </p>
        </div>

        {/* Mode Selection */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20">
            <button
              onClick={() => setMode('text-to-image')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                mode === 'text-to-image'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="inline w-5 h-5 mr-2" />
              Metin → Görsel
            </button>
            <button
              onClick={() => setMode('image-to-image')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                mode === 'image-to-image'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Upload className="inline w-5 h-5 mr-2" />
              Görsel → Görsel
            </button>
          </div>
        </div>

        {/* Otomatik Model Bilgisi */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl px-6 py-3 border border-white/20">
            <div className="flex items-center gap-2 text-white">
              <span className="text-lg">
                {mode === 'image-to-image' ? '🍌' : '🚀'}
              </span>
              <span className="font-medium">
                {mode === 'image-to-image' ? 'Nano-Banana Edit' : 'Flux Pro'}
              </span>
              <span className="text-sm text-gray-300">
                • {mode === 'image-to-image' ? 'Hızlı düzenleme' : 'Yüksek kalite'}
              </span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Image Upload for image-to-image mode */}
          {mode === 'image-to-image' && (
            <div className="mb-8">
              <label className="block text-lg font-semibold text-white mb-4">
                <Upload className="inline w-5 h-5 mr-2" />
                Düzenlenecek Görseli Yükleyin
              </label>
              
              {!uploadedImage ? (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isLoading}
                  />
                  <div className="border-2 border-dashed border-white/30 rounded-xl p-12 text-center hover:border-white/50 transition-colors duration-200">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300 text-lg">
                      Bir görsel seçin veya buraya sürükleyin
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      PNG, JPG, JPEG formatları desteklenir
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/20">
                    <Image
                      src={uploadedImage}
                      alt="Yüklenen görsel"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                    disabled={isLoading}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <p className="text-gray-300 text-sm mt-2 text-center">
                    Görsel yüklendi - Şimdi nasıl düzenlemek istediğinizi yazın
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Prompt input */}
          <div className="mb-8">
            <label htmlFor="prompt" className="block text-lg font-semibold text-white mb-4">
              <Wand2 className="inline w-5 h-5 mr-2" />
              {mode === 'text-to-image' ? 'Görseli Tanımlayın' : 'Düzenleme Talebinizi Yazın'}
            </label>
            <div className="relative">
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={mode === 'text-to-image' 
                  ? "Örnek: Gün batımında sakin bir göl kenarında oturan kedi..." 
                  : "Örnek: Bu görsele gökkuşağı ekle..."}
                className="w-full h-32 p-4 bg-black/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                disabled={isLoading}
              />
              <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                {prompt.length}/500
              </div>
            </div>
          </div>

          {/* Example prompts */}
          <div className="mb-8">
            <p className="text-sm text-gray-300 mb-3">Örnek fikirler:</p>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  disabled={isLoading}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm text-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={() => {
              console.log('Buton tıklandı:', { mode, prompt: prompt.trim(), uploadedImage: !!uploadedImage, isLoading })
              handleGenerate()
            }}
            disabled={isLoading || !prompt.trim()}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
          >
            {isLoading ? (
              <>
                <Loader className="w-6 h-6 animate-spin" />
                {mode === 'text-to-image' ? 'Görsel Oluşturuluyor...' : 'Görsel Düzenleniyor...'}
              </>
            ) : (
              <>
                {mode === 'text-to-image' ? <Sparkles className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
                {mode === 'text-to-image' ? 'Görsel Oluştur' : 'Görseli Düzenle'}
              </>
            )}
          </button>

          {/* Error display */}
          {error && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200">
              <p className="font-medium">Hata:</p>
              <p>{error}</p>
            </div>
          )}

          {/* Generated image */}
          {generatedImage && (
            <div className="mt-8 fade-in">
              <div className="relative bg-black/20 rounded-xl p-4 border border-white/20">
                <div className="relative w-full rounded-lg overflow-hidden">
                  <Image
                    src={generatedImage}
                    alt="Oluşturulan görsel"
                    width={1152}
                    height={896}
                    className="w-full h-auto rounded-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                    priority
                  />
                </div>
                
                <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                  <p className="text-gray-300 text-sm truncate flex-1 mr-4">
                    <ImageIcon className="inline w-4 h-4 mr-2" />
                    {prompt}
                  </p>
                  <div className="flex items-center gap-2">
                    {/* Tam Ekran/Küçültme Toggle Butonu */}
                    <button
                      onClick={() => setIsFullscreenOpen(!isFullscreenOpen)}
                      className={`px-3 py-2 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm ${
                        isFullscreenOpen 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                      title={isFullscreenOpen ? 'Küçült' : 'Tam ekran'}
                    >
                      {isFullscreenOpen ? (
                        <>
                          <Minimize2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Küçült</span>
                        </>
                      ) : (
                        <>
                          <Maximize2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Tam Ekran</span>
                        </>
                      )}
                    </button>
                    
                    {/* Paylaş Butonu */}
                    <ShareButton 
                      title={`AI ile oluşturduğum görsel: "${prompt}"`}
                      description={`Picture AI kullanarak "${prompt}" prompt'u ile oluşturduğum bu görseli görün! Siz de AI ile muhteşem görseller oluşturabilirsiniz.`}
                      className=""
                    />
                    
                    {/* İndirme Butonu */}
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                      title="Görseli indir"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">İndir</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Fullscreen Modal */}
              <FullscreenImageModal
                isOpen={isFullscreenOpen}
                onClose={() => setIsFullscreenOpen(false)}
                imageUrl={generatedImage}
                prompt={prompt}
                modelType={modelType}
                mode={mode}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            {/* Main Footer Content */}
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="text-white font-medium">Picture AI'yi Paylaş</span>
              </div>
              <p className="text-gray-400 text-sm max-w-md">
                Arkadaşlarınızla paylaşın ve onlar da AI ile muhteşem görseller oluştursun!
              </p>
              <ShareButton 
                title="Picture AI - AI ile Muhteşem Görseller Oluştur"
                description="Hayal gücünüzü gerçeğe dönüştürün! Picture AI ile sadece birkaç kelime yazarak profesyonel kalitede görseller oluşturun. Ücretsiz deneyin!"
                className=""
              />
            </div>
            
            {/* Divider */}
            <div className="border-t border-white/10 pt-4">
              <p className="text-gray-400 text-sm">
                <span className="text-purple-400">FAL AI Flux Pro</span> & <span className="text-green-400">Nano-Banana/Edit</span> ile güçlendirilmiştir
              </p>
            </div>
          </div>
        </div>
      </div>


    </main>
  )
}
