"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  BookOpen,
  Calendar,
  Download,
  FileText,
  LineChart,
  PieChart,
  Search,
  Home,
  Users,
  MessageSquare,
  BookMarked,
  Target,
  Gift,
  Filter,
  ArrowRight,
  Clock,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react"

// Sample data
const students = [
  { id: 1, name: "Enoch", grade: "8th" },
  { id: 2, name: "Sarah", grade: "6th" },
  { id: 3, name: "Benjamin", grade: "4th" },
]

const subjects = [
  { id: 1, name: "Mathematics", progress: 78, grade: "B+", color: "blue" },
  { id: 2, name: "Science", progress: 85, grade: "A-", color: "green" },
  { id: 3, name: "English", progress: 92, grade: "A", color: "purple" },
  { id: 4, name: "History", progress: 65, grade: "C+", color: "amber" },
  { id: 5, name: "Art", progress: 95, grade: "A", color: "pink" },
]

// Sample assignment data for modals
const getAssignmentsForSubject = (subjectId) => {
  const assignmentsBySubject = {
    1: [
      {
        id: 1,
        title: "Quadratic Equations Quiz",
        date: "Apr 10, 2023",
        score: 85,
        type: "Quiz",
        weight: 10,
        comment: "Good work on the factoring problems.",
      },
      {
        id: 2,
        title: "Geometry Midterm",
        date: "Mar 25, 2023",
        score: 92,
        type: "Test",
        weight: 20,
        comment: "Excellent understanding of theorems.",
      },
      {
        id: 3,
        title: "Algebra Homework",
        date: "Apr 5, 2023",
        score: 78,
        type: "Homework",
        weight: 5,
        comment: "Watch out for sign errors in equations.",
      },
      {
        id: 4,
        title: "Statistics Project",
        date: "Mar 15, 2023",
        score: 88,
        type: "Project",
        weight: 15,
        comment: "Creative data visualization.",
      },
      {
        id: 5,
        title: "Calculus Intro Quiz",
        date: "Apr 15, 2023",
        score: 75,
        type: "Quiz",
        weight: 10,
        comment: "Review limits concept.",
      },
    ],
    2: [
      {
        id: 1,
        title: "Biology Lab Report",
        date: "Apr 12, 2023",
        score: 90,
        type: "Lab",
        weight: 15,
        comment: "Excellent observations and analysis.",
      },
      {
        id: 2,
        title: "Chemistry Quiz",
        date: "Apr 5, 2023",
        score: 82,
        type: "Quiz",
        weight: 10,
        comment: "Good understanding of chemical bonds.",
      },
      {
        id: 3,
        title: "Physics Homework",
        date: "Mar 28, 2023",
        score: 85,
        type: "Homework",
        weight: 5,
        comment: "Watch units in calculations.",
      },
      {
        id: 4,
        title: "Ecosystem Project",
        date: "Mar 10, 2023",
        score: 95,
        type: "Project",
        weight: 20,
        comment: "Outstanding research and presentation.",
      },
      {
        id: 5,
        title: "Genetics Test",
        date: "Apr 18, 2023",
        score: 88,
        type: "Test",
        weight: 20,
        comment: "Good grasp of inheritance patterns.",
      },
    ],
    3: [
      {
        id: 1,
        title: "Literary Analysis Essay",
        date: "Apr 14, 2023",
        score: 94,
        type: "Essay",
        weight: 20,
        comment: "Insightful character analysis.",
      },
      {
        id: 2,
        title: "Grammar Quiz",
        date: "Apr 7, 2023",
        score: 88,
        type: "Quiz",
        weight: 10,
        comment: "Review comma usage rules.",
      },
      {
        id: 3,
        title: "Poetry Presentation",
        date: "Mar 30, 2023",
        score: 92,
        type: "Presentation",
        weight: 15,
        comment: "Excellent interpretation of themes.",
      },
      {
        id: 4,
        title: "Vocabulary Test",
        date: "Mar 20, 2023",
        score: 96,
        type: "Test",
        weight: 15,
        comment: "Outstanding vocabulary mastery.",
      },
      {
        id: 5,
        title: "Reading Comprehension",
        date: "Apr 17, 2023",
        score: 90,
        type: "Quiz",
        weight: 10,
        comment: "Good inferential reasoning.",
      },
    ],
    4: [
      {
        id: 1,
        title: "Civil War Essay",
        date: "Apr 13, 2023",
        score: 72,
        type: "Essay",
        weight: 20,
        comment: "Need more specific examples and citations.",
      },
      {
        id: 2,
        title: "World History Quiz",
        date: "Apr 6, 2023",
        score: 68,
        type: "Quiz",
        weight: 10,
        comment: "Review dates of key events.",
      },
      {
        id: 3,
        title: "Ancient Civilizations Project",
        date: "Mar 27, 2023",
        score: 85,
        type: "Project",
        weight: 20,
        comment: "Good research on cultural aspects.",
      },
      {
        id: 4,
        title: "Government Systems Test",
        date: "Mar 18, 2023",
        score: 70,
        type: "Test",
        weight: 15,
        comment: "Study branches of government more.",
      },
      {
        id: 5,
        title: "Historical Figure Biography",
        date: "Apr 16, 2023",
        score: 78,
        type: "Assignment",
        weight: 15,
        comment: "Good narrative but need more historical context.",
      },
    ],
    5: [
      {
        id: 1,
        title: "Self-Portrait",
        date: "Apr 15, 2023",
        score: 98,
        type: "Project",
        weight: 25,
        comment: "Exceptional use of technique and expression.",
      },
      {
        id: 2,
        title: "Color Theory Quiz",
        date: "Apr 8, 2023",
        score: 92,
        type: "Quiz",
        weight: 10,
        comment: "Excellent understanding of color relationships.",
      },
      {
        id: 3,
        title: "Art History Presentation",
        date: "Mar 29, 2023",
        score: 95,
        type: "Presentation",
        weight: 15,
        comment: "Insightful analysis of artistic movements.",
      },
      {
        id: 4,
        title: "Sculpture Project",
        date: "Mar 12, 2023",
        score: 90,
        type: "Project",
        weight: 20,
        comment: "Creative use of materials and form.",
      },
      {
        id: 5,
        title: "Drawing Techniques",
        date: "Apr 19, 2023",
        score: 94,
        type: "Assignment",
        weight: 15,
        comment: "Excellent shading and perspective.",
      },
    ],
  }

  return assignmentsBySubject[subjectId] || []
}

