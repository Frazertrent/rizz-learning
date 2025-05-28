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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Target, Save, X, PlusCircle, BookOpen, CheckCircle, Clock, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@supabase/supabase-js"
import { PlusCircleIcon } from "lucide-react"

// Common predefined options
const ACADEMIC_TERMS = ["Summer", "Fall", "Winter", "Spring"]

const COMMON_GOALS = [
  "Complete core curriculum requirements",
  "Improve reading comprehension",
  "Develop consistent writing habits",
  "Master basic math concepts",
  "Complete science fair project",
  "Learn a new language",
  "Develop research skills",
  "Improve test-taking strategies",
  "Build presentation skills",
  "Develop critical thinking skills",
  "Earn credits for graduation",
  "Prepare for standardized tests",
  "Develop independent study habits",
  "Complete a major project",
  "Improve organizational skills",
]

const COMMON_ACTIVITIES = [
  "Morning Meeting",
  "Reading Time",
  "Writing Workshop",
  "Math Practice",
  "Science Experiment",
  "Art Project",
  "Physical Activity",
  "Music Practice",
  "Foreign Language Practice",
  "Journaling",
  "Research Project",
  "Field Trip",
  "Educational Game",
  "Coding Practice",
  "Outdoor Learning",
]

interface AcademicTermModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentTerm: string
  currentTermType: string
  currentTermYear: number
  onSave: (term: string, termType: string, termYear: number) => void
}

