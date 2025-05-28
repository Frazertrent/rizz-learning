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
  Search,
  CheckCircle2,
  XCircle,
  BookOpen,
  Calculator,
  Beaker,
  PenTool,
  Globe,
  Palette,
  Music,
  BarChart3,
  SlidersHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for the activity log
const getMockActivityData = (studentId) => {
  return {
    id: studentId,
    name: "Enoch",
    avatar: "E",
    grade: "8th",
    activities: [
      {
        id: 1,
        type: "check-in",
        subject: "Mathematics",
        subjectIcon: "Calculator",
        date: "Apr 15, 2023",
        time: "9:15 AM",
        description: "Checked in to Mathematics",
        status: "on-time",
        details: "Started working on quadratic equations",
      },
      {
        id: 2,
        type: "submission",
        subject: "Mathematics",
        subjectIcon: "Calculator",
        date: "Apr 15, 2023",
        time: "10:45 AM",
        description: "Submitted Math Quiz",
        status: "completed",
        details: "Scored 92% on Algebra Quiz",
      },
      {
        id: 3,
        type: "check-in",
        subject: "Science",
        subjectIcon: "Beaker",
        date: "Apr 15, 2023",
        time: "11:05 AM",
        description: "Checked in to Science",
        status: "late",
        details: "5 minutes late for Biology class",
      },
      {
        id: 4,
        type: "submission",
        subject: "Science",
        subjectIcon: "Beaker",
        date: "Apr 15, 2023",
        time: "12:35 PM",
        description: "Submitted Lab Report",
        status: "completed",
        details: "Completed lab report on photosynthesis",
      },
      {
        id: 5,
        type: "check-in",
        subject: "English",
        subjectIcon: "PenTool",
        date: "Apr 14, 2023",
        time: "9:00 AM",
        description: "Checked in to English",
        status: "on-time",
        details: "Started reading 'To Kill a Mockingbird'",
      },
      {
        id: 6,
        type: "reflection",
        subject: "English",
        subjectIcon: "PenTool",
        date: "Apr 14, 2023",
        time: "10:30 AM",
        description: "Submitted Reading Reflection",
        status: "completed",
        details: "Wrote reflection on chapters 1-3",
      },
      {
        id: 7,
        type: "missed",
        subject: "History",
        subjectIcon: "Globe",
        date: "Apr 14, 2023",
        time: "1:00 PM",
        description: "Missed History Check-in",
        status: "missed",
        details: "Did not check in for scheduled History session",
      },
      {
        id: 8,
        type: "check-in",
        subject: "Art",
        subjectIcon: "Palette",
        date: "Apr 13, 2023",
        time: "9:30 AM",
        description: "Checked in to Art",
        status: "on-time",
        details: "Started self-portrait project",
      },
      {
        id: 9,
        type: "submission",
        subject: "Art",
        subjectIcon: "Palette",
        date: "Apr 13, 2023",
        time: "11:00 AM",
        description: "Uploaded Artwork",
        status: "completed",
        details: "Submitted initial sketch for self-portrait",
      },
      {
        id: 10,
        type: "check-in",
        subject: "Music",
        subjectIcon: "Music",
        date: "Apr 13, 2023",
        time: "1:30 PM",
        description: "Checked in to Music",
        status: "on-time",
        details: "Started piano practice",
      },
    ],
  }
}

// Helper function to get subject icon
const getSubjectIcon = (iconName) => {
  switch (iconName) {
    case "Calculator":
      return <Calculator className="h-4 w-4" />
    case "Beaker":
      return <Beaker className="h-4 w-4" />
    case "PenTool":
      return <PenTool className="h-4 w-4" />
    case "Globe":
      return <Globe className="h-4 w-4" />
    case "Palette":
      return <Palette className="h-4 w-4" />
    case "Music":
      return <Music className="h-4 w-4" />
    default:
      return <BookOpen className="h-4 w-4" />
  }
}

