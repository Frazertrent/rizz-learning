import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// This is for client components only
// For server components and server actions, use supabase-server.ts

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL")
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY")
}

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)

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
export async function createStudent(studentData: Database["public"]["tables"]["student"]["Insert"]) {
  const { data, error } = await supabase.from("student").insert(studentData).select()

  if (error) {
    console.error("Error creating student:", error)
    throw error
  }

  return data[0]
}

// Helper function to update a student
export async function updateStudent(studentId: string, updateData: Database["public"]["tables"]["student"]["Update"]) {
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
export async function upsertParentProfile(profileData: Database["public"]["tables"]["parent_profile"]["Insert"]) {
  const { data, error } = await supabase.from("parent_profile").upsert(profileData).select()

  if (error) {
    console.error("Error upserting parent profile:", error)
    throw error
  }

  return data[0]
}
