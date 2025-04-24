"use client"

import { useState } from "react"
import { WelcomeStep } from "./welcome-step"
import { AssessmentStep } from "./assessment-step"
import { SummaryStep } from "./summary-step"
import { PaywallStep } from "./paywall-step"
import { Progress } from "@/components/ui/progress"

export type OnboardingData = {
  path: "curious" | "existing" | "hybrid" | null
  childInfo: string
  learningPace: "Accelerated" | "Average" | "Needs Support" | null
  parentInvolvement: "Very involved" | "Somewhat involved" | "Mostly independent" | null
  socialImportance: "Very Important" | "Somewhat Important" | "Not Important" | null
  biggestConcern: string
}

export function OnboardingFlow() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    path: null,
    childInfo: "",
    learningPace: null,
    parentInvolvement: null,
    socialImportance: null,
    biggestConcern: "",
  })

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...newData }))
  }

  const nextStep = () => {
    setStep((prev) => prev + 1)
    window.scrollTo(0, 0)
  }

  const prevStep = () => {
    setStep((prev) => Math.max(1, prev - 1))
    window.scrollTo(0, 0)
  }

  const restartAssessment = () => {
    setData({
      path: null,
      childInfo: "",
      learningPace: null,
      parentInvolvement: null,
      socialImportance: null,
      biggestConcern: "",
    })
    setStep(1)
    window.scrollTo(0, 0)
  }

  const progressPercentage = ((step - 1) / 3) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        {step > 1 && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Getting Started</span>
              <span>Step {step} of 4</span>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-slate-700" />
          </div>
        )}

        {step === 1 && <WelcomeStep onContinue={nextStep} updateData={updateData} data={data} />}
        {step === 2 && <AssessmentStep onContinue={nextStep} onBack={prevStep} updateData={updateData} data={data} />}
        {step === 3 && <SummaryStep onContinue={nextStep} onRestart={restartAssessment} data={data} />}
        {step === 4 && <PaywallStep onBack={prevStep} />}
      </div>
    </div>
  )
}
