"use server"
import { createClient } from "@supabase/supabase-js"
import type { TermPlanData } from "@/components/parent/term-plan-builder"
import { revalidatePath } from "next/cache"

// Get Supabase URL and keys from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function saveTermPlan(termPlanData: TermPlanData, userId: string) {
  try {
    if (!userId) {
      console.error("No user ID provided")
      return { success: false, error: "No user ID provided" }
    }

    console.log("Using user ID:", userId)

    // Create a Supabase client with the service role key for admin operations
    // This ensures we can perform operations regardless of the user's session state
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if a term plan already exists for this user and term
    const { data: existingPlans, error: queryError } = await supabase
      .from("term_plans")
      .select("id")
      .eq("user_id", userId)
      .eq("academic_term", termPlanData.academicTerm)
      .eq("term_type", termPlanData.termType)
      .eq("term_year", termPlanData.termYear)

    if (queryError) {
      console.error("Error querying existing term plans:", queryError)
      return { success: false, error: queryError.message }
    }

    let termPlanId: string

    // Prepare the term plan data for insertion/update
    const termPlanInsertData = {
      user_id: userId,
      academic_term: termPlanData.academicTerm,
      term_type: termPlanData.termType,
      term_year: termPlanData.termYear,
      goals: termPlanData.goals,
      data: termPlanData, // Store the full data object
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // If a plan exists, update it; otherwise, insert a new one
    if (existingPlans && existingPlans.length > 0) {
      termPlanId = existingPlans[0].id

      // Remove created_at from update data
      const updateData = { ...termPlanInsertData }
      delete updateData.created_at

      const { error: updateError } = await supabase.from("term_plans").update(updateData).eq("id", termPlanId)

      if (updateError) {
        console.error("Error updating term plan:", updateError)
        return { success: false, error: updateError.message }
      }
    } else {
      // Insert a new term plan
      const { data: insertData, error: insertError } = await supabase
        .from("term_plans")
        .insert(termPlanInsertData)
        .select("id")

      if (insertError) {
        console.error("Error inserting term plan:", insertError)
        return { success: false, error: insertError.message }
      }

      if (!insertData || insertData.length === 0) {
        console.error("No term plan ID returned after insert")
        return { success: false, error: "Failed to create term plan" }
      }

      termPlanId = insertData[0].id
    }

    // Save student-specific data
    for (const [studentId, studentData] of Object.entries(termPlanData.students)) {
      // Check if a student term plan already exists
      const { data: existingStudentPlans, error: studentQueryError } = await supabase
        .from("student_term_plans")
        .select("id")
        .eq("term_plan_id", termPlanId)
        .eq("student_id", studentId)

      if (studentQueryError) {
        console.error(`Error querying student term plan for student ${studentId}:`, studentQueryError)
        continue // Skip this student but continue with others
      }

      // Prepare student data for insertion/update
      const studentInsertData = {
        term_plan_id: termPlanId,
        student_id: studentId,
        schedule: studentData.schedule,
        activities: studentData.activities,
        custom_activities: studentData.customActivities,
        subjects: studentData.subjects,
        block_assignments: studentData.blockAssignments || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      if (existingStudentPlans && existingStudentPlans.length > 0) {
        // Update existing student term plan
        // Remove created_at from update data
        const updateStudentData = { ...studentInsertData }
        delete updateStudentData.created_at

        const { error: updateStudentError } = await supabase
          .from("student_term_plans")
          .update(updateStudentData)
          .eq("id", existingStudentPlans[0].id)

        if (updateStudentError) {
          console.error(`Error updating student term plan for student ${studentId}:`, updateStudentError)
          continue // Skip this student but continue with others
        }
      } else {
        // Insert new student term plan
        const { error: insertStudentError } = await supabase.from("student_term_plans").insert(studentInsertData)

        if (insertStudentError) {
          console.error(`Error inserting student term plan for student ${studentId}:`, insertStudentError)
          continue // Skip this student but continue with others
        }
      }
    }

    // Revalidate the term plan overview page and dashboard
    revalidatePath("/parent/term-plan-overview")
    revalidatePath("/parent/dashboard")
    revalidatePath("/parent")
    revalidatePath("/")

    return { success: true, termPlanId }
  } catch (error) {
    console.error("Unexpected error in saveTermPlan:", error)
    return { success: false, error: String(error) }
  }
}
