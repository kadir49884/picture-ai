// Initialize Neon database and add test data
const { neon } = require('@neondatabase/serverless')

async function initializeAndTestDatabase() {
  try {
    require('dotenv').config({ path: '.env.local' })
    
    console.log('🚀 Initializing Neon database with test data...')
    
    const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL
    const sql = neon(databaseUrl)
    
    // Add some credit packages first
    console.log('💎 Adding credit packages...')
    await sql`
      INSERT INTO credit_packages (name, credits, price_usd, stripe_price_id, active) 
      VALUES 
        ('Starter Pack', 50, 9.99, 'price_starter', true),
        ('Pro Pack', 200, 29.99, 'price_pro', true),
        ('Ultimate Pack', 500, 69.99, 'price_ultimate', true)
      ON CONFLICT DO NOTHING
    `
    
    // Add a test user
    console.log('👤 Adding test user...')
    const testEmail = 'test@example.com'
    
    // Check if user already exists
    const existingUser = await sql`
      SELECT * FROM users WHERE email = ${testEmail}
    `
    
    if (existingUser.length === 0) {
      const newUser = await sql`
        INSERT INTO users (email, auth_type, credits, total_generated)
        VALUES (${testEmail}, 'google_oauth', 25, 3)
        RETURNING *
      `
      console.log('✅ Test user created:', newUser[0].email)
      
      // Add a test transaction for this user
      await sql`
        INSERT INTO transactions (user_id, type, amount, description)
        VALUES (${newUser[0].id}, 'purchase', 50, 'Test credit purchase')
      `
      console.log('💰 Test transaction created')
      
    } else {
      console.log('✅ Test user already exists')
    }
    
    // Verify the data
    console.log('\n📊 Database status after initialization:')
    
    const userCount = await sql`SELECT COUNT(*) as count FROM users`
    const transactionCount = await sql`SELECT COUNT(*) as count FROM transactions`
    const packageCount = await sql`SELECT COUNT(*) as count FROM credit_packages`
    
    console.log(`👥 Users: ${userCount[0].count}`)
    console.log(`💰 Transactions: ${transactionCount[0].count}`)
    console.log(`📦 Credit packages: ${packageCount[0].count}`)
    
    // Show recent users
    const users = await sql`
      SELECT email, auth_type, credits, total_generated, created_at 
      FROM users 
      ORDER BY created_at DESC
    `
    
    console.log('\n👥 All users in database:')
    users.forEach(user => {
      console.log(`   - ${user.email} (${user.auth_type}) - Credits: ${user.credits}, Generated: ${user.total_generated}`)
    })
    
    console.log('\n✅ Database initialization completed!')
    console.log('\n🔧 Now try signing in with Google OAuth to see if new users get created...')
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
  }
}

// Run the initialization
initializeAndTestDatabase()