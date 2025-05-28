"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, Save, ArrowLeft, Clock, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { TermPlanData } from "@/components/parent/term-plan-builder"

// Mock data for initial state - in a real app, this would come from a database
const initialTermPlan: TermPlanData = {
  academicTerm: "Fall 2023",
  goals: [
    "Complete Algebra 1 curriculum",
    "Improve reading comprehension",
    "Develop consistent writing habits",
    "Master basic Spanish conversation",
    "Complete science fair project",
  ],
  schedule: {
    days: {
      monday: { selected: true, startTime: "08:00", endTime: "15:00", blockLength: 45, blocks: 9 },
      tuesday: { selected: true, startTime: "08:00", endTime: "15:00", blockLength: 45, blocks: 9 },
      wednesday: { selected: true, startTime: "08:00", endTime: "15:00", blockLength: 45, blocks: 9 },
      thursday: { selected: true, startTime: "08:00", endTime: "15:00", blockLength: 45, blocks: 9 },
      friday: { selected: true, startTime: "08:00", endTime: "15:00", blockLength: 45, blocks: 9 },
      saturday: { selected: false, startTime: "09:00", endTime: "12:00", blockLength: 45, blocks: 4 },
      sunday: { selected: false, startTime: "09:00", endTime: "12:00", blockLength: 45, blocks: 4 },
    },
    useSameSchedule: true,
  },
  activities: [
    "Reading",
    "Writing / journaling",
    "Math drills",
    "Physical activity",
    "Science experiments",
    "History projects",
    "Scripture study",
  ],
  customActivities: ["Coding practice", "Piano lessons"],
  subjects: {
    core: ["Math", "Language Arts", "Science", "Social Studies / History"],
    extended: ["PE", "Arts & Music", "Technology", "World Languages"],
    courses: {
      Math: ["Algebra", "Geometry", "Statistics"],
      "Language Arts": ["Reading", "Writing", "Grammar", "Literature"],
      Science: ["Biology", "Chemistry", "Physics"],
      "Social Studies / History": ["U.S. History", "World History", "Geography"],
      PE: ["Physical Education", "Sports"],
      "Arts & Music": ["Visual Arts", "Music"],
      Technology: ["Computer Science", "Coding"],
      "World Languages": ["Spanish"],
    },
  },
}

