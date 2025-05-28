"use client"
import { useEffect, useState } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, LockIcon, X } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Common languages for the typeahead
const commonLanguages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Russian",
  "Portuguese",
  "Italian",
  "Hindi",
  "Vietnamese",
  "Tagalog",
  "Ukrainian",
]

export function AutoFillApplications({ formData, updateFormData }) {
  // Move initialization logic to useEffect to avoid setState during render
  useEffect(() => {
    // Initialize applicationStudents if empty
    if (!formData.applicationStudents || formData.applicationStudents.length === 0) {
      // Check if students array exists and has items
      if (formData.students && formData.students.length > 0) {
        // Pre-populate application students from the student profiles
        const initialApplicationStudents = formData.students.map((student) => ({
          name: student.name || "",
          dob: "",
          ssn: "",
          gradeLevel: student.gradeLevel || "",
          citizenshipStatus: "",
          disability: "",
        }))

        updateFormData({
          applicationStudents: initialApplicationStudents,
          activeApplicationStudentIndex: 0,
        })
      } else {
        // If no students exist at all, create one empty student
        updateFormData({
          applicationStudents: [
            {
              name: "",
              dob: "",
              ssn: "",
              gradeLevel: "",
              citizenshipStatus: "",
              disability: "",
            },
          ],
          activeApplicationStudentIndex: 0,
        })
      }
    }

    // Initialize additional fields if they don't exist
    if (!formData.additionalInfo) {
      updateFormData({
        additionalInfo: {
          raceEthnicity: [],
          languagesSpoken: [],
          parentEmployment: "",
          parentEmploymentOther: "",
          singleParent: false,
          militaryFamily: false,
          benefitPrograms: [],
          benefitProgramsOther: "",
          otherCircumstances: "",
        },
      })
    }
  }, [formData, updateFormData])

  // Initialize state for language input
  const [languageInput, setLanguageInput] = useState("")
  const [showLanguageSuggestions, setShowLanguageSuggestions] = useState(false)

  // Get filtered language suggestions
  const getFilteredLanguages = () => {
    if (!languageInput) return commonLanguages
    return commonLanguages.filter((lang) => lang.toLowerCase().includes(languageInput.toLowerCase()))
  }

  // Handle adding a custom language
  const addLanguage = (language) => {
    if (!language.trim()) return

    const currentLanguages = formData.additionalInfo?.languagesSpoken || []
    if (!currentLanguages.includes(language)) {
      updateFormData({
        additionalInfo: {
          ...formData.additionalInfo,
          languagesSpoken: [...currentLanguages, language],
        },
      })
    }
    setLanguageInput("")
  }

  // Handle removing a language
  const removeLanguage = (language) => {
    const currentLanguages = formData.additionalInfo?.languagesSpoken || []
    updateFormData({
      additionalInfo: {
        ...formData.additionalInfo,
        languagesSpoken: currentLanguages.filter((lang) => lang !== language),
      },
    })
  }

  // Handle race/ethnicity checkbox changes
  const handleRaceEthnicityChange = (value) => {
    const currentSelections = formData.additionalInfo?.raceEthnicity || []
    let newSelections

    if (currentSelections.includes(value)) {
      newSelections = currentSelections.filter((item) => item !== value)
    } else {
      newSelections = [...currentSelections, value]
    }

    updateFormData({
      additionalInfo: {
        ...formData.additionalInfo,
        raceEthnicity: newSelections,
      },
    })
  }

  // Handle benefit programs checkbox changes
  const handleBenefitProgramsChange = (value) => {
    const currentSelections = formData.additionalInfo?.benefitPrograms || []
    let newSelections

    if (currentSelections.includes(value)) {
      newSelections = currentSelections.filter((item) => item !== value)
    } else {
      newSelections = [...currentSelections, value]
    }

    updateFormData({
      additionalInfo: {
        ...formData.additionalInfo,
        benefitPrograms: newSelections,
      },
    })
  }

  // Get active student
  const activeStudent = formData.applicationStudents?.[formData.activeApplicationStudentIndex] || {
    name: "",
    dob: "",
    ssn: "",
    gradeLevel: "",
    citizenshipStatus: "",
    disability: "",
    disabilityOther: "",
  }

  // Update active student
  const updateActiveStudent = (data) => {
    if (!formData.applicationStudents) return

    const updatedStudents = [...formData.applicationStudents]
    updatedStudents[formData.activeApplicationStudentIndex] = {
      ...updatedStudents[formData.activeApplicationStudentIndex],
      ...data,
    }
    updateFormData({ applicationStudents: updatedStudents })
  }

  // Add new student
  const addNewStudent = () => {
    const newStudents = [
      ...(formData.applicationStudents || []),
      {
        name: "",
        dob: "",
        ssn: "",
        gradeLevel: "",
        citizenshipStatus: "",
        disability: "",
      },
    ]
    updateFormData({
      applicationStudents: newStudents,
      activeApplicationStudentIndex: newStudents.length - 1,
    })
  }

  // Remove student
  const removeStudent = (index) => {
    if (!formData.applicationStudents || formData.applicationStudents.length <= 1) return

    const newStudents = formData.applicationStudents.filter((_, i) => i !== index)
    const newActiveIndex =
      formData.activeApplicationStudentIndex >= index && formData.activeApplicationStudentIndex > 0
        ? formData.activeApplicationStudentIndex - 1
        : formData.activeApplicationStudentIndex

    updateFormData({
      applicationStudents: newStudents,
      activeApplicationStudentIndex: Math.min(newActiveIndex, newStudents.length - 1),
    })
  }

  // Switch to student
  const switchToStudent = (index) => {
    updateFormData({ activeApplicationStudentIndex: index })
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl text-white">Auto-Fill Applications</CardTitle>
        <CardDescription className="text-gray-400">
          Enter optional data that can be used to speed up applications for grants, scholarships, and reimbursements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-3 bg-gray-800 rounded border border-gray-700 text-gray-300 text-sm">
          <p>All fields are optional. This information is only used to auto-fill official applications.</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-white text-lg font-medium">Parent Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parent-name" className="text-gray-300">
                Name:
              </Label>
              <Input
                id="parent-name"
                value={formData.parent?.name || ""}
                onChange={(e) =>
                  updateFormData({
                    parent: { ...(formData.parent || {}), name: e.target.value },
                  })
                }
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter parent name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent-email" className="text-gray-300">
                Email:
              </Label>
              <Input
                id="parent-email"
                type="email"
                value={formData.parent?.email || ""}
                onChange={(e) =>
                  updateFormData({
                    parent: { ...(formData.parent || {}), email: e.target.value },
                  })
                }
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter parent email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="parent-phone" className="text-gray-300">
              Phone:
            </Label>
            <Input
              id="parent-phone"
              type="tel"
              value={formData.parent?.phone || ""}
              onChange={(e) =>
                updateFormData({
                  parent: { ...(formData.parent || {}), phone: e.target.value },
                })
              }
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Enter parent phone"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-white text-lg font-medium">Student Information</h3>

          {formData.applicationStudents && formData.applicationStudents.length > 0 && (
            <Tabs
              value={formData.activeApplicationStudentIndex?.toString() || "0"}
              onValueChange={(value) => switchToStudent(Number(value))}
              className="w-full"
            >
              <div className="flex items-center mb-4 overflow-x-auto">
                <TabsList className="bg-gray-800">
                  {formData.applicationStudents.map((student, index) => (
                    <TabsTrigger key={index} value={index.toString()} className="relative">
                      {student.name || `Student ${index + 1}`}
                      {formData.applicationStudents.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeStudent(index)
                          }}
                          className="ml-2 text-gray-400 hover:text-red-400"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {formData.applicationStudents.map((student, index) => (
                <TabsContent key={index} value={index.toString()} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`student-name-${index}`} className="text-gray-300">
                        Name:
                      </Label>
                      <Input
                        id={`student-name-${index}`}
                        value={student.name || ""}
                        onChange={(e) => updateActiveStudent({ name: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Enter student name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`student-dob-${index}`} className="text-gray-300">
                        Date of Birth:
                      </Label>
                      <Input
                        id={`student-dob-${index}`}
                        type="date"
                        value={student.dob || ""}
                        onChange={(e) => updateActiveStudent({ dob: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor={`student-ssn-${index}`} className="text-gray-300 flex items-center">
                        SSN (optional, secure): <LockIcon size={14} className="ml-1 text-gray-500" />
                      </Label>
                      <Input
                        id={`student-ssn-${index}`}
                        type="password"
                        value={student.ssn || ""}
                        onChange={(e) => updateActiveStudent({ ssn: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Enter SSN (optional)"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`student-grade-${index}`} className="text-gray-300">
                        Grade Level:
                      </Label>
                      <Select
                        value={student.gradeLevel || ""}
                        onValueChange={(value) => updateActiveStudent({ gradeLevel: value })}
                      >
                        <SelectTrigger id={`student-grade-${index}`} className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Select grade level" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="pre-k">Pre-K</SelectItem>
                          <SelectItem value="k">Kindergarten</SelectItem>
                          <SelectItem value="1">1st Grade</SelectItem>
                          <SelectItem value="2">2nd Grade</SelectItem>
                          <SelectItem value="3">3rd Grade</SelectItem>
                          <SelectItem value="4">4th Grade</SelectItem>
                          <SelectItem value="5">5th Grade</SelectItem>
                          <SelectItem value="6">6th Grade</SelectItem>
                          <SelectItem value="7">7th Grade</SelectItem>
                          <SelectItem value="8">8th Grade</SelectItem>
                          <SelectItem value="9">9th Grade</SelectItem>
                          <SelectItem value="10">10th Grade</SelectItem>
                          <SelectItem value="11">11th Grade</SelectItem>
                          <SelectItem value="12">12th Grade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor={`citizenship-status-${index}`} className="text-gray-300">
                        Citizenship Status:
                      </Label>
                      <Select
                        value={student.citizenshipStatus || ""}
                        onValueChange={(value) => updateActiveStudent({ citizenshipStatus: value })}
                      >
                        <SelectTrigger
                          id={`citizenship-status-${index}`}
                          className="bg-gray-800 border-gray-700 text-white"
                        >
                          <SelectValue placeholder="Select citizenship status" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="us-citizen">U.S. Citizen</SelectItem>
                          <SelectItem value="permanent-resident">Permanent Resident</SelectItem>
                          <SelectItem value="non-citizen-visa">Non-Citizen with Visa</SelectItem>
                          <SelectItem value="refugee-asylee">Refugee / Asylee</SelectItem>
                          <SelectItem value="undocumented">Undocumented</SelectItem>
                          <SelectItem value="prefer-not-to-answer">Prefer not to answer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`disability-${index}`} className="text-gray-300">
                        Disability or Special Needs Status:
                      </Label>
                      <Select
                        value={student.disability || ""}
                        onValueChange={(value) => updateActiveStudent({ disability: value })}
                      >
                        <SelectTrigger id={`disability-${index}`} className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Select disability status" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="no-disability">No disability</SelectItem>
                          <SelectItem value="physical">Physical disability</SelectItem>
                          <SelectItem value="learning">Learning disability</SelectItem>
                          <SelectItem value="emotional-behavioral">Emotional/behavioral disorder</SelectItem>
                          <SelectItem value="autism">Autism spectrum</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-answer">Prefer not to answer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {student.disability === "other" && (
                    <div className="mt-4 space-y-2">
                      <Label htmlFor={`disability-other-${index}`} className="text-gray-300">
                        Please specify disability or special needs:
                      </Label>
                      <Input
                        id={`disability-other-${index}`}
                        value={student.disabilityOther || ""}
                        onChange={(e) => updateActiveStudent({ disabilityOther: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Please specify"
                      />
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          )}

          <Button
            variant="outline"
            onClick={addNewStudent}
            className="w-full mt-4 border-dashed border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <PlusCircle size={16} className="mr-2" />
            Add Another Student
          </Button>
        </div>

        <div className="space-y-6">
          <h3 className="text-white text-lg font-medium">Additional Information</h3>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-gray-300">
              Address:
            </Label>
            <Input
              id="address"
              value={formData.address || ""}
              onChange={(e) => updateFormData({ address: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Enter full address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="district" className="text-gray-300">
                School District:
              </Label>
              <Input
                id="district"
                value={formData.district || ""}
                onChange={(e) => updateFormData({ district: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter school district"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-email" className="text-gray-300">
                Preferred Contact Email:
              </Label>
              <Input
                id="contact-email"
                type="email"
                value={formData.contactEmail || ""}
                onChange={(e) => updateFormData({ contactEmail: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter preferred email"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-gray-300">Race / Ethnicity:</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: "white", label: "White" },
                { id: "black", label: "Black or African American" },
                { id: "hispanic", label: "Hispanic or Latino" },
                { id: "asian", label: "Asian" },
                { id: "native-american", label: "Native American or Alaska Native" },
                { id: "pacific-islander", label: "Native Hawaiian or Pacific Islander" },
                { id: "two-or-more", label: "Two or more races" },
                { id: "prefer-not-to-answer", label: "Prefer not to answer" },
              ].map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`race-${item.id}`}
                    checked={(formData.additionalInfo?.raceEthnicity || []).includes(item.id)}
                    onCheckedChange={() => handleRaceEthnicityChange(item.id)}
                    className="border-gray-600 data-[state=checked]:bg-blue-600"
                  />
                  <Label htmlFor={`race-${item.id}`} className="text-gray-300 cursor-pointer">
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-gray-300">Language(s) Spoken at Home:</Label>
            <div className="relative">
              <div className="flex flex-wrap gap-2 mb-2">
                {(formData.additionalInfo?.languagesSpoken || []).map((language) => (
                  <Badge key={language} className="bg-gray-700 text-white hover:bg-gray-600">
                    {language}
                    <button onClick={() => removeLanguage(language)} className="ml-1 text-gray-300 hover:text-white">
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="relative">
                <Input
                  value={languageInput}
                  onChange={(e) => {
                    setLanguageInput(e.target.value)
                    setShowLanguageSuggestions(true)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addLanguage(languageInput)
                    }
                  }}
                  onBlur={() => setTimeout(() => setShowLanguageSuggestions(false), 200)}
                  onFocus={() => setShowLanguageSuggestions(true)}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Type a language or select from suggestions"
                />
                {showLanguageSuggestions && (
                  <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                    {getFilteredLanguages().map((language) => (
                      <div
                        key={language}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-700 text-gray-300"
                        onClick={() => {
                          addLanguage(language)
                          setShowLanguageSuggestions(false)
                        }}
                      >
                        {language}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Press Enter to add a custom language</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parent-employment" className="text-gray-300">
                Parent Employment Status:
              </Label>
              <Select
                value={formData.additionalInfo?.parentEmployment || ""}
                onValueChange={(value) =>
                  updateFormData({
                    additionalInfo: {
                      ...formData.additionalInfo,
                      parentEmployment: value,
                    },
                  })
                }
              >
                <SelectTrigger id="parent-employment" className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select employment status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="self-employed">Self-employed</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="homemaker">Homemaker</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.additionalInfo?.parentEmployment === "other" && (
              <div className="space-y-2">
                <Label htmlFor="parent-employment-other" className="text-gray-300">
                  Please specify employment:
                </Label>
                <Input
                  id="parent-employment-other"
                  value={formData.additionalInfo?.parentEmploymentOther || ""}
                  onChange={(e) =>
                    updateFormData({
                      additionalInfo: {
                        ...formData.additionalInfo,
                        parentEmploymentOther: e.target.value,
                      },
                    })
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Please specify"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="single-parent"
                checked={formData.additionalInfo?.singleParent || false}
                onCheckedChange={(checked) =>
                  updateFormData({
                    additionalInfo: {
                      ...formData.additionalInfo,
                      singleParent: checked,
                    },
                  })
                }
                className="data-[state=checked]:bg-blue-600"
              />
              <Label htmlFor="single-parent" className="text-gray-300">
                Are you a single-parent household?
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="military-family"
                checked={formData.additionalInfo?.militaryFamily || false}
                onCheckedChange={(checked) =>
                  updateFormData({
                    additionalInfo: {
                      ...formData.additionalInfo,
                      militaryFamily: checked,
                    },
                  })
                }
                className="data-[state=checked]:bg-blue-600"
              />
              <Label htmlFor="military-family" className="text-gray-300">
                Are you a military or veteran family?
              </Label>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-gray-300">Do you participate in any of the following benefit programs?</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: "snap", label: "SNAP / EBT" },
                { id: "tanf", label: "TANF" },
                { id: "wic", label: "WIC" },
                { id: "medicaid", label: "Medicaid / CHIP" },
                { id: "free-lunch", label: "Free or Reduced Lunch" },
                { id: "disability", label: "Social Security Disability" },
                { id: "housing", label: "Housing Assistance (Section 8, etc.)" },
                { id: "other", label: "Other" },
              ].map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`benefit-${item.id}`}
                    checked={(formData.additionalInfo?.benefitPrograms || []).includes(item.id)}
                    onCheckedChange={() => handleBenefitProgramsChange(item.id)}
                    className="border-gray-600 data-[state=checked]:bg-blue-600"
                  />
                  <Label htmlFor={`benefit-${item.id}`} className="text-gray-300 cursor-pointer">
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {(formData.additionalInfo?.benefitPrograms || []).includes("other") && (
            <div className="space-y-2">
              <Label htmlFor="benefit-other" className="text-gray-300">
                Please specify other benefit programs:
              </Label>
              <Input
                id="benefit-other"
                value={formData.additionalInfo?.benefitProgramsOther || ""}
                onChange={(e) =>
                  updateFormData({
                    additionalInfo: {
                      ...formData.additionalInfo,
                      benefitProgramsOther: e.target.value,
                    },
                  })
                }
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Please specify"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="other-circumstances" className="text-gray-300">
              Other circumstances that may be helpful to know when applying for aid:
            </Label>
            <Textarea
              id="other-circumstances"
              value={formData.additionalInfo?.otherCircumstances || ""}
              onChange={(e) =>
                updateFormData({
                  additionalInfo: {
                    ...formData.additionalInfo,
                    otherCircumstances: e.target.value,
                  },
                })
              }
              className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
              placeholder="Enter any additional information that might be relevant for applications (optional)"
            />
          </div>
        </div>

        <div className="p-3 bg-gray-800 rounded border border-gray-700 text-gray-300 text-sm">
          <p>
            All information is stored securely and only used when you explicitly choose to auto-fill an application.
          </p>
        </div>
      </CardContent>
    </>
  )
}
