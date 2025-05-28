"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Blend, School } from "lucide-react"
import type { OnboardingData } from "./onboarding-flow"

interface WelcomeStepProps {
  onContinue: () => void
  updateData: (data: Partial<OnboardingData>) => void
  data: OnboardingData
}

export function WelcomeStep({ onContinue, updateData, data }: WelcomeStepProps) {
  const handleSelect = (path: "curious" | "existing" | "hybrid") => {
    updateData({ path })
  }

  const isSelected = (path: "curious" | "existing" | "hybrid") => {
    return data.path === path
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Let's Discover the Right Path for Your Child
        </h1>
        <p className="text-xl text-slate-300">This quick assessment takes less than 2 minutes. No login required.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <Card
          className={`cursor-pointer transition-all hover:scale-105 ${
            isSelected("curious") ? "border-blue-500 bg-slate-800" : "border-slate-700 bg-slate-800/50"
          }`}
          onClick={() => handleSelect("curious")}
        >
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-medium">I'm curious about homeschooling</h3>
            <p className="text-sm text-slate-400">
              Explore options for transitioning from traditional school to home education
            </p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:scale-105 ${
            isSelected("existing") ? "border-purple-500 bg-slate-800" : "border-slate-700 bg-slate-800/50"
          }`}
          onClick={() => handleSelect("existing")}
        >
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <School className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-medium">I'm already homeschooling but need better tools</h3>
            <p className="text-sm text-slate-400">
              Upgrade your existing homeschool setup with automation and structure
            </p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:scale-105 ${
            isSelected("hybrid") ? "border-teal-500 bg-slate-800" : "border-slate-700 bg-slate-800/50"
          }`}
          onClick={() => handleSelect("hybrid")}
        >
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-teal-500/20 flex items-center justify-center">
              <Blend className="h-6 w-6 text-teal-400" />
            </div>
            <h3 className="text-lg font-medium">I want to blend in-school and at-home learning</h3>
            <p className="text-sm text-slate-400">
              Create a hybrid approach that combines traditional school with home education
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mt-8">
        <Button
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
          onClick={onContinue}
          disabled={!data.path}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
