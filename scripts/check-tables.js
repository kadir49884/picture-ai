// Check actual table structures in Neon database
const { neon } = require('@neondatabase/serverless')

async function checkTableStructures() {
  try {
    require('dotenv').config({ path: '.env.local' })
    
    const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL
    const sql = neon(databaseUrl)
    
    console.log('🔍 Checking table structures in Neon database...\n')
    
    // Get all tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    
    for (const table of tables) {
      const tableName = table.table_name
      console.log(`📋 Table: ${tableName}`)
      console.log('=' .repeat(50))
      
      // Get column information
      const columns = await sql`
        SELECT 
          column_name, 
          data_type, 
          is_nullable,
          column_default,
          character_maximum_length
        FROM information_schema.columns 
        WHERE table_name = ${tableName}
        AND table_schema = 'public'
        ORDER BY ordinal_position
      `
      
      columns.forEach(col => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'
        const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : ''
        const maxLen = col.character_maximum_length ? `(${col.character_maximum_length})` : ''
        console.log(`   ${col.column_name}: ${col.data_type}${maxLen} ${nullable}${defaultVal}`)
      })
      
      // Get sample data if exists
      try {
        const sampleData = await sql`SELECT * FROM ${sql(tableName)} LIMIT 3`
        if (sampleData.length > 0) {
          console.log('\n📊 Sample data:')
          sampleData.forEach((row, index) => {
            console.log(`   Row ${index + 1}:`, JSON.stringify(row, null, 2))
          })
        } else {
          console.log('\n📊 No data in this table')
        }
      } catch (error) {
        console.log('\n❌ Error reading sample data:', error.message)
      }
      
      console.log('\n')
    }
    
  } catch (error) {
    console.error('❌ Error checking table structures:', error)
  }
}

checkTableStructures()