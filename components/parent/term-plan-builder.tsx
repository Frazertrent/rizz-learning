"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AcademicTermStep } from "./term-plan-steps/academic-term-step"
import { TermGoalsStep } from "./term-plan-steps/term-goals-step"
import { WeeklyScheduleStep } from "./term-plan-steps/weekly-schedule-step"
import { ActivitiesStep } from "./term-plan-steps/activities-step"
import { SubjectsStep } from "./term-plan-steps/subjects-step"
import { BlockAssignmentStep } from "./term-plan-steps/block-assignment-step"
import { TermSummary } from "./term-plan-steps/term-summary"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2Icon, ChevronLeftIcon, ChevronRightIcon, SaveIcon, Users } from "lucide-react"
import { getStudentsForParent, getCurrentUser } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { saveTermPlan, loadTermPlanForEditing } from "@/app/actions/save-term-plan"

// Define the student-specific data structure
export type StudentTermPlanData = {
  studentId: string
  firstName: string
  schedule: {
    days: {
      [key: string]: {
        selected: boolean
        startTime: string
        endTime: string
        blockLength: number
        blocks: number
      }
    }
    useSameSchedule: boolean
  }
  activities: string[]
  customActivities: string[]
  subjects: {
    core: string[]
    extended: string[]
    courses: {
      [subject: string]: string[]
    }
  }
  blockAssignments?: {
    [day: string]: {
      time: string
      subject: string
      course: string
      type: "subject" | "activity" | "break"
      platformUrl?: string
      needPlatformHelp?: boolean | null
    }[]
  }
}

// Update the TermPlanData type to include term_type and term_year
export type TermPlanData = {
  academicTerm: string
  termType: string // "Summer", "Fall", "Winter", "Spring", or "Custom"
  termYear: number // e.g., 2023
  goals: string[]
  students: {
    [studentId: string]: StudentTermPlanData
  }
}

// Update the initialTermPlanData to include the new fields
const initialTermPlanData: TermPlanData = {
  academicTerm: "",
  termType: "",
  termYear: new Date().getFullYear(),
  goals: [],
  students: {},
}

// Calculate number of blocks based on start time, end time, and block length
const calculateBlocks = (startTime: string, endTime: string, blockLength: number): number => {
  if (!startTime || !endTime || !blockLength) return 0

  const start = new Date(`2000-01-01T${startTime}:00`)
  const end = new Date(`2000-01-01T${endTime}:00`)

  // If end time is before start time, assume it's the next day
  if (end < start) {
    end.setDate(end.getDate() + 1)
  }

  const diffMinutes = (end.getTime() - start.getTime()) / (1000 * 60)
  return Math.floor(diffMinutes / blockLength)
}

// Initial student-specific data
const initialStudentData: Omit<StudentTermPlanData, "studentId" | "firstName"> = {
  schedule: {
    days: {
      monday: {
        selected: false,
        startTime: "08:00",
        endTime: "15:00",
        blockLength: 45,
        blocks: calculateBlocks("08:00", "15:00", 45),
      },
      tuesday: {
        selected: false,
        startTime: "08:00",
        endTime: "15:00",
        blockLength: 45,
        blocks: calculateBlocks("08:00", "15:00", 45),
      },
      wednesday: {
        selected: false,
        startTime: "08:00",
        endTime: "15:00",
        blockLength: 45,
        blocks: calculateBlocks("08:00", "15:00", 45),
      },
      thursday: {
        selected: false,
        startTime: "08:00",
        endTime: "15:00",
        blockLength: 45,
        blocks: calculateBlocks("08:00", "15:00", 45),
      },
      friday: {
        selected: false,
        startTime: "08:00",
        endTime: "15:00",
        blockLength: 45,
        blocks: calculateBlocks("08:00", "15:00", 45),
      },
      saturday: {
        selected: false,
        startTime: "09:00",
        endTime: "12:00",
        blockLength: 45,
        blocks: calculateBlocks("09:00", "12:00", 45),
      },
      sunday: {
        selected: false,
        startTime: "09:00",
        endTime: "12:00",
        blockLength: 45,
        blocks: calculateBlocks("09:00", "12:00", 45),
      },
    },
    useSameSchedule: true,
  },
  activities: [],
  customActivities: [],
  subjects: {
    core: [],
    extended: [],
    courses: {},
  },
  blockAssignments: {},
}

