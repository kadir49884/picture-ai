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

// Global window tiplerini tanımla
declare global {
  interface Window {
    gtag_report_conversion: (url?: string) => boolean
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}