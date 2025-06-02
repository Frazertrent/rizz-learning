"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { CheckCircle, Loader2 } from "lucide-react"

// Import all step components
import { EducationalVision } from "./intake-steps/educational-vision"
import { HomeSchoolSplit } from "./intake-steps/home-school-split"
import { ProgramTools } from "./intake-steps/program-tools"
import { SchedulePreferences } from "./intake-steps/schedule-preferences"
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

// Add these interfaces at the top after imports
interface DaySpecificTime {
  startTime: string;
  endTime: string;
}

interface DaySpecificTimes {
  monday: DaySpecificTime;
  tuesday: DaySpecificTime;
  wednesday: DaySpecificTime;
  thursday: DaySpecificTime;
  friday: DaySpecificTime;
  saturday: DaySpecificTime;
  sunday: DaySpecificTime;
}

interface XpPenalties {
  missedCheckIn: number;
  missedSummary: number;
  failedQuiz: number;
  missedWeeklyGoal: number;
}

interface CoinPenalties {
  missedCheckIn: number;
  missedSummary: number;
  failedQuiz: number;
  missedWeeklyGoal: number;
}

interface StreakBehavior {
  breakAfterMissedCheckIn: boolean;
  removeXpBonus: boolean;
  allowTaskRetry: boolean;
}

interface CustomPenalties {
  xp: XpPenalties;
  coins: CoinPenalties;
  streakBehavior: StreakBehavior;
}

interface ApplicationStudent {
  name: string;
  dob: string;
  ssn: string;
  gradeLevel: string;
  citizenshipStatus: string;
  disability: string;
  disabilityOther?: string;
}

interface AdditionalInfo {
  raceEthnicity: string[];
  languagesSpoken: string[];
  parentEmployment: string;
  parentEmploymentOther: string;
  singleParent: boolean;
  militaryFamily: boolean;
  benefitPrograms: string[];
  benefitProgramsOther: string;
  otherCircumstances: string;
}

interface FormData {
  educationalGoals: string[]
  otherGoal: string
  targetGpa: { hasPreference: boolean; value: number }
  outcomeLevel: string
  customOutcome: string
  homePercentage: number
  subjectLocations: {
    math: string
    science: string
    languageArts: string
    history: string
    pe: string
    art: string
    music: string
    cte: string
    foreignLanguage: string
  }
  hybridOptions: string[]
  otherHybridOption: string
  platforms: string[]
  otherPlatform: string
  wantRecommendations: boolean
  schoolDays: string[]
  startTime: string
  endTime: string
  hasDifferentTimes: boolean
  daySpecificTimes: DaySpecificTimes
  blockLength: number
  termStructure: "school" | "custom"
  termLength: number
  termUnit: string
  mentorPersonality: string[]
  otherPersonality: string
  structurePreference: string
  educationalValues: string[]
  otherValue: string
  religiousAffiliation: string
  religiousImportance: string
  students: Array<{
    id: string;
    name: string;
    age: string;
    gradeLevel: string;
    learningCharacteristics: string[];
    iepDetails: string;
    otherCharacteristic: string;
  }>
  activeStudentIndex: number
  extracurriculars: string[]
  otherExtracurricular: string
  devices: string[]
  taskDelivery: string
  parentInvolvement: string
  oversightPreferences: string[]
  penaltyLevel: "light" | "moderate" | "strict" | "custom"
  customPenalties: CustomPenalties
  educationBudget: string
  rewardBudget: string
  checkForGrants: boolean
  householdIncome: string
  dependents: string
  parentEducation: string
  zipCode: string
  demographics: {
    raceEthnicity: string
    citizenship: string
    disability: string
    language: string
    other: string
  }
  parent: {
    name: string
    email: string
    phone: string
  }
  applicationStudents: ApplicationStudent[]
  activeApplicationStudentIndex: number
  additionalInfo: AdditionalInfo
  address: string
  district: string
  contactEmail: string
}

