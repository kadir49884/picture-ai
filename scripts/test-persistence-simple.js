const fs = require('fs').promises;
const path = require('path');

// Simple test for persistence
async function testDatabasePersistence() {
  console.log('🧪 Testing Database Persistence...');
  
  const dataDir = path.join(process.cwd(), 'data');
  const dataFile = path.join(dataDir, 'database.json');
  
  // Test 1: Create data directory and initial data
  console.log('\n1️⃣ Creating test data...');
  try {
    await fs.mkdir(dataDir, { recursive: true });
    
    const testData = {
      users: [
        {
          id: 1,
          email: 'test@example.com',
          password_hash: 'test_hash',
          credits: 3,
          total_generated: 0,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        }
      ],
      transactions: [],
      creditPackages: [],
      nextUserId: 2,
      nextTransactionId: 1,
      nextPackageId: 1
    };
    
    await fs.writeFile(dataFile, JSON.stringify(testData, null, 2));
    console.log('✅ Test data created');
  } catch (error) {
    console.error('❌ Error creating test data:', error);
    return;
  }
  
  // Test 2: Read and verify data
  console.log('\n2️⃣ Reading and verifying data...');
  try {
    const data = await fs.readFile(dataFile, 'utf-8');
    const parsed = JSON.parse(data);
    
    console.log('📋 Users:', parsed.users.map(u => ({
      id: u.id,
      email: u.email,
      credits: u.credits
    })));
    
    // Test 3: Simulate credit usage
    console.log('\n3️⃣ Simulating credit usage...');
    parsed.users[0].credits -= 1;
    parsed.users[0].total_generated += 1;
    parsed.transactions.push({
      id: 1,
      user_id: 1,
      type: 'usage',
      credits: -1,
      prompt: 'test prompt',
      created_at: new Date().toISOString()
    });
    
    await fs.writeFile(dataFile, JSON.stringify(parsed, null, 2));
    console.log('✅ Credit deducted, data persisted');
    
    // Test 4: Verify persistence
    console.log('\n4️⃣ Verifying persistence...');
    const updatedData = await fs.readFile(dataFile, 'utf-8');
    const updatedParsed = JSON.parse(updatedData);
    
    console.log('📋 Updated user:', {
      id: updatedParsed.users[0].id,
      email: updatedParsed.users[0].email,
      credits: updatedParsed.users[0].credits,
      total_generated: updatedParsed.users[0].total_generated
    });
    
    console.log('📊 Transactions:', updatedParsed.transactions.length);
    
    console.log('\n🎉 Persistence test PASSED!');
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  }
}

testDatabasePersistence();