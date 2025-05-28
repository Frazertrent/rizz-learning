"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Gift,
  Home,
  BookOpen,
  Calculator,
  Beaker,
  PenTool,
  Globe,
  Music,
  Palette,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Star,
  Lightbulb,
  Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for the progress page
const getMockStudentData = (studentId) => ({
  id: studentId,
  name: "Enoch",
  avatar: "E",
  grade: "8th",
  currentProgress: 78,
  expectedProgress: 75,
  checkIns: {
    completed: 18,
    missed: 2,
    late: 3,
    total: 23,
  },
  subjects: [
    {
      id: "math",
      name: "Mathematics",
      icon: "Calculator",
      color: "from-blue-500 to-indigo-500",
      lightColor: "bg-blue-100 dark:bg-blue-900/30",
      borderColor: "border-blue-200 dark:border-blue-800",
      textColor: "text-blue-700 dark:text-blue-300",
      completion: 85,
      averageScore: 92,
      needsReview: false,
      strengths: "Algebra concepts, problem-solving",
      weaknesses: "Geometry proofs",
      recentActivity: "Completed quadratic equations quiz with 92% score",
    },
    {
      id: "science",
      name: "Science",
      icon: "Beaker",
      color: "from-green-500 to-emerald-500",
      lightColor: "bg-green-100 dark:bg-green-900/30",
      borderColor: "border-green-200 dark:border-green-800",
      textColor: "text-green-700 dark:text-green-300",
      completion: 72,
      averageScore: 85,
      needsReview: true,
      strengths: "Lab experiments, scientific method",
      weaknesses: "Chemistry formulas",
      recentActivity: "Submitted lab report on photosynthesis",
    },
    {
      id: "english",
      name: "English",
      icon: "PenTool",
      color: "from-purple-500 to-violet-500",
      lightColor: "bg-purple-100 dark:bg-purple-900/30",
      borderColor: "border-purple-200 dark:border-purple-800",
      textColor: "text-purple-700 dark:text-purple-300",
      completion: 90,
      averageScore: 88,
      needsReview: false,
      strengths: "Essay writing, reading comprehension",
      weaknesses: "Grammar rules",
      recentActivity: "Finished reading 'To Kill a Mockingbird'",
    },
    {
      id: "history",
      name: "History",
      icon: "Globe",
      color: "from-amber-500 to-yellow-500",
      lightColor: "bg-amber-100 dark:bg-amber-900/30",
      borderColor: "border-amber-200 dark:border-amber-800",
      textColor: "text-amber-700 dark:text-amber-300",
      completion: 65,
      averageScore: 78,
      needsReview: true,
      strengths: "Historical analysis, timelines",
      weaknesses: "Memorizing dates",
      recentActivity: "Started research on Civil War project",
    },
    {
      id: "art",
      name: "Art",
      icon: "Palette",
      color: "from-pink-500 to-rose-500",
      lightColor: "bg-pink-100 dark:bg-pink-900/30",
      borderColor: "border-pink-200 dark:border-pink-800",
      textColor: "text-pink-700 dark:text-pink-300",
      completion: 95,
      averageScore: 94,
      needsReview: false,
      strengths: "Creative expression, color theory",
      weaknesses: "Perspective drawing",
      recentActivity: "Completed self-portrait project",
    },
    {
      id: "music",
      name: "Music",
      icon: "Music",
      color: "from-indigo-500 to-blue-500",
      lightColor: "bg-indigo-100 dark:bg-indigo-900/30",
      borderColor: "border-indigo-200 dark:border-indigo-800",
      textColor: "text-indigo-700 dark:text-indigo-300",
      completion: 88,
      averageScore: 90,
      needsReview: false,
      strengths: "Rhythm, music theory",
      weaknesses: "Sight reading",
      recentActivity: "Practiced piano for 30 minutes",
    },
  ],
  weeklyCheckIns: [
    {
      id: 1,
      date: "Apr 15, 2023",
      subject: "Mathematics",
      subjectId: "math",
      status: "on-time",
      summary: "Completed quadratic equations practice and watched tutorial videos.",
      expanded: false,
    },
    {
      id: 2,
      date: "Apr 15, 2023",
      subject: "Science",
      subjectId: "science",
      status: "late",
      summary: "Finished lab report on photosynthesis and reviewed chapter 7.",
      expanded: false,
    },
    {
      id: 3,
      date: "Apr 14, 2023",
      subject: "English",
      subjectId: "english",
      status: "on-time",
      summary: "Read chapters 5-7 of 'To Kill a Mockingbird' and wrote character analysis.",
      expanded: false,
    },
    {
      id: 4,
      date: "Apr 14, 2023",
      subject: "History",
      subjectId: "history",
      status: "missed",
      summary: "",
      expanded: false,
    },
    {
      id: 5,
      date: "Apr 13, 2023",
      subject: "Art",
      subjectId: "art",
      status: "on-time",
      summary: "Worked on self-portrait project using charcoal techniques.",
      expanded: false,
    },
    {
      id: 6,
      date: "Apr 13, 2023",
      subject: "Music",
      subjectId: "music",
      status: "on-time",
      summary: "Practiced piano scales and learned new chord progressions.",
      expanded: false,
    },
    {
      id: 7,
      date: "Apr 12, 2023",
      subject: "Mathematics",
      subjectId: "math",
      status: "on-time",
      summary: "Solved problems on linear equations and graphing.",
      expanded: false,
    },
  ],
  alerts: [
    {
      id: 1,
      type: "warning",
      subject: "History",
      message: "Missed 2 check-ins this week. Consider scheduling a review session.",
      action: "Schedule Review",
      link: "/parent/schedule-review",
    },
    {
      id: 2,
      type: "alert",
      subject: "Science",
      message: "Lab report needs revision. Feedback has been provided.",
      action: "View Feedback",
      link: "/parent/feedback/science",
    },
  ],
  calendarData: [
    { date: "2023-04-01", status: "completed" },
    { date: "2023-04-02", status: "completed" },
    { date: "2023-04-03", status: "completed" },
    { date: "2023-04-04", status: "missed" },
    { date: "2023-04-05", status: "completed" },
    { date: "2023-04-06", status: "completed" },
    { date: "2023-04-07", status: "late" },
    { date: "2023-04-08", status: "completed" },
    { date: "2023-04-09", status: "completed" },
    { date: "2023-04-10", status: "completed" },
    { date: "2023-04-11", status: "completed" },
    { date: "2023-04-12", status: "completed" },
    { date: "2023-04-13", status: "completed" },
    { date: "2023-04-14", status: "partial" },
    { date: "2023-04-15", status: "partial" },
  ],
})

