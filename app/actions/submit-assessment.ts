"use server"

import { v4 as uuidv4 } from "uuid"
import { supabaseServer } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

interface AssessmentData {
  childInfo: string
  learningPace: string
  parentInvolvement: string
  socialImportance: string
  biggestConcern: string
}

export async function submitAssessment(data: AssessmentData) {
  try {
    // Generate a session token
    const sessionToken = uuidv4()

    // Send to Supabase
    const { error } = await supabaseServer.from("parent_onboarding_assessment").insert({
      child_age_grade: data.childInfo,
      learning_style: data.learningPace,
      parent_involvement: data.parentInvolvement,
      peer_interaction: data.socialImportance,
      main_concern: data.biggestConcern,
      session_token: sessionToken,
    })

    if (error) {
      console.error("Error submitting assessment:", error)
      return { success: false, error: error.message, sessionToken: null }
    }

    // Revalidate the path to update any cached data
    revalidatePath("/onboarding")

    return {
      success: true,
      sessionToken,
      message: "Assessment submitted successfully!",
    }
  } catch (error) {
    console.error("Error in submission:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
      sessionToken: null,
    }
  }
}
