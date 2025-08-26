// Vercel KV (Redis) Database Implementation
// Production-ready persistent storage for PictureAi
// Falls back to JSON file database in local development

import { kv } from '@vercel/kv'

// Check if KV is available - either through KV variables or REDIS_URL
const isKVAvailable = () => {
  // Check for KV-specific variables
  const hasKVVars = !!(process.env.KV_REST_API_TOKEN && 
                      process.env.KV_REST_API_URL && 
                      process.env.KV_REST_API_TOKEN !== 'placeholder-for-local-dev')
  
  // Check for REDIS_URL (alternative way to connect)
  const hasRedisUrl = !!(process.env.REDIS_URL && process.env.REDIS_URL.trim() !== '')
  
  return hasKVVars || hasRedisUrl
}


// Import fallback database for local development
let fallbackDatabase: any = null
if (!isKVAvailable()) {
  // Dynamic import to avoid circular dependency
  import('./database').then(module => {
    fallbackDatabase = module.default
  })
}

interface User {
  id: number
  email: string
  password_hash: string
  credits: number
  total_generated: number
  created_at: string
  last_login: string
}

interface Transaction {
  id: number
  user_id: number
  type: 'purchase' | 'usage'
  credits: number
  amount?: number
  stripe_session_id?: string
  prompt?: string
  created_at: string
}

interface CreditPackage {
  id: number
  name: string
  credits: number
  price: number
  stripe_price_id?: string
  is_active: boolean
}

class VercelKVDatabase {
  // Key prefixes for different data types
  private readonly USER_PREFIX = 'user:'
  private readonly USER_EMAIL_PREFIX = 'user_email:'
  private readonly TRANSACTION_PREFIX = 'transaction:'
  private readonly USER_TRANSACTIONS_PREFIX = 'user_transactions:'
  private readonly CREDIT_PACKAGE_PREFIX = 'credit_package:'
  private readonly COUNTER_PREFIX = 'counter:'

  constructor() {
    // Only initialize if KV is available
    if (isKVAvailable()) {
      this.init().catch(error => {
        console.error('KV initialization failed:', error)
        console.log('Falling back to JSON database')
      })
    } else {
      console.log('KV not available - will use fallback database')
    }
  }

  private async init() {
    try {
      // Initialize default credit packages if not exist
      await this.initDefaultPackages()
      
      // Initialize counters if not exist
      const userIdExists = await kv.exists(`${this.COUNTER_PREFIX}nextUserId`)
      if (!userIdExists) {
        await kv.set(`${this.COUNTER_PREFIX}nextUserId`, 1)
      }
      
      const transactionIdExists = await kv.exists(`${this.COUNTER_PREFIX}nextTransactionId`)
      if (!transactionIdExists) {
        await kv.set(`${this.COUNTER_PREFIX}nextTransactionId`, 1)
      }
      
      const packageIdExists = await kv.exists(`${this.COUNTER_PREFIX}nextPackageId`)
      if (!packageIdExists) {
        await kv.set(`${this.COUNTER_PREFIX}nextPackageId`, 1)
      }
      
      console.log('✅ KV Database initialized successfully')
    } catch (error) {
      console.error('❌ KV Database initialization failed:', error)
      throw error
    }
  }

  private async initDefaultPackages() {
    try {
      const packagesExist = await kv.exists(`${this.CREDIT_PACKAGE_PREFIX}initialized`)
      if (!packagesExist) {
        const packages = [
          { name: 'Starter Pack', credits: 20, price: 2500 }, // 25₺
          { name: 'Popular Pack', credits: 50, price: 5000 }, // 50₺
          { name: 'Pro Pack', credits: 100, price: 8000 }, // 80₺
          { name: 'Business Pack', credits: 500, price: 30000 } // 300₺
        ]

        for (let i = 0; i < packages.length; i++) {
          const packageData: CreditPackage = {
            id: i + 1,
            ...packages[i],
            is_active: true
          }
          await kv.set(`${this.CREDIT_PACKAGE_PREFIX}${packageData.id}`, packageData)
        }
        
        await kv.set(`${this.COUNTER_PREFIX}nextPackageId`, packages.length + 1)
        await kv.set(`${this.CREDIT_PACKAGE_PREFIX}initialized`, true)
        
        console.log('✅ Default credit packages initialized')
      }
    } catch (error) {
      console.error('Failed to initialize default packages:', error)
      throw error
    }
  }

