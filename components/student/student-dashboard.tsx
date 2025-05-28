"use client"
import { Button } from "@/components/ui/button"
import { FileText, MessageSquare, Upload } from "lucide-react"
import Link from "next/link"

const StudentDashboard = () => {
  // Dummy data for assignments
  const upcomingAssignments = [
    {
      id: "1",
      title: "Essay on Climate Change",
      subject: "Environmental Science",
      dueDate: "2024-03-15",
    },
    {
      id: "2",
      title: "Math Worksheet - Algebra",
      subject: "Mathematics",
      dueDate: "2024-03-18",
    },
    {
      id: "3",
      title: "History Project - World War II",
      subject: "History",
      dueDate: "2024-03-22",
    },
  ]

  const handleViewAssignmentDetails = (assignment: any) => {
    // Implement logic to view assignment details
    console.log(`View details for assignment: ${assignment.title}`)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Student Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Upcoming Assignments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingAssignments.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold">{assignment.title}</h3>
              <p className="text-gray-600">{assignment.subject}</p>
              <p className="text-gray-600">Due Date: {assignment.dueDate}</p>
              <div className="flex space-x-2 mt-4 md:mt-0">
                <Button
                  size="sm"
                  className="rounded-lg bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md transition-all flex-1 sm:flex-none h-10"
                  onClick={() => handleViewAssignmentDetails(assignment)}
                >
                  <FileText className="h-4 w-4 mr-1.5" />
                  View Details
                </Button>
                <Button
                  size="sm"
                  className="rounded-lg bg-purple-500 hover:bg-purple-600 text-white shadow-sm hover:shadow-md transition-all flex-1 sm:flex-none h-10"
                  asChild
                >
                  <Link href={`/student/chat?assignment=${encodeURIComponent(assignment.title)}`}>
                    <MessageSquare className="h-4 w-4 mr-1.5" />
                    Ask GPT for Help
                  </Link>
                </Button>
                <Button
                  size="sm"
                  className="rounded-lg bg-green-500 hover:bg-green-600 text-white shadow-sm hover:shadow-md transition-all flex-1 sm:flex-none h-10"
                  asChild
                >
                  <Link
                    href={`/student/uploads?subject=${encodeURIComponent(assignment.subject)}&assignment=${assignment.id}`}
                  >
                    <Upload className="h-4 w-4 mr-1.5" />
                    Upload Work
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Add more sections for grades, announcements, etc. */}
    </div>
  )
}

export default StudentDashboard
