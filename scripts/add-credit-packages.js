// Add credit packages to Neon database
require('dotenv').config({ path: '.env.local' })

const { neon } = require('@neondatabase/serverless')
const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL
const sql = neon(databaseUrl)

async function addCreditPackages() {
  try {
    console.log('💎 Adding credit packages to Neon database...\n')
    
    // Check if packages already exist
    const existingPackages = await sql`SELECT COUNT(*) as count FROM credit_packages`
    
    if (existingPackages[0].count > 0) {
      console.log('⚠️ Credit packages already exist. Clearing old packages...')
      await sql`DELETE FROM credit_packages`
    }
    
    // Add new credit packages
    const packages = [
      {
        name: 'Starter Pack',
        credits: 50,
        price: 999, // $9.99 in cents
        price_usd: 9.99,
        stripe_price_id: 'price_starter_pack'
      },
      {
        name: 'Popular Pack', 
        credits: 150,
        price: 1999, // $19.99 in cents
        price_usd: 19.99,
        stripe_price_id: 'price_popular_pack'
      },
      {
        name: 'Pro Pack',
        credits: 300,
        price: 3499, // $34.99 in cents  
        price_usd: 34.99,
        stripe_price_id: 'price_pro_pack'
      },
      {
        name: 'Business Pack',
        credits: 750,
        price: 7999, // $79.99 in cents
        price_usd: 79.99,
        stripe_price_id: 'price_business_pack'
      }
    ]
    
    console.log('📦 Adding credit packages...')
    
    for (const pkg of packages) {
      const result = await sql`
        INSERT INTO credit_packages (name, credits, price, price_usd, is_active, active, stripe_price_id)
        VALUES (${pkg.name}, ${pkg.credits}, ${pkg.price}, ${pkg.price_usd}, true, true, ${pkg.stripe_price_id})
        RETURNING *
      `
      console.log(`   ✅ ${pkg.name}: ${pkg.credits} credits for $${pkg.price_usd}`)
    }
    
    // Verify the packages were added
    console.log('\n📋 Verifying credit packages...')
    const allPackages = await sql`
      SELECT *, 
             COALESCE(active, is_active) as is_active_resolved,
             COALESCE(price_usd, price::decimal / 100) as price_usd_resolved
      FROM credit_packages 
      WHERE COALESCE(active, is_active, true) = true 
      ORDER BY credits ASC
    `
    
    console.log(`\\n💰 Available credit packages (${allPackages.length} total):`)
    allPackages.forEach((pkg, index) => {
      const pricePerCredit = (pkg.price_usd_resolved / pkg.credits).toFixed(3)
      console.log(`   ${index + 1}. ${pkg.name}`)
      console.log(`      📊 Credits: ${pkg.credits}`)
      console.log(`      💵 Price: $${pkg.price_usd_resolved}`)
      console.log(`      📈 Per Credit: $${pricePerCredit}`)
      console.log(`      🆔 Stripe ID: ${pkg.stripe_price_id}`)
      console.log('')
    })
    
    console.log('✅ Credit packages setup completed!')
    console.log('🚀 Users can now see and purchase credit packages!')
    
  } catch (error) {
    console.error('❌ Failed to add credit packages:', error)
  }
}

addCreditPackages()