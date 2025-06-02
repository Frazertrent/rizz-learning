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
import { PlusCircle, LockIcon, X, CheckCircle } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface ApplicationStudent {
  name: string
  dob: string
  ssn: string
  gradeLevel: string
  citizenshipStatus: string
  disability: string
  disabilityOther?: string
}

interface AdditionalInfo {
  raceEthnicity: string[]
  languagesSpoken: string[]
  parentEmployment: string
  parentEmploymentOther: string
  singleParent: boolean
  militaryFamily: boolean
  benefitPrograms: string[]
  benefitProgramsOther: string
  otherCircumstances: string
  address?: string
  district?: string
  contactEmail?: string
}

interface ContactInfo {
  address: string
  district: string
  contactEmail: string
}

interface AutoFillApplicationsData {
  applicationStudents: ApplicationStudent[]
  activeApplicationStudentIndex: number
  additionalInfo: AdditionalInfo
  contactInfo: ContactInfo
  students?: { name: string; gradeLevel: string }[] // Optional, used for pre-population
}

interface AutoFillApplicationsProps {
  formData: Partial<AutoFillApplicationsData>
  updateFormData: (data: Partial<AutoFillApplicationsData>) => void
}

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

export function AutoFillApplications({ formData, updateFormData }: AutoFillApplicationsProps) {
  const [languageInput, setLanguageInput] = useState("")
  const [showLanguageSuggestions, setShowLanguageSuggestions] = useState(false)
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Initialize state and sync with incoming formData changes
  useEffect(() => {
    console.log("AutoFillApplications: Incoming formData update", formData)

    // Initialize applicationStudents if empty
    if (!formData.applicationStudents || formData.applicationStudents.length === 0) {
      console.log("AutoFillApplications: Initializing application students")
      
      // Check if students array exists and has items
      if (formData.students && formData.students.length > 0) {
        console.log("AutoFillApplications: Pre-populating from student profiles", formData.students)
        // Pre-populate application students from the student profiles
        const initialApplicationStudents = formData.students.map((student) => ({
          name: student.name || "",
          dob: "",
          ssn: "",
          gradeLevel: student.gradeLevel || "",
          citizenshipStatus: "",
          disability: "",
        }))

        updateFormDataWithSave({
          applicationStudents: initialApplicationStudents,
          activeApplicationStudentIndex: 0,
        })
      } else {
        console.log("AutoFillApplications: Creating empty student")
        // If no students exist at all, create one empty student
        updateFormDataWithSave({
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
      console.log("AutoFillApplications: Initializing additional info")
      updateFormDataWithSave({
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
  }, [formData])

  const updateFormDataWithSave = (data: Partial<AutoFillApplicationsData>) => {
    console.log("AutoFillApplications: Updating form data with save", data)
    setIsSaving(true)
    const timer = setTimeout(() => {
      updateFormData(data)
      setIsSaving(false)
      setShowSaveConfirmation(true)
      setTimeout(() => setShowSaveConfirmation(false), 2000)
    }, 500)

    return () => clearTimeout(timer)
  }

  // Get filtered language suggestions
  const getFilteredLanguages = () => {
    if (!languageInput) return commonLanguages
    return commonLanguages.filter((lang) => lang.toLowerCase().includes(languageInput.toLowerCase()))
  }

  // Handle adding a custom language
  const addLanguage = (language: string) => {
    console.log("AutoFillApplications: Adding language", language)
    if (!language.trim()) return

    const currentLanguages = formData.additionalInfo?.languagesSpoken || []
    if (!currentLanguages.includes(language)) {
      updateFormDataWithSave({
        additionalInfo: {
          ...formData.additionalInfo,
          languagesSpoken: [...currentLanguages, language],
          raceEthnicity: formData.additionalInfo?.raceEthnicity || [],
          parentEmployment: formData.additionalInfo?.parentEmployment || "",
          parentEmploymentOther: formData.additionalInfo?.parentEmploymentOther || "",
          singleParent: formData.additionalInfo?.singleParent || false,
          militaryFamily: formData.additionalInfo?.militaryFamily || false,
          benefitPrograms: formData.additionalInfo?.benefitPrograms || [],
          benefitProgramsOther: formData.additionalInfo?.benefitProgramsOther || "",
          otherCircumstances: formData.additionalInfo?.otherCircumstances || "",
        },
      })
    }
    setLanguageInput("")
  }

  // Handle removing a language
  const removeLanguage = (language: string) => {
    console.log("AutoFillApplications: Removing language", language)
    const currentLanguages = formData.additionalInfo?.languagesSpoken || []
    updateFormDataWithSave({
      additionalInfo: {
        ...formData.additionalInfo,
        languagesSpoken: currentLanguages.filter((lang) => lang !== language),
        raceEthnicity: formData.additionalInfo?.raceEthnicity || [],
        parentEmployment: formData.additionalInfo?.parentEmployment || "",
        parentEmploymentOther: formData.additionalInfo?.parentEmploymentOther || "",
        singleParent: formData.additionalInfo?.singleParent || false,
        militaryFamily: formData.additionalInfo?.militaryFamily || false,
        benefitPrograms: formData.additionalInfo?.benefitPrograms || [],
        benefitProgramsOther: formData.additionalInfo?.benefitProgramsOther || "",
        otherCircumstances: formData.additionalInfo?.otherCircumstances || "",
      },
    })
  }

  // Handle race/ethnicity checkbox changes
  const handleRaceEthnicityChange = (value: string) => {
    console.log("AutoFillApplications: Handling race/ethnicity change", value)
    const currentSelections = formData.additionalInfo?.raceEthnicity || []
    let newSelections

    if (currentSelections.includes(value)) {
      newSelections = currentSelections.filter((item) => item !== value)
    } else {
      newSelections = [...currentSelections, value]
    }

    updateFormDataWithSave({
      additionalInfo: {
        ...formData.additionalInfo,
        raceEthnicity: newSelections,
        languagesSpoken: formData.additionalInfo?.languagesSpoken || [],
        parentEmployment: formData.additionalInfo?.parentEmployment || "",
        parentEmploymentOther: formData.additionalInfo?.parentEmploymentOther || "",
        singleParent: formData.additionalInfo?.singleParent || false,
        militaryFamily: formData.additionalInfo?.militaryFamily || false,
        benefitPrograms: formData.additionalInfo?.benefitPrograms || [],
        benefitProgramsOther: formData.additionalInfo?.benefitProgramsOther || "",
        otherCircumstances: formData.additionalInfo?.otherCircumstances || "",
      },
    })
  }

  // Handle benefit programs checkbox changes
  const handleBenefitProgramsChange = (value: string) => {
    console.log("AutoFillApplications: Handling benefit programs change", value)
    const currentSelections = formData.additionalInfo?.benefitPrograms || []
    let newSelections

    if (currentSelections.includes(value)) {
      newSelections = currentSelections.filter((item) => item !== value)
    } else {
      newSelections = [...currentSelections, value]
    }

    updateFormDataWithSave({
      additionalInfo: {
        ...formData.additionalInfo,
        benefitPrograms: newSelections,
        raceEthnicity: formData.additionalInfo?.raceEthnicity || [],
        languagesSpoken: formData.additionalInfo?.languagesSpoken || [],
        parentEmployment: formData.additionalInfo?.parentEmployment || "",
        parentEmploymentOther: formData.additionalInfo?.parentEmploymentOther || "",
        singleParent: formData.additionalInfo?.singleParent || false,
        militaryFamily: formData.additionalInfo?.militaryFamily || false,
        benefitProgramsOther: formData.additionalInfo?.benefitProgramsOther || "",
        otherCircumstances: formData.additionalInfo?.otherCircumstances || "",
      },
    })
  }

  // Update active student
  const updateActiveStudent = (data: Partial<ApplicationStudent>) => {
    console.log("AutoFillApplications: Updating active student", data)
    const students = formData.applicationStudents || []
    if (students.length === 0) return

    const updatedStudents = [...students]
    const activeIndex = formData.activeApplicationStudentIndex || 0
    updatedStudents[activeIndex] = {
      ...updatedStudents[activeIndex],
      ...data,
    }
    updateFormDataWithSave({ applicationStudents: updatedStudents })
  }

  // Add new student
  const addNewStudent = () => {
    console.log("AutoFillApplications: Adding new student")
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
    updateFormDataWithSave({
      applicationStudents: newStudents,
      activeApplicationStudentIndex: newStudents.length - 1,
    })
  }

  // Remove student
  const removeStudent = (index: number) => {
    console.log("AutoFillApplications: Removing student at index", index)
    const students = formData.applicationStudents || []
    if (students.length <= 1) return

    const newStudents = students.filter((_, i) => i !== index)
    const currentActiveIndex = formData.activeApplicationStudentIndex || 0
    const newActiveIndex =
      currentActiveIndex >= index && currentActiveIndex > 0
        ? currentActiveIndex - 1
        : currentActiveIndex

    updateFormDataWithSave({
      applicationStudents: newStudents,
      activeApplicationStudentIndex: Math.min(newActiveIndex, newStudents.length - 1),
    })
  }

  // Switch to student
  const switchToStudent = (index: number) => {
    console.log("AutoFillApplications: Switching to student at index", index)
    updateFormDataWithSave({ activeApplicationStudentIndex: index })
  }

  // Handle parent employment change
  const handleParentEmploymentChange = (value: string) => {
    console.log("AutoFillApplications: Handling parent employment change", value)
    updateFormDataWithSave({
      additionalInfo: {
        raceEthnicity: formData.additionalInfo?.raceEthnicity || [],
        languagesSpoken: formData.additionalInfo?.languagesSpoken || [],
        parentEmployment: value,
        parentEmploymentOther: formData.additionalInfo?.parentEmploymentOther || "",
        singleParent: formData.additionalInfo?.singleParent || false,
        militaryFamily: formData.additionalInfo?.militaryFamily || false,
        benefitPrograms: formData.additionalInfo?.benefitPrograms || [],
        benefitProgramsOther: formData.additionalInfo?.benefitProgramsOther || "",
        otherCircumstances: formData.additionalInfo?.otherCircumstances || "",
      },
    })
  }

  // Handle parent employment other change
  const handleParentEmploymentOtherChange = (value: string) => {
    console.log("AutoFillApplications: Handling parent employment other change", value)
    const currentInfo = formData.additionalInfo || {
      raceEthnicity: [],
      languagesSpoken: [],
      parentEmployment: "",
      parentEmploymentOther: "",
      singleParent: false,
      militaryFamily: false,
      benefitPrograms: [],
      benefitProgramsOther: "",
      otherCircumstances: "",
    }

    updateFormDataWithSave({
      additionalInfo: {
        ...currentInfo,
        parentEmploymentOther: value,
      },
    })
  }

  // Handle single parent change
  const handleSingleParentChange = (checked: boolean) => {
    console.log("AutoFillApplications: Handling single parent change", checked)
    updateFormDataWithSave({
      additionalInfo: {
        raceEthnicity: formData.additionalInfo?.raceEthnicity || [],
        languagesSpoken: formData.additionalInfo?.languagesSpoken || [],
        parentEmployment: formData.additionalInfo?.parentEmployment || "",
        parentEmploymentOther: formData.additionalInfo?.parentEmploymentOther || "",
        singleParent: checked,
        militaryFamily: formData.additionalInfo?.militaryFamily || false,
        benefitPrograms: formData.additionalInfo?.benefitPrograms || [],
        benefitProgramsOther: formData.additionalInfo?.benefitProgramsOther || "",
        otherCircumstances: formData.additionalInfo?.otherCircumstances || "",
      },
    })
  }

  // Handle military family change
  const handleMilitaryFamilyChange = (checked: boolean) => {
    console.log("AutoFillApplications: Handling military family change", checked)
    updateFormDataWithSave({
      additionalInfo: {
        raceEthnicity: formData.additionalInfo?.raceEthnicity || [],
        languagesSpoken: formData.additionalInfo?.languagesSpoken || [],
        parentEmployment: formData.additionalInfo?.parentEmployment || "",
        parentEmploymentOther: formData.additionalInfo?.parentEmploymentOther || "",
        singleParent: formData.additionalInfo?.singleParent || false,
        militaryFamily: checked,
        benefitPrograms: formData.additionalInfo?.benefitPrograms || [],
        benefitProgramsOther: formData.additionalInfo?.benefitProgramsOther || "",
        otherCircumstances: formData.additionalInfo?.otherCircumstances || "",
      },
    })
  }

  // Handle benefit programs other change
  const handleBenefitProgramsOtherChange = (value: string) => {
    console.log("AutoFillApplications: Handling benefit programs other change", value)
    const currentInfo = formData.additionalInfo || {
      raceEthnicity: [],
      languagesSpoken: [],
      parentEmployment: "",
      parentEmploymentOther: "",
      singleParent: false,
      militaryFamily: false,
      benefitPrograms: [],
      benefitProgramsOther: "",
      otherCircumstances: "",
    }

    updateFormDataWithSave({
      additionalInfo: {
        ...currentInfo,
        benefitProgramsOther: value,
      },
    })
  }

  // Handle other circumstances change
  const handleOtherCircumstancesChange = (value: string) => {
    console.log("AutoFillApplications: Handling other circumstances change", value)
    const currentInfo = formData.additionalInfo || {
      raceEthnicity: [],
      languagesSpoken: [],
      parentEmployment: "",
      parentEmploymentOther: "",
      singleParent: false,
      militaryFamily: false,
      benefitPrograms: [],
      benefitProgramsOther: "",
      otherCircumstances: "",
    }

    updateFormDataWithSave({
      additionalInfo: {
        ...currentInfo,
        otherCircumstances: value,
      },
    })
  }

  // Get active student with safe array access
  const getActiveStudent = (): ApplicationStudent => {
    const students = formData.applicationStudents || []
    const activeIndex = formData.activeApplicationStudentIndex || 0
    if (activeIndex >= 0 && activeIndex < students.length) {
      return students[activeIndex]
    }
    return {
      name: "",
      dob: "",
      ssn: "",
      gradeLevel: "",
      citizenshipStatus: "",
      disability: "",
      disabilityOther: "",
    }
  }

  // Initialize empty contact info
  const emptyContactInfo: ContactInfo = {
    address: "",
    district: "",
    contactEmail: "",
  }

  // Handle address change
  const handleAddressChange = (value: string) => {
    console.log("AutoFillApplications: Handling address change", value)
    updateFormDataWithSave({
      contactInfo: {
        ...formData.contactInfo || emptyContactInfo,
        address: value,
      },
    })
  }

  // Handle district change
  const handleDistrictChange = (value: string) => {
    console.log("AutoFillApplications: Handling district change", value)
    updateFormDataWithSave({
      contactInfo: {
        ...formData.contactInfo || emptyContactInfo,
        district: value,
      },
    })
  }

  // Handle contact email change
  const handleContactEmailChange = (value: string) => {
    console.log("AutoFillApplications: Handling contact email change", value)
    updateFormDataWithSave({
      contactInfo: {
        ...formData.contactInfo || emptyContactInfo,
        contactEmail: value,
      },
    })
  }

  const activeStudent = getActiveStudent()

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
              value={formData.contactInfo?.address || ""}
              onChange={(e) => handleAddressChange(e.target.value)}
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
                value={formData.contactInfo?.district || ""}
                onChange={(e) => handleDistrictChange(e.target.value)}
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
                value={formData.contactInfo?.contactEmail || ""}
                onChange={(e) => handleContactEmailChange(e.target.value)}
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
                onValueChange={(value) => handleParentEmploymentChange(value)}
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
                  onChange={(e) => handleParentEmploymentOtherChange(e.target.value)}
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
                onCheckedChange={(checked) => handleSingleParentChange(checked)}
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
                onCheckedChange={(checked) => handleMilitaryFamilyChange(checked)}
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
                onChange={(e) => handleBenefitProgramsOtherChange(e.target.value)}
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
              onChange={(e) => handleOtherCircumstancesChange(e.target.value)}
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
      {showSaveConfirmation && (
        <div className="fixed bottom-0 left-0 right-0 p-4">
          <div className="bg-green-800 text-white p-4 rounded-t-lg">
            <p className="text-center">
              <CheckCircle className="inline-block mr-2" size={20} />
              Application information saved successfully!
            </p>
          </div>
        </div>
      )}
    </>
  )
}
