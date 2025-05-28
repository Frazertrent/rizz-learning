"use server"

import { cookies } from "next/headers"

export type OnboardingData = {
  pathSelection?: string
  learningGoals?: string[]
  schedulePreferences?: {
    startTime?: string
    endTime?: string
    daysPerWeek?: string[]
    breaksPreferred?: boolean
  }
  currentSetup?: {
    curriculum?: string
    organizationMethod?: string
    priorities?: string[]
  }
}

export async function storeAssessmentData(data: OnboardingData) {
  cookies().set({
    name: "onboarding_data",
    value: JSON.stringify(data),
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
}

export async function getAssessmentData(): Promise<OnboardingData | null> {
  const data = cookies().get("onboarding_data")

  if (!data) {
    return null
  }

  try {
    return JSON.parse(data.value)
  } catch (error) {
    console.error("Error parsing assessment data:", error)
    return null
  }
}
