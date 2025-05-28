"use server"

import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

// Create a Supabase client for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabaseServer = createClient(supabaseUrl, supabaseAnonKey)

type StudentProfile = {
  id: string
  firstName: string
  lastName: string
  username: string
  password: string
  age: string
  grade: string
}

type ParentProfile = {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  state: string
  schoolDistrict: string
  numberOfStudents: string
}

export async function saveProfileData(parentProfile: ParentProfile, studentProfiles: StudentProfile[]) {
  try {
    // Get assessment data from cookie if it exists
    let assessmentData = null
    const assessmentCookie = cookies().get("onboarding_data")
    if (assessmentCookie?.value) {
      try {
        assessmentData = JSON.parse(assessmentCookie.value)
      } catch (e) {
        console.error("Error parsing assessment data:", e)
      }
    }

    // Sign up the user
    const { data: authData, error: authError } = await supabaseServer.auth.signUp({
      email: parentProfile.email,
      password: parentProfile.password,
      options: {
        data: {
          first_name: parentProfile.firstName,
          last_name: parentProfile.lastName,
        },
      },
    })

    if (authError) {
      console.error("Error signing up user:", authError)
      throw new Error(`Authentication error: ${authError.message}`)
    }

    // Get the user ID from the auth response
    const userId = authData.user?.id

    if (!userId) {
      throw new Error("Failed to create user account")
    }

    // Check if a parent profile with this ID already exists
    const { data: existingProfile, error: fetchError } = await supabaseServer
      .from("parent_profile")
      .select("*")
      .eq("id", userId)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is the error code for "no rows returned" which is expected if the profile doesn't exist
      console.error("Error checking for existing profile:", fetchError)
    }

    // If the profile exists, update it instead of inserting
    if (existingProfile) {
      const { error: updateError } = await supabaseServer
        .from("parent_profile")
        .update({
          email: parentProfile.email,
          first_name: parentProfile.firstName,
          last_name: parentProfile.lastName,
          username: parentProfile.username,
          state: parentProfile.state,
          school_district: parentProfile.schoolDistrict,
          number_of_students: Number.parseInt(parentProfile.numberOfStudents),
          preferences_json: {
            onboarding_data: assessmentData,
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (updateError) {
        console.error("Error updating parent profile:", updateError)
        throw new Error(`Error updating parent profile: ${updateError.message}`)
      }
    } else {
      // Create a new parent profile
      const { error: parentError } = await supabaseServer.from("parent_profile").insert({
        id: userId,
        email: parentProfile.email,
        first_name: parentProfile.firstName,
        last_name: parentProfile.lastName,
        username: parentProfile.username,
        state: parentProfile.state,
        school_district: parentProfile.schoolDistrict,
        number_of_students: Number.parseInt(parentProfile.numberOfStudents),
        preferences_json: {
          onboarding_data: assessmentData,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (parentError) {
        console.error("Error creating parent profile:", parentError)
        throw new Error(`Error creating parent profile: ${parentError.message}`)
      }
    }

    // Create student profiles
    const createdStudents = []
    for (const student of studentProfiles) {
      // Check if a student with this name already exists for this parent
      const { data: existingStudents, error: fetchStudentError } = await supabaseServer
        .from("student")
        .select("*")
        .eq("parent_id", userId)
        .eq("first_name", student.firstName)
        .eq("last_name", student.lastName)

      if (fetchStudentError) {
        console.error("Error checking for existing student:", fetchStudentError)
      }

      if (existingStudents && existingStudents.length > 0) {
        // Update the existing student
        const { data, error: updateStudentError } = await supabaseServer
          .from("student")
          .update({
            full_name: `${student.firstName} ${student.lastName}`,
            username: student.username,
            age: Number.parseInt(student.age),
            grade_level: student.grade,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingStudents[0].id)
          .select()

        if (updateStudentError) {
          console.error("Error updating student profile:", updateStudentError)
        } else if (data) {
          createdStudents.push(data[0])
        }
      } else {
        // Create a new student
        const { data, error: studentError } = await supabaseServer
          .from("student")
          .insert({
            parent_id: userId,
            full_name: `${student.firstName} ${student.lastName}`,
            first_name: student.firstName,
            last_name: student.lastName,
            username: student.username,
            age: Number.parseInt(student.age),
            grade_level: student.grade,
            schedule_json: {},
            expectations: {},
            assigned_tools: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()

        if (studentError) {
          console.error("Error creating student profile:", studentError)
        } else if (data) {
          createdStudents.push(data[0])
        }
      }
    }

    // Store assessment data if available
    if (assessmentData) {
      // Check if assessment data already exists for this parent
      const { data: existingAssessment, error: fetchAssessmentError } = await supabaseServer
        .from("parent_onboarding_assessment")
        .select("*")
        .eq("parent_id", userId)
        .single()

      if (fetchAssessmentError && fetchAssessmentError.code !== "PGRST116") {
        console.error("Error checking for existing assessment:", fetchAssessmentError)
      }

      if (existingAssessment) {
        // Update the existing assessment
        const { error: updateAssessmentError } = await supabaseServer
          .from("parent_onboarding_assessment")
          .update({
            assessment_data: assessmentData,
            session_token: cookies().get("session_token")?.value || uuidv4(),
          })
          .eq("id", existingAssessment.id)

        if (updateAssessmentError) {
          console.error("Error updating assessment data:", updateAssessmentError)
        }
      } else {
        // Create a new assessment
        const { error: assessmentError } = await supabaseServer.from("parent_onboarding_assessment").insert({
          parent_id: userId,
          assessment_data: assessmentData,
          session_token: cookies().get("session_token")?.value || uuidv4(),
          created_at: new Date().toISOString(),
        })

        if (assessmentError) {
          console.error("Error storing assessment data:", assessmentError)
        }
      }
    }

    // Now sign in the user immediately after sign up
    const { error: signInError } = await supabaseServer.auth.signInWithPassword({
      email: parentProfile.email,
      password: parentProfile.password,
    })

    if (signInError) {
      console.error("Error signing in after sign up:", signInError)
      // Not critical, continue anyway
    }

    // Clear the assessment data cookie as it's now stored in the database
    cookies().delete("onboarding_data")

    return {
      success: true,
      parentId: userId,
      students: createdStudents,
    }
  } catch (error) {
    console.error("Error saving profile data:", error)
    return { success: false, error: (error as Error).message }
  }
}
