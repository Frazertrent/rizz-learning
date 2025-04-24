"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, Edit, Trash2, UserPlus } from "lucide-react"
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

// Mock data for students
const initialStudents = [
  {
    id: 1,
    name: "Emma Johnson",
    age: 10,
    grade: "5th Grade",
    subjects: ["Math", "Science", "English", "History"],
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Noah Williams",
    age: 8,
    grade: "3rd Grade",
    subjects: ["Math", "Science", "Reading"],
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Olivia Davis",
    age: 12,
    grade: "7th Grade",
    subjects: ["Algebra", "Biology", "Literature", "Geography", "Spanish"],
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

export function StudentManagement() {
  const [students, setStudents] = useState(initialStudents)
  const [newStudent, setNewStudent] = useState({
    name: "",
    age: "",
    grade: "",
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const handleAddStudent = () => {
    if (newStudent.name && newStudent.age && newStudent.grade) {
      const student = {
        id: students.length + 1,
        name: newStudent.name,
        age: Number.parseInt(newStudent.age),
        grade: newStudent.grade,
        subjects: [],
        avatar: "/placeholder.svg?height=100&width=100",
      }
      setStudents([...students, student])
      setNewStudent({ name: "", age: "", grade: "" })
      setIsAddDialogOpen(false)
    }
  }

  const handleDeleteStudent = (id: number) => {
    setStudents(students.filter((student) => student.id !== id))
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
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="col-span-3"
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
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="grade" className="text-right">
                  Grade
                </Label>
                <Input
                  id="grade"
                  value={newStudent.grade}
                  onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddStudent}>Add Student</Button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <StudentCard key={student.id} student={student} onDelete={handleDeleteStudent} />
            ))}
          </div>
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

interface StudentCardProps {
  student: {
    id: number
    name: string
    age: number
    grade: string
    subjects: string[]
    avatar: string
  }
  onDelete: (id: number) => void
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
            {student.subjects.map((subject, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs">
                {subject}
              </span>
            ))}
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
