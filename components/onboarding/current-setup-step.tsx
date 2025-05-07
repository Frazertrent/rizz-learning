"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, BookOpen, Calendar, Target } from "lucide-react"
import type { CurrentSetup } from "./onboarding-flow"

interface CurrentSetupStepProps {
  onContinue: (setupData: CurrentSetup) => void
  onBack: () => void
}

export function CurrentSetupStep({ onContinue, onBack }: CurrentSetupStepProps) {
  const [curriculum, setCurriculum] = useState<string[]>([])
  const [otherCurriculum, setOtherCurriculum] = useState("")
  const [organizationMethod, setOrganizationMethod] = useState("")
  const [priorities, setPriorities] = useState<string[]>([])
  const [otherPriority, setOtherPriority] = useState("")

  const curriculumOptions = [
    "Jordan Credit Center",
    "SEATS Program",
    "Harmony Education",
    "K12 / Stride Learning",
    "Connections Academy",
    "Self-designed curriculum",
    "Online course subscriptions",
    "Local Co-Op",
    "Public School Part-Time",
    "Private or Microschool Hybrid",
    "None yet – still exploring",
    "Other",
  ]

  const organizationOptions = [
    "Block schedule (AM/PM focus)",
    "Traditional 6-subject daily rotation",
    "Unit studies or theme-based",
    "Weekly goal list (flexible days)",
    "We're still figuring it out",
    "Other",
  ]

  const priorityOptions = [
    "Finding the right curriculum",
    "Building a solid routine",
    "Managing multiple kids",
    "Catching up in one or more subjects",
    "Exploring special education supports",
    "Prepping for college or transcripts",
    "Encouraging independence",
    "Avoiding burnout",
    "Other",
  ]

  const toggleCurriculum = (value: string) => {
    setCurriculum((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  const togglePriority = (value: string) => {
    setPriorities((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value)
      } else {
        // Limit to 3 selections
        if (prev.length >= 3) {
          return [...prev.slice(1), value]
        }
        return [...prev, value]
      }
    })
  }

  const handleContinue = () => {
    const setupData: CurrentSetup = {
      curriculum,
      organizationMethod,
      priorities,
    }

    if (curriculum.includes("Other") && otherCurriculum) {
      setupData.otherCurriculum = otherCurriculum
    }

    if (priorities.includes("Other") && otherPriority) {
      setupData.otherPriority = otherPriority
    }

    onContinue(setupData)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400">
          Current Setup
        </h1>
        <p className="text-xl text-slate-300">🏠 What does your homeschool or hybrid setup look like right now?</p>
        <p className="text-sm text-slate-400 mt-2">
          Select all that apply. This helps us build around what you're already doing.
        </p>
      </div>

      <div className="space-y-8">
        {/* Curriculum Section */}
        <div className="space-y-4 p-6 rounded-xl bg-slate-800/50">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-medium">📚 Curriculum or Program You're Using</h2>
          </div>
          <p className="text-sm text-slate-400">Choose one or more</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {curriculumOptions.map((option) => (
              <div key={option} className="flex items-start space-x-2">
                <Checkbox
                  id={`curriculum-${option}`}
                  checked={curriculum.includes(option)}
                  onCheckedChange={() => toggleCurriculum(option)}
                  className="mt-1"
                />
                <label
                  htmlFor={`curriculum-${option}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>

          {curriculum.includes("Other") && (
            <div className="mt-3">
              <Input
                placeholder="Please specify other curriculum..."
                value={otherCurriculum}
                onChange={(e) => setOtherCurriculum(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          )}
        </div>

        {/* Organization Method Section */}
        <div className="space-y-4 p-6 rounded-xl bg-slate-800/50">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-medium">🗓️ How do you organize your learning days?</h2>
          </div>
          <p className="text-sm text-slate-400">Choose one</p>

          <Select onValueChange={setOrganizationMethod} value={organizationMethod}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Select an organization method" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              {organizationOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Priorities Section */}
        <div className="space-y-4 p-6 rounded-xl bg-slate-800/50">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-medium">🎯 What are your biggest priorities right now?</h2>
          </div>
          <p className="text-sm text-slate-400">Choose up to 3</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {priorityOptions.map((option) => (
              <div key={option} className="flex items-start space-x-2">
                <Checkbox
                  id={`priority-${option}`}
                  checked={priorities.includes(option)}
                  onCheckedChange={() => togglePriority(option)}
                  className="mt-1"
                  disabled={!priorities.includes(option) && priorities.length >= 3 && option !== "Other"}
                />
                <label
                  htmlFor={`priority-${option}`}
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed 
                    ${
                      !priorities.includes(option) && priorities.length >= 3 && option !== "Other"
                        ? "opacity-50"
                        : "cursor-pointer"
                    }`}
                >
                  {option}
                </label>
              </div>
            ))}
          </div>

          {priorities.includes("Other") && (
            <div className="mt-3">
              <Input
                placeholder="Please specify other priority..."
                value={otherPriority}
                onChange={(e) => setOtherPriority(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex items-center gap-2 bg-transparent border-slate-600 text-white hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleContinue}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
