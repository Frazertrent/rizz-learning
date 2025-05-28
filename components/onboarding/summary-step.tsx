"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, RefreshCw } from "lucide-react"
import { storeAssessmentData } from "@/app/actions/store-assessment-data"
import { useRouter } from "next/navigation"
import type { OnboardingData } from "./onboarding-flow"

interface SummaryStepProps {
  onContinue: () => void
  onRestart: () => void
  data: OnboardingData
}

export function SummaryStep({ onContinue, onRestart, data }: SummaryStepProps) {
  const router = useRouter()

  const handleContinue = async () => {
    // Store the assessment data before continuing
    await storeAssessmentData(data)

    // Redirect to membership page instead of just continuing to results
    router.push("/membership")
  }

  // Helper function to format array data for display
  const formatArrayData = (arr: string[]) => {
    return arr.length > 0 ? arr.join(", ") : "None selected"
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400">
          Your Assessment Summary
        </h1>
        <p className="text-xl text-slate-300">
          Here's a summary of your preferences. Review and confirm before we create your personalized plan.
        </p>
      </div>

      <div className="space-y-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-medium text-slate-200 mb-2">Path Selection</h3>
              <p className="text-slate-300">
                {data.path === "curious"
                  ? "I'm curious about homeschooling"
                  : data.path === "existing"
                    ? "I'm already homeschooling but need better tools"
                    : data.path === "hybrid"
                      ? "I want to blend in-school and at-home learning"
                      : "Not specified"}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-slate-200 mb-2">Learning Goals</h3>
              <p className="text-slate-300">{formatArrayData(data.learningGoals)}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-slate-200 mb-2">Schedule Preferences</h3>
              <p className="text-slate-300">{formatArrayData(data.schedulePreferences)}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-slate-200 mb-2">Current Setup</h3>
              <div className="space-y-2">
                <p className="text-slate-300">
                  <span className="text-slate-400">Curriculum: </span>
                  {formatArrayData(data.currentSetup.curriculum)}
                  {data.currentSetup.otherCurriculum && ` (${data.currentSetup.otherCurriculum})`}
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-400">Organization Method: </span>
                  {data.currentSetup.organizationMethod || "Not specified"}
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-400">Priorities: </span>
                  {formatArrayData(data.currentSetup.priorities)}
                  {data.currentSetup.otherPriority && ` (${data.currentSetup.otherPriority})`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          onClick={onRestart}
          variant="outline"
          className="flex items-center gap-2 bg-transparent border-slate-600 text-white hover:bg-slate-800"
        >
          <RefreshCw className="h-4 w-4" />
          Restart Assessment
        </Button>
        <Button
          onClick={handleContinue}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Continue to Membership Options
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
