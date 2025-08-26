import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-config'
import database from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // NextAuth session'ını kontrol et (sadece Google OAuth)
    const session = await getServerSession(authOptions)
    
    if (session?.user?.email) {
      // GÜVENLI veritabanı işlemi - hata olursa session bilgilerini dön
      try {
        // Google OAuth kullanıcısı - veritabanından bilgileri al
        let dbUser = await database.getUserByEmail(session.user.email)
        
        // Eğer kullanıcı veritabanında yoksa oluştur
        if (!dbUser) {
          console.log('Kullanıcı kaydı oluşturuluyor:', session.user.email)
          await database.createUser(session.user.email, 'google_oauth')
          dbUser = await database.getUserByEmail(session.user.email)
        }
        
        if (dbUser) {
          const { password_hash, ...userWithoutPassword } = dbUser
          console.log('✅ NextAuth + DB user:', session.user.email)
          return NextResponse.json({
            success: true,
            user: userWithoutPassword
          })
        }
      } catch (dbError) {
        console.error('❌ Database error in /api/auth/me (fallback to session):', dbError)
        // Database hatası olursa session bilgilerini kullan
      }
      
      // Fallback: Database hatası olursa session bilgilerini dön
      console.log('⚠️ Using session fallback for:', session.user.email)
      return NextResponse.json({
        success: true,
        user: {
          id: session.user.email, // Email'i ID olarak kullan
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          credits: (session.user as any).credits || 10, // Session'dan veya default
          total_generated: (session.user as any).total_generated || 0,
          auth_type: 'google_oauth',
          created_at: new Date().toISOString()
        }
      })
    }

    return NextResponse.json(
      { error: 'Giriş yapmanız gerekli' },
      { status: 401 }
    )
  } catch (error: any) {
    console.error('Critical error in /api/auth/me:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
