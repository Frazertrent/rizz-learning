"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

export default function AuthRedirectPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check authentication status first
    const checkAuthAndRedirect = async () => {
      try {
        console.log("Checking authentication status...")

        // Give a moment for the auth state to propagate
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Check if user is authenticated
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        if (data.session) {
          console.log("User is authenticated, proceeding with redirect to /parent")
          setIsAuthenticated(true)

          // Short delay before redirect
          setTimeout(() => {
            window.location.href = "/parent"
          }, 500)
        } else {
          console.log("User is not authenticated, redirecting to login")
          setError("Authentication required. Please log in.")
          setIsAuthenticated(false)

          // Redirect back to login with a clear message
          setTimeout(() => {
            window.location.href = "/login?redirect=/parent-intake&auth_error=true"
          }, 2000)
        }
      } catch (err) {
        console.error("Error checking authentication:", err)
        setError("An error occurred while checking authentication.")
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndRedirect()
  }, [])

  // Manual redirect function as a fallback
  const handleManualRedirect = () => {
    window.location.href = "/parent"
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6 bg-card rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">
          {isLoading ? "Checking authentication..." : isAuthenticated ? "Redirecting..." : "Authentication Required"}
        </h1>

        {isLoading && <p className="mb-4">Please wait while we verify your login...</p>}

        {isAuthenticated && <p className="mb-4">You are being redirected to the parent intake form.</p>}

        {error && <p className="mb-4 text-red-500">{error}</p>}

        <div
          className={`mt-4 mb-6 ${isLoading || isAuthenticated ? "block" : "hidden"} animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mx-auto`}
        ></div>

        {!isLoading && isAuthenticated && (
          <Button onClick={handleManualRedirect} className="mt-4">
            Click here if not redirected automatically
          </Button>
        )}

        {!isLoading && !isAuthenticated && (
          <Button onClick={() => (window.location.href = "/login?redirect=/parent-intake")} className="mt-4">
            Return to Login
          </Button>
        )}
      </div>
    </div>
  )
}
