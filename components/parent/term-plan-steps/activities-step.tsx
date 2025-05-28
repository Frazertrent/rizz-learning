"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusCircleIcon, Copy } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { StudentTermPlanData } from "../term-plan-builder"

interface ActivitiesStepProps {
  studentData: StudentTermPlanData
  updateStudentData: (data: Partial<StudentTermPlanData>) => void
  students: { id: string; firstName: string; fullName: string }[]
  activeStudentId: string
  copyScheduleFromStudent: (sourceStudentId: string, targetStudentId: string) => void
}

export function ActivitiesStep({
  studentData,
  updateStudentData,
  students,
  activeStudentId,
  copyScheduleFromStudent,
}: ActivitiesStepProps) {
  const [selectedActivities, setSelectedActivities] = useState<string[]>(
    studentData.activities.filter((activity) => !studentData.customActivities?.includes(activity)),
  )
  const [customActivities, setCustomActivities] = useState<string[]>(studentData.customActivities || [])
  const [newCustomActivity, setNewCustomActivity] = useState("")
  const [copyFromStudentId, setCopyFromStudentId] = useState("")
  const [isInitialRender, setIsInitialRender] = useState(true)

  // Standard activities
  const standardActivities = [
    "Reading",
    "Writing / journaling",
    "Math drills",
    "Educational games",
    "Instrument practice",
    "Physical activity",
    "Arts and crafts",
    "Family time",
    "Scripture study",
    "Structured free time",
    "Science experiments",
    "History projects",
    "Field trips",
    "Nature study",
    "Cooking / Home Economics",
  ]

  // Reset the state when studentData changes (switching between students)
  useEffect(() => {
    setSelectedActivities(
      studentData.activities.filter((activity) => !studentData.customActivities?.includes(activity)),
    )
    setCustomActivities(studentData.customActivities || [])
    setIsInitialRender(true)
  }, [studentData.studentId]) // Only reset when the student ID changes

  // Update parent component when activities change - but only if they're different
  useEffect(() => {
    // Skip the update on initial render to prevent infinite loops
    if (isInitialRender) {
      setIsInitialRender(false)
      return
    }

    const combinedActivities = [...selectedActivities, ...customActivities]

    // Only update if the activities have actually changed
    if (
      JSON.stringify(studentData.activities) !== JSON.stringify(combinedActivities) ||
      JSON.stringify(studentData.customActivities) !== JSON.stringify(customActivities)
    ) {
      updateStudentData({
        activities: combinedActivities,
        customActivities,
      })
    }
  }, [
    selectedActivities,
    customActivities,
    updateStudentData,
    studentData.activities,
    studentData.customActivities,
    isInitialRender,
  ])

  const handleActivityToggle = (activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity) ? prev.filter((a) => a !== activity) : [...prev, activity],
    )
  }

  const handleAddCustomActivity = () => {
    if (newCustomActivity.trim() && !customActivities.includes(newCustomActivity.trim())) {
      setCustomActivities((prev) => [...prev, newCustomActivity.trim()])
      setNewCustomActivity("")
    }
  }

  const handleRemoveCustomActivity = (activity: string) => {
    setCustomActivities((prev) => prev.filter((a) => a !== activity))
  }

  // Handle applying activities from another student
  const handleCopyFromStudent = () => {
    if (copyFromStudentId && copyFromStudentId !== activeStudentId) {
      copyScheduleFromStudent(copyFromStudentId, activeStudentId)
      // Clear the selection after copying
      setCopyFromStudentId("")
      // Reset the initial render flag to allow updates
      setIsInitialRender(false)
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-300">
        Select specific activities you want to include in {studentData.firstName}'s weekly schedule. These will form the
        foundation of their daily routine.
      </p>

      {/* Copy from another student */}
      {students.length > 1 && (
        <Card className="p-4 bg-blue-900/20 border-blue-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex-grow">
              <Label htmlFor="copy-from-student" className="text-blue-200 mb-1 block">
                Copy activities from another student
              </Label>
              <Select value={copyFromStudentId} onValueChange={setCopyFromStudentId}>
                <SelectTrigger id="copy-from-student" className="bg-gray-800 border-gray-600 text-gray-200">
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600 text-gray-200">
                  {students
                    .filter((student) => student.id !== activeStudentId)
                    .map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.firstName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleCopyFromStudent}
              disabled={!copyFromStudentId || copyFromStudentId === activeStudentId}
              className="bg-blue-700 hover:bg-blue-600 text-white flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Apply Activities
            </Button>
          </div>
        </Card>
      )}

      <Card className="p-6 bg-gray-700 border-gray-600">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {standardActivities.map((activity) => (
            <div
              key={activity}
              className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedActivities.includes(activity)
                  ? "bg-orange-900/50 border-orange-700 text-orange-100"
                  : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => handleActivityToggle(activity)}
            >
              <Checkbox
                id={`activity-${activity}`}
                checked={selectedActivities.includes(activity)}
                onCheckedChange={() => handleActivityToggle(activity)}
              />
              <Label htmlFor={`activity-${activity}`} className="cursor-pointer w-full">
                {activity}
              </Label>
            </div>
          ))}
        </div>

        {customActivities.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium mb-2 text-gray-200">Your Custom Activities</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {customActivities.map((activity) => (
                <div
                  key={activity}
                  className="flex items-center justify-between p-3 rounded-lg border border-orange-700 bg-orange-900/30 text-orange-100"
                >
                  <span>{activity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCustomActivity(activity)}
                    className="text-orange-200 hover:text-orange-100 hover:bg-orange-800/50"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label htmlFor="custom-activity" className="text-gray-200">
              Add a custom activity
            </Label>
            <Input
              id="custom-activity"
              placeholder="e.g., Coding practice"
              value={newCustomActivity}
              onChange={(e) => setNewCustomActivity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddCustomActivity()
                }
              }}
              className="bg-gray-800 border-gray-600 text-gray-200"
            />
          </div>
          <Button
            type="button"
            onClick={handleAddCustomActivity}
            disabled={!newCustomActivity.trim()}
            className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white"
          >
            <PlusCircleIcon className="w-4 h-4" />
            Add
          </Button>
        </div>
      </Card>

      <div className="bg-orange-900/30 p-4 rounded-lg border border-orange-700">
        <p className="text-orange-200">
          <span className="font-medium">Tip:</span> Including a mix of academic, creative, and physical activities
          creates a well-rounded homeschool experience. Don't forget to include activities that {studentData.firstName}{" "}
          particularly enjoys!
        </p>
      </div>
    </div>
  )
}
