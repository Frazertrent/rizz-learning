"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  BookOpen,
  Calendar,
  CheckCircle,
  CheckCircle2,
  Clock,
  Filter,
  Flag,
  Search,
  Upload,
  ArrowLeft,
  AlertCircle,
  MessageSquare,
  MessageCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { AddNoteModal, type Note } from "./add-note-modal"

// Mock data for assignments
const mockAssignments = [
  {
    id: "1",
    title: "Essay: Causes of World War I",
    subject: "History",
    type: "Essay",
    dueDate: new Date(2025, 3, 20),
    dueTime: "11:59 PM",
    description: "Write a 500-word essay on the primary causes of World War I.",
    status: "not-started",
    priority: "high",
    completed: false,
    hasSubmission: false,
    hasFeedback: false,
    relatedGoal: "Improve historical analysis skills",
  },
  {
    id: "2",
    title: "Math Worksheet #5",
    subject: "Math",
    type: "Worksheet",
    dueDate: new Date(2025, 3, 18),
    dueTime: "3:30 PM",
    description: "Complete problems 1-20 on quadratic equations.",
    status: "in-progress",
    priority: "medium",
    completed: false,
    hasSubmission: false,
    hasFeedback: false,
    relatedGoal: null,
  },
  {
    id: "3",
    title: "Lab Report: Photosynthesis",
    subject: "Science",
    type: "Lab Report",
    dueDate: new Date(2025, 3, 22),
    dueTime: "11:59 PM",
    description: "Write up your findings from the photosynthesis experiment.",
    status: "not-started",
    priority: "high",
    completed: false,
    hasSubmission: false,
    hasFeedback: false,
    relatedGoal: "Complete all science labs with A grade",
  },
  {
    id: "4",
    title: "Book Report: To Kill a Mockingbird",
    subject: "English",
    type: "Book Report",
    dueDate: new Date(2025, 3, 25),
    dueTime: "11:59 PM",
    description: "Write a 3-page report analyzing the main themes of the novel.",
    status: "in-progress",
    priority: "medium",
    completed: false,
    hasSubmission: false,
    hasFeedback: false,
    relatedGoal: null,
  },
  {
    id: "5",
    title: "Spanish Vocabulary Quiz",
    subject: "Languages",
    type: "Quiz",
    dueDate: new Date(), // Today
    dueTime: "9:00 AM",
    description: "Study the vocabulary list for Chapter 5.",
    status: "not-started",
    priority: "low",
    completed: false,
    hasSubmission: false,
    hasFeedback: false,
    relatedGoal: null,
  },
  {
    id: "6",
    title: "Art Project: Self Portrait",
    subject: "Art",
    type: "Project",
    dueDate: new Date(2025, 3, 28),
    dueTime: "3:30 PM",
    description: "Create a self-portrait using the medium of your choice.",
    status: "in-progress",
    priority: "medium",
    completed: false,
    hasSubmission: false,
    hasFeedback: false,
    relatedGoal: "Develop artistic portfolio",
  },
  {
    id: "7",
    title: "Geography Map Quiz",
    subject: "Geography",
    type: "Quiz",
    dueDate: new Date(2025, 3, 19),
    dueTime: "10:30 AM",
    description: "Label all countries in South America on the provided map.",
    status: "completed",
    priority: "medium",
    completed: true,
    completedDate: new Date(2025, 3, 18),
    hasSubmission: true,
    hasFeedback: true,
    relatedGoal: null,
  },
  {
    id: "8",
    title: "Music Theory Worksheet",
    subject: "Music",
    type: "Worksheet",
    dueDate: new Date(2025, 3, 21),
    dueTime: "2:00 PM",
    description: "Complete the worksheet on major and minor scales.",
    status: "completed",
    priority: "low",
    completed: true,
    completedDate: new Date(2025, 3, 20),
    hasSubmission: true,
    hasFeedback: true,
    relatedGoal: "Learn to play three new songs",
  },
  {
    id: "9",
    title: "Algebra Quiz",
    subject: "Math",
    type: "Quiz",
    dueDate: new Date(), // Today
    dueTime: "11:30 AM",
    description: "Chapter 7 quiz on algebraic expressions.",
    status: "overdue",
    priority: "high",
    completed: false,
    hasSubmission: false,
    hasFeedback: false,
    relatedGoal: "Improve math grade to A",
  },
  {
    id: "10",
    title: "Science Vocabulary",
    subject: "Science",
    type: "Worksheet",
    dueDate: new Date(), // Today
    dueTime: "1:00 PM",
    description: "Complete the vocabulary worksheet for Chapter 8.",
    status: "overdue",
    priority: "medium",
    completed: false,
    hasSubmission: false,
    hasFeedback: false,
    relatedGoal: null,
  },
]

