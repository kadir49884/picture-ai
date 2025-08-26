console.log('🔍 Database Type Checker\n')

console.log('📋 Environment Variables:')
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ NEON (Set)' : '❌ Not set')
console.log('NEON_DATABASE_URL:', process.env.NEON_DATABASE_URL ? '✅ NEON (Set)' : '❌ Not set') 
console.log('POSTGRES_URL:', process.env.POSTGRES_URL ? '✅ NEON (Set)' : '❌ Not set')

const hasNeonDB = !!(process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL)

console.log('\n🎯 DATABASE TYPE:')
if (hasNeonDB) {
  console.log('✅ Using NEON POSTGRESQL')
  console.log('   - Full SQL support')
  console.log('   - Relations & foreign keys') 
  console.log('   - Production ready')
} else {
  console.log('⚠️  Using LOCAL JSON DATABASE (Fallback)')
  console.log('   - Mock data only')
  console.log('   - Development mode')
  console.log('   - No persistent storage')
}

console.log('\n📝 How to check:')
console.log('1. Check .env.local file for DATABASE_URL')
console.log('2. Look for "✅ Using Neon PostgreSQL database" in server logs') 
console.log('3. Run this script to see current status')