"use server"
import { createClient } from "@supabase/supabase-js"
import type { TermPlanData } from "@/components/parent/term-plan-builder"
import { revalidatePath } from "next/cache"

// Get Supabase URL and keys from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Helper function to retry a function with exponential backoff
async function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries = 3, initialDelay = 500, factor = 2): Promise<T> {
  let numRetries = 0
  let delay = initialDelay

  while (true) {
    try {
      return await fn()
    } catch (error) {
      numRetries++
      if (numRetries >= maxRetries) {
        throw error
      }

      console.log(`Retrying after ${delay}ms...`)
      await new Promise((resolve) => setTimeout(resolve, delay))
      delay *= factor
    }
  }
}

export async function saveTermPlan(termPlanData: TermPlanData, userId: string, existingTermPlanId?: string) {
  try {
    if (!userId) {
      console.error("No user ID provided")
      return { success: false, error: "No user ID provided" }
    }

    console.log("Using user ID:", userId)
    console.log("Existing term plan ID:", existingTermPlanId || "None (creating new)")

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    })

    let termPlanId: string

    // If we have an existing term plan ID, use that
    if (existingTermPlanId) {
      termPlanId = existingTermPlanId

      // Update the existing term plan
      const updateData = {
        academic_term: termPlanData.academicTerm,
        term_type: termPlanData.termType,
        term_year: termPlanData.termYear,
        goals: termPlanData.goals,
        data: termPlanData,
        updated_at: new Date().toISOString(),
      }

      const { error: updateError } = await retryWithBackoff(() =>
        supabase.from("term_plans").update(updateData).eq("id", termPlanId),
      )

      if (updateError) {
        console.error("Error updating term plan:", updateError)
        return { success: false, error: updateError.message }
      }

      console.log("Updated existing term plan with ID:", termPlanId)
    } else {
      // Check if a term plan already exists for this user and term
      const { data: existingPlans, error: queryError } = await retryWithBackoff(() =>
        supabase
          .from("term_plans")
          .select("id")
          .eq("user_id", userId)
          .eq("academic_term", termPlanData.academicTerm)
          .eq("term_type", termPlanData.termType)
          .eq("term_year", termPlanData.termYear),
      )

      if (queryError) {
        console.error("Error querying existing term plans:", queryError)
        return { success: false, error: queryError.message }
      }

      if (existingPlans && existingPlans.length > 0) {
        // Use the existing term plan
        termPlanId = existingPlans[0].id

        const updateData = {
          goals: termPlanData.goals,
          data: termPlanData,
          updated_at: new Date().toISOString(),
          is_active: true,
        }

        const { error: updateError } = await retryWithBackoff(() =>
          supabase.from("term_plans").update(updateData).eq("id", termPlanId),
        )

        if (updateError) {
          console.error("Error updating term plan:", updateError)
          return { success: false, error: updateError.message }
        }

        console.log("Updated existing term plan with ID:", termPlanId)
      } else {
        // Create a new term plan
        const termPlanInsertData = {
          user_id: userId,
          academic_term: termPlanData.academicTerm,
          term_type: termPlanData.termType,
          term_year: termPlanData.termYear,
          goals: termPlanData.goals,
          data: termPlanData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_active: true,
        }

        const { data: insertData, error: insertError } = await retryWithBackoff(() =>
          supabase.from("term_plans").insert(termPlanInsertData).select("id"),
        )

        if (insertError) {
          console.error("Error inserting term plan:", insertError)
          return { success: false, error: insertError.message }
        }

        if (!insertData || insertData.length === 0) {
          console.error("No term plan ID returned after insert")
          return { success: false, error: "Failed to create term plan" }
        }

        termPlanId = insertData[0].id
        console.log("Created new term plan with ID:", termPlanId)
      }
    }

    // Save student-specific data linked to the term plan
    for (const [studentId, studentData] of Object.entries(termPlanData.students)) {
      // Clean the studentId to ensure it's a valid UUID format
      const cleanStudentId = studentId.replace(/[^a-fA-F0-9-]/g, "")

      // Check if this student already has a term plan for this term
      const { data: existingStudentPlans, error: studentQueryError } = await retryWithBackoff(() =>
        supabase
          .from("student_term_plans")
          .select("id")
          .eq("term_plan_id", termPlanId)
          .eq("student_id", cleanStudentId),
      )

      if (studentQueryError) {
        console.error(`Error querying student term plan for student ${cleanStudentId}:`, studentQueryError)
        continue
      }

      let studentTermPlanId: string

      const studentInsertData = {
        term_plan_id: termPlanId,
        student_id: cleanStudentId,
        user_id: userId,
        schedule: studentData.schedule,
        subjects: studentData.subjects,
        activities: studentData.activities,
        custom_activities: studentData.customActivities,
        block_assignments: studentData.blockAssignments || {},
        updated_at: new Date().toISOString(),
      }

      if (existingStudentPlans && existingStudentPlans.length > 0) {
        // Update existing student term plan
        studentTermPlanId = existingStudentPlans[0].id

        const updateStudentData = { ...studentInsertData }
        delete updateStudentData.term_plan_id // Don't update the term_plan_id
        delete updateStudentData.student_id // Don't update the student_id
        delete updateStudentData.user_id // Don't update the user_id

        const { error: updateStudentError } = await retryWithBackoff(() =>
          supabase.from("student_term_plans").update(updateStudentData).eq("id", studentTermPlanId),
        )

        if (updateStudentError) {
          console.error(`Error updating student term plan for student ${cleanStudentId}:`, updateStudentError)
          continue
        }

        console.log(`Updated student term plan for student ${cleanStudentId} with ID: ${studentTermPlanId}`)
      } else {
        // Insert new student term plan
        const fullStudentInsertData = {
          ...studentInsertData,
          created_at: new Date().toISOString(),
        }

        const { data: insertStudentData, error: insertStudentError } = await retryWithBackoff(() =>
          supabase.from("student_term_plans").insert(fullStudentInsertData).select("id"),
        )

        if (insertStudentError) {
          console.error(`Error inserting student term plan for student ${cleanStudentId}:`, insertStudentError)
          continue
        }

        if (!insertStudentData || insertStudentData.length === 0) {
          console.error(`No student term plan ID returned after insert for student ${cleanStudentId}`)
          continue
        }

        studentTermPlanId = insertStudentData[0].id
        console.log(`Created new student term plan for student ${cleanStudentId} with ID: ${studentTermPlanId}`)
      }

      // Now handle the student_course_platforms table for each block assignment
      if (studentData.blockAssignments) {
        // Prepare batch operations for platforms
        const platformsToUpdate = []
        const platformsToInsert = []

        // Process all blocks first to prepare batch operations
        for (const [day, blocks] of Object.entries(studentData.blockAssignments)) {
          for (const block of blocks) {
            if (!block.time || !block.subject) continue // Skip incomplete blocks

            try {
              // Check if this course platform already exists
              const { data: existingPlatforms, error: platformQueryError } = await retryWithBackoff(() =>
                supabase
                  .from("student_course_platforms")
                  .select("id")
                  .eq("student_term_plan_id", studentTermPlanId)
                  .eq("day", day)
                  .eq("time", block.time)
                  .eq("subject", block.subject),
              )

              if (platformQueryError) {
                console.error(`Error querying platform for ${day} ${block.time} ${block.subject}:`, platformQueryError)
                continue
              }

              // Ensure we're using the correct platform help value
              let platformHelp = null
              if (block.needPlatformHelp === true) {
                platformHelp = "needs_help"
              } else if (block.needPlatformHelp === false) {
                platformHelp = "no_help_needed"
              }

              const platformData = {
                user_id: userId,
                student_id: cleanStudentId,
                student_term_plan_id: studentTermPlanId,
                day,
                time: block.time,
                subject: block.subject,
                course: block.course || "",
                platform_url: block.platformUrl || "",
                platform_help: platformHelp,
                updated_at: new Date().toISOString(),
              }

              if (existingPlatforms && existingPlatforms.length > 0) {
                // Update existing platform
                const platformId = existingPlatforms[0].id
                platformsToUpdate.push({
                  ...platformData,
                  id: platformId,
                })
              } else {
                // Insert new platform
                platformsToInsert.push({
                  ...platformData,
                  created_at: new Date().toISOString(),
                })
              }
            } catch (error) {
              console.error(`Error processing platform for ${day} ${block.time} ${block.subject}:`, error)
              continue
            }
          }
        }

        // Execute batch updates (in chunks to avoid rate limits)
        const chunkSize = 10
        for (let i = 0; i < platformsToUpdate.length; i += chunkSize) {
          const chunk = platformsToUpdate.slice(i, i + chunkSize)
          if (chunk.length === 0) continue

          try {
            // Update platforms in batch
            for (const platform of chunk) {
              const platformId = platform.id
              delete platform.id

              await retryWithBackoff(() =>
                supabase.from("student_course_platforms").update(platform).eq("id", platformId),
              )
            }
            console.log(`Updated ${chunk.length} platforms in batch`)
          } catch (error) {
            console.error("Error updating platforms in batch:", error)
          }

          // Add a small delay between chunks to avoid rate limits
          if (i + chunkSize < platformsToUpdate.length) {
            await new Promise((resolve) => setTimeout(resolve, 200))
          }
        }

        // Execute batch inserts (in chunks to avoid rate limits)
        for (let i = 0; i < platformsToInsert.length; i += chunkSize) {
          const chunk = platformsToInsert.slice(i, i + chunkSize)
          if (chunk.length === 0) continue

          try {
            await retryWithBackoff(() => supabase.from("student_course_platforms").insert(chunk))
            console.log(`Inserted ${chunk.length} platforms in batch`)
          } catch (error) {
            console.error("Error inserting platforms in batch:", error)
          }

          // Add a small delay between chunks to avoid rate limits
          if (i + chunkSize < platformsToInsert.length) {
            await new Promise((resolve) => setTimeout(resolve, 200))
          }
        }
      }
    }

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