// Helper function to get icon component
const getSubjectIcon = (iconName) => {
  switch (iconName) {
    case "Calculator":
      return <Calculator />
    case "Beaker":
      return <Beaker />
    case "PenTool":
      return <PenTool />
    case "Globe":
      return <Globe />
    case "Palette":
      return <Palette />
    case "Music":
      return <Music />
    default:
      return <BookOpen />
  }
}

// Helper function to get status badge
const getStatusBadge = (status) => {
  switch (status) {
    case "on-time":
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800">
          <CheckCircle2 className="h-3 w-3 mr-1" /> On Time
        </Badge>
      )
    case "late":
      return (
        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800">
          <Clock className="h-3 w-3 mr-1" /> Late
        </Badge>
      )
    case "missed":
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800">
          <XCircle className="h-3 w-3 mr-1" /> Missed
        </Badge>
      )
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

// Calendar Day component
const CalendarDay = ({ day, status }) => {
  const getStatusClass = () => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "late":
        return "bg-amber-500"
      case "missed":
        return "bg-red-500"
      case "partial":
        return "bg-blue-500"
      default:
        return "bg-gray-200 dark:bg-gray-700"
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-xs text-gray-500 dark:text-gray-400">{day}</div>
      <div className={`w-3 h-3 rounded-full mt-1 ${getStatusClass()}`}></div>
    </div>
  )
}

// Circular Progress component
const CircularProgress = ({ value, max = 100, size = 120, strokeWidth = 10, color = "text-blue-500" }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / max) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          className="text-gray-200 dark:text-gray-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={color}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-2xl font-bold">{value}%</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">Complete</span>
      </div>
    </div>
  )
}

