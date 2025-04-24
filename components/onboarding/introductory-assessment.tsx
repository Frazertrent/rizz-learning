"use client"

import { useState } from "react"
import { Progress } from "@/components/ui/progress"
import { ChildInfoStep } from "./steps/child-info-step"
import { LearningStyleStep } from "./steps/learning-style-step"
import { ParentInvolvementStep } from "./steps/parent-involvement-step"
import { SocialGoalsStep } from "./steps/social-goals-step"
import { MainConcernStep } from "./steps/main-concern-step"
import { FinalStep } from "./steps/final-step"
import { SummaryStep } from "./summary-step"

export type AssessmentData = {
  childInfo: string
  learningStyle: "accelerated" | "solid" | "needs-structure" | "experimenting" | null
  parentInvolvement: "very" | "somewhat" | "independent" | null
  socialGoals: "frequent" | "few" | "solo" | null
  mainConcern: string
}

export function IntroductoryAssessment() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<AssessmentData>({
    childInfo: "",
    learningStyle: null,
    parentInvolvement: null,
    socialGoals: null,
    mainConcern: "",
  })

  const updateData = (newData: Partial<AssessmentData>) => {
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

  const seeRecommendation = () => {
    setStep(7) // Go to summary step
    window.scrollTo(0, 0)
  }

  const totalSteps = 5
  const progressPercentage = ((step - 1) / totalSteps) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">
            Let's Find the Right Path for Your Child
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Answer a few questions to help us understand your homeschooling needs.
          </p>
        </div>

        {step <= totalSteps && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
              <span>
                Question {step} of {totalSteps}
              </span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-slate-200 dark:bg-slate-700" />
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8 animate-fadeIn">
          {step === 1 && <ChildInfoStep onContinue={nextStep} updateData={updateData} data={data} />}
          {step === 2 && (
            <LearningStyleStep onContinue={nextStep} onBack={prevStep} updateData={updateData} data={data} />
          )}
          {step === 3 && (
            <ParentInvolvementStep onContinue={nextStep} onBack={prevStep} updateData={updateData} data={data} />
          )}
          {step === 4 && (
            <SocialGoalsStep onContinue={nextStep} onBack={prevStep} updateData={updateData} data={data} />
          )}
          {step === 5 && (
            <MainConcernStep onContinue={nextStep} onBack={prevStep} updateData={updateData} data={data} />
          )}
          {step === 6 && <FinalStep onContinue={seeRecommendation} onBack={prevStep} />}
          {step === 7 && <SummaryStep data={data} />}
        </div>
      </div>
    </div>
  )
}
