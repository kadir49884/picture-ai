// Fix existing users' credits from 10 to 3
require('dotenv').config({ path: '.env.local' })

const { neon } = require('@neondatabase/serverless')
const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL
const sql = neon(databaseUrl)

async function fixUserCredits() {
  try {
    console.log('🔧 Fixing user credits from 10 to 3...\n')
    
    // Check current users with 10 credits
    const usersWithTenCredits = await sql`
      SELECT id, email, credits 
      FROM users 
      WHERE credits = 10
    `
    
    if (usersWithTenCredits.length === 0) {
      console.log('✅ No users found with 10 credits - all users already have correct credits!')
      return
    }
    
    console.log(`Found ${usersWithTenCredits.length} users with 10 credits:`)
    usersWithTenCredits.forEach(user => {
      console.log(`   - ${user.email} (ID: ${user.id}) - Credits: ${user.credits}`)
    })
    
    // Update them to 3 credits
    console.log('\n🔄 Updating credits to 3...')
    const updateResult = await sql`
      UPDATE users 
      SET credits = 3, updated_at = CURRENT_TIMESTAMP
      WHERE credits = 10
    `
    
    console.log(`✅ Updated ${usersWithTenCredits.length} users successfully!`)
    
    // Verify the changes
    console.log('\n📋 Verifying changes...')
    const updatedUsers = await sql`
      SELECT id, email, credits, updated_at
      FROM users 
      ORDER BY updated_at DESC
    `
    
    console.log('\\n👥 All users after update:')
    updatedUsers.forEach(user => {
      console.log(`   - ${user.email} (ID: ${user.id}) - Credits: ${user.credits}`)
    })
    
    // Check if any users still have wrong credits
    const stillWrongCredits = await sql`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE credits > 3 AND credits != 25 AND credits != 65  -- Excluding test users with purchased credits
    `
    
    if (stillWrongCredits[0].count === 0) {
      console.log('\\n🎉 All users now have correct default credits (3)!')
    } else {
      console.log(`\\n⚠️ ${stillWrongCredits[0].count} users still have unusual credit amounts`)
    }
    
  } catch (error) {
    console.error('❌ Failed to fix user credits:', error)
  }
}

fixUserCredits()