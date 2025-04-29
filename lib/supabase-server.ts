import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// This is for server components and server actions only
// Do not import this in client components

if (!process.env.SUPABASE_URL) {
  throw new Error("Missing env.SUPABASE_URL")
}

if (!process.env.SUPABASE_ANON_KEY) {
  throw new Error("Missing env.SUPABASE_ANON_KEY")
}

export const supabaseServer = createClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
