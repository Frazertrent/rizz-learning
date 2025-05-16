"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

type User = {
  id: string
  name: string
  email: string
  role: "parent" | "student" | "mentor" | "admin"
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  checkSession: () => Promise<User | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session
  const checkSession = async (): Promise<User | null> => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        // Determine role based on email for demo purposes
        let role: "parent" | "student" | "mentor" | "admin" = "parent"
        const email = session.user.email || ""

        if (email.includes("student")) {
          role = "student"
        } else if (email.includes("mentor")) {
          role = "mentor"
        } else if (email.includes("admin")) {
          role = "admin"
        }

        const newUser = {
          id: session.user.id,
          name: email.split("@")[0],
          email,
          role,
        }

        setUser(newUser)

        // Store in localStorage for persistence
        localStorage.setItem("user", JSON.stringify(newUser))

        // Refresh the session to extend it
        await supabase.auth.refreshSession()

        return newUser
      } else {
        // Fallback to stored user if needed
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)

          // Try to refresh the session if we have a stored user
          try {
            await supabase.auth.refreshSession()
          } catch (refreshError) {
            console.warn("Could not refresh session:", refreshError)
          }

          return parsedUser
        }
      }
      return null
    } catch (error) {
      console.error("Session check error:", error)
      return null
    }
  }

  // Check for existing session on initial load
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true)
      await checkSession()
      setIsLoading(false)
    }

    initAuth()

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        // Determine role based on email for demo purposes
        let role: "parent" | "student" | "mentor" | "admin" = "parent"
        const email = session.user.email || ""

        if (email.includes("student")) {
          role = "student"
        } else if (email.includes("mentor")) {
          role = "mentor"
        } else if (email.includes("admin")) {
          role = "admin"
        }

        const newUser = {
          id: session.user.id,
          name: email.split("@")[0],
          email,
          role,
        }

        setUser(newUser)
        localStorage.setItem("user", JSON.stringify(newUser))

        // Also store the user ID separately for easier access
        localStorage.setItem("userId", session.user.id)

        // Set a cookie for the user ID to help with server-side auth
        document.cookie = `userId=${session.user.id}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        localStorage.removeItem("user")
        localStorage.removeItem("userId")

        // Clear the userId cookie
        document.cookie = "userId=; path=/; max-age=0; SameSite=Lax"
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Role is determined by email for demo purposes
      let role: "parent" | "student" | "mentor" | "admin" = "parent"

      if (email.includes("student")) {
        role = "student"
      } else if (email.includes("mentor")) {
        role = "mentor"
      } else if (email.includes("admin")) {
        role = "admin"
      }

      const user = {
        id: data.user.id,
        name: email.split("@")[0],
        email,
        role,
      }

      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      localStorage.removeItem("user")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, checkSession }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
