import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-config'
import database from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const imageId = params.id
    const image = await database.getUserImageById(imageId)

    if (!image) {
      return NextResponse.json(
        { error: 'Görsel bulunamadı' },
        { status: 404 }
      )
    }

    // Check if the image belongs to the user
    if (String(image.user_id) !== String(user.id)) {
      return NextResponse.json(
        { error: 'Bu görsele erişim yetkiniz yok' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      image: {
        id: image.id,
        filename: image.filename,
        originalName: image.original_name,
        imageData: image.image_data, // Full base64 data URL
        mimeType: image.mime_type,
        fileSize: image.file_size,
        uploadDate: image.upload_date
      }
    })

  } catch (error: any) {
    console.error('❌ Get image error:', error)
    return NextResponse.json(
      { error: 'Görsel alınırken hata oluştu' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const imageId = params.id
    const deleted = await database.deleteUserImage(imageId, user.id)

    if (!deleted) {
      return NextResponse.json(
        { error: 'Görsel silinemedi veya bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Görsel başarıyla silindi'
    })

  } catch (error: any) {
    console.error('❌ Delete image error:', error)
    return NextResponse.json(
      { error: 'Görsel silinirken hata oluştu' },
      { status: 500 }
    )
  }
}