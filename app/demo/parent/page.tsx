"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Users,
  BookOpen,
  BarChart3,
  Award,
  Shield,
  Upload,
  Settings,
  DollarSign,
  Library,
  Clock,
  CheckCircle,
  Target,
  Brain,
  BookOpenCheck,
  Cog,
  PiggyBank,
  FileCheck,
  Plus,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
// Import the Tooltip component at the top of the file
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { QuickAccessButtons } from "@/components/parent/quick-access-buttons"

export default function ParentDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState("all")

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Mock data for students
  const students = [
    { id: "tyson", name: "Tyson", status: "on-track", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "emma", name: "Emma", status: "needs-review", avatar: "/placeholder.svg?height=40&width=40" },
  ]

  // Mock data for schedule
  const scheduleItems = [
    { time: "9:00 AM", subject: "Math", student: "Tyson", activity: "Algebra Lesson 5", color: "bg-blue-500" },
    { time: "10:30 AM", subject: "Science", student: "Emma", activity: "Chemistry Lab", color: "bg-green-500" },
    { time: "1:00 PM", subject: "History", student: "Tyson", activity: "Civil War Essay", color: "bg-amber-500" },
    { time: "2:30 PM", subject: "Art", student: "Emma", activity: "Watercolor Project", color: "bg-purple-500" },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 pt-3 pb-8">
        {/* Header Row */}
        <div className="flex justify-between items-center mb-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent"
          >
            Parent Dashboard
          </motion.h1>
          <Badge
            variant="outline"
            className="bg-green-500/20 text-green-400 border-green-500/50 px-3 py-1 text-sm font-medium rounded-full flex items-center gap-1"
          >
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
            Live
          </Badge>
        </div>

        {/* Quick Access Buttons */}
        <div className="mb-6">
          <QuickAccessButtons />
        </div>

        {/* Top Overview Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 overflow-x-auto pb-4"
        >
          <div className="flex gap-4 min-w-max">
            {/* Check-In Status */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/parent/students">
                    <Card className="w-64 bg-gray-900/80 border-gray-800 hover:bg-gray-800/80 transition-all hover:shadow-lg hover:shadow-blue-900/20 cursor-pointer hover:scale-[1.02]">
                      <CardHeader className="pb-2 bg-gradient-to-r from-blue-600/20 to-blue-400/10 rounded-t-lg">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-400" />
                          Check-In Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Tyson</span>
                            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
                              On Time ✅
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Emma</span>
                            <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/50">
                              Needs Review ⚠️
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View student check-in history</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Progress Tracker */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/parent/reports">
                    <Card className="w-64 bg-gray-900/80 border-gray-800 hover:bg-gray-800/80 transition-all hover:shadow-lg hover:shadow-purple-900/20 cursor-pointer hover:scale-[1.02]">
                      <CardHeader className="pb-2 bg-gradient-to-r from-purple-600/20 to-purple-400/10 rounded-t-lg">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-purple-400" />
                          Progress Tracker
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="text-sm">Overall Progress: 72% of expected pace</div>
                          <Progress value={72} className="h-2 bg-gray-800">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                          </Progress>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open progress reports</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Today's Goals */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/parent/students">
                    <Card className="w-64 bg-gray-900/80 border-gray-800 hover:bg-gray-800/80 transition-all hover:shadow-lg hover:shadow-green-900/20 cursor-pointer hover:scale-[1.02]">
                      <CardHeader className="pb-2 bg-gradient-to-r from-green-600/20 to-green-400/10 rounded-t-lg">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Target className="h-4 w-4 text-green-400" />
                          Today's Goals
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="text-sm">2 of 3 Goals Completed</div>
                          <div className="flex gap-2">
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            <div className="h-3 w-3 rounded-full bg-gray-700"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View and manage daily goals</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* GPT Enforcement Status */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/parent/settings">
                    <Card className="w-64 bg-gray-900/80 border-gray-800 hover:bg-gray-800/80 transition-all hover:shadow-lg hover:shadow-indigo-900/20 cursor-pointer hover:scale-[1.02]">
                      <CardHeader className="pb-2 bg-gradient-to-r from-indigo-600/20 to-indigo-400/10 rounded-t-lg">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Brain className="h-4 w-4 text-indigo-400" />
                          GPT Enforcement
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="text-sm">Quality Control: Active</div>
                          <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
                            All Systems Active
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Manage GPT tone and task enforcement</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Curriculum Block Summary */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/parent/curriculum">
                    <Card className="w-64 bg-gray-900/80 border-gray-800 hover:bg-gray-800/80 transition-all hover:shadow-lg hover:shadow-cyan-900/20 cursor-pointer hover:scale-[1.02]">
                      <CardHeader className="pb-2 bg-gradient-to-r from-cyan-600/20 to-cyan-400/10 rounded-t-lg">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <BookOpenCheck className="h-4 w-4 text-cyan-400" />
                          Curriculum Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="text-sm">Today's total learning hours</div>
                          <div className="text-2xl font-bold text-cyan-400">5.5 hrs</div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit curriculum structure and platforms</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Preferences Summary */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/parent/settings">
                    <Card className="w-64 bg-gray-900/80 border-gray-800 hover:bg-gray-800/80 transition-all hover:shadow-lg hover:shadow-pink-900/20 cursor-pointer hover:scale-[1.02]">
                      <CardHeader className="pb-2 bg-gradient-to-r from-pink-600/20 to-pink-400/10 rounded-t-lg">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Cog className="h-4 w-4 text-pink-400" />
                          Preferences Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="text-sm">5 of 7 Preferences Set</div>
                          <Progress value={71} className="h-2 bg-gray-800">
                            <div className="h-full bg-gradient-to-r from-pink-500 to-red-500 rounded-full" />
                          </Progress>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <span className="text-xs text-pink-400 hover:text-pink-300">Complete Setup →</span>
                      </CardFooter>
                    </Card>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Review or update parent preferences</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Reward Budget Usage */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/parent/rewards">
                    <Card className="w-64 bg-gray-900/80 border-gray-800 hover:bg-gray-800/80 transition-all hover:shadow-lg hover:shadow-amber-900/20 cursor-pointer hover:scale-[1.02]">
                      <CardHeader className="pb-2 bg-gradient-to-r from-amber-600/20 to-amber-400/10 rounded-t-lg">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <PiggyBank className="h-4 w-4 text-amber-400" />
                          Reward Budget
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="text-sm">$15 of $25 used this week</div>
                          <Progress value={60} className="h-2 bg-gray-800">
                            <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full" />
                          </Progress>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Manage budget and motivational tools</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Review Needed */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/parent/uploads" aria-label="View student submissions needing review">
                    <Card className="w-64 bg-gray-900/80 border-gray-800 hover:bg-gray-800/80 transition-all hover:shadow-lg hover:shadow-red-900/20 cursor-pointer hover:scale-[1.02]">
                      <CardHeader className="pb-2 bg-gradient-to-r from-red-600/20 to-red-400/10 rounded-t-lg">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <FileCheck className="h-4 w-4 text-red-400" />
                          Review Needed
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="text-sm">1 submission needs your review</div>
                          <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/50">
                            Emma's History Essay
                          </Badge>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <span className="text-xs text-red-400 hover:text-red-300">Review Now →</span>
                      </CardFooter>
                    </Card>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Review submitted student work</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </motion.div>

        {/* Student Avatars Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">Your Students</h2>
          <div className="flex gap-4 items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    onClick={() => setSelectedStudent("all")}
                    className={`flex flex-col items-center cursor-pointer transition-all ${selectedStudent === "all" ? "scale-110" : "opacity-70 hover:opacity-100"}`}
                  >
                    <Avatar className="h-16 w-16 border-2 border-gray-700 hover:border-blue-500 transition-all mb-2">
                      <AvatarFallback className="bg-blue-500/20 text-blue-400">All</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">All</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View all students</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {students.map((student) => (
              <TooltipProvider key={student.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onClick={() => setSelectedStudent(student.id)}
                      className={`flex flex-col items-center cursor-pointer transition-all ${selectedStudent === student.id ? "scale-110" : "opacity-70 hover:opacity-100"}`}
                    >
                      <Avatar className="h-16 w-16 border-2 border-gray-700 hover:border-blue-500 transition-all mb-2">
                        <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                        <AvatarFallback className="bg-purple-500/20 text-purple-400">{student.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{student.name}</span>
                      <Badge
                        variant="outline"
                        className={`mt-1 text-xs ${
                          student.status === "on-track"
                            ? "bg-green-500/20 text-green-400 border-green-500/50"
                            : "bg-amber-500/20 text-amber-400 border-amber-500/50"
                        }`}
                      >
                        {student.status === "on-track" ? "On Track" : "Needs Review"}
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Focus view on {student.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/parent/students" className="block">
                    <div className="flex flex-col items-center cursor-pointer opacity-70 hover:opacity-100 transition-all">
                      <div className="h-16 w-16 rounded-full bg-gray-800/50 border-2 border-dashed border-gray-700 hover:border-blue-500 transition-all flex items-center justify-center mb-2">
                        <Plus className="h-6 w-6 text-gray-400" />
                      </div>
                      <span className="text-sm font-medium">Add Student</span>
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add new student profile</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </motion.div>

        {/* Schedule Snapshot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <Card className="bg-gray-900/80 border-gray-800">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-400" />
                  Today's Schedule
                </CardTitle>
                <Link href="/parent/curriculum">
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
                    View Full Calendar
                  </Button>
                </Link>
              </div>
              <CardDescription>
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scheduleItems.map((item, index) => (
                  <Link key={index} href="/parent/curriculum">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all cursor-pointer group hover:scale-[1.01]">
                      <div
                        className={`h-10 w-10 rounded-md ${item.color} flex items-center justify-center text-white font-medium`}
                      >
                        {item.subject[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div className="font-medium">{item.subject}</div>
                          <div className="text-sm text-gray-400">{item.time}</div>
                        </div>
                        <div className="text-sm text-gray-400">
                          {item.activity} • {item.student}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Dashboard Tiles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Student Overview */}
            <Link href="/parent/students">
              <Card className="bg-gray-900/80 border-gray-800 hover:bg-gray-800/80 transition-all hover:shadow-lg hover:shadow-blue-900/20 cursor-pointer hover:scale-[1.02] h-full">
                <CardHeader className="pb-2 bg-gradient-to-r from-blue-600/20 to-blue-400/10 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-400" />
                    Student Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-400 mb-4">
                    Manage profiles, track progress, and adjust learning paths for each student.
                  </p>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500">
                    View Students
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Curriculum */}
            <Link href="/parent/curriculum">
              <Card className="bg-gray-900/80 border-gray-800 hover:bg-gray-800/80 transition-all hover:shadow-lg hover:shadow-green-900/20 cursor-pointer hover:scale-[1.02] h-full">
                <CardHeader className="pb-2 bg-gradient-to-r from-green-600/20 to-green-400/10 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-green-400" />
                    Curriculum
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-400 mb-4">
                    Organize courses, set schedules, and manage learning resources.
                  </p>
                  <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500">
                    View Curriculum
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Reports */}
            <Link href="/parent/reports">
              <Card className="bg-gray-900/80 border-gray-800 hover:bg-gray-800/80 transition-all hover:shadow-lg hover:shadow-purple-900/20 cursor-pointer hover:scale-[1.02] h-full">
                <CardHeader className="pb-2 bg-gradient-to-r from-purple-600/20 to-purple-400/10 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-400" />
                    Reports
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-400 mb-4">
                    View detailed progress reports and learning analytics for each student.
                  </p>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500">
                    View Reports
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Rewards */}
            <Link href="/parent/rewards">
              <Card className="bg-gray-900/80 border-gray-800 hover:bg-gray-800/80 transition-all hover:shadow-lg hover:shadow-amber-900/20 cursor-pointer hover:scale-[1.02] h-full">
                <CardHeader className="pb-2 bg-gradient-to-r from-amber-600/20 to-amber-400/10 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-400" />
                    Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-400 mb-4">
                    Manage reward systems, set incentives, and track student achievements.
                  </p>
                  <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500">
                    View Rewards
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Safety Panel */}
            <Link href="/parent/safety">
              <Card className="bg-gray-900/80 border-gray-800 hover:bg-gray-800/80 transition-all hover:shadow-lg hover:shadow-red-900/20 cursor-pointer hover:scale-[1.02] h-full">
                <CardHeader className="pb-2 bg-gradient-to-r from-red-600/20 to-red-400/10 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-400" />
                    Safety Panel
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-400 mb-4">
                    Configure content filters, set usage limits, and monitor online activity.
                  </p>
                  <Button className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500">
                    View Safety
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Uploads */}
            <Link href="/parent/uploads">
              <Card className="bg-gray-900/80 border-gray-800 hover:bg-gray-800/80 transition-all hover:shadow-lg hover:shadow-cyan-900/20 cursor-pointer hover:scale-[1.02] h-full">
                <CardHeader className="pb-2 bg-gradient-to-r from-cyan-600/20 to-cyan-400/10 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-cyan-400" />
                    Uploads
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-400 mb-4">
                    Upload and manage learning materials, assignments, and resources.
                  </p>
                  <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500">
                    View Uploads
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* System Preferences */}
            <Link href="/parent/settings">
              <Card className="bg-gray-900/80 border-gray-800 hover:bg-gray-800/80 transition-all hover:shadow-lg hover:shadow-indigo-900/20 cursor-pointer hover:scale-[1.02] h-full">
                <CardHeader className="pb-2 bg-gradient-to-r from-indigo-600/20 to-indigo-400/10 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-indigo-400" />
                    System Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-400 mb-4">
                    Configure system settings, notifications, and personalization options.
                  </p>
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500">
                    View Settings
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Financial Tools */}
            <Link href="/parent/financial">
              <Card className="bg-gray-900/80 border-gray-800 hover:bg-gray-800/80 transition-all hover:shadow-lg hover:shadow-emerald-900/20 cursor-pointer hover:scale-[1.02] h-full">
                <CardHeader className="pb-2 bg-gradient-to-r from-emerald-600/20 to-emerald-400/10 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-emerald-400" />
                    Financial Tools
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-400 mb-4">
                    Manage budgets, track expenses, and access grant information.
                  </p>
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500">
                    View Finances
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Resource Library */}
            <Link href="/parent/resources">
              <Card className="bg-gray-900/80 border-gray-800 hover:bg-gray-800/80 transition-all hover:shadow-lg hover:shadow-pink-900/20 cursor-pointer hover:scale-[1.02] h-full">
                <CardHeader className="pb-2 bg-gradient-to-r from-pink-600/20 to-pink-400/10 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Library className="h-5 w-5 text-pink-400" />
                    Resource Library
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-400 mb-4">
                    Access educational resources, guides, and supplementary materials.
                  </p>
                  <Button className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500">
                    View Resources
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
