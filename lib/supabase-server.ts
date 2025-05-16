import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Export createClient as a named export (required by the error message)
export { createClient } from "@supabase/supabase-js"

export function createServerSupabaseClient(options = {}) {
  const cookieStore = cookies()

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

// Create and export supabaseServer as a named export (required by the error message)
export const supabaseServer = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      get(name) {
        return cookies().get(name)?.value
      },
      set(name, value, options) {
        try {
          cookies().set({ name, value, ...options })
        } catch (error) {
          console.error("Error setting cookie in supabaseServer:", error)
        }
      },
      remove(name, options) {
        try {
          cookies().set({ name, value: "", ...options })
        } catch (error) {
          console.error("Error removing cookie in supabaseServer:", error)
        }
      },
    },
  },
)
