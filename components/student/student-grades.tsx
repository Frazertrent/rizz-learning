"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
  BookOpenIcon,
  TrendingUpIcon,
  FolderIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  ZapIcon,
  SearchIcon,
  CalendarIcon,
  ListIcon,
  GridIcon,
} from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const subjects = [
  {
    id: 1,
    name: "Mathematics",
    grade: "A",
    percentage: 92,
    color: "from-blue-400 to-blue-600",
    xp: 450,
    streak: 5,
    improved: false,
  },
  {
    id: 2,
    name: "Science",
    grade: "B+",
    percentage: 87,
    color: "from-green-400 to-green-600",
    xp: 380,
    streak: 3,
    improved: true,
    previousGrade: "C+",
  },
  {
    id: 3,
    name: "English",
    grade: "A-",
    percentage: 90,
    color: "from-purple-400 to-purple-600",
    xp: 420,
    streak: 0,
    improved: false,
  },
  {
    id: 4,
    name: "History",
    grade: "C",
    percentage: 75,
    color: "from-amber-400 to-amber-600",
    xp: 350,
    streak: 0,
    improved: false,
  },
  {
    id: 5,
    name: "Art",
    grade: "A+",
    percentage: 100,
    color: "from-pink-400 to-pink-600",
    xp: 500,
    streak: 8,
    improved: true,
    previousGrade: "A",
  },
]

const assignments = [
  {
    id: 1,
    name: "Math Quiz 3",
    subject: "Mathematics",
    grade: "A",
    percentage: 95,
    dueDate: "2025-04-15",
    submitted: true,
    submissionDate: "2025-04-14",
  },
  {
    id: 2,
    name: "Science Lab Report",
    subject: "Science",
    grade: "B+",
    percentage: 88,
    dueDate: "2025-04-10",
    submitted: true,
    submissionDate: "2025-04-09",
  },
  {
    id: 3,
    name: "English Essay",
    subject: "English",
    grade: "A-",
    percentage: 91,
    dueDate: "2025-04-18",
    submitted: true,
    submissionDate: "2025-04-17",
  },
  {
    id: 4,
    name: "History Research Paper",
    subject: "History",
    grade: "",
    percentage: 0,
    dueDate: "2025-04-05", // Past due
    submitted: true,
    submissionDate: "2025-04-05",
  },
  {
    id: 5,
    name: "Art Project",
    subject: "Art",
    grade: "",
    percentage: 0,
    dueDate: "2025-04-25",
    submitted: true,
    submissionDate: "2025-04-20",
  },
  {
    id: 6,
    name: "Math Homework 5",
    subject: "Mathematics",
    grade: "B",
    percentage: 85,
    dueDate: "2025-04-08", // Past due
    submitted: false,
    submissionDate: "",
  },
  {
    id: 7,
    name: "Science Quiz",
    subject: "Science",
    grade: "",
    percentage: 0,
    dueDate: "2025-04-30",
    submitted: false,
    submissionDate: "",
  },
]

// Generate activity heatmap data
const generateHeatmapData = () => {
  const today = new Date()
  const data = []

  for (let i = 0; i < 35; i++) {
    const date = new Date()
    date.setDate(today.getDate() - i)

    // Random count between 0-3
    const count = Math.floor(Math.random() * 4)

    data.push({
      date: date.toISOString().split("T")[0],
      count,
    })
  }

  return data.reverse()
}

const heatmapData = generateHeatmapData()

