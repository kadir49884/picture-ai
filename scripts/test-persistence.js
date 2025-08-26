const Database = require('./lib/database.ts');

async function testPersistence() {
  console.log('🧪 Testing Database Persistence...');
  
  // Import the database
  const { default: database } = await import('./lib/database.js');
  
  // Test 1: Create a user
  console.log('\n1️⃣ Creating test user...');
  const result = await database.createUser('test@example.com', 'test_hash');
  console.log('User created:', result);
  
  // Test 2: Check user exists
  console.log('\n2️⃣ Checking user exists...');
  const user = await database.getUserByEmail('test@example.com');
  console.log('User found:', { id: user?.id, email: user?.email, credits: user?.credits });
  
  // Test 3: Use credit
  console.log('\n3️⃣ Using 1 credit...');
  if (user) {
    const creditUsed = await database.useUserCredit(user.id, 'test prompt');
    console.log('Credit used:', creditUsed);
    
    const updatedUser = await database.getUserByEmail('test@example.com');
    console.log('Updated user:', { id: updatedUser?.id, credits: updatedUser?.credits });
  }
  
  console.log('\n✅ Test completed! Check data/database.json file.');
}

testPersistence().catch(console.error);