// Database Adapter - Smart switching between KV and JSON file
// Uses Vercel KV in production, JSON file in local development

// Check if we have KV credentials available
const hasKVCredentials = () => {
  return !!(
    process.env.KV_REST_API_TOKEN && 
    process.env.KV_REST_API_URL && 
    process.env.KV_REST_API_TOKEN !== 'placeholder-for-local-dev'
  )
}

let database: any

if (hasKVCredentials()) {
  console.log('🚀 Using Vercel KV Database (Production)')
  // Dynamic import to avoid errors when KV credentials are not available
  database = import('@/lib/database-kv').then(module => module.default)
} else {
  console.log('💻 Using JSON File Database (Development)')
  database = import('@/lib/database').then(module => module.default)
}

// Export the database instance
export default database