import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-config'
import database from '@/lib/database'

// Admin email'i - sadece bu email'e sahip kullanıcı admin paneline erişebilir
const ADMIN_EMAIL = 'petrichorgm@gmail.com' // Senin email'in

export async function GET(request: NextRequest) {
  try {
    // Authentication kontrolü
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekli' },
        { status: 401 }
      )
    }

    // Admin kontrolü
    if (session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Bu sayfaya erişim yetkiniz yok' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'list'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const uploadId = searchParams.get('id')

    switch (action) {
      case 'list':
        // Tüm upload'ları listele (preview olarak)
        const uploads = await database.getAllUserUploads(limit, offset)
        return NextResponse.json({
          success: true,
          uploads,
          pagination: {
            limit,
            offset,
            hasMore: uploads.length === limit
          }
        })

      case 'detail':
        // Belirli bir upload'ın tam detayını getir
        if (!uploadId) {
          return NextResponse.json(
            { error: 'Upload ID gerekli' },
            { status: 400 }
          )
        }
        
        const upload = await database.getUserUploadById(parseInt(uploadId))
        if (!upload) {
          return NextResponse.json(
            { error: 'Upload bulunamadı' },
            { status: 404 }
          )
        }

        return NextResponse.json({
          success: true,
          upload
        })

      case 'stats':
        // Upload istatistikleri
        const stats = await database.getUploadStats()
        return NextResponse.json({
          success: true,
          stats
        })

      default:
        return NextResponse.json(
          { error: 'Geçersiz action' },
          { status: 400 }
        )
    }

  } catch (error: any) {
    console.error('Admin panel error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}