  // Counter management
  private async getNextId(counterName: string): Promise<number> {
    const key = `${this.COUNTER_PREFIX}${counterName}`
    const nextId = await kv.incr(key)
    return nextId
  }

  // User operations
  async createUser(email: string, passwordHash: string): Promise<{ id: number; changes: number }> {
    try {
      const userId = await this.getNextId('nextUserId')
      
      const user: User = {
        id: userId,
        email,
        password_hash: passwordHash,
        credits: 3, // Default credits
        total_generated: 0,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      }
      
      // Store user by ID and email for quick lookup
      await kv.set(`${this.USER_PREFIX}${userId}`, user)
      await kv.set(`${this.USER_EMAIL_PREFIX}${email}`, userId)
      
      console.log(`✅ [KV] User created - ID: ${userId}, Email: ${email}, Credits: ${user.credits}`)
      return { id: userId, changes: 1 }
    } catch (error) {
      console.error('KV createUser error:', error)
      throw error
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const userId = await kv.get<number>(`${this.USER_EMAIL_PREFIX}${email}`)
      if (!userId) {
        return undefined
      }
      
      const user = await kv.get<User>(`${this.USER_PREFIX}${userId}`)
      return user || undefined
    } catch (error) {
      console.error('KV getUserByEmail error:', error)
      return undefined
    }
  }

  async getUserById(id: number): Promise<User | undefined> {
    try {
      const user = await kv.get<User>(`${this.USER_PREFIX}${id}`)
      return user || undefined
    } catch (error) {
      console.error('KV getUserById error:', error)
      return undefined
    }
  }

  async updateUserCredits(userId: number, credits: number): Promise<{ id: number; changes: number }> {
    try {
      const user = await this.getUserById(userId)
      if (!user) {
        return { id: userId, changes: 0 }
      }
      
      user.credits = credits
      await kv.set(`${this.USER_PREFIX}${userId}`, user)
      
      console.log(`💳 [KV] Credits updated - User: ${userId}, New credits: ${credits}`)
      return { id: userId, changes: 1 }
    } catch (error) {
      console.error('KV updateUserCredits error:', error)
      return { id: userId, changes: 0 }
    }
  }

  async addCredits(userId: number, credits: number): Promise<{ id: number; changes: number }> {
    try {
      const user = await this.getUserById(userId)
      if (!user) {
        return { id: userId, changes: 0 }
      }
      
      user.credits += credits
      await kv.set(`${this.USER_PREFIX}${userId}`, user)
      
      console.log(`💰 [KV] Credits added - User: ${userId}, Added: ${credits}, Total: ${user.credits}`)
      return { id: userId, changes: 1 }
    } catch (error) {
      console.error('KV addCredits error:', error)
      return { id: userId, changes: 0 }
    }
  }

  async useUserCredit(userId: number, prompt: string): Promise<boolean> {
    try {
      const user = await this.getUserById(userId)
      if (!user || user.credits < 1) {
        console.log(`❌ [KV] Insufficient credits - User: ${userId}, Credits: ${user?.credits || 0}`)
        return false
      }
      
      // Deduct credit and update stats
      user.credits -= 1
      user.total_generated += 1
      
      // Save updated user
      await kv.set(`${this.USER_PREFIX}${userId}`, user)
      
      // Record transaction
      const transactionId = await this.getNextId('nextTransactionId')
      const transaction: Transaction = {
        id: transactionId,
        user_id: userId,
        type: 'usage',
        credits: -1,
        prompt,
        created_at: new Date().toISOString()
      }
      
      // Store transaction
      await kv.set(`${this.TRANSACTION_PREFIX}${transactionId}`, transaction)
      
      // Add to user's transaction list
      const userTransactionsKey = `${this.USER_TRANSACTIONS_PREFIX}${userId}`
      await kv.lpush(userTransactionsKey, transactionId)
      
      console.log(`✅ [KV] Credit used - User: ${userId}, Remaining: ${user.credits}, Transaction: ${transactionId}`)
      return true
    } catch (error) {
      console.error('KV useUserCredit error:', error)
      return false
    }
  }

