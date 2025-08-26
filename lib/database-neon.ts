import { neon } from '@neondatabase/serverless'
import type { User, Transaction, CreditPackage } from './database'

export class NeonDatabase {
  private sql: ReturnType<typeof neon>

  constructor() {
    const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL
    if (!connectionString) {
      console.warn('⚠️ DATABASE_URL not found - Using no-op database for build time')
      // Create a no-op function that returns empty results
      this.sql = (() => Promise.resolve([])) as any
      return
    }
    this.sql = neon(connectionString)
  }

  // Initialize database tables (compatible with existing integer ID schema)
  async initialize(): Promise<void> {
    try {
      console.log('✅ Database connection established - using existing schema')
      
      // Check if tables exist, create indexes if needed
      await this.sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`
      await this.sql`CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id)`
      
      console.log('✅ Neon database ready (using existing tables)')
    } catch (error) {
      console.error('Database initialization error:', error)
      throw error
    }
  }

  // User operations
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const result = await this.sql`
        SELECT * FROM users WHERE email = ${email} LIMIT 1
      `
      return Array.isArray(result) && result.length > 0 ? result[0] as User : null
    } catch (error) {
      console.error('Error getting user by email:', error)
      return null
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const result = await this.sql`
        SELECT * FROM users WHERE id = ${id} LIMIT 1
      `
      return Array.isArray(result) && result.length > 0 ? result[0] as User : null
    } catch (error) {
      console.error('Error getting user by ID:', error)
      return null
    }
  }

  async createUser(email: string, authType: string = 'email', passwordHash?: string): Promise<User> {
    try {
      const result = await this.sql`
        INSERT INTO users (email, auth_type, password_hash, credits, total_generated)
        VALUES (${email}, ${authType}, ${passwordHash || null}, 3, 0)
        RETURNING *
      `
      console.log('✅ User created successfully:', email)
      // Ensure proper type checking for result access
      if (Array.isArray(result) && result.length > 0) {
        return result[0] as User
      }
      throw new Error('Failed to create user - no result returned')
    } catch (error) {
      console.error('❌ Error creating user:', error)
      throw error
    }
  }

  async updateUserCredits(userId: string | number, credits: number): Promise<boolean> {
    try {
      await this.sql`
        UPDATE users 
        SET credits = ${credits}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${userId}
      `
      return true
    } catch (error) {
      console.error('❌ Error updating user credits:', error)
      return false
    }
  }

  async incrementUserGenerated(userId: string | number): Promise<boolean> {
    try {
      await this.sql`
        UPDATE users 
        SET total_generated = total_generated + 1, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${userId}
      `
      return true
    } catch (error) {
      console.error('❌ Error incrementing user generated count:', error)
      return false
    }
  }

  async deductCredits(userId: string | number, amount: number): Promise<boolean> {
    try {
      const result = await this.sql`
        UPDATE users 
        SET credits = credits - ${amount}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${userId} AND credits >= ${amount}
        RETURNING credits
      `
      
      if (!Array.isArray(result) || result.length === 0) {
        console.error('❌ Insufficient credits or user not found')
        return false
      }
      
      console.log(`✅ Credits deducted successfully. Remaining: ${(result[0] as any).credits}`)
      return true
    } catch (error) {
      console.error('❌ Error deducting credits:', error)
      return false
    }
  }

  async createTransaction(
    userId: string | number,
    type: string,
    amount: number,
    description?: string,
    stripePaymentIntentId?: string
  ): Promise<Transaction> {
    try {
      const result = await this.sql`
        INSERT INTO transactions (user_id, type, credits, amount, description, stripe_payment_intent_id)
        VALUES (${userId}, ${type}, ${amount}, ${amount}, ${description || null}, ${stripePaymentIntentId || null})
        RETURNING *
      `
      // Ensure proper type checking for result access
      if (Array.isArray(result) && result.length > 0) {
        return result[0] as Transaction
      }
      throw new Error('Failed to create transaction - no result returned')
    } catch (error) {
      console.error('❌ Error creating transaction:', error)
      throw error
    }
  }

  async getUserTransactions(userId: string | number, limit: number = 50): Promise<Transaction[]> {
    try {
      const result = await this.sql`
        SELECT * FROM transactions 
        WHERE user_id = ${userId} 
        ORDER BY created_at DESC 
        LIMIT ${limit}
      `
      return result as Transaction[]
    } catch (error) {
      console.error('❌ Error getting user transactions:', error)
      return []
    }
  }

  // Credit package operations  
  async getCreditPackages(): Promise<CreditPackage[]> {
    try {
      const result = await this.sql`
        SELECT *, 
               COALESCE(active, is_active) as is_active_resolved,
               COALESCE(price_usd, price::decimal / 100) as price_usd_resolved
        FROM credit_packages 
        WHERE COALESCE(active, is_active, true) = true 
        ORDER BY credits ASC
      `
      return result as CreditPackage[]
    } catch (error) {
      console.error('❌ Error getting credit packages:', error)
      return []
    }
  }

  async createCreditPackage(
    name: string,
    credits: number,
    priceUsd: number,
    stripePriceId?: string
  ): Promise<CreditPackage> {
    try {
      const result = await this.sql`
        INSERT INTO credit_packages (name, credits, price, price_usd, is_active, active, stripe_price_id)
        VALUES (${name}, ${credits}, ${Math.round(priceUsd * 100)}, ${priceUsd}, true, true, ${stripePriceId || null})
        RETURNING *
      `
      // Ensure proper type checking for result access
      if (Array.isArray(result) && result.length > 0) {
        return result[0] as CreditPackage
      }
      throw new Error('Failed to create credit package - no result returned')
    } catch (error) {
      console.error('❌ Error creating credit package:', error)
      throw error
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.sql`SELECT 1 as health`
      return true
    } catch (error) {
      console.error('Database health check failed:', error)
      return false
    }
  }

  // Clean up old transactions (optional)
  async cleanupOldTransactions(daysOld: number = 90): Promise<number> {
    try {
      const result = await this.sql`
        DELETE FROM transactions 
        WHERE created_at < NOW() - INTERVAL '${daysOld} days'
        RETURNING COUNT(*)
      `
      const deletedCount = (Array.isArray(result) && result.length > 0) ? (result[0] as any)?.count || 0 : 0
      console.log(`Cleaned up ${deletedCount} old transactions`)
      return deletedCount
    } catch (error) {
      console.error('Error cleaning up old transactions:', error)
      return 0
    }
  }
}

// Create and export the database instance
const neonDatabase = new NeonDatabase()

export default neonDatabase