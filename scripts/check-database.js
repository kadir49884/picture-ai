const fs = require('fs').promises;
const path = require('path');

async function checkDatabase() {
  const dataFilePath = path.join(process.cwd(), 'data', 'database.json');
  
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    const parsed = JSON.parse(data);
    
    console.log('🗃️ Database Contents:');
    console.log('====================');
    console.log('Users:', parsed.users?.map(u => ({
      id: u.id,
      email: u.email,
      credits: u.credits,
      total_generated: u.total_generated
    })));
    console.log('Transactions:', parsed.transactions?.length || 0);
    console.log('Next User ID:', parsed.nextUserId);
    
  } catch (error) {
    console.log('❌ Database file not found or error reading:', error.message);
  }
}

checkDatabase();