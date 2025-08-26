// BACKUP SOLUTION: If you're still getting CSP errors
// Replace the content of middleware.ts with this:

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // COMPLETELY DISABLE CSP - for development only
  response.headers.delete('Content-Security-Policy')
  response.headers.delete('Content-Security-Policy-Report-Only')
  
  // Add permissive headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'no-referrer-when-downgrade')
  
  return response
}

// Apply to all routes
// No config = applies everywhere