// Helper function to get activity icon
const getActivityIcon = (type) => {
  switch (type) {
    case "check-in":
      return <Clock className="h-4 w-4" />
    case "submission":
      return <FileText className="h-4 w-4" />
    case "reflection":
      return <BookOpen className="h-4 w-4" />
    case "missed":
      return <XCircle className="h-4 w-4" />
    default:
      return <CheckCircle2 className="h-4 w-4" />
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
    case "completed":
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800">
          <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
        </Badge>
      )
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

// Helper function to get activity color
const getActivityColor = (type) => {
  switch (type) {
    case "check-in":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
    case "submission":
      return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
    case "reflection":
      return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
    case "missed":
      return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
    default:
      return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300"
  }
}

export default function StudentActivityLogPage({ params }: { params: { student_id: string } }) {
  const studentId = params.student_id
  const [student, setStudent] = useState(null)
  const [filteredActivities, setFilteredActivities] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  // Initialize data
  useEffect(() => {
    const data = getMockActivityData(studentId)
    setStudent(data)
    setFilteredActivities(data.activities)
  }, [studentId])

  // Filter activities based on search and filters
  useEffect(() => {
    if (!student) return

    let filtered = [...student.activities]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (activity) =>
          activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.details.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply subject filter
    if (subjectFilter !== "all") {
      filtered = filtered.filter((activity) => activity.subject.toLowerCase() === subjectFilter.toLowerCase())
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((activity) => activity.type === typeFilter)
    }

    // Apply date filter
    if (dateFilter !== "all") {
      // This is a simplified example - in a real app, you'd use proper date filtering
      if (dateFilter === "today") {
        filtered = filtered.filter((activity) => activity.date === "Apr 15, 2023")
      } else if (dateFilter === "yesterday") {
        filtered = filtered.filter((activity) => activity.date === "Apr 14, 2023")
      } else if (dateFilter === "this-week") {
        filtered = filtered.filter((activity) =>
          ["Apr 15, 2023", "Apr 14, 2023", "Apr 13, 2023"].includes(activity.date),
        )
      }
    }

    setFilteredActivities(filtered)
  }, [student, searchQuery, subjectFilter, typeFilter, dateFilter])

  if (!student) {
    return (
      <div className="container mx-auto py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Get unique subjects for filter
  const subjects = ["all", ...new Set(student.activities.map((activity) => activity.subject.toLowerCase()))]

  // Group activities by date
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    if (!groups[activity.date]) {
      groups[activity.date] = []
    }
    groups[activity.date].push(activity)
    return groups
  }, {})

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
            <Link href={`/parent/students/${studentId}`} className="hover:text-primary transition-colors">
              {student.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">Activity Log</span>
          </div>

          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary">
              <AvatarFallback className="bg-primary/10 text-primary">{student.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500">
                {student.name}'s Activity Log
              </h1>
              <p className="text-muted-foreground">{student.grade} Grade • Track all learning activities</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/parent/students/${studentId}`}>
            <Button variant="outline" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Student
            </Button>
          </Link>
          <Button size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Export Log
          </Button>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-950/50 dark:to-gray-900/50 rounded-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white dark:bg-gray-950/50"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger className="w-[130px] bg-white dark:bg-gray-950/50">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects
                      .filter((s) => s !== "all")
                      .map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject.charAt(0).toUpperCase() + subject.slice(1)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[130px] bg-white dark:bg-gray-950/50">
                    <SelectValue placeholder="Activity Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="check-in">Check-ins</SelectItem>
                    <SelectItem value="submission">Submissions</SelectItem>
                    <SelectItem value="reflection">Reflections</SelectItem>
                    <SelectItem value="missed">Missed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[130px] bg-white dark:bg-gray-950/50">
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="icon" className="bg-white dark:bg-gray-950/50">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredActivities.length} activities
                {subjectFilter !== "all" && ` in ${subjectFilter}`}
                {typeFilter !== "all" && ` of type ${typeFilter}`}
                {dateFilter !== "all" && ` from ${dateFilter.replace("-", " ")}`}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setSubjectFilter("all")
                  setTypeFilter("all")
                  setDateFilter("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-6"
      >
        {Object.keys(groupedActivities).length === 0 ? (
          <Card className="overflow-hidden border-none shadow-md bg-white dark:bg-gray-950/50 rounded-xl">
            <CardContent className="p-12 flex flex-col items-center justify-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No activities found</h3>
              <p className="text-muted-foreground text-center max-w-md">
                No activities match your current filters. Try adjusting your search criteria or clear the filters to see
                all activities.
              </p>
            </CardContent>
          </Card>
        ) : (
          Object.keys(groupedActivities).map((date) => (
            <div key={date} className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                {date}
              </h2>

              <div className="space-y-3">
                {groupedActivities[date].map((activity) => (
                  <motion.div key={activity.id} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                    <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all rounded-xl">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={`rounded-full p-3 ${getActivityColor(activity.type)}`}>
                            {getActivityIcon(activity.type)}
                          </div>

                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                              <div className="font-medium">{activity.description}</div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="flex items-center gap-1">
                                  {getSubjectIcon(activity.subjectIcon)}
                                  <span>{activity.subject}</span>
                                </Badge>
                                {getStatusBadge(activity.status)}
                              </div>
                            </div>

                            <div className="text-sm text-muted-foreground mb-2">{activity.time}</div>

                            <p className="text-sm">{activity.details}</p>

                            {activity.type === "submission" && (
                              <div className="mt-3">
                                <Link
                                  href={`/parent/students/${studentId}/assignments?subject=${activity.subject.toLowerCase()}`}
                                >
                                  <Button variant="outline" size="sm">
                                    View Submission
                                  </Button>
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}
      </motion.div>

      {/* Activity Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Activity Statistics
            </CardTitle>
            <CardDescription>Summary of {student.name}'s recent activity patterns</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="bg-white/50 dark:bg-gray-950/50">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {student.activities.filter((a) => a.status === "on-time").length}
                  </div>
                  <div className="text-sm text-muted-foreground text-center">On-Time Check-ins</div>
                </CardContent>
              </Card>

              <Card className="bg-white/50 dark:bg-gray-950/50">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                    {student.activities.filter((a) => a.status === "late").length}
                  </div>
                  <div className="text-sm text-muted-foreground text-center">Late Check-ins</div>
                </CardContent>
              </Card>

              <Card className="bg-white/50 dark:bg-gray-950/50">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {student.activities.filter((a) => a.status === "missed").length}
                  </div>
                  <div className="text-sm text-muted-foreground text-center">Missed Check-ins</div>
                </CardContent>
              </Card>

              <Card className="bg-white/50 dark:bg-gray-950/50">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {student.activities.filter((a) => a.type === "submission").length}
                  </div>
                  <div className="text-sm text-muted-foreground text-center">Submissions</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
