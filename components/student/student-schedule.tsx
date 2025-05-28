"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, FileText, List, PlusCircle, Edit, Trash2, Info, X, Upload, MessageSquare, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock data for schedule
const weeklySchedule = [
  {
    day: "Monday",
    blocks: [
      { time: "8:00 AM - 9:30 AM", subject: "Math", topic: "Algebra: Quadratic Equations", type: "Lesson" },
      { time: "9:45 AM - 11:15 AM", subject: "Science", topic: "Biology: Cell Structure", type: "Lab" },
      { time: "12:00 PM - 1:30 PM", subject: "English", topic: "Essay Writing: Thesis Development", type: "Workshop" },
      { time: "2:00 PM - 3:00 PM", subject: "History", topic: "World War II: Pacific Theater", type: "Reading" },
    ],
  },
  {
    day: "Tuesday",
    blocks: [
      { time: "8:00 AM - 9:30 AM", subject: "Language", topic: "Spanish: Verb Conjugation", type: "Practice" },
      { time: "9:45 AM - 11:15 AM", subject: "Art", topic: "Watercolor Techniques", type: "Studio" },
      { time: "12:00 PM - 1:30 PM", subject: "Math", topic: "Algebra: Word Problems", type: "Practice" },
      { time: "2:00 PM - 3:00 PM", subject: "Science", topic: "Biology: Microscope Lab", type: "Experiment" },
    ],
  },
  {
    day: "Wednesday",
    blocks: [
      { time: "8:00 AM - 9:30 AM", subject: "History", topic: "Ancient Civilizations: Egypt", type: "Lesson" },
      { time: "9:45 AM - 11:15 AM", subject: "English", topic: "Literature: Shakespeare", type: "Discussion" },
      { time: "12:00 PM - 1:30 PM", subject: "Coding", topic: "JavaScript Basics", type: "Project" },
      { time: "2:00 PM - 3:00 PM", subject: "Physical Ed", topic: "Team Sports", type: "Activity" },
    ],
  },
  {
    day: "Thursday",
    blocks: [
      { time: "8:00 AM - 9:30 AM", subject: "Math", topic: "Geometry: Triangles", type: "Lesson" },
      { time: "9:45 AM - 11:15 AM", subject: "Science", topic: "Chemistry: Elements", type: "Lesson" },
      { time: "12:00 PM - 1:30 PM", subject: "Music", topic: "Piano Practice", type: "Lesson" },
      { time: "2:00 PM - 3:00 PM", subject: "Language", topic: "Spanish: Conversation", type: "Practice" },
    ],
  },
  {
    day: "Friday",
    blocks: [
      { time: "8:00 AM - 9:30 AM", subject: "English", topic: "Creative Writing", type: "Workshop" },
      { time: "9:45 AM - 11:15 AM", subject: "History", topic: "American Revolution", type: "Project" },
      { time: "12:00 PM - 1:30 PM", subject: "Science", topic: "Physics: Motion", type: "Lab" },
      { time: "2:00 PM - 3:00 PM", subject: "Study Hall", topic: "Weekly Review", type: "Independent" },
    ],
  },
]

// Subject colors
const subjectColors: Record<string, string> = {
  Math: "bg-blue-100 border-blue-300 text-blue-800",
  Science: "bg-green-100 border-green-300 text-green-800",
  English: "bg-purple-100 border-purple-300 text-purple-800",
  History: "bg-amber-100 border-amber-300 text-amber-800",
  Language: "bg-pink-100 border-pink-300 text-pink-800",
  Art: "bg-rose-100 border-rose-300 text-rose-800",
  Music: "bg-indigo-100 border-indigo-300 text-indigo-800",
  Coding: "bg-cyan-100 border-cyan-300 text-cyan-800",
  "Physical Ed": "bg-orange-100 border-orange-300 text-orange-800",
  "Study Hall": "bg-slate-100 border-slate-300 text-slate-800",
  // Student-created event colors
  Assignment: "bg-violet-100 border-violet-300 text-violet-800 border-2",
  Class: "bg-emerald-100 border-emerald-300 text-emerald-800 border-2",
  Activity: "bg-yellow-100 border-yellow-300 text-yellow-800 border-2",
  Reminder: "bg-red-100 border-red-300 text-red-800 border-2",
}

