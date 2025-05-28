import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"

// This is a server-side only endpoint that bypasses RLS
export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: "Missing Supabase environment variables" }, { status: 500 })
    }

    // Create a Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Get the request body
    const body = await request.json()
    const { parentProfile, studentProfiles, assessmentData } = body

    // Create parent profile
    const parentId = uuidv4()

    const { error: parentError } = await supabase.from("parent_profile").insert({
      id: parentId,
      email: parentProfile.email,
      utah_affiliation: parentProfile.state === "Utah" ? "Yes" : "No",
      preferences_json: {
        state: parentProfile.state,
        schoolDistrict: parentProfile.schoolDistrict,
        first_name: parentProfile.firstName,
        last_name: parentProfile.lastName,
        number_of_students: parentProfile.numberOfStudents,
        onboarding_data: assessmentData,
      },
      created_at: new Date().toISOString(),
    })

    if (parentError) {
      return NextResponse.json({ error: `Error creating parent profile: ${parentError.message}` }, { status: 500 })
    }

    // Create student profiles
    const studentResults = []

    for (const student of studentProfiles) {
      const { error: studentError } = await supabase.from("student").insert({
        id: uuidv4(),
        parent_id: parentId,
        full_name: `${student.firstName} ${student.lastName}`,
        grade_level: student.grade,
        schedule_json: {},
        expectations: {},
        assigned_tools: [],
        created_at: new Date().toISOString(),
      })

      if (studentError) {
        studentResults.push({
          success: false,
          error: studentError.message,
        })
      } else {
        studentResults.push({
          success: true,
        })
      }
    }

    return NextResponse.json({
      success: true,
      parentId,
      studentResults,
    })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
