"use client"

import { useState, useEffect } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function ParentOversight({ formData, updateFormData }) {
  const [involvement, setInvolvement] = useState(formData.parentInvolvement || "active")
  const [preferences, setPreferences] = useState(formData.oversightPreferences || [])
  const [isInitialRender, setIsInitialRender] = useState(true)

  useEffect(() => {
    // Skip the first render to avoid the infinite loop
    if (isInitialRender) {
      setIsInitialRender(false)
      return
    }

    updateFormData({
      parentInvolvement: involvement,
      oversightPreferences: preferences,
    })
  }, [involvement, preferences, updateFormData, isInitialRender])

  const handlePreferenceChange = (preference) => {
    if (preferences.includes(preference)) {
      setPreferences(preferences.filter((p) => p !== preference))
    } else {
      setPreferences([...preferences, preference])
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl text-white">Parent Oversight</CardTitle>
        <CardDescription className="text-gray-400">
          Define your involvement preferences in your child's education
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-white text-lg">How involved will you be?</Label>
          <RadioGroup value={involvement} onValueChange={setInvolvement} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="active" id="active" className="border-gray-600 text-blue-600" />
              <Label htmlFor="active" className="text-gray-300">
                Actively engaged daily
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weekly" id="weekly" className="border-gray-600 text-blue-600" />
              <Label htmlFor="weekly" className="text-gray-300">
                Weekly review only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="minimal" id="minimal" className="border-gray-600 text-blue-600" />
              <Label htmlFor="minimal" className="text-gray-300">
                Minimal – delegate to AI
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="flexible" id="flexible" className="border-gray-600 text-blue-600" />
              <Label htmlFor="flexible" className="text-gray-300">
                Flexible
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label className="text-white text-lg">Preferences:</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { id: "grade", label: "I want to grade assignments" },
              { id: "enforce", label: "I want GPT to enforce quality and request revisions" },
              { id: "alerts", label: "I want alerts when tasks are missed" },
              { id: "bad-guy", label: "I want GPT to act as the 'bad guy' so I don't have to" },
            ].map((preference) => (
              <div key={preference.id} className="flex items-center space-x-2">
                <Checkbox
                  id={preference.id}
                  checked={preferences.includes(preference.id)}
                  onCheckedChange={() => handlePreferenceChange(preference.id)}
                  className="border-gray-600 data-[state=checked]:bg-blue-600"
                />
                <Label htmlFor={preference.id} className="text-gray-300">
                  {preference.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </>
  )
}
