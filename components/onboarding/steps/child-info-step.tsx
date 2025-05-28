"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import type { AssessmentData } from "../introductory-assessment"

interface ChildInfoStepProps {
  onContinue: () => void
  updateData: (data: Partial<AssessmentData>) => void
  data: AssessmentData
}

export function ChildInfoStep({ onContinue, updateData, data }: ChildInfoStepProps) {
  const [childInfo, setChildInfo] = useState(data.childInfo)
  const [error, setError] = useState("")

  const handleContinue = () => {
    if (!childInfo.trim()) {
      setError("Please provide your child's age and grade level.")
      return
    }

    updateData({ childInfo })
    onContinue()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
          How old is your child, and what grade level are they currently in?
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          This helps us tailor our recommendations to your child's developmental stage.
        </p>
      </div>

      <div className="space-y-2">
        <Input
          value={childInfo}
          onChange={(e) => {
            setChildInfo(e.target.value)
            setError("")
          }}
          placeholder="e.g., 12 years old, 6th grade"
          className="text-lg py-6"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      <div className="pt-4">
        <Button onClick={handleContinue} className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white">
          Continue
        </Button>
      </div>
    </div>
  )
}
