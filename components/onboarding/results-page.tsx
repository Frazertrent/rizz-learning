"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import type { OnboardingData } from "./onboarding-flow"

interface ResultsPageProps {
  data: OnboardingData
}

export function ResultsPage({ data }: ResultsPageProps) {
  const router = useRouter()

  useEffect(() => {
    // Redirect to membership page after a short delay
    const timer = setTimeout(() => {
      router.push("/membership")
    }, 1500)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="animate-pulse mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Assessment Complete!</h1>
        <p className="text-xl text-slate-300 mb-6">
          Thank you for completing the assessment. We're preparing your personalized homeschool plan...
        </p>
        <div className="flex justify-center">
          <div className="w-16 h-1 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 animate-progress"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
