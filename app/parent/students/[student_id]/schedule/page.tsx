"use client"

import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Filter,
  MessageSquare,
  PaperclipIcon,
  Plus,
  RefreshCw,
  XCircle,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"

// First, add imports for the Dialog components and other UI elements we'll need
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data - would come from a database in a real application
const getStudentData = (id: string) => {
  return {
    id,
    name: "Enoch",
    avatar: "/placeholder.svg?height=40&width=40",
    schedule: [
      {
        id: "sch-1",
        date: "Monday, May 15, 2024",
        blocks: [
          {
            id: "blk-1",
            subject: "Mathematics",
            icon: "🔢",
            time: "9:00 AM - 10:30 AM",
            status: "on-time",
            summary:
              "Completed quadratic equations worksheet and watched video on factoring. I understand the concept but need more practice with complex problems.",
            score: 85,
            feedback:
              "Good progress on quadratics! Try the extra practice problems I assigned to build more confidence with the complex examples.",
            needsReview: true,
          },
          {
            id: "blk-2",
            subject: "Science",
            icon: "🧪",
            time: "11:00 AM - 12:30 PM",
            status: "late",
            summary:
              "Finished lab on photosynthesis. Had trouble with the data collection part but figured it out eventually.",
            score: 78,
            feedback: "Your lab report needs more detail in the methodology section. Please revise and resubmit.",
            needsReview: true,
          },
        ],
      },
      {
        id: "sch-2",
        date: "Tuesday, May 16, 2024",
        blocks: [
          {
            id: "blk-3",
            subject: "History",
            icon: "🏛️",
            time: "9:00 AM - 10:30 AM",
            status: "on-time",
            summary:
              "Read chapter on Ancient Rome and completed timeline activity. Found the section on Roman engineering particularly interesting.",
            score: 92,
            feedback:
              "Excellent work on the timeline! Your observations about Roman engineering show good critical thinking.",
            needsReview: false,
          },
          {
            id: "blk-4",
            subject: "English",
            icon: "📚",
            time: "11:00 AM - 12:30 PM",
            status: "missed",
            summary: "",
            score: null,
            feedback: "",
            needsReview: true,
          },
        ],
      },
      {
        id: "sch-3",
        date: "Wednesday, May 17, 2024",
        blocks: [
          {
            id: "blk-5",
            subject: "Art",
            icon: "🎨",
            time: "9:00 AM - 10:30 AM",
            status: "on-time",
            summary: "Completed color theory project and started on perspective drawing exercises.",
            score: 90,
            feedback:
              "Your color wheel shows excellent understanding of color relationships. For the perspective drawings, remember to establish your vanishing points first.",
            needsReview: false,
          },
          {
            id: "blk-6",
            subject: "Physical Education",
            icon: "🏃",
            time: "11:00 AM - 12:30 PM",
            status: "on-time",
            summary:
              "Completed 30 minutes of cardio and strength training exercises. Tracked progress in fitness journal.",
            score: 95,
            feedback: "Great job maintaining your fitness routine! Your consistency is paying off.",
            needsReview: false,
          },
        ],
      },
    ],
  }
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  if (status === "on-time") {
    return (
      <Badge className="bg-green-100 text-green-800 border-green-300 flex items-center">
        <CheckCircle className="h-3 w-3 mr-1" /> On Time
      </Badge>
    )
  } else if (status === "late") {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 flex items-center">
        <Clock className="h-3 w-3 mr-1" /> Late
      </Badge>
    )
  } else {
    return (
      <Badge className="bg-red-100 text-red-800 border-red-300 flex items-center">
        <XCircle className="h-3 w-3 mr-1" /> Missed
      </Badge>
    )
  }
}

