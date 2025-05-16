"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, CheckCircle, Coffee, Save } from "lucide-react"

interface BlockAssignmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  studentId: string
  studentName: string
  day: string
  timeSlot: string
  subjects: {
    core: string[]
    extended: string[]
    courses: {
      [subject: string]: string[]
    }
  }
  activities: string[]
  customActivities: string[]
  currentAssignment: {
    subject: string
    course: string
    type: "subject" | "activity" | "break"
  } | null
  onSave: (
    studentId: string,
    day: string,
    timeSlot: string,
    assignment: {
      subject: string
      course: string
      type: "subject" | "activity" | "break"
    },
  ) => void
}

export function BlockAssignmentModal({
  open,
  onOpenChange,
  studentId,
  studentName,
  day,
  timeSlot,
  subjects,
  activities,
  customActivities,
  currentAssignment,
  onSave,
}: BlockAssignmentModalProps) {
  const [assignmentType, setAssignmentType] = useState<"subject" | "activity" | "break">(
    currentAssignment?.type || "subject",
  )
  const [selectedSubject, setSelectedSubject] = useState<string>(currentAssignment?.subject || "")
  const [selectedCourse, setSelectedCourse] = useState<string>(currentAssignment?.course || "")

  // Format day name
  const formatDayName = (day: string): string => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  // Reset the state when the modal opens or when the current assignment changes
  useEffect(() => {
    if (open) {
      setAssignmentType(currentAssignment?.type || "subject")
      setSelectedSubject(currentAssignment?.subject || "")
      setSelectedCourse(currentAssignment?.course || "")
    }
  }, [open, currentAssignment])

  // Get all available subjects
  const allSubjects = [...subjects.core, ...subjects.extended]

  // Get all available activities
  const allActivities = [...activities, ...customActivities]

  // Get courses for the selected subject
  const coursesForSubject = selectedSubject ? subjects.courses[selectedSubject] || [] : []

  // Handle saving the assignment
  const handleSave = () => {
    const assignment = {
      type: assignmentType,
      subject: selectedSubject,
      course: selectedCourse,
    }

    onSave(studentId, day, timeSlot, assignment)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 text-white border-blue-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-white">
            Assign Block for {formatDayName(day)} {timeSlot}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Assign a subject, activity, or break to this time block.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <RadioGroup
            value={assignmentType}
            onValueChange={(value) => setAssignmentType(value as "subject" | "activity" | "break")}
            className="grid grid-cols-3 gap-4"
          >
            <div className="flex items-center space-x-2 bg-blue-900/20 p-4 rounded-lg border border-blue-700 cursor-pointer hover:bg-blue-900/30">
              <RadioGroupItem value="subject" id="subject" className="text-blue-400" />
              <Label htmlFor="subject" className="flex items-center gap-2 cursor-pointer">
                <BookOpen className="h-5 w-5 text-blue-400" />
                <span>Subject</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 bg-green-900/20 p-4 rounded-lg border border-green-700 cursor-pointer hover:bg-green-900/30">
              <RadioGroupItem value="activity" id="activity" className="text-green-400" />
              <Label htmlFor="activity" className="flex items-center gap-2 cursor-pointer">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Activity</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 bg-gray-700/50 p-4 rounded-lg border border-gray-600 cursor-pointer hover:bg-gray-700">
              <RadioGroupItem value="break" id="break" className="text-gray-400" />
              <Label htmlFor="break" className="flex items-center gap-2 cursor-pointer">
                <Coffee className="h-5 w-5 text-gray-400" />
                <span>Break</span>
              </Label>
            </div>
          </RadioGroup>

          {assignmentType === "subject" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject-select" className="text-white">
                  Select Subject
                </Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger id="subject-select" className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600 text-white">
                    {allSubjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedSubject && coursesForSubject.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="course-select" className="text-white">
                    Select Course
                  </Label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger id="course-select" className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600 text-white">
                      <SelectItem value="none">None</SelectItem>
                      {coursesForSubject.map((course) => (
                        <SelectItem key={course} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {assignmentType === "activity" && (
            <div className="space-y-2">
              <Label htmlFor="activity-select" className="text-white">
                Select Activity
              </Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger id="activity-select" className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select an activity" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  {allActivities.map((activity) => (
                    <SelectItem key={activity} value={activity}>
                      {activity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {assignmentType === "break" && (
            <div className="space-y-2">
              <Label htmlFor="break-type" className="text-white">
                Break Type
              </Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger id="break-type" className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select break type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  <SelectItem value="Lunch">Lunch</SelectItem>
                  <SelectItem value="Recess">Recess</SelectItem>
                  <SelectItem value="Snack">Snack</SelectItem>
                  <SelectItem value="Rest">Rest</SelectItem>
                  <SelectItem value="Free Time">Free Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white">
            <Save className="h-4 w-4 mr-2" />
            Save Assignment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
