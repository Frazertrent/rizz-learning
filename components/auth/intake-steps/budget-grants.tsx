"use client"

import { useState, useEffect } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function BudgetGrants({ formData, updateFormData }) {
  const [educationBudget, setEducationBudget] = useState(formData.educationBudget || "")
  const [rewardBudget, setRewardBudget] = useState(formData.rewardBudget || "")
  const [checkForGrants, setCheckForGrants] = useState(formData.checkForGrants || false)
  const [householdIncome, setHouseholdIncome] = useState(formData.householdIncome || "")
  const [dependents, setDependents] = useState(formData.dependents || "")
  const [parentEducation, setParentEducation] = useState(formData.parentEducation || "")
  const [zipCode, setZipCode] = useState(formData.zipCode || "")
  const [demographics, setDemographics] = useState(
    formData.demographics || {
      raceEthnicity: "",
      citizenship: "",
      disability: "",
      language: "",
      other: "",
    },
  )

  const [isInitialRender, setIsInitialRender] = useState(true)

  useEffect(() => {
    // Skip the first render to avoid the infinite loop
    if (isInitialRender) {
      setIsInitialRender(false)
      return
    }

    updateFormData({
      educationBudget,
      rewardBudget,
      checkForGrants,
      householdIncome,
      dependents,
      parentEducation,
      zipCode,
      demographics,
    })
  }, [
    educationBudget,
    rewardBudget,
    checkForGrants,
    householdIncome,
    dependents,
    parentEducation,
    zipCode,
    demographics,
    updateFormData,
    isInitialRender,
  ])

  const handleDemographicChange = (field, value) => {
    setDemographics({
      ...demographics,
      [field]: value,
    })
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl text-white">Budget & Grants</CardTitle>
        <CardDescription className="text-gray-400">
          Set up your financial preferences and explore available benefits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="education-budget" className="text-white">
              Monthly education budget:
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <Input
                id="education-budget"
                type="number"
                value={educationBudget}
                onChange={(e) => setEducationBudget(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white pl-7"
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reward-budget" className="text-white">
              Monthly reward/incentive budget:
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <Input
                id="reward-budget"
                type="number"
                value={rewardBudget}
                onChange={(e) => setRewardBudget(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white pl-7"
                placeholder="Optional"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="check-grants" className="text-white">
              Input income to find grants/scholarships
            </Label>
            <Switch
              id="check-grants"
              checked={checkForGrants}
              onCheckedChange={setCheckForGrants}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>

          {checkForGrants && (
            <div className="space-y-4 pt-2 border-t border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="household-income" className="text-gray-300">
                    Household income ($):
                  </Label>
                  <Input
                    id="household-income"
                    type="number"
                    value={householdIncome}
                    onChange={(e) => setHouseholdIncome(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Annual household income"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dependents" className="text-gray-300">
                    Number of dependents:
                  </Label>
                  <Input
                    id="dependents"
                    type="number"
                    min="1"
                    value={dependents}
                    onChange={(e) => setDependents(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Number of children"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parent-education" className="text-gray-300">
                    Parent education level:
                  </Label>
                  <Select value={parentEducation} onValueChange={setParentEducation}>
                    <SelectTrigger id="parent-education" className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="some-college">Some College</SelectItem>
                      <SelectItem value="associates">Associate's Degree</SelectItem>
                      <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                      <SelectItem value="masters">Master's Degree</SelectItem>
                      <SelectItem value="doctorate">Doctorate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip-code" className="text-gray-300">
                    ZIP code:
                  </Label>
                  <Input
                    id="zip-code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Your ZIP code"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Label className="text-gray-300 block mb-2">
                  Optional demographic information (you can skip any of these):
                </Label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="race-ethnicity" className="text-gray-400 text-sm">
                      Race/Ethnicity:
                    </Label>
                    <Select
                      value={demographics.raceEthnicity}
                      onValueChange={(value) => handleDemographicChange("raceEthnicity", value)}
                    >
                      <SelectTrigger id="race-ethnicity" className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select or skip" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="skip">Prefer not to say</SelectItem>
                        <SelectItem value="white">White</SelectItem>
                        <SelectItem value="black">Black or African American</SelectItem>
                        <SelectItem value="hispanic">Hispanic or Latino</SelectItem>
                        <SelectItem value="asian">Asian</SelectItem>
                        <SelectItem value="native">Native American</SelectItem>
                        <SelectItem value="pacific">Pacific Islander</SelectItem>
                        <SelectItem value="mixed">Two or more races</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="citizenship" className="text-gray-400 text-sm">
                      Citizenship:
                    </Label>
                    <Select
                      value={demographics.citizenship}
                      onValueChange={(value) => handleDemographicChange("citizenship", value)}
                    >
                      <SelectTrigger id="citizenship" className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select or skip" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="skip">Prefer not to say</SelectItem>
                        <SelectItem value="citizen">US Citizen</SelectItem>
                        <SelectItem value="permanent">Permanent Resident</SelectItem>
                        <SelectItem value="visa">Visa Holder</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="disability" className="text-gray-400 text-sm">
                      Disability Status:
                    </Label>
                    <Select
                      value={demographics.disability}
                      onValueChange={(value) => handleDemographicChange("disability", value)}
                    >
                      <SelectTrigger id="disability" className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select or skip" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="skip">Prefer not to say</SelectItem>
                        <SelectItem value="none">No disability</SelectItem>
                        <SelectItem value="physical">Physical disability</SelectItem>
                        <SelectItem value="learning">Learning disability</SelectItem>
                        <SelectItem value="multiple">Multiple disabilities</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-gray-400 text-sm">
                      Language at home:
                    </Label>
                    <Select
                      value={demographics.language}
                      onValueChange={(value) => handleDemographicChange("language", value)}
                    >
                      <SelectTrigger id="language" className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select or skip" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="skip">Prefer not to say</SelectItem>
                        <SelectItem value="english">English only</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="chinese">Chinese</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="vietnamese">Vietnamese</SelectItem>
                        <SelectItem value="arabic">Arabic</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="other-demographic" className="text-gray-400 text-sm">
                    Other circumstances (optional):
                  </Label>
                  <Input
                    id="other-demographic"
                    value={demographics.other}
                    onChange={(e) => handleDemographicChange("other", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Any other relevant information"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </>
  )
}
