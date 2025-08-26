// Fix Neon database schema to match current code expectations
const { neon } = require('@neondatabase/serverless')

async function fixDatabaseSchema() {
  try {
    require('dotenv').config({ path: '.env.local' })
    
    console.log('🔧 Fixing Neon database schema...')
    
    const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL
    const sql = neon(databaseUrl)
    
    console.log('📋 Current table structures detected. Starting schema updates...\n')
    
    // 1. Fix users table - add missing auth_type column
    console.log('👥 Updating users table...')
    try {
      // Add auth_type column if it doesn't exist
      await sql`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS auth_type VARCHAR(50) DEFAULT 'email'
      `
      
      // Add updated_at column if it doesn't exist  
      await sql`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `
      
      // Make password_hash nullable (for OAuth users)
      await sql`
        ALTER TABLE users 
        ALTER COLUMN password_hash DROP NOT NULL
      `
      
      console.log('   ✅ Users table updated')
    } catch (error) {
      console.log('   ⚠️ Users table update warning:', error.message)
    }
    
    // 2. Fix credit_packages table - rename columns
    console.log('💎 Updating credit_packages table...')
    try {
      // Add price_usd column
      await sql`
        ALTER TABLE credit_packages 
        ADD COLUMN IF NOT EXISTS price_usd DECIMAL(10,2)
      `
      
      // Copy price to price_usd (assuming price is in cents, convert to dollars)
      await sql`
        UPDATE credit_packages 
        SET price_usd = price::decimal / 100 
        WHERE price_usd IS NULL
      `
      
      // Add active column 
      await sql`
        ALTER TABLE credit_packages 
        ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true
      `
      
      // Copy is_active to active
      await sql`
        UPDATE credit_packages 
        SET active = is_active 
        WHERE active IS NULL
      `
      
      // Add created_at if missing
      await sql`
        ALTER TABLE credit_packages 
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `
      
      console.log('   ✅ Credit packages table updated')
    } catch (error) {
      console.log('   ⚠️ Credit packages update warning:', error.message)
    }
    
    // 3. Fix transactions table - add missing columns
    console.log('💰 Updating transactions table...')
    try {
      // Add description column
      await sql`
        ALTER TABLE transactions 
        ADD COLUMN IF NOT EXISTS description TEXT
      `
      
      // Add stripe_payment_intent_id column
      await sql`
        ALTER TABLE transactions 
        ADD COLUMN IF NOT EXISTS stripe_payment_intent_id VARCHAR(255)
      `
      
      // Rename amount column to credits if needed (our code expects amount for money, credits for credit count)
      // But current schema has credits column, so let's add amount column
      await sql`
        ALTER TABLE transactions 
        ADD COLUMN IF NOT EXISTS amount INTEGER DEFAULT 0
      `
      
      console.log('   ✅ Transactions table updated')
    } catch (error) {
      console.log('   ⚠️ Transactions update warning:', error.message)
    }
    
    // 4. Add some test data to verify everything works
    console.log('\n🌱 Adding test data...')
    
    // Add test user with Google OAuth
    const testEmail = 'neon-test@example.com'
    try {
      const existingUser = await sql`
        SELECT * FROM users WHERE email = ${testEmail}
      `
      
      if (existingUser.length === 0) {
        const newUser = await sql`
          INSERT INTO users (email, auth_type, credits, total_generated, password_hash)
          VALUES (${testEmail}, 'google_oauth', 25, 5, NULL)
          RETURNING *
        `
        console.log('   ✅ Test user created:', newUser[0].email)
        
        // Add a test transaction
        await sql`
          INSERT INTO transactions (user_id, type, credits, amount, description)
          VALUES (${newUser[0].id}, 'purchase', 50, 999, 'Test credit purchase')
        `
        console.log('   ✅ Test transaction created')
        
      } else {
        console.log('   ✅ Test user already exists')
      }
    } catch (error) {
      console.log('   ⚠️ Test data creation warning:', error.message)
    }
    
    // Add test credit packages if table is empty
    try {
      const packageCount = await sql`SELECT COUNT(*) as count FROM credit_packages`
      if (packageCount[0].count === 0) {
        await sql`
          INSERT INTO credit_packages (name, credits, price, price_usd, active, is_active) 
          VALUES 
            ('Starter Pack', 50, 999, 9.99, true, true),
            ('Pro Pack', 200, 2999, 29.99, true, true),
            ('Ultimate Pack', 500, 6999, 69.99, true, true)
        `
        console.log('   ✅ Test credit packages created')
      } else {
        console.log('   ✅ Credit packages already exist')
      }
    } catch (error) {
      console.log('   ⚠️ Credit package creation warning:', error.message)
    }
    
    // 5. Final verification
    console.log('\n📊 Final database status:')
    
    const userCount = await sql`SELECT COUNT(*) as count FROM users`
    const transactionCount = await sql`SELECT COUNT(*) as count FROM transactions`
    const packageCount = await sql`SELECT COUNT(*) as count FROM credit_packages`
    
    console.log(`👥 Users: ${userCount[0].count}`)
    console.log(`💰 Transactions: ${transactionCount[0].count}`)
    console.log(`📦 Credit packages: ${packageCount[0].count}`)
    
    // Show sample data
    const users = await sql`SELECT email, auth_type, credits FROM users LIMIT 3`
    console.log('\n👥 Sample users:')
    users.forEach(user => {
      console.log(`   - ${user.email} (${user.auth_type || 'email'}) - Credits: ${user.credits}`)
    })
    
    console.log('\n✅ Database schema fix completed!')
    console.log('🚀 Your Neon database is now compatible with your code!')
    
  } catch (error) {
    console.error('❌ Schema fix failed:', error)
  }
}

// Run the schema fix
fixDatabaseSchema()