"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, Edit, Trash2, UserPlus, Loader2, Plus } from "lucide-react"
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, User, Archive } from "lucide-react"

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Student {
  id: string
  firstName: string
  lastName: string
  gradeLevel: string
  age: number
  avatar?: string
  username?: string
  password?: string
  status: "Active" | "Archived"
  createdAt: string
  updatedAt: string
}

export function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const { toast } = useToast()

  // Fetch students from Supabase
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)

        const { data: studentsData, error: studentsError } = await supabase
          .from('students')
          .select('*')
          .order('firstName')

        if (studentsError) throw studentsError

        setStudents(studentsData as Student[] || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching students:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  const handleAddStudent = async (newStudent: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([{
          ...newStudent,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      setStudents([...students, data as Student])
      setShowAddModal(false)
      toast({
        title: "Success",
        description: "Student added successfully",
      })
    } catch (err) {
      console.error('Error adding student:', err)
      toast({
        title: "Error",
        description: "Failed to add student. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditStudent = async (updatedStudent: Student) => {
    try {
      const { error } = await supabase
        .from('students')
        .update({
          ...updatedStudent,
          updatedAt: new Date().toISOString()
        })
        .eq('id', updatedStudent.id)

      if (error) throw error

      setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s))
      setShowEditModal(false)
      setSelectedStudent(null)
      toast({
        title: "Success",
        description: "Student updated successfully",
      })
    } catch (err) {
      console.error('Error updating student:', err)
      toast({
        title: "Error",
        description: "Failed to update student. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleArchiveStudent = async (student: Student) => {
    try {
      const { error } = await supabase
        .from('students')
        .update({
          status: 'Archived',
          updatedAt: new Date().toISOString()
        })
        .eq('id', student.id)

      if (error) throw error

      setStudents(students.map(s => s.id === student.id ? { ...s, status: 'Archived' } : s))
      toast({
        title: "Success",
        description: "Student archived successfully",
      })
    } catch (err) {
      console.error('Error archiving student:', err)
      toast({
        title: "Error",
        description: "Failed to archive student. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading student data...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">
          <p>Error loading student data: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Students</h2>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Student
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <Card key={student.id} className="relative">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage
                        src={student.avatar || "/placeholder.svg"}
                        alt={`${student.firstName} ${student.lastName}`}
                      />
                      <AvatarFallback>
                        {student.firstName[0]}
                        {student.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>
                        {student.firstName} {student.lastName}
                      </CardTitle>
                      <CardDescription>Grade {student.gradeLevel}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      <span>Age: {student.age}</span>
                    </div>
                    {student.username && (
                      <div className="flex items-center text-sm">
                        <User className="mr-2 h-4 w-4" />
                        <span>Username: {student.username}</span>
                      </div>
                    )}
                    <Badge
                      variant={student.status === "Active" ? "default" : "secondary"}
                    >
                      {student.status}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedStudent(student)
                      setShowEditModal(true)
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  {student.status === "Active" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleArchiveStudent(student)}
                    >
                      <Archive className="mr-2 h-4 w-4" />
                      Archive
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Add Student Modal */}
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              {/* Add student form */}
            </DialogContent>
          </Dialog>

          {/* Edit Student Modal */}
          <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Student</DialogTitle>
              </DialogHeader>
              {/* Edit student form */}
            </DialogContent>
          </Dialog>
        </>
      )}
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
