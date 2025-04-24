"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MessageSquare,
  Calendar,
  BookOpen,
  Star,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  ArrowUpDown,
  PlusCircle,
  Send,
  Beaker,
  Calculator,
  Download,
  History,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function StudentReflectionPage() {
  const params = useParams()
  const studentId = params.student_id as string

  const [activeTab, setActiveTab] = useState("all")
  const [expandedReflection, setExpandedReflection] = useState<number | null>(null)
  const [parentFeedback, setParentFeedback] = useState<Record<number, string>>({})

  // Mock student data
  const student = {
    id: studentId,
    name: studentId === "1" ? "Emma Johnson" : "Noah Smith",
    grade: studentId === "1" ? "5th Grade" : "3rd Grade",
    avatar: "/placeholder.svg?height=40&width=40",
  }

  // Mock reflection data
  const reflections = [
    {
      id: 1,
      title: "Today's Science Experiment",
      content:
        "I really enjoyed our experiment with plant growth today. I was surprised to see how quickly the bean sprouts grew when we added the special fertilizer. I wonder if different plants would grow at different speeds? Next time, I want to try growing different types of seeds to compare them.",
      date: "April 15, 2025",
      subject: "Science",
      mood: "excited",
      status: "new",
      color: "emerald",
    },
    {
      id: 2,
      title: "Math Fractions Challenge",
      content:
        "Fractions are getting easier for me now. I used to get confused when adding fractions with different denominators, but the method we learned today makes more sense. I still need more practice with mixed numbers though. I'm going to do the extra practice problems tonight.",
      date: "April 14, 2025",
      subject: "Mathematics",
      mood: "determined",
      status: "reviewed",
      color: "blue",
    },
    {
      id: 3,
      title: "Book Report Thoughts",
      content:
        "I finished reading Charlotte's Web yesterday and I loved it! The friendship between Wilbur and Charlotte was so special. It made me sad when Charlotte died, but I liked how her children stayed with Wilbur. The book taught me about friendship and how important it is to be kind to others, even if they're different from you.",
      date: "April 12, 2025",
      subject: "English",
      mood: "thoughtful",
      status: "new",
      color: "violet",
    },
    {
      id: 4,
      title: "History Project Planning",
      content:
        "I'm excited about our Civil War project. I've decided to focus on the role of women during the war. I found some interesting stories about women who disguised themselves as men to fight. I'm going to make a presentation with pictures and quotes. I think this will be interesting for the class to learn about.",
      date: "April 10, 2025",
      subject: "History",
      mood: "curious",
      status: "reviewed",
      color: "amber",
    },
    {
      id: 5,
      title: "Weekly Learning Reflection",
      content:
        "This week was challenging but rewarding. I struggled with the new math concepts at first, but after getting help and practicing more, I feel more confident. I'm proud of my science project and how well my presentation went. My goal for next week is to improve my vocabulary by reading more and using new words in my writing.",
      date: "April 8, 2025",
      subject: "General",
      mood: "proud",
      status: "new",
      color: "indigo",
    },
  ]

  const filteredReflections =
    activeTab === "all"
      ? reflections
      : activeTab === "new"
        ? reflections.filter((r) => r.status === "new")
        : reflections.filter((r) => r.status === "reviewed")

  const handleFeedbackChange = (id: number, value: string) => {
    setParentFeedback({
      ...parentFeedback,
      [id]: value,
    })
  }

  const handleSubmitFeedback = (id: number) => {
    // In a real app, this would send the feedback to the backend
    console.log(`Submitting feedback for reflection ${id}: ${parentFeedback[id]}`)
    // Clear the feedback field after submission
    setParentFeedback({
      ...parentFeedback,
      [id]: "",
    })
  }

  const handleMarkAsReviewed = (id: number) => {
    // In a real app, this would update the status in the backend
    console.log(`Marking reflection ${id} as reviewed`)
  }

  return (
    <div className="container mx-auto py-6 space-y-8 animate-fadeIn">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Student Reflections</h1>
        <p className="text-muted-foreground">Review {student.name}'s learning reflections and provide feedback</p>
      </div>

      {/* Quick Navigation */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 p-4 rounded-xl shadow-sm">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
            className="bg-white/80 dark:bg-slate-800/80 hover:bg-white hover:text-purple-600 transition-all"
            onClick={() => (window.location.href = "/parent")}
          >
            Parent Dashboard
          </Button>
          <Button
            variant="ghost"
            className="bg-white/80 dark:bg-slate-800/80 hover:bg-white hover:text-purple-600 transition-all"
            onClick={() => (window.location.href = `/parent/students/${studentId}/schedule`)}
          >
            Schedule View
          </Button>
          <Button
            variant="ghost"
            className="bg-white/80 dark:bg-slate-800/80 hover:bg-white hover:text-purple-600 transition-all"
            onClick={() => (window.location.href = `/parent/students/${studentId}/grades`)}
          >
            Gradebook
          </Button>
          <Button
            variant="ghost"
            className="bg-white/80 dark:bg-slate-800/80 hover:bg-white hover:text-purple-600 transition-all"
            onClick={() => (window.location.href = "/parent/feedback")}
          >
            Feedback & Reviews
          </Button>
          <Button
            variant="ghost"
            className="bg-white/80 dark:bg-slate-800/80 hover:bg-white hover:text-purple-600 transition-all"
            onClick={() => (window.location.href = "/parent/students")}
          >
            All Students
          </Button>
        </div>
      </div>

      {/* Student Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-3 border-none shadow-md overflow-hidden bg-gradient-to-r from-purple-50 to-violet-50 dark:from-slate-900 dark:to-slate-800">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-violet-600 text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-white/20">
                  <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                  <AvatarFallback className="bg-purple-500">{student.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{student.name}</CardTitle>
                  <CardDescription className="text-purple-100">{student.grade} • Reflection Journal</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Prompt
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-none shadow-md overflow-hidden bg-gradient-to-br from-violet-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
            <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
              <CardTitle>Reflection Stats</CardTitle>
              <CardDescription className="text-violet-100">Journal activity overview</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <span>Total Reflections</span>
                  </div>
                  <span className="font-bold">{reflections.length}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                      <Clock className="h-4 w-4" />
                    </div>
                    <span>Needs Review</span>
                  </div>
                  <span className="font-bold">{reflections.filter((r) => r.status === "new").length}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span>Reviewed</span>
                  </div>
                  <span className="font-bold">{reflections.filter((r) => r.status === "reviewed").length}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <span>This Week</span>
                  </div>
                  <span className="font-bold">3</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md overflow-hidden bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
              <CardTitle>Subject Breakdown</CardTitle>
              <CardDescription className="text-indigo-100">Reflections by subject</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                      <Beaker className="h-4 w-4" />
                    </div>
                    <span>Science</span>
                  </div>
                  <span className="font-bold">1</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      <Calculator className="h-4 w-4" />
                    </div>
                    <span>Mathematics</span>
                  </div>
                  <span className="font-bold">1</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <span>English</span>
                  </div>
                  <span className="font-bold">1</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                      <History className="h-4 w-4" />
                    </div>
                    <span>History</span>
                  </div>
                  <span className="font-bold">1</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                      <Star className="h-4 w-4" />
                    </div>
                    <span>General</span>
                  </div>
                  <span className="font-bold">1</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3 space-y-6">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-violet-500 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Reflection Journal</CardTitle>
                  <CardDescription className="text-purple-100">
                    Review and respond to student reflections
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Sort
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <div className="px-4 pt-4">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger
                      value="all"
                      className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 dark:data-[state=active]:bg-violet-900 dark:data-[state=active]:text-violet-100"
                    >
                      All Reflections
                    </TabsTrigger>
                    <TabsTrigger
                      value="new"
                      className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 dark:data-[state=active]:bg-amber-900 dark:data-[state=active]:text-amber-100"
                    >
                      Needs Review
                    </TabsTrigger>
                    <TabsTrigger
                      value="reviewed"
                      className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900 dark:data-[state=active]:text-emerald-100"
                    >
                      Reviewed
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="px-4 pb-4">
                  <div className="relative mb-4">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search reflections..." className="pl-8" />
                  </div>
                </div>

                <TabsContent value="all" className="m-0">
                  <div className="space-y-4 p-4">
                    {filteredReflections.map((reflection) => (
                      <Card
                        key={reflection.id}
                        className={`border-none shadow-sm overflow-hidden bg-gradient-to-br from-${reflection.color}-50 to-white dark:from-slate-800 dark:to-slate-900 hover:shadow-md transition-all`}
                      >
                        <CardHeader className={`bg-${reflection.color}-500 text-white py-3`}>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className={`p-2 rounded-full bg-${reflection.color}-400`}>
                                {reflection.subject === "Science" ? (
                                  <Beaker className="h-4 w-4" />
                                ) : reflection.subject === "Mathematics" ? (
                                  <Calculator className="h-4 w-4" />
                                ) : reflection.subject === "English" ? (
                                  <BookOpen className="h-4 w-4" />
                                ) : reflection.subject === "History" ? (
                                  <History className="h-4 w-4" />
                                ) : (
                                  <Star className="h-4 w-4" />
                                )}
                              </div>
                              <CardTitle className="text-base">{reflection.title}</CardTitle>
                            </div>
                            <Badge
                              variant={reflection.status === "new" ? "destructive" : "secondary"}
                              className="animate-pulse"
                            >
                              {reflection.status === "new" ? "New" : "Reviewed"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{reflection.date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span>{reflection.subject}</span>
                                <span>•</span>
                                <span>Mood: {reflection.mood}</span>
                              </div>
                            </div>

                            <div className={expandedReflection === reflection.id ? "" : "line-clamp-3"}>
                              <p>{reflection.content}</p>
                            </div>

                            {expandedReflection !== reflection.id && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpandedReflection(reflection.id)}
                                className="text-xs px-0 hover:bg-transparent hover:underline"
                              >
                                Read more
                              </Button>
                            )}

                            {expandedReflection === reflection.id && (
                              <div className="space-y-4 pt-2 border-t">
                                <div className="space-y-2">
                                  <Label htmlFor={`feedback-${reflection.id}`} className="text-sm font-medium">
                                    Your Feedback
                                  </Label>
                                  <Textarea
                                    id={`feedback-${reflection.id}`}
                                    placeholder="Add your thoughts, questions, or encouragement..."
                                    className="min-h-[100px] focus:border-violet-500 focus:ring-violet-500 transition-all"
                                    value={parentFeedback[reflection.id] || ""}
                                    onChange={(e) => handleFeedbackChange(reflection.id, e.target.value)}
                                  />
                                </div>

                                <div className="flex justify-between">
                                  <Button variant="outline" size="sm" onClick={() => setExpandedReflection(null)}>
                                    Collapse
                                  </Button>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleMarkAsReviewed(reflection.id)}
                                    >
                                      <CheckCircle2 className="h-4 w-4 mr-2" />
                                      Mark as Reviewed
                                    </Button>
                                    <Button
                                      variant="default"
                                      size="sm"
                                      onClick={() => handleSubmitFeedback(reflection.id)}
                                      disabled={!parentFeedback[reflection.id]}
                                    >
                                      <Send className="h-4 w-4 mr-2" />
                                      Send Feedback
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="new" className="m-0">
                  <div className="space-y-4 p-4">
                    {filteredReflections.map((reflection) => (
                      <Card
                        key={reflection.id}
                        className={`border-none shadow-sm overflow-hidden bg-gradient-to-br from-${reflection.color}-50 to-white dark:from-slate-800 dark:to-slate-900 hover:shadow-md transition-all`}
                      >
                        <CardHeader className={`bg-${reflection.color}-500 text-white py-3`}>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className={`p-2 rounded-full bg-${reflection.color}-400`}>
                                {reflection.subject === "Science" ? (
                                  <Beaker className="h-4 w-4" />
                                ) : reflection.subject === "Mathematics" ? (
                                  <Calculator className="h-4 w-4" />
                                ) : reflection.subject === "English" ? (
                                  <BookOpen className="h-4 w-4" />
                                ) : reflection.subject === "History" ? (
                                  <History className="h-4 w-4" />
                                ) : (
                                  <Star className="h-4 w-4" />
                                )}
                              </div>
                              <CardTitle className="text-base">{reflection.title}</CardTitle>
                            </div>
                            <Badge variant="destructive" className="animate-pulse">
                              New
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{reflection.date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span>{reflection.subject}</span>
                                <span>•</span>
                                <span>Mood: {reflection.mood}</span>
                              </div>
                            </div>

                            <div className={expandedReflection === reflection.id ? "" : "line-clamp-3"}>
                              <p>{reflection.content}</p>
                            </div>

                            {expandedReflection !== reflection.id && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpandedReflection(reflection.id)}
                                className="text-xs px-0 hover:bg-transparent hover:underline"
                              >
                                Read more
                              </Button>
                            )}

                            {expandedReflection === reflection.id && (
                              <div className="space-y-4 pt-2 border-t">
                                <div className="space-y-2">
                                  <Label htmlFor={`feedback-${reflection.id}`} className="text-sm font-medium">
                                    Your Feedback
                                  </Label>
                                  <Textarea
                                    id={`feedback-${reflection.id}`}
                                    placeholder="Add your thoughts, questions, or encouragement..."
                                    className="min-h-[100px] focus:border-violet-500 focus:ring-violet-500 transition-all"
                                    value={parentFeedback[reflection.id] || ""}
                                    onChange={(e) => handleFeedbackChange(reflection.id, e.target.value)}
                                  />
                                </div>

                                <div className="flex justify-between">
                                  <Button variant="outline" size="sm" onClick={() => setExpandedReflection(null)}>
                                    Collapse
                                  </Button>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleMarkAsReviewed(reflection.id)}
                                    >
                                      <CheckCircle2 className="h-4 w-4 mr-2" />
                                      Mark as Reviewed
                                    </Button>
                                    <Button
                                      variant="default"
                                      size="sm"
                                      onClick={() => handleSubmitFeedback(reflection.id)}
                                      disabled={!parentFeedback[reflection.id]}
                                    >
                                      <Send className="h-4 w-4 mr-2" />
                                      Send Feedback
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reviewed" className="m-0">
                  <div className="space-y-4 p-4">
                    {filteredReflections.map((reflection) => (
                      <Card
                        key={reflection.id}
                        className={`border-none shadow-sm overflow-hidden bg-gradient-to-br from-${reflection.color}-50 to-white dark:from-slate-800 dark:to-slate-900 hover:shadow-md transition-all`}
                      >
                        <CardHeader className={`bg-${reflection.color}-500 text-white py-3`}>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className={`p-2 rounded-full bg-${reflection.color}-400`}>
                                {reflection.subject === "Science" ? (
                                  <Beaker className="h-4 w-4" />
                                ) : reflection.subject === "Mathematics" ? (
                                  <Calculator className="h-4 w-4" />
                                ) : reflection.subject === "English" ? (
                                  <BookOpen className="h-4 w-4" />
                                ) : reflection.subject === "History" ? (
                                  <History className="h-4 w-4" />
                                ) : (
                                  <Star className="h-4 w-4" />
                                )}
                              </div>
                              <CardTitle className="text-base">{reflection.title}</CardTitle>
                            </div>
                            <Badge variant="secondary">Reviewed</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{reflection.date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span>{reflection.subject}</span>
                                <span>•</span>
                                <span>Mood: {reflection.mood}</span>
                              </div>
                            </div>

                            <div className={expandedReflection === reflection.id ? "" : "line-clamp-3"}>
                              <p>{reflection.content}</p>
                            </div>

                            {expandedReflection !== reflection.id && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpandedReflection(reflection.id)}
                                className="text-xs px-0 hover:bg-transparent hover:underline"
                              >
                                Read more
                              </Button>
                            )}

                            {expandedReflection === reflection.id && (
                              <div className="space-y-4 pt-2 border-t">
                                <div className="space-y-2">
                                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                                    <p className="text-sm font-medium mb-1">Previous Feedback:</p>
                                    <p className="text-sm text-muted-foreground">
                                      Great reflection! I'm impressed with how you're connecting what you learned to
                                      real-world applications. Keep up the good work!
                                    </p>
                                  </div>

                                  <Label htmlFor={`feedback-${reflection.id}`} className="text-sm font-medium">
                                    Add More Feedback
                                  </Label>
                                  <Textarea
                                    id={`feedback-${reflection.id}`}
                                    placeholder="Add additional thoughts or questions..."
                                    className="min-h-[100px] focus:border-violet-500 focus:ring-violet-500 transition-all"
                                    value={parentFeedback[reflection.id] || ""}
                                    onChange={(e) => handleFeedbackChange(reflection.id, e.target.value)}
                                  />
                                </div>

                                <div className="flex justify-between">
                                  <Button variant="outline" size="sm" onClick={() => setExpandedReflection(null)}>
                                    Collapse
                                  </Button>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => handleSubmitFeedback(reflection.id)}
                                    disabled={!parentFeedback[reflection.id]}
                                  >
                                    <Send className="h-4 w-4 mr-2" />
                                    Send Follow-Up
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="bg-slate-50 dark:bg-slate-800/50 p-4 flex justify-between">
              <Button variant="outline" size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Suggest Reflection Topic
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Journal
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