export function AcademicTermModal({
  open,
  onOpenChange,
  currentTerm,
  currentTermType,
  currentTermYear,
  onSave,
}: AcademicTermModalProps) {
  const [editTerm, setEditTerm] = useState(currentTermType || "")
  const [editYear, setEditYear] = useState(currentTermYear?.toString() || new Date().getFullYear().toString())
  const [customTerm, setCustomTerm] = useState(currentTermType === "Custom / Other" ? currentTerm : "")

  // Generate year options (current year and next 5 years)
  const currentYearValue = new Date().getFullYear()
  const yearOptions = Array.from({ length: 6 }, (_, i) => (currentYearValue + i).toString())

  // Reset the state when the modal opens
  useEffect(() => {
    if (open) {
      setEditTerm(currentTermType || "")
      setEditYear(currentTermYear?.toString() || new Date().getFullYear().toString())
      setCustomTerm(currentTermType === "Custom / Other" ? currentTerm : "")
    }
  }, [open, currentTerm, currentTermType, currentTermYear])

  const getFormattedTermName = () => {
    if (editTerm === "Custom / Other") {
      return customTerm || "Custom Term"
    }
    return `${editTerm} ${editYear}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 text-white border-purple-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-white">
            <Calendar className="h-5 w-5 text-purple-400" />
            Edit Academic Term
          </DialogTitle>
          <DialogDescription className="text-gray-300">Update the name of your academic term.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="academicTerm" className="text-white">
              Term
            </Label>
            <Select value={editTerm} onValueChange={setEditTerm}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select a term" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-white">
                {["Summer", "Fall", "Winter", "Spring", "Custom / Other"].map((term) => (
                  <SelectItem key={term} value={term}>
                    {term}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="termYear" className="text-white">
              Year
            </Label>
            <Select value={editYear} onValueChange={setEditYear}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-white">
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {editTerm === "Custom / Other" && (
            <div className="space-y-2">
              <Label htmlFor="custom-term" className="text-white">
                Custom Term Name
              </Label>
              <Input
                id="custom-term"
                placeholder="e.g., 2023-2024 School Year"
                value={customTerm}
                onChange={(e) => setCustomTerm(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          )}

          <div className="mt-4 p-3 bg-purple-900/20 rounded-lg border border-purple-700">
            <p className="text-purple-200">
              <span className="font-medium">Preview:</span> {getFormattedTermName()}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave(getFormattedTermName(), editTerm, Number.parseInt(editYear, 10))
              onOpenChange(false)
            }}
            className="bg-purple-600 hover:bg-purple-500 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface GoalsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentGoals: string[]
  onSave: (goals: string[]) => void
}

export function GoalsModal({ open, onOpenChange, currentGoals, onSave }: GoalsModalProps) {
  const [editGoals, setEditGoals] = useState<string[]>([...currentGoals])
  const [newGoal, setNewGoal] = useState("")
  const [showPresets, setShowPresets] = useState(true)

  // Reset the state when the modal opens
  useEffect(() => {
    if (open) {
      setEditGoals([...currentGoals])
      setNewGoal("")
    }
  }, [open, currentGoals])

  const addGoal = () => {
    if (newGoal.trim()) {
      setEditGoals([...editGoals, newGoal.trim()])
      setNewGoal("")
    }
  }

  const addPresetGoal = (goal: string) => {
    if (!editGoals.includes(goal)) {
      setEditGoals([...editGoals, goal])
    }
  }

  const removeGoal = (index: number) => {
    setEditGoals(editGoals.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 text-white border-blue-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-white">
            <Target className="h-5 w-5 text-blue-400" />
            Edit Term Goals
          </DialogTitle>
          <DialogDescription className="text-gray-300">Update your goals for this academic term.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-white">Current Goals</Label>
            <div className="space-y-2 max-h-60 overflow-y-auto p-2 border border-gray-700 rounded-md">
              {editGoals.length > 0 ? (
                editGoals.map((goal, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded-md">
                    <span className="text-gray-200">{goal}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                      onClick={() => removeGoal(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-4">No goals added yet</div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="show-presets" checked={showPresets} onCheckedChange={setShowPresets} />
            <Label htmlFor="show-presets" className="text-white">
              Show preset goals
            </Label>
          </div>

          {showPresets && (
            <div className="space-y-2">
              <Label className="text-white">Preset Goals</Label>
              <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-2 border border-gray-700 rounded-md">
                {COMMON_GOALS.map((goal) => (
                  <Badge
                    key={goal}
                    className={`
                      cursor-pointer
                      ${
                        editGoals.includes(goal)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }
                    `}
                    onClick={() => addPresetGoal(goal)}
                  >
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="newGoal" className="text-white">
              Add Custom Goal
            </Label>
            <div className="flex gap-2">
              <Input
                id="newGoal"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white flex-1"
                placeholder="e.g., Complete Algebra 1 curriculum"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addGoal()
                  }
                }}
              />
              <Button onClick={addGoal} className="bg-blue-600 hover:bg-blue-500 text-white">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave(editGoals)
              onOpenChange(false)
            }}
            className="bg-blue-600 hover:bg-blue-500 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface ScheduleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  studentId: string
  studentName: string
  schedule: any
  onSave: (studentId: string, schedule: any) => void
}

export function ScheduleModal({ open, onOpenChange, studentId, studentName, schedule, onSave }: ScheduleModalProps) {
  const [editSchedule, setEditSchedule] = useState<any>(schedule ? JSON.parse(JSON.stringify(schedule)) : {})
  const [activeDay, setActiveDay] = useState<string>("monday")
  const [useSameSchedule, setUseSameSchedule] = useState(true)

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  const blockLengthOptions = [30, 45, 60]

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

  // Reset the state when the modal opens
  useEffect(() => {
    if (open && schedule) {
      const newSchedule = JSON.parse(JSON.stringify(schedule))

      // Initialize blockLength if it doesn't exist
      Object.keys(newSchedule.days).forEach((day) => {
        if (!newSchedule.days[day].blockLength) {
          newSchedule.days[day].blockLength = 45 // Default block length
        }
      })

      setEditSchedule(newSchedule)

      // Find the first selected day to set as active
      const firstSelectedDay = Object.entries(schedule.days).find(([_, dayData]: [string, any]) => dayData.selected)

      if (firstSelectedDay) {
        setActiveDay(firstSelectedDay[0])
      } else {
        setActiveDay("monday")
      }
    }
  }, [open, schedule])

  const toggleDaySelection = (day: string) => {
    setEditSchedule((prev: any) => {
      const newSchedule = { ...prev }
      newSchedule.days[day].selected = !newSchedule.days[day].selected
      return newSchedule
    })
  }

  const updateDayBlocks = (day: string, blocks: number) => {
    setEditSchedule((prev: any) => {
      const newSchedule = { ...prev }
      newSchedule.days[day].blocks = blocks

      // If using same schedule, update all selected days
      if (useSameSchedule) {
        Object.keys(newSchedule.days).forEach((d) => {
          if (newSchedule.days[d].selected) {
            newSchedule.days[d].blocks = blocks
          }
        })
      }

      return newSchedule
    })
  }

  const updateStartTime = (day: string, time: string) => {
    setEditSchedule((prev: any) => {
      const newSchedule = { ...prev }
      newSchedule.days[day].startTime = time

      // Recalculate blocks
      newSchedule.days[day].blocks = calculateBlocks(
        time,
        newSchedule.days[day].endTime,
        newSchedule.days[day].blockLength || 45,
      )

      // If using same schedule, update all selected days
      if (useSameSchedule) {
        Object.keys(newSchedule.days).forEach((d) => {
          if (d !== day && newSchedule.days[d].selected) {
            newSchedule.days[d].startTime = time
            newSchedule.days[d].blocks = calculateBlocks(
              time,
              newSchedule.days[day].endTime,
              newSchedule.days[d].blockLength || 45,
            )
          }
        })
      }

      return newSchedule
    })
  }

  const updateEndTime = (day: string, time: string) => {
    setEditSchedule((prev: any) => {
      const newSchedule = { ...prev }
      newSchedule.days[day].endTime = time

      // Recalculate blocks
      newSchedule.days[day].blocks = calculateBlocks(
        newSchedule.days[day].startTime,
        time,
        newSchedule.days[day].blockLength || 45,
      )

      // If using same schedule, update all selected days
      if (useSameSchedule) {
        Object.keys(newSchedule.days).forEach((d) => {
          if (d !== day && newSchedule.days[d].selected) {
            newSchedule.days[d].endTime = time
            newSchedule.days[d].blocks = calculateBlocks(
              newSchedule.days[day].startTime,
              time,
              newSchedule.days[d].blockLength || 45,
            )
          }
        })
      }

      return newSchedule
    })
  }

  const updateBlockLength = (day: string, length: number) => {
    setEditSchedule((prev: any) => {
      const newSchedule = { ...prev }
      newSchedule.days[day].blockLength = length

      // Recalculate blocks
      newSchedule.days[day].blocks = calculateBlocks(
        newSchedule.days[day].startTime,
        newSchedule.days[day].endTime,
        length,
      )

      // If using same schedule, update all selected days
      if (useSameSchedule) {
        Object.keys(newSchedule.days).forEach((d) => {
          if (d !== day && newSchedule.days[d].selected) {
            newSchedule.days[d].blockLength = length
            newSchedule.days[d].blocks = calculateBlocks(
              newSchedule.days[d].startTime,
              newSchedule.days[d].endTime,
              length,
            )
          }
        })
      }

      return newSchedule
    })
  }

  const formatDayName = (day: string): string => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 text-white border-green-700 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-white">
            <Calendar className="h-5 w-5 text-green-400" />
            Edit {studentName}'s Weekly Schedule
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Select days and set learning blocks for each day.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Day Selection */}
          <div className="space-y-2">
            <Label className="text-white">Select Days</Label>
            <div className="flex flex-wrap gap-2">
              {days.map((day) => (
                <Button
                  key={day}
                  variant={editSchedule.days[day]?.selected ? "default" : "outline"}
                  className={`
                    ${
                      editSchedule.days[day]?.selected
                        ? "bg-green-600 hover:bg-green-500 text-white"
                        : "border-gray-600 text-gray-300 hover:bg-gray-700"
                    }
                  `}
                  onClick={() => toggleDaySelection(day)}
                >
                  {formatDayName(day)}
                </Button>
              ))}
            </div>
          </div>

          {/* Same Schedule Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="same-schedule"
              checked={!useSameSchedule}
              onCheckedChange={(checked) => setUseSameSchedule(!checked)}
            />
            <Label htmlFor="same-schedule" className="text-white">
              Use different schedules for individual days
            </Label>
          </div>

          {/* Day Tabs */}
          <Tabs value={activeDay} onValueChange={setActiveDay} className="w-full">
            <TabsList className="bg-gray-700 p-1 h-auto flex flex-wrap gap-2">
              {days.map(
                (day) =>
                  editSchedule.days[day]?.selected && (
                    <TabsTrigger
                      key={day}
                      value={day}
                      className={`
                      rounded-full px-4 py-2 text-sm font-medium transition-all
                      data-[state=active]:bg-green-600 data-[state=active]:text-white
                      data-[state=active]:shadow-lg data-[state=active]:shadow-green-900/20
                      data-[state=inactive]:bg-gray-800 data-[state=inactive]:text-gray-300
                      data-[state=inactive]:hover:bg-gray-700
                    `}
                    >
                      {formatDayName(day)}
                    </TabsTrigger>
                  ),
              )}
            </TabsList>

            {days.map((day) => (
              <TabsContent key={day} value={day} className="space-y-4 mt-4">
                {editSchedule.days[day]?.selected && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`${day}-start-time`} className="text-white">
                          Start Time
                        </Label>
                        <Input
                          id={`${day}-start-time`}
                          type="time"
                          value={editSchedule.days[day]?.startTime || "08:00"}
                          onChange={(e) => updateStartTime(day, e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${day}-end-time`} className="text-white">
                          End Time
                        </Label>
                        <Input
                          id={`${day}-end-time`}
                          type="time"
                          value={editSchedule.days[day]?.endTime || "15:00"}
                          onChange={(e) => updateEndTime(day, e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${day}-block-length`} className="text-white">
                          Block Length (minutes)
                        </Label>
                        <Select
                          value={(editSchedule.days[day]?.blockLength || 45).toString()}
                          onValueChange={(value) => updateBlockLength(day, Number.parseInt(value))}
                        >
                          <SelectTrigger id={`${day}-block-length`} className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Select block length" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600 text-gray-200">
                            {blockLengthOptions.map((length) => (
                              <SelectItem key={length} value={length.toString()}>
                                {length} minutes
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="p-4 bg-green-900/30 rounded-lg text-green-100 border border-green-700">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-green-400" />
                        <div>
                          <span className="font-medium">Learning Blocks:</span>{" "}
                          <span className="text-xl font-bold">{editSchedule.days[day]?.blocks || 0}</span> blocks (
                          {editSchedule.days[day]?.blockLength || 45} min each)
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-green-200">
                        Blocks are automatically calculated based on your start time, end time, and block length.
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>

          <div className="p-4 border border-green-700 rounded-lg bg-green-900/20 text-green-100">
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              You can assign subjects and activities to each block in the Weekly Schedule tab after saving.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave(studentId, editSchedule)
              onOpenChange(false)
            }}
            className="bg-green-600 hover:bg-green-500 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface SubjectsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  studentId: string
  studentName: string
  subjects: any
  onSave: (studentId: string, subjects: any) => void
}

export function SubjectsModal({ open, onOpenChange, studentId, studentName, subjects, onSave }: SubjectsModalProps) {
  const [editSubjects, setEditSubjects] = useState<any>(
    subjects ? JSON.parse(JSON.stringify(subjects)) : { core: [], extended: [], courses: {} },
  )
  const [activeTab, setActiveTab] = useState<string>("core")
  const [newCourse, setNewCourse] = useState("")
  const [availableSubjects, setAvailableSubjects] = useState<{ core: string[], extended: string[] }>({ core: [], extended: [] })
  const [availableCourses, setAvailableCourses] = useState<{ [subject: string]: string[] }>({})
  const [loading, setLoading] = useState(true)

  // Fetch available subjects and courses from Supabase
  useEffect(() => {
    const fetchSubjectsAndCourses = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        // Fetch subjects
        const { data: subjectsData, error: subjectsError } = await supabase
          .from('subjects')
          .select('*')
          .order('name')

        if (subjectsError) {
          console.error('Error fetching subjects:', subjectsError)
          return
        }

        // Separate core and extended subjects
        const core = subjectsData?.filter(s => s.type === 'core').map(s => s.name) || []
        const extended = subjectsData?.filter(s => s.type === 'extended').map(s => s.name) || []
        setAvailableSubjects({ core, extended })

        // Fetch courses for each subject
        const coursesMap: { [subject: string]: string[] } = {}
        for (const subject of subjectsData || []) {
          const { data: coursesData, error: coursesError } = await supabase
            .from('courses')
            .select('name')
            .eq('subject_id', subject.id)
            .order('name')

          if (coursesError) {
            console.error(`Error fetching courses for subject ${subject.name}:`, coursesError)
            continue
          }

          coursesMap[subject.name] = coursesData?.map(c => c.name) || []
        }
        setAvailableCourses(coursesMap)
      } catch (error) {
        console.error('Error in fetchSubjectsAndCourses:', error)
      } finally {
        setLoading(false)
      }
    }

    if (open) {
      fetchSubjectsAndCourses()
    }
  }, [open])

  // Reset the state when the modal opens
  useEffect(() => {
    if (open && subjects) {
      setEditSubjects(JSON.parse(JSON.stringify(subjects)))
      setActiveTab("core")
    }
  }, [open, subjects])

  const toggleSubject = (category: "core" | "extended", subject: string) => {
    setEditSubjects((prev: any) => {
      const newSubjects = { ...prev }

      if (newSubjects[category].includes(subject)) {
        // Remove subject
        newSubjects[category] = newSubjects[category].filter((s: string) => s !== subject)

        // Remove courses for this subject
        if (newSubjects.courses[subject]) {
          delete newSubjects.courses[subject]
        }
      } else {
        // Add subject
        newSubjects[category] = [...newSubjects[category], subject]

        // Initialize empty courses array
        if (!newSubjects.courses[subject]) {
          newSubjects.courses[subject] = []
        }
      }

      return newSubjects
    })
  }

  const toggleCourse = (subject: string, course: string) => {
    setEditSubjects((prev: any) => {
      const newSubjects = { ...prev }

      if (!newSubjects.courses[subject]) {
        newSubjects.courses[subject] = []
      }

      if (newSubjects.courses[subject].includes(course)) {
        // Remove course
        newSubjects.courses[subject] = newSubjects.courses[subject].filter((c: string) => c !== course)
      } else {
        // Add course
        newSubjects.courses[subject] = [...newSubjects.courses[subject], course]
      }

      return newSubjects
    })
  }

  const addCustomCourse = (subject: string) => {
    if (newCourse.trim()) {
      setEditSubjects((prev: any) => {
        const newSubjects = { ...prev }

        if (!newSubjects.courses[subject]) {
          newSubjects.courses[subject] = []
        }

        if (!newSubjects.courses[subject].includes(newCourse.trim())) {
          newSubjects.courses[subject] = [...newSubjects.courses[subject], newCourse.trim()]
        }

        return newSubjects
      })

      setNewCourse("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-red-400" />
            {studentName}'s Subjects
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Select the subjects and courses for {studentName}'s term plan.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
        <div className="space-y-6 py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-gray-700 w-full">
              <TabsTrigger value="core" className="flex-1 data-[state=active]:bg-red-700">
                Core Subjects
              </TabsTrigger>
              <TabsTrigger value="extended" className="flex-1 data-[state=active]:bg-red-700">
                Extended Subjects
              </TabsTrigger>
              <TabsTrigger value="courses" className="flex-1 data-[state=active]:bg-red-700">
                Courses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="core" className="space-y-4 mt-4">
              <div className="space-y-2">
                  <Label className="text-white">Available Core Subjects</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {availableSubjects.core.map((subject) => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox
                        id={`core-${subject}`}
                        checked={editSubjects.core.includes(subject)}
                        onCheckedChange={() => toggleSubject("core", subject)}
                        className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                      />
                      <Label htmlFor={`core-${subject}`} className="text-white cursor-pointer">
                        {subject}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="extended" className="space-y-4 mt-4">
              <div className="space-y-2">
                  <Label className="text-white">Available Extended Subjects</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {availableSubjects.extended.map((subject) => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox
                        id={`extended-${subject}`}
                        checked={editSubjects.extended.includes(subject)}
                        onCheckedChange={() => toggleSubject("extended", subject)}
                        className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                      />
                      <Label htmlFor={`extended-${subject}`} className="text-white cursor-pointer">
                        {subject}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="courses" className="space-y-4 mt-4">
              <div className="space-y-4">
                {[...editSubjects.core, ...editSubjects.extended].length > 0 ? (
                  [...editSubjects.core, ...editSubjects.extended].map((subject) => (
                    <div key={subject} className="space-y-2 p-4 border border-red-700/50 rounded-lg">
                      <Label className="text-white text-lg">{subject} Courses</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                          {availableCourses[subject]?.map((course) => (
                            <div key={`${subject}-${course}`} className="flex items-center space-x-2">
                              <Checkbox
                                id={`course-${subject}-${course}`}
                                checked={(editSubjects.courses[subject] || []).includes(course)}
                                onCheckedChange={() => toggleCourse(subject, course)}
                              />
                              <Label htmlFor={`course-${subject}-${course}`} className="text-sm text-red-100">
                            {course}
                              </Label>
                            </div>
                        ))}
                      </div>

                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                        <Input
                              placeholder="Add custom course/unit"
                          value={newCourse}
                          onChange={(e) => setNewCourse(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addCustomCourse(subject)
                            }
                          }}
                              className="text-sm bg-gray-800 border-gray-600 text-gray-200"
                        />
                          </div>
                        <Button
                            size="sm"
                          onClick={() => addCustomCourse(subject)}
                            disabled={!newCourse.trim()}
                            className="flex items-center gap-1 bg-red-700 hover:bg-red-800 text-white"
                        >
                            <PlusCircleIcon className="w-3 h-3" />
                          Add
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                    <div className="text-center text-gray-400">
                      Please select subjects first to manage their courses.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-gray-700 text-white border-gray-600">
            Cancel
          </Button>
          <Button onClick={() => onSave(studentId, editSubjects)} className="bg-red-600 text-white hover:bg-red-500">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface ActivitiesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  studentId: string
  studentName: string
  activities: string[]
  customActivities: string[]
  onSave: (studentId: string, activities: string[], customActivities: string[]) => void
}

export function ActivitiesModal({
  open,
  onOpenChange,
  studentId,
  studentName,
  activities,
  customActivities,
  onSave,
}: ActivitiesModalProps) {
  const [editActivities, setEditActivities] = useState<string[]>([...activities])
  const [editCustomActivities, setEditCustomActivities] = useState<string[]>([...customActivities])
  const [newActivity, setNewActivity] = useState("")

  // Reset the state when the modal opens
  useEffect(() => {
    if (open) {
      setEditActivities([...activities])
      setEditCustomActivities([...customActivities])
      setNewActivity("")
    }
  }, [open, activities, customActivities])

  const toggleActivity = (activity: string) => {
    setEditActivities((prev) => {
      if (prev.includes(activity)) {
        return prev.filter((a) => a !== activity)
      } else {
        return [...prev, activity]
      }
    })
  }

  const addCustomActivity = () => {
    if (newActivity.trim() && !editCustomActivities.includes(newActivity.trim())) {
      setEditCustomActivities((prev) => [...prev, newActivity.trim()])
      setNewActivity("")
    }
  }

  const removeCustomActivity = (activity: string) => {
    setEditCustomActivities((prev) => prev.filter((a) => a !== activity))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 text-white border-orange-700 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-white">
            <CheckCircle className="h-5 w-5 text-orange-400" />
            Edit {studentName}'s Activities
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Select standard activities and add custom activities.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-white">Standard Activities</Label>
            <div className="flex flex-wrap gap-2 p-2 border border-gray-700 rounded-md">
              {COMMON_ACTIVITIES.map((activity) => (
                <Badge
                  key={activity}
                  className={`
                    cursor-pointer
                    ${
                      editActivities.includes(activity)
                        ? "bg-orange-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }
                  `}
                  onClick={() => toggleActivity(activity)}
                >
                  {activity}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Custom Activities</Label>
            <div className="space-y-2 max-h-60 overflow-y-auto p-2 border border-gray-700 rounded-md">
              {editCustomActivities.length > 0 ? (
                editCustomActivities.map((activity) => (
                  <div key={activity} className="flex items-center justify-between bg-gray-700 p-2 rounded-md">
                    <span className="text-gray-200">{activity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                      onClick={() => removeCustomActivity(activity)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-4">No custom activities added yet</div>
              )}
            </div>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add custom activity"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addCustomActivity()
                  }
                }}
              />
              <Button onClick={addCustomActivity} className="bg-orange-600 hover:bg-orange-500 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave(studentId, editActivities, editCustomActivities)
              onOpenChange(false)
            }}
            className="bg-orange-600 hover:bg-orange-500 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
