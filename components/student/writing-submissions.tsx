"use client"

import { useState, useEffect } from "react"
import {
  FileText,
  CheckCircle,
  ChevronDown,
  AlertCircle,
  Edit,
  Sparkles,
  Brain,
  Flame,
  Filter,
  Clock,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// Mock data for submission types
const submissionTypes = ["Essay", "Creative Writing", "History Report", "Science Journal", "Reflection"]

// Mock data for previous submissions
const previousSubmissions = [
  {
    id: 1,
    title: "The Impact of Climate Change",
    type: "Science Journal",
    score: 85,
    status: "Submitted to Parent",
    date: "2023-04-12",
    feedback: "Strong analysis and well-structured. Consider adding more data visualization.",
  },
  {
    id: 2,
    title: "To Kill a Mockingbird Analysis",
    type: "Essay",
    score: 78,
    status: "Needs Revision",
    date: "2023-04-10",
    feedback: "Good insights but needs stronger thesis statement and more textual evidence.",
  },
  {
    id: 3,
    title: "The Renaissance Period",
    type: "History Report",
    score: 92,
    status: "Submitted to Parent",
    date: "2023-04-05",
    feedback: "Excellent research and presentation. Very thorough analysis of the time period.",
  },
  {
    id: 4,
    title: "Short Story: The Last Light",
    type: "Creative Writing",
    score: 88,
    status: "Submitted to Parent",
    date: "2023-04-01",
    feedback: "Creative plot and well-developed characters. Work on pacing in the middle section.",
  },
]

export default function WritingSubmissionsPage() {
  const [title, setTitle] = useState("")
  const [type, setType] = useState("")
  const [content, setContent] = useState("")
  const [instructions, setInstructions] = useState("")
  const [enableSuggestions, setEnableSuggestions] = useState(false)
  const [filter, setFilter] = useState("All")
  const [selectedSubmission, setSelectedSubmission] = useState<number | null>(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [progress, setProgress] = useState(0)
  const [streakDays, setStreakDays] = useState(3)

  // Simulate progress animation on component mount
  useEffect(() => {
    const timer = setTimeout(() => setProgress(75), 500)
    return () => clearTimeout(timer)
  }, [])

  // Function to handle submission for AI feedback
  const handleSubmitForFeedback = () => {
    if (!title || !type || !content) return
    setShowReviewModal(true)
  }

  // Function to filter submissions
  const filteredSubmissions = previousSubmissions.filter((submission) => {
    if (filter === "All") return true
    return submission.status === filter
  })

  // Function to view submission details
  const handleViewSubmission = (id: number) => {
    setSelectedSubmission(id === selectedSubmission ? null : id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            ✍️ AI Writing Coach
          </h1>
          <p className="mt-2 text-gray-400">Write better, faster, and smarter — with instant AI feedback.</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Submission Form (2/3 width) */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border-b border-gray-700">
                <CardTitle className="flex items-center text-xl">
                  <FileText className="mr-2 h-5 w-5 text-blue-400" />📝 New Submission
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Write directly here and get instant AI coaching on your work.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-200">
                    Title of Assignment
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., The Impact of Climate Change"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-gray-200">
                    Type of Submission
                  </Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger id="type" className="bg-gray-700/50 border-gray-600 text-white">
                      <SelectValue placeholder="Select submission type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {submissionTypes.map((submissionType) => (
                        <SelectItem
                          key={submissionType}
                          value={submissionType}
                          className="text-white hover:bg-gray-700"
                        >
                          {submissionType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 relative">
                  <Label htmlFor="content" className="text-gray-200">
                    Your Writing
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="Type or paste your writing here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 min-h-[200px] focus:border-blue-500 focus:ring-blue-500"
                  />

                  {/* Sticky GPT feedback bubble - only shows when content has some text */}
                  {content.length > 20 && enableSuggestions && (
                    <div className="absolute right-3 bottom-3 bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-lg shadow-lg max-w-xs animate-fade-in">
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-5 w-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-white">Consider revising this sentence:</p>
                          <p className="text-xs text-gray-200 mt-1">
                            "Try breaking this long sentence into two for better clarity."
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions" className="text-gray-200">
                    Assignment Instructions (Optional)
                  </Label>
                  <Textarea
                    id="instructions"
                    placeholder="Add any specific instructions or requirements..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 min-h-[100px] focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="suggestions"
                      checked={enableSuggestions}
                      onCheckedChange={setEnableSuggestions}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <Label htmlFor="suggestions" className="text-gray-200 cursor-pointer">
                      💬 Enable Inline Suggestions
                    </Label>
                  </div>

                  <span className="text-xs text-gray-400">
                    {enableSuggestions
                      ? "GPT will highlight grammar and clarity issues."
                      : "Turn on for real-time feedback."}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-800/50 border-t border-gray-700 px-6 py-4 flex flex-col space-y-4">
                <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={handleSubmitForFeedback}
                      disabled={!title || !type || !content}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
                    >
                      <Brain className="mr-2 h-5 w-5" />🧠 Get AI Review
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-center">AI Writing Review</DialogTitle>
                      <DialogDescription className="text-gray-300 text-center">
                        Here's your personalized feedback
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-blue-400">87</div>
                          <div className="text-sm text-gray-300">Grammar Score</div>
                        </div>
                        <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-purple-400">82</div>
                          <div className="text-sm text-gray-300">Clarity Score</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium text-blue-300">Suggestions:</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2 bg-gray-700/30 p-3 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">
                              Try breaking this long sentence into two for better clarity.
                            </span>
                          </li>
                          <li className="flex items-start gap-2 bg-gray-700/30 p-3 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">
                              Consider adding more evidence to support your main argument.
                            </span>
                          </li>
                          <li className="flex items-start gap-2 bg-gray-700/30 p-3 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Your conclusion could be stronger by restating your thesis.</span>
                          </li>
                        </ul>
                      </div>

                      <Button
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        onClick={() => setShowReviewModal(false)}
                      >
                        Apply Suggestions
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Writing Streak Badge */}
                <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-700/30 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Flame className="h-6 w-6 text-orange-500 animate-pulse-subtle" />
                      </div>
                      <svg className="h-12 w-12 transform -rotate-90">
                        <circle cx="24" cy="24" r="20" fill="none" stroke="#374151" strokeWidth="4" />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="none"
                          stroke="#f97316"
                          strokeWidth="4"
                          strokeDasharray="125.6"
                          strokeDashoffset={125.6 - (progress / 100) * 125.6}
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-amber-300">🔥 {streakDays}-Day Writing Streak!</div>
                      <div className="text-xs text-gray-400">Keep going for bonus XP.</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-amber-400">+{streakDays * 5} XP</div>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Right Column - Submissions (1/3 width) */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl h-full">
              <CardHeader className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-b border-gray-700">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center text-xl">
                    <FileText className="mr-2 h-5 w-5 text-indigo-400" />📂 My Submissions
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-300">Track your recent writing and AI feedback.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white w-full">
                      <div className="flex items-center">
                        <Filter className="h-4 w-4 mr-2 text-gray-400" />
                        <SelectValue placeholder="Filter submissions" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="All" className="text-white hover:bg-gray-700">
                        All Submissions
                      </SelectItem>
                      <SelectItem value="Needs Revision" className="text-white hover:bg-gray-700">
                        Needs Revision
                      </SelectItem>
                      <SelectItem value="Submitted to Parent" className="text-white hover:bg-gray-700">
                        Submitted to Parent
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {filteredSubmissions.length > 0 ? (
                    filteredSubmissions.map((submission) => (
                      <div key={submission.id} className="space-y-3">
                        <div
                          className={cn(
                            "p-4 bg-gray-800/50 rounded-lg border-l-4 hover:bg-gray-700/50 transition-colors cursor-pointer",
                            submission.status === "Submitted to Parent" ? "border-green-500" : "border-amber-500",
                          )}
                          onClick={() => handleViewSubmission(submission.id)}
                        >
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-white">{submission.title}</h3>
                              <ChevronDown
                                className={cn(
                                  "h-5 w-5 text-gray-400 transition-transform",
                                  selectedSubmission !== submission.id && "transform rotate-180",
                                )}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={cn(
                                    "rounded-full text-xs",
                                    submission.status === "Submitted to Parent"
                                      ? "bg-green-500/20 text-green-400 hover:bg-green-500/20 border-green-500/30"
                                      : "bg-amber-500/20 text-amber-400 hover:bg-amber-500/20 border-amber-500/30",
                                  )}
                                >
                                  {submission.status === "Submitted to Parent" ? (
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                  ) : (
                                    <Edit className="h-3 w-3 mr-1" />
                                  )}
                                  {submission.status}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-2">
                                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 rounded-full">
                                  {submission.type}
                                </Badge>
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-blue-500/30">
                                  <span className="text-sm font-medium">{submission.score}</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-xs text-gray-400 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(submission.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        {selectedSubmission === submission.id && (
                          <div className="p-4 bg-gray-800/30 rounded-lg ml-4 border-l border-gray-700 animate-fade-in">
                            <h4 className="text-sm font-medium mb-2 text-gray-300">AI Feedback:</h4>
                            <p className="text-gray-400 text-sm">{submission.feedback}</p>

                            <div className="flex justify-end mt-4 space-x-3">
                              {submission.status === "Needs Revision" ? (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs bg-gray-700/50 border-gray-600 text-gray-200 hover:bg-gray-700 hover:text-white"
                                  >
                                    <Edit className="h-3 w-3 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="text-xs bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                  >
                                    <Send className="h-3 w-3 mr-1" />
                                    Submit
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs bg-gray-700/50 border-gray-600 text-gray-200 hover:bg-gray-700 hover:text-white"
                                >
                                  <FileText className="h-3 w-3 mr-1" />
                                  View Full
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-1">No submissions yet</h3>
                      <p>Submit your first writing assignment to get AI feedback</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