// Mock data for block assignments - in a real app, this would come from a database
const mockBlockAssignments = {
  monday: [
    { time: "08:00-08:45", subject: "Math", course: "Algebra", type: "subject" },
    { time: "09:00-09:45", subject: "Language Arts", course: "Reading", type: "subject" },
    { time: "10:00-10:45", subject: "Science", course: "Biology", type: "subject" },
    { time: "11:00-11:45", subject: "Physical activity", course: "", type: "activity" },
    { time: "12:00-12:45", subject: "Lunch", course: "", type: "break" },
    { time: "13:00-13:45", subject: "Social Studies / History", course: "U.S. History", type: "subject" },
    { time: "14:00-14:45", subject: "World Languages", course: "Spanish", type: "subject" },
    { time: "15:00-15:45", subject: "Writing / journaling", course: "", type: "activity" },
    { time: "16:00-16:45", subject: "Technology", course: "Coding", type: "subject" },
  ],
  tuesday: [
    { time: "08:00-08:45", subject: "Math", course: "Algebra", type: "subject" },
    { time: "09:00-09:45", subject: "Language Arts", course: "Writing", type: "subject" },
    { time: "10:00-10:45", subject: "Science", course: "Chemistry", type: "subject" },
    { time: "11:00-11:45", subject: "Physical activity", course: "", type: "activity" },
    { time: "12:00-12:45", subject: "Lunch", course: "", type: "break" },
    { time: "13:00-13:45", subject: "Social Studies / History", course: "Geography", type: "subject" },
    { time: "14:00-14:45", subject: "Arts & Music", course: "Music", type: "subject" },
    { time: "15:00-15:45", subject: "Reading", course: "", type: "activity" },
    { time: "16:00-16:45", subject: "Piano lessons", course: "", type: "activity" },
  ],
  wednesday: [
    { time: "08:00-08:45", subject: "Math", course: "Geometry", type: "subject" },
    { time: "09:00-09:45", subject: "Language Arts", course: "Grammar", type: "subject" },
    { time: "10:00-10:45", subject: "Science", course: "Physics", type: "subject" },
    { time: "11:00-11:45", subject: "Physical activity", course: "", type: "activity" },
    { time: "12:00-12:45", subject: "Lunch", course: "", type: "break" },
    { time: "13:00-13:45", subject: "Social Studies / History", course: "World History", type: "subject" },
    { time: "14:00-14:45", subject: "World Languages", course: "Spanish", type: "subject" },
    { time: "15:00-15:45", subject: "Science experiments", course: "", type: "activity" },
    { time: "16:00-16:45", subject: "Coding practice", course: "", type: "activity" },
  ],
  thursday: [
    { time: "08:00-08:45", subject: "Math", course: "Statistics", type: "subject" },
    { time: "09:00-09:45", subject: "Language Arts", course: "Literature", type: "subject" },
    { time: "10:00-10:45", subject: "Science", course: "Biology", type: "subject" },
    { time: "11:00-11:45", subject: "Physical activity", course: "", type: "activity" },
    { time: "12:00-12:45", subject: "Lunch", course: "", type: "break" },
    { time: "13:00-13:45", subject: "Social Studies / History", course: "U.S. History", type: "subject" },
    { time: "14:00-14:45", subject: "Arts & Music", course: "Visual Arts", type: "subject" },
    { time: "15:00-15:45", subject: "Writing / journaling", course: "", type: "activity" },
    { time: "16:00-16:45", subject: "Technology", course: "Computer Science", type: "subject" },
  ],
  friday: [
    { time: "08:00-08:45", subject: "Math", course: "Algebra", type: "subject" },
    { time: "09:00-09:45", subject: "Language Arts", course: "Reading", type: "subject" },
    { time: "10:00-10:45", subject: "Science", course: "Chemistry", type: "subject" },
    { time: "11:00-11:45", subject: "Physical activity", course: "", type: "activity" },
    { time: "12:00-12:45", subject: "Lunch", course: "", type: "break" },
    { time: "13:00-13:45", subject: "History projects", course: "", type: "activity" },
    { time: "14:00-14:45", subject: "World Languages", course: "Spanish", type: "subject" },
    { time: "15:00-15:45", subject: "Scripture study", course: "", type: "activity" },
    { time: "16:00-16:45", subject: "Piano lessons", course: "", type: "activity" },
  ],
}

interface BlockAssignment {
  time: string
  subject: string
  course: string
  type: "subject" | "activity" | "break"
}

