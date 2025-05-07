"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, User, Users, Lock, Mail, Calendar, GraduationCap, MapPin, School } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { saveProfileData } from "@/app/actions/save-profile-data"

// Define types for our form data
type StudentProfile = {
  id: string
  firstName: string
  lastName: string
  username: string
  password: string
  age: string
  grade: string
}

type ParentProfile = {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  state: string
  schoolDistrict: string
  numberOfStudents: string
}

export function ProfileSetup() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [parentProfile, setParentProfile] = useState<ParentProfile>({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    state: "",
    schoolDistrict: "",
    numberOfStudents: "1",
  })
  const [studentProfiles, setStudentProfiles] = useState<StudentProfile[]>([
    {
      id: "1",
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      age: "",
      grade: "",
    },
  ])

  // Calculate progress percentage
  const totalSteps = 2
  const progress = (step / totalSteps) * 100

  // Handle parent profile changes
  const handleParentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setParentProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle parent profile select changes
  const handleParentSelectChange = (name: string, value: string) => {
    setParentProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle student profile changes
  const handleStudentChange = (id: string, field: keyof StudentProfile, value: string) => {
    setStudentProfiles((prev) => prev.map((student) => (student.id === id ? { ...student, [field]: value } : student)))
  }

  // Update number of student profiles based on selection
  useEffect(() => {
    const numStudents = Number.parseInt(parentProfile.numberOfStudents || "1", 10)

    if (numStudents > studentProfiles.length) {
      // Add more student profiles
      const newProfiles = [...studentProfiles]
      for (let i = studentProfiles.length; i < numStudents; i++) {
        newProfiles.push({
          id: (i + 1).toString(),
          firstName: "",
          lastName: "",
          username: "",
          password: "",
          age: "",
          grade: "",
        })
      }
      setStudentProfiles(newProfiles)
    } else if (numStudents < studentProfiles.length) {
      // Remove excess student profiles
      setStudentProfiles((prev) => prev.slice(0, numStudents))
    }
  }, [parentProfile.numberOfStudents])

  // Handle next step
  const handleNext = () => {
    // Basic validation for parent profile
    if (
      !parentProfile.firstName ||
      !parentProfile.lastName ||
      !parentProfile.email ||
      !parentProfile.username ||
      !parentProfile.password ||
      !parentProfile.state ||
      !parentProfile.schoolDistrict ||
      !parentProfile.numberOfStudents
    ) {
      setError("Please fill in all parent profile fields")
      return
    }

    if (parentProfile.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setError(null)
    if (step < totalSteps) {
      setStep((prev) => prev + 1)
      window.scrollTo(0, 0)
    }
  }

  // Handle back step
  const handleBack = () => {
    setError(null)
    if (step > 1) {
      setStep((prev) => prev - 1)
      window.scrollTo(0, 0)
    }
  }

  // Validate student profiles
  const validateStudentProfiles = () => {
    for (const student of studentProfiles) {
      if (
        !student.firstName ||
        !student.lastName ||
        !student.username ||
        !student.password ||
        !student.age ||
        !student.grade
      ) {
        setError(`Please fill in all fields for Student ${student.id}`)
        return false
      }
    }
    return true
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStudentProfiles()) return

    setError(null)
    setIsSubmitting(true)

    try {
      const result = await saveProfileData(parentProfile, studentProfiles)

      if (!result.success) {
        throw new Error(result.error || "Failed to save profile data")
      }

      // Redirect to the confirmation page with the parent ID
      router.push(`/profile-confirmation?id=${result.parentId}`)
    } catch (error) {
      console.error("Error submitting profiles:", error)
      setError((error as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate grade options
  const gradeOptions = [
    "Pre-K",
    "Kindergarten",
    "1st Grade",
    "2nd Grade",
    "3rd Grade",
    "4th Grade",
    "5th Grade",
    "6th Grade",
    "7th Grade",
    "8th Grade",
    "9th Grade",
    "10th Grade",
    "11th Grade",
    "12th Grade",
  ]

  // US States for dropdown
  const states = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ]

  // School districts (this would typically be fetched based on the selected state)
  const getSchoolDistricts = (state: string) => {
    // This is a simplified example - in a real app, you'd fetch districts based on the state
    const districtsByState: Record<string, string[]> = {
      Utah: [
        "Alpine School District",
        "Canyons School District",
        "Davis School District",
        "Granite School District",
        "Jordan School District",
        "Salt Lake City School District",
        "Weber School District",
      ],
      California: [
        "Los Angeles Unified",
        "San Diego Unified",
        "Long Beach Unified",
        "Fresno Unified",
        "San Francisco Unified",
      ],
      Texas: ["Houston ISD", "Dallas ISD", "Austin ISD", "Fort Worth ISD", "San Antonio ISD"],
      // Add more states as needed
    }

    return districtsByState[state] || ["Please select a state first"]
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading your profile setup...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Set Up Your Profiles</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Let's personalize your homeschool dashboard by setting up your parent and student profiles.
          </p>
        </motion.div>

        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>
              Step {step} of {totalSteps}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-800" />
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-900/20 border-red-800 text-red-300">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Alert className="mb-6 bg-blue-900/20 border-blue-800 text-blue-300">
          <AlertTitle>New Database</AlertTitle>
          <AlertDescription>
            You're using a fresh Supabase database with the correct schema. This should work smoothly!
          </AlertDescription>
        </Alert>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <User className="mr-2 h-6 w-6 text-blue-400" />
                  Parent Profile
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Set up your parent account information. This will be used for logging in and managing your dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="parentFirstName">First Name</Label>
                    <Input
                      id="parentFirstName"
                      name="firstName"
                      value={parentProfile.firstName}
                      onChange={handleParentChange}
                      className="bg-gray-700/60 border-gray-600 text-white"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentLastName">Last Name</Label>
                    <Input
                      id="parentLastName"
                      name="lastName"
                      value={parentProfile.lastName}
                      onChange={handleParentChange}
                      className="bg-gray-700/60 border-gray-600 text-white"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentEmail">Email Address</Label>
                  <div className="relative">
                    <Input
                      id="parentEmail"
                      name="email"
                      type="email"
                      value={parentProfile.email}
                      onChange={handleParentChange}
                      className="pl-10 bg-gray-700/60 border-gray-600 text-white"
                      placeholder="Enter your email address"
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <div className="relative">
                      <Select
                        value={parentProfile.state}
                        onValueChange={(value) => handleParentSelectChange("state", value)}
                        required
                      >
                        <SelectTrigger className="pl-10 bg-gray-700/60 border-gray-600 text-white">
                          <SelectValue placeholder="Select your state" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 max-h-[300px]">
                          {states.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schoolDistrict">School District</Label>
                    <div className="relative">
                      <Select
                        value={parentProfile.schoolDistrict}
                        onValueChange={(value) => handleParentSelectChange("schoolDistrict", value)}
                        disabled={!parentProfile.state}
                        required
                      >
                        <SelectTrigger className="pl-10 bg-gray-700/60 border-gray-600 text-white">
                          <SelectValue
                            placeholder={parentProfile.state ? "Select your school district" : "Select a state first"}
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {getSchoolDistricts(parentProfile.state).map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <School className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numberOfStudents">Number of Students</Label>
                  <Select
                    value={parentProfile.numberOfStudents}
                    onValueChange={(value) => handleParentSelectChange("numberOfStudents", value)}
                    required
                  >
                    <SelectTrigger className="bg-gray-700/60 border-gray-600 text-white">
                      <SelectValue placeholder="Select number of students" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "Student" : "Students"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentUsername">Username</Label>
                  <div className="relative">
                    <Input
                      id="parentUsername"
                      name="username"
                      value={parentProfile.username}
                      onChange={handleParentChange}
                      className="pl-10 bg-gray-700/60 border-gray-600 text-white"
                      placeholder="Choose a username"
                      required
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentPassword">Password</Label>
                  <div className="relative">
                    <Input
                      id="parentPassword"
                      name="password"
                      type="password"
                      value={parentProfile.password}
                      onChange={handleParentChange}
                      className="pl-10 bg-gray-700/60 border-gray-600 text-white"
                      placeholder="Create a secure password"
                      required
                      minLength={8}
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-400">
                    Password must be at least 8 characters and include a number and special character.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                  Continue to Student Profiles <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Users className="mr-2 h-6 w-6 text-purple-400" />
                  Student Profiles
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Set up profiles for each of your {studentProfiles.length} student
                  {studentProfiles.length > 1 ? "s" : ""}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={studentProfiles[0].id} className="w-full">
                  <TabsList className="grid grid-cols-6 mb-6 bg-gray-700/50">
                    {studentProfiles.map((student, index) => (
                      <TabsTrigger key={student.id} value={student.id} className="data-[state=active]:bg-blue-600">
                        Student {index + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {studentProfiles.map((student) => (
                    <TabsContent key={student.id} value={student.id} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor={`student-${student.id}-firstName`}>First Name</Label>
                          <Input
                            id={`student-${student.id}-firstName`}
                            value={student.firstName}
                            onChange={(e) => handleStudentChange(student.id, "firstName", e.target.value)}
                            className="bg-gray-700/60 border-gray-600 text-white"
                            placeholder="Enter student's first name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`student-${student.id}-lastName`}>Last Name</Label>
                          <Input
                            id={`student-${student.id}-lastName`}
                            value={student.lastName}
                            onChange={(e) => handleStudentChange(student.id, "lastName", e.target.value)}
                            className="bg-gray-700/60 border-gray-600 text-white"
                            placeholder="Enter student's last name"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor={`student-${student.id}-age`}>Age</Label>
                          <div className="relative">
                            <Input
                              id={`student-${student.id}-age`}
                              value={student.age}
                              onChange={(e) => handleStudentChange(student.id, "age", e.target.value)}
                              className="pl-10 bg-gray-700/60 border-gray-600 text-white"
                              placeholder="Enter student's age"
                              type="number"
                              min="3"
                              max="18"
                              required
                            />
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`student-${student.id}-grade`}>Grade Level</Label>
                          <div className="relative">
                            <Select
                              value={student.grade}
                              onValueChange={(value) => handleStudentChange(student.id, "grade", value)}
                              required
                            >
                              <SelectTrigger className="pl-10 bg-gray-700/60 border-gray-600 text-white">
                                <SelectValue placeholder="Select grade level" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700">
                                {gradeOptions.map((grade) => (
                                  <SelectItem key={grade} value={grade}>
                                    {grade}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`student-${student.id}-username`}>Student Username</Label>
                        <div className="relative">
                          <Input
                            id={`student-${student.id}-username`}
                            value={student.username}
                            onChange={(e) => handleStudentChange(student.id, "username", e.target.value)}
                            className="pl-10 bg-gray-700/60 border-gray-600 text-white"
                            placeholder="Choose a username for the student"
                            required
                          />
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-400">
                          This will be used by the student to log in to their dashboard.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`student-${student.id}-password`}>Student Password</Label>
                        <div className="relative">
                          <Input
                            id={`student-${student.id}-password`}
                            type="password"
                            value={student.password}
                            onChange={(e) => handleStudentChange(student.id, "password", e.target.value)}
                            className="pl-10 bg-gray-700/60 border-gray-600 text-white"
                            placeholder="Create a password for the student"
                            required
                            minLength={6}
                          />
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-400">
                          Choose a password that is easy for your student to remember but secure.
                        </p>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Back to Parent Profile
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    <>
                      Complete Setup & Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