// Button colors for action bar
const actionButtonColors: Record<string, string> = {
  details: "bg-blue-500 hover:bg-blue-600 text-white",
  upload: "bg-pink-500 hover:bg-pink-600 text-white",
  chat: "bg-purple-500 hover:bg-purple-600 text-white",
}

// Time options for the event modal
const timeOptions = [
  "7:00 AM",
  "7:30 AM",
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
]

// Day options for the activity modal
const dayOptions = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
  { id: "weekdays", label: "Weekdays" },
  { id: "weekend", label: "Weekend" },
  { id: "daily", label: "Daily" },
]

// Mock study goals data
const initialStudyGoals = [
  { id: 1, title: "Complete Math Unit", progress: "75% Done", status: "active" },
  { id: 2, title: "Read 3 Chapters", progress: "33% Done", status: "active" },
  { id: 3, title: "Finish Science Project", progress: "50% Done", status: "active" },
]

// Mock free time activities data
const initialFreeTimeActivities = [
  { id: 1, title: "Piano Practice", time: "30 mins", days: ["Daily"], status: "active" },
  { id: 2, title: "Coding Club", time: "1 hour", days: ["Thursday"], status: "active" },
  { id: 3, title: "Art Project", time: "2 hours", days: ["Weekend"], status: "active" },
]

