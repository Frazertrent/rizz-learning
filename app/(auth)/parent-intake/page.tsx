"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { ParentIntakeForm } from "@/components/auth/parent-intake-form"

export default function ParentIntakePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Add a delay to ensure auth state is established
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const { data, error } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        if (data.session) {
          console.log("User is authenticated, showing parent intake form")
          setIsAuthenticated(true)
        } else {
          console.log("User is not authenticated, redirecting to login")
          // Use router.push instead of window.location for smoother transition
          router.push("/login?redirect=/parent-intake")
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        router.push("/login?redirect=/parent-intake")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return <ParentIntakeForm />
}
