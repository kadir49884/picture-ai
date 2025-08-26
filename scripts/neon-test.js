// Test Neon database connection and check tables
const { neon } = require('@neondatabase/serverless')

async function testNeonDatabase() {
  try {
    // Load environment variables manually since this script doesn't auto-load .env.local
    require('dotenv').config({ path: '.env.local' })
    
    console.log('🔍 Testing Neon database connection...')
    
    const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL
    
    if (!databaseUrl) {
      console.error('❌ No DATABASE_URL found in environment variables')
      console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('DATABASE') || key.includes('NEON')))
      return
    }
    
    console.log('✅ Found DATABASE_URL:', databaseUrl.replace(/:[^:@]*@/, ':***@'))
    
    const sql = neon(databaseUrl)
    
    // Test basic connection
    console.log('\n📡 Testing database connection...')
    const connectionTest = await sql`SELECT NOW() as current_time, version() as postgres_version`
    console.log('✅ Connection successful!')
    console.log('⏰ Server time:', connectionTest[0].current_time)
    console.log('🗄️ PostgreSQL version:', connectionTest[0].postgres_version)
    
    // Check if tables exist
    console.log('\n📋 Checking existing tables...')
    const tables = await sql`
      SELECT table_name, table_schema 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    
    if (tables.length === 0) {
      console.log('⚠️ No tables found in database!')
      console.log('🔧 Need to run database initialization...')
    } else {
      console.log(`✅ Found ${tables.length} tables:`)
      tables.forEach(table => {
        console.log(`   - ${table.table_name}`)
      })
    }
    
    // Check users table specifically
    try {
      console.log('\n👥 Checking users table...')
      const userCount = await sql`SELECT COUNT(*) as count FROM users`
      console.log(`📊 Users in database: ${userCount[0].count}`)
      
      if (userCount[0].count > 0) {
        const recentUsers = await sql`
          SELECT email, auth_type, credits, total_generated, created_at 
          FROM users 
          ORDER BY created_at DESC 
          LIMIT 5
        `
        console.log('📋 Recent users:')
        recentUsers.forEach(user => {
          console.log(`   - ${user.email} (${user.auth_type}) - Credits: ${user.credits}, Generated: ${user.total_generated}`)
        })
      }
    } catch (error) {
      console.log('⚠️ Users table does not exist or has no data')
    }
    
    // Check transactions table
    try {
      console.log('\n💰 Checking transactions table...')
      const transactionCount = await sql`SELECT COUNT(*) as count FROM transactions`
      console.log(`📊 Transactions in database: ${transactionCount[0].count}`)
    } catch (error) {
      console.log('⚠️ Transactions table does not exist')
    }
    
    console.log('\n✅ Database test completed successfully!')
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
    
    if (error.message.includes('connect')) {
      console.log('\n🔧 Possible solutions:')
      console.log('1. Check if DATABASE_URL is correct in .env.local')
      console.log('2. Verify Neon database is running')
      console.log('3. Check network connectivity')
    }
  }
}

// Run the test
testNeonDatabase()