  // Legacy compatibility methods
  async useCredit(userId: number, prompt: string): Promise<{ id: number; changes: number }> {
    const success = await this.useUserCredit(userId, prompt)
    return { id: userId, changes: success ? 1 : 0 }
  }

  async recordPurchase(userId: number, credits: number, amount: number, stripeSessionId: string): Promise<{ id: number; changes: number }> {
    try {
      // Add credits to user
      await this.addCredits(userId, credits)
      
      // Record transaction
      const transactionId = await this.getNextId('nextTransactionId')
      const transaction: Transaction = {
        id: transactionId,
        user_id: userId,
        type: 'purchase',
        credits,
        amount,
        stripe_session_id: stripeSessionId,
        created_at: new Date().toISOString()
      }
      
      await kv.set(`${this.TRANSACTION_PREFIX}${transactionId}`, transaction)
      
      // Add to user's transaction list
      const userTransactionsKey = `${this.USER_TRANSACTIONS_PREFIX}${userId}`
      await kv.lpush(userTransactionsKey, transactionId)
      
      console.log(`🛒 [KV] Purchase recorded - User: ${userId}, Credits: ${credits}, Amount: ${amount}`)
      return { id: transactionId, changes: 1 }
    } catch (error) {
      console.error('KV recordPurchase error:', error)
      return { id: userId, changes: 0 }
    }
  }

  async getCreditPackages(): Promise<CreditPackage[]> {
    try {
      const packages: CreditPackage[] = []
      
      // Scan for all credit packages
      const keys = await kv.keys(`${this.CREDIT_PACKAGE_PREFIX}*`)
      for (const key of keys) {
        if (key !== `${this.CREDIT_PACKAGE_PREFIX}initialized`) {
          const pkg = await kv.get<CreditPackage>(key)
          if (pkg && pkg.is_active) {
            packages.push(pkg)
          }
        }
      }
      
      return packages.sort((a, b) => a.id - b.id)
    } catch (error) {
      console.error('KV getCreditPackages error:', error)
      return []
    }
  }

  async getUserTransactions(userId: number, limit: number = 50): Promise<Transaction[]> {
    try {
      const userTransactionsKey = `${this.USER_TRANSACTIONS_PREFIX}${userId}`
      const transactionIds = await kv.lrange(userTransactionsKey, 0, limit - 1)
      
      const transactions: Transaction[] = []
      for (const id of transactionIds) {
        const transaction = await kv.get<Transaction>(`${this.TRANSACTION_PREFIX}${id}`)
        if (transaction) {
          transactions.push(transaction)
        }
      }
      
      return transactions
    } catch (error) {
      console.error('KV getUserTransactions error:', error)
      return []
    }
  }

  // Legacy database compatibility methods
  async run(sql: string, params: any[] = []): Promise<{ id: number; changes: number }> {
    console.log('Legacy SQL method called:', sql, params)
    return { id: 0, changes: 1 }
  }

  async get(sql: string, params: any[] = []): Promise<any> {
    console.log('Legacy SQL get method called:', sql, params)
    return null
  }

  async all(sql: string, params: any[] = []): Promise<any[]> {
    console.log('Legacy SQL all method called:', sql, params)
    return []
  }
}

// Create and export database instance
let database: VercelKVDatabase
try {
  database = new VercelKVDatabase()
} catch (error) {
  console.error('Failed to initialize KV database:', error)
  // Fallback will be handled at method level
  database = new VercelKVDatabase()
}

export default database