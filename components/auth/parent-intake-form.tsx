"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

// Import all step components
import { EducationalVision } from "./intake-steps/educational-vision"
import { HomeSchoolSplit } from "./intake-steps/home-school-split"
import { ProgramTools } from "./intake-steps/program-tools"
import { SchedulePreferences } from "./intake-steps/schedule-preferences"
import { Courses } from "./intake-steps/courses"
import { MentorPersonality } from "./intake-steps/mentor-personality"
import { EducationalValues } from "./intake-steps/educational-values"
import { StudentProfile } from "./intake-steps/student-profile"
import { Extracurriculars } from "./intake-steps/extracurriculars"
import { DeviceAccess } from "./intake-steps/device-access"
import { ParentOversight } from "./intake-steps/parent-oversight"
import { AccountabilityPenalties } from "./intake-steps/accountability-penalties"
import { BudgetGrants } from "./intake-steps/budget-grants"
import { AutoFillApplications } from "./intake-steps/auto-fill-applications"
import { IntroScreen } from "./intake-steps/intro-screen"
import { SummaryScreen } from "./intake-steps/summary-screen"
import { supabase } from "@/lib/supabase"

export function ParentIntakeForm({ parentId, parentName }: { parentId: string; parentName: string }) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0) // Start at Step 0 (intro screen)
  const [showSummary, setShowSummary] = useState(false) // State to control summary screen visibility
  const [formData, setFormData] = useState({
    // Educational Vision & Goals
    educationalGoals: [],
    otherGoal: "",
    targetGpa: { hasPreference: false, value: 3.5 },
    outcomeLevel: "proficient",
    customOutcome: "",

    // Home vs. School Split
    homePercentage: 100,
    subjectLocations: {
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
    hybridOptions: [],
    otherHybridOption: "",

    // Program Tools
    platforms: [],
    otherPlatform: "",
    wantRecommendations: true,

    // Schedule Preferences
    schoolDays: [],
    startTime: "08:00",
    endTime: "15:00",
    hasDifferentTimes: false,
    daySpecificTimes: {
      monday: { startTime: "08:00", endTime: "15:00" },
      tuesday: { startTime: "08:00", endTime: "15:00" },
      wednesday: { startTime: "08:00", endTime: "15:00" },
      thursday: { startTime: "08:00", endTime: "15:00" },
      friday: { startTime: "08:00", endTime: "15:00" },
      saturday: { startTime: "08:00", endTime: "15:00" },
      sunday: { startTime: "08:00", endTime: "15:00" },
    },
    blockLength: 45,
    termStructure: "school",
    termLength: 9,
    termUnit: "weeks",

    // Courses
    courses: [{ subject: "", gradeLevel: "", hasPlatform: false, platform: "", notes: "" }],

    // Mentor Personality
    mentorPersonality: [],
    otherPersonality: "",

    // Educational Values
    structurePreference: "balance",
    educationalValues: [],
    otherValue: "",

    // Student Profile
    students: [
      {
        name: "",
        age: "",
        gradeLevel: "",
        learningCharacteristics: [],
        iepDetails: "",
        otherCharacteristic: "",
      },
    ],
    activeStudentIndex: 0,

    // Extracurriculars
    extracurriculars: [],
    otherExtracurricular: "",

    // Device Access
    devices: [],
    taskDelivery: "device",

    // Parent Oversight
    parentInvolvement: "active",
    oversightPreferences: [],

    // Accountability & Point Penalties
    penaltyLevel: "moderate",
    customPenalties: {
      xp: {
        missedCheckIn: 10,
        missedSummary: 15,
        failedQuiz: 20,
        missedWeeklyGoal: 30,
      },
      coins: {
        missedCheckIn: 5,
        missedSummary: 10,
        failedQuiz: 15,
        missedWeeklyGoal: 25,
      },
      streakBehavior: {
        breakAfterMissedCheckIn: false,
        removeXpBonus: false,
        allowTaskRetry: true,
      },
    },

    // Budget & Grants
    educationBudget: "",
    rewardBudget: "",
    checkForGrants: false,
    householdIncome: "",
    dependents: "",
    parentEducation: "",
    zipCode: "",
    demographics: {
      raceEthnicity: "",
      citizenship: "",
      disability: "",
      language: "",
      other: "",
    },

    // Auto-Fill Applications
    parent: {
      name: "",
      email: "",
      phone: "",
    },
    applicationStudents: [],
    activeApplicationStudentIndex: 0,
    address: "",
    district: "",
    contactEmail: "",
  })

  const totalSteps = 14 // Number of actual form steps (excluding intro)

  // Use useCallback to memoize the updateFormData function
  const updateFormData = useCallback((newData) => {
    setFormData((prev) => ({ ...prev, ...newData }))
  }, [])

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleBegin = () => {
    setCurrentStep(1) // Move from intro (0) to first actual step (1)
    window.scrollTo(0, 0)
  }

  // Render the current step
  const renderStep = () => {
    // Intro screen (Step 0)
    if (currentStep === 0) {
      return <IntroScreen onBegin={handleBegin} />
    }

    // Actual form steps (1-14)
    switch (currentStep) {
      case 1:
        return <EducationalVision formData={formData} updateFormData={updateFormData} />
      case 2:
        return <HomeSchoolSplit formData={formData} updateFormData={updateFormData} />
      case 3:
        return <ProgramTools formData={formData} updateFormData={updateFormData} />
      case 4:
        return <SchedulePreferences formData={formData} updateFormData={updateFormData} />
      case 5:
        return <Courses formData={formData} updateFormData={updateFormData} />
      case 6:
        return <MentorPersonality formData={formData} updateFormData={updateFormData} />
      case 7:
        return <EducationalValues formData={formData} updateFormData={updateFormData} />
      case 8:
        return <StudentProfile formData={formData} updateFormData={updateFormData} />
      case 9:
        return <Extracurriculars formData={formData} updateFormData={updateFormData} />
      case 10:
        return <DeviceAccess formData={formData} updateFormData={updateFormData} />
      case 11:
        return <ParentOversight formData={formData} updateFormData={updateFormData} />
      case 12:
        return <AccountabilityPenalties formData={formData} updateFormData={updateFormData} />
      case 13:
        return <BudgetGrants formData={formData} updateFormData={updateFormData} />
      case 14:
        return <AutoFillApplications formData={formData} updateFormData={updateFormData} />
      default:
        return null
    }
  }

  const welcomeMessage = parentName ? `Welcome, ${parentName}!` : "Welcome!"

  const handleSubmit = async () => {
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData)

    try {
      // Save the form data to the parent_intake_form table
      const { error } = await supabase.from("parent_intake_form").insert({
        parent_id: parentId,
        educational_goals: formData.educationalGoals,
        other_goal: formData.otherGoal,
        target_gpa: formData.targetGpa,
        outcome_level: formData.outcomeLevel,
        custom_outcome: formData.customOutcome,
        home_percentage: formData.homePercentage,
        subject_locations: formData.subjectLocations,
        hybrid_options: formData.hybridOptions,
        other_hybrid_option: formData.otherHybridOption,
        platforms: formData.platforms,
        other_platform: formData.otherPlatform,
        want_recommendations: formData.wantRecommendations,
        school_days: formData.schoolDays,
        start_time: formData.startTime,
        end_time: formData.endTime,
        has_different_times: formData.hasDifferentTimes,
        day_specific_times: formData.daySpecificTimes,
        block_length: formData.blockLength,
        term_structure: formData.termStructure,
        term_length: formData.termLength,
        term_unit: formData.termUnit,
        courses: formData.courses,
        mentor_personality: formData.mentorPersonality,
        other_personality: formData.otherPersonality,
        structure_preference: formData.structurePreference,
        educational_values: formData.educationalValues,
        other_value: formData.otherValue,
        extracurriculars: formData.extracurriculars,
        other_extracurricular: formData.otherExtracurricular,
        devices: formData.devices,
        task_delivery: formData.taskDelivery,
        parent_involvement: formData.parentInvolvement,
        oversight_preferences: formData.oversightPreferences,
        penalty_level: formData.penaltyLevel,
        custom_penalties: formData.customPenalties,
        education_budget: formData.educationBudget,
        reward_budget: formData.rewardBudget,
        check_for_grants: formData.checkForGrants,
        household_income: formData.householdIncome,
        dependents: formData.dependents,
        parent_education: formData.parentEducation,
        zip_code: formData.zipCode,
        demographics: formData.demographics,
        application_students: formData.applicationStudents,
        parent_info: formData.parent,
        address: formData.address,
        district: formData.district,
        contact_email: formData.contactEmail,
        completed: true,
      })

      if (error) {
        console.error("Error saving intake form:", error)
        throw error
      }

      // Update the parent profile to indicate that the intake form has been completed
      const { error: updateError } = await supabase
        .from("parent_profile")
        .update({ has_completed_intake: true })
        .eq("id", parentId)

      if (updateError) {
        console.error("Error updating parent profile:", updateError)
        // Non-critical, continue
      }

      // Show summary screen instead of navigating directly to dashboard
      setShowSummary(true)
    } catch (error) {
      console.error("Error submitting form:", error)
      // Show an error message to the user
    }
  }

  const handleGoToDashboard = () => {
    // Navigate to the parent dashboard
    router.push(`/parent/dashboard?id=${parentId}`)
  }

  // Don't show progress bar on intro screen or summary screen
  const showProgress = currentStep > 0 && !showSummary

  // If showing summary screen, render that instead of the form
  if (showSummary) {
    return <SummaryScreen formData={formData} onContinue={handleGoToDashboard} />
  }

  return (
    <div className="container mx-auto px-4 max-w-3xl py-8">
      {showProgress && (
        <>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">{welcomeMessage} Parent Intake Form</h1>
            <p className="text-gray-400">Help us understand your educational goals and preferences</p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>
                Step {currentStep} of {totalSteps}
              </span>
              <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="h-2 bg-gray-800" />
          </div>
        </>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="bg-gray-900 border-gray-800 shadow-lg">
          {renderStep()}

          {currentStep > 0 && !showSummary && (
            <CardFooter className="flex justify-between pt-6 pb-6 border-t border-gray-800">
              <Button
                variant="outline"
                onClick={handleBack}
                className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                Back
              </Button>

              {currentStep < totalSteps ? (
                <Button onClick={handleNext} className="bg-white text-gray-900 hover:bg-gray-200">
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-green-600 text-white hover:bg-green-700">
                  Submit
                </Button>
              )}
            </CardFooter>
          )}
        </Card>
      </motion.div>

      {currentStep > 0 && currentStep < totalSteps && !showSummary && (
        <div className="mt-4 text-center">
          <button onClick={handleNext} className="text-gray-400 hover:text-white text-sm underline">
            Skip this step
          </button>
        </div>
      )}
    </div>
  )
}
