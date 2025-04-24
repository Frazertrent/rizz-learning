"use client"

import React from "react"
import Link from "next/link"
import { CheckCircle, Calendar, ArrowLeft, MessageSquare, CalendarClock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/hooks/use-toast"

export default function ScienceFeedbackPage() {
  const [acknowledged, setAcknowledged] = React.useState(false)
  const [completed, setCompleted] = React.useState(false)

  const handleAcknowledge = () => {
    setAcknowledged(!acknowledged)
    if (!acknowledged) {
      toast({
        title: "Feedback acknowledged!",
        description: "The mentor has been notified that you've reviewed this feedback.",
      })
    }
  }

  const handleCompleted = () => {
    setCompleted(!completed)
    if (!completed) {
      toast({
        title: "Revision marked as completed!",
        description: "The mentor will be notified that the revision has been completed.",
      })
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/parent/students"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 group transition-all duration-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Students</span>
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl mr-4 shadow-lg animate-bounce-subtle">
              🧪
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                Feedback: Science
              </h1>
              <div className="flex items-center text-gray-500 mt-1">
                <CalendarClock className="h-4 w-4 mr-1" />
                <span className="text-sm">Provided on April 18, 2025 at 2:15 PM</span>
              </div>
            </div>
          </div>

          <Button
            asChild
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
          >
            <Link href="/student/assignments">View Assignment</Link>
          </Button>
        </div>
      </div>

      {/* Issue Summary Card */}
      <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Attention Needed
            </span>
            <h2 className="text-xl font-semibold text-orange-800 ml-3">Lab report needs revision</h2>
          </div>
        </div>

        <Tabs defaultValue="feedback" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="feedback">Current Feedback</TabsTrigger>
            <TabsTrigger value="history">Feedback History</TabsTrigger>
          </TabsList>

          <TabsContent value="feedback" className="space-y-4">
            <div className="bg-blue-50 rounded-xl p-6 relative">
              <div className="absolute right-4 top-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Mentor Feedback
              </div>

              <div className="flex mt-2">
                <div className="bg-blue-600 rounded-full p-2 mr-4 self-start">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div className="text-gray-700">
                  <p className="mb-3">
                    The hypothesis section is incomplete. Please add more detail about what you expected to happen and
                    why. The data collection is excellent, but the conclusion needs to connect back to your original
                    hypothesis.
                  </p>
                  <p className="mb-3">Specifically, I'd like to see:</p>
                  <ul className="list-disc pl-5 mb-3 space-y-1">
                    <li>A clearer statement of what you predicted would happen</li>
                    <li>The scientific reasoning behind your prediction</li>
                    <li>
                      In the conclusion, an explicit statement about whether your results supported your hypothesis
                    </li>
                    <li>An explanation of why the results did or did not match your expectations</li>
                  </ul>
                  <p>
                    The experimental procedure and data collection were very well done. Once these revisions are
                    complete, this will be an excellent lab report.
                  </p>
                </div>
              </div>
            </div>

            {/* What to do next section */}
            <div className="bg-green-50 border border-green-100 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">What to do next:</h3>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                <li>Review the feedback with your student</li>
                <li>Help them revise the hypothesis section with more detail</li>
                <li>Ensure the conclusion connects back to the original hypothesis</li>
                <li>Have your student resubmit the revised lab report</li>
                <li>Mark the revision as completed using the toggle below</li>
              </ol>
            </div>

            {/* Action Toggles */}
            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border shadow-sm">
                <div className="flex items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <CheckCircle className={`h-6 w-6 mr-3 ${acknowledged ? "text-green-500" : "text-gray-300"}`} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Let the mentor know you've seen this feedback</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div>
                    <h4 className="font-medium">I've reviewed this feedback</h4>
                    <p className="text-sm text-gray-500">This notifies the mentor that you've seen their comments</p>
                  </div>
                </div>
                <Switch
                  checked={acknowledged}
                  onCheckedChange={handleAcknowledge}
                  className={`${acknowledged ? "bg-green-500" : "bg-gray-200"}`}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-xl border shadow-sm">
                <div className="flex items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Calendar className={`h-6 w-6 mr-3 ${completed ? "text-green-500" : "text-gray-300"}`} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Mark when your student has completed the revision</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div>
                    <h4 className="font-medium">Revision has been completed</h4>
                    <p className="text-sm text-gray-500">Toggle this when your student has resubmitted the work</p>
                  </div>
                </div>
                <Switch
                  checked={completed}
                  onCheckedChange={handleCompleted}
                  className={`${completed ? "bg-green-500" : "bg-gray-200"}`}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <h3 className="text-lg font-medium text-gray-500">No previous feedback for this assignment</h3>
              <p className="text-gray-400 mt-2">This is the first feedback provided for this lab report</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mt-8">
        <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
          Request Clarification
        </Button>
        <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
          Schedule Review Session
        </Button>
        <Button asChild variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50 ml-auto">
          <Link href="/parent/students">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
