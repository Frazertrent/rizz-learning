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
  logout: () => Promise<void>
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
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        throw sessionError
      }

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
        return newUser
      }

      return null
    } catch (error) {
      console.error("Session check error:", error)
      return null
    }
  }

  // Initialize auth state
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
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      } else if (event === "TOKEN_REFRESHED") {
        // Session was refreshed, update the user state
        await checkSession()
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
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, checkSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
