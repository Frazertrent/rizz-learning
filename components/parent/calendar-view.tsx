"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CalendarIcon,
  Home,
  Users,
  MessageSquare,
  BookMarked,
  Target,
  Gift,
  Download,
  Trash2,
  Edit,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

// Navigation links
const navigationLinks = [
  { name: "Dashboard", href: "/parent", icon: <Home className="h-4 w-4" /> },
  { name: "Students", href: "/parent/students", icon: <Users className="h-4 w-4" /> },
  { name: "Feedback", href: "/parent/feedback", icon: <MessageSquare className="h-4 w-4" /> },
  { name: "Curriculum", href: "/parent/curriculum", icon: <BookMarked className="h-4 w-4" /> },
  { name: "Goals", href: "/parent/goals", icon: <Target className="h-4 w-4" /> },
  { name: "Reports", href: "/parent/reports", icon: <CalendarIcon className="h-4 w-4" /> },
  { name: "Rewards", href: "/parent/rewards", icon: <Gift className="h-4 w-4" /> },
]

// Sample event data
const eventData = [
  {
    id: 1,
    title: "Math Test",
    date: "2023-04-10",
    type: "assessment",
    color: "blue",
    description: "Algebra unit test covering chapters 5-7",
    time: "10:00 AM",
    location: "Home Study Room",
    student: "Enoch",
  },
  {
    id: 2,
    title: "Science Project Due",
    date: "2023-04-15",
    type: "deadline",
    color: "green",
    description: "Final ecosystem diorama project submission",
    time: "3:00 PM",
    location: "Home",
    student: "Enoch",
  },
  {
    id: 3,
    title: "Field Trip",
    date: "2023-04-20",
    type: "event",
    color: "purple",
    description: "Natural History Museum visit with homeschool group",
    time: "9:00 AM - 2:00 PM",
    location: "Natural History Museum",
    student: "All",
  },
  {
    id: 4,
    title: "Reading Assignment",
    date: "2023-04-05",
    type: "assignment",
    color: "amber",
    description: "Complete chapters 10-12 of 'To Kill a Mockingbird'",
    time: "Any time",
    location: "Home",
    student: "Enoch",
  },
  {
    id: 5,
    title: "Art Workshop",
    date: "2023-04-25",
    type: "event",
    color: "pink",
    description: "Watercolor techniques workshop with local artist",
    time: "1:00 PM - 3:00 PM",
    location: "Community Center",
    student: "Sarah",
  },
  {
    id: 6,
    title: "History Presentation",
    date: "2023-04-18",
    type: "assessment",
    color: "indigo",
    description: "Oral presentation on Civil War figures",
    time: "11:00 AM",
    location: "Home Study Room",
    student: "Benjamin",
  },
]

// Helper function to get days in month
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate()
}

// Helper function to get first day of month (0 = Sunday, 1 = Monday, etc.)
const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay()
}

// Helper function to format date as YYYY-MM-DD
const formatDate = (year, month, day) => {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

// Helper function to get month name
const getMonthName = (month) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  return months[month]
}

