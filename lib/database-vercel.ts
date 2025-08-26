// Vercel için basit in-memory database sistemi
// Production'da MongoDB, PostgreSQL vb. ile değiştirilebilir

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

// In-memory storage (Vercel için geçici çözüm)
class MemoryDatabase {
  private users: User[] = []
  private transactions: Transaction[] = []
  private creditPackages: CreditPackage[] = []
  private nextUserId = 1
  private nextTransactionId = 1
  private nextPackageId = 1

  constructor() {
    this.initDefaultPackages()
  }

  private initDefaultPackages() {
    const packages = [
      { name: 'Starter Pack', credits: 20, price: 2500 },
      { name: 'Popular Pack', credits: 50, price: 5000 },
      { name: 'Pro Pack', credits: 100, price: 8000 },
      { name: 'Business Pack', credits: 500, price: 30000 }
    ]

    this.creditPackages = packages.map(pkg => ({
      id: this.nextPackageId++,
      ...pkg,
      is_active: true
    }))
  }

  // User operations
  async createUser(email: string, passwordHash: string): Promise<{ id: number; changes: number }> {
    const user: User = {
      id: this.nextUserId++,
      email,
      password_hash: passwordHash,
      credits: 3,
      total_generated: 0,
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString()
    }
    
    this.users.push(user)
    return { id: user.id, changes: 1 }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email)
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id)
  }

  async updateUserCredits(userId: number, credits: number): Promise<{ id: number; changes: number }> {
    const user = this.users.find(u => u.id === userId)
    if (user) {
      user.credits = credits
      return { id: userId, changes: 1 }
    }
    return { id: userId, changes: 0 }
  }

  async addCredits(userId: number, credits: number): Promise<{ id: number; changes: number }> {
    const user = this.users.find(u => u.id === userId)
    if (user) {
      user.credits += credits
      return { id: userId, changes: 1 }
    }
    return { id: userId, changes: 0 }
  }

  async useUserCredit(userId: number, prompt: string): Promise<boolean> {
    const user = this.users.find(u => u.id === userId)
    if (!user || user.credits < 1) {
      return false
    }
    
    user.credits -= 1
    user.total_generated += 1
    
    // Transaction kaydet
    const transaction: Transaction = {
      id: this.nextTransactionId++,
      user_id: userId,
      type: 'usage',
      credits: -1,
      prompt,
      created_at: new Date().toISOString()
    }
    
    this.transactions.push(transaction)
    return true
  }

  async recordPurchase(userId: number, credits: number, amount: number, stripeSessionId: string): Promise<{ id: number; changes: number }> {
    await this.addCredits(userId, credits)
    
    const transaction: Transaction = {
      id: this.nextTransactionId++,
      user_id: userId,
      type: 'purchase',
      credits,
      amount,
      stripe_session_id: stripeSessionId,
      created_at: new Date().toISOString()
    }
    
    this.transactions.push(transaction)
    return { id: transaction.id, changes: 1 }
  }

  async getCreditPackages(): Promise<CreditPackage[]> {
    return this.creditPackages.filter(pkg => pkg.is_active)
  }

  async getUserTransactions(userId: number, limit: number = 50): Promise<Transaction[]> {
    return this.transactions
      .filter(t => t.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit)
  }

  // Generic database methods for compatibility
  async run(sql: string, params: any[] = []): Promise<{ id: number; changes: number }> {
    // Bu method backwards compatibility için
    console.log('SQL command (memory db):', sql, params)
    return { id: 0, changes: 1 }
  }

  async get(sql: string, params: any[] = []): Promise<any> {
    console.log('SQL get (memory db):', sql, params)
    return null
  }

  async all(sql: string, params: any[] = []): Promise<any[]> {
    console.log('SQL all (memory db):', sql, params)
    return []
  }
}

// Singleton instance
const database = new MemoryDatabase()
export default database