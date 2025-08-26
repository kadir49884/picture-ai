// Check current data in Neon database
const { neon } = require('@neondatabase/serverless')

async function checkNeonData() {
  try {
    require('dotenv').config({ path: '.env.local' })
    
    const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL
    if (!databaseUrl) {
      console.log('❌ No DATABASE_URL found in environment variables')
      return
    }
    
    const sql = neon(databaseUrl)
    console.log('🔍 Checking current data in Neon database...\n')
    
    // 1. Check users table
    console.log('👥 USERS TABLE:')
    console.log('='.repeat(60))
    try {
      const users = await sql`
        SELECT id, email, auth_type, credits, total_generated, created_at 
        FROM users 
        ORDER BY created_at DESC
      `
      
      if (users.length === 0) {
        console.log('   📝 No users found in the database')
      } else {
        console.log(`   📊 Total users: ${users.length}`)
        console.log('   📋 User list:')
        users.forEach((user, idx) => {
          const date = new Date(user.created_at).toLocaleDateString()
          console.log(`   ${idx + 1}. ${user.email}`)
          console.log(`      - Auth Type: ${user.auth_type}`)
          console.log(`      - Credits: ${user.credits}`)
          console.log(`      - Generated: ${user.total_generated}`)
          console.log(`      - Created: ${date}`)
          console.log('')
        })
      }
    } catch (error) {
      console.log('   ❌ Users table error:', error.message)
    }
    
    // 2. Check transactions table
    console.log('\n💰 TRANSACTIONS TABLE:')
    console.log('='.repeat(60))
    try {
      const transactions = await sql`
        SELECT t.id, t.user_id, t.type, t.credits, t.amount, t.description, t.created_at,
               u.email as user_email
        FROM transactions t
        LEFT JOIN users u ON t.user_id = u.id
        ORDER BY t.created_at DESC 
        LIMIT 15
      `
      
      if (transactions.length === 0) {
        console.log('   📝 No transactions found in the database')
      } else {
        console.log(`   📊 Recent transactions (showing last 15):`)
        console.log('   📋 Transaction list:')
        transactions.forEach((tx, idx) => {
          const date = new Date(tx.created_at).toLocaleDateString()
          const time = new Date(tx.created_at).toLocaleTimeString()
          console.log(`   ${idx + 1}. ${tx.type.toUpperCase()} - ${tx.user_email || 'Unknown User'}`)
          console.log(`      - Credits: ${tx.credits || tx.amount || 0}`)
          console.log(`      - Description: ${tx.description || 'No description'}`)
          console.log(`      - Date: ${date} ${time}`)
          console.log('')
        })
      }
    } catch (error) {
      console.log('   ❌ Transactions table error:', error.message)
    }
    
    // 3. Check credit_packages table
    console.log('\n📦 CREDIT_PACKAGES TABLE:')
    console.log('='.repeat(60))
    try {
      const packages = await sql`
        SELECT id, name, credits, price, price_usd, active, is_active, created_at
        FROM credit_packages
        ORDER BY credits ASC
      `
      
      if (packages.length === 0) {
        console.log('   📝 No credit packages found in the database')
      } else {
        console.log(`   📊 Total packages: ${packages.length}`)
        console.log('   📋 Package list:')
        packages.forEach((pkg, idx) => {
          const isActive = pkg.active !== false && pkg.is_active !== false
          const price = pkg.price_usd || (pkg.price ? pkg.price / 100 : 0)
          console.log(`   ${idx + 1}. ${pkg.name}`)
          console.log(`      - Credits: ${pkg.credits}`)
          console.log(`      - Price: $${price}`)
          console.log(`      - Status: ${isActive ? '✅ Active' : '❌ Inactive'}`)
          console.log('')
        })
      }
    } catch (error) {
      console.log('   ❌ Credit packages table error:', error.message)
    }
    
    // 4. Database statistics and health
    console.log('\n📊 DATABASE STATISTICS:')
    console.log('='.repeat(60))
    try {
      const userCount = await sql`SELECT COUNT(*) as count FROM users`
      const transactionCount = await sql`SELECT COUNT(*) as count FROM transactions`
      const packageCount = await sql`SELECT COUNT(*) as count FROM credit_packages`
      
      // Total credits distributed
      const totalCredits = await sql`SELECT SUM(credits) as total FROM users`
      const totalGenerated = await sql`SELECT SUM(total_generated) as total FROM users`
      
      console.log(`   👥 Total users: ${userCount[0].count}`)
      console.log(`   💰 Total transactions: ${transactionCount[0].count}`)
      console.log(`   📦 Total credit packages: ${packageCount[0].count}`)
      console.log(`   💳 Total credits in system: ${totalCredits[0].total || 0}`)
      console.log(`   🎨 Total images generated: ${totalGenerated[0].total || 0}`)
      
      // Recent activity
      const recentActivity = await sql`
        SELECT COUNT(*) as count 
        FROM transactions 
        WHERE created_at > NOW() - INTERVAL '24 hours'
      `
      console.log(`   ⚡ Transactions in last 24h: ${recentActivity[0].count}`)
      
    } catch (error) {
      console.log('   ❌ Statistics error:', error.message)
    }
    
    // 5. Check table schemas
    console.log('\n🏗️ TABLE SCHEMAS:')
    console.log('='.repeat(60))
    try {
      const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name
      `
      
      console.log(`   📋 Available tables: ${tables.map(t => t.table_name).join(', ')}`)
      
    } catch (error) {
      console.log('   ❌ Schema check error:', error.message)
    }
    
    console.log('\n✅ Database check completed!')
    
  } catch (error) {
    console.error('❌ Database check failed:', error)
  }
}

// Run the check
checkNeonData()