"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import type { AssessmentData } from "../introductory-assessment"

interface MainConcernStepProps {
  onContinue: () => void
  onBack: () => void
  updateData: (data: Partial<AssessmentData>) => void
  data: AssessmentData
}

export function MainConcernStep({ onContinue, onBack, updateData, data }: MainConcernStepProps) {
  const [mainConcern, setMainConcern] = useState(data.mainConcern)
  const [error, setError] = useState("")

  const handleContinue = () => {
    if (!mainConcern.trim()) {
      setError("Please share your biggest concern or priority.")
      return
    }

    updateData({ mainConcern })
    onContinue()
  }

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
          What's your biggest concern or priority right now?
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          This helps us understand what matters most to you in your homeschooling journey.
        </p>
      </div>

      <div className="space-y-2">
        <Textarea
          value={mainConcern}
          onChange={(e) => {
            setMainConcern(e.target.value)
            setError("")
          }}
          placeholder="e.g., We need better structure or I don't want to miss any credits"
          className="min-h-[120px] text-base"
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
