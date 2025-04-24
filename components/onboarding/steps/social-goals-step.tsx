"use client"

import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import type { AssessmentData } from "../introductory-assessment"

interface SocialGoalsStepProps {
  onContinue: () => void
  onBack: () => void
  updateData: (data: Partial<AssessmentData>) => void
  data: AssessmentData
}

export function SocialGoalsStep({ onContinue, onBack, updateData, data }: SocialGoalsStepProps) {
  const [socialGoals, setSocialGoals] = useState<"frequent" | "few" | "solo" | null>(data.socialGoals)
  const [error, setError] = useState("")

  const handleContinue = () => {
    if (!socialGoals) {
      setError("Please select an option.")
      return
    }

    updateData({ socialGoals })
    onContinue()
  }

  const options = [
    {
      id: "frequent",
      label: "Frequent social time – classes, clubs, or group activities",
      description: "Your child thrives with regular peer interaction and collaborative learning.",
    },
    {
      id: "few",
      label: "A few elective meetups or group projects each week",
      description: "You want a balance of independent work and social learning opportunities.",
    },
    {
      id: "solo",
      label: "Mostly solo focus for now – we'll build social time outside of schoolwork",
      description: "You prefer to separate academics from social activities at this time.",
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
          What kind of peer interaction feels right for your child this year?
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Social learning is an important part of education. Tell us what works for your family.
        </p>
      </div>

      <RadioGroup
        value={socialGoals || ""}
        onValueChange={(value) => {
          setSocialGoals(value as any)
          setError("")
        }}
      >
        <div className="space-y-4">
          {options.map((option) => (
            <div
              key={option.id}
              className={`flex items-start space-x-3 rounded-lg border p-4 transition-all ${
                socialGoals === option.id
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
