import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Use the environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

// Create a single supabase client for the browser
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper function to get the current user
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

// Helper function to get students for a parent
export async function getStudentsForParent(parentId: string) {
  const { data, error } = await supabase.from("student").select("*").eq("parent_id", parentId)

  if (error) {
    console.error("Error fetching students:", error)
    return []
  }

  return data
}

// Helper function to create a new student
export async function createStudent(studentData: any) {
  const { data, error } = await supabase.from("student").insert(studentData).select()

  if (error) {
    console.error("Error creating student:", error)
    throw error
  }

  return data[0]
}

// Helper function to update a student
export async function updateStudent(studentId: string, updateData: any) {
  const { data, error } = await supabase.from("student").update(updateData).eq("id", studentId).select()

  if (error) {
    console.error("Error updating student:", error)
    throw error
  }

  return data[0]
}

// Helper function to get a parent profile
export async function getParentProfile(parentId: string) {
  const { data, error } = await supabase.from("parent_profile").select("*").eq("id", parentId).single()

  if (error) {
    console.error("Error fetching parent profile:", error)
    return null
  }

  return data
}

// Helper function to create or update a parent profile
export async function upsertParentProfile(profileData: any) {
  const { data, error } = await supabase.from("parent_profile").upsert(profileData).select()

  if (error) {
    console.error("Error upserting parent profile:", error)
    throw error
  }

  return data[0]
}
