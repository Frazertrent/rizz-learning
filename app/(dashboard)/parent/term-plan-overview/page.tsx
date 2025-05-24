"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import {
  Calendar,
  Edit,
  BookOpen,
  Target,
  PlusCircle,
  Pencil,
  Users,
  Save,
  Clock,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import type { TermPlanData, StudentTermPlanData } from "@/components/parent/term-plan-builder"
import { WeeklyScheduleVisualizer } from "@/components/parent/term-plan-overview/weekly-schedule-visualizer"
import {
  SubjectsModal,
  ActivitiesModal,
  AcademicTermModal,
  GoalsModal,
  ScheduleModal,
} from "@/components/parent/term-plan-overview/edit-modals"
import { getCurrentUser } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"
import { saveTermPlan } from "@/app/actions/save-term-plan"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createClient } from "@supabase/supabase-js"

// Default empty schedule structure
const defaultSchedule = {
  days: {
    monday: { selected: false, startTime: "08:00", endTime: "15:00", blockLength: 45, blocks: 0 },
    tuesday: { selected: false, startTime: "08:00", endTime: "15:00", blockLength: 45, blocks: 0 },
    wednesday: { selected: false, startTime: "08:00", endTime: "15:00", blockLength: 45, blocks: 0 },
    thursday: { selected: false, startTime: "08:00", endTime: "15:00", blockLength: 45, blocks: 0 },
    friday: { selected: false, startTime: "08:00", endTime: "15:00", blockLength: 45, blocks: 0 },
    saturday: { selected: false, startTime: "09:00", endTime: "12:00", blockLength: 45, blocks: 0 },
    sunday: { selected: false, startTime: "09:00", endTime: "12:00", blockLength: 45, blocks: 0 },
  },
  useSameSchedule: true,
}

// Default empty subjects structure
const defaultSubjects = {
  core: [],
  extended: [],
  courses: {},
}

// Default empty student data
const defaultStudentData: Partial<StudentTermPlanData> = {
  schedule: defaultSchedule,
  subjects: defaultSubjects,
  activities: [],
  customActivities: [],
  blockAssignments: {},
}

// Initial empty term plan structure
const initialTermPlan: TermPlanData = {
  academicTerm: "",
  termType: "",
  termYear: new Date().getFullYear(),
  goals: [],
  students: {},
}

// Add a function to handle block assignments
const saveBlockAssignment = (
  termPlan: TermPlanData,
  studentId: string,
  day: string,
  timeSlot: string,
  assignment: {
    subject: string
    course: string
    type: "subject" | "activity" | "break"
  },
): TermPlanData => {
  const updatedTermPlan = { ...termPlan }
  const student = updatedTermPlan.students[studentId]

  if (!student) return termPlan

  // Initialize blockAssignments if it doesn't exist
  if (!student.blockAssignments) {
    student.blockAssignments = {}
  }

  // Initialize day assignments if they don't exist
  if (!student.blockAssignments[day]) {
    student.blockAssignments[day] = []
  }

  // Check if this time slot already has an assignment
  const existingAssignmentIndex = student.blockAssignments[day].findIndex((block) => block.time === timeSlot)

  if (existingAssignmentIndex >= 0) {
    // Update existing assignment
    student.blockAssignments[day][existingAssignmentIndex] = {
      time: timeSlot,
      ...assignment,
    }
  } else {
    // Add new assignment
    student.blockAssignments[day].push({
      time: timeSlot,
      ...assignment,
    })
  }

  return updatedTermPlan
}

const fetchFromSupabase = async (id: string, userId: string) => {
  try {
    console.log("Fetching term plan from Supabase with ID:", id)

    // Create Supabase client with custom timeout
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      global: {
        fetch: (url, options = {}) => {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 12000) // 12 second timeout for individual requests

          return fetch(url, {
            ...options,
            signal: controller.signal,
          }).finally(() => clearTimeout(timeoutId))
        },
      },
    })

    // Fetch the term plan
    const { data: termPlanData, error: termPlanError } = await supabase
      .from("term_plans")
      .select("*")
      .eq("id", id)
      .single()

    if (termPlanError) {
      console.error("Error fetching term plan from Supabase:", termPlanError)
      throw new Error(termPlanError.message)
    }

    if (!termPlanData) {
      console.error("No term plan found in Supabase")
      throw new Error("Term plan not found")
    }

    console.log("Term plan fetched from Supabase:", termPlanData)

    // Process the data
    let processedPlan: TermPlanData = {
      ...initialTermPlan,
      id: termPlanData.id,
      academicTerm: termPlanData.academic_term || "",
      termType: termPlanData.term_type || "",
      termYear: termPlanData.term_year || new Date().getFullYear(),
      goals: termPlanData.goals || [],
      students: {},
    }

    // Process data field if it exists
    if (termPlanData.data) {
      try {
        const parsedData = typeof termPlanData.data === "string" ? JSON.parse(termPlanData.data) : termPlanData.data

        if (parsedData && typeof parsedData === "object") {
          // Merge with processed plan
          processedPlan = {
            ...processedPlan,
            academicTerm: parsedData.academicTerm || processedPlan.academicTerm,
            termType: parsedData.termType || processedPlan.termType,
            termYear: parsedData.termYear || processedPlan.termYear,
            goals: parsedData.goals || processedPlan.goals,
            students: parsedData.students && typeof parsedData.students === "object" ? parsedData.students : {},
          }
        }
      } catch (error) {
        console.error("Error parsing term plan data field:", error)
        // Continue with the basic processed plan
      }
    }

    // Save to localStorage as backup
    localStorage.setItem(`termPlan_${id}`, JSON.stringify(processedPlan))
    console.log("Term plan saved to localStorage and returning:", processedPlan)

    return processedPlan
  } catch (error) {
    console.error("Error in fetchFromSupabase:", error)
    throw error
  }
}

