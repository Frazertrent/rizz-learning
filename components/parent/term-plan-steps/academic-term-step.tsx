"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { TermPlanData } from "../term-plan-builder"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AcademicTermStepProps {
  termPlanData: TermPlanData
  updateTermPlanData: (data: Partial<TermPlanData>) => void
}

export function AcademicTermStep({ termPlanData, updateTermPlanData }: AcademicTermStepProps) {
  const [selectedTerm, setSelectedTerm] = useState(termPlanData.termType || "")
  const [selectedYear, setSelectedYear] = useState(
    termPlanData.termYear?.toString() || new Date().getFullYear().toString(),
  )
  const [customTerm, setCustomTerm] = useState("")
  const [isInitialRender, setIsInitialRender] = useState(true)

  // Generate year options (current year and next 5 years)
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 6 }, (_, i) => (currentYear + i).toString())

  // Update parent component when term changes - but only if it's different
  useEffect(() => {
    // Skip the first render to prevent unnecessary updates
    if (isInitialRender) {
      setIsInitialRender(false)
      return
    }

    // Only update if the term has actually changed
    const termType = selectedTerm
    const termYear = Number.parseInt(selectedYear, 10)
    const academicTerm =
      selectedTerm === "Custom / Other" ? customTerm || "Custom Term" : `${selectedTerm} ${selectedYear}`

    if (
      termPlanData.academicTerm !== academicTerm ||
      termPlanData.termType !== termType ||
      termPlanData.termYear !== termYear
    ) {
      updateTermPlanData({
        academicTerm,
        termType,
        termYear,
      })
    }
  }, [selectedTerm, customTerm, selectedYear, updateTermPlanData, termPlanData, isInitialRender])

  const handleTermChange = (value: string) => {
    setSelectedTerm(value)
  }

  const handleYearChange = (value: string) => {
    setSelectedYear(value)
  }

  const handleCustomTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTerm(e.target.value)
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-300">
        Select the academic term and year you're planning for. This will help us tailor recommendations and resources
        specific to that time period.
      </p>

      <Card className="p-6 bg-gray-700 border-gray-600">
        <div className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="term-type" className="text-lg text-gray-200">
              Term
            </Label>
            <RadioGroup id="term-type" value={selectedTerm} onValueChange={handleTermChange} className="space-y-4">
              {["Summer", "Fall", "Winter", "Spring", "Custom / Other"].map((term) => (
                <div key={term} className="flex items-center space-x-2">
                  <RadioGroupItem value={term} id={term.toLowerCase()} />
                  <Label htmlFor={term.toLowerCase()} className="text-lg text-gray-200">
                    {term}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="term-year" className="text-lg text-gray-200">
              Year
            </Label>
            <Select value={selectedYear} onValueChange={handleYearChange}>
              <SelectTrigger id="term-year" className="bg-gray-800 border-gray-600 text-gray-200">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 text-gray-200">
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTerm === "Custom / Other" && (
            <div className="space-y-2">
              <Label htmlFor="custom-term" className="text-gray-200">
                Custom Term Name
              </Label>
              <Input
                id="custom-term"
                placeholder="e.g., 2023-2024 School Year"
                value={customTerm}
                onChange={handleCustomTermChange}
                className="mt-1 bg-gray-800 border-gray-600 text-gray-200"
              />
            </div>
          )}
        </div>
      </Card>

      <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-700">
        <p className="text-purple-200">
          <span className="font-medium">Tip:</span> Planning by terms helps create natural breaks in your homeschool
          year and allows you to adjust your approach based on seasonal changes and your child's progress.
        </p>
      </div>
    </div>
  )
}
