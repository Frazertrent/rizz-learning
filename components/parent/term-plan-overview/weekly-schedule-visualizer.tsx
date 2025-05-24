"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, List, Plus, ExternalLink } from "lucide-react"
import { BlockAssignmentModal } from "./block-assignment-modal"
import { Button } from "@/components/ui/button"

interface WeeklyScheduleVisualizerProps {
  schedule: {
    days: {
      [key: string]: {
        selected: boolean
        startTime: string
        endTime: string
        blockLength: number
        blocks: number
      }
    }
    useSameSchedule: boolean
  }
  blockAssignments: {
    [day: string]: {
      time: string
      subject: string
      course: string
      type: "subject" | "activity" | "break"
      platformUrl?: string
    }[]
  }
  subjects: {
    core: string[]
    extended: string[]
    courses: {
      [subject: string]: string[]
    }
  }
  activities: string[]
  customActivities: string[]
  studentId: string
  studentName: string
  onBlockAssignmentChange: (
    studentId: string,
    day: string,
    timeSlot: string,
    assignment: {
      subject: string
      course: string
      type: "subject" | "activity" | "break"
      platformUrl?: string
    },
  ) => void
  saveChanges: () => void
}

export function WeeklyScheduleVisualizer({
  schedule,
  blockAssignments,
  subjects,
  activities,
  customActivities,
  studentId,
  studentName,
  onBlockAssignmentChange,
  saveChanges,
}: WeeklyScheduleVisualizerProps) {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState<{ day: string; timeSlot: string } | null>(null)

  // Get all selected days
  const selectedDays = Object.entries(schedule.days)
    .filter(([_, day]) => day.selected)
    .map(([dayName, _]) => dayName)

  // Format day name
  const formatDayName = (day: string): string => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  // Get short day name
  const getShortDayName = (day: string): string => {
    return formatDayName(day).substring(0, 3)
  }

  // Get color for block type
  const getBlockColor = (type: "subject" | "activity" | "break"): string => {
    switch (type) {
      case "subject":
        return "bg-blue-900/40 border-blue-700 text-blue-100"
      case "activity":
        return "bg-green-900/40 border-green-700 text-green-100"
      case "break":
        return "bg-gray-800 border-gray-600 text-gray-300"
      default:
        return "bg-gray-800 border-gray-600 text-gray-300"
    }
  }

  // Generate time slots for a day based on start time, end time, and block length
  const generateTimeSlots = (day: string): string[] => {
    if (!schedule.days[day] || !schedule.days[day].selected) return []

    const { startTime, endTime, blockLength } = schedule.days[day]
    const slots: string[] = []

    const start = new Date(`2000-01-01T${startTime}:00`)
    const end = new Date(`2000-01-01T${endTime}:00`)

    // If end time is before start time, assume it's the next day
    if (end < start) {
      end.setDate(end.getDate() + 1)
    }

    const current = new Date(start)

    while (current < end) {
      const slotStart = current.toTimeString().substring(0, 5)
      current.setMinutes(current.getMinutes() + blockLength)

      // If we've gone past the end time, break
      if (current > end) break

      const slotEnd = current.toTimeString().substring(0, 5)
      slots.push(`${slotStart}-${slotEnd}`)
    }

    return slots
  }

  // Get all time slots across all days
  const getAllTimeSlots = (): string[] => {
    const allTimeSlots = new Set<string>()

    selectedDays.forEach((day) => {
      const daySlots = generateTimeSlots(day)
      daySlots.forEach((slot) => allTimeSlots.add(slot))
    })

    return Array.from(allTimeSlots).sort((a, b) => {
      const aStart = a.split("-")[0]
      const bStart = b.split("-")[0]
      return aStart.localeCompare(bStart)
    })
  }

  // Get block assignment for a specific day and time
  const getBlockAssignment = (day: string, time: string) => {
    return blockAssignments[day]?.find((block) => block.time === time)
  }

  // Handle opening the assignment modal
  const openAssignmentModal = (day: string, timeSlot: string) => {
    setSelectedBlock({ day, timeSlot })
    setAssignmentModalOpen(true)
  }

  // Handle saving the assignment
  const handleSaveAssignment = (
    studentId: string,
    day: string,
    timeSlot: string,
    assignment: {
      subject: string
      course: string
      type: "subject" | "activity" | "break"
      platformUrl?: string
    },
  ) => {
    onBlockAssignmentChange(studentId, day, timeSlot, assignment)
  }

  // Handle URL click - Updated to properly handle the URL
  const handleUrlClick = (e: React.MouseEvent, url: string | undefined) => {
    e.stopPropagation() // Prevent opening the assignment modal

    if (url && url.trim() !== "") {
      // Ensure the URL has a protocol
      const urlToOpen = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`

      console.log("Opening URL:", urlToOpen) // Debug log
      window.open(urlToOpen, "_blank", "noopener,noreferrer")
    }
  }

  // Check if there are any block assignments
  const hasBlockAssignments =
    blockAssignments &&
    Object.keys(blockAssignments).length > 0 &&
    Object.values(blockAssignments).some((dayAssignments) => Array.isArray(dayAssignments) && dayAssignments.length > 0)

  // Check if there are any selected days
  const hasSelectedDays = selectedDays.length > 0

  if (!hasSelectedDays) {
    return (
      <div className="p-6 border border-yellow-700 rounded-lg bg-yellow-900/30 text-yellow-100 text-center">
        <p className="mb-2 font-medium">No days have been selected for the schedule.</p>
        <p>Edit the schedule to select days and set time blocks.</p>
      </div>
    )
  }

  const timeSlots = getAllTimeSlots()

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "calendar" | "list")} className="w-auto">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="calendar" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" /> Calendar
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-1">
              <List className="h-4 w-4" /> List
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {viewMode === "calendar" && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border-b border-gray-700 text-left text-gray-400 font-medium">Time</th>
                {selectedDays.map((day) => (
                  <th key={day} className="p-2 border-b border-gray-700 text-center text-gray-400 font-medium">
                    {getShortDayName(day)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((timeSlot) => (
                <tr key={timeSlot} className="border-b border-gray-800 hover:bg-gray-900/50">
                  <td className="p-2 text-gray-300 font-medium">{timeSlot}</td>
                  {selectedDays.map((day) => {
                    const assignment = getBlockAssignment(day, timeSlot)
                    const dayHasTimeSlot = generateTimeSlots(day).includes(timeSlot)

                    return (
                      <td key={`${day}-${timeSlot}`} className="p-2">
                        {dayHasTimeSlot ? (
                          assignment ? (
                            <div
                              className={`p-2 rounded-lg border ${getBlockColor(
                                assignment.type,
                              )} text-sm transition-colors hover:opacity-90 cursor-pointer`}
                              onClick={() => openAssignmentModal(day, timeSlot)}
                            >
                              <div className="flex items-start justify-between gap-1">
                                <div className="flex-1">
                                  <div className="font-medium">{assignment.subject}</div>
                                  {assignment.course && assignment.course !== "none" && (
                                    <div className="text-xs opacity-80">{assignment.course}</div>
                                  )}
                                </div>
                                {assignment.platformUrl && (
                                  <button
                                    onClick={(e) => handleUrlClick(e, assignment.platformUrl)}
                                    className="p-0.5 rounded hover:bg-white/10 transition-colors"
                                    aria-label="Open in new tab"
                                    title={`Open ${assignment.platformUrl}`}
                                  >
                                    <ExternalLink className="h-3 w-3 opacity-70 hover:opacity-100 cursor-pointer hover:text-blue-400 transition-all flex-shrink-0" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div
                              className="p-2 rounded-lg border border-gray-700 bg-gray-800/50 text-gray-500 text-sm text-center cursor-pointer hover:bg-gray-700/50 flex items-center justify-center gap-1"
                              onClick={() => openAssignmentModal(day, timeSlot)}
                            >
                              <Plus className="h-3 w-3" /> Assign
                            </div>
                          )
                        ) : (
                          <div className="p-2 rounded-lg border border-gray-800 bg-gray-900/30 text-gray-700 text-sm text-center">
                            -
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === "list" && (
        <div className="space-y-6">
          {selectedDays.map((day) => {
            const dayTimeSlots = generateTimeSlots(day)

            return (
              <Card key={day} className="bg-gray-800 border-gray-700 overflow-hidden">
                <div className="p-3 bg-gray-700 font-medium text-white">{formatDayName(day)}</div>
                <div className="p-4 space-y-2">
                  {dayTimeSlots.length > 0 ? (
                    dayTimeSlots.map((timeSlot) => {
                      const assignment = getBlockAssignment(day, timeSlot)

                      return (
                        <div
                          key={timeSlot}
                          className={`p-3 rounded-lg border ${
                            assignment ? getBlockColor(assignment.type) : "bg-gray-800/50 border-gray-700 text-gray-400"
                          } flex justify-between items-center cursor-pointer hover:opacity-90`}
                          onClick={() => openAssignmentModal(day, timeSlot)}
                        >
                          <div className="flex-1">
                            {assignment ? (
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="font-medium">{assignment.subject}</div>
                                  {assignment.course && assignment.course !== "none" && (
                                    <div className="text-xs opacity-80">{assignment.course}</div>
                                  )}
                                </div>
                                {assignment.platformUrl && (
                                  <button
                                    onClick={(e) => handleUrlClick(e, assignment.platformUrl)}
                                    className="p-0.5 rounded hover:bg-white/10 transition-colors"
                                    aria-label="Open in new tab"
                                    title={`Open ${assignment.platformUrl}`}
                                  >
                                    <ExternalLink className="h-3 w-3 opacity-70 hover:opacity-100 cursor-pointer hover:text-blue-400 transition-all flex-shrink-0" />
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <Plus className="h-3 w-3" /> Assign
                              </div>
                            )}
                          </div>
                          <Badge variant="outline" className="bg-gray-900/50 border-gray-600">
                            {timeSlot}
                          </Badge>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center text-gray-400 py-4">No time slots for this day</div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {timeSlots.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Button onClick={saveChanges} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 text-lg">
            Save Schedule Changes
          </Button>
        </div>
      )}

      {/* Block Assignment Modal */}
      {selectedBlock && (
        <BlockAssignmentModal
          open={assignmentModalOpen}
          onOpenChange={setAssignmentModalOpen}
          studentId={studentId}
          studentName={studentName}
          day={selectedBlock.day}
          timeSlot={selectedBlock.timeSlot}
          subjects={subjects}
          activities={activities}
          customActivities={customActivities}
          currentAssignment={getBlockAssignment(selectedBlock.day, selectedBlock.timeSlot) || null}
          onSave={handleSaveAssignment}
        />
      )}
    </div>
  )
}
