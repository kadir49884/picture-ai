import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-config'
import database from './database'

// NextAuth session'dan kullanıcı bilgisi al
export async function getAuthUser() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return null
    }

    // Veritabanından güncel kullanıcı bilgilerini al
    const user = await database.getUserByEmail(session.user.email)
    if (!user) {
      return null
    }

    // Hassas verileri kaldır
    const { password_hash, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    console.error('Get auth user error:', error)
    return null
  }
}

// Client-side için session hook'u
export function useSession() {
  // Bu client tarafında useSession hook'u ile değiştirilecek
  return null
}