// Weekly progress data for chart
const weeklyProgressData = [
  { week: "Week 1", math: 65, science: 70, english: 80, history: 60, art: 85 },
  { week: "Week 2", math: 70, science: 75, english: 85, history: 62, art: 88 },
  { week: "Week 3", math: 72, science: 78, english: 87, history: 65, art: 90 },
  { week: "Week 4", math: 75, science: 80, english: 90, history: 68, art: 92 },
  { week: "Week 5", math: 78, science: 82, english: 92, history: 70, art: 94 },
  { week: "Week 6", math: 80, science: 85, english: 92, history: 72, art: 95 },
]

// Subject distribution data for pie chart
const subjectDistributionData = [
  { subject: "Mathematics", percentage: 25 },
  { subject: "Science", percentage: 20 },
  { subject: "English", percentage: 22 },
  { subject: "History", percentage: 18 },
  { subject: "Art", percentage: 15 },
]

// Navigation links
const navigationLinks = [
  { name: "Dashboard", href: "/parent", icon: <Home className="h-4 w-4" /> },
  { name: "Students", href: "/parent/students", icon: <Users className="h-4 w-4" /> },
  { name: "Feedback", href: "/parent/feedback", icon: <MessageSquare className="h-4 w-4" /> },
  { name: "Curriculum", href: "/parent/curriculum", icon: <BookMarked className="h-4 w-4" /> },
  { name: "Goals", href: "/parent/goals", icon: <Target className="h-4 w-4" /> },
  { name: "Calendar", href: "/parent/calendar", icon: <Calendar className="h-4 w-4" /> },
  { name: "Rewards", href: "/parent/rewards", icon: <Gift className="h-4 w-4" /> },
]

