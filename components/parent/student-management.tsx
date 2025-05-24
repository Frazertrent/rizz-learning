"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, Edit, Trash2, UserPlus, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { StudentToolsNav } from "./student-tools-nav"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@supabase/supabase-js"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Add the Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

// Mock data for students
// const initialStudents = [
//   {
//     id: 1,
//     name: "Emma Johnson",
//     age: 10,
//     grade: "5th Grade",
//     subjects: ["Math", "Science", "English", "History"],
//     avatar: "/placeholder.svg?height=100&width=100",
//   },
//   {
//     id: 2,
//     name: "Noah Williams",
//     age: 8,
//     grade: "3rd Grade",
//     subjects: ["Math", "Science", "Reading"],
//     avatar: "/placeholder.svg?height=100&width=100",
//   },
//   {
//     id: 3,
//     name: "Olivia Davis",
//     age: 12,
//     grade: "7th Grade",
//     subjects: ["Algebra", "Biology", "Literature", "Geography", "Spanish"],
//     avatar: "/placeholder.svg?height=100&width=100",
//   },
// ]

// Replace the existing StudentManagement component with this updated version
export function StudentManagement() {
  const [students, setStudents] = useState<any[]>([])
  const [newStudent, setNewStudent] = useState({
    name: "",
    age: "",
    grade: "",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingStudents, setIsLoadingStudents] = useState(true)
  const { toast } = useToast()

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents()
  }, [])

  // Fetch students from Supabase
  const fetchStudents = async () => {
    try {
      setIsLoadingStudents(true)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to view students",
          variant: "destructive",
        })
        return
      }

      // Fetch students for the current user
      const { data, error } = await supabase.from("student").select("*").eq("parent_id", user.id)

      if (error) {
        throw error
      }

      // Transform the data to match our component's expected format
      const formattedStudents = data.map((student) => ({
        id: student.id,
        name: `${student.first_name} ${student.last_name}`,
        age: student.age,
        grade: student.grade_level,
        subjects: student.assigned_tools || [],
        avatar: "/placeholder.svg?height=100&width=100",
      }))

      setStudents(formattedStudents)
    } catch (error) {
      console.error("Error fetching students:", error)
      toast({
        title: "Error",
        description: "Failed to load students. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingStudents(false)
    }
  }

  const handleAddStudent = async () => {
    if (!newStudent.firstName || !newStudent.lastName || !newStudent.age || !newStudent.grade) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to add a student",
          variant: "destructive",
        })
        return
      }

      // Create the student in Supabase
      const { data, error } = await supabase
        .from("student")
        .insert({
          parent_id: user.id,
          first_name: newStudent.firstName,
          last_name: newStudent.lastName,
          full_name: `${newStudent.firstName} ${newStudent.lastName}`,
          age: Number.parseInt(newStudent.age),
          grade_level: newStudent.grade,
          username: newStudent.username || `${newStudent.firstName.toLowerCase()}${newStudent.lastName.toLowerCase()}`,
          assigned_tools: [],
          schedule_json: {},
          expectations: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()

      if (error) {
        throw error
      }

      // Add the new student to the local state
      const newStudentData = {
        id: data[0].id,
        name: `${newStudent.firstName} ${newStudent.lastName}`,
        age: Number.parseInt(newStudent.age),
        grade: newStudent.grade,
        subjects: [],
        avatar: "/placeholder.svg?height=100&width=100",
      }

      setStudents([...students, newStudentData])

      // Reset the form
      setNewStudent({
        name: "",
        age: "",
        grade: "",
        firstName: "",
        lastName: "",
        username: "",
        password: "",
      })

      // Close the dialog
      setIsAddDialogOpen(false)

      toast({
        title: "Success",
        description: "Student added successfully",
      })
    } catch (error) {
      console.error("Error adding student:", error)
      toast({
        title: "Error",
        description: "Failed to add student. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteStudent = async (id: string) => {
    try {
      // Delete the student from Supabase
      const { error } = await supabase.from("student").delete().eq("id", id)

      if (error) {
        throw error
      }

      // Remove the student from local state
      setStudents(students.filter((student) => student.id !== id))

      toast({
        title: "Success",
        description: "Student deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting student:", error)
      toast({
        title: "Error",
        description: "Failed to delete student. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Student Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>Enter the details of the new student to add them to your dashboard.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={newStudent.firstName}
                  onChange={(e) => setNewStudent({ ...newStudent, firstName: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={newStudent.lastName}
                  onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="age" className="text-right">
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={newStudent.age}
                  onChange={(e) => setNewStudent({ ...newStudent, age: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="grade" className="text-right">
                  Grade
                </Label>
                <Select
                  value={newStudent.grade}
                  onValueChange={(value) => setNewStudent({ ...newStudent, grade: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pre-K">Pre-K</SelectItem>
                    <SelectItem value="Kindergarten">Kindergarten</SelectItem>
                    <SelectItem value="1st Grade">1st Grade</SelectItem>
                    <SelectItem value="2nd Grade">2nd Grade</SelectItem>
                    <SelectItem value="3rd Grade">3rd Grade</SelectItem>
                    <SelectItem value="4th Grade">4th Grade</SelectItem>
                    <SelectItem value="5th Grade">5th Grade</SelectItem>
                    <SelectItem value="6th Grade">6th Grade</SelectItem>
                    <SelectItem value="7th Grade">7th Grade</SelectItem>
                    <SelectItem value="8th Grade">8th Grade</SelectItem>
                    <SelectItem value="9th Grade">9th Grade</SelectItem>
                    <SelectItem value="10th Grade">10th Grade</SelectItem>
                    <SelectItem value="11th Grade">11th Grade</SelectItem>
                    <SelectItem value="12th Grade">12th Grade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  value={newStudent.username}
                  onChange={(e) => setNewStudent({ ...newStudent, username: e.target.value })}
                  className="col-span-3"
                  placeholder="Optional - will generate if left blank"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={newStudent.password}
                  onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                  className="col-span-3"
                  placeholder="Optional - for student login"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddStudent} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Student"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Add the Student Tools Navigation here */}
      <StudentToolsNav />

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Students</TabsTrigger>
          <TabsTrigger value="elementary">Elementary</TabsTrigger>
          <TabsTrigger value="middle">Middle School</TabsTrigger>
          <TabsTrigger value="high">High School</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          {isLoadingStudents ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-2">Loading students...</span>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700">
              <UserPlus className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">No students yet</h3>
              <p className="text-gray-400 mb-4">Add your first student to get started</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>Add Student</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <StudentCard key={student.id} student={student} onDelete={handleDeleteStudent} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="elementary" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students
              .filter((s) => s.age <= 10)
              .map((student) => (
                <StudentCard key={student.id} student={student} onDelete={handleDeleteStudent} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="middle" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students
              .filter((s) => s.age > 10 && s.age <= 13)
              .map((student) => (
                <StudentCard key={student.id} student={student} onDelete={handleDeleteStudent} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="high" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students
              .filter((s) => s.age > 13)
              .map((student) => (
                <StudentCard key={student.id} student={student} onDelete={handleDeleteStudent} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Update the StudentCard component to handle string IDs and improve the UI
interface StudentCardProps {
  student: {
    id: string
    name: string
    age: number
    grade: string
    subjects: string[]
    avatar: string
  }
  onDelete: (id: string) => void
}

function StudentCard({ student, onDelete }: StudentCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <img
              src={student.avatar || "/placeholder.svg"}
              alt={student.name}
              className="w-12 h-12 rounded-full mr-4 object-cover"
            />
            <div>
              <CardTitle className="text-xl">{student.name}</CardTitle>
              <CardDescription>
                {student.age} years old • {student.grade}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(student.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-2">
          <h4 className="text-sm font-medium mb-2">Subjects</h4>
          <div className="flex flex-wrap gap-1">
            {student.subjects && student.subjects.length > 0 ? (
              student.subjects.map((subject, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs">
                  {subject}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">No subjects assigned yet</span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <a href={`/parent/students/${student.id}/schedule`}>View Schedule</a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={`/parent/students/${student.id}/progress`}>Progress</a>
        </Button>
      </CardFooter>
    </Card>
  )
}
