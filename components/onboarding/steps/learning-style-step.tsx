"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import type { AssessmentData } from "../introductory-assessment"

interface LearningStyleStepProps {
  onContinue: () => void
  onBack: () => void
  updateData: (data: Partial<AssessmentData>) => void
  data: AssessmentData
}

export function LearningStyleStep({ onContinue, onBack, updateData, data }: LearningStyleStepProps) {
  const options = [
    {
      id: "accelerated",
      label: "Accelerated learner – works ahead and loves challenges",
      description: "Your child thrives on advanced material and seeks out new challenges.",
    },
    {
      id: "solid",
      label: "Solid with core academics – doing well but not pushing ahead",
      description: "Your child is comfortable with grade-level work and makes steady progress.",
    },
    {
      id: "needs-structure",
      label: "Needs more confidence or structure right now",
      description: "Your child benefits from additional support and clear expectations.",
    },
    {
      id: "experimenting",
      label: "Still figuring it out – we're experimenting",
      description: "You're exploring different approaches to find what works best.",
    },
  ]

  const handleSelect = (value: "accelerated" | "solid" | "needs-structure" | "experimenting") => {
    updateData({ learningStyle: value })
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
          How would you describe your child's current learning style?
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Every child learns differently. Select the option that best describes your child.
        </p>
      </div>

      <div className="space-y-3">
        {options.map((option) => (
          <Card
            key={option.id}
            className={`cursor-pointer transition-all hover:border-blue-400 dark:hover:border-blue-500 ${
              data.learningStyle === option.id ? "border-blue-600 dark:border-blue-500" : ""
            }`}
            onClick={() => handleSelect(option.id as any)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={`mt-1 h-5 w-5 rounded-full border-2 flex-shrink-0 ${
                    data.learningStyle === option.id
                      ? "border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500"
                      : "border-slate-300 dark:border-slate-600"
                  }`}
                />
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white">{option.label}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{option.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