export default function StudentSchedulePage({ params }: { params: { student_id: string } }) {
  const { student_id } = params
  const studentData = getStudentData(student_id)

  // Count items needing review
  const reviewCount = studentData.schedule.reduce((count, day) => {
    return count + day.blocks.filter((block) => block.needsReview).length
  }, 0)

  // State for filters
  const [statusFilter, setStatusFilter] = useState("all")
  const [subjectFilter, setSubjectFilter] = useState("all")

  // Add state for the submission modal
  const [showSubmissionModal, setShowSubmissionModal] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState<any>(null)

  // Get unique subjects for filter
  const subjects = Array.from(new Set(studentData.schedule.flatMap((day) => day.blocks.map((block) => block.subject))))

  // Add a function to open the submission modal
  const openSubmissionModal = (block: any) => {
    setSelectedBlock(block)
    setShowSubmissionModal(true)
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      {/* Header with navigation */}
      <div className="mb-8">
        <Link
          href="/parent/students"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Students
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center">
            <Avatar className="h-16 w-16 mr-4 border-4 border-purple-200 shadow-lg">
              <AvatarImage src={studentData.avatar || "/placeholder.svg"} alt={studentData.name} />
              <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xl">
                {studentData.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                {studentData.name}'s Schedule
              </h1>
              <p className="text-gray-600 flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                Weekly Overview
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href={`/parent/students/${student_id}/progress`}>
              <Button
                variant="outline"
                className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 transition-all duration-300"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Live Progress
              </Button>
            </Link>

            <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-md">
              <Download className="mr-2 h-4 w-4" />
              Export Weekly Summary
            </Button>
          </div>
        </div>
      </div>

      {/* Alert for items needing review */}
      {reviewCount > 0 && (
        <Card className="mb-6 border-2 border-orange-300 shadow-lg rounded-xl overflow-hidden animate-pulse-slow">
          <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Badge variant="outline" className="bg-orange-500 text-white border-none px-3 py-1">
                  Action Needed
                </Badge>
                <h2 className="text-xl font-semibold ml-3 text-orange-800">
                  {reviewCount} {reviewCount === 1 ? "item" : "items"} need your review
                </h2>
              </div>

              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                Jump to First Item
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="mb-6 p-4 border border-gray-200 shadow-sm rounded-xl">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="status-filter" className="text-sm font-medium mb-2 block">
              Filter by Status
            </Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status-filter" className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="on-time">On Time</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="missed">Missed</SelectItem>
                <SelectItem value="needs-review">Needs Review</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Label htmlFor="subject-filter" className="text-sm font-medium mb-2 block">
              Filter by Subject
            </Label>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger id="subject-filter" className="w-full">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject.toLowerCase()}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Label htmlFor="date-filter" className="text-sm font-medium mb-2 block">
              Date Range
            </Label>
            <Input id="date-filter" type="date" className="w-full" />
          </div>

          <Button variant="outline" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
        </div>
      </Card>

      {/* Schedule Blocks */}
      <div className="space-y-8">
        {studentData.schedule.map((day) => (
          <div key={day.id} className="animate-fade-in">
            <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              {day.date}
            </h2>

            <div className="space-y-4">
              {day.blocks.map((block) => (
                <Card
                  key={block.id}
                  className={`border-l-4 ${
                    block.status === "on-time"
                      ? "border-l-green-500"
                      : block.status === "late"
                        ? "border-l-yellow-500"
                        : "border-l-red-500"
                  } shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden`}
                >
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div className="flex items-center mb-3 md:mb-0">
                        <div className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white rounded-full p-3 mr-3 text-xl shadow-md">
                          {block.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{block.subject}</h3>
                          <p className="text-gray-500 text-sm flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {block.time}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <StatusBadge status={block.status} />

                        {block.score !== null && (
                          <Badge
                            className={`
                            ${
                              block.score >= 90
                                ? "bg-green-100 text-green-800 border-green-300"
                                : block.score >= 80
                                  ? "bg-blue-100 text-blue-800 border-blue-300"
                                  : block.score >= 70
                                    ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                    : "bg-red-100 text-red-800 border-red-300"
                            }
                          `}
                          >
                            Score: {block.score}%
                          </Badge>
                        )}

                        {block.needsReview && (
                          <Badge className="bg-purple-100 text-purple-800 border-purple-300">Needs Review</Badge>
                        )}
                      </div>
                    </div>

                    {block.status !== "missed" ? (
                      <Tabs defaultValue="summary" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                          <TabsTrigger value="summary" className="data-[state=active]:bg-blue-100">
                            Student Summary
                          </TabsTrigger>
                          <TabsTrigger value="feedback" className="data-[state=active]:bg-blue-100">
                            Feedback & Actions
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="summary" className="mt-0">
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <p className="text-gray-700">{block.summary}</p>

                            <div className="mt-4 flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 border-blue-300"
                                onClick={() => openSubmissionModal(block)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Full Submission
                              </Button>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="feedback" className="mt-0">
                          <div className="space-y-4">
                            {block.feedback ? (
                              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                <div className="flex items-start">
                                  <div className="bg-blue-600 text-white rounded-full p-2 mr-3">
                                    <MessageSquare className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-blue-800 mb-1">Mentor Feedback:</h4>
                                    <p className="text-gray-700">{block.feedback}</p>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center text-gray-500 italic">
                                No feedback provided yet
                              </div>
                            )}

                            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                              <h4 className="font-medium text-purple-800 mb-3">Parent Actions:</h4>

                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <Label htmlFor={`reviewed-${block.id}`} className="font-medium flex items-center">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                    Mark as Reviewed
                                  </Label>
                                  <Switch id={`reviewed-${block.id}`} />
                                </div>

                                <div>
                                  <Label htmlFor={`feedback-${block.id}`} className="font-medium mb-2 block">
                                    Add Feedback:
                                  </Label>
                                  <Textarea
                                    id={`feedback-${block.id}`}
                                    placeholder="Type your feedback here..."
                                    className="resize-none"
                                  />
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-orange-300 text-orange-700 hover:bg-orange-50"
                                  >
                                    <RefreshCw className="mr-1 h-3 w-3" />
                                    Request Resubmission
                                  </Button>

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                                  >
                                    <PaperclipIcon className="mr-1 h-3 w-3" />
                                    Attach File
                                  </Button>

                                  <Button
                                    size="sm"
                                    className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500"
                                  >
                                    <Plus className="mr-1 h-3 w-3" />
                                    Save Feedback
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    ) : (
                      <div className="bg-red-50 rounded-lg p-4 border border-red-200 text-center">
                        <p className="text-red-700 mb-3">This session was missed. No submission available.</p>
                        <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100">
                          Schedule Make-up Session
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Links */}
      <div className="flex flex-wrap gap-4 justify-center mt-12">
        <Link href="/parent/students">
          <Button
            variant="outline"
            className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 transition-all duration-300"
          >
            Back to Students
          </Button>
        </Link>

        <Link href="/parent/rewards">
          <Button
            variant="outline"
            className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 transition-all duration-300"
          >
            Student Rewards
          </Button>
        </Link>

        <Link href={`/parent/students/${student_id}/progress`}>
          <Button className="bg-gradient-to-r from-green-500 to-teal-400 hover:from-green-600 hover:to-teal-500 transition-all duration-300 shadow-md">
            View Progress Report
          </Button>
        </Link>
      </div>

      {/* Submission Modal */}
      <Dialog open={showSubmissionModal} onOpenChange={setShowSubmissionModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedBlock && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center">
                  <span className="text-2xl mr-2">{selectedBlock.icon}</span>
                  Submission Details: {selectedBlock.subject} -{" "}
                  {studentData.schedule
                    .find((day) => day.blocks.find((block) => block.id === selectedBlock.id))
                    ?.date.split(",")[1]
                    .trim()}
                </DialogTitle>
                <DialogDescription className="flex flex-wrap gap-2 mt-2">
                  <div className="text-gray-600 font-medium">
                    {
                      studentData.schedule.find((day) => day.blocks.find((block) => block.id === selectedBlock.id))
                        ?.date
                    }{" "}
                    | {selectedBlock.time}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <StatusBadge status={selectedBlock.status} />
                    {selectedBlock.score !== null && (
                      <Badge
                        className={`
                        ${
                          selectedBlock.score >= 90
                            ? "bg-green-100 text-green-800 border-green-300"
                            : selectedBlock.score >= 80
                              ? "bg-blue-100 text-blue-800 border-blue-300"
                              : selectedBlock.score >= 70
                                ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                : "bg-red-100 text-red-800 border-red-300"
                        }
                      `}
                      >
                        Score: {selectedBlock.score}%
                      </Badge>
                    )}
                    {selectedBlock.needsReview && (
                      <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                        <Eye className="h-3 w-3 mr-1" />
                        Needs Review
                      </Badge>
                    )}
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 my-4">
                {/* Submission Summary */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Student Summary</h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700">{selectedBlock.summary}</p>
                  </div>
                </div>

                <Separator />

                {/* Attached Files */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Submitted Files</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center p-3 border rounded-lg bg-white hover:shadow-md transition-shadow">
                      <div className="bg-blue-100 p-2 rounded-lg mr-3">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Quadratic_Equations_Worksheet.pdf</p>
                        <p className="text-sm text-gray-500">PDF • 2.4 MB</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                    <div className="flex items-center p-3 border rounded-lg bg-white hover:shadow-md transition-shadow">
                      <div className="bg-green-100 p-2 rounded-lg mr-3">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Math_Notes.docx</p>
                        <p className="text-sm text-gray-500">DOCX • 1.1 MB</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Feedback Panel */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Feedback & Actions</h3>
                  <div className="space-y-4">
                    {selectedBlock.feedback ? (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-start">
                          <div className="bg-blue-600 text-white rounded-full p-2 mr-3">
                            <MessageSquare className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium text-blue-800 mb-1">Mentor Feedback:</h4>
                            <p className="text-gray-700">{selectedBlock.feedback}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center text-gray-500 italic">
                        No feedback provided yet
                      </div>
                    )}

                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <h4 className="font-medium text-purple-800 mb-3">Parent Actions:</h4>

                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="parent-feedback" className="font-medium mb-2 block">
                            Leave feedback:
                          </Label>
                          <Textarea
                            id="parent-feedback"
                            placeholder="Type your feedback here..."
                            className="resize-none"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="reviewed-submission" className="font-medium flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Mark as Reviewed
                          </Label>
                          <Switch id="reviewed-submission" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Score + Rubric */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Score & Rubric</h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="override-score" className="font-medium mb-2 block">
                          Override Score (optional):
                        </Label>
                        <div className="flex items-center">
                          <Input
                            id="override-score"
                            type="number"
                            min="0"
                            max="100"
                            placeholder="Enter score"
                            className="w-24 mr-2"
                          />
                          <span className="text-gray-500">/ 100</span>
                        </div>
                      </div>
                      <div className="flex items-end">
                        <Button variant="outline" className="text-blue-600 border-blue-300">
                          <Eye className="mr-2 h-4 w-4" />
                          View Grading Rubric
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setShowSubmissionModal(false)}>
                  Close
                </Button>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500">
                  Save Changes
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