export function StudentSchedule() {
  const [currentView, setCurrentView] = useState("weekly")
  const [currentWeek, setCurrentWeek] = useState("This Week")
  const [showAddEventModal, setShowAddEventModal] = useState(false)
  const [showAddActivityModal, setShowAddActivityModal] = useState(false)
  const [showEditGoalDialog, setShowEditGoalDialog] = useState(false)
  const [showDeleteGoalDialog, setShowDeleteGoalDialog] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<{
    id: number
    title: string
    progress: string
    status: string
  } | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<{
    id: number
    title: string
    time: string
    days: string[]
    status: string
  } | null>(null)
  const [studyGoals, setStudyGoals] = useState(initialStudyGoals)
  const [freeTimeActivities, setFreeTimeActivities] = useState(initialFreeTimeActivities)

  // New event form state
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "8:00 AM",
    endTime: "9:00 AM",
    type: "Assignment",
    day: "Monday",
  })

  // New activity form state
  const [newActivity, setNewActivity] = useState({
    title: "",
    days: [] as string[],
    time: "30 mins",
    description: "",
  })

  // New goal form state
  const [editedGoal, setEditedGoal] = useState({
    title: "",
    progress: "",
  })

  // Handle adding a new event
  const handleAddEvent = () => {
    // In a real app, this would send data to the backend
    // For now, we'll just close the modal and show a success message
    setShowAddEventModal(false)

    // Reset form
    setNewEvent({
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      startTime: "8:00 AM",
      endTime: "9:00 AM",
      type: "Assignment",
      day: "Monday",
    })

    // Show success message or update UI
    alert("Event added! (In a real app, this would be added to your schedule)")
  }

  // Handle day selection for activity
  const handleDaySelection = (day: string) => {
    // If "Daily" is selected, clear all other selections
    if (day === "Daily") {
      setNewActivity({ ...newActivity, days: ["Daily"] })
      return
    }

    // If any other day is selected, remove "Daily" if it's in the array
    let updatedDays = [...newActivity.days]

    // If the day is already selected, remove it
    if (updatedDays.includes(day)) {
      updatedDays = updatedDays.filter((d) => d !== day)
    } else {
      // Otherwise add it and remove "Daily" if present
      updatedDays = updatedDays.filter((d) => d !== "Daily")
      updatedDays.push(day)
    }

    setNewActivity({ ...newActivity, days: updatedDays })
  }

  // Remove a day from selection
  const removeDayFromSelection = (day: string) => {
    const updatedDays = newActivity.days.filter((d) => d !== day)
    setNewActivity({ ...newActivity, days: updatedDays })
  }

  // Handle adding a new activity
  const handleAddActivity = () => {
    const newActivityItem = {
      id: freeTimeActivities.length + 1,
      title: newActivity.title,
      time: newActivity.time,
      days: newActivity.days,
      status: "pending", // Mark as pending parent approval
    }

    setFreeTimeActivities([...freeTimeActivities, newActivityItem])
    setShowAddActivityModal(false)

    // Reset form
    setNewActivity({
      title: "",
      days: [],
      time: "30 mins",
      description: "",
    })
  }

  // Handle editing a study goal
  const handleEditGoal = () => {
    if (!selectedGoal) return

    const updatedGoals = studyGoals.map((goal) =>
      goal.id === selectedGoal.id
        ? { ...goal, title: editedGoal.title, status: "pending" } // Mark as pending parent approval
        : goal,
    )

    setStudyGoals(updatedGoals)
    setShowEditGoalDialog(false)
    setSelectedGoal(null)
  }

  // Handle deleting a study goal
  const handleDeleteGoal = () => {
    if (!selectedGoal) return

    // In a real app, we might not actually delete it but mark it for deletion pending approval
    const updatedGoals = studyGoals.map((goal) =>
      goal.id === selectedGoal.id
        ? { ...goal, status: "pending-deletion" } // Mark as pending deletion
        : goal,
    )

    setStudyGoals(updatedGoals)
    setShowDeleteGoalDialog(false)
    setSelectedGoal(null)
  }

  // Action bar component for class blocks
  const ClassActionBar = ({ subject }: { subject: string }) => (
    <TooltipProvider>
      <div className="flex justify-between mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              className={`h-7 w-7 rounded-full ${actionButtonColors.details} transform transition-transform hover:scale-110`}
              asChild
            >
              <Link href={`/student/assignments?subject=${subject}`}>
                <Eye className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>View Details</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              className={`h-7 w-7 rounded-full ${actionButtonColors.upload} transform transition-transform hover:scale-110`}
              asChild
            >
              <Link href={`/student/uploads?subject=${subject}`}>
                <Upload className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Upload Work</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              className={`h-7 w-7 rounded-full ${actionButtonColors.chat} transform transition-transform hover:scale-110`}
              asChild
            >
              <Link href={`/student/chat?subject=${subject}`}>
                <MessageSquare className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Ask GPT Mentor</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Your Schedule</h1>
            <p className="text-blue-100 mt-1">Plan your day and stay on track with your learning</p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button variant="secondary" size="sm" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <Link href="/student/assignments">Assignments</Link>
            </Button>
            <Dialog open={showAddEventModal} onOpenChange={setShowAddEventModal}>
              <DialogTrigger asChild>
                <Button variant="secondary" size="sm" className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                  <DialogDescription>
                    Create a new event for your schedule. All events will be visible to your parents.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="event-title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="event-title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="col-span-3"
                      placeholder="Math Study Group"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="event-description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="event-description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      className="col-span-3"
                      placeholder="Study for upcoming test with friends"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="event-day" className="text-right">
                      Day
                    </Label>
                    <Select value={newEvent.day} onValueChange={(value) => setNewEvent({ ...newEvent, day: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Monday">Monday</SelectItem>
                        <SelectItem value="Tuesday">Tuesday</SelectItem>
                        <SelectItem value="Wednesday">Wednesday</SelectItem>
                        <SelectItem value="Thursday">Thursday</SelectItem>
                        <SelectItem value="Friday">Friday</SelectItem>
                        <SelectItem value="Saturday">Saturday</SelectItem>
                        <SelectItem value="Sunday">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="event-start-time" className="text-right">
                      Start Time
                    </Label>
                    <Select
                      value={newEvent.startTime}
                      onValueChange={(value) => setNewEvent({ ...newEvent, startTime: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select start time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="event-end-time" className="text-right">
                      End Time
                    </Label>
                    <Select
                      value={newEvent.endTime}
                      onValueChange={(value) => setNewEvent({ ...newEvent, endTime: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select end time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="event-type" className="text-right">
                      Type
                    </Label>
                    <RadioGroup
                      value={newEvent.type}
                      onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}
                      className="col-span-3 flex flex-wrap gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Assignment" id="assignment" />
                        <Label htmlFor="assignment" className="cursor-pointer">
                          Assignment
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Class" id="class" />
                        <Label htmlFor="class" className="cursor-pointer">
                          Class
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Activity" id="activity" />
                        <Label htmlFor="activity" className="cursor-pointer">
                          Activity
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Reminder" id="reminder" />
                        <Label htmlFor="reminder" className="cursor-pointer">
                          Reminder
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Color Preview</Label>
                    <div className={`col-span-3 p-3 rounded-lg border-2 ${subjectColors[newEvent.type]}`}>
                      {newEvent.title || "Event Preview"}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddEventModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddEvent}>Add Event</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* View Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <Tabs defaultValue="weekly" className="w-full md:w-auto" onValueChange={setCurrentView}>
          <TabsList className="grid w-full md:w-[250px] grid-cols-2">
            <TabsTrigger value="daily" className="flex items-center gap-1">
              <List className="h-4 w-4" />
              Daily
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Weekly
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex w-full md:w-auto justify-end">
          <Select value={currentWeek} onValueChange={setCurrentWeek}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select Week" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Last Week">Last Week</SelectItem>
              <SelectItem value="This Week">This Week</SelectItem>
              <SelectItem value="Next Week">Next Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Schedule Content */}
      <Tabs defaultValue="weekly" value={currentView} className="w-full">
        <TabsContent value="daily" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Monday, April 16</CardTitle>
              <CardDescription>Your schedule for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklySchedule[0].blocks.map((block, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="md:w-1/4">
                      <div className="text-sm font-medium text-gray-500">{block.time}</div>
                    </div>
                    <div className="md:w-3/4">
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${subjectColors[block.subject]}`}
                      >
                        {block.subject}
                      </div>
                      <div className="text-lg font-medium">{block.topic}</div>
                      <div className="flex items-center mt-2">
                        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {block.type}
                        </span>
                      </div>

                      {/* Action Bar for Daily View */}
                      <ClassActionBar subject={block.subject} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {weeklySchedule.map((day, dayIndex) => (
              <Card key={dayIndex} className={dayIndex === 0 ? "border-blue-400 shadow-md" : ""}>
                <CardHeader className={dayIndex === 0 ? "bg-blue-50 rounded-t-lg" : ""}>
                  <CardTitle className="text-lg">{day.day}</CardTitle>
                  <CardDescription>{dayIndex === 0 ? "Today" : "April " + (17 + dayIndex)}</CardDescription>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="space-y-3">
                    {day.blocks.map((block, blockIndex) => (
                      <div
                        key={blockIndex}
                        className={`p-3 rounded-lg border ${subjectColors[block.subject]} hover:shadow-md transition-all cursor-pointer`}
                      >
                        <div className="text-xs font-medium">{block.time}</div>
                        <div className="font-semibold mt-1">{block.topic}</div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs">{block.type}</span>
                        </div>

                        {/* Action Bar for Weekly View */}
                        <ClassActionBar subject={block.subject} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Links */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-800 hover:text-white group transition-colors">
                <span>Math Quiz: Quadratics</span>
                <span className="text-sm text-gray-500 group-hover:text-gray-300">Due Tomorrow</span>
              </li>
              <li className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-800 hover:text-white group transition-colors">
                <span>Science Lab Report</span>
                <span className="text-sm text-gray-500 group-hover:text-gray-300">Due Apr 19</span>
              </li>
              <li className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-800 hover:text-white group transition-colors">
                <span>History Essay</span>
                <span className="text-sm text-gray-500 group-hover:text-gray-300">Due Apr 22</span>
              </li>
            </ul>
            <Button variant="ghost" size="sm" className="w-full mt-2">
              <Link href="/student/assignments" className="flex items-center justify-center gap-1 w-full">
                <FileText className="h-4 w-4" />
                View All Assignments
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row justify-between items-center">
            <CardTitle className="text-lg">Study Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {studyGoals.map((goal) => (
                <li
                  key={goal.id}
                  className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-800 hover:text-white group relative transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="flex items-center">
                      {goal.title}
                      {goal.status === "pending" && (
                        <Badge
                          variant="outline"
                          className="ml-2 text-xs bg-yellow-50 text-yellow-800 border-yellow-300"
                        >
                          Pending Approval
                        </Badge>
                      )}
                      {goal.status === "pending-deletion" && (
                        <Badge variant="outline" className="ml-2 text-xs bg-red-50 text-red-800 border-red-300">
                          Pending Deletion
                        </Badge>
                      )}
                    </span>
                    <span className="text-sm text-gray-500 group-hover:text-gray-300">{goal.progress}</span>
                  </div>
                  {/* Updated hover controls with dark background */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 top-0 h-full flex items-center pr-2">
                    <div className="bg-gray-900 bg-opacity-95 rounded-md p-1 flex gap-1 shadow-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-amber-400 hover:text-amber-300 hover:bg-gray-800"
                        onClick={() => {
                          setSelectedGoal(goal)
                          setEditedGoal({ title: goal.title, progress: goal.progress })
                          setShowEditGoalDialog(true)
                        }}
                        disabled={goal.status !== "active"}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-gray-800"
                        onClick={() => {
                          setSelectedGoal(goal)
                          setShowDeleteGoalDialog(true)
                        }}
                        disabled={goal.status !== "active"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <Button variant="ghost" size="sm" className="w-full mt-2">
              <Link href="/student/goals" className="flex items-center justify-center gap-1 w-full">
                <PlusCircle className="h-4 w-4" />
                View All Goals
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Free Time Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {freeTimeActivities.map((activity) => (
                <li
                  key={activity.id}
                  className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-800 hover:text-white group transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="flex items-center">
                      {activity.title}
                      {activity.status === "pending" && (
                        <Badge
                          variant="outline"
                          className="ml-2 text-xs bg-yellow-50 text-yellow-800 border-yellow-300"
                        >
                          Pending Approval
                        </Badge>
                      )}
                    </span>
                    <span className="text-sm text-gray-500 group-hover:text-gray-300">
                      {activity.days.join(", ")} • {activity.time}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <Dialog open={showAddActivityModal} onOpenChange={setShowAddActivityModal}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full mt-2">
                  <div className="flex items-center justify-center gap-1 w-full">
                    <PlusCircle className="h-4 w-4" />
                    Add Activity
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Free Time Activity</DialogTitle>
                  <DialogDescription>
                    Add a new free time activity to your schedule. This will need parent approval before being added.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="activity-title" className="text-right">
                      Activity
                    </Label>
                    <Input
                      id="activity-title"
                      value={newActivity.title}
                      onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                      className="col-span-3"
                      placeholder="Piano Practice"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right pt-2">Day/Recurrence</Label>
                    <div className="col-span-3">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {newActivity.days.map((day) => (
                          <Badge key={day} variant="secondary" className="px-2 py-1 flex items-center gap-1">
                            {day}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                              onClick={() => removeDayFromSelection(day)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <div className="border rounded-md p-3 space-y-2">
                        {dayOptions.map((day) => (
                          <div key={day.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={day.id}
                              checked={newActivity.days.includes(day.label)}
                              onCheckedChange={() => handleDaySelection(day.label)}
                              disabled={day.label !== "Daily" && newActivity.days.includes("Daily")}
                            />
                            <Label htmlFor={day.id} className="cursor-pointer text-sm">
                              {day.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {newActivity.days.length === 0 && (
                        <p className="text-xs text-muted-foreground mt-1">Please select at least one day</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="activity-time" className="text-right">
                      Time Allocation
                    </Label>
                    <Input
                      id="activity-time"
                      value={newActivity.time}
                      onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                      className="col-span-3"
                      placeholder="30 mins"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="activity-description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="activity-description"
                      value={newActivity.description}
                      onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                      className="col-span-3"
                      placeholder="Optional description"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddActivityModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddActivity} disabled={newActivity.days.length === 0 || !newActivity.title}>
                    Add Activity
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* Edit Goal Dialog */}
      <AlertDialog open={showEditGoalDialog} onOpenChange={setShowEditGoalDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Study Goal</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex items-center gap-2 mb-4 text-amber-600 bg-amber-50 p-2 rounded-md">
                <Info className="h-4 w-4" />
                All changes must be approved by a parent before taking effect.
              </div>
              Make changes to your study goal below.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="goal-title" className="text-right">
                Goal Title
              </Label>
              <Input
                id="goal-title"
                value={editedGoal.title}
                onChange={(e) => setEditedGoal({ ...editedGoal, title: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleEditGoal}>Save Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Goal Dialog */}
      <AlertDialog open={showDeleteGoalDialog} onOpenChange={setShowDeleteGoalDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Study Goal</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex items-center gap-2 mb-4 text-amber-600 bg-amber-50 p-2 rounded-md">
                <Info className="h-4 w-4" />
                All changes must be approved by a parent before taking effect.
              </div>
              Are you sure you want to delete this goal? This action will be sent to your parent for approval.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteGoal} className="bg-red-500 hover:bg-red-600">
              Delete Goal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default StudentSchedule
