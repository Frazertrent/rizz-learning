"use client"

import { useState, useEffect } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export function HomeSchoolSplit({ formData, updateFormData }) {
  const [homePercentage, setHomePercentage] = useState(formData.homePercentage || 100)
  const [subjectLocations, setSubjectLocations] = useState(
    formData.subjectLocations || {
      math: "home",
      science: "home",
      languageArts: "home",
      history: "home",
      pe: "home",
      art: "home",
      music: "home",
      cte: "home",
      foreignLanguage: "home",
    },
  )
  const [hybridOptions, setHybridOptions] = useState(formData.hybridOptions || [])
  const [otherHybridOption, setOtherHybridOption] = useState(formData.otherHybridOption || "")

  const [isInitialRender, setIsInitialRender] = useState(true)

  useEffect(() => {
    // Skip the first render to avoid the infinite loop
    if (isInitialRender) {
      setIsInitialRender(false)
      return
    }

    updateFormData({
      homePercentage,
      subjectLocations,
      hybridOptions,
      otherHybridOption,
    })
  }, [homePercentage, subjectLocations, hybridOptions, otherHybridOption, updateFormData, isInitialRender])

  const handleSubjectLocationChange = (subject, location) => {
    setSubjectLocations({
      ...subjectLocations,
      [subject]: location,
    })
  }

  const handleHybridOptionChange = (option) => {
    if (hybridOptions.includes(option)) {
      setHybridOptions(hybridOptions.filter((o) => o !== option))
    } else {
      setHybridOptions([...hybridOptions, option])
    }
  }

  const isHybrid = homePercentage > 0 && homePercentage < 100

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl text-white">Home vs. School Split</CardTitle>
        <CardDescription className="text-gray-400">Tell us how you'll balance home and school learning</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label className="text-white text-lg">What % of learning will happen at home?</Label>
            <div className="flex items-center space-x-4 mt-2">
              <Slider
                value={[homePercentage]}
                onValueChange={(value) => setHomePercentage(value[0])}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-white font-medium w-16 text-center">{homePercentage}%</span>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-400">
              <span>All at school</span>
              <span>50/50</span>
              <span>All at home</span>
            </div>
          </div>
        </div>

        {isHybrid && (
          <>
            <div className="space-y-4">
              <Label className="text-white text-lg">Core Academic Subjects</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: "math", label: "Math" },
                  { id: "science", label: "Science" },
                  { id: "languageArts", label: "Language Arts" },
                  { id: "history", label: "History / Social Studies" },
                ].map((subject) => (
                  <div key={subject.id} className="space-y-1">
                    <Label htmlFor={subject.id} className="text-gray-300">
                      {subject.label}
                    </Label>
                    <Select
                      value={subjectLocations[subject.id]}
                      onValueChange={(value) => handleSubjectLocationChange(subject.id, value)}
                    >
                      <SelectTrigger id={subject.id} className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="school">School</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-white text-lg">Electives & Special Courses</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: "pe", label: "PE / Fitness" },
                  { id: "art", label: "Art / Drama" },
                  { id: "music", label: "Music / Band / Choir" },
                  { id: "cte", label: "Career & Technical Education" },
                  { id: "foreignLanguage", label: "Foreign Language" },
                ].map((subject) => (
                  <div key={subject.id} className="space-y-1">
                    <Label htmlFor={subject.id} className="text-gray-300">
                      {subject.label}
                    </Label>
                    <Select
                      value={subjectLocations[subject.id]}
                      onValueChange={(value) => handleSubjectLocationChange(subject.id, value)}
                    >
                      <SelectTrigger id={subject.id} className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="school">School</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-white text-lg">Additional Hybrid Options</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: "iep", label: "IEP/Special Education" },
                  { id: "socialization", label: "Socialization through school" },
                  { id: "coops", label: "Participate in homeschool co-ops" },
                  { id: "validate", label: "Validate home learning through school" },
                  { id: "other", label: "Other" },
                ].map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={hybridOptions.includes(option.id)}
                      onCheckedChange={() => handleHybridOptionChange(option.id)}
                      className="border-gray-600 data-[state=checked]:bg-blue-600"
                    />
                    <Label htmlFor={option.id} className="text-gray-300">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>

              {hybridOptions.includes("other") && (
                <div className="mt-2">
                  <Label htmlFor="other-hybrid" className="text-gray-300">
                    Please specify:
                  </Label>
                  <Input
                    id="other-hybrid"
                    value={otherHybridOption}
                    onChange={(e) => setOtherHybridOption(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white mt-1"
                    placeholder="Enter your other hybrid option"
                  />
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </>
  )
}
