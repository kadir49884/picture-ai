import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const headers = request.headers
  
  // Get all CSP-related headers
  const cspHeaders = {
    'Content-Security-Policy': headers.get('Content-Security-Policy'),
    'Content-Security-Policy-Report-Only': headers.get('Content-Security-Policy-Report-Only'),
    'X-Frame-Options': headers.get('X-Frame-Options'),
    'X-CSP-Disabled': headers.get('X-CSP-Disabled'),
    'X-CSP-Ultra-Permissive': headers.get('X-CSP-Ultra-Permissive'),
    'X-Middleware-Active': headers.get('X-Middleware-Active'),
    'X-Frame-Bypass': headers.get('X-Frame-Bypass')
  }
  
  const response = NextResponse.json({
    success: true,
    message: 'CSP Test Endpoint',
    timestamp: new Date().toISOString(),
    headers: cspHeaders,
    userAgent: headers.get('User-Agent')
  })
  
  // Ensure our ultra-permissive CSP is set
  const ultraPermissiveCSP = [
    "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
    "script-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
    "style-src * 'unsafe-inline' data:",
    "img-src * data: blob:",
    "font-src * data:",
    "connect-src *",
    "media-src * data: blob:",
    "object-src *",
    "child-src * data: blob:",
    "frame-src * data: blob:",
    "worker-src * data: blob:",
    "form-action *",
    "base-uri *",
    "manifest-src *"
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', ultraPermissiveCSP)
  response.headers.set('X-Frame-Options', 'ALLOWALL')
  response.headers.set('X-CSP-Test', 'active')
  
  return response
}