"use client"

import { useState, useEffect } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function EducationalValues({ formData, updateFormData }) {
  const [structurePreference, setStructurePreference] = useState(formData.structurePreference || "balance")
  const [values, setValues] = useState(formData.educationalValues || [])
  const [otherValue, setOtherValue] = useState(formData.otherValue || "")
  const [isInitialRender, setIsInitialRender] = useState(true)

  useEffect(() => {
    // Skip the first render to avoid the infinite loop
    if (isInitialRender) {
      setIsInitialRender(false)
      return
    }

    updateFormData({
      structurePreference,
      educationalValues: values,
      otherValue,
    })
  }, [structurePreference, values, otherValue, updateFormData, isInitialRender])

  const handleValueChange = (value) => {
    if (values.includes(value)) {
      setValues(values.filter((v) => v !== value))
    } else {
      setValues([...values, value])
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl text-white">Educational Values</CardTitle>
        <CardDescription className="text-gray-400">
          Tell us about your parenting style and educational values
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-white text-lg">Do you prefer structure or flexibility?</Label>
          <RadioGroup value={structurePreference} onValueChange={setStructurePreference} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="structure" id="structure" className="border-gray-600 text-blue-600" />
              <Label htmlFor="structure" className="text-gray-300">
                Structure
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="flexibility" id="flexibility" className="border-gray-600 text-blue-600" />
              <Label htmlFor="flexibility" className="text-gray-300">
                Flexibility
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="balance" id="balance" className="border-gray-600 text-blue-600" />
              <Label htmlFor="balance" className="text-gray-300">
                Balance
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="not-sure" id="not-sure" className="border-gray-600 text-blue-600" />
              <Label htmlFor="not-sure" className="text-gray-300">
                Not sure yet
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label className="text-white text-lg">Select your educational values:</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { id: "independence", label: "Independence and self-learning" },
              { id: "parent-led", label: "Parent-led instruction" },
              { id: "project-based", label: "Project-based learning" },
              { id: "memorization", label: "Memorization and mastery" },
              { id: "exploration", label: "Exploration and creativity" },
              { id: "other", label: "Other" },
            ].map((value) => (
              <div key={value.id} className="flex items-center space-x-2">
                <Checkbox
                  id={value.id}
                  checked={values.includes(value.id)}
                  onCheckedChange={() => handleValueChange(value.id)}
                  className="border-gray-600 data-[state=checked]:bg-blue-600"
                />
                <Label htmlFor={value.id} className="text-gray-300">
                  {value.label}
                </Label>
              </div>
            ))}
          </div>

          {values.includes("other") && (
            <div className="mt-2">
              <Label htmlFor="other-value" className="text-gray-300">
                Please specify:
              </Label>
              <Input
                id="other-value"
                value={otherValue}
                onChange={(e) => setOtherValue(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white mt-1"
                placeholder="Describe your other educational value"
              />
            </div>
          )}
        </div>
      </CardContent>
    </>
  )
}
