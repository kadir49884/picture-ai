// Environment variable validation utility
// Ensures all required environment variables are present at startup

interface EnvironmentConfig {
  FAL_KEY: string
  NEXTAUTH_URL: string
  NEXTAUTH_SECRET: string
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  JWT_SECRET?: string // Optional for backward compatibility
}

class EnvironmentValidationError extends Error {
  constructor(missingVars: string[]) {
    super(`Missing required environment variables: ${missingVars.join(', ')}`)
    this.name = 'EnvironmentValidationError'
  }
}

export function validateEnvironment(): EnvironmentConfig {
  const requiredVars = [
    'FAL_KEY',
    'NEXTAUTH_URL', 
    'NEXTAUTH_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
  ]

  const optionalVars = [
    'JWT_SECRET'
  ]

  // Database variables - check for Neon PostgreSQL
  const dbVars = [
    'DATABASE_URL',
    'NEON_DATABASE_URL',
    'POSTGRES_URL'
  ]

  const missingVars: string[] = []
  const config: Partial<EnvironmentConfig> = {}

  // Check required variables
  for (const varName of requiredVars) {
    const value = process.env[varName]
    
    if (!value || value.trim() === '') {
      missingVars.push(varName)
    } else {
      // Additional validation for specific variables
      if (varName === 'NEXTAUTH_SECRET' && value.length < 32) {
        console.warn(`⚠️  WARNING: ${varName} should be at least 32 characters long for security`)
      }

      if (varName === 'NEXTAUTH_URL' && !value.startsWith('http')) {
        console.warn(`⚠️  WARNING: ${varName} should be a valid URL starting with http/https`)
      }

      if (varName === 'FAL_KEY' && !value.includes(':')) {
        console.warn(`⚠️  WARNING: ${varName} might be invalid (should contain ':' separator)`)
      }

      config[varName as keyof EnvironmentConfig] = value
    }
  }

  // Check optional variables
  for (const varName of optionalVars) {
    const value = process.env[varName]
    if (value && value.trim() !== '') {
      if (varName === 'JWT_SECRET' && value.length < 32) {
        console.warn(`⚠️  WARNING: ${varName} should be at least 32 characters long for security`)
      }
      config[varName as keyof EnvironmentConfig] = value
    } else {
      console.warn(`⚠️  WARNING: Optional variable ${varName} not set`)
    }
  }

  // Check database variables - any one of DATABASE_URL, NEON_DATABASE_URL, or POSTGRES_URL
  const hasDbUrl = dbVars.some(varName => {
    const value = process.env[varName]
    return value && value.trim() !== '' && value !== 'placeholder-for-local-dev'
  })
  
  if (hasDbUrl) {
    console.log('✅ Neon PostgreSQL credentials found - Using persistent database')
  } else {
    console.log('⚠️  Database URL not found - Using fallback JSON database for development')
    console.log('🔧 For production, ensure Neon database is configured with DATABASE_URL')
  }

  if (missingVars.length > 0) {
    console.error('❌ Environment validation failed!')
    console.error('Missing variables:', missingVars)
    console.error('\n📋 Required environment variables:')
    requiredVars.forEach(varName => {
      const status = missingVars.includes(varName) ? '❌' : '✅'
      console.error(`${status} ${varName}`)
    })
    
    throw new EnvironmentValidationError(missingVars)
  }

  console.log('✅ Environment validation passed!')
  return config as EnvironmentConfig
}

// Validate on import (for server-side usage)
if (typeof window === 'undefined') {
  try {
    validateEnvironment()
  } catch (error) {
    console.error('Environment validation failed during import:', error)
    // Don't throw here to avoid breaking the build process
  }
}