"use client"

import { useState } from "react"
import { X, Clock } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipProvider, TooltipContent } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, CheckCircle2, Clock3 } from "lucide-react"
import { cn } from "@/lib/utils"

type ToolbeltPanelType = "askGpt" | "resources" | "questions" | "checkIn" | null

interface StudentToolbeltProps {
  questions?: any[]
  currentTopic?: any
}

// Mock data for subjects - in a real app, this would come from an API or database
const subjects = [
  { id: "math", name: "Mathematics", icon: "🧮", time: "9:00 AM - 10:30 AM", status: "upcoming" },
  { id: "science", name: "Science", icon: "🔬", time: "11:00 AM - 12:30 PM", status: "upcoming" },
  { id: "music", name: "Music", icon: "🎵", time: "1:30 PM - 2:30 PM", status: "upcoming" },
  { id: "pe", name: "Physical Education", icon: "🏃‍♂️", time: "3:00 PM - 4:00 PM", status: "upcoming" },
]

// Subject colors
const subjectColors: Record<string, string> = {
  math: "from-blue-100 to-blue-50 dark:from-blue-950/40 dark:to-blue-900/20 border-blue-200 dark:border-blue-800",
  science:
    "from-green-100 to-green-50 dark:from-green-950/40 dark:to-green-900/20 border-green-200 dark:border-green-800",
  music:
    "from-purple-100 to-purple-50 dark:from-purple-950/40 dark:to-purple-900/20 border-purple-200 dark:border-purple-800",
  pe: "from-orange-100 to-orange-50 dark:from-orange-950/40 dark:to-orange-900/20 border-orange-200 dark:border-orange-800",
}

