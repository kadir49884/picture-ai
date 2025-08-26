// Database type checker script
console.log('🔍 Checking which database is being used...\n')

// Check environment variables
console.log('📋 Environment Variables:')
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set (Neon)' : '❌ Not set')
console.log('NEON_DATABASE_URL:', process.env.NEON_DATABASE_URL ? '✅ Set (Neon)' : '❌ Not set')
console.log('POSTGRES_URL:', process.env.POSTGRES_URL ? '✅ Set (Neon)' : '❌ Not set')

// Import and test database
const database = require('../lib/database.ts')

console.log('\n🔍 Testing database connection...')

// Test the database
async function testDatabase() {
  try {
    // Test health check
    const isHealthy = await database.default.healthCheck()
    console.log('Health check:', isHealthy ? '✅ Healthy' : '❌ Failed')
    
    // Try to get a user (this will show which DB is being used)
    console.log('\n📊 Testing user retrieval...')
    const testUser = await database.default.getUserByEmail('test@example.com')
    console.log('Test user result:', testUser)
    
    console.log('\n🎯 RESULT:')
    if (process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL) {
      console.log('✅ Using NEON POSTGRESQL')
      console.log('   Connection string detected')
    } else {
      console.log('⚠️  Using LOCAL JSON DATABASE (Fallback)')
      console.log('   No DATABASE_URL found')
    }
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message)
    console.log('🔄 Likely using LOCAL JSON DATABASE (Fallback)')
  }
}

testDatabase()