// API Rate Limiting Middleware
// Protects against abuse and ensures fair usage

import { NextRequest, NextResponse } from 'next/server'

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  message: string // Error message
  skipSuccessfulRequests?: boolean // Don't count successful requests
  skipFailedRequests?: boolean // Don't count failed requests
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

// In-memory store (for Vercel, consider Redis for production)
const store: RateLimitStore = {}

// Default configurations for different endpoints
export const RATE_LIMIT_CONFIGS = {
  GENERATE_IMAGE: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5, // 5 images per minute
    message: 'Çok fazla görsel oluşturma isteği. Dakikada en fazla 5 görsel oluşturabilirsiniz.'
  },
  AUTH_ENDPOINTS: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10, // 10 auth attempts per 15 minutes
    message: 'Çok fazla giriş denemesi. 15 dakika sonra tekrar deneyin.'
  },
  GENERAL_API: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
    message: 'Çok fazla API isteği. Lütfen yavaşlayın.'
  }
} as const

export function createRateLimiter(config: RateLimitConfig) {
  return async function rateLimitMiddleware(
    request: NextRequest,
    identifier?: string
  ): Promise<{ success: boolean; response?: NextResponse }> {
    
    // Generate identifier (IP + user email if available)
    const defaultIdentifier = getClientIdentifier(request)
    const key = identifier || defaultIdentifier
    
    const now = Date.now()
    const windowStart = now - config.windowMs
    
    // Clean up old entries
    Object.keys(store).forEach(storeKey => {
      if (store[storeKey].resetTime < windowStart) {
        delete store[storeKey]
      }
    })
    
    // Check current user's rate limit
    const userLimit = store[key]
    
    if (!userLimit || userLimit.resetTime < windowStart) {
      // First request in window or window expired
      store[key] = {
        count: 1,
        resetTime: now + config.windowMs
      }
      return { success: true }
    }
    
    if (userLimit.count >= config.maxRequests) {
      // Rate limit exceeded
      const resetTimeSeconds = Math.ceil((userLimit.resetTime - now) / 1000)
      
      return {
        success: false,
        response: NextResponse.json(
          {
            error: config.message,
            retryAfter: resetTimeSeconds,
            limit: config.maxRequests,
            windowMs: config.windowMs
          },
          { 
            status: 429,
            headers: {
              'Retry-After': resetTimeSeconds.toString(),
              'X-RateLimit-Limit': config.maxRequests.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': userLimit.resetTime.toString()
            }
          }
        )
      }
    }
    
    // Increment counter
    userLimit.count++
    
    return { success: true }
  }
}

function getClientIdentifier(request: NextRequest): string {
  // Try to get user email from session/headers
  const userEmail = request.headers.get('x-user-email') || ''
  
  // Get IP address (works on Vercel)
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwardedFor?.split(',')[0] || realIp || 'unknown'
  
  // Combine email and IP for more accurate rate limiting
  return userEmail ? `${userEmail}:${ip}` : ip
}

// Middleware wrapper for Next.js API routes
export function withRateLimit(config: RateLimitConfig) {
  return function(handler: Function) {
    return async function rateLimitedHandler(request: NextRequest, ...args: any[]) {
      const rateLimiter = createRateLimiter(config)
      const result = await rateLimiter(request)
      
      if (!result.success) {
        return result.response
      }
      
      // Continue with original handler
      return handler(request, ...args)
    }
  }
}

// Specific rate limiters for common use cases
export const imageGenerationRateLimit = createRateLimiter(RATE_LIMIT_CONFIGS.GENERATE_IMAGE)
export const authRateLimit = createRateLimiter(RATE_LIMIT_CONFIGS.AUTH_ENDPOINTS)
export const generalApiRateLimit = createRateLimiter(RATE_LIMIT_CONFIGS.GENERAL_API)

// Utility to clear rate limit for a user (admin function)
export function clearRateLimit(identifier: string) {
  delete store[identifier]
}

// Utility to get current rate limit status
export function getRateLimitStatus(identifier: string, config: RateLimitConfig) {
  const userLimit = store[identifier]
  const now = Date.now()
  
  if (!userLimit || userLimit.resetTime < now) {
    return {
      count: 0,
      remaining: config.maxRequests,
      resetTime: null
    }
  }
  
  return {
    count: userLimit.count,
    remaining: Math.max(0, config.maxRequests - userLimit.count),
    resetTime: userLimit.resetTime
  }
}