export default function BlockAssignmentPage() {
  const [termPlan, setTermPlan] = useState<TermPlanData>(initialTermPlan)
  const [blockAssignments, setBlockAssignments] = useState<{ [day: string]: BlockAssignment[] }>(mockBlockAssignments)
  const [activeDay, setActiveDay] = useState<string>("monday")
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Simulate loading data from a database
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Get all selected days
  const selectedDays = Object.entries(termPlan.schedule.days)
    .filter(([_, day]) => day.selected)
    .map(([dayName, _]) => dayName)

  // Format day name
  const formatDayName = (day: string): string => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  // Generate time slots for a day
  const generateTimeSlots = (day: string): { time: string }[] => {
    const daySchedule = termPlan.schedule.days[day]

    if (!daySchedule || !daySchedule.selected) return []

    const { startTime, endTime, blockLength } = daySchedule
    const start = new Date(`2000-01-01T${startTime}:00`)
    const end = new Date(`2000-01-01T${endTime}:00`)

    // If end time is before start time, assume it's the next day
    if (end < start) {
      end.setDate(end.getDate() + 1)
    }

    const timeSlots: { time: string }[] = []
    const currentTime = new Date(start)

    while (currentTime < end) {
      const slotStart = currentTime.toTimeString().substring(0, 5)

      // Add blockLength minutes to current time
      currentTime.setMinutes(currentTime.getMinutes() + blockLength)

      const slotEnd = currentTime.toTimeString().substring(0, 5)
      timeSlots.push({ time: `${slotStart}-${slotEnd}` })
    }

    return timeSlots
  }

  // Get all subjects and activities
  const getAllOptions = () => {
    const subjects = [...termPlan.subjects.core, ...termPlan.subjects.extended]
    const activities = [...termPlan.activities]
    const breaks = ["Lunch", "Break", "Recess", "Free Time"]

    return {
      subjects,
      activities,
      breaks,
    }
  }

  // Handle block assignment change
  const handleBlockAssignmentChange = (day: string, timeSlot: string, field: string, value: string) => {
    setBlockAssignments((prev) => {
      const dayAssignments = [...(prev[day] || [])]
      const blockIndex = dayAssignments.findIndex((block) => block.time === timeSlot)

      if (blockIndex === -1) {
        // Create new block assignment
        const newBlock: BlockAssignment = {
          time: timeSlot,
          subject: field === "subject" ? value : "",
          course: field === "course" ? value : "",
          type: field === "type" ? (value as "subject" | "activity" | "break") : "subject",
        }
        dayAssignments.push(newBlock)
      } else {
        // Update existing block assignment
        dayAssignments[blockIndex] = {
          ...dayAssignments[blockIndex],
          [field]: value,
        }

        // If changing subject, reset course
        if (field === "subject") {
          dayAssignments[blockIndex].course = ""
        }

        // Update type based on subject
        if (field === "subject") {
          const options = getAllOptions()
          if (options.subjects.includes(value)) {
            dayAssignments[blockIndex].type = "subject"
          } else if (options.activities.includes(value)) {
            dayAssignments[blockIndex].type = "activity"
          } else if (options.breaks.includes(value)) {
            dayAssignments[blockIndex].type = "break"
          }
        }
      }

      return {
        ...prev,
        [day]: dayAssignments,
      }
    })
  }

  // Get available courses for a subject
  const getCoursesForSubject = (subject: string): string[] => {
    return termPlan.subjects.courses[subject] || []
  }

  // Handle save
  const handleSave = () => {
    // In a real app, this would save to a database
    console.log("Saving block assignments:", blockAssignments)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // Apply template to all days
  const applyTemplateToAllDays = () => {
    const template = blockAssignments[activeDay] || []

    const updatedAssignments = { ...blockAssignments }

    selectedDays.forEach((day) => {
      if (day !== activeDay) {
        updatedAssignments[day] = [...template]
      }
    })

    setBlockAssignments(updatedAssignments)
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 bg-gray-950 text-white">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            <Calendar className="h-8 w-8 text-green-500" />
            Block Assignment
          </h1>
          <Link href="/parent/term-plan-overview">
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Overview
            </Button>
          </Link>
        </div>
        <p className="text-gray-300 text-lg">
          Assign subjects, activities, and breaks to each time block in your weekly schedule.
        </p>
      </div>

      {/* Day Tabs */}
      <Card className="bg-gray-800 border-green-700">
        <CardHeader className="bg-gradient-to-r from-green-900/50 to-green-700/30 rounded-t-lg pb-2">
          <CardTitle className="text-xl font-semibold flex items-center gap-2 text-white">
            <Clock className="h-5 w-5 text-green-400" />
            Weekly Schedule
          </CardTitle>
          <CardDescription className="text-gray-300">Select a day to assign blocks</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs defaultValue={selectedDays[0]} value={activeDay} onValueChange={setActiveDay} className="w-full">
            <TabsList className="grid grid-cols-5 w-full bg-gray-700">
              {selectedDays.map((day) => (
                <TabsTrigger
                  key={day}
                  value={day}
                  className="data-[state=active]:bg-green-900 data-[state=active]:text-green-100"
                >
                  {formatDayName(day)}
                </TabsTrigger>
              ))}
            </TabsList>

            {selectedDays.map((day) => (
              <TabsContent key={day} value={day} className="mt-4 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium text-green-300">{formatDayName(day)} Schedule</h3>
                  {day === activeDay && (
                    <Button
                      variant="outline"
                      className="border-green-700 text-green-400 hover:bg-green-900/20"
                      onClick={applyTemplateToAllDays}
                    >
                      Apply to All Days
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  {generateTimeSlots(day).map((timeSlot, index) => {
                    const blockAssignment = blockAssignments[day]?.find((block) => block.time === timeSlot.time) || {
                      time: timeSlot.time,
                      subject: "",
                      course: "",
                      type: "subject" as const,
                    }

                    return (
                      <Card key={index} className="bg-gray-700 border-gray-600">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg font-medium text-white">{timeSlot.time}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Subject/Activity Selection */}
                            <div>
                              <label className="text-sm text-gray-300 mb-1 block">Subject or Activity</label>
                              <Select
                                value={blockAssignment.subject}
                                onValueChange={(value) =>
                                  handleBlockAssignmentChange(day, timeSlot.time, "subject", value)
                                }
                              >
                                <SelectTrigger className="bg-gray-800 border-gray-600 text-gray-200">
                                  <SelectValue placeholder="Select subject or activity" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-600 text-gray-200 max-h-[300px]">
                                  <div className="p-2 font-medium text-green-400">Subjects</div>
                                  {termPlan.subjects.core.map((subject) => (
                                    <SelectItem key={`subject-${subject}`} value={subject}>
                                      {subject}
                                    </SelectItem>
                                  ))}
                                  {termPlan.subjects.extended.map((subject) => (
                                    <SelectItem key={`subject-${subject}`} value={subject}>
                                      {subject}
                                    </SelectItem>
                                  ))}

                                  <div className="p-2 font-medium text-orange-400">Activities</div>
                                  {termPlan.activities.map((activity) => (
                                    <SelectItem key={`activity-${activity}`} value={activity}>
                                      {activity}
                                    </SelectItem>
                                  ))}

                                  <div className="p-2 font-medium text-gray-400">Breaks</div>
                                  {["Lunch", "Break", "Recess", "Free Time"].map((breakItem) => (
                                    <SelectItem key={`break-${breakItem}`} value={breakItem}>
                                      {breakItem}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Course Selection (only for subjects) */}
                            {blockAssignment.subject &&
                              termPlan.subjects.core
                                .concat(termPlan.subjects.extended)
                                .includes(blockAssignment.subject) && (
                                <div>
                                  <label className="text-sm text-gray-300 mb-1 block">Course/Unit</label>
                                  <Select
                                    value={blockAssignment.course}
                                    onValueChange={(value) =>
                                      handleBlockAssignmentChange(day, timeSlot.time, "course", value)
                                    }
                                  >
                                    <SelectTrigger className="bg-gray-800 border-gray-600 text-gray-200">
                                      <SelectValue placeholder="Select course" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-600 text-gray-200">
                                      <SelectItem value="">None</SelectItem>
                                      {getCoursesForSubject(blockAssignment.subject).map((course) => (
                                        <SelectItem key={`course-${course}`} value={course}>
                                          {course}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <Link href="/parent/term-plan-overview">
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </Link>

        <Button
          className="bg-green-600 hover:bg-green-500 text-white px-8 flex items-center gap-2"
          onClick={handleSave}
        >
          {saved ? <CheckCircle className="h-5 w-5" /> : <Save className="h-5 w-5" />}
          {saved ? "Saved!" : "Save Assignments"}
        </Button>
      </div>
    </div>
  )
}