export function StudentToolbelt({ questions = [], currentTopic = null }: StudentToolbeltProps) {
  const [activePanel, setActivePanel] = useState<ToolbeltPanelType>(null)
  const [checkedInSubjects, setCheckedInSubjects] = useState<string[]>([])
  const [activeSubject, setActiveSubject] = useState<string | null>(null)

  const togglePanel = (panel: ToolbeltPanelType) => {
    setActivePanel(activePanel === panel ? null : panel)
  }

  const closePanel = () => {
    setActivePanel(null)
  }

  const handleCheckIn = (subjectId: string) => {
    setActiveSubject(subjectId)
    if (!checkedInSubjects.includes(subjectId)) {
      setCheckedInSubjects([...checkedInSubjects, subjectId])
    }
  }

  const handleCheckOut = (subjectId: string) => {
    setActiveSubject(null)
    // Note: We don't remove from checkedInSubjects to keep track of completed subjects
  }

  const getSubjectStatus = (subjectId: string) => {
    if (activeSubject === subjectId) return "active"
    if (checkedInSubjects.includes(subjectId)) return "completed"
    return "upcoming"
  }

  // Format the current date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })
  }

  return (
    <TooltipProvider>
      {/* Floating Toolbelt Buttons */}
      <div className="fixed right-4 top-1/3 z-40 flex flex-col gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => togglePanel("askGpt")}
              className={`h-12 w-12 rounded-full p-0 shadow-md transition-all hover:shadow-lg ${
                activePanel === "askGpt"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  : "bg-gray-800 text-gray-100"
              }`}
              aria-label="Ask GPT a Question"
            >
              <span className="text-xl">🧑‍🏫</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Ask GPT a Question</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => togglePanel("resources")}
              className={`h-12 w-12 rounded-full p-0 shadow-md transition-all hover:shadow-lg ${
                activePanel === "resources"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  : "bg-gray-800 text-gray-100"
              }`}
              aria-label="Open Study Resources"
            >
              <span className="text-xl">📘</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Open Study Resources</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => togglePanel("questions")}
              className={`h-12 w-12 rounded-full p-0 shadow-md transition-all hover:shadow-lg ${
                activePanel === "questions"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  : "bg-gray-800 text-gray-100"
              }`}
              aria-label="View All Questions"
            >
              <span className="text-xl">📋</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">View All Questions</TooltipContent>
        </Tooltip>

        {/* New Check In/Out Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => togglePanel("checkIn")}
              className={`h-12 w-12 rounded-full p-0 shadow-md transition-all hover:shadow-lg ${
                activePanel === "checkIn"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  : "bg-gray-800 text-gray-100"
              }`}
              aria-label="Check In / Out"
            >
              <span className="text-xl">🕒</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Check In / Out</TooltipContent>
        </Tooltip>
      </div>

      {/* Slide-in Panels */}
      <div
        className={`fixed right-0 top-0 z-30 h-full w-80 transform overflow-y-auto bg-gray-900 p-4 shadow-xl transition-transform duration-300 ease-in-out ${
          activePanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-700 pb-3">
          <h2 className="text-xl font-bold text-white">
            {activePanel === "askGpt" && "🧑‍🏫 Ask GPT"}
            {activePanel === "resources" && "📘 Topic Resources"}
            {activePanel === "questions" && "📋 Question List"}
            {activePanel === "checkIn" && "🕒 Check In / Out"}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={closePanel}
            className="h-8 w-8 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-4">
          {/* Ask GPT Panel Content */}
          {activePanel === "askGpt" && (
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-800 p-3">
                <textarea
                  className="h-24 w-full resize-none rounded bg-gray-700 p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your question here..."
                ></textarea>
                <Button className="mt-2 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">
                  Ask GPT
                </Button>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-400">Suggested Questions</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700"
                  >
                    Can you explain this?
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700"
                  >
                    What's a trick to remember this?
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700"
                  >
                    What are real-world uses?
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Topic Resources Panel Content */}
          {activePanel === "resources" && (
            <div className="space-y-4 text-gray-200">
              {currentTopic ? (
                <>
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-400">Overview</h3>
                    <p className="text-sm">
                      This topic covers the fundamental concepts of the subject. Understanding these principles will
                      help you build a strong foundation for more advanced topics.
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-400">Key Concepts</h3>
                    <ul className="list-inside list-disc space-y-1 text-sm">
                      <li>Primary concept explanation</li>
                      <li>Secondary principles and applications</li>
                      <li>Historical context and development</li>
                      <li>Modern usage and relevance</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-400">Related Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-blue-900 px-3 py-1 text-xs text-blue-200">Algebra</span>
                      <span className="rounded-full bg-green-900 px-3 py-1 text-xs text-green-200">
                        Energy Transfer
                      </span>
                      <span className="rounded-full bg-purple-900 px-3 py-1 text-xs text-purple-200">Cell Biology</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <span className="mb-2 text-4xl">📘</span>
                  <h3 className="mb-1 text-lg font-medium">No Topic Selected</h3>
                  <p className="text-sm text-gray-400">
                    Select a topic or navigate to content with associated resources to see details here.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Question List Panel Content */}
          {activePanel === "questions" && (
            <div className="space-y-3">
              {questions.length > 0 ? (
                questions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start border-gray-700 bg-gray-800 text-left text-gray-200 hover:bg-gray-700"
                  >
                    <span className="mr-2 inline-block h-6 w-6 rounded-full bg-gray-700 text-center text-sm leading-6">
                      {index + 1}
                    </span>
                    Question {index + 1}
                  </Button>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <span className="mb-2 text-4xl">📋</span>
                  <h3 className="mb-1 text-lg font-medium">No Questions Available</h3>
                  <p className="text-sm text-gray-400">
                    There are no questions available for this content yet. Check back later or try a different section.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Check In/Out Panel Content */}
          {activePanel === "checkIn" && (
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-800 p-3">
                <h3 className="mb-2 text-sm font-medium text-white">{formatDate(new Date())}</h3>
                <p className="mb-4 text-xs text-gray-400">Check in or out of your scheduled subjects</p>

                <div className="space-y-3">
                  {subjects.map((subject) => {
                    const status = getSubjectStatus(subject.id)
                    const subjectColor = subjectColors[subject.id as keyof typeof subjectColors] || ""

                    return (
                      <div
                        key={subject.id}
                        className={cn(
                          "bg-gradient-to-r border-2 rounded-lg p-3 transition-all duration-300 hover:shadow-md",
                          subjectColor,
                          status === "active" ? "ring-2 ring-primary ring-offset-2" : "",
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 font-medium">
                              <span className="text-xl">{subject.icon}</span>
                              {subject.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subject.time}</div>
                          </div>

                          {status === "completed" ? (
                            <Badge className="bg-green-500/10 text-green-500 border-green-500/20 rounded-full px-3">
                              <CheckCircle2 className="h-3 w-3 mr-1" /> On Time
                            </Badge>
                          ) : status === "active" ? (
                            <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 rounded-full px-3">
                              <Clock3 className="h-3 w-3 mr-1" /> In Progress
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-amber-500/10 text-amber-500 border-amber-500/20 rounded-full px-3"
                            >
                              <Clock className="h-3 w-3 mr-1" /> Upcoming
                            </Badge>
                          )}
                        </div>

                        <div className="mt-3">
                          {status === "active" ? (
                            <Button
                              onClick={() => handleCheckOut(subject.id)}
                              className="w-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:shadow-lg"
                            >
                              Check Out
                            </Button>
                          ) : status === "completed" ? (
                            <Button variant="outline" className="w-full rounded-full" disabled>
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                              Checked Out
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleCheckIn(subject.id)}
                              variant="outline"
                              className="w-full rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/20 hover:from-purple-200 hover:to-blue-200 dark:hover:from-purple-800/40 dark:hover:to-blue-800/20 border-purple-200 dark:border-purple-800 transition-all duration-300 hover:shadow-md"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Check In
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay when panel is open */}
      {activePanel && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={closePanel}
          aria-hidden="true"
        ></div>
      )}
    </TooltipProvider>
  )
}
