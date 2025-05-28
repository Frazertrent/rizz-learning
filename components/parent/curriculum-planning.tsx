"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Book, Calendar, FileText, Plus, Edit, Archive, Eye, BookOpen, Globe, Target, Clock, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { CurriculumSubNav } from "./curriculum-sub-nav"
import Link from "next/link"
import { FileUp } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Types for our data models
type Subject = {
  id: string
  name: string
  gradeLevel: string
  category: "Core" | "Elective"
  description: string
  duration: number
  status: "Active" | "Archived" | "Planned"
  units: Unit[]
}

type NewUnit = Omit<Unit, 'id'> & {
  title: string
  description: string
  status: "Planned" | "In Progress" | "Completed"
  duration: number
  pacing: number
  subjectId: string
}

type Unit = {
  id: string
  title: string
  description: string
  status: "Planned" | "In Progress" | "Completed"
  duration: number
  pacing: number
  subjectId: string
}

type Lesson = {
  id: string
  title: string
  unitId: string | null
  subjectId: string
  description: string
  startTime: string
  duration: number
  notes: string
  date: string
  priority: "Low" | "Medium" | "High"
}

type Resource = {
  id: string
  title: string
  type: "Online" | "Book" | "Course" | "Video"
  subjects: string[]
  link: string
  description: string
  accessInstructions: string
}

type Goal = {
  id: string
  title: string
  subjectId: string
  studentId: string
  studentName: string
  dueDate: string
  progress: number
  status: "On Track" | "At Risk" | "Completed" | "Planned"
  description: string
  notes: string
}

