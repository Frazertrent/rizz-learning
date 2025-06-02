import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client for the middleware
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

// Public paths that don't require authentication
const publicPaths = [
  '/login',
  '/signup',
  '/auth-redirect',
  '/api',
  '/_next',
  '/static',
  '/favicon.ico',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is public
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  try {
    // Get the auth token from the cookie
    const authCookie = request.cookies.get('sb-auth-token')?.value
    
    if (!authCookie) {
      // No auth token found, redirect to login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Parse the auth cookie
    let session
    try {
      session = JSON.parse(authCookie)
    } catch (e) {
      console.error('Error parsing auth cookie:', e)
      // Invalid cookie format, redirect to login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check if the session is expired
    if (session.expires_at && session.expires_at < Math.floor(Date.now() / 1000)) {
      // Session is expired, redirect to login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Valid session exists, allow the request
    return NextResponse.next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    // If there's an error, redirect to login as a fallback
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
