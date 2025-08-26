// Main database interface - switches between different implementations
import neonDatabase from './database-neon'

// Type definitions (keeping existing interfaces)
export interface User {
  id: string | number
  email: string
  password_hash?: string
  auth_type?: string
  credits: number
  total_generated: number
  created_at: string
  updated_at?: string
  last_login?: string
}

export interface Transaction {
  id: string | number
  user_id: string | number
  type: 'purchase' | 'usage'
  amount: number
  credits?: number
  description?: string
  stripe_payment_intent_id?: string
  stripe_session_id?: string
  prompt?: string
  created_at: string
}

export interface CreditPackage {
  id: string | number
  name: string
  credits: number
  price: number
  price_usd?: number
  stripe_price_id?: string
  is_active?: boolean
  active?: boolean
}

// Use Neon PostgreSQL if DATABASE_URL is available, otherwise fallback to local JSON database
const useNeonDB = !!(process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL)

let database: any

if (useNeonDB) {
  database = neonDatabase
  
  // Initialize Neon database (creates tables if they don't exist)
  if (typeof database.initialize === 'function') {
    database.initialize().catch((error: any) => {
      console.error('Neon database initialization failed:', error)
      console.log('⚠️  Database initialization failed, but continuing...')
    })
  }
  
  console.log('✅ Using Neon PostgreSQL database')
} else {
  // Fallback to the existing local database for development
  console.log('⚠️  DATABASE_URL not found, using local JSON database for development')
  console.log('🔧 For production, please configure Neon PostgreSQL with DATABASE_URL')
  
  // Import the original database implementation
  const { promises: fs } = require('fs')
  const path = require('path')

  // Simple fallback database for development (keeping minimal functionality)
  class LocalDatabase {
    async createUser(email: string, authType: string = 'email'): Promise<User> {
      console.log('Creating user with local database:', email)
      const user = {
        id: Date.now(),
        email,
        auth_type: authType,
        credits: 3,
        total_generated: 0,
        created_at: new Date().toISOString()
      }
      return user as User
    }

    async getUserByEmail(email: string): Promise<User | null> {
      console.log('Getting user by email (local DB):', email)
      // For development, always return a mock user
      return {
        id: 1,
        email,
        credits: 3,
        total_generated: 0,
        created_at: new Date().toISOString()
      } as User
    }

    async updateUserCredits(userId: string | number, credits: number): Promise<boolean> {
      console.log('Updating credits (local DB):', userId, credits)
      return true
    }

    async deductCredits(userId: string | number, amount: number): Promise<boolean> {
      console.log('Deducting credits (local DB):', userId, amount)
      return true
    }

    async incrementUserGenerated(userId: string | number): Promise<boolean> {
      console.log('Incrementing generated count (local DB):', userId)
      return true
    }

    async useUserCredit(userId: string | number, prompt: string): Promise<boolean> {
      console.log('Using credit (local DB):', userId, prompt)
      return true
    }

    async healthCheck(): Promise<boolean> {
      return true
    }
  }

  database = new LocalDatabase()
}

export default database
