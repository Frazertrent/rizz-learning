"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, Award, Backpack, Palette, Calculator, Microscope } from "lucide-react"
import { getCurrentUser, getStudentsForParent } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { AddStudentModal } from "@/components/parent/add-student-modal"

type Student = {
  id: string
  full_name: string
  grade_level: string
}

const icons = [
  <BookOpen key="book" className="h-8 w-8 text-blue-500" />,
  <Award key="award" className="h-8 w-8 text-purple-500" />,
  <Backpack key="backpack" className="h-8 w-8 text-green-500" />,
  <Palette key="palette" className="h-8 w-8 text-pink-500" />,
  <Calculator key="calculator" className="h-8 w-8 text-amber-500" />,
  <Microscope key="microscope" className="h-8 w-8 text-cyan-500" />,
]

const gradients = [
  "from-blue-400 to-indigo-500",
  "from-purple-400 to-pink-500",
  "from-green-400 to-teal-500",
  "from-pink-400 to-rose-500",
  "from-amber-400 to-orange-500",
  "from-cyan-400 to-blue-500",
]

export function MyStudentsDashboard() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadStudents() {
      try {
        setLoading(true)
        const user = await getCurrentUser()

        if (!user) {
          setError("You must be logged in to view students")
          setLoading(false)
          return
        }

        const studentData = await getStudentsForParent(user.id)
        setStudents(studentData)
      } catch (err) {
        console.error("Error loading students:", err)
        setError("Failed to load students. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadStudents()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p className="text-gray-500">Loading your students...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600 mb-2">❌ {error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">🎓 My Students</h2>

      {students.length === 0 ? (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 text-center">
          <p className="text-xl font-medium text-blue-800 mb-2">🎒 No students yet — add your first one!</p>
          <p className="text-blue-600 mb-4">Start by adding your child's information to create their dashboard.</p>
          <AddStudentModal />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student, index) => (
            <Card
              key={student.id}
              className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group"
            >
              <div className={`h-2 bg-gradient-to-r ${gradients[index % gradients.length]}`} />
              <CardHeader className="flex flex-row items-center gap-4 pt-6">
                <div className="p-2 rounded-full bg-gray-100 group-hover:scale-110 transition-transform duration-300">
                  {icons[index % icons.length]}
                </div>
                <div>
                  <h3 className="font-bold text-xl">{student.full_name}</h3>
                  <p className="text-gray-500">Grade {student.grade_level}</p>
                </div>
              </CardHeader>
              <CardContent></CardContent>
              <CardFooter>
                <Link
                  href={`/parent/students/${student.id}`}
                  className="w-full inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700 transition-colors"
                >
                  View Dashboard{" "}
                  <span className="ml-1 group-hover:translate-x-1 transition-transform duration-200">➜</span>
                </Link>
              </CardFooter>
            </Card>
          ))}

          {/* Add Student Card */}
          <AddStudentModal />
        </div>
      )}
    </div>
  )
}
