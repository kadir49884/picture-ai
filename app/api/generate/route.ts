import { NextRequest, NextResponse } from 'next/server'
import { fal } from '@fal-ai/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-config'
import database from '@/lib/database'
import { validateEnvironment } from '@/lib/env-validation'
import { validateAndSanitizePrompt, validateImageUrl } from '@/lib/input-validation'
import { imageGenerationRateLimit } from '@/lib/rate-limit'

// Validate environment variables at startup
let envConfig: ReturnType<typeof validateEnvironment>
try {
  envConfig = validateEnvironment()
} catch (error) {
  console.error('Environment validation failed:', error)
  throw error
}

// FAL AI API anahtarını yapılandır
fal.config({
  credentials: envConfig.FAL_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { prompt, mode, imageUrl, modelType } = await request.json()
    
    // Otomatik model seçimi: Görsel→Görsel=Banana, Metin→Görsel=Flux
    const selectedModel = modelType || (mode === 'image-to-image' ? 'nano-banana' : 'flux-pro')

    // Input validation
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt gerekli' },
        { status: 400 }
      )
    }

    // Validate and sanitize prompt
    const promptValidation = validateAndSanitizePrompt(prompt)
    if (!promptValidation.isValid) {
      return NextResponse.json(
        { 
          error: 'Geçersiz prompt',
          details: promptValidation.errors,
          warnings: promptValidation.warnings
        },
        { status: 400 }
      )
    }

    const sanitizedPrompt = promptValidation.sanitized

    // Validate image URL for image-to-image mode
    if (mode === 'image-to-image') {
      if (!imageUrl) {
        return NextResponse.json(
          { error: 'Image-to-image modu için görsel URL gerekli' },
          { status: 400 }
        )
      }

      console.log('🔍 Image URL validation - Length:', imageUrl.length, 'Type:', imageUrl.startsWith('data:') ? 'Base64' : 'URL')
      
      const imageValidation = validateImageUrl(imageUrl)
      if (!imageValidation.isValid) {
        console.error('❌ Image URL validation failed:', imageValidation.errors)
        return NextResponse.json(
          { 
            error: 'Geçersiz görsel URL',
            details: imageValidation.errors
          },
          { status: 400 }
        )
      }
      
      console.log('✅ Image URL validation passed')
    }

    // Google OAuth kullanıcı kontrolü
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekli', requiresAuth: true },
        { status: 401 }
      )
    }

    // Rate limiting check
    const rateLimitResult = await imageGenerationRateLimit(request, session.user.email)
    if (!rateLimitResult.success) {
      return rateLimitResult.response!
    }

    // Kullanıcıyı veritabanından al
    let user = await database.getUserByEmail(session.user.email)
    
    // Eğer kullanıcı veritabanında yoksa oluştur
    if (!user) {
      console.log('Generate sırasında kullanıcı kaydı oluşturuluyor:', session.user.email)
      await database.createUser(session.user.email, 'google_oauth')
      user = await database.getUserByEmail(session.user.email)
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı oluşturulamadı' },
        { status: 500 }
      )
    }

    if (user.credits < 1) {
      return NextResponse.json(
        { error: 'Yetersiz kredi. Lütfen kredi satın alın.', needsCredits: true },
        { status: 402 }
      )
    }

    console.log(`${mode === 'image-to-image' ? 'Görsel düzenleniyor' : 'Görsel oluşturuluyor'}, kullanıcı:`, user.email, 'kredi:', user.credits, 'prompt:', sanitizedPrompt)

    // Krediyi kullan (AI çağrısı öncesi)
    const creditUsed = await database.useUserCredit(user.id, sanitizedPrompt)
    if (!creditUsed) {
      return NextResponse.json(
        { error: 'Kredi kullanılamadı, tekrar deneyin' },
        { status: 500 }
      )
    }

    let result;
    
    try {
      if (mode === 'image-to-image') {
        // Otomatik olarak Nano-Banana kullan (görsel düzenleme)
        console.log('🍌 Auto-selected: Nano-Banana for image-to-image')
        if (selectedModel === 'nano-banana') {
          // FAL AI nano-banana/edit modelini kullan (image editing)
          console.log('🍌 Starting image editing with Nano-Banana/Edit model')
          console.log('📝 Prompt:', sanitizedPrompt)
          console.log('🖼️ Image URL type:', imageUrl.startsWith('data:') ? 'Base64 data URL' : 'HTTP URL')
          
          result = await fal.subscribe('fal-ai/nano-banana/edit', {
            input: {
              prompt: sanitizedPrompt,
              image_urls: [imageUrl], // Nano-banana çoklu görsel destekler
            },
            logs: true,
            onQueueUpdate: (update) => {
              console.log('⏳ Nano-Banana queue update:', update)
            }
          })
          
          console.log('✅ Nano-Banana edit completed')
        } else {
          // FAL AI flux-pro/kontext/max modelini kullan (image-to-image)
          console.log('🚀 Starting image-to-image with Flux Pro/Kontext/Max')
          console.log('📝 Prompt:', sanitizedPrompt)
          console.log('🖼️ Image URL type:', imageUrl.startsWith('data:') ? 'Base64 data URL' : 'HTTP URL')
          
          result = await fal.subscribe('fal-ai/flux-pro/kontext/max', {
            input: {
              prompt: sanitizedPrompt,
              image_url: imageUrl,
              guidance_scale: 3.5,
              num_images: 1,
              output_format: 'jpeg'
            },
            logs: true,
            onQueueUpdate: (update) => {
              console.log('⏳ Flux Pro queue update:', update)
            }
          })
          
          console.log('✅ Flux Pro image-to-image completed')
        }
      } else {
        // Text-to-image: Otomatik olarak Flux Pro kullan
        console.log('🚀 Auto-selected: Flux Pro for text-to-image')
        console.log('📝 Prompt:', sanitizedPrompt)
        console.log('🎯 Selected Model:', selectedModel)
        
        result = await fal.subscribe('fal-ai/flux-pro', {
          input: {
            prompt: sanitizedPrompt,
            image_size: 'landscape_4_3',
            num_inference_steps: 28,
            guidance_scale: 3.5,
            num_images: 1,
            enable_safety_checker: true
          },
          logs: true,
          onQueueUpdate: (update) => {
            console.log('⏳ Flux Pro queue update:', update)
          }
        })
        
        console.log('✅ Flux Pro text-to-image completed')
      }
    } catch (falError: any) {
      console.error('❌ FAL AI API Error:', {
        message: falError.message,
        status: falError.status,
        statusCode: falError.statusCode,
        response: falError.response,
        stack: falError.stack
      })
      
      return NextResponse.json(
        { 
          error: 'AI servisinde hata oluştu',
          details: falError.message,
          errorCode: falError.status || falError.statusCode || 'UNKNOWN'
        },
        { status: 500 }
      )
    }

    console.log('FAL AI sonucu:', JSON.stringify(result, null, 2))

    // FAL AI response handling
    const images = (result as any)?.data?.images || (result as any)?.images
    
    if (images && images.length > 0) {
      // Güncel kullanıcı bilgilerini getir (krediactallemesi için)
      const updatedUser = await database.getUserByEmail(session.user.email)
      
      return NextResponse.json({
        success: true,
        imageUrl: images[0].url,
        prompt: sanitizedPrompt,
        remainingCredits: updatedUser?.credits || 0
      })
    } else {
      console.error('Görsel bulunamadı. Response yapısı:', result)
      return NextResponse.json(
        { error: 'Görsel oluşturulamadı', debug: result },
        { status: 500 }
      )
    }

  } catch (error: any) {
    console.error('FAL AI hatası:', error)
    console.error('Hata detayları:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    })
    return NextResponse.json(
      { 
        error: 'Görsel oluşturulurken hata oluştu',
        details: error.message,
        debugInfo: {
          errorType: error.constructor.name,
          statusCode: error.response?.status
        }
      },
      { status: 500 }
    )
  }
}
