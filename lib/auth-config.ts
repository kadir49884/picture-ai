import GoogleProvider from 'next-auth/providers/google'
import { NextAuthOptions } from 'next-auth'
import database from '@/lib/database'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        console.log('🔍 SignIn callback çağrıldı:', { user: user.email, provider: account?.provider })
        
        if (account?.provider === 'google') {
          console.log('✅ Google provider doğrulandı')
          
          // GÜVENLİ veritabanı işlemi - hata olursa Google OAuth yine de çalışsın
          try {
            const existingUser = await database.getUserByEmail(user.email!)
            
            if (!existingUser) {
              await database.createUser(user.email!, 'google_oauth')
              console.log('✅ Yeni Google kullanıcısı oluşturuldu:', user.email)
            } else {
              console.log('✅ Mevcut Google kullanıcısı giriş yaptı:', user.email)
            }
          } catch (dbError) {
            console.error('❌ Database error (non-blocking):', dbError)
            console.log('⚠️ Google OAuth devam ediyor, DB hatası ignore edildi')
            // Database hatası olursa bile Google OAuth'ı bozmayız
          }
        }
        return true // HER ZAMAN true dön - Google OAuth bozulmasın
      } catch (error) {
        console.error('❌ SignIn callback error:', error)
        return true // Kritik: Bu bile true dönsün ki Google OAuth bozulmasın
      }
    },
    
    async session({ session, token }) {
      try {
        if (session.user?.email) {
          // Güvenli veritabanı işlemi - hata olursa session yine de çalışır
          const dbUser = await database.getUserByEmail(session.user.email)
          if (dbUser) {
            (session.user as any).id = dbUser.id
            ;(session.user as any).credits = dbUser.credits
            ;(session.user as any).total_generated = dbUser.total_generated
            console.log('✅ Session enriched with DB data for:', session.user.email)
          } else {
            // Kullanıcı DB'de yok ama session'ı yine de çalıştır
            console.log('⚠️ User not in DB yet, using basic session for:', session.user.email)
            ;(session.user as any).credits = 10 // Default credit
            ;(session.user as any).total_generated = 0
          }
        }
      } catch (error) {
        console.error('❌ Session callback error (non-blocking):', error)
        // Hata olursa default değerler ver, session'ı bozma
        if (session.user?.email) {
          ;(session.user as any).credits = 10
          ;(session.user as any).total_generated = 0
        }
      }
      return session
    },
    
    async jwt({ token, user, account }) {
      return token
    }
  },
  
  pages: {
    signIn: '/', // Ana sayfa'da modal kullanacağız
  },
  
  session: {
    strategy: 'jwt',
  },
  
  secret: process.env.NEXTAUTH_SECRET,
}