// Mock data for notes
const mockNotes: Note[] = [
  {
    id: "note1",
    assignmentId: "1",
    title: "Question about essay format",
    body: "Should this essay follow MLA or APA format? The instructions weren't clear about which citation style to use.",
    tag: "question",
    createdAt: new Date(2025, 3, 15, 14, 30),
    studentId: "student1",
    studentName: "Alex Johnson",
  },
  {
    id: "note2",
    assignmentId: "9",
    body: "I'm having trouble with the algebraic expressions in Chapter 7. Could we go over this during our next session?",
    tag: "question",
    createdAt: new Date(2025, 3, 16, 9, 15),
    studentId: "student1",
    studentName: "Alex Johnson",
  },
]

// Subject colors for visual distinction
const subjectColors = {
  Math: "from-blue-400 to-blue-600 text-white",
  Science: "from-green-400 to-green-600 text-white",
  English: "from-purple-400 to-purple-600 text-white",
  History: "from-amber-400 to-amber-600 text-white",
  Art: "from-pink-400 to-pink-600 text-white",
  Music: "from-indigo-400 to-indigo-600 text-white",
  Languages: "from-teal-400 to-teal-600 text-white",
  Geography: "from-orange-400 to-orange-600 text-white",
  "Physical Education": "from-red-400 to-red-600 text-white",
}

// Subject dot colors
const subjectDotColors = {
  Math: "bg-blue-500",
  Science: "bg-green-500",
  English: "bg-purple-500",
  History: "bg-amber-500",
  Art: "bg-pink-500",
  Music: "bg-indigo-500",
  Languages: "bg-teal-500",
  Geography: "bg-orange-500",
  "Physical Education": "bg-red-500",
}

// Status colors and labels
const statusConfig = {
  "not-started": {
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    label: "Not Started",
  },
  "in-progress": {
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    label: "In Progress",
  },
  completed: {
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    label: "Completed",
  },
  overdue: {
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    label: "Overdue",
  },
}

// Priority colors
const priorityConfig = {
  high: {
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800",
    label: "High",
  },
  medium: {
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800",
    label: "Medium",
  },
  low: {
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800",
    label: "Low",
  },
}

// Get assignments due today
const getDueToday = (assignments) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return assignments.filter((assignment) => {
    const dueDate = new Date(assignment.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate.getTime() === today.getTime() && !assignment.completed
  })
}

// Get assignments due this week
const getDueThisWeek = (assignments) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const endOfWeek = new Date(today)
  endOfWeek.setDate(today.getDate() + (6 - today.getDay()))
  endOfWeek.setHours(23, 59, 59, 999)

  return assignments.filter((assignment) => {
    const dueDate = new Date(assignment.dueDate)
    return dueDate > today && dueDate <= endOfWeek && !assignment.completed
  })
}

// Get overdue assignments
const getOverdue = (assignments) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return assignments.filter((assignment) => {
    const dueDate = new Date(assignment.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate < today && !assignment.completed
  })
}

// In the groupBySubject function, ensure we're properly grouping assignments
const groupBySubject = (assignments) => {
  const grouped = {}

  assignments.forEach((assignment) => {
    if (!grouped[assignment.subject]) {
      grouped[assignment.subject] = []
    }
    grouped[assignment.subject].push(assignment)
  })

  // Sort subjects alphabetically
  return Object.keys(grouped)
    .sort()
    .reduce((obj, key) => {
      obj[key] = grouped[key]
      return obj
    }, {})
}

// Get upcoming tests (quizzes and tests in the next two weeks)
const getUpcomingTests = () => {
  const today = new Date()
  const twoWeeksFromNow = new Date()
  twoWeeksFromNow.setDate(today.getDate() + 14)

  return mockAssignments.filter((assignment) => {
    const dueDate = new Date(assignment.dueDate)
    return (
      dueDate > today &&
      dueDate <= twoWeeksFromNow &&
      !assignment.completed &&
      (assignment.type.toLowerCase().includes("quiz") || assignment.type.toLowerCase().includes("test"))
    )
  })
}

