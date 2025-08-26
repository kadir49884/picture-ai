import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /**
   * Session nesnesini extend ediyoruz
   */
  interface Session {
    user: {
      id: number
      credits?: number
      total_generated?: number
    } & DefaultSession['user']
  }

  /**
   * User nesnesini extend ediyoruz
   */
  interface User {
    id: number
    credits?: number
    total_generated?: number
  }
}