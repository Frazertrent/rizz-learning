"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import type { StudentTermPlanData } from "../term-plan-builder"

interface WeeklyScheduleStepProps {
  studentData: StudentTermPlanData
  updateStudentData: (data: Partial<StudentTermPlanData>) => void
  students: { id: string; firstName: string; fullName: string }[]
  activeStudentId: string
  copyScheduleFromStudent: (sourceStudentId: string, targetStudentId: string) => void
}

export function WeeklyScheduleStep({
  studentData,
  updateStudentData,
  students,
  activeStudentId,
  copyScheduleFromStudent,
}: WeeklyScheduleStepProps) {
  const [schedule, setSchedule] = useState(studentData.schedule)
  const [copyFromStudentId, setCopyFromStudentId] = useState("")
  const [isInitialRender, setIsInitialRender] = useState(true)

  // Reset the schedule state when studentData changes (switching between students)
  useEffect(() => {
    setSchedule(studentData.schedule)
    // We're intentionally setting state from props here, so we need to handle the initial render
    setIsInitialRender(true)
  }, [studentData.studentId]) // Only reset when the student ID changes

  // Update parent component when schedule changes - but only if they're different
  useEffect(() => {
    // Skip the update on initial render to prevent infinite loops
    if (isInitialRender) {
      setIsInitialRender(false)
      return
    }

    // Skip the update if the schedule is the same as studentData.schedule
    if (JSON.stringify(studentData.schedule) !== JSON.stringify(schedule)) {
      updateStudentData({ schedule })
    }
  }, [schedule, updateStudentData, studentData.schedule, isInitialRender])

  // Calculate number of blocks based on start time, end time, and block length
  const calculateBlocks = (startTime: string, endTime: string, blockLength: number): number => {
    if (!startTime || !endTime || !blockLength) return 0

    const start = new Date(`2000-01-01T${startTime}:00`)
    const end = new Date(`2000-01-01T${endTime}:00`)

    // If end time is before start time, assume it's the next day
    if (end < start) {
      end.setDate(end.getDate() + 1)
    }

    const diffMinutes = (end.getTime() - start.getTime()) / (1000 * 60)
    return Math.floor(diffMinutes / blockLength)
  }

  // Handle day selection
  const handleDayToggle = (day: string) => {
    setSchedule((prev) => {
      const updatedDays = {
        ...prev.days,
        [day]: {
          ...prev.days[day],
          selected: !prev.days[day].selected,
        },
      }

      // Recalculate blocks for the toggled day
      if (!prev.days[day].selected) {
        // If we're selecting it now
        updatedDays[day].blocks = calculateBlocks(
          updatedDays[day].startTime,
          updatedDays[day].endTime,
          updatedDays[day].blockLength,
        )
      }

      return {
        ...prev,
        days: updatedDays,
      }
    })
  }

  // Handle time or block length change
  const handleScheduleChange = (day: string, field: string, value: string | number) => {
    const updatedDays = { ...schedule.days }

    // Update the specific field
    updatedDays[day] = {
      ...updatedDays[day],
      [field]: value,
    }

    // Recalculate blocks
    updatedDays[day].blocks = calculateBlocks(
      updatedDays[day].startTime,
      updatedDays[day].endTime,
      updatedDays[day].blockLength,
    )

    // If using same schedule for all days, update all selected days
    if (schedule.useSameSchedule && field !== "selected") {
      Object.keys(updatedDays).forEach((d) => {
        if (d !== day && updatedDays[d].selected) {
          updatedDays[d] = {
            ...updatedDays[d],
            [field]: value,
            blocks:
              field === "blockLength"
                ? calculateBlocks(updatedDays[d].startTime, updatedDays[d].endTime, value as number)
                : field === "startTime"
                  ? calculateBlocks(value as string, updatedDays[d].endTime, updatedDays[d].blockLength)
                  : field === "endTime"
                    ? calculateBlocks(updatedDays[d].startTime, value as string, updatedDays[d].blockLength)
                    : updatedDays[d].blocks,
          }
        }
      })
    }

    setSchedule((prev) => ({
      ...prev,
      days: updatedDays,
    }))
  }

  // Handle "use same schedule" toggle
  const handleUseSameScheduleToggle = () => {
    const updatedUseSameSchedule = !schedule.useSameSchedule

    // If turning on "use same schedule", copy the first selected day's schedule to all other selected days
    if (updatedUseSameSchedule) {
      const selectedDays = Object.entries(schedule.days).filter(([_, day]) => day.selected)

      if (selectedDays.length > 0) {
        const [firstSelectedDay, firstSelectedDayData] = selectedDays[0]
        const updatedDays = { ...schedule.days }

        Object.keys(updatedDays).forEach((day) => {
          if (day !== firstSelectedDay && updatedDays[day].selected) {
            updatedDays[day] = {
              ...updatedDays[day],
              startTime: firstSelectedDayData.startTime,
              endTime: firstSelectedDayData.endTime,
              blockLength: firstSelectedDayData.blockLength,
              blocks: firstSelectedDayData.blocks,
            }
          }
        })

        setSchedule((prev) => ({
          ...prev,
          days: updatedDays,
          useSameSchedule: updatedUseSameSchedule,
        }))
      } else {
        setSchedule((prev) => ({
          ...prev,
          useSameSchedule: updatedUseSameSchedule,
        }))
      }
    } else {
      setSchedule((prev) => ({
        ...prev,
        useSameSchedule: updatedUseSameSchedule,
      }))
    }
  }

  // Format day name
  const formatDayName = (day: string): string => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  // Handle applying schedule from another student
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
        Select which days of the week {studentData.firstName} will be homeschooling and set the daily schedule. This
        will help us calculate how many learning blocks you'll have each week.
      </p>

      {/* Copy from another student */}
      {students.length > 1 && (
        <Card className="p-4 bg-blue-900/20 border-blue-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex-grow">
              <Label htmlFor="copy-from-student" className="text-blue-200 mb-1 block">
                Copy schedule from another student
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
              Apply Schedule
            </Button>
          </div>
        </Card>
      )}

      <Card className="p-6 bg-gray-700 border-gray-600">
        <div className="flex flex-wrap gap-2 mb-6">
          {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
            <div
              key={day}
              className={`flex items-center justify-center px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                schedule.days[day].selected
                  ? "bg-green-900/50 border-green-700 text-green-100"
                  : "bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
              }`}
              onClick={() => handleDayToggle(day)}
            >
              <span className="font-medium">{formatDayName(day)}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2 mb-6">
          <Switch
            id="use-same-schedule"
            checked={schedule.useSameSchedule}
            onCheckedChange={handleUseSameScheduleToggle}
          />
          <Label htmlFor="use-same-schedule" className="text-gray-200">
            Use same schedule for all selected days
          </Label>
        </div>

        <div className="space-y-6">
          {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
            .filter((day) => schedule.days[day].selected)
            .map((day) => {
              const dayData = schedule.days[day]
              return (
                <div key={day} className="p-4 border rounded-lg bg-gray-800 border-gray-600">
                  <h4 className="font-medium mb-3 text-gray-200">{formatDayName(day)}</h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`${day}-start-time`} className="text-gray-300">
                        Start Time
                      </Label>
                      <Input
                        id={`${day}-start-time`}
                        type="time"
                        value={dayData.startTime}
                        onChange={(e) => handleScheduleChange(day, "startTime", e.target.value)}
                        disabled={
                          schedule.useSameSchedule &&
                          day !== Object.keys(schedule.days).find((d) => schedule.days[d].selected)
                        }
                        className="bg-gray-700 border-gray-600 text-gray-200"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`${day}-end-time`} className="text-gray-300">
                        End Time
                      </Label>
                      <Input
                        id={`${day}-end-time`}
                        type="time"
                        value={dayData.endTime}
                        onChange={(e) => handleScheduleChange(day, "endTime", e.target.value)}
                        disabled={
                          schedule.useSameSchedule &&
                          day !== Object.keys(schedule.days).find((d) => schedule.days[d].selected)
                        }
                        className="bg-gray-700 border-gray-600 text-gray-200"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`${day}-block-length`} className="text-gray-300">
                        Block Length
                      </Label>
                      <Select
                        value={dayData.blockLength.toString()}
                        onValueChange={(value) => handleScheduleChange(day, "blockLength", Number.parseInt(value))}
                        disabled={
                          schedule.useSameSchedule &&
                          day !== Object.keys(schedule.days).find((d) => schedule.days[d].selected)
                        }
                      >
                        <SelectTrigger id={`${day}-block-length`} className="bg-gray-700 border-gray-600 text-gray-200">
                          <SelectValue placeholder="Select block length" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600 text-gray-200">
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-green-900/30 rounded-lg text-green-100 border border-green-700">
                    <span className="font-medium">Learning Blocks:</span> {dayData.blocks} blocks ({dayData.blockLength}{" "}
                    min each)
                  </div>
                </div>
              )
            })}
        </div>

        {!Object.values(schedule.days).some((day) => day.selected) && (
          <div className="p-4 border border-yellow-700 rounded-lg bg-yellow-900/30 text-yellow-100">
            Please select at least one day of the week for {studentData.firstName}'s homeschool schedule.
          </div>
        )}
      </Card>

      <div className="bg-green-900/30 p-4 rounded-lg border border-green-700">
        <p className="text-green-200">
          <span className="font-medium">Tip:</span> Breaking the day into consistent time blocks helps create a
          predictable routine. Most families find that 30-45 minute blocks work well for focused learning, with short
          breaks in between.
        </p>
      </div>
    </div>
  )
}
