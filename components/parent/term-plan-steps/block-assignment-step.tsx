"use client"

import { useState, useEffect } from "react"
import { Clock, Copy } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { StudentTermPlanData } from "../term-plan-builder"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Users, Plus, Minus } from "lucide-react"

interface BlockAssignment {
  time: string
  subject: string
  course: string
  type: "subject" | "activity" | "break"
}

interface BlockAssignmentStepProps {
  studentData: StudentTermPlanData
  updateStudentData: (data: Partial<StudentTermPlanData>) => void
  students: { id: string; firstName: string; fullName: string }[]
  activeStudentId: string
  copyScheduleFromStudent: (sourceStudentId: string, targetStudentId: string) => void
}

export function BlockAssignmentStep({
  studentData,
  updateStudentData,
  students,
  activeStudentId,
  copyScheduleFromStudent,
}: BlockAssignmentStepProps) {
  // Initialize block assignments with empty arrays for each selected day if not provided
  const defaultBlockAssignments: { [day: string]: BlockAssignment[] } = {}
  Object.entries(studentData.schedule.days)
    .filter(([_, day]) => day.selected)
    .forEach(([dayName, _]) => {
      defaultBlockAssignments[dayName] = []
    })

  const [blockAssignments, setBlockAssignments] = useState<{ [day: string]: BlockAssignment[] }>(
    studentData.blockAssignments || defaultBlockAssignments,
  )
  const [activeDay, setActiveDay] = useState<string>(
    Object.keys(studentData.schedule.days).find((day) => studentData.schedule.days[day].selected) || "monday",
  )
  const [copyFromStudentId, setCopyFromStudentId] = useState("")
  const [isInitialRender, setIsInitialRender] = useState(true)
  const [autoApplyToAllDays, setAutoApplyToAllDays] = useState(true)
  const [dayGroups, setDayGroups] = useState<{ [key: string]: string[] }>({
    "All Days": Object.keys(studentData.schedule.days).filter((day) => studentData.schedule.days[day].selected),
    Weekdays: Object.keys(studentData.schedule.days).filter(
      (day) =>
        ["monday", "tuesday", "wednesday", "thursday", "friday"].includes(day) &&
        studentData.schedule.days[day].selected,
    ),
    Weekend: Object.keys(studentData.schedule.days).filter(
      (day) => ["saturday", "sunday"].includes(day) && studentData.schedule.days[day].selected,
    ),
  })
  const [activeDayGroup, setActiveDayGroup] = useState<string | null>("All Days")

  // Reset block assignments when studentData changes (switching between students)
  useEffect(() => {
    // Initialize block assignments with empty arrays for each selected day if not provided
    const defaultBlockAssignments: { [day: string]: BlockAssignment[] } = {}
    Object.entries(studentData.schedule.days)
      .filter(([_, day]) => day.selected)
      .forEach(([dayName, _]) => {
        defaultBlockAssignments[dayName] = []
      })

    setBlockAssignments(studentData.blockAssignments || defaultBlockAssignments)

    // Set active day to the first selected day of the current student
    const firstSelectedDay = Object.keys(studentData.schedule.days).find(
      (day) => studentData.schedule.days[day].selected,
    )
    if (firstSelectedDay) {
      setActiveDay(firstSelectedDay)
    }

    setIsInitialRender(true)
  }, [studentData.studentId]) // Only reset when the student ID changes

  // Update parent component when block assignments change
  useEffect(() => {
    // Skip the update on initial render to prevent infinite loops
    if (isInitialRender) {
      setIsInitialRender(false)
      return
    }

    // Only update if the block assignments have actually changed
    if (JSON.stringify(studentData.blockAssignments) !== JSON.stringify(blockAssignments)) {
      updateStudentData({ blockAssignments })
    }
  }, [blockAssignments, updateStudentData, studentData.blockAssignments, isInitialRender])

  // Get all selected days
  const selectedDays = Object.entries(studentData.schedule.days)
    .filter(([_, day]) => day.selected)
    .map(([dayName, _]) => dayName)

  // Format day name
  const formatDayName = (day: string): string => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  // Generate time slots for a day based on the schedule
  const generateTimeSlots = (day: string): { time: string }[] => {
    const daySchedule = studentData.schedule.days[day]

    if (!daySchedule || !daySchedule.selected || daySchedule.blocks <= 0) return []

    const { startTime, endTime, blockLength, blocks } = daySchedule

    // Create time slots based on start time, block length, and number of blocks
    const timeSlots: { time: string }[] = []
    let currentHour = Number.parseInt(startTime.split(":")[0], 10)
    let currentMinute = Number.parseInt(startTime.split(":")[1], 10)

    for (let i = 0; i < blocks; i++) {
      const startHour = currentHour.toString().padStart(2, "0")
      const startMinute = currentMinute.toString().padStart(2, "0")

      // Calculate end time for this block
      let endHour = currentHour
      let endMinute = currentMinute + blockLength

      // Handle minute overflow
      if (endMinute >= 60) {
        endHour += Math.floor(endMinute / 60)
        endMinute = endMinute % 60
      }

      // Format the end time
      const endHourStr = endHour.toString().padStart(2, "0")
      const endMinuteStr = endMinute.toString().padStart(2, "0")

      // Add the time slot
      timeSlots.push({ time: `${startHour}:${startMinute}-${endHourStr}:${endMinuteStr}` })

      // Update current time for next block
      currentHour = endHour
      currentMinute = endMinute
    }

    return timeSlots
  }

  // Get all subjects and activities
  const getAllOptions = () => {
    const subjects = [...studentData.subjects.core, ...studentData.subjects.extended]
    const activities = [...studentData.activities, ...studentData.customActivities]
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
      // Create a copy of the current assignments
      const updatedAssignments = { ...prev }

      // Get all selected days
      const allSelectedDays = Object.entries(studentData.schedule.days)
        .filter(([_, dayData]) => dayData.selected)
        .map(([dayName, _]) => dayName)

      // First, update the specific day that was changed
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

      // Update the specific day
      updatedAssignments[day] = dayAssignments

      // If we're in auto-apply mode, apply the same change to all other selected days
      if (autoApplyToAllDays) {
        // For each selected day (except the current one)
        allSelectedDays.forEach((otherDay) => {
          if (otherDay !== day) {
            const otherDayTimeSlots = generateTimeSlots(otherDay)
            const otherDayAssignments = [...(prev[otherDay] || [])]

            // Find a matching time slot (by index position)
            const currentDayTimeSlots = generateTimeSlots(day)
            const timeSlotIndex = currentDayTimeSlots.findIndex((slot) => slot.time === timeSlot)

            if (timeSlotIndex >= 0 && timeSlotIndex < otherDayTimeSlots.length) {
              const otherTimeSlot = otherDayTimeSlots[timeSlotIndex].time
              const otherBlockIndex = otherDayAssignments.findIndex((block) => block.time === otherTimeSlot)

              if (otherBlockIndex === -1) {
                // Create new block assignment for the other day
                const newBlock: BlockAssignment = {
                  time: otherTimeSlot,
                  subject: field === "subject" ? value : "",
                  course: field === "course" ? value : "",
                  type: field === "type" ? (value as "subject" | "activity" | "break") : "subject",
                }
                otherDayAssignments.push(newBlock)
              } else {
                // Update existing block assignment for the other day
                otherDayAssignments[otherBlockIndex] = {
                  ...otherDayAssignments[otherBlockIndex],
                  [field]: value,
                }

                // If changing subject, reset course
                if (field === "subject") {
                  otherDayAssignments[otherBlockIndex].course = ""
                }

                // Update type based on subject
                if (field === "subject") {
                  const options = getAllOptions()
                  if (options.subjects.includes(value)) {
                    otherDayAssignments[otherBlockIndex].type = "subject"
                  } else if (options.activities.includes(value)) {
                    otherDayAssignments[otherBlockIndex].type = "activity"
                  } else if (options.breaks.includes(value)) {
                    otherDayAssignments[otherBlockIndex].type = "break"
                  }
                }
              }
            }

            updatedAssignments[otherDay] = otherDayAssignments
          }
        })
      }

      return updatedAssignments
    })
  }

  // Get available courses for a subject
  const getCoursesForSubject = (subject: string): string[] => {
    return studentData.subjects.courses[subject] || []
  }

  // Apply template to all days
  const applyTemplateToAllDays = () => {
    const template = blockAssignments[activeDay] || []

    const updatedAssignments = { ...blockAssignments }

    selectedDays.forEach((day) => {
      if (day !== activeDay) {
        // Get the time slots for this day
        const dayTimeSlots = generateTimeSlots(day)

        // Create new assignments for this day based on the template
        const dayAssignments: BlockAssignment[] = []

        // Map template assignments to this day's time slots
        dayTimeSlots.forEach((slot, index) => {
          if (index < template.length) {
            // Copy the subject and course from the template
            dayAssignments.push({
              time: slot.time,
              subject: template[index].subject,
              course: template[index].course,
              type: template[index].type,
            })
          } else {
            // Add empty assignment for extra slots
            dayAssignments.push({
              time: slot.time,
              subject: "",
              course: "",
              type: "subject",
            })
          }
        })

        updatedAssignments[day] = dayAssignments
      }
    })

    setBlockAssignments(updatedAssignments)
  }

  // Add a block to the day's schedule
  const addBlock = (day: string) => {
    const daySchedule = { ...studentData.schedule.days[day] }

    // Update the schedule with one more block
    const updatedSchedule = {
      ...studentData.schedule,
      days: {
        ...studentData.schedule.days,
        [day]: {
          ...daySchedule,
          blocks: daySchedule.blocks + 1,
        },
      },
    }

    // Calculate the new end time based on the additional block
    const startHour = Number.parseInt(daySchedule.startTime.split(":")[0], 10)
    const startMinute = Number.parseInt(daySchedule.startTime.split(":")[1], 10)

    // Calculate total minutes for all blocks
    const totalMinutes = (daySchedule.blocks + 1) * daySchedule.blockLength

    // Calculate new end time
    let endHour = startHour + Math.floor(totalMinutes / 60)
    const endMinute = (startMinute + (totalMinutes % 60)) % 60

    // Handle hour overflow for minutes
    if (startMinute + (totalMinutes % 60) >= 60) {
      endHour += 1
    }

    // Format the end time
    const endHourStr = endHour.toString().padStart(2, "0")
    const endMinuteStr = endMinute.toString().padStart(2, "0")

    // Update the end time
    updatedSchedule.days[day].endTime = `${endHourStr}:${endMinuteStr}`

    updateStudentData({ schedule: updatedSchedule })
  }

  // Remove a block from the day's schedule
  const removeBlock = (day: string) => {
    const daySchedule = { ...studentData.schedule.days[day] }

    // Don't allow removing if only one block remains
    if (daySchedule.blocks <= 1) return

    // Update the schedule with one less block
    const updatedSchedule = {
      ...studentData.schedule,
      days: {
        ...studentData.schedule.days,
        [day]: {
          ...daySchedule,
          blocks: daySchedule.blocks - 1,
        },
      },
    }

    // Calculate the new end time based on the reduced blocks
    const startHour = Number.parseInt(daySchedule.startTime.split(":")[0], 10)
    const startMinute = Number.parseInt(daySchedule.startTime.split(":")[1], 10)

    // Calculate total minutes for all blocks
    const totalMinutes = (daySchedule.blocks - 1) * daySchedule.blockLength

    // Calculate new end time
    let endHour = startHour + Math.floor(totalMinutes / 60)
    const endMinute = (startMinute + (totalMinutes % 60)) % 60

    // Handle hour overflow for minutes
    if (startMinute + (totalMinutes % 60) >= 60) {
      endHour += 1
    }

    // Format the end time
    const endHourStr = endHour.toString().padStart(2, "0")
    const endMinuteStr = endMinute.toString().padStart(2, "0")

    // Update the end time
    updatedSchedule.days[day].endTime = `${endHourStr}:${endMinuteStr}`

    updateStudentData({ schedule: updatedSchedule })

    // Also remove the last block assignment if it exists
    setBlockAssignments((prev) => {
      const dayAssignments = [...(prev[day] || [])]
      if (dayAssignments.length > 0) {
        // Remove the last assignment
        dayAssignments.pop()
        return {
          ...prev,
          [day]: dayAssignments,
        }
      }
      return prev
    })
  }

  // Handle copying block assignments from another student
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
        Assign subjects, activities, and breaks to each time block in {studentData.firstName}'s weekly schedule. You can
        also adjust the number of blocks if needed.
      </p>

      {/* Copy from another student */}
      {students.length > 1 && (
        <Card className="p-4 bg-blue-900/20 border-blue-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex-grow">
              <Label htmlFor="copy-from-student" className="text-blue-200 mb-1 block">
                Copy block assignments from another student
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
              Apply Assignments
            </Button>
          </div>
        </Card>
      )}

      <Card className="p-6 bg-gray-700 border-gray-600">
        <Tabs defaultValue={selectedDays[0]} value={activeDay} onValueChange={setActiveDay} className="w-full">
          <TabsList className="grid grid-cols-7 w-full bg-gray-800">
            {selectedDays.map((day) => (
              <TabsTrigger
                key={day}
                value={day}
                className="data-[state=active]:bg-green-900 data-[state=active]:text-green-100"
              >
                {formatDayName(day).substring(0, 3)}
              </TabsTrigger>
            ))}
          </TabsList>

          {selectedDays.map((day) => (
            <TabsContent key={day} value={day} className="mt-4 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-medium text-green-300">
                  {formatDayName(day)} Schedule for {studentData.firstName}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center mr-2">
                    <Switch
                      id="auto-apply"
                      checked={autoApplyToAllDays}
                      onCheckedChange={setAutoApplyToAllDays}
                      className="mr-2"
                    />
                    <Label htmlFor="auto-apply" className="text-sm text-gray-300">
                      Auto-apply changes to all days
                    </Label>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-700 text-green-400 hover:bg-green-900/20"
                      >
                        <Users className="h-4 w-4 mr-1" /> Day Groups
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 bg-gray-800 border-gray-600 text-gray-200">
                      <div className="space-y-4">
                        <h4 className="font-medium text-green-300">Manage Day Groups</h4>
                        <div className="space-y-2">
                          {Object.entries(dayGroups).map(([groupName, days]) => (
                            <div key={groupName} className="flex justify-between items-center">
                              <div>
                                <span className="font-medium">{groupName}</span>
                                <span className="text-xs text-gray-400 ml-2">
                                  ({days.map((d) => formatDayName(d).substring(0, 3)).join(", ")})
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  // Apply the current day's assignments to all days in this group
                                  const currentDayAssignments = blockAssignments[day] || []
                                  if (currentDayAssignments.length > 0) {
                                    setBlockAssignments((prev) => {
                                      const updated = { ...prev }
                                      days.forEach((groupDay) => {
                                        if (groupDay !== day) {
                                          // Map time slots appropriately
                                          const dayTimeSlots = generateTimeSlots(groupDay)
                                          const mappedAssignments = currentDayAssignments
                                            .map((assignment, idx) => {
                                              if (idx < dayTimeSlots.length) {
                                                return {
                                                  ...assignment,
                                                  time: dayTimeSlots[idx].time,
                                                }
                                              }
                                              return null
                                            })
                                            .filter(Boolean) as BlockAssignment[]

                                          updated[groupDay] = mappedAssignments
                                        }
                                      })
                                      return updated
                                    })
                                  }
                                }}
                                className="text-green-400 hover:text-green-300 hover:bg-green-900/30"
                              >
                                Apply
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="pt-2 border-t border-gray-700">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Create a new group with custom days
                              const newGroupName = `Group ${Object.keys(dayGroups).length + 1}`
                              setDayGroups((prev) => ({
                                ...prev,
                                [newGroupName]: [day],
                              }))
                            }}
                            className="w-full border-green-700 text-green-400 hover:bg-green-900/20"
                          >
                            <Plus className="h-4 w-4 mr-1" /> Create New Group
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-700 text-green-400 hover:bg-green-900/20"
                    onClick={() => removeBlock(day)}
                  >
                    <Minus className="h-4 w-4 mr-1" /> Remove Block
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-700 text-green-400 hover:bg-green-900/20"
                    onClick={() => addBlock(day)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Block
                  </Button>
                </div>
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
                    <Card key={index} className="bg-gray-800 border-gray-600">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-green-400" />
                            <span className="font-medium text-green-200">{timeSlot.time}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Subject/Activity Selection */}
                          <div>
                            <Label htmlFor={`${day}-${index}-subject`} className="text-sm text-gray-300 mb-1 block">
                              Subject or Activity
                            </Label>
                            <Select
                              value={blockAssignment.subject}
                              onValueChange={(value) =>
                                handleBlockAssignmentChange(day, timeSlot.time, "subject", value)
                              }
                            >
                              <SelectTrigger
                                id={`${day}-${index}-subject`}
                                className="bg-gray-700 border-gray-600 text-gray-200"
                              >
                                <SelectValue placeholder="Select subject or activity" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-600 text-gray-200 max-h-[300px]">
                                <div className="p-2 font-medium text-green-400">Subjects</div>
                                {studentData.subjects.core.map((subject) => (
                                  <SelectItem key={`subject-${subject}`} value={subject}>
                                    {subject}
                                  </SelectItem>
                                ))}
                                {studentData.subjects.extended.map((subject) => (
                                  <SelectItem key={`subject-${subject}`} value={subject}>
                                    {subject}
                                  </SelectItem>
                                ))}

                                <div className="p-2 font-medium text-orange-400">Activities</div>
                                {studentData.activities.map((activity) => (
                                  <SelectItem key={`activity-${activity}`} value={activity}>
                                    {activity}
                                  </SelectItem>
                                ))}
                                {studentData.customActivities.map((activity) => (
                                  <SelectItem key={`custom-activity-${activity}`} value={activity}>
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
                            studentData.subjects.core
                              .concat(studentData.subjects.extended)
                              .includes(blockAssignment.subject) && (
                              <div>
                                <Label htmlFor={`${day}-${index}-course`} className="text-sm text-gray-300 mb-1 block">
                                  Course/Unit
                                </Label>
                                <Select
                                  value={blockAssignment.course}
                                  onValueChange={(value) =>
                                    handleBlockAssignmentChange(day, timeSlot.time, "course", value)
                                  }
                                >
                                  <SelectTrigger
                                    id={`${day}-${index}-course`}
                                    className="bg-gray-700 border-gray-600 text-gray-200"
                                  >
                                    <SelectValue placeholder="Select course" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-gray-800 border-gray-600 text-gray-200">
                                    <SelectItem value="none">None</SelectItem>
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
                      </div>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>

      <div className="bg-green-900/30 p-4 rounded-lg border border-green-700">
        <p className="text-green-200">
          <span className="font-medium">Tip:</span> You can add or remove blocks to adjust {studentData.firstName}'s
          daily schedule. Make sure to assign subjects and activities to each block to create a complete schedule.
        </p>
      </div>
    </div>
  )
}
