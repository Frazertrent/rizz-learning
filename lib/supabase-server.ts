import { createClient } from "@supabase/supabase-js"

// Re-export createClient
export { createClient }

// Server-side Supabase client
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

// Create a supabaseServer instance that can be imported directly
export const supabaseServer = createServerSupabaseClient()
