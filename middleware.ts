import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Skip auth check for these paths
  if (path === "/auth-redirect" || path === "/login" || path.includes("/_next") || path.includes("/api/")) {
    return NextResponse.next()
  }

  // SPECIAL CASE: For parent-intake, add a cookie flag to prevent redirect loops
  if (path === "/parent-intake") {
    const redirectAttemptCookie = request.cookies.get("parent_intake_redirect_attempt")

    // If we've already tried to redirect once, let them through to prevent a loop
    if (redirectAttemptCookie) {
      console.log("Detected previous redirect attempt for /parent-intake, allowing access")
      const response = NextResponse.next()
      // Clear the cookie
      response.cookies.delete("parent_intake_redirect_attempt")
      return response
    }
  }

  // Check if the path is protected
  const isProtectedPath = path.startsWith("/parent/") || path.startsWith("/student/") || path === "/parent-intake"

  // Add exceptions for term plan pages and actions
  const isTermPlanPage =
    path === "/parent/term-plan-builder" ||
    path === "/parent/term-plan-overview" ||
    path.includes("/actions/save-term-plan")

  // If it's a term plan page, check for userId cookie as a fallback
  if (isTermPlanPage) {
    const userIdCookie = request.cookies.get("userId")
    const authCookie = request.cookies.get("sb-auth-token")

    // Allow access if userId cookie exists or if auth cookie exists
    if (userIdCookie || authCookie) {
      return NextResponse.next()
    }

    // Also check localStorage via a custom header that might be set by the client
    const userIdHeader = request.headers.get("x-user-id")
    if (userIdHeader) {
      const response = NextResponse.next()
      // Set the userId cookie from the header
      response.cookies.set("userId", userIdHeader, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      })
      return response
    }
  }

  if (isProtectedPath && !isTermPlanPage) {
    try {
      const supabase = createServerSupabaseClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      // If user is not authenticated, redirect to login
      if (!session) {
        // For parent-intake, set a cookie to track redirect attempts
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("redirect", path)

        const response = NextResponse.redirect(loginUrl)

        // Set a cookie to track that we've attempted a redirect for parent-intake
        if (path === "/parent-intake") {
          response.cookies.set("parent_intake_redirect_attempt", "true", {
            maxAge: 60, // 1 minute expiry
            path: "/",
          })
        }

        return response
      }

      // User is authenticated, allow access
      return NextResponse.next()
    } catch (error) {
      console.error("Auth middleware error:", error)
      // If there's an error, redirect to login as a fallback
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", path)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
