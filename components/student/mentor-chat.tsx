"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Search, Sparkles, X, Send, Beaker, Paperclip, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function MentorChat() {
  const [message, setMessage] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedTask, setSelectedTask] = useState("")
  const [selectedSupportType, setSelectedSupportType] = useState("")
  const [selectedSupportStrategy, setSelectedSupportStrategy] = useState("")
  const [showContextBanner, setShowContextBanner] = useState(false)
  const [showUploadHelper, setShowUploadHelper] = useState(false)
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      content: "Hi there! I'm your AI Learning Assistant. How can I help you with your studies today?",
    },
  ])

  // Mock data for dropdowns
  const classes = ["Math", "Science", "History", "English", "Art"]
  const types = [
    "Assignment",
    "Test or Quiz",
    "Essay or Report",
    "Project or Display",
    "Presentation",
    "Long-Term Project",
  ]

  const tasks = {
    Math: {
      Assignment: ["Algebra Homework", "Geometry Practice", "Calculus Problems"],
      "Test or Quiz": ["Midterm Review", "Final Exam Prep", "Chapter 5 Quiz"],
      "Project or Display": ["Math Portfolio", "Data Analysis Project", "Geometry Model"],
    },
    Science: {
      Assignment: ["Lab Report", "Chemistry Worksheet", "Biology Questions"],
      "Test or Quiz": ["Unit Test Review", "Lab Practical Prep", "Physics Quiz"],
      "Essay or Report": ["Research Paper", "Lab Analysis", "Scientific Method Essay"],
      "Project or Display": ["Science Fair", "Ecosystem Model", "Periodic Table Project"],
    },
    History: {
      "Essay or Report": ["Civil War Essay", "Ancient Civilizations Report", "Historical Figure Biography"],
      Presentation: ["World War II Presentation", "Cultural History Slides", "Historical Timeline"],
      "Long-Term Project": ["Historical Research Project", "Museum Exhibit Design", "Oral History Collection"],
    },
    English: {
      "Essay or Report": ["Literary Analysis", "Book Report", "Persuasive Essay"],
      Assignment: ["Grammar Worksheet", "Vocabulary Practice", "Reading Comprehension"],
      "Long-Term Project": ["Novel Writing", "Poetry Collection", "Research Paper"],
    },
    Art: {
      "Project or Display": ["Portfolio Development", "Mixed Media Project", "Digital Art Creation"],
      Presentation: ["Artist Study", "Art History Timeline", "Technique Demonstration"],
    },
  }

  // Support type categories
  const supportTypes = [
    "📚 Study & Practice",
    "✍️ Writing & Reports",
    "📐 Assignments & Worksheets",
    "🎨 Projects & Presentations",
    "📆 Planning & Time Management",
    "💡 General Help & Exploration",
  ]

  // Support strategies organized by support type
  const supportStrategies = {
    "📚 Study & Practice": [
      "Quiz me on this topic",
      "Practice long-answer responses",
      "Show me flashcards",
      "Give me sample multiple-choice questions",
      "Walk me through problems",
      "Explain this in a simple way",
      "Teach me this topic from scratch",
      "Give me memory tricks",
    ],
    "✍️ Writing & Reports": [
      "Help brainstorm ideas",
      "Build an outline",
      "Suggest sentence starters",
      "Write a sample introduction",
      "Improve my writing",
      "Check grammar and clarity",
      "Turn my notes into a paragraph",
      "Help me write a conclusion",
      "Explain how to cite sources",
    ],
    "📐 Assignments & Worksheets": [
      "Walk me through this worksheet",
      "Show me how to solve a problem",
      "Check if my answer is right",
      "Give me a worked-out example",
      "Help me do this faster",
    ],
    "🎨 Projects & Presentations": [
      "Help plan this project",
      "Suggest visuals or formats",
      "Organize my thoughts",
      "Outline my presentation slides",
      "Help write what I should say",
    ],
    "📆 Planning & Time Management": [
      "Break this into steps",
      "Make me a timeline",
      "What should I do first?",
      "Give me a weekly plan",
      "Help me stay on track",
    ],
    "💡 General Help & Exploration": [
      "I don't know what I need — guide me",
      "Just ask a question",
      "Give me a random helpful tip",
      "Help me study in a fun way",
    ],
  }

  // Mock function to check if source material exists
  const hasSourceMaterial = (classname, taskType, task) => {
    // This would be replaced with actual logic to check if the student has uploaded material
    // For demo purposes, we'll just return false to show the upload helper
    return false
  }

  const handleSendMessage = () => {
    if (!message.trim()) return

    // Add user message to chat
    setChatHistory([...chatHistory, { role: "user", content: message }])

    // Simulate AI response
    setTimeout(() => {
      let response = "I understand you're asking about "

      if (selectedClass && selectedType && selectedTask && selectedSupportType && selectedSupportStrategy) {
        response += `your ${selectedType.toLowerCase()} on ${selectedTask} for ${selectedClass}. You'd like me to "${selectedSupportStrategy}" (${selectedSupportType.replace(/^[^ ]+ /, "")}). `

        // Customize response based on support strategy
        if (selectedSupportStrategy.includes("Quiz")) {
          response +=
            "Let's start with a practice question: What is the main concept you need to understand for this topic?"
        } else if (selectedSupportStrategy.includes("outline")) {
          response +=
            "Here's a suggested outline structure for your work:\n\n1. Introduction\n   - Hook/attention grabber\n   - Background information\n   - Thesis statement\n\n2. Main Point 1\n   - Supporting evidence\n   - Example\n\n3. Main Point 2\n   - Supporting evidence\n   - Example"
        } else if (selectedSupportStrategy.includes("example")) {
          response += "Here's a worked example that should help you understand the process..."
        } else {
          response += "I'm here to help you with that! Let's break this down step by step..."
        }
      } else {
        response += "a general topic. How can I help you learn more about this?"
      }

      setChatHistory((prev) => [...prev, { role: "assistant", content: response }])
    }, 1000)

    setMessage("")
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setChatHistory([
      {
        role: "assistant",
        content: "Chat cleared! How can I help you with your learning today?",
      },
    ])
  }

  // Reset support strategy when support type changes
  useEffect(() => {
    setSelectedSupportStrategy("")
  }, [selectedSupportType])

  useEffect(() => {
    // Check if all dropdowns are filled to show context banner
    if (selectedClass && selectedType && selectedTask && selectedSupportType && selectedSupportStrategy) {
      setShowContextBanner(true)

      // Add system message about context if this is a new selection
      const contextMessage = `💡 Context set: ${selectedClass} → ${selectedType} → ${selectedTask} → ${selectedSupportType.replace(/^[^ ]+ /, "")} → "${selectedSupportStrategy}"`

      // Check if the last message is already a system message about context
      const lastMessage = chatHistory[chatHistory.length - 1]
      if (lastMessage.role !== "system" || !lastMessage.content.startsWith("💡 Context set:")) {
        setChatHistory((prev) => [
          ...prev,
          {
            role: "system",
            content: contextMessage,
          },
        ])
      }
    } else {
      setShowContextBanner(false)
    }

    // Check if we should show the upload helper
    if (selectedClass && selectedType && selectedTask) {
      const hasMaterial = hasSourceMaterial(selectedClass, selectedType, selectedTask)
      setShowUploadHelper(!hasMaterial)
    } else {
      setShowUploadHelper(false)
    }
  }, [selectedClass, selectedType, selectedTask, selectedSupportType, selectedSupportStrategy])

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-6 h-[calc(100vh-200px)]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">💬 GPT Learning Assistant</h1>
            <p className="text-muted-foreground">
              Ask questions, get assignment help, or explore topics — with your AI learning guide.
            </p>
          </div>
          <div className="flex gap-2">
            <Button>
              <Beaker className="mr-2 h-4 w-4" />
              Study Mode
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1">
          <Card className="md:col-span-1 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-0">
            <CardHeader>
              <CardTitle className="text-xl">What Do You Need Help With Today?</CardTitle>
              <CardDescription>Choose your class, task type, and what kind of help you'd like.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <span className="text-base">📘</span> Class
                </label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <span className="text-base">📂</span> Type of Task
                </label>
                <Select value={selectedType} onValueChange={setSelectedType} disabled={!selectedClass}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <span className="text-base">📝</span> Specific Task
                </label>
                <Select value={selectedTask} onValueChange={setSelectedTask} disabled={!selectedClass || !selectedType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a task" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedClass &&
                      selectedType &&
                      tasks[selectedClass]?.[selectedType]?.map((task) => (
                        <SelectItem key={task} value={task}>
                          {task}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <span className="text-base">🤖</span> What Kind of Help Do You Want?
                </label>
                <Select
                  value={selectedSupportType}
                  onValueChange={setSelectedSupportType}
                  disabled={!selectedClass || !selectedType || !selectedTask}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a support type" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div
                className={cn(
                  "space-y-2 transition-all duration-300",
                  selectedSupportType
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-4 pointer-events-none h-0",
                )}
              >
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <span className="text-base">🎯</span> How should GPT help?
                </label>
                <Select
                  value={selectedSupportStrategy}
                  onValueChange={setSelectedSupportStrategy}
                  disabled={!selectedSupportType}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a support strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedSupportType &&
                      supportStrategies[selectedSupportType]?.map((strategy) => (
                        <SelectItem key={strategy} value={strategy}>
                          {strategy}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {!selectedClass && (
                <div className="mt-4 text-center p-3 bg-blue-500/10 rounded-lg">
                  <p className="text-sm">You can still ask anything without selecting options!</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-3 flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 bg-gradient-to-r from-indigo-500 to-purple-500">
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <CardTitle>💬 Chat with Your AI Tutor</CardTitle>
                </div>
                <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Powered
                </Badge>
              </div>
              <CardDescription>Powered by GPT — your learning assistant.</CardDescription>
            </CardHeader>

            {showContextBanner && (
              <div className="mx-4 my-2 p-3 bg-blue-500/10 rounded-lg flex items-center justify-between">
                <p className="text-sm">
                  💡 You're asking about: {selectedClass} → {selectedType} → {selectedTask} →{" "}
                  {selectedSupportType.replace(/^[^ ]+ /, "")} → "{selectedSupportStrategy}"
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => {
                    setSelectedClass("")
                    setSelectedType("")
                    setSelectedTask("")
                    setSelectedSupportType("")
                    setSelectedSupportStrategy("")
                    setShowContextBanner(false)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <Tabs defaultValue="chat" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="history">
                  <Search className="mr-2 h-4 w-4" />
                  History
                </TabsTrigger>
              </TabsList>
              <TabsContent value="chat" className="flex-1 flex flex-col">
                <CardContent className="flex-1 overflow-auto p-4 space-y-4">
                  {chatHistory.map((msg, index) => {
                    if (msg.role === "system") {
                      return (
                        <div key={index} className="bg-blue-500/10 p-3 rounded-lg text-center text-sm">
                          {msg.content}
                        </div>
                      )
                    }

                    return msg.role === "user" ? (
                      <div key={index} className="flex gap-3 justify-end">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-lg text-white max-w-[80%]">
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        <Avatar className="h-8 w-8 bg-indigo-100">
                          <AvatarFallback>ME</AvatarFallback>
                        </Avatar>
                      </div>
                    ) : (
                      <div key={index} className="flex gap-3">
                        <Avatar className="h-8 w-8 bg-gradient-to-r from-indigo-500 to-purple-500">
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                        <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                          <div className="flex items-center gap-1 mb-1">
                            <Sparkles className="h-3 w-3 text-purple-500" />
                            <span className="text-xs font-medium text-purple-500">AI Tutor</span>
                          </div>
                          <p className="text-sm whitespace-pre-line">{msg.content}</p>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>

                {showUploadHelper && (
                  <div className="mx-4 mb-4 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Paperclip className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">📎 Tip: Want GPT to give better answers?</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Upload your class notes, assignment sheets, or textbook pages so GPT knows exactly what you're
                          working with.
                        </p>
                        <Button asChild size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600">
                          <Link href="/student/uploads">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Material Now
                          </Link>
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 -mt-1 -mr-1"
                        onClick={() => setShowUploadHelper(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <CardFooter className="border-t p-4">
                  <div className="flex items-end gap-2 w-full">
                    <Textarea
                      placeholder="🧠 Ask a question, get ideas, or explain something..."
                      className="min-h-[80px] flex-1"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <div className="flex flex-col gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={clearChat}
                        className="bg-red-500/10 hover:bg-red-500/20 border-red-500/20"
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                      <Button
                        size="icon"
                        onClick={handleSendMessage}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </TabsContent>
              <TabsContent value="history" className="flex-1">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="search"
                        placeholder="Search conversations..."
                        className="w-full pl-8 pr-4 py-2 rounded-md border border-input bg-background"
                      />
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Recent Conversations</p>
                      {[1, 2, 3].map((item) => (
                        <Card key={item} className="p-3 hover:bg-accent cursor-pointer">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm">Science: Photosynthesis</p>
                              <p className="text-xs text-muted-foreground">Today, 9:30 AM</p>
                            </div>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                              Active
                            </Badge>
                          </div>
                        </Card>
                      ))}

                      <p className="text-sm font-medium mt-4">Past Conversations</p>
                      {[1, 2, 3].map((item) => (
                        <Card key={item} className="p-3 hover:bg-accent cursor-pointer">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm">Math: Quadratic Equations</p>
                              <p className="text-xs text-muted-foreground">April 15, 2025</p>
                            </div>
                            <Badge variant="outline">Closed</Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default MentorChat
