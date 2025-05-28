import { cookies } from "next/headers"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function getSession() {
  const cookieStore = cookies()
  const supabase = createServerSupabaseClient()

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}
