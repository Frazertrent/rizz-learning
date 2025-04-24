"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"

interface FinalStepProps {
  onContinue: () => void
  onBack: () => void
}

export function FinalStep({ onContinue, onBack }: FinalStepProps) {
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

      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
          <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">Thank you for sharing!</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Our GPT-driven intelligence has compiled your information to create a personalized recommendation for your
          homeschooling journey.
        </p>
      </div>

      <div className="pt-4">
        <Link href="/personalized-plan-preview">
          <Button className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            See My Recommendation
          </Button>
        </Link>
      </div>
    </div>
  )
}
