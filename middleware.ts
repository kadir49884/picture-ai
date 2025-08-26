import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Simply disable CSP - no complex configurations
  response.headers.delete('Content-Security-Policy')
  response.headers.delete('Content-Security-Policy-Report-Only')
  
  return response
}