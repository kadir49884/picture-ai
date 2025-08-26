// Input validation and sanitization utilities
// Protects against XSS, injection attacks, and inappropriate content

interface ValidationResult {
  isValid: boolean
  sanitized: string
  errors: string[]
  warnings: string[]
}

// List of potentially harmful patterns
const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /data:text\/html/gi,
  /vbscript:/gi,
  /<iframe/gi,
  /<object/gi,
  /<embed/gi,
  /<form/gi,
  /<input/gi,
]

// Inappropriate content keywords (basic filter)
const INAPPROPRIATE_KEYWORDS = [
  'explicit', 'nsfw', 'nude', 'naked', 'porn', 'sex', 'violence', 'kill', 'death',
  'bomb', 'terrorist', 'weapon', 'drug', 'illegal', 'hate', 'racism'
]

// Common prompt injection patterns
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+previous\s+instructions/gi,
  /forget\s+everything/gi,
  /system\s*:/gi,
  /assistant\s*:/gi,
  /you\s+are\s+now/gi,
  /new\s+instructions/gi,
  /override\s+instructions/gi,
]

export function validateAndSanitizePrompt(input: string): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    sanitized: input.trim(),
    errors: [],
    warnings: []
  }

  // Basic checks
  if (!input || input.trim().length === 0) {
    result.isValid = false
    result.errors.push('Prompt cannot be empty')
    return result
  }

  // Length validation
  if (input.length > 1000) {
    result.isValid = false
    result.errors.push('Prompt too long (maximum 1000 characters)')
  }

  if (input.length < 3) {
    result.isValid = false
    result.errors.push('Prompt too short (minimum 3 characters)')
  }

  // XSS and script injection protection
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(input)) {
      result.isValid = false
      result.errors.push('Potentially dangerous content detected')
      break
    }
  }

  // Prompt injection detection
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      result.isValid = false
      result.errors.push('Prompt injection attempt detected')
      break
    }
  }

  // Content appropriateness check
  const lowerInput = input.toLowerCase()
  for (const keyword of INAPPROPRIATE_KEYWORDS) {
    if (lowerInput.includes(keyword)) {
      result.isValid = false
      result.errors.push('Inappropriate content detected')
      break
    }
  }

  // Sanitization
  result.sanitized = input
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/[<>\"'&]/g, '') // Remove potentially dangerous characters
    .substring(0, 1000) // Enforce length limit

  // Additional warnings
  if (input.includes('http://') || input.includes('https://')) {
    result.warnings.push('URLs in prompts may not work as expected')
  }

  if (input.match(/\d{10,}/)) {
    result.warnings.push('Long number sequences detected')
  }

  return result
}

export function validateImageUrl(url: string): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    sanitized: url.trim(),
    errors: [],
    warnings: []
  }

  if (!url || url.trim().length === 0) {
    result.isValid = false
    result.errors.push('Image URL cannot be empty')
    return result
  }

  // URL format validation
  try {
    const parsedUrl = new URL(url)
    
    // Only allow http/https
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      result.isValid = false
      result.errors.push('Only HTTP/HTTPS URLs are allowed')
    }

    // Size limit for data URLs
    if (url.startsWith('data:')) {
      const sizeInBytes = url.length * 0.75 // Rough estimate for base64
      if (sizeInBytes > 10 * 1024 * 1024) { // 10MB limit
        result.isValid = false
        result.errors.push('Image data too large (max 10MB)')
      }
    }

  } catch (error) {
    result.isValid = false
    result.errors.push('Invalid URL format')
  }

  return result
}

// Rate limiting helper (simple in-memory implementation)
const requestCounts = new Map<string, { count: number; lastReset: number }>()

export function checkRateLimit(identifier: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now()
  const userLimit = requestCounts.get(identifier)

  if (!userLimit || now - userLimit.lastReset > windowMs) {
    requestCounts.set(identifier, { count: 1, lastReset: now })
    return true
  }

  if (userLimit.count >= maxRequests) {
    return false
  }

  userLimit.count++
  return true
}