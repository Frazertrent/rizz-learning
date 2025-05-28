"use client"

import { useState, useEffect } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2 } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

interface Course {
  subject: string
  gradeLevel: string
  hasPlatform: boolean
  platform: string
  notes: string
}

interface CoursesProps {
  formData: {
    courses?: Course[]
  }
  updateFormData: (data: { courses: Course[] }) => void
}

export function Courses({ formData, updateFormData }: CoursesProps) {
  const [courses, setCourses] = useState<Course[]>(
    formData.courses || [{ subject: "", gradeLevel: "", hasPlatform: false, platform: "", notes: "" }]
  )
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch available subjects from Supabase
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const { data: subjectsData, error } = await supabase
          .from('subjects')
          .select('name')
          .order('name')

        if (error) {
          console.error('Error fetching subjects:', error)
      return
    }

        setAvailableSubjects(subjectsData.map(s => s.name))
      } catch (error) {
        console.error('Error in fetchSubjects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubjects()
  }, [])

  const handleCourseChange = (index: number, field: keyof Course, value: string | boolean) => {
    const updatedCourses = [...courses]
    updatedCourses[index] = { ...updatedCourses[index], [field]: value }
    setCourses(updatedCourses)
    updateFormData({ courses: updatedCourses })
  }

  const addCourse = () => {
    const newCourse: Course = { subject: "", gradeLevel: "", hasPlatform: false, platform: "", notes: "" }
    setCourses([...courses, newCourse])
    updateFormData({ courses: [...courses, newCourse] })
  }

  const removeCourse = (index: number) => {
    const updatedCourses = courses.filter((_, i: number) => i !== index)
      setCourses(updatedCourses)
    updateFormData({ courses: updatedCourses })
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl text-white">Courses</CardTitle>
        <CardDescription className="text-gray-400">Add the subjects and courses you want to include</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course: Course, index: number) => (
          <div key={index} className="p-4 border border-gray-800 rounded-lg space-y-4 bg-gray-850">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-medium">Subject {index + 1}</h3>
              {courses.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCourse(index)}
                  className="h-8 px-2 text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`subject-${index}`} className="text-gray-300">
                  Subject Name:
                </Label>
                    <Select
                  value={course.subject}
                      onValueChange={(value) => handleCourseChange(index, "subject", value)}
                    >
                      <SelectTrigger id={`subject-${index}`} className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        {availableSubjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`grade-${index}`} className="text-gray-300">
                  Grade Level:
                </Label>
                <Select
                  value={course.gradeLevel}
                  onValueChange={(value) => handleCourseChange(index, "gradeLevel", value)}
                >
                  <SelectTrigger id={`grade-${index}`} className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select grade level" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="k">Kindergarten</SelectItem>
                    <SelectItem value="1">1st Grade</SelectItem>
                    <SelectItem value="2">2nd Grade</SelectItem>
                    <SelectItem value="3">3rd Grade</SelectItem>
                    <SelectItem value="4">4th Grade</SelectItem>
                    <SelectItem value="5">5th Grade</SelectItem>
                    <SelectItem value="6">6th Grade</SelectItem>
                    <SelectItem value="7">7th Grade</SelectItem>
                    <SelectItem value="8">8th Grade</SelectItem>
                    <SelectItem value="9">9th Grade</SelectItem>
                    <SelectItem value="10">10th Grade</SelectItem>
                    <SelectItem value="11">11th Grade</SelectItem>
                    <SelectItem value="12">12th Grade</SelectItem>
                    <SelectItem value="college">College Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Do you already have a platform for this subject?</Label>
              <RadioGroup
                value={course.hasPlatform ? "yes" : "no"}
                onValueChange={(value) => handleCourseChange(index, "hasPlatform", value === "yes")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id={`platform-yes-${index}`} className="border-gray-600 text-blue-600" />
                  <Label htmlFor={`platform-yes-${index}`} className="text-gray-300">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id={`platform-no-${index}`} className="border-gray-600 text-blue-600" />
                  <Label htmlFor={`platform-no-${index}`} className="text-gray-300">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {course.hasPlatform && (
              <div className="space-y-2">
                <Label htmlFor={`platform-${index}`} className="text-gray-300">
                  Select Platform:
                </Label>
                <Select value={course.platform} onValueChange={(value) => handleCourseChange(index, "platform", value)}>
                  <SelectTrigger id={`platform-${index}`} className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="kings-peak">Kings Peak</SelectItem>
                    <SelectItem value="seats">SEATS</SelectItem>
                    <SelectItem value="ignite">Ignite</SelectItem>
                    <SelectItem value="study-island">Study Island</SelectItem>
                    <SelectItem value="exact-path">Exact Path</SelectItem>
                    <SelectItem value="mystery-science">Mystery Science</SelectItem>
                    <SelectItem value="khan-academy">Khan Academy</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {!course.hasPlatform && (
              <div className="p-3 bg-gray-800 rounded border border-gray-700 text-gray-400 text-sm">
                We'll recommend a platform that fits your goals and teaching style.
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor={`notes-${index}`} className="text-gray-300">
                Notes (optional):
              </Label>
              <Textarea
                id={`notes-${index}`}
                value={course.notes}
                onChange={(e) => handleCourseChange(index, "notes", e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Any additional notes about this subject"
                rows={2}
              />
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          onClick={addCourse}
          className="w-full mt-2 border-dashed border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <PlusCircle size={16} className="mr-2" />
          Add Another Subject
        </Button>
          </div>
        )}
      </CardContent>
    </>
  )
}
