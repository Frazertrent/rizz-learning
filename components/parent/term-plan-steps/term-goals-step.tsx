"use client"

import { useEffect, useState } from "react"
import type { TermPlanData } from "../term-plan-builder"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusCircleIcon } from "lucide-react"

interface TermGoalsStepProps {
  termPlanData: TermPlanData
  updateTermPlanData: (data: Partial<TermPlanData>) => void
}

export function TermGoalsStep({ termPlanData, updateTermPlanData }: TermGoalsStepProps) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(termPlanData.goals)
  const [customGoal, setCustomGoal] = useState("")

  // Standard goals
  const standardGoals = [
    "Earn credits",
    "Advance subjects",
    "Explore interests",
    "Daily structure",
    "Build skills",
    "Prepare for tests",
    "Complete curriculum",
    "Develop independence",
  ]

  // Summer-specific goals
  const summerGoals = [
    "Prevent summer learning loss",
    "Try out homeschooling",
    "Prepare for next grade",
    "Focus on weak areas",
    "Explore new subjects",
  ]

  // Determine which goals to show based on selected term
  const isSummer = termPlanData.academicTerm === "Summer"
  const allGoals = isSummer ? [...standardGoals, ...summerGoals] : standardGoals

  // Update parent component when goals change - but only if they're different
  useEffect(() => {
    // Only update if the goals have actually changed
    if (JSON.stringify(termPlanData.goals) !== JSON.stringify(selectedGoals)) {
      updateTermPlanData({ goals: selectedGoals })
    }
  }, [selectedGoals, updateTermPlanData, termPlanData.goals])

  const handleGoalToggle = (goal: string) => {
    setSelectedGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]))
  }

  const handleAddCustomGoal = () => {
    if (customGoal.trim() && !selectedGoals.includes(customGoal.trim())) {
      setSelectedGoals((prev) => [...prev, customGoal.trim()])
      setCustomGoal("")
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-300">
        Select the goals you want to achieve during this term. These will help guide your curriculum choices and daily
        activities.
      </p>

      <Card className="p-6 bg-gray-700 border-gray-600">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {allGoals.map((goal) => (
            <div
              key={goal}
              className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedGoals.includes(goal)
                  ? "bg-blue-900/50 border-blue-700 text-blue-100"
                  : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => handleGoalToggle(goal)}
            >
              <Checkbox
                id={`goal-${goal}`}
                checked={selectedGoals.includes(goal)}
                onCheckedChange={() => handleGoalToggle(goal)}
              />
              <Label htmlFor={`goal-${goal}`} className="cursor-pointer w-full">
                {goal}
                {isSummer && summerGoals.includes(goal) && (
                  <span className="ml-2 text-xs bg-yellow-900/50 text-yellow-100 px-2 py-0.5 rounded-full border border-yellow-700">
                    Summer
                  </span>
                )}
              </Label>
            </div>
          ))}
        </div>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label htmlFor="custom-goal" className="text-gray-200">
              Add a custom goal
            </Label>
            <Input
              id="custom-goal"
              placeholder="e.g., Prepare for college applications"
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddCustomGoal()
                }
              }}
              className="bg-gray-800 border-gray-600 text-gray-200"
            />
          </div>
          <Button
            type="button"
            onClick={handleAddCustomGoal}
            disabled={!customGoal.trim()}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PlusCircleIcon className="w-4 h-4" />
            Add
          </Button>
        </div>
      </Card>

      <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700">
        <p className="text-blue-200">
          <span className="font-medium">Tip:</span> Setting clear goals for the term helps you stay focused and measure
          progress. It's also a great way to communicate expectations with your child.
        </p>
      </div>
    </div>
  )
}
