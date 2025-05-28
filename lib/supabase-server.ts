import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"

// Export createClient as a named export
export { createClient } from "@supabase/supabase-js"

// Create a function that safely gets cookies only within a request context
const getCookieStore = () => {
  try {
    return cookies()
  } catch (error) {
    console.warn("Attempted to access cookies outside of a request context")
    return {
      get: () => undefined,
      set: () => {},
      delete: () => {},
    }
  }
}

export function createServerSupabaseClient(options = {}) {
  const cookieStore = getCookieStore()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
      set(name, value, options) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // This can happen in middleware when the cookies cannot be modified
          console.error("Error setting cookie:", error)
        }
      },
      remove(name, options) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          console.error("Error removing cookie:", error)
        }
      },
    },
    ...options,
  })
}

// Create a server-side Supabase client that doesn't rely on cookies
// This is safe to use outside of request contexts
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)
