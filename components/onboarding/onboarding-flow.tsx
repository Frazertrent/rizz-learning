"use client"

import { useState } from "react"
import { WelcomeStep } from "./welcome-step"
import { LearningGoalsStep } from "./learning-goals-step"
import { SchedulePreferencesStep } from "./schedule-preferences-step"
import { CurrentSetupStep } from "./current-setup-step"
import { SummaryStep } from "./summary-step"
import { ResultsPage } from "./results-page"

export type CurrentSetup = {
  curriculum: string[]
  otherCurriculum?: string
  organizationMethod: string
  priorities: string[]
  otherPriority?: string
}

export type OnboardingData = {
  path: "curious" | "existing" | "hybrid" | null
  learningGoals: string[]
  schedulePreferences: string[]
  currentSetup: CurrentSetup
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
    learningGoals: [],
    schedulePreferences: [],
    currentSetup: {
      curriculum: [],
      organizationMethod: "",
      priorities: [],
    },
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
      learningGoals: [],
      schedulePreferences: [],
      currentSetup: {
        curriculum: [],
        organizationMethod: "",
        priorities: [],
      },
      childInfo: "",
      learningPace: null,
      parentInvolvement: null,
      socialImportance: null,
      biggestConcern: "",
    })
    setStep(1)
    window.scrollTo(0, 0)
  }

  const progressPercentage = ((step - 1) / 4) * 100

  // Define the steps for the progress tracker
  const steps = [
    { number: 1, label: "Path Selection" },
    { number: 2, label: "Learning Goals" },
    { number: 3, label: "Schedule Preferences" },
    { number: 4, label: "Current Setup" },
    { number: 5, label: "Review & Complete" },
  ]

  // If we're on the results page, render it without the container
  if (step === 6) {
    return <ResultsPage data={data} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        {step > 0 && step < 6 && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Getting Started</span>
              <span>Step {step} of 5</span>
            </div>

            {/* Progress Tracker */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                {steps.map((s) => (
                  <div key={s.number} className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium mb-2 transition-colors
                        ${
                          step >= s.number
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                            : "bg-slate-800 text-slate-400"
                        }`}
                    >
                      {s.number}
                    </div>
                    <span className={`text-xs text-center ${step >= s.number ? "text-slate-200" : "text-slate-500"}`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="relative h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <div className="text-center mb-8">
              <p className="text-slate-300">
                Complete this assessment to get a customized dashboard for your family's educational journey.
              </p>
            </div>
          </div>
        )}

        {step === 1 && <WelcomeStep onContinue={nextStep} updateData={updateData} data={data} />}
        {step === 2 && (
          <LearningGoalsStep
            onContinue={(selectedGoals) => {
              updateData({ learningGoals: selectedGoals })
              nextStep()
            }}
          />
        )}
        {step === 3 && (
          <SchedulePreferencesStep
            onContinue={(selectedPreferences) => {
              updateData({ schedulePreferences: selectedPreferences })
              nextStep()
            }}
            onBack={prevStep}
          />
        )}
        {step === 4 && (
          <CurrentSetupStep
            onContinue={(setupData) => {
              updateData({ currentSetup: setupData })
              nextStep()
            }}
            onBack={prevStep}
          />
        )}
        {step === 5 && <SummaryStep onContinue={nextStep} onRestart={restartAssessment} data={data} />}
      </div>
    </div>
  )
}