export default function StudentProgressPage({ params }: { params: { student_id: string } }) {
  const studentId = params.student_id
  const [student, setStudent] = useState(null)
  const [weeklyCheckIns, setWeeklyCheckIns] = useState([])
  const [progressValue, setProgressValue] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")

  // Initialize data
  useEffect(() => {
    const data = getMockStudentData(studentId)
    setStudent(data)
    setWeeklyCheckIns(data.weeklyCheckIns)

    // Animate progress value
    const timer = setTimeout(() => {
      setProgressValue(data.currentProgress)
    }, 300)

    return () => clearTimeout(timer)
  }, [studentId])

  // Toggle check-in expansion
  const toggleCheckInExpansion = (id) => {
    setWeeklyCheckIns(
      weeklyCheckIns.map((checkIn) => (checkIn.id === id ? { ...checkIn, expanded: !checkIn.expanded } : checkIn)),
    )
  }

  if (!student) {
    return (
      <div className="container mx-auto py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Breadcrumbs and Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/parent" className="hover:text-primary transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/parent/students" className="hover:text-primary transition-colors">
              Students
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{student.name}</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">Progress</span>
          </div>

          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary">
              <AvatarFallback className="bg-primary/10 text-primary">{student.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500">
                {student.name}'s Progress
              </h1>
              <p className="text-muted-foreground">{student.grade} Grade • Detailed academic performance</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href="/parent/students">
            <Button variant="outline" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Student
            </Button>
          </Link>
          <Button size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </motion.div>

      {/* Progress Snapshot Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {/* Progress Tracker Tile */}
          <Card className="overflow-hidden border-none shadow-md bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-500" />
                Progress Tracker
              </CardTitle>
              <CardDescription>Current vs. Expected Progress</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="flex items-center justify-center gap-8">
                <div className="flex flex-col items-center">
                  <CircularProgress value={student.currentProgress} color="text-blue-500" />
                  <span className="mt-2 text-sm font-medium">Current</span>
                </div>
                <div className="flex flex-col items-center">
                  <CircularProgress value={student.expectedProgress} color="text-purple-500" />
                  <span className="mt-2 text-sm font-medium">Expected</span>
                </div>
              </div>

              <div className="mt-6 w-full">
                <div className="flex justify-between text-sm mb-1">
                  <span>Weekly Check-ins</span>
                  <span>
                    {student.checkIns.completed}/{student.checkIns.total} Completed
                  </span>
                </div>
                <Progress value={(student.checkIns.completed / student.checkIns.total) * 100} className="h-2" />
              </div>

              <div className="mt-4 p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">
                      {student.currentProgress > student.expectedProgress
                        ? "Ahead of schedule! 🎉"
                        : student.currentProgress === student.expectedProgress
                          ? "Right on track! 👍"
                          : "Slightly behind schedule"}
                    </p>
                    <p className="text-xs mt-1">
                      {student.currentProgress > student.expectedProgress
                        ? `${student.currentProgress - student.expectedProgress}% ahead of expected progress`
                        : student.currentProgress === student.expectedProgress
                          ? "Keeping pace with curriculum goals"
                          : `${student.expectedProgress - student.currentProgress}% behind expected progress`}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calendar Overview Tile */}
          <Card className="overflow-hidden border-none shadow-md bg-gradient-to-r from-pink-50 to-orange-50 dark:from-pink-950/30 dark:to-orange-950/30 rounded-xl hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-pink-500" />
                Check-in Activity
              </CardTitle>
              <CardDescription>Last 15 days of activity</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-5 gap-2 mb-6">
                {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => (
                  <div key={i} className="text-center text-sm font-medium">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-5 gap-2 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((day, i) => (
                  <CalendarDay key={i} day={day} status={student.calendarData[i]?.status || "none"} />
                ))}
              </div>

              <div className="flex justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-xs">Late</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-xs">Missed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs">Partial</span>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-pink-100 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800 text-pink-800 dark:text-pink-300">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-pink-500" />
                  <div>
                    <p className="text-sm font-medium">Consistency Score: Excellent!</p>
                    <p className="text-xs mt-1">
                      {student.name} has completed {student.checkIns.completed} out of {student.checkIns.total}{" "}
                      check-ins this month.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Alerts Section (if any) */}
      {student.alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Attention Needed
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {student.alerts.map((alert) => (
                <motion.div key={alert.id} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Card
                    className={`overflow-hidden border-none shadow-md ${
                      alert.type === "warning"
                        ? "bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800"
                        : "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800"
                    } rounded-xl`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            alert.type === "warning" ? "bg-amber-200 dark:bg-amber-800" : "bg-red-200 dark:bg-red-800"
                          }`}
                        >
                          <AlertTriangle
                            className={`h-5 w-5 ${
                              alert.type === "warning"
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <h3
                            className={`font-medium ${
                              alert.type === "warning"
                                ? "text-amber-800 dark:text-amber-300"
                                : "text-red-800 dark:text-red-300"
                            }`}
                          >
                            {alert.subject}: {alert.message}
                          </h3>
                          <div className="mt-2">
                            <Link href={alert.link}>
                              <Button
                                size="sm"
                                variant={alert.type === "warning" ? "outline" : "default"}
                                className={
                                  alert.type === "warning"
                                    ? "border-amber-500 text-amber-700 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-900/50"
                                    : "bg-red-600 hover:bg-red-700 text-white"
                                }
                              >
                                {alert.action}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Subject Breakdown Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Tabs defaultValue="subjects" className="space-y-4">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="subjects">Subject Breakdown</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Check-ins</TabsTrigger>
          </TabsList>

          <TabsContent value="subjects" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {student.subjects.map((subject) => (
                <motion.div key={subject.id} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                  <Card
                    className={`overflow-hidden border-2 ${subject.borderColor} shadow-md rounded-xl hover:shadow-lg transition-all`}
                  >
                    <div className={`h-2 bg-gradient-to-r ${subject.color}`}></div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <div className={`p-1.5 rounded-md ${subject.lightColor}`}>{getSubjectIcon(subject.icon)}</div>
                          {subject.name}
                        </CardTitle>
                        {subject.needsReview && (
                          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                            Needs Review
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Completion</span>
                            <span className="text-sm font-medium">{subject.completion}%</span>
                          </div>
                          <Progress
                            value={subject.completion}
                            className="h-2"
                            indicatorClassName={`bg-gradient-to-r ${subject.color}`}
                          />
                        </div>

                        <div className="flex justify-between">
                          <div>
                            <div className="text-sm text-muted-foreground">Average Score</div>
                            <div className={`text-lg font-bold ${subject.textColor}`}>{subject.averageScore}%</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Grade</div>
                            <div className="text-lg font-bold">
                              {subject.averageScore >= 90
                                ? "A"
                                : subject.averageScore >= 80
                                  ? "B"
                                  : subject.averageScore >= 70
                                    ? "C"
                                    : subject.averageScore >= 60
                                      ? "D"
                                      : "F"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="w-full">
                        <div className="text-xs text-muted-foreground mb-2">Recent Activity</div>
                        <p className="text-sm">{subject.recentActivity}</p>
                        <div className="flex justify-between items-center mt-3">
                          <Link href="/student/assignments">
                            <Button
                              variant="outline"
                              size="sm"
                              className={`border-${subject.borderColor.split("-")[1]} hover:bg-${subject.lightColor.split("-")[1]} hover:text-${subject.textColor.split("-")[1]}`}
                            >
                              View Assignments
                            </Button>
                          </Link>
                          <Badge variant="outline" className={subject.textColor}>
                            {subject.completion >= 90
                              ? "Excellent"
                              : subject.completion >= 75
                                ? "Good Progress"
                                : subject.completion >= 50
                                  ? "In Progress"
                                  : "Just Started"}
                          </Badge>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-950/50 dark:to-gray-900/50 rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Weekly Check-in Summary
                </CardTitle>
                <CardDescription>Last 7 days of student check-ins and reflections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <div className="grid grid-cols-12 p-3 bg-muted/50 font-medium text-sm">
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2">Subject</div>
                    <div className="col-span-2 text-center">Status</div>
                    <div className="col-span-5">Summary</div>
                    <div className="col-span-1"></div>
                  </div>

                  <div className="divide-y">
                    {weeklyCheckIns.map((checkIn) => (
                      <div key={checkIn.id} className="hover:bg-muted/20 transition-colors">
                        <div className="grid grid-cols-12 p-3 items-center text-sm">
                          <div className="col-span-2">{checkIn.date}</div>
                          <div className="col-span-2 font-medium">{checkIn.subject}</div>
                          <div className="col-span-2 text-center">{getStatusBadge(checkIn.status)}</div>
                          <div className="col-span-5 truncate">
                            {checkIn.status === "missed" ? (
                              <span className="text-muted-foreground italic">No check-in recorded</span>
                            ) : checkIn.expanded ? (
                              checkIn.summary
                            ) : (
                              `${checkIn.summary.substring(0, 60)}${checkIn.summary.length > 60 ? "..." : ""}`
                            )}
                          </div>
                          <div className="col-span-1 text-right">
                            {checkIn.status !== "missed" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => toggleCheckInExpansion(checkIn.id)}
                              >
                                {checkIn.expanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </div>
                        </div>

                        {checkIn.expanded && checkIn.status !== "missed" && (
                          <div className="px-3 pb-3 -mt-1">
                            <div className="p-3 rounded-lg bg-muted/30 text-sm">
                              <div className="font-medium mb-1">Full Reflection:</div>
                              {checkIn.summary}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Bottom Navigation Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="pt-4"
      >
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-xl">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/parent">
                <Button
                  variant="outline"
                  className="w-full border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/parent/rewards">
                <Button
                  variant="outline"
                  className="w-full border-pink-200 dark:border-pink-800 hover:bg-pink-100 dark:hover:bg-pink-900/30 text-pink-700 dark:text-pink-300"
                >
                  <Gift className="mr-2 h-4 w-4" />
                  Rewards
                </Button>
              </Link>
              <Link href="/parent/curriculum">
                <Button
                  variant="outline"
                  className="w-full border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                >
                  <Layers className="mr-2 h-4 w-4" />
                  Curriculum
                </Button>
              </Link>
              <Link href="/parent/reports">
                <Button
                  variant="outline"
                  className="w-full border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Reports
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
