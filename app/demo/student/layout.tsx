import type React from "react"
import { StudentHeader } from "@/components/student/student-header"
import { StudentToolbelt } from "@/components/student/student-toolbelt"

interface StudentLayoutProps {
  children: React.ReactNode
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  // Mock data for the student - in a real app, this would come from a database or API
  const studentData = {
    studentName: "Alex Johnson",
    level: 5,
    xp: 450,
    coins: 120,
    streak: 7,
    avatarUrl: "/placeholder.svg?height=36&width=36",
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <StudentHeader {...studentData} />
      <StudentToolbelt />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