// New function to load an existing term plan for editing
export async function loadTermPlanForEditing(termPlanId: string) {
  try {
    if (!termPlanId) {
      console.error("No term plan ID provided")
      return { success: false, error: "No term plan ID provided" }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    })

    // Get the term plan
    const { data: termPlan, error: termPlanError } = await retryWithBackoff(() =>
      supabase.from("term_plans").select("*").eq("id", termPlanId).single(),
    )

    if (termPlanError) {
      console.error("Error fetching term plan:", termPlanError)
      return { success: false, error: termPlanError.message }
    }

    if (!termPlan) {
      console.error("Term plan not found")
      return { success: false, error: "Term plan not found" }
    }

    // Get all student term plans for this term plan
    const { data: studentTermPlans, error: studentTermPlansError } = await retryWithBackoff(() =>
      supabase.from("student_term_plans").select("*").eq("term_plan_id", termPlanId),
    )

    if (studentTermPlansError) {
      console.error("Error fetching student term plans:", studentTermPlansError)
      return { success: false, error: studentTermPlansError.message }
    }

    // Get all student course platforms for each student term plan
    const studentCoursePlatforms: { [studentTermPlanId: string]: any[] } = {}

    for (const studentTermPlan of studentTermPlans || []) {
      try {
        const { data: platforms, error: platformsError } = await retryWithBackoff(() =>
          supabase.from("student_course_platforms").select("*").eq("student_term_plan_id", studentTermPlan.id),
        )

        if (platformsError) {
          console.error(`Error fetching platforms for student term plan ${studentTermPlan.id}:`, platformsError)
          continue
        }

        studentCoursePlatforms[studentTermPlan.id] = platforms || []
      } catch (error) {
        console.error(`Error processing platforms for student term plan ${studentTermPlan.id}:`, error)
        studentCoursePlatforms[studentTermPlan.id] = []
      }
    }

    // Return all the data
    return {
      success: true,
      termPlan,
      studentTermPlans: studentTermPlans || [],
      studentCoursePlatforms,
    }
  } catch (error) {
    console.error("Unexpected error in loadTermPlanForEditing:", error)
    return { success: false, error: String(error) }
  }
}