export function Reports() {
  const [activeTab, setActiveTab] = useState("progress")
  const [selectedStudent, setSelectedStudent] = useState("enoch")
  const [selectedTimeframe, setSelectedTimeframe] = useState("semester")
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [gradeTimeframe, setGradeTimeframe] = useState("semester")

  // Get the current student ID
  const currentStudentId = students.find((s) => s.name.toLowerCase() === selectedStudent)?.id || 1

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500">
            Academic Reports
          </h2>
          <p className="text-muted-foreground">Track progress, grades, attendance, and activity</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 transition-all hover:shadow-md">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/parent/calendar">
                  <Button className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all hover:shadow-md">
                    <Calendar className="h-4 w-4" />
                    Academic Calendar
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>View full academic calendar with events and deadlines</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.div>

      {/* Navigation Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-950/50 dark:to-gray-900/50 rounded-xl">
          <CardContent className="p-4">
            <div className="flex justify-center gap-6">
              <Link href="/parent/feedback">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 rounded-full px-6 py-5 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 hover:shadow-md transition-all"
                >
                  <MessageSquare className="h-4 w-4" />
                  Feedback
                </Button>
              </Link>
              <Link href="/parent/goals">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 rounded-full px-6 py-5 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-indigo-500/10 hover:shadow-md transition-all"
                >
                  <Target className="h-4 w-4" />
                  Goals
                </Button>
              </Link>
              <Link href="/parent/calendar">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 rounded-full px-6 py-5 hover:bg-gradient-to-r hover:from-green-500/10 hover:to-teal-500/10 hover:shadow-md transition-all"
                >
                  <Calendar className="h-4 w-4" />
                  Calendar
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Student and Timeframe Selectors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center"
      >
        <div className="grid gap-2">
          <div className="text-sm font-medium">Student</div>
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger className="w-[180px] bg-white dark:bg-gray-950/50 hover:shadow-md transition-all">
              <SelectValue placeholder="Select student" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.name.toLowerCase()}>
                  {student.name} ({student.grade})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <div className="text-sm font-medium">Timeframe</div>
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[180px] bg-white dark:bg-gray-950/50 hover:shadow-md transition-all">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="semester">This Semester</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Main Tabs */}
      <Tabs defaultValue="progress" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 rounded-full p-1 bg-muted/80">
          <TabsTrigger
            value="progress"
            className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/90 data-[state=active]:to-indigo-600/90 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
          >
            Progress
          </TabsTrigger>
          <TabsTrigger
            value="grades"
            className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/90 data-[state=active]:to-indigo-600/90 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
          >
            Grades
          </TabsTrigger>
          <TabsTrigger
            value="attendance"
            className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/90 data-[state=active]:to-indigo-600/90 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
          >
            Attendance
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/90 data-[state=active]:to-indigo-600/90 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
          >
            Activity
          </TabsTrigger>
        </TabsList>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="overflow-hidden border-none shadow-md bg-white dark:bg-gray-950/50 rounded-xl hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  Subject Progress
                </CardTitle>
                <CardDescription>Track progress across all subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="font-medium flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full bg-${subject.color}-500`}></div>
                          {subject.name}
                        </div>
                        <div className="text-sm text-muted-foreground">{subject.progress}% Complete</div>
                      </div>
                      <Progress
                        value={subject.progress}
                        className="h-2"
                        indicatorClassName={`bg-gradient-to-r from-${subject.color}-500 to-${subject.color}-600`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={`/parent/students/${currentStudentId}/progress`} className="w-full">
                        <Button
                          variant="outline"
                          className="w-full gap-2 hover:bg-muted/50 transition-all hover:shadow-md"
                        >
                          View Detailed Progress
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View full subject-by-subject performance</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardFooter>
            </Card>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="overflow-hidden border-none shadow-md bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl hover:shadow-lg transition-all h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-medium">Weekly Progress</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-1.5">
                          <LineChart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Track weekly progress patterns</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] relative">
                    {/* Sample Line Chart */}
                    <div className="absolute inset-0 flex flex-col">
                      {/* X-axis labels */}
                      <div className="flex justify-between text-xs text-muted-foreground mt-auto mb-2">
                        {weeklyProgressData.map((week, i) => (
                          <div key={i}>{week.week.split(" ")[1]}</div>
                        ))}
                      </div>

                      {/* Chart area */}
                      <div className="flex-1 relative border-b border-l">
                        {/* Y-axis labels */}
                        <div className="absolute -left-6 inset-y-0 flex flex-col justify-between text-xs text-muted-foreground">
                          <div>100%</div>
                          <div>75%</div>
                          <div>50%</div>
                          <div>25%</div>
                          <div>0%</div>
                        </div>

                        {/* Chart lines */}
                        <svg className="w-full h-full" viewBox="0 0 300 150" preserveAspectRatio="none">
                          {/* Math line */}
                          <path
                            d={`M 0,${150 - (weeklyProgressData[0].math / 100) * 150} ${weeklyProgressData.map((data, i) => `L ${i * 60},${150 - (data.math / 100) * 150}`).join(" ")}`}
                            stroke="#3b82f6"
                            strokeWidth="2"
                            fill="none"
                          />

                          {/* Science line */}
                          <path
                            d={`M 0,${150 - (weeklyProgressData[0].science / 100) * 150} ${weeklyProgressData.map((data, i) => `L ${i * 60},${150 - (data.science / 100) * 150}`).join(" ")}`}
                            stroke="#10b981"
                            strokeWidth="2"
                            fill="none"
                          />

                          {/* English line */}
                          <path
                            d={`M 0,${150 - (weeklyProgressData[0].english / 100) * 150} ${weeklyProgressData.map((data, i) => `L ${i * 60},${150 - (data.english / 100) * 150}`).join(" ")}`}
                            stroke="#8b5cf6"
                            strokeWidth="2"
                            fill="none"
                          />

                          {/* History line */}
                          <path
                            d={`M 0,${150 - (weeklyProgressData[0].history / 100) * 150} ${weeklyProgressData.map((data, i) => `L ${i * 60},${150 - (data.history / 100) * 150}`).join(" ")}`}
                            stroke="#f59e0b"
                            strokeWidth="2"
                            fill="none"
                          />

                          {/* Art line */}
                          <path
                            d={`M 0,${150 - (weeklyProgressData[0].art / 100) * 150} ${weeklyProgressData.map((data, i) => `L ${i * 60},${150 - (data.art / 100) * 150}`).join(" ")}`}
                            stroke="#ec4899"
                            strokeWidth="2"
                            fill="none"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap justify-center gap-3 mt-4">
                    {subjects.map((subject) => (
                      <div key={subject.id} className="flex items-center gap-1.5">
                        <div className={`w-3 h-3 rounded-full bg-${subject.color}-500`}></div>
                        <span className="text-xs">{subject.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="overflow-hidden border-none shadow-md bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl hover:shadow-lg transition-all h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-medium">Subject Distribution</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-1.5">
                          <PieChart className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>See how learning time is distributed by subject</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center">
                    {/* Sample Pie Chart */}
                    <div className="relative w-32 h-32">
                      <svg viewBox="0 0 100 100">
                        {/* Calculate and draw pie segments */}
                        {(() => {
                          let startAngle = 0
                          return subjectDistributionData.map((item, index) => {
                            const angle = (item.percentage / 100) * 360
                            const endAngle = startAngle + angle

                            // Convert angles to radians and calculate x,y coordinates
                            const startAngleRad = (startAngle - 90) * (Math.PI / 180)
                            const endAngleRad = (endAngle - 90) * (Math.PI / 180)

                            const x1 = 50 + 50 * Math.cos(startAngleRad)
                            const y1 = 50 + 50 * Math.sin(startAngleRad)
                            const x2 = 50 + 50 * Math.cos(endAngleRad)
                            const y2 = 50 + 50 * Math.sin(endAngleRad)

                            // Determine if the arc should be drawn as a large arc
                            const largeArcFlag = angle > 180 ? 1 : 0

                            // Create the SVG arc path
                            const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

                            // Get color based on subject
                            const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899"]
                            const color = colors[index % colors.length]

                            // Update start angle for next segment
                            startAngle = endAngle

                            return <path key={index} d={pathData} fill={color} stroke="white" strokeWidth="1" />
                          })
                        })()}
                      </svg>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap justify-center gap-3 mt-4">
                    {subjectDistributionData.map((item, index) => {
                      const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899"]
                      return (
                        <div key={index} className="flex items-center gap-1.5">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: colors[index % colors.length] }}
                          ></div>
                          <span className="text-xs">
                            {item.subject} ({item.percentage}%)
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* Grades Tab */}
        <TabsContent value="grades" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="overflow-hidden border-none shadow-md bg-white dark:bg-gray-950/50 rounded-xl hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  Grade Report
                </CardTitle>
                <CardDescription>Current grades for all subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full bg-${subject.color}-100 dark:bg-${subject.color}-900/30 p-2`}>
                          <BookOpen className={`h-4 w-4 text-${subject.color}-500`} />
                        </div>
                        <div>
                          <p className="font-medium">{subject.name}</p>
                          <p className="text-sm text-muted-foreground">Current Grade: {subject.grade}</p>
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`hover:bg-${subject.color}-50 hover:text-${subject.color}-600 dark:hover:bg-${subject.color}-900/20 dark:hover:text-${subject.color}-400 transition-all hover:shadow-sm`}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] rounded-xl border-none shadow-lg">
                          <DialogHeader>
                            <DialogTitle
                              className={`text-${subject.color}-600 dark:text-${subject.color}-400 flex items-center gap-2`}
                            >
                              <div
                                className={`rounded-full bg-${subject.color}-100 dark:bg-${subject.color}-900/30 p-1.5`}
                              >
                                <BookOpen className={`h-4 w-4 text-${subject.color}-500`} />
                              </div>
                              {subject.name} Grade Details
                            </DialogTitle>
                            <DialogDescription>
                              View all assignments, scores, and trends for {subject.name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="max-h-[60vh] overflow-y-auto pr-2">
                            <div className="space-y-4">
                              {/* Grade Summary */}
                              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                <div>
                                  <p className="text-sm font-medium">Current Grade</p>
                                  <p
                                    className={`text-2xl font-bold text-${subject.color}-600 dark:text-${subject.color}-400`}
                                  >
                                    {subject.grade}
                                  </p>
                                </div>
                                <Badge
                                  className={`bg-${subject.color}-100 text-${subject.color}-800 dark:bg-${subject.color}-900/30 dark:text-${subject.color}-300 border-${subject.color}-200 dark:border-${subject.color}-800`}
                                >
                                  {subject.progress >= 90
                                    ? "Excellent"
                                    : subject.progress >= 80
                                      ? "On Track"
                                      : subject.progress >= 70
                                        ? "Satisfactory"
                                        : "Needs Improvement"}
                                </Badge>
                              </div>

                              {/* Mini Trend Chart */}
                              <div className="p-3 rounded-lg bg-muted/30">
                                <p className="text-sm font-medium mb-2">Grade Trend</p>
                                <div className="h-[100px] relative">
                                  <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                                    {/* Trend line */}
                                    <path
                                      d={`M 0,${100 - (getAssignmentsForSubject(subject.id)[0].score / 100) * 100} ${getAssignmentsForSubject(
                                        subject.id,
                                      )
                                        .map((assignment, i) => `L ${i * 75},${100 - (assignment.score / 100) * 100}`)
                                        .join(" ")}`}
                                      stroke={`var(--${subject.color}-500)`}
                                      strokeWidth="2"
                                      fill="none"
                                    />
                                    {/* Data points */}
                                    {getAssignmentsForSubject(subject.id).map((assignment, i) => (
                                      <circle
                                        key={i}
                                        cx={i * 75}
                                        cy={100 - (assignment.score / 100) * 100}
                                        r="3"
                                        fill={`var(--${subject.color}-500)`}
                                      />
                                    ))}
                                  </svg>
                                </div>
                              </div>

                              {/* Assignment List */}
                              <div>
                                <p className="text-sm font-medium mb-2">Assignments</p>
                                <div className="space-y-2">
                                  {getAssignmentsForSubject(subject.id).map((assignment) => {
                                    // Determine if this is highest or lowest score
                                    const assignments = getAssignmentsForSubject(subject.id)
                                    const highestScore = Math.max(...assignments.map((a) => a.score))
                                    const lowestScore = Math.min(...assignments.map((a) => a.score))
                                    const isHighest = assignment.score === highestScore
                                    const isLowest = assignment.score === lowestScore

                                    return (
                                      <div
                                        key={assignment.id}
                                        className={`p-3 rounded-lg border ${
                                          isHighest
                                            ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                                            : isLowest
                                              ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"
                                              : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/20"
                                        }`}
                                      >
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <p className="font-medium">{assignment.title}</p>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                              <span>{assignment.date}</span>
                                              <span>•</span>
                                              <Badge variant="outline">{assignment.type}</Badge>
                                              {assignment.weight && <span>Weight: {assignment.weight}%</span>}
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <div
                                              className={`text-lg font-bold ${
                                                isHighest
                                                  ? "text-green-600 dark:text-green-400"
                                                  : isLowest
                                                    ? "text-amber-600 dark:text-amber-400"
                                                    : ""
                                              }`}
                                            >
                                              {assignment.score}%
                                            </div>
                                            {isHighest && (
                                              <span className="text-xs text-green-600 dark:text-green-400">
                                                Highest
                                              </span>
                                            )}
                                            {isLowest && (
                                              <span className="text-xs text-amber-600 dark:text-amber-400">Lowest</span>
                                            )}
                                          </div>
                                        </div>
                                        {assignment.comment && (
                                          <div className="mt-2 text-sm p-2 rounded bg-muted/50">
                                            <span className="font-medium">Teacher Comment:</span> {assignment.comment}
                                          </div>
                                        )}
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                          <DialogFooter className="flex flex-col sm:flex-row gap-2">
                            <Button variant="outline">Close</Button>
                            <Button
                              className={`bg-gradient-to-r from-${subject.color}-500 to-${subject.color}-600 hover:from-${subject.color}-600 hover:to-${subject.color}-700`}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Export Subject Grades
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Generate Grade Report
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-amber-500" />
                    Grade Trends
                  </CardTitle>
                  <CardDescription>Performance over time</CardDescription>
                </div>
                <Select value={gradeTimeframe} onValueChange={setGradeTimeframe}>
                  <SelectTrigger className="w-[180px] bg-white/80 dark:bg-gray-900/50">
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Past 30 Days</SelectItem>
                    <SelectItem value="semester">This Semester</SelectItem>
                    <SelectItem value="year">Year-to-Date</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] relative">
                  {/* Sample Grade Trends Chart */}
                  <div className="absolute inset-0 flex flex-col">
                    {/* X-axis labels */}
                    <div className="flex justify-between text-xs text-muted-foreground mt-auto mb-2">
                      <div>Jan</div>
                      <div>Feb</div>
                      <div>Mar</div>
                      <div>Apr</div>
                      <div>May</div>
                    </div>

                    {/* Chart area */}
                    <div className="flex-1 relative border-b border-l">
                      {/* Y-axis labels */}
                      <div className="absolute -left-6 inset-y-0 flex flex-col justify-between text-xs text-muted-foreground">
                        <div>100%</div>
                        <div>80%</div>
                        <div>60%</div>
                        <div>40%</div>
                        <div>0%</div>
                      </div>

                      {/* Chart lines - one per subject */}
                      <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                        {subjects.map((subject, index) => {
                          // Generate some sample data points
                          const points = [
                            { x: 0, y: 70 + Math.random() * 20 },
                            { x: 100, y: 75 + Math.random() * 20 },
                            { x: 200, y: 80 + Math.random() * 15 },
                            { x: 300, y: 85 + Math.random() * 10 },
                            { x: 400, y: subject.progress },
                          ]

                          // Create path
                          const pathData = `M ${points[0].x},${200 - (points[0].y / 100) * 200} ${points
                            .slice(1)
                            .map((p) => `L ${p.x},${200 - (p.y / 100) * 200}`)
                            .join(" ")}`

                          // Colors based on subject
                          const colors = {
                            blue: "#3b82f6",
                            green: "#10b981",
                            purple: "#8b5cf6",
                            amber: "#f59e0b",
                            pink: "#ec4899",
                          }

                          return (
                            <g key={subject.id}>
                              <path d={pathData} stroke={colors[subject.color]} strokeWidth="2" fill="none" />
                              {points.map((point, i) => (
                                <circle
                                  key={i}
                                  cx={point.x}
                                  cy={200 - (point.y / 100) * 200}
                                  r="3"
                                  fill={colors[subject.color]}
                                />
                              ))}
                            </g>
                          )
                        })}
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="flex items-center gap-1.5">
                      <div className={`w-3 h-3 rounded-full bg-${subject.color}-500`}></div>
                      <span className="text-sm">{subject.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Attendance Summary
                </CardTitle>
                <CardDescription>Overview of attendance statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <div className="rounded-lg border bg-white/80 dark:bg-gray-900/50 p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">92%</div>
                    <div className="text-sm text-muted-foreground">Overall Attendance</div>
                  </div>
                  <div className="rounded-lg border bg-white/80 dark:bg-gray-900/50 p-4 text-center">
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">2</div>
                    <div className="text-sm text-muted-foreground">Absences This Month</div>
                  </div>
                  <div className="rounded-lg border bg-white/80 dark:bg-gray-900/50 p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">15</div>
                    <div className="text-sm text-muted-foreground">Consecutive Days Present</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-7 gap-2 text-center">
                    <div className="font-medium">Mon</div>
                    <div className="font-medium">Tue</div>
                    <div className="font-medium">Wed</div>
                    <div className="font-medium">Thu</div>
                    <div className="font-medium">Fri</div>
                    <div className="font-medium">Sat</div>
                    <div className="font-medium">Sun</div>
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 28 }).map((_, i) => {
                      // Simulate some attendance patterns
                      const isPresent = i % 7 !== 5 && i % 7 !== 6 && i !== 3 && i !== 17
                      return (
                        <div
                          key={i}
                          className={`h-10 rounded-md flex items-center justify-center ${
                            isPresent
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                              : i % 7 === 5 || i % 7 === 6
                                ? "bg-muted/30"
                                : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                          }`}
                        >
                          {i + 1}
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex justify-center gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">Present</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <span className="text-sm">Absent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-muted"></div>
                      <span className="text-sm">Weekend/Holiday</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href="/parent/calendar">
                        <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                          View Full Calendar
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Open full academic and attendance calendar</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="overflow-hidden border-none shadow-md bg-white dark:bg-gray-950/50 rounded-xl hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-purple-500" />
                      Activity Log
                    </CardTitle>
                    <CardDescription>Recent learning activities and submissions</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Search activities..."
                      className="max-w-[200px] bg-muted/30"
                      startIcon={<Search className="h-4 w-4 text-muted-foreground" />}
                    />
                    <Button variant="outline" size="icon" className="h-9 w-9">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Submitted Math Assignment</p>
                        <p className="text-sm text-muted-foreground">Linear Equations Worksheet</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">Today</Badge>
                      <p className="text-sm text-muted-foreground">9:45 AM</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Completed Science Reading</p>
                        <p className="text-sm text-muted-foreground">Chapter 5: Genetics</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">Yesterday</Badge>
                      <p className="text-sm text-muted-foreground">2:30 PM</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Submitted English Essay</p>
                        <p className="text-sm text-muted-foreground">Analysis of "To Kill a Mockingbird"</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">2 days ago</Badge>
                      <p className="text-sm text-muted-foreground">11:15 AM</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Completed History Quiz</p>
                        <p className="text-sm text-muted-foreground">American Revolution</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">3 days ago</Badge>
                      <p className="text-sm text-muted-foreground">1:45 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={`/parent/students/${currentStudentId}/activity-log`} className="w-full">
                        <Button
                          variant="outline"
                          className="w-full gap-2 hover:bg-muted/50 transition-all hover:shadow-md"
                        >
                          View All Activity
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>See full history of submissions, logins, and participation</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-xl hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  Time Spent by Subject
                </CardTitle>
                <CardDescription>Hours spent on each subject this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="font-medium flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full bg-${subject.color}-500`}></div>
                          {subject.name}
                        </div>
                        <div className="text-sm text-muted-foreground">{Math.floor(subject.progress / 10)} hours</div>
                      </div>
                      <Progress
                        value={subject.progress / 2}
                        className="h-2"
                        indicatorClassName={`bg-gradient-to-r from-${subject.color}-500 to-${subject.color}-600`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
