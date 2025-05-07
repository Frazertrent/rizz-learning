import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function middleware(request: NextRequest) {
  // Only protect specific paths
  if (request.nextUrl.pathname.startsWith("/parent/") || request.nextUrl.pathname.startsWith("/student/")) {
    const path = request.nextUrl.pathname
    const response = NextResponse.next()

    try {
      const supabase = createServerSupabaseClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      // If user is not authenticated, redirect to login
      if (!session) {
        const url = new URL("/login", request.url)
        url.searchParams.set("redirect", path)
        return NextResponse.redirect(url)
      }

      return response
    } catch (error) {
      console.error("Auth middleware error:", error)
      // If there's an error, redirect to login as a fallback
      const url = new URL("/login", request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/parent/:path*", "/student/:path*"],
}
