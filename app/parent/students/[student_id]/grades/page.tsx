"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  BookOpen,
  Calculator,
  Beaker,
  History,
  Upload,
  Download,
  FileText,
  PlusCircle,
  Calendar,
  BarChart3,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"

export default function StudentGradesPage() {
  const params = useParams()
  const studentId = params.student_id as string

  const [activeTab, setActiveTab] = useState("overview")
  const [uploadMode, setUploadMode] = useState(false)
  const [autoExtract, setAutoExtract] = useState(true)

  // Mock student data
  const student = {
    id: studentId,
    name: studentId === "1" ? "Emma Johnson" : "Noah Smith",
    grade: studentId === "1" ? "5th Grade" : "3rd Grade",
    avatar: "/placeholder.svg?height=40&width=40",
  }

  // Mock grades data
  const grades = [
    {
      id: 1,
      subject: "Science",
      icon: <Beaker className="h-5 w-5" />,
      assignments: [
        { id: 101, title: "Solar System Project", type: "Project", score: "A", date: "Apr 15, 2025", reviewed: true },
        { id: 102, title: "States of Matter Quiz", type: "Quiz", score: "B+", date: "Apr 5, 2025", reviewed: true },
        { id: 103, title: "Plant Growth Lab", type: "Lab", score: "A-", date: "Mar 28, 2025", reviewed: true },
      ],
      average: 92,
      color: "emerald",
    },
    {
      id: 2,
      subject: "Mathematics",
      icon: <Calculator className="h-5 w-5" />,
      assignments: [
        { id: 201, title: "Fractions Test", type: "Test", score: "B", date: "Apr 14, 2025", reviewed: true },
        { id: 202, title: "Geometry Worksheet", type: "Worksheet", score: "A", date: "Apr 7, 2025", reviewed: true },
        {
          id: 203,
          title: "Multiplication Speed Drill",
          type: "Quiz",
          score: "A-",
          date: "Mar 31, 2025",
          reviewed: false,
        },
      ],
      average: 88,
      color: "blue",
    },
    {
      id: 3,
      subject: "English",
      icon: <BookOpen className="h-5 w-5" />,
      assignments: [
        { id: 301, title: "Book Report", type: "Project", score: "A+", date: "Apr 12, 2025", reviewed: true },
        { id: 302, title: "Vocabulary Quiz", type: "Quiz", score: "B+", date: "Apr 8, 2025", reviewed: false },
        { id: 303, title: "Grammar Worksheet", type: "Worksheet", score: "A-", date: "Apr 1, 2025", reviewed: true },
      ],
      average: 94,
      color: "violet",
    },
    {
      id: 4,
      subject: "History",
      icon: <History className="h-5 w-5" />,
      assignments: [
        { id: 401, title: "Civil War Essay", type: "Essay", score: "B+", date: "Apr 10, 2025", reviewed: true },
        { id: 402, title: "Timeline Project", type: "Project", score: "A", date: "Mar 25, 2025", reviewed: true },
      ],
      average: 89,
      color: "amber",
    },
  ]

  // Calculate overall average
  const overallAverage = grades.reduce((sum, subject) => sum + subject.average, 0) / grades.length

  // Get all assignments across subjects
  const allAssignments = grades
    .flatMap((subject) =>
      subject.assignments.map((assignment) => ({
        ...assignment,
        subject: subject.subject,
        subjectIcon: subject.icon,
        color: subject.color,
      })),
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="container mx-auto py-6 space-y-8 animate-fadeIn">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Student Gradebook</h1>
        <p className="text-muted-foreground">
          Review and manage grades for {student.name} ({student.grade})
        </p>
      </div>

      {/* Quick Navigation */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 rounded-xl shadow-sm">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
            className="bg-white/80 dark:bg-slate-800/80 hover:bg-white hover:text-blue-600 transition-all"
            onClick={() => (window.location.href = "/parent")}
          >
            Parent Dashboard
          </Button>
          <Button
            variant="ghost"
            className="bg-white/80 dark:bg-slate-800/80 hover:bg-white hover:text-blue-600 transition-all"
            onClick={() => (window.location.href = `/parent/students/${studentId}/schedule`)}
          >
            Schedule View
          </Button>
          <Button
            variant="ghost"
            className="bg-white/80 dark:bg-slate-800/80 hover:bg-white hover:text-blue-600 transition-all"
            onClick={() => (window.location.href = `/parent/students/${studentId}/reflection`)}
          >
            Reflection Review
          </Button>
          <Button
            variant="ghost"
            className="bg-white/80 dark:bg-slate-800/80 hover:bg-white hover:text-blue-600 transition-all"
            onClick={() => (window.location.href = "/parent/feedback")}
          >
            Feedback & Reviews
          </Button>
          <Button
            variant="ghost"
            className="bg-white/80 dark:bg-slate-800/80 hover:bg-white hover:text-blue-600 transition-all"
            onClick={() => (window.location.href = "/parent/students")}
          >
            All Students
          </Button>
        </div>
      </div>

      {/* Student Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-3 border-none shadow-md overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-white">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <CardTitle>{student.name}</CardTitle>
                  <CardDescription className="text-blue-100">
                    {student.grade} • Student ID: {student.id}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm text-blue-100">Overall Average</div>
                  <div className="text-2xl font-bold">{overallAverage.toFixed(1)}%</div>
                </div>
                <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center">
                  <div className="text-blue-600 font-bold text-xl">
                    {overallAverage >= 90
                      ? "A"
                      : overallAverage >= 80
                        ? "B"
                        : overallAverage >= 70
                          ? "C"
                          : overallAverage >= 60
                            ? "D"
                            : "F"}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-100"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="recent"
            className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-900 dark:data-[state=active]:text-indigo-100"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Recent Grades
          </TabsTrigger>
          <TabsTrigger
            value="upload"
            className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 dark:data-[state=active]:bg-violet-900 dark:data-[state=active]:text-violet-100"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Work
          </TabsTrigger>
          <TabsTrigger
            value="add"
            className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900 dark:data-[state=active]:text-emerald-100"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Grade
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {grades.map((subject) => (
              <Card key={subject.id} className="border-none shadow-md overflow-hidden">
                <CardHeader className={`bg-${subject.color}-500 text-white`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-full bg-${subject.color}-400`}>{subject.icon}</div>
                      <CardTitle>{subject.subject}</CardTitle>
                    </div>
                    <div className="text-2xl font-bold">{subject.average}%</div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {subject.assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-lg border"
                      >
                        <div>
                          <div className="font-medium">{assignment.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {assignment.type} • {assignment.date}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`text-lg font-bold text-${subject.color}-600 dark:text-${subject.color}-400`}>
                            {assignment.score}
                          </div>
                          {assignment.reviewed ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-slate-50 dark:bg-slate-800/50 p-4 flex justify-between">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              <CardTitle>Progress Tracker</CardTitle>
              <CardDescription className="text-indigo-100">Subject progress throughout the school year</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {grades.map((subject) => (
                  <div key={subject.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-1.5 rounded-full bg-${subject.color}-100 text-${subject.color}-700 dark:bg-${subject.color}-900 dark:text-${subject.color}-300`}
                        >
                          {subject.icon}
                        </div>
                        <span className="font-medium">{subject.subject}</span>
                      </div>
                      <span className="font-medium">{subject.average}%</span>
                    </div>
                    <Progress
                      value={subject.average}
                      className={`h-2 bg-slate-100 dark:bg-slate-700`}
                      indicatorClassName={`bg-${subject.color}-500`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Grades</CardTitle>
                  <CardDescription className="text-indigo-100">Latest assignments across all subjects</CardDescription>
                </div>
                <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {allAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center gap-4 p-3 rounded-lg border bg-white dark:bg-slate-800 hover:shadow-md transition-all"
                  >
                    <div
                      className={`p-2 rounded-full bg-${assignment.color}-100 text-${assignment.color}-700 dark:bg-${assignment.color}-900 dark:text-${assignment.color}-300`}
                    >
                      {assignment.subjectIcon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{assignment.title}</h4>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-lg font-bold text-${assignment.color}-600 dark:text-${assignment.color}-400`}
                          >
                            {assignment.score}
                          </span>
                          {assignment.reviewed ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm text-muted-foreground">
                          {assignment.subject} • {assignment.type}
                        </p>
                        <p className="text-sm text-muted-foreground">{assignment.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
              <CardTitle>Upload Graded Work</CardTitle>
              <CardDescription className="text-violet-100">
                Upload assignments, tests, and projects for automatic grade extraction
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-10 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-10 w-10 text-slate-400" />
                    <h3 className="font-medium text-lg">Drag and drop files here</h3>
                    <p className="text-sm text-muted-foreground">Support for PDF, JPG, PNG, and DOC files</p>
                    <Button className="mt-4">Browse Files</Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="auto-extract"
                    checked={autoExtract}
                    onCheckedChange={(checked) => setAutoExtract(checked as boolean)}
                  />
                  <Label
                    htmlFor="auto-extract"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Auto-extract grade from file (recommended)
                  </Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select defaultValue="science">
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="math">Mathematics</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assignment-type">Assignment Type</Label>
                    <Select defaultValue="quiz">
                      <SelectTrigger id="assignment-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="test">Test</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                        <SelectItem value="essay">Essay</SelectItem>
                        <SelectItem value="worksheet">Worksheet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload and Process
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
              <CardTitle>Recently Uploaded</CardTitle>
              <CardDescription className="text-emerald-100">Files uploaded in the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-lg border bg-white dark:bg-slate-800">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Math_Test_April.pdf</h4>
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                      >
                        Processed
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Mathematics • Test</p>
                      <p className="text-sm text-muted-foreground">Apr 14, 2025</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-lg border bg-white dark:bg-slate-800">
                  <div className="p-2 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Book_Report_Charlotte.docx</h4>
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                      >
                        Processed
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">English • Project</p>
                      <p className="text-sm text-muted-foreground">Apr 12, 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add" className="space-y-6">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-green-500 text-white">
              <CardTitle>Add New Grade</CardTitle>
              <CardDescription className="text-emerald-100">
                Manually enter a new grade for this student
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="add-subject">Subject</Label>
                    <Select>
                      <SelectTrigger id="add-subject">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="math">Mathematics</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="add-type">Assignment Type</Label>
                    <Select>
                      <SelectTrigger id="add-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="test">Test</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                        <SelectItem value="essay">Essay</SelectItem>
                        <SelectItem value="worksheet">Worksheet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assignment-title">Assignment Title</Label>
                    <Input id="assignment-title" placeholder="Enter assignment title" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assignment-date">Date</Label>
                    <Input id="assignment-date" type="date" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grade-score">Score or Grade</Label>
                    <Input id="grade-score" placeholder="e.g., 95% or A" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-points">Maximum Points (Optional)</Label>
                    <Input id="max-points" placeholder="e.g., 100" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comments">Comments (Optional)</Label>
                  <Textarea
                    id="comments"
                    placeholder="Add comments or feedback about this assignment"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="mark-reviewed" />
                  <Label
                    htmlFor="mark-reviewed"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Mark as reviewed by parent
                  </Label>
                </div>

                <Button className="w-full">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Grade
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
