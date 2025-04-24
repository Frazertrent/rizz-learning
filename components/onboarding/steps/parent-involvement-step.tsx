"use client"

import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import type { AssessmentData } from "../introductory-assessment"

interface ParentInvolvementStepProps {
  onContinue: () => void
  onBack: () => void
  updateData: (data: Partial<AssessmentData>) => void
  data: AssessmentData
}

export function ParentInvolvementStep({ onContinue, onBack, updateData, data }: ParentInvolvementStepProps) {
  const [involvement, setInvolvement] = useState<"very" | "somewhat" | "independent" | null>(data.parentInvolvement)
  const [error, setError] = useState("")

  const handleContinue = () => {
    if (!involvement) {
      setError("Please select an option.")
      return
    }

    updateData({ parentInvolvement: involvement })
    onContinue()
  }

  const options = [
    {
      id: "very",
      label: "Very involved – I'll be guiding them directly",
      description: "You'll actively participate in daily lessons and activities.",
    },
    {
      id: "somewhat",
      label: "Somewhat involved – I want oversight but not all day",
      description: "You'll check in regularly but want your child to work independently.",
    },
    {
      id: "independent",
      label: "Independent – I need a system that runs itself",
      description: "You're looking for a solution that minimizes your day-to-day involvement.",
    },
  ]

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white -ml-2"
        onClick={onBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
          How hands-on do you want to be with your child's learning each day?
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          This helps us understand how to balance parent guidance with student independence.
        </p>
      </div>

      <RadioGroup
        value={involvement || ""}
        onValueChange={(value) => {
          setInvolvement(value as any)
          setError("")
        }}
      >
        <div className="space-y-4">
          {options.map((option) => (
            <div
              key={option.id}
              className={`flex items-start space-x-3 rounded-lg border p-4 transition-all ${
                involvement === option.id
                  ? "border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
              <div className="flex-1">
                <label htmlFor={option.id} className="block font-medium text-slate-900 dark:text-white cursor-pointer">
                  {option.label}
                </label>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{option.description}</p>
              </div>
            </div>
          ))}
        </div>
      </RadioGroup>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="pt-4">
        <Button onClick={handleContinue} className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white">
          Continue
        </Button>
      </div>
    </div>
  )
}
