"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusCircleIcon, ChevronDownIcon, ChevronUpIcon, Copy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { StudentTermPlanData } from "../term-plan-builder"

interface SubjectsStepProps {
  studentData: StudentTermPlanData
  updateStudentData: (data: Partial<StudentTermPlanData>) => void
  students: { id: string; firstName: string; fullName: string }[]
  activeStudentId: string
  copyScheduleFromStudent: (sourceStudentId: string, targetStudentId: string) => void
}

export function SubjectsStep({
  studentData,
  updateStudentData,
  students,
  activeStudentId,
  copyScheduleFromStudent,
}: SubjectsStepProps) {
  const [coreSubjects, setCoreSubjects] = useState<string[]>(studentData.subjects.core)
  const [extendedSubjects, setExtendedSubjects] = useState<string[]>(studentData.subjects.extended)
  const [courses, setCourses] = useState<{ [subject: string]: string[] }>(studentData.subjects.courses || {})
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([])
  const [newCourse, setNewCourse] = useState<{ subject: string; course: string }>({ subject: "", course: "" })
  const [copyFromStudentId, setCopyFromStudentId] = useState("")
  const [isInitialRender, setIsInitialRender] = useState(true)

  // Subject options
  const coreSubjectOptions = ["Math", "Language Arts", "Science", "Social Studies / History"]
  const extendedSubjectOptions = ["PE", "Arts & Music", "Technology", "World Languages", "Electives"]

  // Common courses for each subject
  const commonCourses: { [key: string]: string[] } = {
    Math: ["Algebra", "Geometry", "Pre-Calculus", "Calculus", "Statistics", "Basic Math"],
    "Language Arts": ["Reading", "Writing", "Grammar", "Literature", "Vocabulary", "Spelling"],
    Science: ["Biology", "Chemistry", "Physics", "Earth Science", "Astronomy", "Environmental Science"],
    "Social Studies / History": ["U.S. History", "World History", "Geography", "Civics", "Economics", "Current Events"],
    PE: ["Physical Education", "Sports", "Fitness", "Health", "Nutrition"],
    "Arts & Music": ["Visual Arts", "Music", "Drama", "Dance", "Photography"],
    Technology: ["Computer Science", "Coding", "Digital Literacy", "Robotics", "Web Design"],
    "World Languages": ["Spanish", "French", "German", "Chinese", "Latin", "American Sign Language"],
    Electives: ["Home Economics", "Personal Finance", "Psychology", "Philosophy", "Public Speaking"],
  }

  // Reset the state when studentData changes (switching between students)
  useEffect(() => {
    setCoreSubjects(studentData.subjects.core)
    setExtendedSubjects(studentData.subjects.extended)
    setCourses(studentData.subjects.courses || {})
    setIsInitialRender(true)
    // Don't reset expanded subjects as that's UI state, not data
  }, [studentData.studentId]) // Only reset when the student ID changes

  // Update parent component when subjects change - but only if they're different
  useEffect(() => {
    // Skip the update on initial render to prevent infinite loops
    if (isInitialRender) {
      setIsInitialRender(false)
      return
    }

    // Only update if the subjects have actually changed
    if (
      JSON.stringify(studentData.subjects.core) !== JSON.stringify(coreSubjects) ||
      JSON.stringify(studentData.subjects.extended) !== JSON.stringify(extendedSubjects) ||
      JSON.stringify(studentData.subjects.courses) !== JSON.stringify(courses)
    ) {
      updateStudentData({
        subjects: {
          core: coreSubjects,
          extended: extendedSubjects,
          courses,
        },
      })
    }
  }, [coreSubjects, extendedSubjects, courses, updateStudentData, studentData.subjects, isInitialRender])

  const handleCoreSubjectToggle = (subject: string) => {
    setCoreSubjects((prev) => (prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]))

    // If removing a subject, also remove its courses
    if (coreSubjects.includes(subject)) {
      setCourses((prev) => {
        const updated = { ...prev }
        delete updated[subject]
        return updated
      })
    }
  }

  const handleExtendedSubjectToggle = (subject: string) => {
    setExtendedSubjects((prev) => (prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]))

    // If removing a subject, also remove its courses
    if (extendedSubjects.includes(subject)) {
      setCourses((prev) => {
        const updated = { ...prev }
        delete updated[subject]
        return updated
      })
    }
  }

  const toggleSubjectExpansion = (subject: string) => {
    setExpandedSubjects((prev) => (prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]))
  }

  const handleCourseToggle = (subject: string, course: string) => {
    setCourses((prev) => {
      const subjectCourses = prev[subject] || []
      const updatedCourses = subjectCourses.includes(course)
        ? subjectCourses.filter((c) => c !== course)
        : [...subjectCourses, course]

      return {
        ...prev,
        [subject]: updatedCourses,
      }
    })
  }

  const handleAddCustomCourse = () => {
    if (newCourse.subject && newCourse.course.trim()) {
      setCourses((prev) => {
        const subjectCourses = prev[newCourse.subject] || []
        return {
          ...prev,
          [newCourse.subject]: [...subjectCourses, newCourse.course.trim()],
        }
      })
      setNewCourse({ ...newCourse, course: "" })
    }
  }

  const isSubjectSelected = (subject: string): boolean => {
    return coreSubjects.includes(subject) || extendedSubjects.includes(subject)
  }

  // Handle applying subjects from another student
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
        Select the subjects you want to include in {studentData.firstName}'s term plan. For each subject, you can
        specify the courses or units they'll be covering.
      </p>

      {/* Copy from another student */}
      {students.length > 1 && (
        <Card className="p-4 bg-blue-900/20 border-blue-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex-grow">
              <Label htmlFor="copy-from-student" className="text-blue-200 mb-1 block">
                Copy subjects from another student
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
              Apply Subjects
            </Button>
          </div>
        </Card>
      )}

      <Card className="p-6 bg-gray-700 border-gray-600">
        <h3 className="text-lg font-medium mb-4 text-white">Core Subjects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {coreSubjectOptions.map((subject) => (
            <div key={subject} className="space-y-2">
              <div
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                  coreSubjects.includes(subject)
                    ? "bg-red-900/50 border-red-700 text-red-100"
                    : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
                }`}
                onClick={() => handleCoreSubjectToggle(subject)}
              >
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`subject-${subject}`}
                    checked={coreSubjects.includes(subject)}
                    onCheckedChange={() => handleCoreSubjectToggle(subject)}
                  />
                  <Label htmlFor={`subject-${subject}`} className="cursor-pointer">
                    {subject}
                  </Label>
                </div>

                {coreSubjects.includes(subject) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSubjectExpansion(subject)
                    }}
                    className="text-red-200 hover:text-red-100 hover:bg-red-800/50"
                  >
                    {expandedSubjects.includes(subject) ? (
                      <ChevronUpIcon className="w-4 h-4" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>

              {coreSubjects.includes(subject) && expandedSubjects.includes(subject) && (
                <div className="pl-6 pr-3 py-3 border border-red-700 rounded-lg bg-red-900/30">
                  <h4 className="text-sm font-medium mb-2 text-red-100">Select courses/units:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {commonCourses[subject]?.map((course) => (
                      <div key={`${subject}-${course}`} className="flex items-center space-x-2">
                        <Checkbox
                          id={`course-${subject}-${course}`}
                          checked={(courses[subject] || []).includes(course)}
                          onCheckedChange={() => handleCourseToggle(subject, course)}
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
                        value={newCourse.subject === subject ? newCourse.course : ""}
                        onChange={(e) => setNewCourse({ subject, course: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddCustomCourse()
                          }
                        }}
                        className="text-sm bg-gray-800 border-gray-600 text-gray-200"
                      />
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddCustomCourse()}
                      disabled={!newCourse.course.trim() || newCourse.subject !== subject}
                      className="flex items-center gap-1 bg-red-700 hover:bg-red-800 text-white"
                    >
                      <PlusCircleIcon className="w-3 h-3" />
                      Add
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <h3 className="text-lg font-medium mb-4 text-white">Extended Subjects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {extendedSubjectOptions.map((subject) => (
            <div key={subject} className="space-y-2">
              <div
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                  extendedSubjects.includes(subject)
                    ? "bg-red-900/50 border-red-700 text-red-100"
                    : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
                }`}
                onClick={() => handleExtendedSubjectToggle(subject)}
              >
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`subject-${subject}`}
                    checked={extendedSubjects.includes(subject)}
                    onCheckedChange={() => handleExtendedSubjectToggle(subject)}
                  />
                  <Label htmlFor={`subject-${subject}`} className="cursor-pointer">
                    {subject}
                  </Label>
                </div>

                {extendedSubjects.includes(subject) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSubjectExpansion(subject)
                    }}
                    className="text-red-200 hover:text-red-100 hover:bg-red-800/50"
                  >
                    {expandedSubjects.includes(subject) ? (
                      <ChevronUpIcon className="w-4 h-4" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>

              {extendedSubjects.includes(subject) && expandedSubjects.includes(subject) && (
                <div className="pl-6 pr-3 py-3 border border-red-700 rounded-lg bg-red-900/30">
                  <h4 className="text-sm font-medium mb-2 text-red-100">Select courses/units:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {commonCourses[subject]?.map((course) => (
                      <div key={`${subject}-${course}`} className="flex items-center space-x-2">
                        <Checkbox
                          id={`course-${subject}-${course}`}
                          checked={(courses[subject] || []).includes(course)}
                          onCheckedChange={() => handleCourseToggle(subject, course)}
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
                        value={newCourse.subject === subject ? newCourse.course : ""}
                        onChange={(e) => setNewCourse({ subject, course: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddCustomCourse()
                          }
                        }}
                        className="text-sm bg-gray-800 border-gray-600 text-gray-200"
                      />
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddCustomCourse()}
                      disabled={!newCourse.course.trim() || newCourse.subject !== subject}
                      className="flex items-center gap-1 bg-red-700 hover:bg-red-800 text-white"
                    >
                      <PlusCircleIcon className="w-3 h-3" />
                      Add
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Selected Courses Summary */}
        {Object.keys(courses).length > 0 && (
          <div className="p-4 border border-red-700 rounded-lg bg-red-900/30 mb-4">
            <h4 className="font-medium mb-2 text-white">Selected Courses for {studentData.firstName}</h4>
            <div className="space-y-2">
              {Object.entries(courses).map(
                ([subject, subjectCourses]) =>
                  subjectCourses.length > 0 && (
                    <div key={subject} className="space-y-1">
                      <div className="font-medium text-sm text-red-100">{subject}</div>
                      <div className="flex flex-wrap gap-1">
                        {subjectCourses.map((course) => (
                          <Badge
                            key={`${subject}-${course}`}
                            variant="secondary"
                            className="bg-gray-800 text-gray-200 border border-gray-600"
                          >
                            {course}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ),
              )}
            </div>
          </div>
        )}

        {!coreSubjects.length && !extendedSubjects.length && (
          <div className="p-4 border border-yellow-700 rounded-lg bg-yellow-900/30 text-yellow-100">
            Please select at least one subject for {studentData.firstName}'s term plan.
          </div>
        )}
      </Card>

      <div className="bg-red-900/30 p-4 rounded-lg border border-red-700">
        <p className="text-red-200">
          <span className="font-medium">Tip:</span> Most homeschool families focus on 4-6 subjects per term. It's often
          better to go deep on fewer subjects than to spread yourself too thin across many subjects.
        </p>
      </div>
    </div>
  )
}
