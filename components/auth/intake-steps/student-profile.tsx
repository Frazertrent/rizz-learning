"use client"

import { useState, useEffect } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { PlusCircle, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Student {
  name: string;
  age: string;
  gradeLevel: string;
  learningCharacteristics: string[];
  iepDetails: string;
  otherCharacteristic: string;
}

interface StudentProfileProps {
  formData: {
    students: Student[];
    activeStudentIndex?: number;
  };
  updateFormData: (data: any) => void;
  editMode?: boolean;
}

export function StudentProfile({ formData, updateFormData, editMode }: StudentProfileProps) {
  // Add detailed debugging logs
  console.log('📋 StudentProfile detailed debug:');
  console.log('  - formData.students:', formData.students);
  console.log('  - activeStudentIndex:', formData.activeStudentIndex);

  const [students, setStudents] = useState<Student[]>(formData.students || [])
  const [activeIndex, setActiveIndex] = useState(formData.activeStudentIndex || 0)
  const [isInitialRender, setIsInitialRender] = useState(true)

  console.log('  - local students state:', students);
  console.log('  - students length:', students.length);
  console.log('  - first student data:', students[0]);

  // Add effect to sync with incoming formData changes
  useEffect(() => {
    if (formData.students?.length > 0) {
      console.log('Updating local state from formData:', formData.students);
      setStudents(formData.students);
      if (typeof formData.activeStudentIndex === 'number') {
        setActiveIndex(formData.activeStudentIndex);
      }
    }
  }, [formData.students, formData.activeStudentIndex]);

  // Initialize with at least one student if none exist
  useEffect(() => {
    if (students.length === 0) {
      console.log('Initializing with empty student');
      setStudents([
        {
          name: "",
          age: "",
          gradeLevel: "",
          learningCharacteristics: [],
          iepDetails: "",
          otherCharacteristic: "",
        },
      ])
    }
  }, [students.length])

  // Effect for updating parent component
  useEffect(() => {
    console.log('StudentProfile useEffect - students changed:', students);
    // Skip the first render to avoid the infinite loop
    if (isInitialRender) {
      setIsInitialRender(false)
      return
    }

    console.log('Updating parent formData with:', {
      students,
      activeStudentIndex: activeIndex,
    });

    updateFormData({
      students,
      activeStudentIndex: activeIndex,
    })
  }, [students, activeIndex, updateFormData, isInitialRender])

  const handleAddStudent = () => {
    if (students.length < 6) {
      const newStudents = [
        ...students,
        {
          name: "",
          age: "",
          gradeLevel: "",
          learningCharacteristics: [],
          iepDetails: "",
          otherCharacteristic: "",
        },
      ]
      setStudents(newStudents)
      setActiveIndex(newStudents.length - 1)
    }
  }

  const handleRemoveStudent = (index: number) => {
    if (students.length > 1) {
      const newStudents = students.filter((_, i) => i !== index)
      setStudents(newStudents)

      // Adjust active index if needed
      if (activeIndex >= newStudents.length) {
        setActiveIndex(newStudents.length - 1)
      } else if (activeIndex === index) {
        setActiveIndex(Math.max(0, index - 1))
      }
    }
  }

  const handleFieldChange = (field: keyof Student, value: string) => {
    const updatedStudents = [...students]
    updatedStudents[activeIndex] = {
      ...updatedStudents[activeIndex],
      [field]: value,
    }
    setStudents(updatedStudents)
  }

  const handleCharacteristicChange = (characteristic: string) => {
    const currentCharacteristics = students[activeIndex].learningCharacteristics || []
    let updatedCharacteristics

    if (currentCharacteristics.includes(characteristic)) {
      updatedCharacteristics = currentCharacteristics.filter((c) => c !== characteristic)
    } else {
      updatedCharacteristics = [...currentCharacteristics, characteristic]
    }

    const updatedStudents = [...students]
    updatedStudents[activeIndex] = {
      ...updatedStudents[activeIndex],
      learningCharacteristics: updatedCharacteristics,
    }
    setStudents(updatedStudents)
  }

  // Check if at least one student has name, age, and grade level filled out
  const isAtLeastOneStudentComplete = students.some((student) => student.name && student.age && student.gradeLevel)

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl text-white">Student Profile</CardTitle>
        <CardDescription className="text-gray-400">
          Add each of your children who will be learning with this system.
        </CardDescription>

        {/* Student Tabs */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <AnimatePresence>
            {students.map((student, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant={activeIndex === index ? "default" : "outline"}
                  className={`rounded-full px-4 py-1 h-auto flex items-center gap-2 ${
                    activeIndex === index
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  {student.name || `Student ${index + 1}`}
                  {students.length > 1 && (
                    <X
                      size={14}
                      className="ml-1 cursor-pointer hover:text-red-400"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveStudent(index)
                      }}
                    />
                  )}
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>

          {students.length < 6 && (
            <Button
              variant="ghost"
              className="rounded-full px-3 text-blue-400 hover:text-blue-300 hover:bg-gray-800"
              onClick={handleAddStudent}
            >
              <PlusCircle size={16} className="mr-1" />
              Add Student
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-2 mb-6">
              <Label htmlFor="student-name" className="text-white">
                Student Name:
              </Label>
              <Input
                id="student-name"
                type="text"
                value={students[activeIndex]?.name || ""}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter student's name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="age" className="text-white">
                  Age:
                </Label>
                <Input
                  id="age"
                  type="text"
                  value={students[activeIndex]?.age || ""}
                  onChange={(e) => handleFieldChange("age", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="e.g., 10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade-level" className="text-white">
                  Grade Level:
                </Label>
                <Select
                  value={students[activeIndex]?.gradeLevel || ""}
                  onValueChange={(value) => handleFieldChange("gradeLevel", value)}
                >
                  <SelectTrigger id="grade-level" className="bg-gray-800 border-gray-700 text-white">
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
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <Label className="text-white text-lg">Learning Characteristics:</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: "visual", label: "Visual learner" },
                  { id: "auditory", label: "Auditory learner" },
                  { id: "kinesthetic", label: "Kinesthetic learner" },
                  { id: "strong-reader", label: "Strong reader" },
                  { id: "social", label: "Needs social interaction" },
                  { id: "attention", label: "Short attention span" },
                  { id: "iep", label: "Learning challenges or IEP" },
                  { id: "other", label: "Other" },
                ].map((characteristic) => (
                  <div key={characteristic.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${characteristic.id}-${activeIndex}`}
                      checked={students[activeIndex]?.learningCharacteristics?.includes(characteristic.id) || false}
                      onCheckedChange={() => handleCharacteristicChange(characteristic.id)}
                      className="border-gray-600 data-[state=checked]:bg-blue-600"
                    />
                    <Label htmlFor={`${characteristic.id}-${activeIndex}`} className="text-gray-300">
                      {characteristic.label}
                    </Label>
                  </div>
                ))}
              </div>

              {students[activeIndex]?.learningCharacteristics?.includes("iep") && (
                <div className="mt-2">
                  <Label htmlFor="iep-details" className="text-gray-300">
                    Please describe learning challenges or IEP details:
                  </Label>
                  <Textarea
                    id="iep-details"
                    value={students[activeIndex]?.iepDetails || ""}
                    onChange={(e) => handleFieldChange("iepDetails", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white mt-1"
                    placeholder="Describe any learning challenges or IEP details"
                    rows={3}
                  />
                </div>
              )}

              {students[activeIndex]?.learningCharacteristics?.includes("other") && (
                <div className="mt-2">
                  <Label htmlFor="other-characteristic" className="text-gray-300">
                    Please specify other characteristics:
                  </Label>
                  <Input
                    id="other-characteristic"
                    value={students[activeIndex]?.otherCharacteristic || ""}
                    onChange={(e) => handleFieldChange("otherCharacteristic", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white mt-1"
                    placeholder="Describe other learning characteristics"
                  />
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </>
  )
}
