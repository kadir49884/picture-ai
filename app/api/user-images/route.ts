import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-config'
import database from '@/lib/database'

// Maximum file size: 10MB (Base64 encoded will be ~33% larger)
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// Allowed image types
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekli' },
        { status: 401 }
      )
    }

    // Get user from database
    const user = await database.getUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Görsel dosyası gerekli' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Desteklenmeyen dosya formatı. JPG, PNG, WebP, GIF desteklenir.' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Dosya çok büyük. Maksimum 10MB yükleyebilirsiniz.' },
        { status: 400 }
      )
    }

    // Convert to base64
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${user.id}_${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    // Save to database
    const savedImage = await database.saveUserImage(
      user.id,
      filename,
      file.name,
      dataUrl,
      file.type,
      file.size
    )

    console.log(`📸 Image uploaded: ${filename} by ${session.user.email}`)

    return NextResponse.json({
      success: true,
      image: {
        id: savedImage.id,
        filename: savedImage.filename,
        originalName: savedImage.original_name,
        mimeType: savedImage.mime_type,
        fileSize: savedImage.file_size,
        uploadDate: savedImage.upload_date
      },
      message: 'Görsel başarıyla yüklendi'
    })

  } catch (error: any) {
    console.error('❌ Image upload error:', error)
    return NextResponse.json(
      { 
        error: 'Görsel yüklenirken hata oluştu',
        details: error.message
      },
      { status: 500 }
    )
  }
}

// Get user's uploaded images
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekli' },
        { status: 401 }
      )
    }

    const user = await database.getUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    const images = await database.getUserImages(user.id, 50)

    // Return images without full base64 data (for listing)
    const imageList = images.map((img: any) => ({
      id: img.id,
      filename: img.filename,
      originalName: img.original_name,
      mimeType: img.mime_type,
      fileSize: img.file_size,
      uploadDate: img.upload_date
    }))

    return NextResponse.json({
      success: true,
      images: imageList,
      count: images.length
    })

  } catch (error: any) {
    console.error('❌ Get images error:', error)
    return NextResponse.json(
      { error: 'Görseller alınırken hata oluştu' },
      { status: 500 }
    )
  }
}