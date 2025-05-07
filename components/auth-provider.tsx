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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on initial load
  useEffect(() => {
    const checkSession = async () => {
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
          localStorage.setItem("user", JSON.stringify(newUser))
        } else {
          // Fallback to stored user if needed
          const storedUser = localStorage.getItem("user")
          if (storedUser) {
            setUser(JSON.parse(storedUser))
          }
        }
      } catch (error) {
        console.error("Session check error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

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
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        localStorage.removeItem("user")
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

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