export default function TermPlanOverviewPage() {
  const [termPlan, setTermPlan] = useState<TermPlanData>(initialTermPlan)
  const [activeStudentId, setActiveStudentId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const { user } = useAuth() // Get user from auth context
  const searchParams = useSearchParams()
  const termPlanId = searchParams?.get("id")
  const isEditMode = searchParams?.get("edit") === "true"
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [academicTermModalOpen, setAcademicTermModalOpen] = useState(false)
  const [goalsModalOpen, setGoalsModalOpen] = useState(false)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [subjectsModalOpen, setSubjectsModalOpen] = useState(false)
  const [activitiesModalOpen, setActivitiesModalOpen] = useState(false)
  const [loadingState, setLoadingState] = useState<"initial" | "loading" | "timeout" | "error" | "success">("initial")
  const router = useRouter()

  // Add a ref to track if the component is mounted
  const isMounted = useRef(true)

  // Add a ref to track if the student selection is being changed by the user
  const isUserSelectingStudent = useRef(false)

  // Function to load term plan from localStorage
  const loadFromLocalStorage = (id: string) => {
    try {
      console.log("Attempting to load term plan from localStorage with ID:", id)
      const storedPlan = localStorage.getItem(`termPlan_${id}`)

      if (!storedPlan) {
        console.log("No term plan found in localStorage")
        return null
      }

      console.log("Found term plan in localStorage, parsing...")
      const parsedPlan = JSON.parse(storedPlan)

      // Validate the parsed plan
      if (!parsedPlan || typeof parsedPlan !== "object") {
        console.error("Invalid term plan format in localStorage")
        return null
      }

      // Ensure the plan has the expected structure
      const validatedPlan: TermPlanData = {
        ...initialTermPlan,
        ...parsedPlan,
        id: id,
        academicTerm: parsedPlan.academicTerm || "",
        termType: parsedPlan.termType || "",
        termYear: parsedPlan.termYear || new Date().getFullYear(),
        goals: Array.isArray(parsedPlan.goals) ? parsedPlan.goals : [],
        students: parsedPlan.students && typeof parsedPlan.students === "object" ? parsedPlan.students : {},
      }

      console.log("Successfully loaded and validated term plan from localStorage:", validatedPlan)
      return validatedPlan
    } catch (error) {
      console.error("Error loading term plan from localStorage:", error)
      return null
    }
  }

  // Function to check authentication
  const checkAuth = async () => {
    try {
      // First check if we have a user from the auth context
      if (user) {
        setIsAuthenticated(true)
        setUserId(user.id)
        console.log("User authenticated from auth context:", user.id)
        return user.id
      }

      // Fallback to checking with Supabase directly
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setIsAuthenticated(true)
        setUserId(currentUser.id)
        console.log("User authenticated from getCurrentUser:", currentUser.id)
        return currentUser.id
      }

      // Try localStorage fallbacks
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          if (parsedUser && parsedUser.id) {
            setUserId(parsedUser.id)
            setIsAuthenticated(true)
            console.log("User authenticated from localStorage:", parsedUser.id)
            return parsedUser.id
          }
        } catch (e) {
          console.error("Error parsing stored user:", e)
        }
      }

      // Check for demo user ID
      const demoUserId = localStorage.getItem("demoUserId")
      if (demoUserId) {
        setUserId(demoUserId)
        console.log("Using demo user ID:", demoUserId)
        return demoUserId
      }

      return null
    } catch (error) {
      console.error("Error checking authentication:", error)
      return null
    }
  }

  // Set up cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  // Main effect to load the term plan
  useEffect(() => {
    const loadTermPlan = async () => {
      if (!isMounted.current) return

      try {
        setLoadingState("loading")

        // Check if we have a term plan ID
        if (!termPlanId) {
          setErrorMessage("No term plan ID provided. Please select a term plan from the dashboard.")
          setLoadingState("error")
          return
        }

        // First try to load from localStorage for immediate display
        const localPlan = loadFromLocalStorage(termPlanId)
        if (localPlan) {
          console.log("Successfully loaded term plan from localStorage")
          setTermPlan(localPlan)

          // Set the first student as active if available and no student is currently selected
          if (localPlan.students && Object.keys(localPlan.students).length > 0 && !activeStudentId) {
            const firstStudentId = Object.keys(localPlan.students)[0]
            console.log("Setting initial active student to:", firstStudentId)
            setActiveStudentId(firstStudentId)
          }

          // Show the plan immediately, but continue loading from Supabase
          setLoading(false)
        }

        // Check authentication
        const currentUserId = await checkAuth()

        // Try to fetch from Supabase with a timeout
        if (currentUserId) {
          try {
            // Create a timeout promise with longer duration
            const timeoutPromise = new Promise(
              (_, reject) => setTimeout(() => reject(new Error("Supabase fetch timeout")), 15000), // Increased to 15 seconds
            )

            // Race between the fetch and the timeout
            const supabasePlan = (await Promise.race([
              fetchFromSupabase(termPlanId, currentUserId),
              timeoutPromise,
            ])) as TermPlanData

            if (isMounted.current && supabasePlan) {
              console.log("Successfully fetched term plan from Supabase")
              setTermPlan(supabasePlan)

              // Set the first student as active if available and no student is currently selected
              if (supabasePlan.students && Object.keys(supabasePlan.students).length > 0 && !activeStudentId) {
                const firstStudentId = Object.keys(supabasePlan.students)[0]
                console.log("Setting initial active student to:", firstStudentId)
                setActiveStudentId(firstStudentId)
              }

              setLoadingState("success")
              setLoading(false)

              // If edit mode is enabled, open the academic term modal
              if (isEditMode) {
                setAcademicTermModalOpen(true)
              }
            }
          } catch (error) {
            console.error("Error or timeout fetching from Supabase:", error)

            // If we already loaded from localStorage, just mark as success
            if (localPlan) {
              console.log("Using localStorage data after Supabase timeout")
              setLoadingState("success")
              setLoading(false)

              // Show a toast notification that we're using cached data
              toast({
                title: "Using cached data",
                description: "Unable to fetch latest data from server. Using locally saved version.",
                variant: "default",
              })
            } else {
              setLoadingState("timeout")

              // Try one more time to load from localStorage
              const fallbackPlan = loadFromLocalStorage(termPlanId)
              if (fallbackPlan) {
                setTermPlan(fallbackPlan)

                // Set the first student as active if available and no student is currently selected
                if (fallbackPlan.students && Object.keys(fallbackPlan.students).length > 0 && !activeStudentId) {
                  const firstStudentId = Object.keys(fallbackPlan.students)[0]
                  console.log("Setting initial active student to:", firstStudentId)
                  setActiveStudentId(firstStudentId)
                }

                setLoading(false)
                setLoadingState("success")

                toast({
                  title: "Using cached data",
                  description: "Unable to connect to server. Using locally saved version.",
                  variant: "default",
                })
              } else {
                setErrorMessage(
                  "Unable to connect to server and no local data found. Please check your internet connection.",
                )
                setLoadingState("error")
              }
            }
          }
        } else {
          // No user ID, but we might have loaded from localStorage
          if (localPlan) {
            setLoadingState("success")
          } else {
            setErrorMessage("No user ID found and no term plan in localStorage.")
            setLoadingState("error")
          }
        }
      } catch (error) {
        console.error("Unexpected error in loadTermPlan:", error)
        setErrorMessage((error as Error).message || "An unexpected error occurred while loading the term plan.")
        setLoadingState("error")
      } finally {
        if (isMounted.current) {
          setLoading(false)
        }
      }
    }

    loadTermPlan()
  }, [termPlanId, user, isEditMode])

  // Handle student tab change
  const handleStudentChange = (studentId: string) => {
    console.log("Student tab changed to:", studentId)
    isUserSelectingStudent.current = true
    setActiveStudentId(studentId)

    // Reset the flag after a short delay to prevent race conditions
    setTimeout(() => {
      isUserSelectingStudent.current = false
    }, 100)
  }

  // Save to parent dashboard function
  const saveToParentDashboard = async () => {
    try {
      setIsSaving(true)
      setErrorMessage("")

      // Check if we have a term plan ID
      if (!termPlanId) {
        toast({
          title: "Error",
          description: "No term plan ID found. Please create a term plan first.",
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }

      // Check if we have a user ID
      let currentUserId = userId

      if (!currentUserId) {
        // Try to get from localStorage
        currentUserId = localStorage.getItem("userId")

        if (!currentUserId) {
          // Try to get from user object in localStorage
          const storedUser = localStorage.getItem("user")
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser)
              if (parsedUser && parsedUser.id) {
                currentUserId = parsedUser.id
              }
            } catch (e) {
              console.error("Error parsing stored user:", e)
            }
          }
        }
      }

      if (!currentUserId) {
        // For testing/demo purposes, use a hardcoded user ID
        const demoUserId = "demo-user-" + Math.random().toString(36).substring(2, 9)
        console.log("No user ID found, using demo ID:", demoUserId)

        // Store this ID for future use
        localStorage.setItem("demoUserId", demoUserId)
        localStorage.setItem("userId", demoUserId)

        const result = await saveTermPlan(termPlan, demoUserId)

        if (result.error) {
          console.error("Error saving term plan:", result.error)
          setErrorMessage(result.error)
          toast({
            title: "Error",
            description: result.error || "Failed to save term plan. Please try again.",
            variant: "destructive",
          })
        } else {
          console.log("Term plan saved successfully with demo ID")
          toast({
            title: "Success!",
            description: "Your term plan has been saved successfully with a demo account.",
            variant: "default",
          })
          router.push("/parent")
        }
      } else {
        // Normal flow with authenticated user
        console.log("Using authenticated user ID:", currentUserId)
        const result = await saveTermPlan(termPlan, currentUserId)

        if (result.error) {
          console.error("Error saving term plan:", result.error)
          setErrorMessage(result.error)
          toast({
            title: "Error",
            description: result.error || "Failed to save term plan. Please try again.",
            variant: "destructive",
          })
        } else {
          console.log("Term plan saved successfully")
          toast({
            title: "Success!",
            description: "Your term plan has been saved successfully.",
            variant: "default",
          })
          router.push("/parent")
        }
      }
    } catch (error) {
      console.error("Error in saveToParentDashboard:", error)
      setErrorMessage((error as Error).message || "An unexpected error occurred")
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle block assignment change
  const handleBlockAssignmentChange = (
    studentId: string,
    day: string,
    timeSlot: string,
    assignment: {
      subject: string
      course: string
      type: "subject" | "activity" | "break"
    },
  ) => {
    try {
      const updatedTermPlan = saveBlockAssignment(termPlan, studentId, day, timeSlot, assignment)
      setTermPlan(updatedTermPlan)
      setHasUnsavedChanges(true)

      // Save to localStorage
      if (termPlanId) {
        localStorage.setItem(`termPlan_${termPlanId}`, JSON.stringify(updatedTermPlan))
      }
    } catch (error) {
      console.error("Error updating block assignment:", error)
      toast({
        title: "Error",
        description: "Failed to update the schedule. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Save changes function
  const saveChanges = () => {
    try {
      // Save to localStorage (already done in handleBlockAssignmentChange)
      // Just mark as saved
      setHasUnsavedChanges(false)
      toast({
        title: "Changes saved",
        description: "Your schedule changes have been saved.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error saving changes:", error)
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Function to get the term name with proper formatting
  const getFormattedTermName = () => {
    return termPlan.academicTerm || "Current Term"
  }

  // Function to get all students
  const getStudents = () => {
    if (!termPlan || !termPlan.students) return []

    return Object.entries(termPlan.students).map(([id, student]) => ({
      id,
      firstName: student?.firstName || "Student",
    }))
  }

  // Function to count the total number of blocks across all selected days for a student
  const getTotalBlocks = (studentId: string) => {
    if (
      !termPlan.students[studentId] ||
      !termPlan.students[studentId].schedule ||
      !termPlan.students[studentId].schedule.days
    )
      return 0

    return Object.values(termPlan.students[studentId].schedule.days)
      .filter((day) => day && day.selected)
      .reduce((total, day) => total + (day?.blocks || 0), 0)
  }

  // Function to get all selected days for a student
  const getSelectedDays = (studentId: string) => {
    if (
      !termPlan.students[studentId] ||
      !termPlan.students[studentId].schedule ||
      !termPlan.students[studentId].schedule.days
    )
      return []

    return Object.entries(termPlan.students[studentId].schedule.days)
      .filter(([_, day]) => day && day.selected)
      .map(([dayName, _]) => dayName)
  }

  // Function to format day name
  const formatDayName = (day: string): string => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  // Function to save academic term changes
  const saveAcademicTerm = (term: string, termType: string, termYear: number) => {
    try {
      const updatedTermPlan = {
        ...termPlan,
        academicTerm: term,
        termType: termType,
        termYear: termYear,
      }

      setTermPlan(updatedTermPlan)

      // Save to localStorage
      if (termPlanId) {
        localStorage.setItem(`termPlan_${termPlanId}`, JSON.stringify(updatedTermPlan))
      }

      toast({
        title: "Term updated",
        description: "Academic term information has been updated.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error saving academic term:", error)
      toast({
        title: "Error",
        description: "Failed to update academic term. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Function to save goals changes
  const saveGoals = (goals: string[]) => {
    try {
      const updatedTermPlan = {
        ...termPlan,
        goals: goals || [],
      }

      setTermPlan(updatedTermPlan)

      // Save to localStorage
      if (termPlanId) {
        localStorage.setItem(`termPlan_${termPlanId}`, JSON.stringify(updatedTermPlan))
      }

      toast({
        title: "Goals updated",
        description: "Term goals have been updated.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error saving goals:", error)
      toast({
        title: "Error",
        description: "Failed to update goals. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Function to save schedule changes
  const saveSchedule = (studentId: string, schedule: any) => {
    try {
      if (!studentId || !termPlan.students[studentId]) {
        throw new Error("Invalid student ID")
      }

      const updatedTermPlan = {
        ...termPlan,
        students: {
          ...termPlan.students,
          [studentId]: {
            ...termPlan.students[studentId],
            schedule: schedule || defaultSchedule,
          },
        },
      }

      setTermPlan(updatedTermPlan)

      // Save to localStorage
      if (termPlanId) {
        localStorage.setItem(`termPlan_${termPlanId}`, JSON.stringify(updatedTermPlan))
      }

      toast({
        title: "Schedule updated",
        description: "Student schedule has been updated.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error saving schedule:", error)
      toast({
        title: "Error",
        description: "Failed to update schedule. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Function to save subjects changes
  const saveSubjects = (studentId: string, subjects: any) => {
    try {
      if (!studentId || !termPlan.students[studentId]) {
        throw new Error("Invalid student ID")
      }

      const updatedTermPlan = {
        ...termPlan,
        students: {
          ...termPlan.students,
          [studentId]: {
            ...termPlan.students[studentId],
            subjects: subjects || defaultSubjects,
          },
        },
      }

      setTermPlan(updatedTermPlan)

      // Save to localStorage
      if (termPlanId) {
        localStorage.setItem(`termPlan_${termPlanId}`, JSON.stringify(updatedTermPlan))
      }

      toast({
        title: "Subjects updated",
        description: "Student subjects have been updated.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error saving subjects:", error)
      toast({
        title: "Error",
        description: "Failed to update subjects. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Function to save activities changes
  const saveActivities = (studentId: string, activities: string[], customActivities: string[]) => {
    try {
      if (!studentId || !termPlan.students[studentId]) {
        throw new Error("Invalid student ID")
      }

      const updatedTermPlan = {
        ...termPlan,
        students: {
          ...termPlan.students,
          [studentId]: {
            ...termPlan.students[studentId],
            activities: activities || [],
            customActivities: customActivities || [],
          },
        },
      }

      setTermPlan(updatedTermPlan)

      // Save to localStorage
      if (termPlanId) {
        localStorage.setItem(`termPlan_${termPlanId}`, JSON.stringify(updatedTermPlan))
      }

      toast({
        title: "Activities updated",
        description: "Student activities have been updated.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error saving activities:", error)
      toast({
        title: "Error",
        description: "Failed to update activities. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openEditModal = (modalType: string) => {
    switch (modalType) {
      case "term":
        setAcademicTermModalOpen(true)
        break
      case "goals":
        setGoalsModalOpen(true)
        break
      case "schedule":
        setScheduleModalOpen(true)
        break
      case "subjects":
        setSubjectsModalOpen(true)
        break
      case "activities":
        setActivitiesModalOpen(true)
        break
      default:
        console.error("Unknown modal type:", modalType)
    }
  }

  const activeStudent = termPlan.students[activeStudentId]
  const studentName = activeStudent ? activeStudent.firstName : ""

  // Loading state UI
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-gray-300">Loading term plan...</h2>
        <p className="text-gray-400 mt-2">Please wait while we retrieve your data</p>

        <Button
          variant="outline"
          className="mt-8 border-blue-600 text-blue-400 hover:bg-blue-900/20"
          onClick={() => router.push("/parent")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Return to Dashboard
        </Button>
      </div>
    )
  }

  // Timeout state UI
  if (loadingState === "timeout" && !termPlan.id) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh]">
        <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-300">Loading is taking longer than expected</h2>
        <p className="text-gray-400 mt-2 mb-6">We're having trouble connecting to the server</p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button
            className="bg-blue-600 hover:bg-blue-500 text-white"
            onClick={() => {
              // Try to load from localStorage one more time
              const localPlan = loadFromLocalStorage(termPlanId!)
              if (localPlan) {
                setTermPlan(localPlan)

                // Set the first student as active
                if (localPlan.students && Object.keys(localPlan.students).length > 0) {
                  setActiveStudentId(Object.keys(localPlan.students)[0])
                }

                setLoadingState("success")
              } else {
                toast({
                  title: "Error",
                  description: "Could not find term plan in local storage.",
                  variant: "destructive",
                })
              }
            }}
          >
            Try Again
          </Button>

          <Button
            variant="outline"
            className="border-blue-600 text-blue-400 hover:bg-blue-900/20"
            onClick={() => router.push("/parent")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  // Error state UI
  if (errorMessage) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold mb-4 text-white">Problem Loading Term Plan</h1>
        <p className="text-gray-300 mb-6">{errorMessage}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            className="bg-blue-600 hover:bg-blue-500 text-white"
            onClick={() => {
              // Try to load from localStorage one more time
              const localPlan = loadFromLocalStorage(termPlanId!)
              if (localPlan) {
                setTermPlan(localPlan)
                setErrorMessage("")

                // Set the first student as active
                if (localPlan.students && Object.keys(localPlan.students).length > 0) {
                  setActiveStudentId(Object.keys(localPlan.students)[0])
                }
              } else {
                toast({
                  title: "Error",
                  description: "Could not find term plan in local storage.",
                  variant: "destructive",
                })
              }
            }}
          >
            Try Again
          </Button>

          <Button
            variant="outline"
            className="border-blue-600 text-blue-400 hover:bg-blue-900/20"
            onClick={() => router.push("/parent")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Dashboard
          </Button>

          <Button asChild className="bg-green-600 hover:bg-green-500 text-white">
            <Link href="/parent/term-plan-builder">Create New Term Plan</Link>
          </Button>
        </div>
      </div>
    )
  }

  const students = getStudents()

  if (students.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold mb-4 text-white">No Students Found</h1>
        <p className="text-gray-300 mb-6">This term plan doesn't have any students yet.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/parent/term-plan-builder">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white">Edit Term Plan</Button>
          </Link>

          <Button
            variant="outline"
            className="border-blue-600 text-blue-400 hover:bg-blue-900/20"
            onClick={() => router.push("/parent")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 bg-gray-950 text-white">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          <span>📚</span> Your {getFormattedTermName()} Term Plan
        </h1>
        <p className="text-gray-300 text-lg">
          View or adjust your curriculum plan for this academic term. You can update your goals, schedule, subjects, and
          routines as needed.
        </p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <Alert variant="destructive" className="bg-red-900/30 border-red-700 text-red-100">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Authentication Status */}
      {!userId && (
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 text-yellow-200">
          <p className="font-medium">⚠️ Authentication Warning</p>
          <p className="text-sm mt-1">
            You appear to be not fully authenticated. Your changes will be saved locally, but you may not be able to
            save to the server.
          </p>
        </div>
      )}

      {/* Student Tabs */}
      {students.length > 1 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-medium text-white">Select Student</h3>
          </div>

          <div className="bg-gray-700 p-1 rounded-md flex flex-wrap gap-2">
            {students.map((student) => (
              <button
                key={student.id}
                onClick={() => handleStudentChange(student.id)}
                className={`
                  rounded-full px-4 py-2 text-sm font-medium transition-all
                  ${
                    activeStudentId === student.id
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }
                `}
              >
                {student.firstName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      {activeStudent && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-gray-800 border-b border-gray-700 w-full justify-start mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-gray-700">
              Weekly Schedule
            </TabsTrigger>
            <TabsTrigger value="subjects" className="data-[state=active]:bg-gray-700">
              Subjects & Courses
            </TabsTrigger>
            <TabsTrigger value="activities" className="data-[state=active]:bg-gray-700">
              Activities
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Academic Term Card */}
              <Card className="bg-gray-800 border-purple-700 shadow-lg hover:shadow-purple-900/20 transition-all">
                <CardHeader className="bg-gradient-to-r from-purple-900/50 to-purple-700/30 rounded-t-lg pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold flex items-center gap-2 text-white">
                      <Calendar className="h-5 w-5 text-purple-400" />
                      Academic Term
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-purple-400 hover:text-purple-300 hover:bg-purple-900/30"
                      onClick={() => openEditModal("term")}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-purple-300">{termPlan.academicTerm}</h3>
                      <p className="text-gray-400 mt-1">
                        {getSelectedDays(activeStudentId).length} days per week • {getTotalBlocks(activeStudentId)}{" "}
                        learning blocks
                      </p>
                    </div>
                    <div className="bg-purple-900/30 p-2 rounded-lg border border-purple-700">
                      <Clock className="h-8 w-8 text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Term Goals Card */}
              <Card className="bg-gray-800 border-blue-700 shadow-lg hover:shadow-blue-900/20 transition-all">
                <CardHeader className="bg-gradient-to-r from-blue-900/50 to-blue-700/30 rounded-t-lg pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold flex items-center gap-2 text-white">
                      <Target className="h-5 w-5 text-blue-400" />
                      Term Goals
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                      onClick={() => openEditModal("goals")}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-2">
                    {termPlan.goals.map((goal, index) => (
                      <Badge
                        key={index}
                        className="bg-blue-900/50 text-blue-100 border border-blue-700 hover:bg-blue-800/50 transition-colors py-1 px-3"
                      >
                        {goal}
                      </Badge>
                    ))}
                    <Badge
                      className="bg-blue-900/30 text-blue-300 border border-blue-700 hover:bg-blue-800/50 transition-colors py-1 px-3 cursor-pointer flex items-center gap-1"
                      onClick={() => openEditModal("goals")}
                    >
                      <PlusCircle className="h-3 w-3" /> Add Goal
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Block Schedule Preview */}
            <Card className="bg-gray-800 border-green-700 shadow-lg hover:shadow-green-900/20 transition-all">
              <CardHeader className="bg-gradient-to-r from-green-900/50 to-green-700/30 rounded-t-lg pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold flex items-center gap-2 text-white">
                    <Calendar className="h-5 w-5 text-green-400" />
                    {activeStudent.firstName}'s Weekly Schedule
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-900/30"
                    onClick={() => openEditModal("schedule")}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="text-gray-300">
                  {getSelectedDays(activeStudentId).length} days per week with {getTotalBlocks(activeStudentId)}{" "}
                  learning blocks
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="p-4 border border-green-700 rounded-lg bg-green-900/20 text-green-100 mb-4">
                  <p>Click on "Weekly Schedule" tab to see the full schedule details.</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {getSelectedDays(activeStudentId).map((day) => (
                    <Badge key={day} className="bg-green-900/30 text-green-100 border border-green-700 py-1 px-3">
                      {formatDayName(day)}
                    </Badge>
                  ))}
                </div>

                <div className="mt-4 flex justify-center">
                  <Button
                    className="bg-green-700 hover:bg-green-600 text-white"
                    onClick={() => openEditModal("schedule")}
                  >
                    Edit Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subjects Preview */}
              <Card className="bg-gray-800 border-red-700 shadow-lg hover:shadow-red-900/20 transition-all">
                <CardHeader className="bg-gradient-to-r from-red-900/50 to-red-700/30 rounded-t-lg pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold flex items-center gap-2 text-white">
                      <BookOpen className="h-5 w-5 text-red-400" />
                      {activeStudent.firstName}'s Subjects
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                      onClick={() => openEditModal("subjects")}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="p-4 border border-red-700 rounded-lg bg-red-900/20 text-red-100 mb-4">
                    <p>Click on "Subjects & Courses" tab to see the full subject details.</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {activeStudent.subjects &&
                      activeStudent.subjects.core &&
                      activeStudent.subjects.core.map((subject) => (
                        <Badge key={subject} className="bg-red-900/30 text-red-100 border border-red-700 py-1 px-3">
                          {subject}
                        </Badge>
                      ))}
                    {activeStudent.subjects &&
                      activeStudent.subjects.extended &&
                      activeStudent.subjects.extended.map((subject) => (
                        <Badge key={subject} className="bg-red-900/50 text-red-100 border border-red-700 py-1 px-3">
                          {subject}
                        </Badge>
                      ))}
                  </div>

                  <div className="mt-4 flex justify-center">
                    <Button
                      className="bg-red-700 hover:bg-red-600 text-white"
                      onClick={() => openEditModal("subjects")}
                    >
                      Edit Subjects
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Activities Preview */}
              <Card className="bg-gray-800 border-orange-700 shadow-lg hover:shadow-orange-900/20 transition-all">
                <CardHeader className="bg-gradient-to-r from-orange-900/50 to-orange-700/30 rounded-t-lg pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold flex items-center gap-2 text-white">
                      <CheckCircle className="h-5 w-5 text-orange-400" />
                      {activeStudent.firstName}'s Activities
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-orange-400 hover:text-orange-300 hover:bg-orange-900/30"
                      onClick={() => openEditModal("activities")}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="p-4 border border-orange-700 rounded-lg bg-orange-900/20 text-orange-100 mb-4">
                    <p>Click on "Activities" tab to see the full activities details.</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {activeStudent.activities &&
                      activeStudent.activities.slice(0, 5).map((activity, index) => (
                        <Badge
                          key={index}
                          className="bg-orange-900/30 text-orange-100 border border-orange-700 py-1 px-3"
                        >
                          {activity}
                        </Badge>
                      ))}
                    {activeStudent.activities && activeStudent.activities.length > 5 && (
                      <Badge className="bg-orange-900/30 text-orange-100 border border-orange-700 py-1 px-3">
                        +{activeStudent.activities.length - 5} more
                      </Badge>
                    )}
                  </div>

                  <div className="mt-4 flex justify-center">
                    <Button
                      className="bg-orange-700 hover:bg-orange-600 text-white"
                      onClick={() => openEditModal("activities")}
                    >
                      Edit Activities
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            {/* Weekly Block Schedule */}
            <Card className="bg-gray-800 border-green-700 shadow-lg hover:shadow-green-900/20 transition-all">
              <CardHeader className="bg-gradient-to-r from-green-900/50 to-green-700/30 rounded-t-lg pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold flex items-center gap-2 text-white">
                    <Calendar className="h-5 w-5 text-green-400" />
                    {activeStudent.firstName}'s Weekly Block Schedule
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-900/30"
                    onClick={() => openEditModal("schedule")}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="text-gray-300">
                  {getSelectedDays(activeStudentId).length} days per week with {getTotalBlocks(activeStudentId)}{" "}
                  learning blocks
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <WeeklyScheduleVisualizer
                  schedule={activeStudent.schedule}
                  blockAssignments={activeStudent.blockAssignments || {}}
                  subjects={activeStudent.subjects}
                  activities={activeStudent.activities || []}
                  customActivities={activeStudent.customActivities || []}
                  studentId={activeStudentId}
                  studentName={studentName}
                  onBlockAssignmentChange={handleBlockAssignmentChange}
                  saveChanges={saveChanges}
                />

                <div className="mt-6 flex justify-center">
                  <Button
                    className="bg-green-700 hover:bg-green-600 text-white"
                    onClick={() => openEditModal("schedule")}
                  >
                    Edit Schedule Blocks
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6">
            {/* Subjects + Courses Card */}
            <Card className="bg-gray-800 border-red-700 shadow-lg hover:shadow-red-900/20 transition-all">
              <CardHeader className="bg-gradient-to-r from-red-900/50 to-red-700/30 rounded-t-lg pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold flex items-center gap-2 text-white">
                    <BookOpen className="h-5 w-5 text-red-400" />
                    {activeStudent.firstName}'s Subjects + Courses
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                    onClick={() => openEditModal("subjects")}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {/* Core Subjects */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Core Subjects</h3>
                  <div className="space-y-2">
                    {activeStudent.subjects &&
                      activeStudent.subjects.core &&
                      activeStudent.subjects.core.map((subject) => (
                        <div key={subject} className="space-y-1">
                          <div className="font-medium text-red-200">{subject}</div>
                          <div className="flex flex-wrap gap-1">
                            {activeStudent.subjects &&
                              activeStudent.subjects.courses &&
                              (activeStudent.subjects.courses[subject] || []).map((course) => (
                                <Badge
                                  key={`${subject}-${course}`}
                                  className="bg-red-900/30 text-red-100 border border-red-700"
                                >
                                  {course}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Extended Subjects */}
                {activeStudent.subjects &&
                  activeStudent.subjects.extended &&
                  activeStudent.subjects.extended.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">Extended Subjects</h3>
                      <div className="space-y-2">
                        {activeStudent.subjects.extended.map((subject) => (
                          <div key={subject} className="space-y-1">
                            <div className="font-medium text-red-200">{subject}</div>
                            <div className="flex flex-wrap gap-1">
                              {activeStudent.subjects &&
                                activeStudent.subjects.courses &&
                                (activeStudent.subjects.courses[subject] || []).map((course) => (
                                  <Badge
                                    key={`${subject}-${course}`}
                                    className="bg-red-900/50 text-red-100 border border-red-700"
                                  >
                                    {course}
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="pt-2">
                  <Button
                    className="bg-red-700 hover:bg-red-600 text-white w-full"
                    onClick={() => openEditModal("subjects")}
                  >
                    Edit Subjects
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            {/* Anchor Activities Card */}
            <Card className="bg-gray-800 border-orange-700 shadow-lg hover:shadow-orange-900/20 transition-all">
              <CardHeader className="bg-gradient-to-r from-orange-900/50 to-orange-700/30 rounded-t-lg pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold flex items-center gap-2 text-white">
                    <CheckCircle className="h-5 w-5 text-orange-400" />
                    {activeStudent.firstName}'s Anchor Activities
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-orange-400 hover:text-orange-300 hover:bg-orange-900/30"
                    onClick={() => openEditModal("activities")}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Standard Activities</h3>
                    <div className="flex flex-wrap gap-2">
                      {activeStudent.activities &&
                        activeStudent.customActivities &&
                        activeStudent.activities
                          .filter((activity) => !activeStudent.customActivities.includes(activity))
                          .map((activity, index) => (
                            <Badge
                              key={index}
                              className="bg-orange-900/30 text-orange-100 border border-orange-700 py-1 px-3"
                            >
                              {activity}
                            </Badge>
                          ))}
                    </div>
                  </div>

                  {activeStudent.customActivities && activeStudent.customActivities.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">Custom Activities</h3>
                      <div className="flex flex-wrap gap-2">
                        {activeStudent.customActivities.map((activity, index) => (
                          <Badge
                            key={index}
                            className="bg-orange-900/50 text-orange-100 border border-orange-700 py-1 px-3"
                          >
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <Button
                      className="bg-orange-700 hover:bg-orange-600 text-white w-full"
                      onClick={() => openEditModal("activities")}
                    >
                      Update Activities
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Button
          className="bg-green-600 hover:bg-green-500 text-white px-8 py-6 text-lg flex items-center gap-2 w-full sm:w-auto"
          onClick={() => openEditModal("term")}
        >
          <Edit className="h-5 w-5" />
          Edit Term Plan
        </Button>

        <Button
          variant="outline"
          className="border-blue-600 text-blue-400 hover:bg-blue-900/20 px-8 py-6 text-lg flex items-center gap-2 w-full sm:w-auto"
          onClick={() => {
            // Clear session storage and start fresh
            sessionStorage.removeItem("termPlan")
            // Use direct href to maintain session
            window.location.href = "/parent/term-plan-builder?new=true"
          }}
        >
          <RefreshCw className="h-5 w-5" />
          Start New Term Plan
        </Button>

        <Button
          className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-6 text-lg flex items-center gap-2 w-full sm:w-auto"
          onClick={saveToParentDashboard}
          disabled={isSaving}
        >
          <Save className="h-5 w-5" />
          {isSaving ? "Saving..." : "Save to Dashboard"}
        </Button>
      </div>

      {/* Edit Modals */}
      <AcademicTermModal
        open={academicTermModalOpen}
        onOpenChange={setAcademicTermModalOpen}
        currentTerm={termPlan.academicTerm}
        currentTermType={termPlan.termType}
        currentTermYear={termPlan.termYear}
        onSave={(term, termType, termYear) => {
          saveAcademicTerm(term, termType, termYear)
        }}
      />

      <GoalsModal
        open={goalsModalOpen}
        onOpenChange={setGoalsModalOpen}
        currentGoals={termPlan.goals}
        onSave={saveGoals}
      />

      {activeStudent && (
        <>
          <ScheduleModal
            open={scheduleModalOpen}
            onOpenChange={setScheduleModalOpen}
            studentId={activeStudentId}
            studentName={activeStudent.firstName}
            schedule={activeStudent.schedule}
            onSave={saveSchedule}
          />

          <SubjectsModal
            open={subjectsModalOpen}
            onOpenChange={setSubjectsModalOpen}
            studentId={activeStudentId}
            studentName={activeStudent.firstName}
            subjects={activeStudent.subjects}
            onSave={saveSubjects}
          />

          <ActivitiesModal
            open={activitiesModalOpen}
            onOpenChange={setActivitiesModalOpen}
            studentId={activeStudentId}
            studentName={activeStudent.firstName}
            activities={activeStudent.activities || []}
            customActivities={activeStudent.customActivities || []}
            onSave={saveActivities}
          />
        </>
      )}
    </div>
  )
}
