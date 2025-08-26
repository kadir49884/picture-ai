// Test the actual /api/generate endpoint
const fs = require('fs')

async function testGenerateAPI() {
  try {
    console.log('🧪 Testing /api/generate endpoint...\n')
    
    // Test simple text-to-image request
    const testData = {
      prompt: 'a beautiful sunset',
      mode: 'text-to-image'
    }
    
    console.log('📤 Sending request:', testData)
    
    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'next-auth.session-token=dummy'  // Dummy session for testing
      },
      body: JSON.stringify(testData)
    })
    
    console.log('📥 Response status:', response.status)
    console.log('📥 Response headers:', Object.fromEntries(response.headers))
    
    const data = await response.json()
    console.log('📥 Response data:', JSON.stringify(data, null, 2))
    
    if (response.ok) {
      console.log('✅ API test successful!')
    } else {
      console.log('❌ API test failed:', data.error)
    }
    
  } catch (error) {
    console.error('❌ API test error:', error.message)
  }
}

// Start local server first if not running
const { spawn } = require('child_process')

async function main() {
  console.log('🚀 Starting local development server...')
  
  // Start the dev server
  const server = spawn('npm', ['run', 'dev'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true
  })
  
  let serverReady = false
  
  server.stdout.on('data', (data) => {
    const output = data.toString()
    console.log('Server output:', output)
    
    if (output.includes('Local:') || output.includes('localhost:3000')) {
      if (!serverReady) {
        serverReady = true
        console.log('✅ Server is ready, testing API...')
        // Wait a bit more then test
        setTimeout(() => {
          testGenerateAPI()
        }, 3000)
      }
    }
  })
  
  server.stderr.on('data', (data) => {
    console.error('Server error:', data.toString())
  })
  
  // Clean up after 30 seconds
  setTimeout(() => {
    console.log('🛑 Stopping test server...')
    server.kill()
    process.exit(0)
  }, 30000)
}

// Run the test
main()