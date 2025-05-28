"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Calculator,
  Beaker,
  Globe,
  Palette,
  Music,
  Dumbbell,
  History,
  MessageSquare,
  Search,
  Filter,
  Plus,
  Star,
  Clock,
} from "lucide-react"

export default function ParentFeedbackPage() {
  const [activeTab, setActiveTab] = useState("science")
  const [searchQuery, setSearchQuery] = useState("")

  const subjects = [
    { id: "science", name: "Science", icon: <Beaker className="h-5 w-5" /> },
    { id: "math", name: "Mathematics", icon: <Calculator className="h-5 w-5" /> },
    { id: "english", name: "English", icon: <BookOpen className="h-5 w-5" /> },
    { id: "history", name: "History", icon: <History className="h-5 w-5" /> },
    { id: "geography", name: "Geography", icon: <Globe className="h-5 w-5" /> },
    { id: "art", name: "Art", icon: <Palette className="h-5 w-5" /> },
    { id: "music", name: "Music", icon: <Music className="h-5 w-5" /> },
    { id: "pe", name: "Physical Education", icon: <Dumbbell className="h-5 w-5" /> },
  ]

  const feedbackItems = [
    {
      id: 1,
      subject: "science",
      title: "Solar System Project",
      date: "April 15, 2025",
      status: "needs-review",
      preview: "Emma created a detailed model of the solar system...",
      studentName: "Emma",
      studentId: "1",
    },
    {
      id: 2,
      subject: "science",
      title: "Plant Growth Experiment",
      date: "April 10, 2025",
      status: "reviewed",
      preview: "Weekly observation of bean sprouts shows excellent progress...",
      studentName: "Emma",
      studentId: "1",
    },
    {
      id: 3,
      subject: "science",
      title: "States of Matter Quiz",
      date: "April 5, 2025",
      status: "needs-review",
      preview: "Quiz on solids, liquids, and gases completed...",
      studentName: "Noah",
      studentId: "2",
    },
    {
      id: 4,
      subject: "math",
      title: "Fractions Assessment",
      date: "April 14, 2025",
      status: "needs-review",
      preview: "Completed fractions worksheet with mixed results...",
      studentName: "Emma",
      studentId: "1",
    },
    {
      id: 5,
      subject: "english",
      title: "Book Report: Charlotte's Web",
      date: "April 12, 2025",
      status: "reviewed",
      preview: "Excellent analysis of themes and characters...",
      studentName: "Noah",
      studentId: "2",
    },
  ]

  const filteredFeedback = feedbackItems.filter(
    (item) =>
      item.subject === activeTab &&
      (searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.preview.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="container mx-auto py-6 space-y-8 animate-fadeIn">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Parent Feedback Center</h1>
        <p className="text-muted-foreground">Review and respond to your children's work across all subjects</p>
      </div>

      {/* Quick Navigation */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-4 rounded-xl shadow-sm">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
            className="bg-white/80 dark:bg-slate-800/80 hover:bg-white hover:text-indigo-600 transition-all"
            onClick={() => (window.location.href = "/parent")}
          >
            Parent Dashboard
          </Button>
          <Button
            variant="ghost"
            className="bg-white/80 dark:bg-slate-800/80 hover:bg-white hover:text-indigo-600 transition-all"
            onClick={() => (window.location.href = "/parent/curriculum")}
          >
            Curriculum Planner
          </Button>
          <Button
            variant="ghost"
            className="bg-white/80 dark:bg-slate-800/80 hover:bg-white hover:text-indigo-600 transition-all"
            onClick={() => (window.location.href = "/parent/rewards")}
          >
            Rewards Tracker
          </Button>
          <Button
            variant="ghost"
            className="bg-white/80 dark:bg-slate-800/80 hover:bg-white hover:text-indigo-600 transition-all"
            onClick={() => (window.location.href = "/parent/reports")}
          >
            Reports & Summaries
          </Button>
          <Button
            variant="ghost"
            className="bg-white/80 dark:bg-slate-800/80 hover:bg-white hover:text-indigo-600 transition-all"
            onClick={() => (window.location.href = "/parent/students")}
          >
            Student Management
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
            <CardHeader className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white">
              <CardTitle>Subjects</CardTitle>
              <CardDescription className="text-violet-100">Select a subject to review</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col">
                {subjects.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => setActiveTab(subject.id)}
                    className={`flex items-center gap-3 p-3 transition-all ${
                      activeTab === subject.id
                        ? "bg-violet-100 dark:bg-slate-700 text-violet-700 dark:text-violet-300 font-medium"
                        : "hover:bg-violet-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full ${
                        activeTab === subject.id
                          ? "bg-violet-200 dark:bg-violet-900 text-violet-700 dark:text-violet-300"
                          : "bg-slate-100 dark:bg-slate-800"
                      }`}
                    >
                      {subject.icon}
                    </div>
                    <span>{subject.name}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              <CardTitle>Quick Filters</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                Needs Review
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Star className="mr-2 h-4 w-4" />
                Excellent Work
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Needs Feedback
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3 space-y-6">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {subjects.find((s) => s.id === activeTab)?.icon}
                    {subjects.find((s) => s.id === activeTab)?.name} Feedback
                  </CardTitle>
                  <CardDescription className="text-indigo-100">Review and respond to student work</CardDescription>
                </div>
                <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feedback
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search feedback..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {filteredFeedback.length > 0 ? (
                  filteredFeedback.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-lg border bg-white dark:bg-slate-800 hover:shadow-md transition-all cursor-pointer group"
                      onClick={() => (window.location.href = `/parent/students/${item.studentId}/feedback/${item.id}`)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium group-hover:text-indigo-600 transition-colors">{item.title}</h3>
                          <Badge
                            variant={item.status === "needs-review" ? "destructive" : "secondary"}
                            className="animate-pulse"
                          >
                            {item.status === "needs-review" ? "Needs Review" : "Reviewed"}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{item.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{item.preview}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Student: {item.studentName}</span>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-xs h-8">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs h-8">
                            Add Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No feedback items found for this subject.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription className="text-emerald-100">Latest feedback across all subjects</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {feedbackItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 rounded-lg border bg-white dark:bg-slate-800"
                  >
                    <div
                      className={`p-2 rounded-full ${
                        item.subject === "science"
                          ? "bg-emerald-100 text-emerald-700"
                          : item.subject === "math"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-violet-100 text-violet-700"
                      }`}
                    >
                      {item.subject === "science" ? (
                        <Beaker className="h-5 w-5" />
                      ) : item.subject === "math" ? (
                        <Calculator className="h-5 w-5" />
                      ) : (
                        <BookOpen className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{item.title}</h4>
                        <span className="text-sm text-muted-foreground">{item.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.studentName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
