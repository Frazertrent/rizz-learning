"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight } from "lucide-react"

interface LearningGoalsStepProps {
  onContinue: (selectedGoals: string[]) => void
}

export function LearningGoalsStep({ onContinue }: LearningGoalsStepProps) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])

  const learningGoals = [
    {
      id: "structured",
      emoji: "📅",
      title: "Ultra Structured & Timed",
      description: "Daily subjects, checklists, strong routine",
    },
    {
      id: "standards-based",
      emoji: "🎯",
      title: "Standards-Based Mastery",
      description: "Traditional structure, clear grade-level expectations",
    },
    {
      id: "college-prep",
      emoji: "🌟",
      title: "College Prep or Career Track",
      description: "Transcript goals, dual credit, certification-ready",
    },
    {
      id: "reading-writing",
      emoji: "✍️",
      title: "Reading & Writing Enrichment",
      description: "Essay feedback, grammar goals, journaling",
    },
    {
      id: "stem",
      emoji: "🧪",
      title: "STEM & Inquiry-Focused",
      description: "Science, experiments, logic, hands-on learning",
    },
    {
      id: "gifted",
      emoji: "🧠",
      title: "Gifted & Accelerated Learning",
      description: "Challenging, fast-paced, above grade level",
    },
    {
      id: "special-needs",
      emoji: "🧩",
      title: "Special Learning Needs",
      description: "Support for IEPs, neurodiverse learners, sensory tools",
    },
    {
      id: "classical",
      emoji: "📚",
      title: "Classical or Faith-Based",
      description: "History, logic, Great Books, or scripture-based paths",
    },
    {
      id: "real-world",
      emoji: "🌎",
      title: "Real World & Life Skills",
      description: "Budgeting, practical math, critical thinking",
    },
    {
      id: "creative",
      emoji: "🎨",
      title: "Creative & Expressive Learning",
      description: "Arts, music, creative writing, portfolio-based",
    },
    {
      id: "nature",
      emoji: "🌿",
      title: "Nature & Outdoor Learning",
      description: "Hands-on, screen-free, movement-based",
    },
    {
      id: "unschooling",
      emoji: "🕊️",
      title: "Unschooling & Self-Directed",
      description: "Curiosity-led, project-based, no rigid schedule",
    },
  ]

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) => (prev.includes(goalId) ? prev.filter((id) => id !== goalId) : [...prev, goalId]))
  }

  const handleContinue = () => {
    onContinue(selectedGoals)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 mb-2">
          Learning Goals
        </h1>
        <p className="text-slate-300 text-lg">What are your homeschooling objectives?</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-purple-600 rounded-full p-1 text-white">🌱</span>
          <p className="text-slate-200 font-medium">What kind of learning experience are you aiming for?</p>
        </div>
        <p className="text-slate-400 text-sm mb-6">
          Choose all that resonate — this helps us shape the best path for your student
        </p>

        <div className="grid gap-3 md:grid-cols-2">
          {learningGoals.map((goal) => (
            <Card
              key={goal.id}
              className={`p-4 cursor-pointer transition-all border-slate-800 hover:border-slate-700 ${
                selectedGoals.includes(goal.id) ? "bg-slate-800/50 border-purple-500" : "bg-slate-900/50"
              }`}
              onClick={() => toggleGoal(goal.id)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Checkbox
                    id={goal.id}
                    checked={selectedGoals.includes(goal.id)}
                    onCheckedChange={() => toggleGoal(goal.id)}
                    className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl" aria-hidden="true">
                      {goal.emoji}
                    </span>
                    <label htmlFor={goal.id} className="text-slate-200 font-medium cursor-pointer">
                      {goal.title}
                    </label>
                  </div>
                  <p className="text-slate-400 text-sm">{goal.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-full"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