// Add these interfaces at the top
interface StepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
}

// Add these interfaces at the top
interface IntroScreenProps {
  onBegin: () => void
}

interface SummaryScreenProps {
  formData: FormData
  onContinue: () => void
}

export function ParentIntakeForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editMode = searchParams.get("edit") === "true"
  const stepParam = searchParams.get("step")
  const newMode = searchParams.get("new") === "true"
  const initialStep = stepParam ? parseInt(stepParam) : 0

  const [currentStep, setCurrentStep] = useState(initialStep)
  const [showSummary, setShowSummary] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [parentId, setParentId] = useState<string | null>(null)
  const [parentName, setParentName] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [existingFormId, setExistingFormId] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Function to get fields for current step
  const getCurrentStepFields = (step: number) => {
    switch (step) {
      case 1: // Educational Vision
        return ['educational_goals', 'other_goal', 'target_gpa', 'outcome_level', 'custom_outcome']
      case 2: // Home/School Split
        return ['home_percentage', 'subject_locations', 'hybrid_options', 'other_hybrid_option']
      case 3: // Program Tools
        return ['platforms', 'other_platform', 'want_recommendations']
      case 4: // Schedule Preferences
        return ['school_days', 'start_time', 'end_time', 'has_different_times', 'day_specific_times', 'block_length', 'term_structure', 'term_length', 'term_unit']
      case 5: // Mentor Personality
        return ['mentor_personality', 'other_personality']
      case 6: // Educational Values
        return ['structure_preference', 'educational_values', 'other_value', 'religious_affiliation', 'religious_importance']
      case 7: // Student Profile
        return ['students']
      case 8: // Extracurriculars
        return ['extracurriculars', 'other_extracurricular']
      case 9: // Device Access
        return ['devices', 'task_delivery']
      case 10: // Parent Oversight
        return ['parent_involvement', 'oversight_preferences']
      case 11: // Accountability & Penalties
        return ['penalty_level', 'custom_penalties']
      case 12: // Budget & Grants
        return ['education_budget', 'reward_budget', 'check_for_grants', 'household_income', 'dependents', 'parent_education', 'zip_code', 'demographics']
      case 13: // Auto-Fill Applications
        return ['parent_info', 'application_students', 'address', 'district', 'contact_email']
      default:
        return []
    }
  }

  // Function to get current step data
  const getCurrentStepData = () => {
    console.log('🔄 Getting data for step:', currentStep);
    const fields = getCurrentStepFields(currentStep)
    console.log('🔄 Fields to save:', fields);
    
    const stepData: Record<string, any> = {}
    
    // Special handling for Educational Values step
    if (currentStep === 6) {
      // Map the camelCase fields to snake_case for database
      stepData.structure_preference = formData.structurePreference;
      stepData.educational_values = formData.educationalValues;
      stepData.other_value = formData.otherValue;
      stepData.religious_affiliation = formData.religiousAffiliation;
      stepData.religious_importance = formData.religiousImportance;
    } else {
      // Handle other steps as before
      fields.forEach(field => {
        const camelField = field.replace(/_([a-z])/g, g => g[1].toUpperCase())
        const value = formData[camelField as keyof FormData]
        if (value !== undefined) {
          stepData[field] = value
        }
      })
    }
    
    console.log('🔄 Prepared stepData:', stepData);
    return stepData
  }

  // Handle individual step save
  const handleSaveStep = async () => {
    console.log('🔄 handleSaveStep called for step:', currentStep);
    console.log('🔄 Current formData:', formData);
    
    if (!parentId || !existingFormId) {
      console.error('💥 Missing parentId or existingFormId:', { parentId, existingFormId });
      return;
    }

    try {
      setIsSaving(true)
      const stepData = getCurrentStepData()
      console.log('🔄 Attempting to save with data:', stepData);

      // If we're on the student profile step, handle student data separately
      if (currentStep === 7) {
        // Transform students data to match database structure
        const transformedStudents = formData.students.map(student => ({
          parent_id: parentId,
          full_name: student.name,
          age: parseInt(student.age) || null,
          grade_level: student.gradeLevel,
          learning_characteristics: student.learningCharacteristics,
          iep_details: student.iepDetails,
          other_characteristic: student.otherCharacteristic,
        }))

        console.log('🔄 Saving transformed students:', transformedStudents);

        // First, delete existing students for this parent
        const { error: deleteError } = await supabase
          .from('student')
          .delete()
          .eq('parent_id', parentId)

        if (deleteError) {
          console.error('💥 Error deleting existing students:', deleteError);
          throw deleteError;
        }

        // Then insert the new/updated students
        const { error: studentsError } = await supabase
          .from('student')
          .insert(transformedStudents)

        if (studentsError) {
          console.error('💥 Error inserting students:', studentsError);
          throw studentsError;
        }
      } else {
        // For other steps, update the parent_intake_form
        console.log('🔄 Updating parent_intake_form with:', {
          id: existingFormId,
          data: stepData
        });

        const { data, error } = await supabase
          .from('parent_intake_form')
          .update(stepData)
          .eq('id', existingFormId)
          .select()

        if (error) {
          console.error('💥 Error updating form:', error);
          console.error('💥 Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint
          });
          throw error;
        }

        console.log('✅ Save successful:', data);
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error: any) {
      console.error("💥 Error saving step:", error)
      console.error("💥 Error message:", error.message)
      console.error("💥 Error stack:", error.stack)
      setError(`Error saving step: ${error.message || 'Unknown error'}`)
    } finally {
      setIsSaving(false)
    }
  }

  // Handle save and return to settings
  const handleSaveAndReturn = async () => {
    await handleSaveStep()
    router.push('/parent/settings?tab=preferences')
  }

  // Fetch the current user when the component mounts
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        setIsLoading(true)
        console.log('Fetching current user...');

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          console.error("Auth error:", userError)
          setIsLoading(false)
          return
        }

        if (!user) {
          console.log("No user found in form component")
          setIsLoading(false)
          return
        }

        console.log('User found:', user);
        setParentId(user.id)

        // Get the parent's name from their email
        const parentName = user.email?.split("@")[0] || ""
        setParentName(parentName)
        
      } catch (err) {
        console.error("Error in form component:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCurrentUser()
  }, [])

  // Fetch existing form data when in edit mode
  useEffect(() => {
    async function fetchExistingForm() {
      try {
        console.log('Starting fetchExistingForm, edit mode:', editMode);
        const { data: { user } } = await supabase.auth.getUser()
        console.log('Current user:', user);
        if (!user) return

        // Before student query
        console.log('🔍 Making query to:', 'student', 'from:', 'parent-intake-form.tsx', { userId: user.id });
        const { data: studentData, error: studentError } = await supabase
          .from('student')
          .select('*')
          .eq('parent_id', user.id)

        console.log('Fetched students data:', studentData);
        console.log('Students fetch error:', studentError);

        // Before parent_intake_form query
        console.log('🔍 Making query to:', 'parent_intake_form', 'from:', 'parent-intake-form.tsx', { userId: user.id });
        const { data: formData, error: formError } = await supabase
          .from('parent_intake_form')
          .select('*')
          .eq('parent_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        console.log('Fetched form data:', formData);
        console.log('Form fetch error:', formError);

        if (formError && formError.code !== 'PGRST116') {
          console.error('Error fetching intake form:', formError)
          return
        }

        if (studentError) {
          console.error('Error fetching students:', studentError)
          return
        }

        // Transform students data from database format to internal format
        const transformedStudents = studentData?.map(student => ({
          id: student.id,
          name: student.full_name || "",
          age: student.age?.toString() || "",
          gradeLevel: student.grade_level || "",
          learningCharacteristics: student.learning_characteristics || [],
          iepDetails: student.iep_details || "",
          otherCharacteristic: student.other_characteristic || ""
        })) || []

        if (formData) {
          console.log('Setting form data with transformed students:', transformedStudents);
          setExistingFormId(formData.id)
          // Pre-populate form data with existing values
          const newFormData = {
            ...formData,
            students: transformedStudents,
            activeStudentIndex: 0,
            educationalGoals: formData.educational_goals || [],
            otherGoal: formData.other_goal || "",
            targetGpa: formData.target_gpa || { hasPreference: false, value: 3.5 },
            outcomeLevel: formData.outcome_level || "proficient",
            customOutcome: formData.custom_outcome || "",
            homePercentage: formData.home_percentage || 100,
            subjectLocations: formData.subject_locations || formData.subjectLocations,
            hybridOptions: formData.hybrid_options || [],
            otherHybridOption: formData.other_hybrid_option || "",
            platforms: formData.platforms || [],
            otherPlatform: formData.other_platform || "",
            wantRecommendations: formData.want_recommendations ?? true,
            schoolDays: formData.school_days || [],
            startTime: formData.start_time || "08:00",
            endTime: formData.end_time || "15:00",
            hasDifferentTimes: formData.has_different_times || false,
            daySpecificTimes: formData.day_specific_times || formData.daySpecificTimes,
            blockLength: formData.block_length || 45,
            termStructure: formData.term_structure || "school",
            termLength: formData.term_length || 9,
            termUnit: formData.term_unit || "weeks",
            mentorPersonality: formData.mentor_personality || [],
            otherPersonality: formData.other_personality || "",
            structurePreference: formData.structure_preference || "balance",
            educationalValues: formData.educational_values || [],
            otherValue: formData.other_value || "",
            religiousAffiliation: formData.religious_affiliation || "",
            religiousImportance: formData.religious_importance || "",
            extracurriculars: formData.extracurriculars || [],
            otherExtracurricular: formData.other_extracurricular || "",
            devices: formData.devices || [],
            taskDelivery: formData.task_delivery || "device",
            parentInvolvement: formData.parent_involvement || "active",
            oversightPreferences: formData.oversight_preferences || [],
            penaltyLevel: formData.penalty_level || "moderate",
            customPenalties: formData.custom_penalties || formData.customPenalties,
            educationBudget: formData.education_budget || "",
            rewardBudget: formData.reward_budget || "",
            checkForGrants: formData.check_for_grants || false,
            householdIncome: formData.household_income || "",
            dependents: formData.dependents || "",
            parentEducation: formData.parent_education || "",
            zipCode: formData.zip_code || "",
            demographics: formData.demographics || formData.demographics,
            parent: formData.parent_info || formData.parent,
            applicationStudents: formData.application_students || [],
            activeApplicationStudentIndex: 0,
            additionalInfo: formData.additionalInfo || {
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
            address: formData.address || "",
            district: formData.district || "",
            contactEmail: formData.contact_email || "",
          };
          console.log('New form data being set:', newFormData);
          setFormData(newFormData);
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (editMode) {
      fetchExistingForm()
    } else {
      setIsLoading(false)
    }
  }, [editMode])

  const [formData, setFormData] = useState<FormData>({
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
    hasDifferentTimes: false,
    startTime: "08:00",
    endTime: "15:00",
    daySpecificTimes: {
      monday: { startTime: "08:00", endTime: "15:00" },
      tuesday: { startTime: "08:00", endTime: "15:00" },
      wednesday: { startTime: "08:00", endTime: "15:00" },
      thursday: { startTime: "08:00", endTime: "15:00" },
      friday: { startTime: "08:00", endTime: "15:00" },
      saturday: { startTime: "08:00", endTime: "15:00" },
      sunday: { startTime: "08:00", endTime: "15:00" }
    },
    blockLength: 45,
    termStructure: "school",
    termLength: 9,
    termUnit: "weeks",

    // Mentor Personality
    mentorPersonality: [],
    otherPersonality: "",

    // Educational Values
    structurePreference: "balance",
    educationalValues: [],
    otherValue: "",
    religiousAffiliation: "",
    religiousImportance: "",

    // Student Profile
    students: [
      {
        id: "",
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
    address: "",
    district: "",
    contactEmail: "",
  })

  const totalSteps = 13 // Number of actual form steps (excluding intro)

  // Use useCallback to memoize the updateFormData function
  const updateFormData = useCallback((newData: Partial<FormData>) => {
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
    const stepProps = {
      formData,
      updateFormData,
      editMode,
      onSave: handleSaveStep,
      isSaving,
      saveSuccess,
    }

    // Transform student data for AutoFillApplications component
    const getAutoFillFormData = () => {
      const autoFillStudents = formData.students.map(student => ({
        name: student.name,
        gradeLevel: student.gradeLevel
      }));
      return {
        applicationStudents: formData.applicationStudents || [],
        activeApplicationStudentIndex: formData.activeApplicationStudentIndex || 0,
        additionalInfo: formData.additionalInfo || {
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
        contactInfo: {
          address: formData.address || "",
          district: formData.district || "",
          contactEmail: formData.contactEmail || "",
        },
        students: autoFillStudents
      };
    };

    // Wrapper function to handle type conversion for AutoFillApplications
    const handleAutoFillUpdate = (data: any) => {
      const updatedFormData: Partial<FormData> = {
        applicationStudents: data.applicationStudents,
        activeApplicationStudentIndex: data.activeApplicationStudentIndex,
        additionalInfo: data.additionalInfo,
        address: data.contactInfo?.address,
        district: data.contactInfo?.district,
        contactEmail: data.contactInfo?.contactEmail,
      };
      updateFormData(updatedFormData);
    };

    switch (currentStep) {
      case 0:
        return <IntroScreen onBegin={handleBegin} />
      case 1:
        return <EducationalVision {...stepProps} />
      case 2:
        return <HomeSchoolSplit {...stepProps} />
      case 3:
        return <ProgramTools {...stepProps} />
      case 4:
        return <SchedulePreferences {...stepProps} />
      case 5:
        return <MentorPersonality {...stepProps} />
      case 6:
        return <EducationalValues {...stepProps} />
      case 7:
        return <StudentProfile {...stepProps} />
      case 8:
        return <Extracurriculars {...stepProps} />
      case 9:
        return <DeviceAccess {...stepProps} />
      case 10:
        return <ParentOversight {...stepProps} />
      case 11:
        return <AccountabilityPenalties {...stepProps} />
      case 12:
        return <BudgetGrants {...stepProps} />
      case 13:
        return <AutoFillApplications formData={getAutoFillFormData()} updateFormData={handleAutoFillUpdate} />
      case 14:
        return <SummaryScreen formData={formData} />
      default:
        return null
    }
  }

  const welcomeMessage = parentName ? `Welcome, ${parentName}!` : "Welcome!"

  const handleSubmit = async () => {
    if (!parentId) return

    try {
      // First save the form data
      const formDataToSave = {
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
        mentor_personality: formData.mentorPersonality,
        other_personality: formData.otherPersonality,
        structure_preference: formData.structurePreference,
        educational_values: formData.educationalValues,
        other_value: formData.otherValue,
        religious_affiliation: formData.religiousAffiliation,
        religious_importance: formData.religiousImportance,
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
        updated_at: new Date().toISOString(),
      }

      // Transform students data
      const studentsToSave = formData.students.map(student => ({
        parent_id: parentId,
        full_name: student.name,
        age: parseInt(student.age) || null,
        grade_level: student.gradeLevel,
        learning_characteristics: student.learningCharacteristics,
        iep_details: student.iepDetails,
        other_characteristic: student.otherCharacteristic,
      }))

      let result
      if (existingFormId && editMode) {
        // Update existing form record
        result = await supabase
          .from('parent_intake_form')
          .update(formDataToSave)
          .eq('id', existingFormId)
      } else {
        // Insert new form record
        result = await supabase
          .from('parent_intake_form')
          .insert([formDataToSave])
      }

      const { error: formError } = result
      if (formError) throw formError

      // Handle students data
      // First delete existing students
      await supabase
        .from('student')
        .delete()
        .eq('parent_id', parentId)

      // Then insert the new/updated students
      const { error: studentsError } = await supabase
        .from('student')
        .insert(studentsToSave)

      if (studentsError) throw studentsError

      // If we're in edit mode, return to settings
      if (editMode) {
        router.push('/parent/settings?tab=preferences')
      } else {
        // Otherwise go to confirmation page
        router.push(`/intake-confirmation?id=${parentId}`)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setError("There was an error submitting the form. Please try again.")
    }
  }

  // Add a back to settings button when in edit mode
  const handleBackToSettings = () => {
    router.push('/parent/settings?tab=preferences')
  }

  // Don't show progress bar on intro screen or summary screen
  const showProgress = currentStep > 0 && !showSummary

  // If showing summary screen, render that instead of the form
  if (showSummary) {
    return <SummaryScreen formData={formData} />
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 max-w-3xl py-8 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 max-w-3xl py-8">
        <Card className="bg-gray-900 border-gray-800 shadow-lg p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <Button onClick={() => router.push("/login")} className="bg-white text-gray-900 hover:bg-gray-200">
              Return to Login
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // Show not logged in state
  if (!parentId) {
    return (
      <div className="container mx-auto px-4 max-w-3xl py-8">
        <Card className="bg-gray-900 border-gray-800 shadow-lg p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">Not Logged In</h2>
            <p className="text-gray-300 mb-6">You need to be logged in to complete the intake form.</p>
            <Button onClick={() => router.push("/login")} className="bg-white text-gray-900 hover:bg-gray-200">
              Go to Login
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 max-w-3xl py-8">
      {editMode && (
        <div className="mb-6 space-y-4">
          <Button
            variant="outline"
            onClick={handleBackToSettings}
            className="text-gray-400 hover:text-white"
          >
            ← Back to Settings
          </Button>
          <div className="flex items-center justify-between bg-gray-800/50 p-4 rounded-lg">
            <div>
              <h2 className="text-lg font-medium text-white">Editing Step {currentStep} of 13</h2>
              <p className="text-sm text-gray-400">Make your changes and save when ready</p>
            </div>
            {saveSuccess && (
              <div className="flex items-center text-green-400">
                <CheckCircle className="w-5 h-5 mr-2" />
                Changes saved successfully
              </div>
            )}
          </div>
        </div>
      )}

      {showProgress && (
        <>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              {editMode ? "Edit Parent Intake Form" : `${welcomeMessage} Parent Intake Form`}
            </h1>
            <p className="text-gray-400">
              {editMode 
                ? "Update your educational preferences and requirements"
                : "Help us understand your educational goals and preferences"
              }
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
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

              <div className="flex gap-2">
                {editMode ? (
                  <>
                    <Button
                      onClick={handleSaveStep}
                      disabled={isSaving}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                    <Button
                      onClick={handleSaveAndReturn}
                      disabled={isSaving}
                      className="bg-gray-600 text-white hover:bg-gray-700"
                    >
                      Save & Return
                    </Button>
                  </>
                ) : (
                  currentStep < totalSteps ? (
                    <Button onClick={handleNext} className="bg-white text-gray-900 hover:bg-gray-200">
                      Next
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} className="bg-green-600 text-white hover:bg-green-700">
                      Submit
                    </Button>
                  )
                )}
              </div>
            </CardFooter>
          )}
        </Card>
      </motion.div>

      {!editMode && currentStep > 0 && currentStep < totalSteps && !showSummary && (
        <div className="mt-4 text-center">
          <button onClick={handleNext} className="text-gray-400 hover:text-white text-sm underline">
            Skip this step
          </button>
        </div>
      )}
    </div>
  )
}