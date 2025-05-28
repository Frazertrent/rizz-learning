"use client"

import { useState } from "react"
import { ArrowLeft, Calendar, CheckCircle, Clock, Filter, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ScheduleReviewPage() {
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data for schedule items that need review
  const scheduleItems = [
    {
      id: 1,
      studentName: "Enoch",
      studentId: "enoch123",
      subject: "Science",
      activity: "Lab Report: Plant Growth",
      dueDate: "April 15, 2025",
      status: "needs-review",
      issue: "Missing conclusion section",
      priority: "high",
    },
    {
      id: 2,
      studentName: "Enoch",
      studentId: "enoch123",
      subject: "Math",
      activity: "Weekly Quiz: Fractions",
      dueDate: "April 16, 2025",
      status: "needs-review",
      issue: "Score below threshold (65%)",
      priority: "high",
    },
    {
      id: 3,
      studentName: "Sarah",
      studentId: "sarah456",
      subject: "History",
      activity: "Essay: Ancient Egypt",
      dueDate: "April 14, 2025",
      status: "needs-review",
      issue: "Citations needed",
      priority: "medium",
    },
    {
      id: 4,
      studentName: "Michael",
      studentId: "michael789",
      subject: "English",
      activity: "Book Report",
      dueDate: "April 17, 2025",
      status: "needs-review",
      issue: "Grammar and spelling issues",
      priority: "medium",
    },
    {
      id: 5,
      studentName: "Enoch",
      studentId: "enoch123",
      subject: "Art",
      activity: "Project: Self Portrait",
      dueDate: "April 13, 2025",
      status: "completed",
      issue: "None",
      priority: "low",
    },
  ]

  // Filter items based on current filter and search term
  const filteredItems = scheduleItems.filter((item) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "high-priority" && item.priority === "high") ||
      (filter === "enoch" && item.studentName === "Enoch")

    const matchesSearch =
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/parent/students">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Schedule Review
              </h1>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="rounded-full">
                <Calendar className="h-4 w-4 mr-2" />
                This Week
              </Button>
              <Button className="rounded-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All Reviewed
              </Button>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Review and provide feedback on student schedules and assignments that need attention.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-1 max-w-md relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by subject, activity, or student..."
              className="pl-10 rounded-full border-slate-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px] rounded-full">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="high-priority">High Priority</SelectItem>
                <SelectItem value="enoch">Enoch Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="needs-review" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="needs-review" className="rounded-l-full">
              Needs Review
            </TabsTrigger>
            <TabsTrigger value="completed" className="rounded-r-full">
              Completed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="needs-review" className="space-y-4">
            {filteredItems.filter((item) => item.status === "needs-review").length === 0 ? (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                  <h3 className="text-xl font-medium">All caught up!</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    There are no items that need your review right now.
                  </p>
                </div>
              </Card>
            ) : (
              filteredItems
                .filter((item) => item.status === "needs-review")
                .map((item) => (
                  <Card
                    key={item.id}
                    className="p-6 hover:shadow-md transition-all duration-200 border-l-4 border-l-orange-500"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={item.priority === "high" ? "destructive" : "outline"}
                            className="rounded-full"
                          >
                            {item.priority === "high" ? "High Priority" : "Medium Priority"}
                          </Badge>
                          <span className="text-sm text-slate-500">
                            <Clock className="h-3 w-3 inline mr-1" />
                            Due: {item.dueDate}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold">{item.activity}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="rounded-full">
                            {item.subject}
                          </Badge>
                          <span className="text-sm font-medium">
                            Student:{" "}
                            <Link href={`/parent/students/${item.studentId}`} className="text-blue-500 hover:underline">
                              {item.studentName}
                            </Link>
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">
                          <span className="font-medium">Issue:</span> {item.issue}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 md:flex-col md:items-end md:justify-center md:space-y-2 md:space-x-0">
                        <Link href={`/parent/students/${item.studentId}/schedule`}>
                          <Button className="rounded-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 w-full">
                            Review Schedule
                          </Button>
                        </Link>
                        <Link href={`/parent/feedback/${item.subject.toLowerCase()}`}>
                          <Button variant="outline" className="rounded-full w-full">
                            Provide Feedback
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {filteredItems.filter((item) => item.status === "completed").length === 0 ? (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <Calendar className="h-12 w-12 text-slate-400" />
                  <h3 className="text-xl font-medium">No completed reviews</h3>
                  <p className="text-slate-600 dark:text-slate-400">You haven't completed any schedule reviews yet.</p>
                </div>
              </Card>
            ) : (
              filteredItems
                .filter((item) => item.status === "completed")
                .map((item) => (
                  <Card
                    key={item.id}
                    className="p-6 hover:shadow-md transition-all duration-200 border-l-4 border-l-green-500"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="outline"
                            className="rounded-full bg-green-100 text-green-800 border-green-200"
                          >
                            Completed
                          </Badge>
                          <span className="text-sm text-slate-500">
                            <Clock className="h-3 w-3 inline mr-1" />
                            Reviewed on: April 17, 2025
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold">{item.activity}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="rounded-full">
                            {item.subject}
                          </Badge>
                          <span className="text-sm font-medium">
                            Student:{" "}
                            <Link href={`/parent/students/${item.studentId}`} className="text-blue-500 hover:underline">
                              {item.studentName}
                            </Link>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 md:flex-col md:items-end md:justify-center md:space-y-2 md:space-x-0">
                        <Link href={`/parent/students/${item.studentId}/schedule`}>
                          <Button variant="outline" className="rounded-full w-full">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
