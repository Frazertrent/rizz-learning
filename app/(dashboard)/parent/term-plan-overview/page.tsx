"use client"

import { useState, useEffect } from "react"
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

// Mock data for initial state - in a real app, this would come from a database
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

// Update the TermPlanOverviewPage component to handle block assignments
export default function TermPlanOverviewPage() {
  const [termPlan, setTermPlan] = useState<TermPlanData>(initialTermPlan)
  const [activeStudentId, setActiveStudentId] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("overview")
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const { user } = useAuth() // Get user from auth context

  // Add a new state for tracking changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const [academicTermModalOpen, setAcademicTermModalOpen] = useState(false)
  const [goalsModalOpen, setGoalsModalOpen] = useState(false)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [subjectsModalOpen, setSubjectsModalOpen] = useState(false)
  const [activitiesModalOpen, setActivitiesModalOpen] = useState(false)

  const router = useRouter()

  // UPDATED: Save to parent dashboard function
  const saveToParentDashboard = async () => {
    try {
      setIsSaving(true)
      setErrorMessage("")

      // Get the term plan data from sessionStorage
      const termPlanJson = sessionStorage.getItem("termPlan")
      if (!termPlanJson) {
        toast({
          title: "Error",
          description: "No term plan data found. Please create a term plan first.",
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

        const termPlanData = JSON.parse(termPlanJson)
        const result = await saveTermPlan(termPlanData, demoUserId)

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
        const termPlanData = JSON.parse(termPlanJson)
        const result = await saveTermPlan(termPlanData, currentUserId)

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

  // Update the handleBlockAssignmentChange function to track unsaved changes
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

      // Save to sessionStorage
      sessionStorage.setItem("termPlan", JSON.stringify(updatedTermPlan))
    } catch (error) {
      console.error("Error updating block assignment:", error)
      toast({
        title: "Error",
        description: "Failed to update the schedule. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Add a function to save changes
  const saveChanges = () => {
    try {
      // Save to sessionStorage (already done in handleBlockAssignmentChange)
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

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        // First check if we have a user from the auth context
        if (user) {
          setIsAuthenticated(true)
          setUserId(user.id)
          console.log("User authenticated from auth context:", user.id)
        } else {
          // Fallback to checking with Supabase directly
          const currentUser = await getCurrentUser()
          if (currentUser) {
            setIsAuthenticated(true)
            setUserId(currentUser.id)
            console.log("User authenticated from getCurrentUser:", currentUser.id)
          } else {
            // If no user is found, try to get the user ID from localStorage as a last resort
            const storedUser = localStorage.getItem("user")
            if (storedUser) {
              try {
                const parsedUser = JSON.parse(storedUser)
                if (parsedUser && parsedUser.id) {
                  setUserId(parsedUser.id)
                  setIsAuthenticated(true)
                  console.log("User authenticated from localStorage:", parsedUser.id)
                }
              } catch (e) {
                console.error("Error parsing stored user:", e)
              }
            } else {
              // Check for demo user ID
              const demoUserId = localStorage.getItem("demoUserId")
              if (demoUserId) {
                setUserId(demoUserId)
                console.log("Using demo user ID:", demoUserId)
              }
            }
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        // Even if authentication fails, we'll still show the data from sessionStorage
        setIsAuthenticated(false)
      }
    }

    checkAuth()

    // Get data from sessionStorage regardless of authentication status
    const storedPlan = sessionStorage.getItem("termPlan")
    if (storedPlan) {
      try {
        const parsedPlan = JSON.parse(storedPlan)

        // Ensure the parsed plan has the expected structure
        const validatedPlan = {
          ...initialTermPlan,
          ...parsedPlan,
          students: {},
        }

        // Validate each student's data
        if (parsedPlan.students) {
          Object.entries(parsedPlan.students).forEach(([id, studentData]) => {
            validatedPlan.students[id] = {
              ...defaultStudentData,
              ...(studentData as StudentTermPlanData),
              studentId: id,
            }
          })
        }

        setTermPlan(validatedPlan)

        // Set the first student as active
        if (validatedPlan.students && Object.keys(validatedPlan.students).length > 0) {
          setActiveStudentId(Object.keys(validatedPlan.students)[0])
        }
      } catch (error) {
        console.error("Error parsing stored term plan:", error)
        // If there's an error parsing, use the initial state
        setTermPlan(initialTermPlan)
      }
    }

    setLoading(false)
  }, [user])

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

      // Save to sessionStorage
      sessionStorage.setItem("termPlan", JSON.stringify(updatedTermPlan))

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

      // Save to sessionStorage
      sessionStorage.setItem("termPlan", JSON.stringify(updatedTermPlan))

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

      // Save to sessionStorage
      sessionStorage.setItem("termPlan", JSON.stringify(updatedTermPlan))

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

      // Save to sessionStorage
      sessionStorage.setItem("termPlan", JSON.stringify(updatedTermPlan))

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

      // Save to sessionStorage
      sessionStorage.setItem("termPlan", JSON.stringify(updatedTermPlan))

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

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center text-gray-400">Loading term plan...</div>
  }

  const students = getStudents()

  if (students.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold mb-4 text-white">No Term Plan Found</h1>
        <p className="text-gray-300 mb-6">You haven't created a term plan yet.</p>
        <Link href="/parent/term-plan-builder">
          <Button className="bg-blue-600 hover:bg-blue-500 text-white">Create Term Plan</Button>
        </Link>
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
                    {activeStudent.subjects.core.map((subject) => (
                      <Badge key={subject} className="bg-red-900/30 text-red-100 border border-red-700 py-1 px-3">
                        {subject}
                      </Badge>
                    ))}
                    {activeStudent.subjects.extended.map((subject) => (
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
                    {activeStudent.activities.slice(0, 5).map((activity, index) => (
                      <Badge
                        key={index}
                        className="bg-orange-900/30 text-orange-100 border border-orange-700 py-1 px-3"
                      >
                        {activity}
                      </Badge>
                    ))}
                    {activeStudent.activities.length > 5 && (
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
                    {activeStudent.subjects.core.map((subject) => (
                      <div key={subject} className="space-y-1">
                        <div className="font-medium text-red-200">{subject}</div>
                        <div className="flex flex-wrap gap-1">
                          {(activeStudent.subjects.courses[subject] || []).map((course) => (
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
                {activeStudent.subjects.extended.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Extended Subjects</h3>
                    <div className="space-y-2">
                      {activeStudent.subjects.extended.map((subject) => (
                        <div key={subject} className="space-y-1">
                          <div className="font-medium text-red-200">{subject}</div>
                          <div className="flex flex-wrap gap-1">
                            {(activeStudent.subjects.courses[subject] || []).map((course) => (
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
                      {activeStudent.activities
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

                  {activeStudent.customActivities.length > 0 && (
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
