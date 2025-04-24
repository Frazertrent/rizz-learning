"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { ArrowLeft, Calendar, Clock, Flag, Upload, MessageSquare, FileText, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddNoteModal, type Note } from "./add-note-modal"
import { AssignmentNotes } from "./assignment-notes"

// Mock data for a single assignment
const mockAssignment = {
  id: "1",
  title: "Essay: Causes of World War I",
  subject: "History",
  type: "Essay",
  dueDate: new Date(2025, 3, 20),
  dueTime: "11:59 PM",
  description:
    "Write a 500-word essay on the primary causes of World War I. Your essay should cover the assassination of Archduke Franz Ferdinand, militarism, alliances, imperialism, and nationalism. Include at least three primary sources and follow MLA citation format. The essay should have an introduction with a clear thesis statement, body paragraphs with supporting evidence, and a conclusion that summarizes your main points.",
  status: "not-started",
  priority: "high",
  completed: false,
  hasSubmission: false,
  hasFeedback: false,
  relatedGoal: "Improve historical analysis skills",
  resources: [
    {
      id: "r1",
      title: "World War I: Causes and Timeline",
      type: "article",
      url: "https://www.history.com/topics/world-war-i/world-war-i-history",
    },
    {
      id: "r2",
      title: "Primary Sources on WWI",
      type: "document",
      url: "https://www.archives.gov/education/lessons/wwi-docs",
    },
  ],
}

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
    assignmentId: "1",
    body: "I've started researching the assassination of Archduke Franz Ferdinand. Found some great primary sources I can use.",
    tag: "update",
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

export function AssignmentDetail() {
  const [assignment, setAssignment] = useState(mockAssignment)
  const [notes, setNotes] = useState<Note[]>(mockNotes)
  const [noteModalOpen, setNoteModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  const subjectColor = subjectColors[assignment.subject] || "from-gray-400 to-gray-600 text-white"
  const priorityConfig = getPriorityConfig(assignment.priority)
  const statusConfig = getStatusConfig(assignment)
  const dueDate = new Date(assignment.dueDate)
  const isOverdue = dueDate < new Date() && !assignment.completed

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Back button */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="rounded-full" asChild>
          <a href="/student/assignments">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Assignments
          </a>
        </Button>
      </div>

      {/* Assignment Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 opacity-10 rounded-3xl"></div>
          <div className="relative p-6 rounded-3xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{assignment.title}</h1>
                <div className="flex flex-wrap items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 rounded-full">
                    {assignment.subject}
                  </Badge>
                  <Badge variant="outline" className="rounded-full">
                    {assignment.type}
                  </Badge>
                  <Badge className={`${priorityConfig.color} rounded-full`}>
                    <Flag className="h-3 w-3 mr-1" />
                    {priorityConfig.label} Priority
                  </Badge>
                  <Badge className={`${statusConfig.color} rounded-full`}>{statusConfig.label}</Badge>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full bg-gray-900 hover:bg-gray-800 text-white border-gray-700"
                  onClick={() => setNoteModalOpen(true)}
                >
                  <MessageSquare className="h-4 w-4 mr-1.5" />
                  Add a Note
                </Button>
                <Button
                  className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  size="sm"
                >
                  <Upload className="h-4 w-4 mr-1.5" />
                  Upload Work
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Due Date Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-900/30 rounded-xl">
          <CardContent className="p-4">
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex items-center">
                <Calendar className={`h-5 w-5 mr-2 ${isOverdue ? "text-red-500" : "text-gray-500"}`} />
                <span
                  className={`font-medium ${isOverdue ? "text-red-500 dark:text-red-400" : "text-gray-700 dark:text-gray-300"}`}
                >
                  Due: {format(dueDate, "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className={`h-5 w-5 mr-2 ${isOverdue ? "text-red-500" : "text-gray-500"}`} />
                <span
                  className={`font-medium ${isOverdue ? "text-red-500 dark:text-red-400" : "text-gray-700 dark:text-gray-300"}`}
                >
                  Time: {assignment.dueTime}
                </span>
              </div>
              {assignment.relatedGoal && (
                <div className="flex items-center mt-2 md:mt-0">
                  <Target className="h-5 w-5 mr-2 text-blue-500" />
                  <span className="font-medium text-blue-600 dark:text-blue-400">Goal: {assignment.relatedGoal}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 bg-gray-100/80 dark:bg-gray-800/50 p-1 rounded-full w-full sm:w-auto">
          <TabsTrigger
            value="details"
            className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:shadow-sm"
          >
            Details
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:shadow-sm"
          >
            Notes ({notes.length})
          </TabsTrigger>
          <TabsTrigger
            value="resources"
            className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:shadow-sm"
          >
            Resources
          </TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <Card className="overflow-hidden border-gray-200 dark:border-gray-800 shadow-md rounded-xl">
            <CardHeader className="bg-gray-50 dark:bg-gray-900/50 p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-semibold flex items-center">
                <FileText className="mr-2 h-5 w-5 text-amber-500" />
                Assignment Description
              </h3>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{assignment.description}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-6">
          <Card className="overflow-hidden border-gray-200 dark:border-gray-800 shadow-md rounded-xl">
            <CardHeader className="bg-gray-50 dark:bg-gray-900/50 p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
                  Notes
                </h3>
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => setNoteModalOpen(true)}>
                  <MessageSquare className="h-4 w-4 mr-1.5" />
                  Add a Note
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <AssignmentNotes notes={notes} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <Card className="overflow-hidden border-gray-200 dark:border-gray-800 shadow-md rounded-xl">
            <CardHeader className="bg-gray-50 dark:bg-gray-900/50 p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-semibold flex items-center">
                <FileText className="mr-2 h-5 w-5 text-green-500" />
                Helpful Resources
              </h3>
            </CardHeader>
            <CardContent className="p-4">
              {assignment.resources && assignment.resources.length > 0 ? (
                <ul className="space-y-3">
                  {assignment.resources.map((resource) => (
                    <li key={resource.id} className="flex items-start">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mr-3">
                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          {resource.title}
                        </a>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                    <FileText className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No resources available</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    There are no additional resources attached to this assignment.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Note Modal */}
      <AddNoteModal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        onSave={handleSaveNote}
        assignmentId={assignment.id}
        assignmentTitle={assignment.title}
      />
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
