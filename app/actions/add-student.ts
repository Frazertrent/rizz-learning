"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function addStudent(formData: FormData) {
  try {
    // Get form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const grade = formData.get("grade") as string
    const parentId = formData.get("parentId") as string

    if (!firstName || !lastName || !grade || !parentId) {
      return {
        success: false,
        error: "Missing required fields",
      }
    }

    // Create the student in Supabase
    const { data, error } = await supabase
      .from("student")
      .insert({
        parent_id: parentId,
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
        grade_level: grade,
        username: `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
        assigned_tools: [],
        schedule_json: {},
        expectations: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error("Error adding student:", error)
      return {
        success: false,
        error: error.message,
      }
    }

    // Revalidate the parent dashboard page to show the new student
    revalidatePath("/parent")
    revalidatePath("/parent/dashboard")

    return {
      success: true,
      student: data[0],
    }
  } catch (error) {
    console.error("Error in addStudent action:", error)
    return {
      success: false,
      error: (error as Error).message,
    }
  }
}