export function CalendarView() {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState(formatDate(today.getFullYear(), today.getMonth(), today.getDate()))
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [isEditEventOpen, setIsEditEventOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [events, setEvents] = useState(eventData)

  // New event form state
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: selectedDate,
    type: "event",
    color: "blue",
    description: "",
    time: "",
    location: "",
    student: "All",
  })

  // Handle month navigation
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  // Handle date selection
  const handleDateClick = (date) => {
    setSelectedDate(date)
    setNewEvent((prev) => ({ ...prev, date }))
  }

  // Handle event creation
  const handleAddEvent = () => {
    const newEventWithId = {
      ...newEvent,
      id: events.length + 1,
    }
    setEvents([...events, newEventWithId])
    setIsAddEventOpen(false)
    setNewEvent({
      title: "",
      date: selectedDate,
      type: "event",
      color: "blue",
      description: "",
      time: "",
      location: "",
      student: "All",
    })
  }

  // Handle event editing
  const handleEditEvent = () => {
    const updatedEvents = events.map((event) => (event.id === selectedEvent.id ? selectedEvent : event))
    setEvents(updatedEvents)
    setIsEditEventOpen(false)
    setSelectedEvent(null)
  }

  // Handle event deletion
  const handleDeleteEvent = (id) => {
    const updatedEvents = events.filter((event) => event.id !== id)
    setEvents(updatedEvents)
    setIsEditEventOpen(false)
    setSelectedEvent(null)
  }

  // Open edit event dialog
  const openEditEvent = (event) => {
    setSelectedEvent(event)
    setIsEditEventOpen(true)
  }

  // Get events for a specific date
  const getEventsForDate = (date) => {
    return events.filter((event) => event.date === date)
  }

  // Generate calendar days
  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth)

  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500">
            Academic Calendar
          </h2>
          <p className="text-muted-foreground">Schedule, events, deadlines, and attendance tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 transition-all hover:shadow-md">
            <Download className="h-4 w-4" />
            Export Calendar
          </Button>
          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all hover:shadow-md">
                <Plus className="h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-xl border-none shadow-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-blue-500" />
                  Add New Event
                </DialogTitle>
                <DialogDescription>
                  Create a new event, assignment, or deadline on your academic calendar.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="event-title">Event Title</Label>
                  <Input
                    id="event-title"
                    placeholder="Enter event title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="event-date">Date</Label>
                    <Input
                      id="event-date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="event-time">Time (optional)</Label>
                    <Input
                      id="event-time"
                      placeholder="e.g., 3:00 PM"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="event-type">Event Type</Label>
                    <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}>
                      <SelectTrigger id="event-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="assignment">Assignment</SelectItem>
                        <SelectItem value="assessment">Assessment</SelectItem>
                        <SelectItem value="deadline">Deadline</SelectItem>
                        <SelectItem value="holiday">Holiday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="event-color">Color</Label>
                    <Select
                      value={newEvent.color}
                      onValueChange={(value) => setNewEvent({ ...newEvent, color: value })}
                    >
                      <SelectTrigger id="event-color">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="purple">Purple</SelectItem>
                        <SelectItem value="amber">Amber</SelectItem>
                        <SelectItem value="pink">Pink</SelectItem>
                        <SelectItem value="indigo">Indigo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-student">Student</Label>
                  <Select
                    value={newEvent.student}
                    onValueChange={(value) => setNewEvent({ ...newEvent, student: value })}
                  >
                    <SelectTrigger id="event-student">
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Students</SelectItem>
                      <SelectItem value="Enoch">Enoch</SelectItem>
                      <SelectItem value="Sarah">Sarah</SelectItem>
                      <SelectItem value="Benjamin">Benjamin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-location">Location (optional)</Label>
                  <Input
                    id="event-location"
                    placeholder="Enter location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-description">Description (optional)</Label>
                  <Textarea
                    id="event-description"
                    placeholder="Enter event details"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddEvent}
                  disabled={!newEvent.title || !newEvent.date}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  Add to Calendar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Navigation Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-950/50 dark:to-gray-900/50 rounded-xl">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {navigationLinks.map((link, index) => (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 rounded-full px-4 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    {link.icon}
                    {link.name}
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="overflow-hidden border-none shadow-md bg-white dark:bg-gray-950/50 rounded-xl hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-blue-500" />
                {getMonthName(currentMonth)} {currentYear}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={goToPreviousMonth} className="h-8 w-8 rounded-full">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentMonth(today.getMonth())
                    setCurrentYear(today.getFullYear())
                  }}
                >
                  Today
                </Button>
                <Button variant="outline" size="icon" onClick={goToNextMonth} className="h-8 w-8 rounded-full">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                <div key={i} className="font-medium text-sm py-1">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, i) => {
                if (day === null) {
                  return <div key={`empty-${i}`} className="h-24 rounded-lg bg-muted/20"></div>
                }

                const date = formatDate(currentYear, currentMonth, day)
                const isToday = date === formatDate(today.getFullYear(), today.getMonth(), today.getDate())
                const isSelected = date === selectedDate
                const dayEvents = getEventsForDate(date)

                return (
                  <div
                    key={`day-${day}`}
                    className={`h-24 rounded-lg border p-1 overflow-hidden transition-all cursor-pointer hover:shadow-md ${
                      isToday
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : isSelected
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : "border-muted bg-white dark:bg-gray-900/20"
                    }`}
                    onClick={() => handleDateClick(date)}
                  >
                    <div className="flex justify-between items-start">
                      <div
                        className={`text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center ${
                          isToday ? "bg-blue-500 text-white" : isSelected ? "bg-purple-500 text-white" : ""
                        }`}
                      >
                        {day}
                      </div>
                      {dayEvents.length > 0 && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-5 px-1 text-xs">
                              {dayEvents.length}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px] rounded-xl border-none shadow-lg">
                            <DialogHeader>
                              <DialogTitle>Events on {date}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                              {dayEvents.map((event) => (
                                <div
                                  key={event.id}
                                  className={`p-3 rounded-lg border border-${event.color}-200 bg-${event.color}-50 dark:border-${event.color}-800 dark:bg-${event.color}-900/20`}
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-medium">{event.title}</h4>
                                      {event.time && <p className="text-sm text-muted-foreground">{event.time}</p>}
                                    </div>
                                    <Badge variant="outline">{event.type}</Badge>
                                  </div>
                                  {event.description && <p className="text-sm mt-2">{event.description}</p>}
                                  {event.location && (
                                    <p className="text-sm text-muted-foreground mt-1">Location: {event.location}</p>
                                  )}
                                  <div className="flex justify-between items-center mt-3">
                                    <Badge variant="secondary">{event.student}</Badge>
                                    <Button variant="outline" size="sm" onClick={() => openEditEvent(event)}>
                                      <Edit className="h-3 w-3 mr-1" /> Edit
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs truncate rounded px-1 py-0.5 bg-${event.color}-100 text-${event.color}-800 dark:bg-${event.color}-900/30 dark:text-${event.color}-300 border-l-2 border-${event.color}-500`}
                          onClick={(e) => {
                            e.stopPropagation()
                            openEditEvent(event)
                          }}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-muted-foreground text-center">+{dayEvents.length - 2} more</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Events</Badge>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Assignments
              </Badge>
              <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">Deadlines</Badge>
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                Assessments
              </Badge>
            </div>
            <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Add Event
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Edit Event Dialog */}
      <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-xl border-none shadow-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-500" />
              Edit Event
            </DialogTitle>
            <DialogDescription>Modify event details or delete this event.</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-event-title">Event Title</Label>
                <Input
                  id="edit-event-title"
                  value={selectedEvent.title}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-event-date">Date</Label>
                  <Input
                    id="edit-event-date"
                    type="date"
                    value={selectedEvent.date}
                    onChange={(e) => setSelectedEvent({ ...selectedEvent, date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-event-time">Time (optional)</Label>
                  <Input
                    id="edit-event-time"
                    value={selectedEvent.time}
                    onChange={(e) => setSelectedEvent({ ...selectedEvent, time: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-event-type">Event Type</Label>
                  <Select
                    value={selectedEvent.type}
                    onValueChange={(value) => setSelectedEvent({ ...selectedEvent, type: value })}
                  >
                    <SelectTrigger id="edit-event-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="assessment">Assessment</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                      <SelectItem value="holiday">Holiday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-event-color">Color</Label>
                  <Select
                    value={selectedEvent.color}
                    onValueChange={(value) => setSelectedEvent({ ...selectedEvent, color: value })}
                  >
                    <SelectTrigger id="edit-event-color">
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="amber">Amber</SelectItem>
                      <SelectItem value="pink">Pink</SelectItem>
                      <SelectItem value="indigo">Indigo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-event-student">Student</Label>
                <Select
                  value={selectedEvent.student}
                  onValueChange={(value) => setSelectedEvent({ ...selectedEvent, student: value })}
                >
                  <SelectTrigger id="edit-event-student">
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Students</SelectItem>
                    <SelectItem value="Enoch">Enoch</SelectItem>
                    <SelectItem value="Sarah">Sarah</SelectItem>
                    <SelectItem value="Benjamin">Benjamin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-event-location">Location (optional)</Label>
                <Input
                  id="edit-event-location"
                  value={selectedEvent.location}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, location: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-event-description">Description (optional)</Label>
                <Textarea
                  id="edit-event-description"
                  value={selectedEvent.description}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <Button variant="destructive" onClick={() => handleDeleteEvent(selectedEvent?.id)} className="gap-1">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditEventOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleEditEvent}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