// Calculate days until a date
const getDaysUntil = (date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const targetDate = new Date(date)
  targetDate.setHours(0, 0, 0, 0)

  const diffTime = Math.abs(targetDate - today)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

export function Assignments() {
  const [assignments, setAssignments] = useState(mockAssignments)
  const [notes, setNotes] = useState<Note[]>(mockNotes)
  const [searchQuery, setSearchQuery] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  // Change the default timeFilter from "all" to "week"
  const [timeFilter, setTimeFilter] = useState("week")
  const [showConfetti, setShowConfetti] = useState(false)
  const [completedAssignmentId, setCompletedAssignmentId] = useState(null)
  const [progressValue, setProgressValue] = useState(0)
  const [noteModalOpen, setNoteModalOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)

  // Add a ref for the Daily View section after the useState declarations
  const dailyViewRef = useRef(null)
  const timeFilterRef = useRef(null)

  // Calculate completion stats
  const activeAssignments = assignments.filter((a) => !a.completed)
  const completedAssignments = assignments.filter((a) => a.completed)
  const totalAssignments = assignments.length
  let completionPercentage = Math.round((completedAssignments.length / totalAssignments) * 100)

  // Get assignments due today
  const assignmentsDueToday = getDueToday(assignments)

  // Animate progress bar on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressValue(completionPercentage)
    }, 300)
    return () => clearTimeout(timer)
  }, [completionPercentage])

  // Filter assignments based on search query and filters
  let filteredActiveAssignments = activeAssignments.filter((assignment) => {
    // Search filter
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.type.toLowerCase().includes(searchQuery.toLowerCase())

    // Subject filter
    const matchesSubject = subjectFilter === "all" || assignment.subject.toLowerCase() === subjectFilter.toLowerCase()

    // Time filter
    let matchesTime = true
    if (timeFilter === "today") {
      matchesTime = getDueToday([assignment]).length > 0
    } else if (timeFilter === "week") {
      matchesTime = getDueThisWeek([assignment]).length > 0
    } else if (timeFilter === "overdue") {
      matchesTime = getOverdue([assignment]).length > 0
    }

    return matchesSearch && matchesSubject && matchesTime
  })

  const filteredCompletedAssignments = completedAssignments.filter((assignment) => {
    // Search filter
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.type.toLowerCase().includes(searchQuery.toLowerCase())

    // Subject filter
    const matchesSubject = subjectFilter === "all" || assignment.subject.toLowerCase() === subjectFilter.toLowerCase()

    return matchesSearch && matchesSubject
  })

  // Group assignments by subject
  const groupedActiveAssignments = groupBySubject(filteredActiveAssignments)
  const groupedCompletedAssignments = groupBySubject(filteredCompletedAssignments)

  // Mark assignment as complete
  const markAsComplete = (id) => {
    setAssignments(
      assignments.map((assignment) => {
        if (assignment.id === id) {
          setCompletedAssignmentId(id)
          setShowConfetti(true)

          // Hide confetti after 3 seconds
          setTimeout(() => {
            setShowConfetti(false)
            setCompletedAssignmentId(null)
          }, 3000)

          return {
            ...assignment,
            status: "completed",
            completed: true,
            completedDate: new Date(),
          }
        }
        return assignment
      }),
    )
  }

  // Get unique subjects for filter
  const subjects = ["all", ...new Set(assignments.map((a) => a.subject))].sort()

  // Format today's date for the Daily View
  const formattedTodayDate = format(new Date(), "EEEE, MMMM d")

  const handleViewDailyBreakdown = () => {
    // Set the filter to "today"
    setTimeFilter("today")

    // Add a small delay to ensure the UI updates
    setTimeout(() => {
      // Highlight the "Due Today" filter briefly
      if (timeFilterRef.current) {
        // Add a temporary style for the highlight effect
        timeFilterRef.current.style.boxShadow = "0 0 0 4px rgba(99, 102, 241, 0.4)"
        timeFilterRef.current.style.transition = "box-shadow 0.3s ease-in-out"

        // Remove the highlight after animation completes
        setTimeout(() => {
          if (timeFilterRef.current) {
            timeFilterRef.current.style.boxShadow = "none"
          }
        }, 1500)
      }
    }, 100)
  }

  // Function to get the appropriate heading based on time filter
  const getFilterHeading = () => {
    switch (timeFilter) {
      case "today":
        return `Assignments Due Today – ${formattedTodayDate}`
      case "week":
        return "Assignments Due This Week"
      case "overdue":
        return "Overdue Assignments"
      default:
        return "All Active Assignments"
    }
  }

  // Calculate completion stats based on current filters
  const getFilteredAssignments = () => {
    let filteredAssignments = [...assignments]

    // Apply time filter
    if (timeFilter === "today") {
      filteredAssignments = getDueToday(filteredAssignments)
    } else if (timeFilter === "week") {
      filteredAssignments = getDueThisWeek(filteredAssignments)
    } else if (timeFilter === "overdue") {
      filteredAssignments = getOverdue(filteredAssignments)
    }

    // Apply subject filter
    if (subjectFilter !== "all") {
      filteredAssignments = filteredAssignments.filter(
        (assignment) => assignment.subject.toLowerCase() === subjectFilter.toLowerCase(),
      )
    }

    return filteredAssignments
  }

  // Get filtered assignments based on current filters
  const filteredAssignments = getFilteredAssignments()
  const activeFilteredAssignments = filteredAssignments.filter((a) => !a.completed)
  const completedFilteredAssignments = filteredAssignments.filter((a) => a.completed)
  const totalFilteredAssignments = filteredAssignments.length
  completionPercentage =
    totalFilteredAssignments > 0
      ? Math.round((completedFilteredAssignments.length / totalFilteredAssignments) * 100)
      : 0

  // Handle opening the note modal
  const handleOpenNoteModal = (assignment) => {
    setSelectedAssignment(assignment)
    setNoteModalOpen(true)
  }

  // Handle saving a new note
  const handleSaveNote = (noteData) => {
    const newNote: Note = {
      id: `note${notes.length + 1}`,
      assignmentId: noteData.assignmentId,
      title: noteData.title,
      body: noteData.body,
      tag: noteData.tag,
      attachment: noteData.attachment,
      createdAt: new Date(),
      studentId: "student1", // In a real app, this would come from auth
      studentName: "Alex Johnson", // In a real app, this would come from auth
    }

    setNotes([...notes, newNote])
  }

  // Get notes for a specific assignment
  const getAssignmentNotes = (assignmentId) => {
    return notes.filter((note) => note.assignmentId === assignmentId)
  }

  // Check if an assignment has notes
  const hasNotes = (assignmentId) => {
    return notes.some((note) => note.assignmentId === assignmentId)
  }

  // Animate progress bar on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressValue(completionPercentage)
    }, 300)
    return () => clearTimeout(timer)
  }, [completionPercentage, timeFilter, subjectFilter])

  // Filter assignments based on search query and filters
  filteredActiveAssignments = activeAssignments.filter((assignment) => {
    // Search filter
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.type.toLowerCase().includes(searchQuery.toLowerCase())

    // Subject filter
    const matchesSubject = subjectFilter === "all" || assignment.subject.toLowerCase() === subjectFilter.toLowerCase()

    // Time filter
    let matchesTime = true
    if (timeFilter === "today") {
      matchesTime = getDueToday([assignment]).length > 0
    } else if (timeFilter === "week") {
      matchesTime = getDueThisWeek([assignment]).length > 0
    } else if (timeFilter === "overdue") {
      matchesTime = getOverdue([assignment]).length > 0
    }

    return matchesSearch && matchesSubject && matchesTime
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 opacity-10 rounded-3xl"></div>
          <div className="relative p-6 rounded-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-transparent bg-clip-text">
              Assignments
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
              Track, complete, and submit your assignments
            </p>
          </div>
        </div>
      </motion.div>

      {/* Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6"
      >
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <h3 className="text-xl font-bold flex items-center">
                  <CheckCircle2 className="mr-2 h-5 w-5 text-blue-500" />
                  Assignment Progress
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  You've completed {completedFilteredAssignments.length} of {totalFilteredAssignments} assignments{" "}
                  <span className="text-gray-400 dark:text-gray-500 italic">
                    (
                    {timeFilter === "today"
                      ? "Today"
                      : timeFilter === "week"
                        ? "This Week"
                        : timeFilter === "overdue"
                          ? "Overdue"
                          : "All Time"}
                    )
                  </span>
                </p>
              </div>
              <div className="flex space-x-2 mt-4 md:mt-0">
                <Link href="/student/uploads">
                  <Button className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Work
                  </Button>
                </Link>
                <Link href="/student/schedule">
                  <Button variant="outline" className="rounded-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule
                  </Button>
                </Link>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-blue-100 dark:bg-blue-950/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progressValue}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-blue-700 dark:text-blue-300">{completionPercentage}% Complete</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {completedFilteredAssignments.length}/{totalFilteredAssignments} Assignments
                </span>
              </div>
            </div>
            <div className="flex justify-end mt-2">
              {timeFilter !== "today" ? (
                <Button
                  variant="link"
                  size="sm"
                  className="text-xs text-gray-500 hover:text-blue-500 p-0"
                  onClick={handleViewDailyBreakdown}
                >
                  View Daily Breakdown
                </Button>
              ) : (
                <Button
                  variant="link"
                  size="sm"
                  className="text-xs text-gray-500 hover:text-blue-500 p-0"
                  onClick={() => setTimeFilter("week")}
                >
                  View Weekly Breakdown
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search and filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-5"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search assignments..."
              className="pl-9 rounded-full border-gray-200 dark:border-gray-700 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-[150px] rounded-full">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject === "all" ? "All Subjects" : subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[150px] rounded-full" ref={timeFilterRef}>
                <SelectValue placeholder="Due Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Due Today</SelectItem>
                <SelectItem value="week">Due This Week</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Dynamic Assignment View based on timeFilter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Card className="overflow-hidden border-none shadow-md bg-gray-50 dark:bg-gray-900/50 rounded-xl">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{getFilterHeading()}</h2>
                {timeFilter === "week" && (
                  <p className="text-gray-500 dark:text-gray-400">
                    {format(new Date(), "MMMM d")} -{" "}
                    {format(new Date(new Date().setDate(new Date().getDate() + 6)), "MMMM d, yyyy")}
                  </p>
                )}
              </div>
              {timeFilter === "today" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  onClick={() => setTimeFilter("week")}
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  View Full Week
                </Button>
              )}
            </div>
          </CardHeader>
          {timeFilter === "week" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mb-4"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-2">
                  <span className="text-lg font-medium flex items-center">
                    <span className="mr-2">📚</span> Weekly Progress: {completedFilteredAssignments.length} of{" "}
                    {totalFilteredAssignments} assignments completed
                  </span>
                </div>
                <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progressValue}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>
          )}
          <CardContent className="pt-2">
            {activeFilteredAssignments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-medium mb-2">
                  {timeFilter === "today"
                    ? "✅ All caught up for today!"
                    : timeFilter === "overdue"
                      ? "No overdue assignments"
                      : "No assignments found"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  {timeFilter === "today"
                    ? "No assignments are due right now. Enjoy your free time!"
                    : subjectFilter !== "all"
                      ? "No assignments found for this subject and date range."
                      : "You're all caught up with your assignments!"}
                </p>
              </div>
            ) : timeFilter === "today" ? (
              // Daily View - Compact list format
              <div className="space-y-2">
                {activeFilteredAssignments.map((assignment) => {
                  const isOverdue = new Date(assignment.dueDate) < new Date() && !assignment.completed
                  const dotColor = subjectDotColors[assignment.subject] || "bg-gray-500"
                  const assignmentNoteCount = getAssignmentNotes(assignment.id).length

                  return (
                    <motion.div
                      key={assignment.id}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                      className="group"
                    >
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-900/95 hover:bg-gray-800 text-white transition-colors">
                        <div className="flex items-center space-x-3 overflow-hidden">
                          <div className={`w-3 h-3 rounded-full ${dotColor}`}></div>
                          <div className="font-medium truncate max-w-[120px] sm:max-w-none">
                            [{assignment.subject}] {assignment.title}
                            {assignmentNoteCount > 0 && (
                              <span className="ml-2 text-xs bg-blue-600 px-1.5 py-0.5 rounded-full">
                                {assignmentNoteCount} note{assignmentNoteCount > 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-gray-300">
                            <Clock className="h-3.5 w-3.5 mr-1.5" />
                            <span className={isOverdue ? "text-red-400" : ""}>{assignment.dueTime || "11:59 PM"}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="rounded-full bg-gray-800 hover:bg-gray-700 text-white"
                              onClick={() => handleOpenNoteModal(assignment)}
                            >
                              <MessageSquare className="h-3 w-3 mr-1.5" />
                              Add a Note
                            </Button>
                            <Link href={`/student/uploads?subject=${assignment.subject}&assignment=${assignment.id}`}>
                              <Button size="sm" className="rounded-full bg-pink-600 hover:bg-pink-700 text-white">
                                <Upload className="h-3 w-3 mr-1.5" />
                                Upload Work
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              // Weekly/All/Overdue View - Card grid format
              <div className="space-y-8">
                {Object.entries(groupBySubject(activeFilteredAssignments)).map(([subject, subjectAssignments]) => (
                  <motion.div
                    key={subject}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold">{subject}</h3>
                      <div className="h-px flex-grow bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700"></div>
                      <Badge variant="outline" className="rounded-full">
                        {subjectAssignments.length} {subjectAssignments.length === 1 ? "Assignment" : "Assignments"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {subjectAssignments.map((assignment) => {
                        const dueDate = new Date(assignment.dueDate)
                        const isOverdue = dueDate < new Date() && !assignment.completed
                        const subjectColor = subjectColors[assignment.subject] || "from-gray-400 to-gray-600 text-white"
                        const statusConfig = getStatusConfig(assignment)
                        const priorityConfig = getPriorityConfig(assignment.priority)
                        const assignmentNoteCount = getAssignmentNotes(assignment.id).length

                        return (
                          <motion.div
                            key={assignment.id}
                            whileHover={{ y: -4 }}
                            transition={{ duration: 0.2 }}
                            className={`relative ${completedAssignmentId === assignment.id ? "z-10" : ""}`}
                          >
                            {/* Confetti animation when marked complete */}
                            {showConfetti && completedAssignmentId === assignment.id && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-10 pointer-events-none"
                              >
                                <div className="absolute top-0 left-1/4 w-2 h-2 rounded-full bg-yellow-500 animate-confetti-1"></div>
                                <div className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-blue-500 animate-confetti-2"></div>
                                <div className="absolute top-0 left-3/4 w-2 h-2 rounded-full bg-pink-500 animate-confetti-3"></div>
                                <div className="absolute top-0 left-1/3 w-3 h-3 rounded-full bg-purple-500 animate-confetti-4"></div>
                                <div className="absolute top-0 left-2/3 w-3 h-3 rounded-full bg-green-500 animate-confetti-5"></div>
                                <div className="absolute top-0 left-1/5 w-2 h-2 rounded-full bg-red-500 animate-confetti-6"></div>
                              </motion.div>
                            )}

                            <Card
                              className={`overflow-hidden shadow-md hover:shadow-lg transition-all rounded-xl border ${
                                isOverdue
                                  ? "border-red-200 dark:border-red-800"
                                  : "border-gray-100 dark:border-gray-800"
                              }`}
                            >
                              <div className={`h-2 bg-gradient-to-r ${subjectColor}`}></div>
                              <CardHeader className="p-4 pb-0">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-bold text-lg line-clamp-1">
                                      {assignment.title}
                                      {assignmentNoteCount > 0 && (
                                        <span className="ml-2 text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                                          {assignmentNoteCount} note{assignmentNoteCount > 1 ? "s" : ""}
                                        </span>
                                      )}
                                    </h3>
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                                      <span className="mr-2">{assignment.subject}</span>
                                      <Badge variant="outline" className="text-xs rounded-full">
                                        {assignment.type}
                                      </Badge>
                                    </div>
                                  </div>
                                  <Badge className={`${priorityConfig.color} rounded-full text-xs`}>
                                    <Flag className="h-3 w-3 mr-1" />
                                    {priorityConfig.label}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="p-4 pt-3 pb-2">
                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                                  {assignment.description}
                                </p>
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div className="flex items-center text-sm">
                                    <Clock
                                      className={`h-3.5 w-3.5 mr-1 ${isOverdue ? "text-red-500" : "text-gray-400"}`}
                                    />
                                    <span
                                      className={
                                        isOverdue
                                          ? "text-red-500 dark:text-red-400 font-medium"
                                          : "text-gray-500 dark:text-gray-400"
                                      }
                                    >
                                      Due: {format(dueDate, "MMM d, yyyy")}
                                    </span>
                                  </div>
                                  <Badge className={`${statusConfig.color} text-xs rounded-full`}>
                                    {statusConfig.label}
                                  </Badge>
                                </div>
                              </CardContent>
                              <CardFooter className="p-4 pt-2 flex flex-wrap gap-2">
                                <Link
                                  href={`/student/uploads?subject=${assignment.subject}&assignment=${assignment.id}`}
                                  className="flex-1"
                                >
                                  <Button
                                    variant="default"
                                    size="sm"
                                    className="w-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all hover:scale-105"
                                  >
                                    <Upload className="h-3.5 w-3.5 mr-1.5" />
                                    Upload
                                  </Button>
                                </Link>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 rounded-full bg-gray-900 hover:bg-gray-800 text-white border-gray-700 transition-all hover:scale-105"
                                  onClick={() => handleOpenNoteModal(assignment)}
                                >
                                  <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                                  Add a Note
                                </Button>
                                <Link
                                  href={`/student/chat?context=${encodeURIComponent(assignment.title)}`}
                                  className="flex-1"
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-pink-700 transition-all hover:scale-105"
                                  >
                                    <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                                    Ask GPT
                                  </Button>
                                </Link>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0 pb-4 flex justify-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {activeFilteredAssignments.length > 0 && timeFilter === "today" && (
                <div className="flex items-center">
                  <AlertCircle className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
                  <span>Complete these assignments before their due time</span>
                </div>
              )}
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Upcoming Tests Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8"
      >
        <Card className="overflow-hidden border-none shadow-md bg-gray-50 dark:bg-gray-900/50 rounded-xl">
          <CardHeader className="pb-2">
            <h2 className="text-2xl font-bold flex items-center">
              <span className="mr-2">📅</span> Upcoming Tests
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Prepare for these upcoming quizzes and tests</p>
          </CardHeader>
          <CardContent className="pt-2">
            {getUpcomingTests().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getUpcomingTests().map((test) => {
                  const dueDate = new Date(test.dueDate)
                  const subjectColor = subjectColors[test.subject] || "from-gray-400 to-gray-600 text-white"

                  return (
                    <motion.div key={test.id} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                      <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all rounded-xl border border-amber-100 dark:border-amber-900/50">
                        <div className={`h-2 bg-gradient-to-r ${subjectColor}`}></div>
                        <CardHeader className="p-4 pb-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg line-clamp-1">
                                {test.title}
                                <Badge
                                  variant="outline"
                                  className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                                >
                                  {test.type}
                                </Badge>
                              </h3>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <span className="mr-2">{test.subject}</span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-3 pb-2">
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                            {test.description}
                          </p>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center text-sm">
                              <Clock className="h-3.5 w-3.5 mr-1 text-amber-500" />
                              <span className="text-amber-600 dark:text-amber-400 font-medium">
                                {format(dueDate, "MMM d, yyyy")} at {test.dueTime}
                              </span>
                            </div>
                            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 text-xs rounded-full">
                              In {getDaysUntil(dueDate)} days
                            </Badge>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-2 flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-amber-700 transition-all hover:scale-105"
                          >
                            <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                            Study
                          </Button>
                          <Link
                            href={`/student/chat?context=${encodeURIComponent(`Help me prepare for my ${test.title} in ${test.subject}`)}`}
                            className="flex-1"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-pink-700 transition-all hover:scale-105"
                            >
                              <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                              Ask GPT
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No upcoming tests</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  You don't have any tests or quizzes scheduled for the next two weeks.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Note Modal */}
      {selectedAssignment && (
        <AddNoteModal
          isOpen={noteModalOpen}
          onClose={() => setNoteModalOpen(false)}
          onSave={handleSaveNote}
          assignmentId={selectedAssignment.id}
          assignmentTitle={selectedAssignment.title}
        />
      )}
    </div>
  )
}

// Helper function to get status configuration
function getStatusConfig(assignment) {
  if (assignment.completed) {
    return {
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      label: "Completed",
    }
  }

  const dueDate = new Date(assignment.dueDate)
  const isOverdue = dueDate < new Date()

  if (isOverdue) {
    return {
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      label: "Overdue",
    }
  }

  return {
    color:
      assignment.status === "in-progress"
        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    label: assignment.status === "in-progress" ? "In Progress" : "Not Started",
  }
}

// Helper function to get priority configuration
function getPriorityConfig(priority) {
  switch (priority) {
    case "high":
      return {
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        label: "High",
      }
    case "medium":
      return {
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        label: "Medium",
      }
    case "low":
      return {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        label: "Low",
      }
    default:
      return {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
        label: "Normal",
      }
  }
}