interface TermPlanBuilderProps {
  parentId?: string
  termPlanId?: string
}

export function TermPlanBuilder({ parentId, termPlanId }: TermPlanBuilderProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [termPlanData, setTermPlanData] = useState<TermPlanData>(initialTermPlanData)
  const [students, setStudents] = useState<{ id: string; firstName: string; fullName: string }[]>([])
  const [activeStudentId, setActiveStudentId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(!!termPlanId)
  const [existingTermPlanId, setExistingTermPlanId] = useState<string | undefined>(termPlanId)
  const router = useRouter()

  const totalSteps = 6

  // Fetch students and term plan data if in edit mode
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        let userIdValue = parentId

        // If no parentId is provided, get the current user
        if (!userIdValue) {
          const user = await getCurrentUser()
          if (user) {
            userIdValue = user.id
            setUserId(user.id)

            // Store the user ID in localStorage for persistence
            localStorage.setItem("userId", user.id)
            console.log("User ID from getCurrentUser:", user.id)
          } else {
            // If no user is found, try to get from localStorage
            const storedUserId = localStorage.getItem("userId")
            if (storedUserId) {
              userIdValue = storedUserId
              setUserId(storedUserId)
              console.log("User ID from localStorage:", storedUserId)
            } else {
              // Try to get from auth context via localStorage
              const storedUser = localStorage.getItem("user")
              if (storedUser) {
                try {
                  const parsedUser = JSON.parse(storedUser)
                  if (parsedUser && parsedUser.id) {
                    userIdValue = parsedUser.id
                    setUserId(parsedUser.id)
                    localStorage.setItem("userId", parsedUser.id)
                    console.log("User ID from stored user object:", parsedUser.id)
                  }
                } catch (e) {
                  console.error("Error parsing stored user:", e)
                }
              } else {
                // No user ID available
                setLoading(false)
                setStudents([])
                console.error("No user ID found in any storage location")
                return
              }
            }
          }
        } else {
          setUserId(userIdValue)
          // Store the provided parent ID in localStorage
          localStorage.setItem("userId", userIdValue)
          console.log("Using provided parent ID:", userIdValue)
        }

        // Only clean the userId if it exists
        if (userIdValue) {
          // Clean the userId to ensure it's a valid UUID format
          userIdValue = userIdValue.replace(/[^a-fA-F0-9-]/g, "")
        } else {
          // No valid userId, show empty state
          setLoading(false)
          setStudents([])
          console.error("No valid user ID after cleaning")
          return
        }

        console.log("Fetching students for parent ID:", userIdValue)

        const studentsList = await getStudentsForParent(userIdValue)

        if (studentsList && studentsList.length > 0) {
          const formattedStudents = studentsList.map((student) => ({
            id: student.id,
            firstName: student.first_name || (student.full_name ? student.full_name.split(" ")[0] : "Student"),
            fullName: student.full_name || student.first_name,
          }))

          setStudents(formattedStudents)

          // Initialize term plan data with students
          const initializedStudents: { [studentId: string]: StudentTermPlanData } = {}
          formattedStudents.forEach((student) => {
            initializedStudents[student.id] = {
              studentId: student.id,
              firstName: student.firstName,
              ...JSON.parse(JSON.stringify(initialStudentData)), // Deep clone to avoid reference issues
            }
          })

          // If we're in edit mode, load the existing term plan
          if (termPlanId) {
            console.log("Loading existing term plan with ID:", termPlanId)

            // First, try to get from sessionStorage (in case user clicked Edit from dashboard)
            const storedPlan = sessionStorage.getItem("termPlan")
            if (storedPlan) {
              try {
                const parsedPlan = JSON.parse(storedPlan)
                if (parsedPlan && Object.keys(parsedPlan.students || {}).length > 0) {
                  console.log("Using term plan data from sessionStorage")
                  setTermPlanData(parsedPlan)

                  // Set the first student as active
                  if (Object.keys(parsedPlan.students).length > 0) {
                    setActiveStudentId(Object.keys(parsedPlan.students)[0])
                  }

                  setLoading(false)
                  return
                }
              } catch (e) {
                console.error("Error parsing stored term plan:", e)
              }
            }

            // If not in sessionStorage, load from the database
            const result = await loadTermPlanForEditing(termPlanId)

            if (result.success) {
              const { termPlan, studentTermPlans, studentCoursePlatforms } = result

              // Convert the database data to our TermPlanData format
              const loadedTermPlanData: TermPlanData = {
                academicTerm: termPlan.academic_term || "",
                termType: termPlan.term_type || "",
                termYear: termPlan.term_year || new Date().getFullYear(),
                goals: termPlan.goals || [],
                students: {},
              }

              // Process each student term plan
              for (const studentTermPlan of studentTermPlans) {
                const studentId = studentTermPlan.student_id
                const student = formattedStudents.find((s) => s.id === studentId)

                if (!student) continue

                // Get the student's course platforms
                const platforms = studentCoursePlatforms[studentTermPlan.id] || []

                // Initialize the student data with the stored data
                const studentData: StudentTermPlanData = {
                  studentId,
                  firstName: student.firstName,
                  schedule: studentTermPlan.schedule || JSON.parse(JSON.stringify(initialStudentData.schedule)),
                  activities: studentTermPlan.activities || [],
                  customActivities: studentTermPlan.custom_activities || [],
                  subjects: studentTermPlan.subjects || {
                    core: [],
                    extended: [],
                    courses: {},
                  },
                  blockAssignments: studentTermPlan.block_assignments || {},
                }

                // Process platform data and add it to block assignments
                if (platforms.length > 0) {
                  // Make sure blockAssignments is initialized
                  if (!studentData.blockAssignments) {
                    studentData.blockAssignments = {}
                  }

                  // Group platforms by day
                  for (const platform of platforms) {
                    const { day, time, subject, course, platform_url, platform_help } = platform

                    if (!day || !time || !subject) continue

                    // Initialize the day if it doesn't exist
                    if (!studentData.blockAssignments[day]) {
                      studentData.blockAssignments[day] = []
                    }

                    // Check if this block already exists
                    const existingBlockIndex = studentData.blockAssignments[day].findIndex(
                      (block) => block.time === time && block.subject === subject,
                    )

                    if (existingBlockIndex >= 0) {
                      // Update existing block
                      studentData.blockAssignments[day][existingBlockIndex] = {
                        ...studentData.blockAssignments[day][existingBlockIndex],
                        course: course || "",
                        platformUrl: platform_url || "",
                        needPlatformHelp:
                          platform_help === "needs_help" ? true : platform_help === "no_help_needed" ? false : null,
                      }
                    } else {
                      // Add new block
                      studentData.blockAssignments[day].push({
                        time,
                        subject,
                        course: course || "",
                        type: "subject", // Default type
                        platformUrl: platform_url || "",
                        needPlatformHelp:
                          platform_help === "needs_help" ? true : platform_help === "no_help_needed" ? false : null,
                      })
                    }
                  }
                }

                // Add the student data to the term plan
                loadedTermPlanData.students[studentId] = studentData
              }

              // Set the term plan data
              setTermPlanData(loadedTermPlanData)

              // Set the first student as active
              if (Object.keys(loadedTermPlanData.students).length > 0) {
                setActiveStudentId(Object.keys(loadedTermPlanData.students)[0])
              }

              // Store the term plan ID for saving later
              setExistingTermPlanId(termPlanId)
              setIsEditMode(true)
            } else {
              console.error("Error loading term plan:", result.error)

              // Fall back to initializing a new term plan
              setTermPlanData((prev) => ({
                ...prev,
                students: initializedStudents,
              }))

              // Set the first student as active
              if (formattedStudents.length > 0) {
                setActiveStudentId(formattedStudents[0].id)
              }
            }
          } else {
            // Not in edit mode, initialize a new term plan
            setTermPlanData((prev) => ({
              ...prev,
              students: initializedStudents,
            }))

            // Set the first student as active
            if (formattedStudents.length > 0) {
              setActiveStudentId(formattedStudents[0].id)
            }
          }
        } else {
          // If no students found, create a demo student for testing
          console.log("No students found, creating demo student")
          const demoStudentId = "demo-student-" + Math.random().toString(36).substring(2, 9)
          const demoStudent = {
            id: demoStudentId,
            firstName: "Demo Student",
            fullName: "Demo Student",
          }

          setStudents([demoStudent])

          const initializedStudents: { [studentId: string]: StudentTermPlanData } = {
            [demoStudentId]: {
              studentId: demoStudentId,
              firstName: "Demo Student",
              ...JSON.parse(JSON.stringify(initialStudentData)),
            },
          }

          setTermPlanData((prev) => ({
            ...prev,
            students: initializedStudents,
          }))

          setActiveStudentId(demoStudentId)
        }
      } catch (error) {
        console.error("Error in fetchStudents:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [parentId, termPlanId, router])

  useEffect(() => {
    // Save the current term plan data to sessionStorage whenever it changes
    // Skip saving during initial loading
    if (!loading && Object.keys(termPlanData.students).length > 0) {
      sessionStorage.setItem("termPlan", JSON.stringify(termPlanData))
    }
  }, [termPlanData, loading])

  // Try to load existing term plan data from sessionStorage
  useEffect(() => {
    const storedPlan = sessionStorage.getItem("termPlan")
    if (storedPlan && !loading && !isEditMode) {
      try {
        const parsedPlan = JSON.parse(storedPlan)

        // Only load if we have students and the structure looks valid
        if (parsedPlan.students && Object.keys(parsedPlan.students).length > 0) {
          setTermPlanData(parsedPlan)

          // Set the first student as active if not already set
          if (!activeStudentId) {
            setActiveStudentId(Object.keys(parsedPlan.students)[0])
          }
        }
      } catch (error) {
        console.error("Error parsing stored term plan:", error)
      }
    }
  }, [loading, activeStudentId, isEditMode])

  const updateTermPlanData = (data: Partial<TermPlanData>) => {
    setTermPlanData((prev) => ({ ...prev, ...data }))
  }

  const updateStudentData = (studentId: string, data: Partial<StudentTermPlanData>) => {
    // Clean the studentId to ensure it's a valid UUID format
    const cleanStudentId = studentId.replace(/[^a-fA-F0-9-]/g, "")

    setTermPlanData((prev) => {
      // Create a new object to avoid mutation
      const updatedStudents = { ...prev.students }

      // Deep clone the existing student data
      const existingStudentData = JSON.parse(JSON.stringify(updatedStudents[cleanStudentId] || {}))

      // Create a deep clone of the incoming data to avoid reference issues
      const clonedData = JSON.parse(JSON.stringify(data))

      // Only update the specific student's data
      updatedStudents[cleanStudentId] = {
        ...existingStudentData,
        ...clonedData,
      }

      return {
        ...prev,
        students: updatedStudents,
      }
    })
  }

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step)
      window.scrollTo(0, 0)
    }
  }

  // Copy schedule from one student to another
  const copyScheduleFromStudent = (sourceStudentId: string, targetStudentId: string) => {
    if (sourceStudentId === targetStudentId) return

    // Clean the IDs to ensure they're valid UUID format
    const cleanSourceId = sourceStudentId.replace(/[^a-fA-F0-9-]/g, "")
    const cleanTargetId = targetStudentId.replace(/[^a-fA-F0-9-]/g, "")

    const sourceStudent = termPlanData.students[cleanSourceId]
    const targetStudent = termPlanData.students[cleanTargetId]

    if (!sourceStudent || !targetStudent) return

    // Create a deep copy of the source student data to avoid reference issues
    let updatedData: Partial<StudentTermPlanData> = {}

    // Step 3: Weekly Schedule
    if (currentStep === 3) {
      updatedData.schedule = JSON.parse(JSON.stringify(sourceStudent.schedule))
    }
    // Step 4: Activities
    else if (currentStep === 4) {
      updatedData.activities = [...sourceStudent.activities]
      updatedData.customActivities = [...sourceStudent.customActivities]
    }
    // Step 5: Subjects
    else if (currentStep === 5) {
      updatedData.subjects = {
        core: [...sourceStudent.subjects.core],
        extended: [...sourceStudent.subjects.extended],
        courses: JSON.parse(JSON.stringify(sourceStudent.subjects.courses)),
      }
    }
    // Step 6: Block Assignments
    else if (currentStep === 6) {
      // Ensure deep cloning of block assignments
      updatedData.blockAssignments = sourceStudent.blockAssignments
        ? JSON.parse(JSON.stringify(sourceStudent.blockAssignments))
        : {}
    }
    // If not on a specific step or "Copy All" was clicked, copy everything
    else {
      updatedData = {
        schedule: JSON.parse(JSON.stringify(sourceStudent.schedule)),
        activities: [...sourceStudent.activities],
        customActivities: [...sourceStudent.customActivities],
        subjects: {
          core: [...sourceStudent.subjects.core],
          extended: [...sourceStudent.subjects.extended],
          courses: JSON.parse(JSON.stringify(sourceStudent.subjects.courses)),
        },
        blockAssignments: sourceStudent.blockAssignments
          ? JSON.parse(JSON.stringify(sourceStudent.blockAssignments))
          : {},
      }
    }

    // Update the target student's data directly
    updateStudentData(cleanTargetId, updatedData)

    // Force a re-render by updating the active student ID (then setting it back)
    const currentActiveId = activeStudentId
    setActiveStudentId("")
    setTimeout(() => setActiveStudentId(currentActiveId), 10)
  }

  const renderStepContent = () => {
    // For steps 1-2 (shared across all students)
    if (currentStep === 1) {
      return <AcademicTermStep termPlanData={termPlanData} updateTermPlanData={updateTermPlanData} />
    }

    if (currentStep === 2) {
      return <TermGoalsStep termPlanData={termPlanData} updateTermPlanData={updateTermPlanData} />
    }

    // For steps 3-6 (student-specific)
    if (!activeStudentId || !termPlanData.students[activeStudentId]) {
      return <div className="p-4 text-center text-gray-400">Please select a student</div>
    }

    const activeStudent = termPlanData.students[activeStudentId]

    switch (currentStep) {
      case 3:
        return (
          <WeeklyScheduleStep
            studentData={activeStudent}
            updateStudentData={(data) => updateStudentData(activeStudentId, data)}
            students={students}
            activeStudentId={activeStudentId}
            copyScheduleFromStudent={copyScheduleFromStudent}
          />
        )
      case 4:
        return (
          <ActivitiesStep
            studentData={activeStudent}
            updateStudentData={(data) => updateStudentData(activeStudentId, data)}
            students={students}
            activeStudentId={activeStudentId}
            copyScheduleFromStudent={copyScheduleFromStudent}
          />
        )
      case 5:
        return (
          <SubjectsStep
            studentData={activeStudent}
            updateStudentData={(data) => updateStudentData(activeStudentId, data)}
            students={students}
            activeStudentId={activeStudentId}
            copyScheduleFromStudent={copyScheduleFromStudent}
          />
        )
      case 6:
        return (
          <BlockAssignmentStep
            studentData={activeStudent}
            updateStudentData={(data) => updateStudentData(activeStudentId, data)}
            students={students}
            activeStudentId={activeStudentId}
            copyScheduleFromStudent={copyScheduleFromStudent}
          />
        )
      default:
        return <AcademicTermStep termPlanData={termPlanData} updateTermPlanData={updateTermPlanData} />
    }
  }

  const getStepColor = (step: number) => {
    switch (step) {
      case 1:
        return "bg-purple-600"
      case 2:
        return "bg-blue-600"
      case 3:
        return "bg-green-600"
      case 4:
        return "bg-orange-600"
      case 5:
        return "bg-red-600"
      case 6:
        return "bg-yellow-600"
      default:
        return "bg-gray-600"
    }
  }

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return "🟣"
      case 2:
        return "🔵"
      case 3:
        return "🟢"
      case 4:
        return "🟠"
      case 5:
        return "🔴"
      case 6:
        return "🟡"
      default:
        return ""
    }
  }

  const getStepLabel = (step: number) => {
    const studentName =
      activeStudentId && termPlanData.students[activeStudentId] ? termPlanData.students[activeStudentId].firstName : ""

    switch (step) {
      case 1:
        return "Which academic term are you planning for?"
      case 2:
        return "What are your goals for this term?"
      case 3:
        return studentName
          ? `What will ${studentName}'s weekly schedule look like?`
          : "What will the weekly schedule look like?"
      case 4:
        return studentName ? `What activities will ${studentName} include?` : "What activities will you include?"
      case 5:
        return studentName ? `Which subjects will ${studentName} study?` : "Which subjects will you include?"
      case 6:
        return studentName
          ? `Let's assign subjects to ${studentName}'s schedule blocks`
          : "Let's assign subjects to schedule blocks"
      default:
        return ""
    }
  }

  const getEncouragementMessage = () => {
    const studentName =
      activeStudentId && termPlanData.students[activeStudentId] ? termPlanData.students[activeStudentId].firstName : ""

    switch (currentStep) {
      case 1:
        return isEditMode ? "Let's update your term plan!" : "Let's get started planning your term!"
      case 2:
        return "Great choice! Now let's define what you want to accomplish."
      case 3:
        return studentName
          ? `Now let's create ${studentName}'s weekly schedule. You can customize this for each child.`
          : "You're making excellent progress! Let's map out your weekly schedule."
      case 4:
        return studentName
          ? `Let's select activities for ${studentName}. These will form part of their daily routine.`
          : "You're off to a great start! Let's add some activities to your plan."
      case 5:
        return studentName
          ? `Now let's choose the subjects ${studentName} will study this term.`
          : "Almost there! Let's finalize your subject selections."
      case 6:
        return studentName
          ? `Final step! Let's create ${studentName}'s weekly schedule by assigning subjects to time blocks.`
          : "Final step! Let's create your weekly schedule by assigning subjects to time blocks."
      default:
        return "You're doing great!"
    }
  }

  // Update the savePlan function to properly handle user ID
  const savePlan = async () => {
    try {
      // Show saving state
      setSaving(true)

      // Store the plan in sessionStorage for the overview page to access
      sessionStorage.setItem("termPlan", JSON.stringify(termPlanData))

      // Get the user ID from state or localStorage
      const currentUserId = userId || localStorage.getItem("userId")

      if (!currentUserId) {
        console.error("No user ID available for saving term plan")
        alert("Unable to save: No user ID found. Please try logging in again.")
        setSaving(false)
        return
      }

      console.log("Saving term plan with user ID:", currentUserId)
      console.log("Is edit mode:", isEditMode)
      console.log("Existing term plan ID:", existingTermPlanId)

      // Save to Supabase using the server action
      const result = await saveTermPlan(termPlanData, currentUserId, existingTermPlanId)

      if (result.success) {
        // Navigate to the parent dashboard
        router.push("/parent")
      } else {
        // Handle error
        console.error("Error saving term plan:", result.error)
        alert("There was an error saving your term plan. Please try again.")
        setSaving(false)
      }
    } catch (error) {
      console.error("Error saving term plan:", error)
      alert("There was an error saving your term plan. Please try again.")
      setSaving(false)
    }
  }

  // Determine if we should show student tabs
  const showStudentTabs = currentStep >= 3 && students.length > 0

  // Show loading state while fetching students
  if (loading) {
    return (
      <Card className="p-6 bg-gray-800 border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-white">Loading Term Plan Builder...</h2>
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4 bg-gray-700" />
          <Skeleton className="h-32 w-full bg-gray-700" />
          <Skeleton className="h-8 w-1/2 bg-gray-700" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-24 bg-gray-700" />
            <Skeleton className="h-10 w-24 bg-gray-700" />
          </div>
        </div>
      </Card>
    )
  }

  // Show message if no students are found
  if (!loading && students.length === 0) {
    return (
      <Card className="p-6 bg-gray-800 border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-white">No Students Found</h2>
        <p className="text-gray-300 mb-6">
          We couldn't find any student profiles associated with your account. Please add student profiles before
          creating a term plan.
        </p>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/profile-setup">Add Student Profiles</Link>
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <Card className="p-6 bg-gray-800 border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-white">
          {isEditMode ? "Edit Term Plan" : "Phase 1 – Start With What You Know"}
        </h2>

        {/* Progress Indicator */}
        <div className="flex items-center mb-6 overflow-x-auto pb-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex items-center">
              <button
                onClick={() => goToStep(index + 1)}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep > index
                    ? "bg-blue-900 text-blue-100"
                    : currentStep === index + 1
                      ? getStepColor(index + 1) + " text-white"
                      : "bg-gray-700 text-gray-300"
                } transition-all`}
              >
                {currentStep > index ? <CheckCircle2Icon className="w-6 h-6" /> : <span>{index + 1}</span>}
              </button>
              {index < totalSteps - 1 && (
                <div className={`h-1 w-12 ${currentStep > index + 1 ? "bg-blue-600" : "bg-gray-600"}`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Student Tabs (for steps 3-6) */}
        {showStudentTabs && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-medium text-white">Select Student</h3>
            </div>

            <Tabs value={activeStudentId} onValueChange={setActiveStudentId} className="w-full">
              <TabsList className="bg-gray-700 p-1 h-auto flex flex-wrap gap-2">
                {students.map((student) => (
                  <TabsTrigger
                    key={student.id}
                    value={student.id}
                    className={`
                      rounded-full px-4 py-2 text-sm font-medium transition-all
                      data-[state=active]:bg-blue-600 data-[state=active]:text-white
                      data-[state=active]:shadow-lg data-[state=active]:shadow-blue-900/20
                      data-[state=inactive]:bg-gray-800 data-[state=inactive]:text-gray-300
                      data-[state=inactive]:hover:bg-gray-700
                    `}
                  >
                    {student.firstName}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}

        {/* Summary Section */}
        {(termPlanData.academicTerm ||
          termPlanData.goals.length > 0 ||
          Object.values(termPlanData.students).some(
            (student) =>
              Object.values(student.schedule.days).some((day) => day.selected) ||
              student.activities.length > 0 ||
              student.subjects.core.length > 0 ||
              student.subjects.extended.length > 0,
          )) && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-white">Your Term So Far</h3>
            <TermSummary termPlanData={termPlanData} currentStep={currentStep} activeStudentId={activeStudentId} />
          </div>
        )}

        {/* Encouragement Message */}
        <div className="bg-blue-900/30 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-blue-100">{getEncouragementMessage()}</p>
        </div>

        {/* Current Step Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getStepIcon(currentStep)}</span>
            <h3 className="text-xl font-medium text-white">
              Step {currentStep}: {getStepLabel(currentStep)}
            </h3>
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">{renderStepContent()}</div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 border-gray-600 text-gray-200 hover:bg-gray-700"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {currentStep === totalSteps ? (
              <Button
                onClick={savePlan}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <SaveIcon className="w-4 h-4" />
                    {isEditMode ? "Update Plan" : "Save Plan"}
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={goToNextStep}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next
                <ChevronRightIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