export function CurriculumPlanning() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State for active tab
  const [activeTab, setActiveTab] = useState("subjects")

  // States for modals
  const [editSubjectModal, setEditSubjectModal] = useState(false)
  const [archiveSubjectModal, setArchiveSubjectModal] = useState(false)
  const [viewUnitModal, setViewUnitModal] = useState(false)
  const [editUnitModal, setEditUnitModal] = useState(false)
  const [addUnitModal, setAddUnitModal] = useState(false)
  const [addSubjectModal, setAddSubjectModal] = useState(false)
  const [editLessonModal, setEditLessonModal] = useState(false)
  const [addLessonModal, setAddLessonModal] = useState(false)
  const [editResourceModal, setEditResourceModal] = useState(false)
  const [addResourceModal, setAddResourceModal] = useState(false)
  const [addGoalModal, setAddGoalModal] = useState(false)

  // Add a new state for the goal details modal after the other modal states
  const [goalDetailsModal, setGoalDetailsModal] = useState(false)

  // States for selected items
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch subjects with their units
        const { data: subjectsData, error: subjectsError } = await supabase
          .from('subjects')
          .select(`
            *,
            units (*)
          `)
          .order('name')

        if (subjectsError) throw subjectsError

        // Fetch lessons
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select('*')
          .order('date')

        if (lessonsError) throw lessonsError

        // Fetch resources
        const { data: resourcesData, error: resourcesError } = await supabase
          .from('resources')
          .select('*')
          .order('title')

        if (resourcesError) throw resourcesError

        // Fetch goals
        const { data: goalsData, error: goalsError } = await supabase
          .from('goals')
          .select('*')
          .order('dueDate')

        if (goalsError) throw goalsError

        // Process and set the data
        setSubjects(subjectsData as Subject[] || [])
        setLessons(lessonsData as Lesson[] || [])
        setResources(resourcesData as Resource[] || [])
        setGoals(goalsData as Goal[] || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Function to handle subject edit
  const handleEditSubject = async (subject: Subject) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .update(subject)
        .eq('id', subject.id)

      if (error) throw error

      // Update local state
      setSubjects(subjects.map(s => s.id === subject.id ? subject : s))
    } catch (err) {
      console.error('Error updating subject:', err)
      // Handle error (show toast, etc.)
    }
  }

  // Function to handle subject archival
  const handleArchiveSubject = async (subject: Subject) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .update({ status: 'Archived' })
        .eq('id', subject.id)

      if (error) throw error

      // Update local state
      setSubjects(subjects.map(s => s.id === subject.id ? { ...s, status: 'Archived' } : s))
    } catch (err) {
      console.error('Error archiving subject:', err)
      // Handle error (show toast, etc.)
    }
  }

  // Function to handle unit view
  const handleViewUnit = (unit: Unit) => {
    setSelectedUnit(unit)
  }

  // Function to handle unit edit
  const handleEditUnit = async (unit: Unit) => {
    try {
      const { error } = await supabase
        .from('units')
        .update(unit)
        .eq('id', unit.id)

      if (error) throw error

      // Update local state
      setSubjects(subjects.map(s => {
        if (s.id === unit.subjectId) {
          return {
            ...s,
            units: s.units.map(u => u.id === unit.id ? unit : u)
          }
        }
        return s
      }))
    } catch (err) {
      console.error('Error updating unit:', err)
      // Handle error (show toast, etc.)
    }
  }

  // Function to handle adding a unit
  const handleAddUnit = async (subjectId: string) => {
    const newUnit: NewUnit = {
      title: '',
      description: '',
      status: 'Planned',
      duration: 0,
      pacing: 0,
      subjectId
    }

    try {
      const { data, error } = await supabase
        .from('units')
        .insert([newUnit])
        .select()
        .single()

      if (error) throw error

      // Update local state
      setSubjects(subjects.map(s => {
        if (s.id === subjectId) {
          return {
            ...s,
            units: [...s.units, data as Unit]
          }
        }
        return s
      }))
    } catch (err) {
      console.error('Error adding unit:', err)
      // Handle error (show toast, etc.)
    }
  }

  // Function to handle lesson edit
  const handleEditLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setEditLessonModal(true)
  }

  // Function to handle resource edit
  const handleEditResource = (resource: Resource) => {
    setSelectedResource(resource)
    setEditResourceModal(true)
  }

  // Add a function to handle opening the goal details modal after the other handler functions
  const handleViewGoalDetails = (goal: Goal) => {
    setSelectedGoal(goal)
    setGoalDetailsModal(true)
  }

  // Add a function to handle saving goal updates
  const handleSaveGoalUpdates = () => {
    // In a real app, this would save the changes to the database
    setGoalDetailsModal(false)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  }

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 0 15px rgba(124, 58, 237, 0.5)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Add the updated sub-navigation */}
      <CurriculumSubNav />

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-300">Curriculum Planning</h1>
          <p className="text-gray-600 dark:text-gray-400">Organize subjects, lessons, and educational resources</p>
        </motion.div>

        <motion.a
          href="/parent/calendar"
          className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-lg"
          whileHover={buttonVariants.hover}
          whileTap={buttonVariants.tap}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Calendar className="mr-2 h-5 w-5" />
          Academic Calendar
        </motion.a>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger
            value="subjects"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
          >
            <Book className="mr-2 h-4 w-4" />
            Subjects
          </TabsTrigger>
          <TabsTrigger
            value="lessons"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
          >
            <FileText className="mr-2 h-4 w-4" />
            Lesson Planning
          </TabsTrigger>
          <TabsTrigger
            value="resources"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger
            value="goals"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
          >
            <Target className="mr-2 h-4 w-4" />
            Learning Goals
          </TabsTrigger>
        </TabsList>

        {/* Subjects Tab */}
        <TabsContent value="subjects">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
            {/* Add Subject Button */}
            <motion.div variants={itemVariants} className="flex justify-end">
              <Button
                onClick={() => setAddSubjectModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Subject
              </Button>
            </motion.div>

            {/* Subject List */}
            {subjects.map((subject) => (
              <motion.div
                key={subject.id}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-white">{subject.name}</h3>
                      <div className="flex items-center mt-1">
                        <Badge className="bg-white/20 text-white mr-2">{subject.gradeLevel}</Badge>
                        <Badge className="bg-white/20 text-white">{subject.category}</Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                              onClick={() => handleEditSubject(subject)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit Subject</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                              onClick={() => handleArchiveSubject(subject)}
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Archive Subject</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{subject.description}</p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Units</h4>

                    {subject.units.length > 0 ? (
                      <div className="space-y-3">
                        {subject.units.map((unit) => (
                          <div key={unit.id} className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <h5 className="font-medium text-purple-800 dark:text-purple-200">{unit.title}</h5>
                                <div className="flex items-center mt-1">
                                  <Badge
                                    className={cn(
                                      "mr-2",
                                      unit.status === "Completed"
                                        ? "bg-green-500"
                                        : unit.status === "In Progress"
                                          ? "bg-blue-500"
                                          : "bg-gray-500",
                                    )}
                                  >
                                    {unit.status}
                                  </Badge>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {unit.duration} weeks
                                  </span>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="sm" onClick={() => handleViewUnit(unit)}>
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>View Unit</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="sm" onClick={() => handleEditUnit(unit)}>
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Edit Unit</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div className="mt-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span>Progress</span>
                                <span>{unit.pacing}%</span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div
                                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-2.5 rounded-full"
                                  style={{ width: `${unit.pacing}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 italic">No units added yet</p>
                    )}

                    <Button variant="outline" size="sm" className="mt-3" onClick={() => handleAddUnit(subject.id)}>
                      <Plus className="mr-1 h-3 w-3" /> Add Unit
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        {/* Lesson Planning Tab */}
        <TabsContent value="lessons">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            {/* Add Lesson Button */}
            <motion.div variants={itemVariants} className="flex justify-end">
              <Button
                onClick={() => setAddLessonModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Lesson
              </Button>
            </motion.div>

            {/* Lesson List */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-purple-800 dark:text-purple-300">Upcoming Lessons</CardTitle>
                  <CardDescription>Scheduled lessons for the next 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {lessons.map((lesson) => {
                      const subject = subjects.find((s) => s.id === lesson.subjectId)
                      const unit = subject?.units.find((u) => u.id === lesson.unitId)

                      return (
                        <div
                          key={lesson.id}
                          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-purple-700 dark:text-purple-300">{lesson.title}</h4>
                              <div className="flex items-center mt-1">
                                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 mr-2">
                                  {subject?.name}
                                </Badge>
                                {unit && (
                                  <Badge variant="outline" className="text-gray-600 dark:text-gray-300">
                                    {unit.title}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Badge
                                className={cn(
                                  lesson.priority === "High"
                                    ? "bg-red-500"
                                    : lesson.priority === "Medium"
                                      ? "bg-yellow-500"
                                      : "bg-green-500",
                                )}
                              >
                                {lesson.priority}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-2"
                                onClick={() => handleEditLesson(lesson)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>{new Date(lesson.date).toLocaleDateString()}</span>
                              <Clock className="h-4 w-4 mx-2" />
                              <span>
                                {lesson.startTime} ({lesson.duration} min)
                              </span>
                            </div>
                            <p className="mt-2">{lesson.description}</p>
                            {lesson.notes && (
                              <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-2 border-yellow-300 dark:border-yellow-700">
                                <p className="text-yellow-800 dark:text-yellow-200">{lesson.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        {/* Educational Resources Tab */}
        <TabsContent value="resources">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            {/* Add Resource Button */}
            <motion.div variants={itemVariants} className="flex justify-end">
              <Button
                onClick={() => setAddResourceModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Resource
              </Button>
            </motion.div>

            {/* Resource List */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => {
                const resourceSubjects = resource.subjects
                  .map((id) => subjects.find((s) => s.id === id)?.name)
                  .filter(Boolean)

                return (
                  <Card key={resource.id} className="overflow-hidden">
                    <div
                      className={cn(
                        "p-4",
                        resource.type === "Online"
                          ? "bg-blue-500"
                          : resource.type === "Book"
                            ? "bg-green-500"
                            : resource.type === "Course"
                              ? "bg-purple-500"
                              : "bg-pink-500",
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-white">{resource.title}</h3>
                        <Badge className="bg-white/20 text-white">{resource.type}</Badge>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{resource.description}</p>

                      {resourceSubjects.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Supports:</p>
                          <div className="flex flex-wrap gap-1">
                            {resourceSubjects.map((subject, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {resource.link && (
                        <div className="mb-3">
                          <a
                            href={resource.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                          >
                            <Globe className="h-3 w-3 mr-1" />
                            Visit Resource
                          </a>
                        </div>
                      )}

                      {resource.accessInstructions && (
                        <div className="text-xs bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                          <p className="font-medium mb-1">Access Instructions:</p>
                          <p className="text-gray-600 dark:text-gray-400">{resource.accessInstructions}</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="border-t border-gray-100 dark:border-gray-800 pt-3 pb-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto"
                        onClick={() => handleEditResource(resource)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </motion.div>
          </motion.div>
        </TabsContent>

        {/* Learning Goals Tab */}
        <TabsContent value="goals">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
            {/* Current Goals Section */}
            <motion.div variants={itemVariants}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300">Current Goals</h3>
                <Button
                  onClick={() => setAddGoalModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Goal
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map((goal) => {
                  const subject = subjects.find((s) => s.id === goal.subjectId)

                  return (
                    <Card key={goal.id} className="overflow-hidden">
                      <div
                        className={cn(
                          "h-2 w-full",
                          goal.status === "On Track"
                            ? "bg-green-500"
                            : goal.status === "At Risk"
                              ? "bg-yellow-500"
                              : goal.status === "Completed"
                                ? "bg-blue-500"
                                : "bg-gray-500",
                        )}
                      ></div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg text-purple-800 dark:text-purple-300">{goal.title}</CardTitle>
                          <Badge
                            className={cn(
                              goal.status === "On Track"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                : goal.status === "At Risk"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                  : goal.status === "Completed"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100",
                            )}
                          >
                            {goal.status}
                          </Badge>
                        </div>
                        <CardDescription>
                          <div className="flex items-center">
                            <span className="text-sm">{subject?.name}</span>
                            <span className="mx-2">•</span>
                            <span className="text-sm">{goal.studentName}</span>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{goal.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div
                              className={cn(
                                "h-2.5 rounded-full",
                                goal.status === "On Track"
                                  ? "bg-green-500"
                                  : goal.status === "At Risk"
                                    ? "bg-yellow-500"
                                    : goal.status === "Completed"
                                      ? "bg-blue-500"
                                      : "bg-gray-500",
                              )}
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                        </div>

                        {goal.notes && (
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            <p className="italic">{goal.notes}</p>
                          </div>
                        )}
                      </CardContent>
                      {/* Update the View Details button in the goal card to call the new function */}
                      <CardFooter className="border-t border-gray-100 dark:border-gray-800 pt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-auto"
                          onClick={() => handleViewGoalDetails(goal)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {/* Edit Subject Modal */}
      <Dialog open={editSubjectModal} onOpenChange={setEditSubjectModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject-name" className="text-right">
                Name
              </Label>
              <Input id="subject-name" defaultValue={selectedSubject?.name} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="grade-level" className="text-right">
                Grade Level
              </Label>
              <Input id="grade-level" defaultValue={selectedSubject?.gradeLevel} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea id="description" defaultValue={selectedSubject?.description} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration (weeks)
              </Label>
              <Input id="duration" type="number" defaultValue={selectedSubject?.duration} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select defaultValue={selectedSubject?.category}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Core">Core</SelectItem>
                  <SelectItem value="Elective">Elective</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select defaultValue={selectedSubject?.status}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                  <SelectItem value="Planned">Planned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditSubjectModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setEditSubjectModal(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Subject Modal */}
      <Dialog open={archiveSubjectModal} onOpenChange={setArchiveSubjectModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Archive Subject</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-gray-700 dark:text-gray-300">
              Are you sure you want to archive{" "}
              <span className="font-semibold text-purple-700 dark:text-purple-300">{selectedSubject?.name}</span>?
            </p>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
              This will hide the subject from active view but preserve all data.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArchiveSubjectModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setArchiveSubjectModal(false)}>
              Archive Subject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Unit Modal */}
      <Dialog open={viewUnitModal} onOpenChange={setViewUnitModal}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Unit Details</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300">{selectedUnit?.title}</h3>
              <Badge
                className={cn(
                  "mt-1",
                  selectedUnit?.status === "Completed"
                    ? "bg-green-500"
                    : selectedUnit?.status === "In Progress"
                      ? "bg-blue-500"
                      : "bg-gray-500",
                )}
              >
                {selectedUnit?.status}
              </Badge>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</h4>
                <p className="text-gray-600 dark:text-gray-400">{selectedUnit?.description}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration</h4>
                <p className="text-gray-600 dark:text-gray-400">{selectedUnit?.duration} weeks</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</h4>
                <div className="mt-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Pacing</span>
                    <span>{selectedUnit?.pacing}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-2.5 rounded-full"
                      style={{ width: `${selectedUnit?.pacing}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Linked Lessons</h4>
                {lessons.filter((l) => l.unitId === selectedUnit?.id).length > 0 ? (
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                    {lessons
                      .filter((l) => l.unitId === selectedUnit?.id)
                      .map((lesson) => (
                        <li key={lesson.id}>{lesson.title}</li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">No lessons linked to this unit</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setViewUnitModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Unit Modal */}
      <Dialog open={editUnitModal} onOpenChange={setEditUnitModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Unit</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit-title" className="text-right">
                Title
              </Label>
              <Input id="unit-title" defaultValue={selectedUnit?.title} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit-description" className="text-right">
                Description
              </Label>
              <Textarea id="unit-description" defaultValue={selectedUnit?.description} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit-status" className="text-right">
                Status
              </Label>
              <Select defaultValue={selectedUnit?.status}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planned">Planned</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit-duration" className="text-right">
                Duration (weeks)
              </Label>
              <Input id="unit-duration" type="number" defaultValue={selectedUnit?.duration} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit-pacing" className="text-right">
                Pacing Target (%)
              </Label>
              <Input id="unit-pacing" type="number" defaultValue={selectedUnit?.pacing} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUnitModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setEditUnitModal(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Unit Modal */}
      <Dialog open={addUnitModal} onOpenChange={setAddUnitModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Unit</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-unit-title" className="text-right">
                Unit Title
              </Label>
              <Input id="new-unit-title" placeholder="Enter unit title" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-unit-description" className="text-right">
                Description
              </Label>
              <Textarea id="new-unit-description" placeholder="Enter unit description" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-unit-progress" className="text-right">
                Target Progress (%)
              </Label>
              <Input id="new-unit-progress" type="number" defaultValue={0} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-unit-start-date" className="text-right">
                Start Date
              </Label>
              <Input id="new-unit-start-date" type="date" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-unit-resources" className="text-right">
                Linked Resources
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select resources (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {resources.map((resource) => (
                    <SelectItem key={resource.id} value={resource.id}>
                      {resource.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUnitModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAddUnitModal(false)}>Add Unit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Subject Modal */}
      <Dialog open={addSubjectModal} onOpenChange={setAddSubjectModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Subject</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-subject-name" className="text-right">
                Subject Name
              </Label>
              <Input id="new-subject-name" placeholder="Enter subject name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-subject-grade" className="text-right">
                Grade Level
              </Label>
              <Input id="new-subject-grade" placeholder="e.g., 5th Grade" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-subject-category" className="text-right">
                Category
              </Label>
              <Select defaultValue="Core">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Core">Core</SelectItem>
                  <SelectItem value="Elective">Elective</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-subject-units" className="text-right">
                Initial Units
              </Label>
              <Textarea
                id="new-subject-units"
                placeholder="Optional: Enter initial units (one per line)"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-subject-pacing" className="text-right">
                Target Pacing (%)
              </Label>
              <Input id="new-subject-pacing" type="number" defaultValue={0} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-subject-lesson-time" className="text-right">
                Default Lesson Time
              </Label>
              <Input id="new-subject-lesson-time" placeholder="e.g., 45 minutes" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddSubjectModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAddSubjectModal(false)}>Add Subject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Lesson Modal */}
      <Dialog open={editLessonModal} onOpenChange={setEditLessonModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Lesson</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lesson-title" className="text-right">
                Lesson Title
              </Label>
              <Input id="lesson-title" defaultValue={selectedLesson?.title} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lesson-unit" className="text-right">
                Unit
              </Label>
              <Select defaultValue={selectedLesson?.unitId || "none"}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select unit (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {subjects.flatMap((subject) =>
                    subject.units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.title} ({subject.name})
                      </SelectItem>
                    )),
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lesson-subject" className="text-right">
                Subject
              </Label>
              <Select defaultValue={selectedLesson?.subjectId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lesson-description" className="text-right">
                Description
              </Label>
              <Textarea id="lesson-description" defaultValue={selectedLesson?.description} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lesson-date" className="text-right">
                Date
              </Label>
              <Input id="lesson-date" type="date" defaultValue={selectedLesson?.date} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lesson-start-time" className="text-right">
                Start Time
              </Label>
              <Input
                id="lesson-start-time"
                type="time"
                defaultValue={selectedLesson?.startTime}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lesson-duration" className="text-right">
                Duration (min)
              </Label>
              <Input
                id="lesson-duration"
                type="number"
                defaultValue={selectedLesson?.duration}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lesson-notes" className="text-right">
                Notes
              </Label>
              <Textarea id="lesson-notes" defaultValue={selectedLesson?.notes} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditLessonModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setEditLessonModal(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Lesson Modal */}
      <Dialog open={addLessonModal} onOpenChange={setAddLessonModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Lesson</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-lesson-title" className="text-right">
                Lesson Title
              </Label>
              <Input id="new-lesson-title" placeholder="Enter lesson title" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-lesson-subject" className="text-right">
                Subject
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-lesson-unit" className="text-right">
                Unit (optional)
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {subjects.flatMap((subject) =>
                    subject.units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.title} ({subject.name})
                      </SelectItem>
                    )),
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-lesson-date" className="text-right">
                Date
              </Label>
              <Input id="new-lesson-date" type="date" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-lesson-start-time" className="text-right">
                Start Time
              </Label>
              <Input id="new-lesson-start-time" type="time" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-lesson-duration" className="text-right">
                Duration (min)
              </Label>
              <Input id="new-lesson-duration" type="number" defaultValue={45} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-lesson-notes" className="text-right">
                Notes
              </Label>
              <Textarea id="new-lesson-notes" placeholder="Enter any notes or instructions" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-lesson-priority" className="text-right">
                Priority Level
              </Label>
              <Select defaultValue="Medium">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddLessonModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAddLessonModal(false)}>Add Lesson</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Resource Modal */}
      <Dialog open={editResourceModal} onOpenChange={setEditResourceModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resource-title" className="text-right">
                Resource Title
              </Label>
              <Input id="resource-title" defaultValue={selectedResource?.title} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resource-type" className="text-right">
                Resource Type
              </Label>
              <Select defaultValue={selectedResource?.type}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Book">Book</SelectItem>
                  <SelectItem value="Course">Course</SelectItem>
                  <SelectItem value="Video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resource-subjects" className="text-right">
                Subjects
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select subjects" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resource-link" className="text-right">
                Link (if online)
              </Label>
              <Input id="resource-link" defaultValue={selectedResource?.link} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resource-description" className="text-right">
                Description
              </Label>
              <Textarea id="resource-description" defaultValue={selectedResource?.description} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resource-access" className="text-right">
                Access Instructions
              </Label>
              <Textarea
                id="resource-access"
                defaultValue={selectedResource?.accessInstructions}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditResourceModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setEditResourceModal(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Resource Modal */}
      <Dialog open={addResourceModal} onOpenChange={setAddResourceModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Resource</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-resource-title" className="text-right">
                Resource Title
              </Label>
              <Input id="new-resource-title" placeholder="Enter resource title" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-resource-type" className="text-right">
                Resource Type
              </Label>
              <Select defaultValue="Online">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Book">Book</SelectItem>
                  <SelectItem value="Course">Course</SelectItem>
                  <SelectItem value="Video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-resource-subjects" className="text-right">
                Subjects
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select subjects" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-resource-link" className="text-right">
                Link (if online)
              </Label>
              <Input id="new-resource-link" placeholder="https://" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-resource-description" className="text-right">
                Description
              </Label>
              <Textarea id="new-resource-description" placeholder="Enter resource description" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-resource-access" className="text-right">
                Access Instructions
              </Label>
              <Textarea id="new-resource-access" placeholder="How to access this resource" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddResourceModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAddResourceModal(false)}>Add Resource</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Goal Modal */}
      <Dialog open={addGoalModal} onOpenChange={setAddGoalModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Learning Goal</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-goal-title" className="text-right">
                Goal Title
              </Label>
              <Input id="new-goal-title" placeholder="Enter goal title" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-goal-subject" className="text-right">
                Subject
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-goal-student" className="text-right">
                Student
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="st1">Emma</SelectItem>
                  <SelectItem value="st2">Noah</SelectItem>
                  <SelectItem value="st3">Olivia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-goal-date" className="text-right">
                Target Date
              </Label>
              <Input id="new-goal-date" type="date" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-goal-description" className="text-right">
                Description
              </Label>
              <Textarea id="new-goal-description" placeholder="Describe the goal in detail" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-goal-status" className="text-right">
                Initial Status
              </Label>
              <Select defaultValue="Planned">
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planned">Planned</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-goal-notes" className="text-right">
                Notes (Optional)
              </Label>
              <Textarea id="new-goal-notes" placeholder="Additional notes" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddGoalModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAddGoalModal(false)}>Add Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Goal Details Modal */}
      <Dialog open={goalDetailsModal} onOpenChange={setGoalDetailsModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{selectedGoal?.title} Details</DialogTitle>
          </DialogHeader>

          {selectedGoal && (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Subject & Student</p>
                  <div className="flex items-center mt-1">
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 mr-2">
                      {subjects.find((s) => s.id === selectedGoal.subjectId)?.name}
                    </Badge>
                    <Badge variant="outline">{selectedGoal.studentName}</Badge>
                  </div>
                </div>

                <Badge
                  className={cn(
                    "text-sm",
                    selectedGoal.status === "On Track"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      : selectedGoal.status === "At Risk"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                        : selectedGoal.status === "Completed"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100",
                  )}
                >
                  {selectedGoal.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{selectedGoal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className={cn(
                      "h-2.5 rounded-full",
                      selectedGoal.status === "On Track"
                        ? "bg-green-500"
                        : selectedGoal.status === "At Risk"
                          ? "bg-yellow-500"
                          : selectedGoal.status === "Completed"
                            ? "bg-blue-500"
                            : "bg-gray-500",
                    )}
                    style={{ width: `${selectedGoal.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Due: {new Date(selectedGoal.dueDate).toLocaleDateString()}</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-description" className="text-sm font-medium">
                  Description
                </Label>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">{selectedGoal.description}</div>
              </div>

              {selectedGoal.notes && (
                <div className="space-y-2">
                  <Label htmlFor="goal-notes" className="text-sm font-medium">
                    Notes
                  </Label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">{selectedGoal.notes}</div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="goal-status" className="text-sm font-medium">
                  Update Status
                </Label>
                <Select defaultValue={selectedGoal.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="On Track">On Track</SelectItem>
                    <SelectItem value="At Risk">At Risk</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent-note" className="text-sm font-medium">
                  Add Parent Note
                </Label>
                <Textarea
                  id="parent-note"
                  placeholder="Add a note or reflection about this goal..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setGoalDetailsModal(false)}>
              Cancel
            </Button>
            <Button
              className={cn(
                "bg-gradient-to-r",
                selectedGoal?.status === "On Track"
                  ? "from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500"
                  : selectedGoal?.status === "At Risk"
                    ? "from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500"
                    : selectedGoal?.status === "Completed"
                      ? "from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                      : "from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500",
              )}
              onClick={handleSaveGoalUpdates}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ y: -5 }}
        >
          <Card className="h-full border-2 hover:border-blue-400 transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <FileUp className="mr-2 h-5 w-5 text-blue-500" />
                Upload Syllabus
              </CardTitle>
              <CardDescription>Automatically build your student's schedule</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Upload a syllabus or class schedule and we'll automatically create assignments and due dates.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/parent/curriculum/upload-syllabus" className="w-full">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                  Upload Now
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Other curriculum planning cards would go here */}
      </div>
    </div>
  )
}
