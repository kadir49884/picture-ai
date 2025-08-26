import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-config'
import database from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // NextAuth session'ını kontrol et (sadece Google OAuth)
    const session = await getServerSession(authOptions)
    
    if (session?.user?.email) {
      // Google OAuth kullanıcısı
      let dbUser = await database.getUserByEmail(session.user.email)
      
      // Eğer kullanıcı veritabanında yoksa oluştur
      if (!dbUser) {
        console.log('Kullanıcı kaydı oluşturuluyor:', session.user.email)
        await database.createUser(session.user.email, 'google_oauth')
        dbUser = await database.getUserByEmail(session.user.email)
      }
      
      if (dbUser) {
        const { password_hash, ...userWithoutPassword } = dbUser
        console.log('NextAuth session user:', session.user.email)
        return NextResponse.json({
          success: true,
          user: userWithoutPassword
        })
      }
    }

    return NextResponse.json(
      { error: 'Giriş yapmanız gerekli' },
      { status: 401 }
    )
  } catch (error: any) {
    console.error('Get user API error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
