// Test FAL AI connection and API
const { fal } = require('@fal-ai/client')

async function testFalAI() {
  try {
    require('dotenv').config({ path: '.env.local' })
    
    console.log('🧪 Testing FAL AI connection...\n')
    
    // Check if FAL_KEY exists
    const falKey = process.env.FAL_KEY
    if (!falKey) {
      console.error('❌ FAL_KEY not found in environment variables')
      return
    }
    
    console.log('✅ FAL_KEY found:', falKey.substring(0, 10) + '...')
    
    // Configure FAL AI
    fal.config({
      credentials: falKey
    })
    
    console.log('🚀 Testing text-to-image generation...')
    
    // Test simple text-to-image
    const result = await fal.subscribe('fal-ai/flux-pro', {
      input: {
        prompt: 'a simple test image',
        image_size: 'landscape_4_3',
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        enable_safety_checker: true
      },
      logs: true,
      onQueueUpdate: (update) => {
        console.log('⏳ Queue update:', update.status)
      }
    })
    
    console.log('📊 FAL AI Response structure:')
    console.log('- Type:', typeof result)
    console.log('- Keys:', Object.keys(result))
    console.log('- Data keys:', result.data ? Object.keys(result.data) : 'No data key')
    console.log('- Images:', result.data?.images ? result.data.images.length : 'No images')
    
    if (result.data?.images && result.data.images.length > 0) {
      console.log('✅ FAL AI test successful!')
      console.log('🖼️ Generated image URL:', result.data.images[0].url)
      return true
    } else {
      console.error('❌ No images generated')
      console.log('Full response:', JSON.stringify(result, null, 2))
      return false
    }
    
  } catch (error) {
    console.error('❌ FAL AI test failed:', error)
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      status: error.status,
      statusCode: error.statusCode,
      response: error.response,
      stack: error.stack
    })
    return false
  }
}

// Run the test
testFalAI().then(success => {
  if (success) {
    console.log('\n🎉 FAL AI is working correctly!')
  } else {
    console.log('\n💥 FAL AI test failed - check configuration')
  }
}).catch(error => {
  console.error('\n💥 Test execution failed:', error)
})