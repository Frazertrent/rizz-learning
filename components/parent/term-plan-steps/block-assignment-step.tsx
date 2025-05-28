"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Copy, Plus, Minus, Users, Clock } from "lucide-react"
import type { StudentTermPlanData } from "../term-plan-builder"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface BlockAssignment {
  time: string
  subject: string
  course: string
  type: "subject" | "activity" | "break"
  platformUrl?: string
  needPlatformHelp?: boolean | null
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
  const [isUpdating, setIsUpdating] = useState(false)

  // Platform URL related state
  const [showNoPlatformModal, setShowNoPlatformModal] = useState(false)
  const [showNeedHelpModal, setShowNeedHelpModal] = useState(false)

  // Use a ref to track the current student ID to detect changes
  const previousStudentIdRef = useRef<string>(studentData.studentId)

  // Reset block assignments when studentData changes (switching between students)
  useEffect(() => {
    // Only reset if we're actually switching to a different student
    if (previousStudentIdRef.current !== studentData.studentId) {
      // Create completely fresh default assignments
      const defaultAssignments = {}
      Object.entries(studentData.schedule.days)
        .filter(([_, day]) => day.selected)
        .forEach(([dayName, _]) => {
          defaultAssignments[dayName] = []
        })

      // Always create a completely new state object when switching students
      if (studentData.blockAssignments) {
        // Deep clone the student's block assignments to ensure no reference sharing
        const clonedAssignments = {}
        Object.keys(studentData.blockAssignments).forEach((day) => {
          clonedAssignments[day] = studentData.blockAssignments[day].map((block) => ({
            time: block.time,
            subject: block.subject,
            course: block.course,
            type: block.type,
            platformUrl: block.platformUrl || "",
            needPlatformHelp: block.needPlatformHelp,
          }))
        })
        setBlockAssignments(clonedAssignments)
      } else {
        setBlockAssignments(defaultAssignments)
      }

      // Set active day to the first selected day of the current student
      const firstSelectedDay = Object.keys(studentData.schedule.days).find(
        (day) => studentData.schedule.days[day].selected,
      )
      if (firstSelectedDay) {
        setActiveDay(firstSelectedDay)
      }

      // Update the ref to track the current student
      previousStudentIdRef.current = studentData.studentId
    }
  }, [studentData.studentId, studentData.schedule.days, studentData.blockAssignments])

  // Update parent component when block assignments change
  useEffect(() => {
    // Skip if we're in the initial mount phase
    if (isInitialRender) {
      setIsInitialRender(false)
      return
    }

    // Create a stable string representation for comparison
    const currentAssignmentsStr = JSON.stringify(blockAssignments)
    const parentAssignmentsStr = JSON.stringify(studentData.blockAssignments || {})

    // Only update if the assignments have actually changed
    if (currentAssignmentsStr !== parentAssignmentsStr) {
      // Use a timeout to defer the update and break potential synchronous loops
      const timeoutId = setTimeout(() => {
        updateStudentData({ blockAssignments })
      }, 0)

      return () => clearTimeout(timeoutId)
    }
  }, [blockAssignments])

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

  // Get the selected days in the correct order
  const getSelectedDays = () => {
    return ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].filter(
      (day) => studentData.schedule.days[day]?.selected,
    )
  }

  // Handle block assignment change
  const handleBlockAssignmentChange = (day: string, timeSlot: string, field: string, value: string) => {
    setBlockAssignments((prev) => {
      // Create a deep copy of the current assignments
      const updatedAssignments = JSON.parse(JSON.stringify(prev))

      // First, update the specific day that was changed
      if (!updatedAssignments[day]) {
        updatedAssignments[day] = []
      }

      // Find the time slot index in the day's schedule
      const dayTimeSlots = generateTimeSlots(day)
      const timeSlotIndex = dayTimeSlots.findIndex((slot) => slot.time === timeSlot)

      // Find or create the block assignment
      const dayAssignments = updatedAssignments[day]
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

      // If auto-apply is enabled, apply the same change to all other selected days
      if (autoApplyToAllDays) {
        const selectedDays = getSelectedDays()

        // For each selected day (except the current one)
        selectedDays.forEach((otherDay) => {
          if (otherDay !== day) {
            // Get the time slots for the other day
            const otherDayTimeSlots = generateTimeSlots(otherDay)

            // Only proceed if we have a valid time slot index and the other day has enough time slots
            if (timeSlotIndex >= 0 && timeSlotIndex < otherDayTimeSlots.length) {
              // Get the corresponding time slot in the other day
              const otherTimeSlot = otherDayTimeSlots[timeSlotIndex].time

              // Initialize the day's assignments if needed
              if (!updatedAssignments[otherDay]) {
                updatedAssignments[otherDay] = []
              }

              // Find or create the block assignment in the other day
              const otherDayAssignments = updatedAssignments[otherDay]
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

  // Handle applying schedule from another student
  const handleCopyFromStudent = () => {
    if (copyFromStudentId && copyFromStudentId !== activeStudentId) {
      copyScheduleFromStudent(copyFromStudentId, activeStudentId)
      setCopyFromStudentId("")
      setIsInitialRender(false)
    }
  }

  // Handle platform URL change
  const handlePlatformUrlChange = (e: React.ChangeEvent<HTMLInputElement>, day: string, timeSlot: string) => {
    const value = e.target.value.trim()

    setBlockAssignments((prev) => {
      // Create a deep copy of the current assignments
      const updatedAssignments = JSON.parse(JSON.stringify(prev))

      // Find the time slot index in the day's schedule
      const dayTimeSlots = generateTimeSlots(day)
      const timeSlotIndex = dayTimeSlots.findIndex((slot) => slot.time === timeSlot)

      // Initialize the day's assignments if needed
      if (!updatedAssignments[day]) {
        updatedAssignments[day] = []
      }

      // Find or create the block assignment
      const blockIndex = updatedAssignments[day].findIndex((block) => block.time === timeSlot)

      if (blockIndex === -1) {
        // Create new block if it doesn't exist
        const newBlock = {
          time: timeSlot,
          subject: "",
          course: "",
          type: "subject",
          platformUrl: value,
          needPlatformHelp: value ? null : undefined,
        }
        updatedAssignments[day].push(newBlock)
      } else {
        // Update existing block with a new object
        updatedAssignments[day][blockIndex] = {
          ...updatedAssignments[day][blockIndex],
          platformUrl: value,
          needPlatformHelp: value ? null : updatedAssignments[day][blockIndex].needPlatformHelp,
        }
      }

      // If auto-apply is enabled, apply the same change to all other selected days
      if (autoApplyToAllDays) {
        const selectedDays = getSelectedDays()

        // For each selected day (except the current one)
        selectedDays.forEach((otherDay) => {
          if (otherDay !== day) {
            // Get the time slots for the other day
            const otherDayTimeSlots = generateTimeSlots(otherDay)

            // Only proceed if we have a valid time slot index and the other day has enough time slots
            if (timeSlotIndex >= 0 && timeSlotIndex < otherDayTimeSlots.length) {
              // Get the corresponding time slot in the other day
              const otherTimeSlot = otherDayTimeSlots[timeSlotIndex].time

              // Initialize the day's assignments if needed
              if (!updatedAssignments[otherDay]) {
                updatedAssignments[otherDay] = []
              }

              // Find or create the block assignment in the other day
              const otherBlockIndex = updatedAssignments[otherDay].findIndex((block) => block.time === otherTimeSlot)

              if (otherBlockIndex === -1) {
                // Create new block if it doesn't exist
                const newBlock = {
                  time: otherTimeSlot,
                  subject: "",
                  course: "",
                  type: "subject",
                  platformUrl: value,
                  needPlatformHelp: value ? null : undefined,
                }
                updatedAssignments[otherDay].push(newBlock)
              } else {
                // Update existing block with a new object
                updatedAssignments[otherDay][otherBlockIndex] = {
                  ...updatedAssignments[otherDay][otherBlockIndex],
                  platformUrl: value,
                  needPlatformHelp: value ? null : updatedAssignments[otherDay][otherBlockIndex].needPlatformHelp,
                }
              }
            }
          }
        })
      }

      return updatedAssignments
    })
  }

  // Handle platform option click
  const handlePlatformOptionClick = (needHelp: boolean, day: string, timeSlot: string) => {
    setBlockAssignments((prev) => {
      // Create a deep copy of the current assignments
      const updatedAssignments = JSON.parse(JSON.stringify(prev))

      // Find the time slot index in the day's schedule
      const dayTimeSlots = generateTimeSlots(day)
      const timeSlotIndex = dayTimeSlots.findIndex((slot) => slot.time === timeSlot)

      // Initialize the day's assignments if needed
      if (!updatedAssignments[day]) {
        updatedAssignments[day] = []
      }

      // Find or create the block assignment
      const blockIndex = updatedAssignments[day].findIndex((block) => block.time === timeSlot)

      if (blockIndex === -1) {
        // Create new block if it doesn't exist
        const newBlock = {
          time: timeSlot,
          subject: "",
          course: "",
          type: "subject",
          needPlatformHelp: needHelp,
        }
        updatedAssignments[day].push(newBlock)
      } else {
        // Update existing block with a new object
        updatedAssignments[day][blockIndex] = {
          ...updatedAssignments[day][blockIndex],
          needPlatformHelp: needHelp,
        }
      }

      // If auto-apply is enabled, apply the same change to all other selected days
      if (autoApplyToAllDays) {
        const selectedDays = getSelectedDays()

        // For each selected day (except the current one)
        selectedDays.forEach((otherDay) => {
          if (otherDay !== day) {
            // Get the time slots for the other day
            const otherDayTimeSlots = generateTimeSlots(otherDay)

            // Only proceed if we have a valid time slot index and the other day has enough time slots
            if (timeSlotIndex >= 0 && timeSlotIndex < otherDayTimeSlots.length) {
              // Get the corresponding time slot in the other day
              const otherTimeSlot = otherDayTimeSlots[timeSlotIndex].time

              // Initialize the day's assignments if needed
              if (!updatedAssignments[otherDay]) {
                updatedAssignments[otherDay] = []
              }

              // Find or create the block assignment in the other day
              const otherBlockIndex = updatedAssignments[otherDay].findIndex((block) => block.time === otherTimeSlot)

              if (otherBlockIndex === -1) {
                // Create new block if it doesn't exist
                const newBlock = {
                  time: otherTimeSlot,
                  subject: "",
                  course: "",
                  type: "subject",
                  needPlatformHelp: needHelp,
                }
                updatedAssignments[otherDay].push(newBlock)
              } else {
                // Update existing block with a new object
                updatedAssignments[otherDay][otherBlockIndex] = {
                  ...updatedAssignments[otherDay][otherBlockIndex],
                  needPlatformHelp: needHelp,
                }
              }
            }
          }
        })
      }

      return updatedAssignments
    })

    // Show the appropriate modal
    if (needHelp) {
      setShowNeedHelpModal(true)
    } else {
      setShowNoPlatformModal(true)
    }
  }

  // Handle adding a new block
  const handleAddBlock = (day: string) => {
    if (isUpdating) return // Prevent concurrent updates

    setIsUpdating(true)

    // STEP 1: Update the schedule configuration first
    const updatedSchedule = JSON.parse(JSON.stringify(studentData.schedule))

    // Get the selected days based on auto-apply setting
    const selectedDays = autoApplyToAllDays ? getSelectedDays() : [day]

    // Update blocks count for each selected day
    selectedDays.forEach((currentDay) => {
      if (updatedSchedule.days[currentDay] && updatedSchedule.days[currentDay].selected) {
        updatedSchedule.days[currentDay].blocks += 1
      }
    })

    // Update the parent component with the new schedule
    updateStudentData({ schedule: updatedSchedule })

    // STEP 2: Update block assignments
    setBlockAssignments((prev) => {
      // Create a deep copy of the current assignments
      const updatedAssignments = JSON.parse(JSON.stringify(prev))

      // Process each selected day
      selectedDays.forEach((currentDay) => {
        // Initialize the day's assignments if needed
        if (!updatedAssignments[currentDay]) {
          updatedAssignments[currentDay] = []
        }

        // Get the day schedule
        const daySchedule = studentData.schedule.days[currentDay]
        if (!daySchedule || !daySchedule.selected) return

        const blockLength = daySchedule.blockLength || 45
        let startTime

        // If there are existing blocks, use the end time of the last block as the start time
        if (updatedAssignments[currentDay].length > 0) {
          const lastBlock = updatedAssignments[currentDay][updatedAssignments[currentDay].length - 1]
          startTime = lastBlock.time.split("-")[1]
        } else {
          // Otherwise, use the day's start time
          startTime = daySchedule.startTime || "08:00"
        }

        // Calculate the end time
        const [hours, minutes] = startTime.split(":").map(Number)
        const startDate = new Date(2000, 0, 1, hours, minutes)
        const endDate = new Date(startDate.getTime() + blockLength * 60000)

        const endHours = endDate.getHours().toString().padStart(2, "0")
        const endMinutes = endDate.getMinutes().toString().padStart(2, "0")
        const endTime = `${endHours}:${endMinutes}`

        // Create the new time slot
        const newTimeSlot = `${startTime}-${endTime}`

        // Add the new block
        updatedAssignments[currentDay].push({
          time: newTimeSlot,
          subject: "",
          course: "",
          type: "subject",
          platformUrl: "",
          needPlatformHelp: null,
        })
      })

      return updatedAssignments
    })

    // Reset the updating flag after a short delay
    setTimeout(() => setIsUpdating(false), 100)
  }

  // Handle removing a block
  const handleRemoveBlock = (day: string) => {
    if (isUpdating) return // Prevent concurrent updates

    setIsUpdating(true)

    // STEP 1: Update the schedule configuration first
    const updatedSchedule = JSON.parse(JSON.stringify(studentData.schedule))

    // Get the selected days based on auto-apply setting
    const selectedDays = autoApplyToAllDays ? getSelectedDays() : [day]

    // Update blocks count for each selected day (never go below 0)
    selectedDays.forEach((currentDay) => {
      if (updatedSchedule.days[currentDay] && updatedSchedule.days[currentDay].selected) {
        updatedSchedule.days[currentDay].blocks = Math.max(0, updatedSchedule.days[currentDay].blocks - 1)
      }
    })

    // Update the parent component with the new schedule
    updateStudentData({ schedule: updatedSchedule })

    // STEP 2: Update block assignments
    setBlockAssignments((prev) => {
      // Create a deep copy of the current assignments
      const updatedAssignments = JSON.parse(JSON.stringify(prev))

      // Process each selected day
      selectedDays.forEach((currentDay) => {
        // Remove the last block if there are any blocks
        if (updatedAssignments[currentDay] && updatedAssignments[currentDay].length > 0) {
          updatedAssignments[currentDay].pop()
        }
      })

      return updatedAssignments
    })

    // Reset the updating flag after a short delay
    setTimeout(() => setIsUpdating(false), 100)
  }

  // Handle toggle for auto-apply changes
  const handleAutoApplyToggle = (checked: boolean) => {
    setAutoApplyToAllDays(checked)
  }

  // Add this after the other useEffect hooks

  return (
    <div className="space-y-6">
      <p className="text-gray-300">
        Assign subjects, activities, and breaks to each time block in {studentData.firstName}'s weekly schedule. You can
        also add platform URLs for online resources.
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
        <Tabs defaultValue={activeDay} value={activeDay} onValueChange={setActiveDay} className="w-full">
          <TabsList className="grid grid-cols-7 w-full bg-gray-800">
            {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
              .filter((day) => studentData.schedule.days[day]?.selected)
              .map((day) => (
                <TabsTrigger
                  key={day}
                  value={day}
                  className="data-[state=active]:bg-green-900 data-[state=active]:text-green-100"
                >
                  {formatDayName(day).substring(0, 3)}
                </TabsTrigger>
              ))}
          </TabsList>

          {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
            .filter((day) => studentData.schedule.days[day]?.selected)
            .map((day) => (
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
                        onCheckedChange={handleAutoApplyToggle}
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
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-700 text-green-400 hover:bg-green-900/20"
                      onClick={() => handleRemoveBlock(day)}
                    >
                      <Minus className="h-4 w-4 mr-1" /> Remove Block
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-700 text-green-400 hover:bg-green-900/20"
                      onClick={() => handleAddBlock(day)}
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
                                  <Label
                                    htmlFor={`${day}-${index}-course`}
                                    className="text-sm text-gray-300 mb-1 block"
                                  >
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

                          {/* Platform URL section */}
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label
                                htmlFor={`${day}-${index}-platform-url`}
                                className="text-sm text-gray-300 mb-1 block"
                              >
                                URL of course platform
                              </Label>
                              <Input
                                id={`${day}-${index}-platform-url`}
                                placeholder="paste here"
                                value={blockAssignment.platformUrl || ""}
                                onChange={(e) => handlePlatformUrlChange(e, day, timeSlot.time)}
                                className="bg-gray-700 border-gray-600 text-gray-200"
                              />
                            </div>

                            {!blockAssignment.platformUrl && (
                              <div className="flex flex-col justify-end">
                                <span className="text-sm text-gray-300 mb-1">I don't have one and:</span>
                                <div className="flex gap-2">
                                  <Button
                                    variant={blockAssignment.needPlatformHelp === false ? "default" : "outline"}
                                    onClick={() => handlePlatformOptionClick(false, day, timeSlot.time)}
                                    className={
                                      blockAssignment.needPlatformHelp === false
                                        ? "bg-green-700 hover:bg-green-600"
                                        : "border-gray-500 text-gray-300"
                                    }
                                    size="sm"
                                  >
                                    I don't need one
                                  </Button>
                                  <Button
                                    variant={blockAssignment.needPlatformHelp === true ? "default" : "outline"}
                                    onClick={() => handlePlatformOptionClick(true, day, timeSlot.time)}
                                    className={
                                      blockAssignment.needPlatformHelp === true
                                        ? "bg-green-700 hover:bg-green-600"
                                        : "border-gray-500 text-gray-300"
                                    }
                                    size="sm"
                                  >
                                    I need help finding one!
                                  </Button>
                                </div>
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

      {/* No Platform Modal */}
      <Dialog open={showNoPlatformModal} onOpenChange={setShowNoPlatformModal}>
        <DialogContent className="bg-gray-800 text-gray-200 border-gray-600">
          <DialogHeader>
            <DialogTitle className="text-gray-100">No Platform Needed</DialogTitle>
            <DialogDescription className="text-gray-300">
              No problem - just leave it out and your schedule simply won't include the link to your platform for that
              subject, activity, or class.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Need Help Modal */}
      <Dialog open={showNeedHelpModal} onOpenChange={setShowNeedHelpModal}>
        <DialogContent className="bg-gray-800 text-gray-200 border-gray-600">
          <DialogHeader>
            <DialogTitle className="text-gray-100">Platform Help</DialogTitle>
            <DialogDescription className="text-gray-300">
              Then we'll help you find one! After you submit your term-plan-builder, we'll help you find one!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
