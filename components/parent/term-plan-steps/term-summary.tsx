"use client"

import { Badge } from "@/components/ui/badge"
import type { TermPlanData } from "../term-plan-builder"
import { Calendar } from "lucide-react"

interface TermSummaryProps {
  termPlanData: TermPlanData
  currentStep: number
  activeStudentId?: string
}

export function TermSummary({ termPlanData, currentStep, activeStudentId }: TermSummaryProps) {
  // Format day name
  const formatDayName = (day: string): string => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  // Get active student data
  const activeStudent = activeStudentId ? termPlanData.students[activeStudentId] : null

  return (
    <div className="space-y-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
      {/* Academic Term (Step 1) */}
      {termPlanData.academicTerm && (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-purple-400" />
          <span className="text-purple-200">
            Term: {termPlanData.academicTerm}
            {termPlanData.termType && termPlanData.termType !== "Custom / Other" && termPlanData.termYear && (
              <span className="text-gray-400 ml-1">
                ({termPlanData.termType} {termPlanData.termYear})
              </span>
            )}
          </span>
        </div>
      )}

      {/* Term Goals (Step 2) */}
      {termPlanData.goals.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-blue-400">Term Goals</h4>
          <div className="flex flex-wrap gap-1">
            {termPlanData.goals.map((goal, index) => (
              <Badge key={index} className="bg-blue-900/30 text-blue-100 border border-blue-700">
                {goal}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Student-specific data */}
      {activeStudent && (
        <>
          {/* Weekly Schedule (Step 3) */}
          {Object.values(activeStudent.schedule.days).some((day) => day.selected) && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-green-400">Weekly Schedule for {activeStudent.firstName}</h4>
              <div className="flex flex-wrap gap-1">
                {Object.entries(activeStudent.schedule.days)
                  .filter(([_, day]) => day.selected)
                  .map(([dayName, day]) => (
                    <Badge key={dayName} className="bg-green-900/30 text-green-100 border border-green-700">
                      {formatDayName(dayName)}: {day.startTime} - {day.endTime} ({day.blocks} blocks)
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          {/* Activities (Step 4) */}
          {(activeStudent.activities.length > 0 || activeStudent.customActivities.length > 0) && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-orange-400">Activities for {activeStudent.firstName}</h4>
              <div className="flex flex-wrap gap-1">
                {activeStudent.activities.map((activity, index) => (
                  <Badge key={index} className="bg-orange-900/30 text-orange-100 border border-orange-700">
                    {activity}
                  </Badge>
                ))}
                {activeStudent.customActivities.map((activity, index) => (
                  <Badge key={`custom-${index}`} className="bg-orange-900/50 text-orange-100 border border-orange-700">
                    {activity}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Subjects (Step 5) */}
          {(activeStudent.subjects.core.length > 0 || activeStudent.subjects.extended.length > 0) && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-red-400">Subjects for {activeStudent.firstName}</h4>
              <div className="flex flex-wrap gap-1">
                {activeStudent.subjects.core.map((subject, index) => (
                  <Badge key={`core-${index}`} className="bg-red-900/30 text-red-100 border border-red-700">
                    {subject}
                  </Badge>
                ))}
                {activeStudent.subjects.extended.map((subject, index) => (
                  <Badge key={`extended-${index}`} className="bg-red-900/50 text-red-100 border border-red-700">
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
