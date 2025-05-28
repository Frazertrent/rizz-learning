"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight } from "lucide-react"

interface SchedulePreferencesStepProps {
  onContinue: (selectedPreferences: string[]) => void
  onBack: () => void
}

export function SchedulePreferencesStep({ onContinue, onBack }: SchedulePreferencesStepProps) {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([])

  const schedulePreferences = [
    {
      id: "consistent-routine",
      title: "Consistent Daily Routine",
      description: "We thrive on regular start times and a predictable flow.",
    },
    {
      id: "flexible-day",
      title: "Flexible Day-to-Day",
      description: "We go with the flow — different each day depending on needs.",
    },
    {
      id: "year-round",
      title: "Year-Round Learning",
      description: "We spread learning out evenly across the whole year.",
    },
    {
      id: "traditional-calendar",
      title: "Traditional School Calendar",
      description: "We follow semesters and take longer seasonal breaks.",
    },
    {
      id: "light-load",
      title: "Light Weekly Load (10–15 hrs/week)",
      description: "We prefer shorter days or just a few focused hours per week.",
    },
    {
      id: "standard-load",
      title: "Standard Full-Time Load (20–30 hrs/week)",
      description: "We follow a typical school-day rhythm.",
    },
    {
      id: "non-traditional-hours",
      title: "Evening or Non-Traditional Hours",
      description: "Our schedule is off-peak — evenings, weekends, or alternating days.",
    },
    {
      id: "integrated-activities",
      title: "Integrated with Sports, Travel, or Extracurriculars",
      description: "We need space for outside activities, travel, or flexible commitments.",
    },
  ]

  const togglePreference = (preferenceId: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(preferenceId) ? prev.filter((id) => id !== preferenceId) : [...prev, preferenceId],
    )
  }

  const handleContinue = () => {
    onContinue(selectedPreferences)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 mb-2">
          Schedule Preferences
        </h1>
        <p className="text-slate-300 text-lg">How would you like to structure your home school day?</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-purple-600 rounded-full p-1 text-white">🕒</span>
          <p className="text-slate-200 font-medium">How would you like to structure your homeschool day?</p>
        </div>
        <p className="text-slate-400 text-sm mb-6">Choose all that apply to your ideal schedule</p>

        <div className="grid gap-3">
          {schedulePreferences.map((preference) => (
            <Card
              key={preference.id}
              className={`p-4 cursor-pointer transition-all border-slate-800 hover:border-slate-700 ${
                selectedPreferences.includes(preference.id) ? "bg-slate-800/50 border-purple-500" : "bg-slate-900/50"
              }`}
              onClick={() => togglePreference(preference.id)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Checkbox
                    id={preference.id}
                    checked={selectedPreferences.includes(preference.id)}
                    onCheckedChange={() => togglePreference(preference.id)}
                    className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor={preference.id} className="text-slate-200 font-medium cursor-pointer">
                    {preference.title}
                  </label>
                  <p className="text-slate-400 text-sm mt-1">{preference.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          onClick={onBack}
          variant="outline"
          className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-200"
        >
          Back
        </Button>
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
