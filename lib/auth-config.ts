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
        if (account?.provider === 'google') {
          // Google kullanıcısını veritabanında kontrol et/oluştur
          const existingUser = await database.getUserByEmail(user.email!)
          
          if (!existingUser) {
            // Yeni Google kullanıcısı oluştur
            await database.createUser(user.email!, 'google_oauth')
            console.log('Yeni Google kullanıcısı oluşturuldu:', user.email)
          } else {
            console.log('Mevcut Google kullanıcısı giriş yaptı:', user.email)
          }
        }
        return true
      } catch (error) {
        console.error('Google sign-in error:', error)
        return false
      }
    },
    
    async session({ session, token }) {
      if (session.user?.email) {
        // Kullanıcı bilgilerini veritabanından al
        const dbUser = await database.getUserByEmail(session.user.email)
        if (dbUser) {
          (session.user as any).id = dbUser.id
          ;(session.user as any).credits = dbUser.credits
          ;(session.user as any).total_generated = dbUser.total_generated
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