// Circular Progress Ring Component
const CircularProgress = ({ percentage, color, size = 120, strokeWidth = 8, children, isExcellent = false }) => {
  const [progress, setProgress] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(percentage)
    }, 300)
    return () => clearTimeout(timer)
  }, [percentage])

  return (
    <div className={`relative ${isExcellent ? "animate-pulse-slow" : ""}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-800"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`bg-gradient-to-r ${color}`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
      {isExcellent && (
        <div className="absolute inset-0 rounded-full border-2 border-yellow-400 animate-pulse-glow"></div>
      )}
    </div>
  )
}

// Activity Heatmap Component
const ActivityHeatmap = ({ data }) => {
  const maxCount = Math.max(...data.map((d) => d.count))

  return (
    <div className="grid grid-cols-7 gap-1">
      {data.map((day, index) => {
        const intensity = day.count === 0 ? 0 : (day.count / maxCount) * 100
        const bgClass =
          intensity === 0
            ? "bg-gray-200 dark:bg-gray-800"
            : intensity < 33
              ? "bg-purple-200 dark:bg-purple-900"
              : intensity < 66
                ? "bg-purple-400 dark:bg-purple-700"
                : "bg-purple-600 dark:bg-purple-500"

        return (
          <div
            key={index}
            className={`w-full aspect-square rounded-sm ${bgClass} cursor-pointer transition-all hover:scale-110`}
            title={`${new Date(day.date).toLocaleDateString()}: ${day.count} submission${day.count !== 1 ? "s" : ""}`}
          />
        )
      })}
    </div>
  )
}

// XP Progress Bar Component
const XpProgressBar = ({ current, target }) => {
  const percentage = Math.min((current / target) * 100, 100)

  return (
    <div className="relative w-full h-6 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
        initial={{ width: "0%" }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
        {current} / {target} XP
      </div>
    </div>
  )
}

export function StudentGrades() {
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [activeTab, setActiveTab] = useState("subjects")
  const [visibleAssignments, setVisibleAssignments] = useState(5)
  const [assignmentFilter, setAssignmentFilter] = useState("all")
  const [viewMode, setViewMode] = useState("table")

  // Calculate total XP
  const totalXp = subjects.reduce((sum, subject) => sum + subject.xp, 0)
  const targetXp = 2000
  const level = Math.floor(totalXp / 500) + 1

  // Count pending review assignments
  const pendingReviewCount = assignments.filter((a) => a.submitted && a.grade === "").length

  // Filter assignments based on selected subject and filter
  const getFilteredAssignments = () => {
    let filtered = assignments

    // Filter by subject
    if (selectedSubject !== "all") {
      filtered = filtered.filter(
        (assignment) => assignment.subject === subjects.find((s) => s.id.toString() === selectedSubject)?.name,
      )
    }

    // Apply status filter
    switch (assignmentFilter) {
      case "graded":
        filtered = filtered.filter((a) => a.submitted && a.grade !== "")
        break
      case "ungraded":
        filtered = filtered.filter((a) => a.submitted && a.grade === "")
        break
      case "pastdue":
        filtered = filtered.filter((a) => new Date(a.dueDate) < new Date() && !a.submitted)
        break
    }

    return filtered
  }

  const filteredAssignments = getFilteredAssignments()

  // Handle subject card click
  const handleSubjectClick = (subjectId) => {
    setSelectedSubject(subjectId.toString())
    setActiveTab("assignments")
  }

  // Check if assignment is past due
  const isPastDue = (dueDate) => {
    return new Date(dueDate) < new Date()
  }

  // Show more assignments
  const handleShowMore = () => {
    setVisibleAssignments((prev) => prev + 5)
  }

  // Scroll to assignments section
  const scrollToAssignments = () => {
    setActiveTab("assignments")
    document.getElementById("assignments-section")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-transparent bg-clip-text">
          My Grades
        </h1>
        <p className="text-muted-foreground">Track your progress and achievements</p>
      </motion.div>

      {/* New 2x2 Grid of Action Tiles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid gap-6 md:grid-cols-2"
      >
        {/* Tile 1: Grades by Subject */}
        <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/40 dark:to-indigo-900/30 rounded-xl hover:shadow-xl transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <span className="mr-2">📘</span> Grades by Subject
            </CardTitle>
            <CardDescription>Track your current grade and XP in each subject.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subjects.slice(0, 3).map((subject) => (
                <div
                  key={subject.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/60 dark:bg-gray-800/60 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-r ${subject.color}`}
                    >
                      {subject.grade}
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">{subject.name}</div>
                      <div className="text-xs text-muted-foreground">{subject.percentage}%</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200 mr-2">
                      <ZapIcon className="h-3 w-3 mr-1" /> {subject.xp} XP
                    </Badge>
                  </div>
                </div>
              ))}
              {subjects.length > 3 && (
                <div className="text-center text-sm text-blue-600 dark:text-blue-400">
                  +{subjects.length - 3} more subjects
                </div>
              )}
              <Button
                onClick={scrollToAssignments}
                className="w-full mt-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
              >
                <FolderIcon className="h-4 w-4 mr-2" /> View Assignments
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tile 2: XP Earned This Term */}
        <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950/40 dark:to-pink-900/30 rounded-xl hover:shadow-xl transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <span className="mr-2">⚡</span> XP Earned This Term
            </CardTitle>
            <CardDescription>Your total progress this term.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 opacity-20 animate-pulse-slow"></div>
                <div className="z-10 text-center">
                  <div className="text-4xl font-bold">{totalXp}</div>
                  <div className="text-sm font-medium">Total XP</div>
                </div>
              </div>

              <div className="w-full space-y-2">
                <div className="flex justify-between items-center">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none">
                    Level {level}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Next: Level {level + 1}</span>
                </div>
                <XpProgressBar current={totalXp} target={targetXp} />
              </div>

              <Button
                asChild
                className="w-full mt-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Link href="/student/rewards">
                  <span className="mr-2">🎁</span> View Rewards
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tile 3: Assignments Needing Review */}
        <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/40 dark:to-orange-900/30 rounded-xl hover:shadow-xl transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <span className="mr-2">🔍</span> Assignments Needing Review
            </CardTitle>
            <CardDescription>These are waiting to be graded.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 opacity-20 animate-pulse-slow"></div>
                <div className="z-10 text-center">
                  <div className="text-5xl font-bold">{pendingReviewCount}</div>
                  <div className="text-sm font-medium">Pending</div>
                </div>
              </div>

              <div className="w-full space-y-2">
                <div className="flex flex-col space-y-1">
                  {assignments
                    .filter((a) => a.submitted && a.grade === "")
                    .slice(0, 2)
                    .map((a) => (
                      <div key={a.id} className="text-sm p-2 rounded-lg bg-white/60 dark:bg-gray-800/60">
                        {a.name} ({a.subject})
                      </div>
                    ))}
                </div>
              </div>

              <Button
                onClick={() => {
                  setAssignmentFilter("ungraded")
                  setActiveTab("assignments")
                  document.getElementById("assignments-section")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="w-full mt-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              >
                <SearchIcon className="h-4 w-4 mr-2" /> View All Pending
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tile 4: Assignment Activity Heatmap */}
        <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-blue-50 to-purple-100 dark:from-blue-950/40 dark:to-purple-900/30 rounded-xl hover:shadow-xl transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <span className="mr-2">📅</span> Assignment Activity Heatmap
            </CardTitle>
            <CardDescription>See when you're most productive.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>
              <ActivityHeatmap data={heatmapData} />

              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center space-x-1 text-xs">
                  <div className="w-3 h-3 rounded-sm bg-gray-200 dark:bg-gray-800"></div>
                  <span>0</span>
                  <div className="w-3 h-3 rounded-sm bg-purple-200 dark:bg-purple-900"></div>
                  <div className="w-3 h-3 rounded-sm bg-purple-400 dark:bg-purple-700"></div>
                  <div className="w-3 h-3 rounded-sm bg-purple-600 dark:bg-purple-500"></div>
                  <span>3+</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Current streak: <span className="font-bold text-purple-600">3 days</span>
                </div>
              </div>

              <Button
                onClick={() => {
                  setActiveTab("assignments")
                  document.getElementById("assignments-section")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="w-full mt-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              >
                <CalendarIcon className="h-4 w-4 mr-2" /> View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="subjects" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="subjects">
            <BookOpenIcon className="mr-2 h-4 w-4" />
            Subjects
          </TabsTrigger>
          <TabsTrigger value="assignments" id="assignments-section">
            <TrendingUpIcon className="mr-2 h-4 w-4" />
            Assignments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subjects" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="mr-2">📘</span> Subject Grades
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject, index) => {
                // Determine grade styling based on letter grade
                const isAPlus = subject.grade === "A+"
                const isAorAMinus = subject.grade === "A" || subject.grade === "A-"
                const isBorBPlus = subject.grade === "B+" || subject.grade === "B"
                const isC = subject.grade === "C" || subject.grade === "C+"
                const isLow = subject.grade === "D" || subject.grade === "F"

                // Set border and glow classes based on grade
                let borderClass = ""
                let glowClass = ""
                let animationClass = ""

                if (isAPlus) {
                  borderClass = "border-2 border-yellow-400"
                  glowClass = "shadow-lg shadow-yellow-300/50"
                  animationClass = "animate-pulse-glow-gold"
                } else if (isAorAMinus) {
                  borderClass = "border-2 border-blue-500"
                  glowClass = "shadow-md shadow-blue-400/40"
                  animationClass = "animate-pulse-subtle"
                } else if (isBorBPlus) {
                  borderClass = "border-2 border-teal-400"
                  glowClass = "shadow-sm shadow-teal-300/30"
                  animationClass = "animate-pulse-gentle"
                } else if (isC) {
                  borderClass = "border-2 border-orange-400"
                } else if (isLow) {
                  borderClass = "border-2 border-red-500"
                  glowClass = "shadow-md shadow-red-400/40"
                }

                return (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{
                      y: -5,
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                    className="cursor-pointer"
                  >
                    <Card
                      className={`overflow-hidden border-none shadow-md hover:shadow-lg transition-all rounded-xl relative ${borderClass} ${glowClass} ${animationClass}`}
                    >
                      {isAPlus && (
                        <div className="absolute inset-0 z-10 pointer-events-none confetti-container">
                          <div className="absolute top-5 left-5 w-3 h-3 rounded-full bg-yellow-400 animate-confetti-1"></div>
                          <div className="absolute top-5 right-10 w-2 h-2 rounded-full bg-purple-400 animate-confetti-2"></div>
                          <div className="absolute top-10 right-5 w-4 h-4 rounded-full bg-pink-400 animate-confetti-3"></div>
                          <div className="absolute top-20 left-10 w-3 h-3 rounded-full bg-blue-400 animate-confetti-4"></div>
                          <div className="absolute top-15 right-15 w-2 h-2 rounded-full bg-green-400 animate-confetti-5"></div>
                        </div>
                      )}

                      <CardContent className="pt-6 flex flex-col items-center">
                        <div className="mb-4 text-center">
                          <span
                            className={`text-5xl font-bold ${
                              isAPlus
                                ? "text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600"
                                : isAorAMinus
                                  ? "text-blue-600 dark:text-blue-400"
                                  : isBorBPlus
                                    ? "text-teal-600 dark:text-teal-400"
                                    : isC
                                      ? "text-orange-600 dark:text-orange-400"
                                      : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {subject.grade}
                          </span>
                          <div className="text-sm font-medium mt-1">{subject.percentage}%</div>
                        </div>

                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mb-4 overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full bg-gradient-to-r ${subject.color}`}
                            initial={{ width: "0%" }}
                            animate={{ width: `${subject.percentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>

                        <div className="mt-2 text-center">
                          <h3 className="text-lg font-bold">{subject.name}</h3>
                          <div className="mt-2 flex items-center justify-center">
                            <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-none">
                              <ZapIcon className="h-3 w-3 mr-1" /> {subject.xp} XP
                            </Badge>
                          </div>

                          {subject.streak > 0 && (
                            <div className="mt-2">
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <span className="mr-1">📈</span> {subject.streak} on-time submissions
                              </Badge>
                            </div>
                          )}

                          {subject.improved && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5, delay: 0.5 }}
                              className="mt-2"
                            >
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                <span className="mr-1">⬆️</span> Improved from {subject.previousGrade} to {subject.grade}
                                !
                              </Badge>
                            </motion.div>
                          )}
                        </div>

                        {isC && (
                          <div className="absolute bottom-3 right-3 text-xl" title="Let's keep working on this!">
                            😬
                          </div>
                        )}

                        {isLow && (
                          <div className="absolute bottom-3 right-3 group">
                            <div className="text-xl">⚠️</div>
                            <div className="absolute bottom-full right-0 mb-2 w-40 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                              Let's work on this together 💪
                            </div>
                          </div>
                        )}

                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSubjectClick(subject.id)
                            document.getElementById("assignments-section")?.scrollIntoView({ behavior: "smooth" })
                          }}
                          variant="outline"
                          className="mt-4 w-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <FolderIcon className="h-4 w-4 mr-2" /> View Assignments
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="assignments">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <CardTitle>Assignment Grades</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex rounded-full bg-muted p-1">
                      <Button
                        variant={assignmentFilter === "all" ? "default" : "ghost"}
                        size="sm"
                        className="rounded-full text-xs px-3"
                        onClick={() => setAssignmentFilter("all")}
                      >
                        All
                      </Button>
                      <Button
                        variant={assignmentFilter === "graded" ? "default" : "ghost"}
                        size="sm"
                        className="rounded-full text-xs px-3"
                        onClick={() => setAssignmentFilter("graded")}
                      >
                        Graded
                      </Button>
                      <Button
                        variant={assignmentFilter === "ungraded" ? "default" : "ghost"}
                        size="sm"
                        className="rounded-full text-xs px-3"
                        onClick={() => setAssignmentFilter("ungraded")}
                      >
                        Ungraded
                      </Button>
                      <Button
                        variant={assignmentFilter === "pastdue" ? "default" : "ghost"}
                        size="sm"
                        className="rounded-full text-xs px-3"
                        onClick={() => setAssignmentFilter("pastdue")}
                      >
                        Past Due
                      </Button>
                    </div>
                    <div className="flex rounded-full bg-muted p-1">
                      <Button
                        variant={viewMode === "table" ? "default" : "ghost"}
                        size="sm"
                        className="rounded-full"
                        onClick={() => setViewMode("table")}
                      >
                        <ListIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        className="rounded-full"
                        onClick={() => setViewMode("grid")}
                      >
                        <GridIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <CardDescription>View all your graded and pending assignments</CardDescription>
              </CardHeader>
              <CardContent>
                {viewMode === "table" ? (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 bg-muted p-4 text-sm font-medium">
                      <div className="col-span-4">Assignment</div>
                      <div className="col-span-2">Subject</div>
                      <div className="col-span-2 text-center">Grade</div>
                      <div className="col-span-2 text-center">Status</div>
                      <div className="col-span-2 text-right">Actions</div>
                    </div>
                    <div className="divide-y">
                      {filteredAssignments.length > 0 ? (
                        filteredAssignments.slice(0, visibleAssignments).map((assignment, index) => {
                          const isLate = isPastDue(assignment.dueDate) && !assignment.submitted
                          const isPending = assignment.submitted && assignment.grade === ""

                          return (
                            <motion.div
                              key={assignment.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="grid grid-cols-12 p-4 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                              <div className="col-span-4 font-medium">{assignment.name}</div>
                              <div className="col-span-2 text-muted-foreground">{assignment.subject}</div>
                              <div className="col-span-2 text-center">
                                {assignment.submitted && assignment.grade ? (
                                  <span className="font-medium">
                                    {assignment.grade} ({assignment.percentage}%)
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">--</span>
                                )}
                              </div>
                              <div className="col-span-2 text-center">
                                {assignment.submitted && assignment.grade ? (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                                    Graded
                                  </Badge>
                                ) : assignment.submitted && !assignment.grade ? (
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    <ClockIcon className="h-3 w-3 mr-1" />
                                    Pending
                                  </Badge>
                                ) : isLate ? (
                                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                    <XCircleIcon className="h-3 w-3 mr-1" />
                                    Past Due
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                    <ClockIcon className="h-3 w-3 mr-1" />
                                    Due {new Date(assignment.dueDate).toLocaleDateString()}
                                  </Badge>
                                )}
                              </div>
                              <div className="col-span-2 text-right">
                                {assignment.submitted && (
                                  <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/student/uploads`}>
                                      <EyeIcon className="h-3 w-3 mr-1" />
                                      View
                                    </Link>
                                  </Button>
                                )}
                              </div>
                            </motion.div>
                          )
                        })
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">
                          No assignments found for the selected filters.
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredAssignments.length > 0 ? (
                      filteredAssignments.slice(0, visibleAssignments).map((assignment, index) => {
                        const isLate = isPastDue(assignment.dueDate) && !assignment.submitted
                        const isPending = assignment.submitted && assignment.grade === ""

                        return (
                          <motion.div
                            key={assignment.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <Card className="overflow-hidden hover:shadow-md transition-all">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">{assignment.name}</CardTitle>
                                <CardDescription>{assignment.subject}</CardDescription>
                              </CardHeader>
                              <CardContent className="pb-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    {assignment.submitted && assignment.grade ? (
                                      <div className="flex flex-col">
                                        <span className="text-2xl font-bold">{assignment.grade}</span>
                                        <span className="text-xs text-muted-foreground">{assignment.percentage}%</span>
                                      </div>
                                    ) : (
                                      <span className="text-muted-foreground">Not graded</span>
                                    )}
                                  </div>
                                  <div>
                                    {assignment.submitted && assignment.grade ? (
                                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                                        Graded
                                      </Badge>
                                    ) : assignment.submitted && !assignment.grade ? (
                                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                        <ClockIcon className="h-3 w-3 mr-1" />
                                        Pending
                                      </Badge>
                                    ) : isLate ? (
                                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                        <XCircleIcon className="h-3 w-3 mr-1" />
                                        Past Due
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                        <ClockIcon className="h-3 w-3 mr-1" />
                                        Due {new Date(assignment.dueDate).toLocaleDateString()}
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                {assignment.submitted && (
                                  <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                                    <Link href={`/student/uploads`}>
                                      <EyeIcon className="h-3 w-3 mr-1" />
                                      View Submission
                                    </Link>
                                  </Button>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        )
                      })
                    ) : (
                      <div className="col-span-full p-4 text-center text-muted-foreground">
                        No assignments found for the selected filters.
                      </div>
                    )}
                  </div>
                )}

                {filteredAssignments.length > visibleAssignments && (
                  <div className="flex justify-center mt-4">
                    <Button
                      onClick={handleShowMore}
                      className="rounded-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                    >
                      Show More <ChevronDownIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
