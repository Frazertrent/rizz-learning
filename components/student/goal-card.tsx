"use client"

import { useState } from "react"
import { Calendar, CheckCircle2, ChevronDown, ChevronUp, Sparkles, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

// Goal category styling
const categoryStyles = {
  academic: {
    bgGradient: "from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/10",
    borderColor: "border-blue-200 dark:border-blue-800",
    progressColor: "bg-blue-500",
    icon: "📚",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  personal: {
    bgGradient: "from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-800/10",
    borderColor: "border-green-200 dark:border-green-800",
    progressColor: "bg-green-500",
    icon: "🌱",
    textColor: "text-green-700 dark:text-green-300",
  },
  fitness: {
    bgGradient: "from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-800/10",
    borderColor: "border-orange-200 dark:border-orange-800",
    progressColor: "bg-orange-500",
    icon: "💪",
    textColor: "text-orange-700 dark:text-orange-300",
  },
  mindset: {
    bgGradient: "from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-800/10",
    borderColor: "border-purple-200 dark:border-purple-800",
    progressColor: "bg-purple-500",
    icon: "🧠",
    textColor: "text-purple-700 dark:text-purple-300",
  },
  spiritual: {
    bgGradient: "from-amber-100 to-amber-50 dark:from-amber-900/20 dark:to-amber-800/10",
    borderColor: "border-amber-200 dark:border-amber-800",
    progressColor: "bg-amber-500",
    icon: "✨",
    textColor: "text-amber-700 dark:text-amber-300",
  },
}

export default function GoalCard({ goal, onComplete }) {
  const [expanded, setExpanded] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  // Get styling based on category
  const style = categoryStyles[goal.category] || categoryStyles.academic

  // Handle goal completion with animation
  const handleComplete = () => {
    setIsCompleting(true)
    setTimeout(() => {
      onComplete(goal.id)
      setIsCompleting(false)
    }, 1000)
  }

  // Handle step completion
  const handleStepComplete = (stepId) => {
    // This would update the step and recalculate progress
    console.log("Completed step:", stepId)
  }

  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden transition-all duration-300",
        "border shadow-sm hover:shadow-md",
        style.borderColor,
        goal.completed ? "bg-gray-50 dark:bg-gray-800/30" : `bg-gradient-to-br ${style.bgGradient}`,
        expanded ? "scale-[1.02]" : "",
      )}
    >
      {/* Confetti animation when completing */}
      {isCompleting && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="absolute inset-0 bg-white/80 dark:bg-black/80"></div>
          <div className="relative z-20 text-4xl animate-bounce">🎉</div>
          <div className="absolute top-0 left-1/4 text-2xl animate-float-slow">✨</div>
          <div className="absolute top-1/3 right-1/4 text-2xl animate-float-medium">🎯</div>
          <div className="absolute bottom-1/4 left-1/3 text-2xl animate-float-fast">🏆</div>
        </div>
      )}

      {/* Goal Card Content */}
      <div className="p-4">
        {/* Category Icon */}
        <div className="flex justify-between items-start mb-2">
          <span className="text-xl">{style.icon}</span>

          {/* Due Date */}
          {goal.dueDate && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="h-3 w-3 mr-1" />
              {goal.dueDate}
            </div>
          )}
        </div>

        {/* Goal Title */}
        <h3
          className={cn(
            "text-lg font-semibold mb-2",
            goal.completed ? "text-gray-500 dark:text-gray-400 line-through" : style.textColor,
          )}
        >
          {goal.title}
        </h3>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className={style.textColor}>Progress</span>
            <span className={style.textColor}>{goal.progress}%</span>
          </div>
          <Progress
            value={goal.progress}
            className="h-2 bg-gray-100 dark:bg-gray-700"
            indicatorClassName={style.progressColor}
          />
        </div>

        {/* Rewards */}
        <div className="flex items-center gap-3 mb-3">
          {goal.xpReward && (
            <div className="flex items-center bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full text-xs">
              <Sparkles className="h-3 w-3 mr-1" />+{goal.xpReward} XP
            </div>
          )}

          {goal.coinReward && (
            <div className="flex items-center bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full text-xs">
              <Coins className="h-3 w-3 mr-1" />+{goal.coinReward}
            </div>
          )}

          {goal.streak && (
            <div className="flex items-center bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded-full text-xs">
              🔥 {goal.streak} day streak
            </div>
          )}
        </div>

        {/* Steps (if expanded) */}
        {goal.steps && expanded && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium mb-2">Steps to complete:</h4>
            <ul className="space-y-2">
              {goal.steps.map((step) => (
                <li key={step.id} className="flex items-start gap-2">
                  <Checkbox
                    id={`step-${step.id}`}
                    checked={step.completed}
                    onCheckedChange={() => handleStepComplete(step.id)}
                    className="mt-0.5"
                  />
                  <label
                    htmlFor={`step-${step.id}`}
                    className={cn("text-sm", step.completed ? "line-through text-gray-500 dark:text-gray-400" : "")}
                  >
                    {step.text}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-3">
          {/* Expand/Collapse Button (only if has steps) */}
          {goal.steps && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-0"
            >
              {expanded ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
              {expanded ? "Less" : "More"}
            </Button>
          )}

          {/* Complete Button */}
          {!goal.completed ? (
            <Button
              onClick={handleComplete}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full"
              size="sm"
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Mark Complete
            </Button>
          ) : (
            <div className="text-xs text-gray-500 dark:text-gray-400">Completed on {goal.completedDate}</div>
          )}
        </div>
      </div>
    </div>
  )
}
