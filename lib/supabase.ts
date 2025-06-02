import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Use the environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

// Create a single supabase client for the browser with improved auth configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'sb-auth-token',
    storage: {
      getItem: (key) => {
        try {
          if (typeof window === 'undefined') return null
          const itemStr = localStorage.getItem(key)
          if (!itemStr) return null
          
          const item = JSON.parse(itemStr)
          return item
        } catch (err) {
          console.error('Error reading from localStorage:', err)
          return null
        }
      },
      setItem: (key, value) => {
        try {
          if (typeof window === 'undefined') return
          localStorage.setItem(key, JSON.stringify(value))
          // Also set a cookie for server-side auth
          document.cookie = `sb-auth-token=${JSON.stringify(value)}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
        } catch (err) {
          console.error('Error writing to localStorage:', err)
        }
      },
      removeItem: (key) => {
        try {
          if (typeof window === 'undefined') return
          localStorage.removeItem(key)
          // Also remove the cookie
          document.cookie = `sb-auth-token=; path=/; max-age=0; SameSite=Lax`
        } catch (err) {
          console.error('Error removing from localStorage:', err)
        }
      },
    },
  },
  global: {
    headers: { 'x-application-name': 'homeschool-dashboard' },
    fetch: (...args) => {
      const [url, config] = args
      return fetch(url as string, {
        ...config as RequestInit,
        signal: AbortSignal.timeout(25000) // 25 second timeout
      })
    }
  },
})

// Create a single supabase server client for server-side operations
export const supabaseServer = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: { 'x-application-name': 'homeschool-dashboard-server' },
    },
  }
)

// Re-export the createClient function with a warning
export const createClientWithWarning = (...args: Parameters<typeof createClient>) => {
  console.warn(
    'Warning: Using createClient directly is deprecated. Import { supabase } from "@/lib/supabase" instead.'
  )
  return createClient(...args)
}

// Helper function to get the current user
export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    
    if (error) throw error
    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Helper function to get students for a parent
export async function getStudentsForParent(parentId: string) {
  // If parentId is undefined, null, or empty string, return empty array
  if (!parentId) {
    console.log("No parent ID provided, returning empty student list")
    return []
  }

  // Clean the parentId to ensure it's a valid UUID format
  const cleanParentId = parentId.replace(/[^a-fA-F0-9-]/g, "")

  // Validate that we have a proper UUID format (basic check)
  if (cleanParentId.length < 32) {
    console.error("Invalid parent ID format:", parentId)
    return []
  }

  console.log("Fetching students for parent ID:", cleanParentId)

  const { data, error } = await supabase
    .from("student")
    .select()
    .eq("parent_id", cleanParentId)

  if (error) {
    console.error("Error fetching students:", error)
    return []
  }

  return data
}

// Helper function to create a new student
export async function createStudent(studentData: Database['public']['tables']['student']['Insert']) {
  const { data, error } = await supabase
    .from("student")
    .insert([studentData])
    .select()

  if (error) {
    console.error("Error creating student:", error)
    throw error
  }

  return data[0]
}

// Helper function to update a student
export async function updateStudent(
  studentId: string, 
  updateData: Database['public']['tables']['student']['Update']
) {
  // Clean the studentId to ensure it's a valid UUID format
  const cleanStudentId = studentId.replace(/[^a-fA-F0-9-]/g, "")

  const { data, error } = await supabase
    .from("student")
    .update(updateData)
    .match({ id: cleanStudentId })
    .select()

  if (error) {
    console.error("Error updating student:", error)
    throw error
  }

  return data[0]
}

// Helper function to get a parent profile
export async function getParentIntakeForm(parentId: string) {
  // Clean the parentId to ensure it's a valid UUID format
  const cleanParentId = parentId.replace(/[^a-fA-F0-9-]/g, "")

  const { data, error } = await supabase
    .from("parent_intake_form")
    .select()
    .match({ parent_id: cleanParentId })
    .single()

  if (error) {
    console.error("Error fetching parent intake form:", error)
    return null
  }

  return data
}

// Helper function to create or update a parent intake form
export async function upsertParentIntakeForm(
  formData: Database['public']['tables']['parent_intake_form']['Insert'] | Database['public']['tables']['parent_intake_form']['Update']
) {
  // Ensure the ID is clean if it exists in the formData
  if ('id' in formData && formData.id) {
    formData.id = formData.id.replace(/[^a-fA-F0-9-]/g, "")
  }

  const { data, error } = await supabase
    .from("parent_intake_form")
    .upsert(formData)
    .select()

  if (error) {
    console.error("Error upserting parent intake form:", error)
    throw error
  }

  return data[0]
}

// Helper function to get a term plan by ID
export async function getTermPlanById(termPlanId: string) {
  if (!termPlanId) {
    console.error("No term plan ID provided")
    return null
  }

  try {
    console.log("Fetching term plan with ID:", termPlanId)

    const { data, error } = await supabase
      .from("term_plans")
      .select()
      .match({ id: termPlanId })
      .single()

    if (error) {
      console.error("Error fetching term plan:", error)
      return null
    }

    console.log("Term plan fetched successfully:", data)
    return data
  } catch (error) {
    console.error("Exception fetching term plan:", error)
    return null
  }
}

// Helper function to get student term plans for a term plan
export async function getStudentTermPlans(termPlanId: string) {
  if (!termPlanId) {
    console.error("No term plan ID provided")
    return []
  }

  try {
    console.log("Fetching student term plans for term plan ID:", termPlanId)

    const { data, error } = await supabase
      .from("student_term_plans")
      .select()
      .match({ term_plan_id: termPlanId })

    if (error) {
      console.error("Error fetching student term plans:", error)
      return []
    }

    console.log("Student term plans fetched successfully:", data)
    return data || []
  } catch (error) {
    console.error("Exception fetching student term plans:", error)
    return []
  }
}
