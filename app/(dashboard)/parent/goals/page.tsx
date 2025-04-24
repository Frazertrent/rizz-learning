"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { format } from "date-fns"
import {
  Target,
  Plus,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Edit,
  Trash2,
  ArrowLeft,
  Lightbulb,
  BookOpen,
  Calendar,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Clock,
  X,
  Sparkles,
  Coins,
  Info,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CreatableSelect, type Option } from "@/components/ui/creatable-select"

// Goal type definition
type Goal = {
  id: number
  title: string
  description: string
  subject: string
  category: string
  dueDate: Date
  reward?: string | null
  xpReward: number
  coinReward: number
  status: "on-track" | "behind" | "complete"
  progress: number
  visibleToStudent: boolean
  completedDate?: Date
}

// Subject options for the creatable select
const subjectOptions: Option[] = [
  { value: "Mathematics", label: "Mathematics" },
  { value: "English", label: "English" },
  { value: "Science", label: "Science" },
  { value: "History", label: "History" },
  { value: "Spanish", label: "Spanish" },
  { value: "Computer Science", label: "Computer Science" },
  { value: "Physical Education", label: "Physical Education" },
  { value: "Wellness", label: "Wellness" },
  { value: "Art", label: "Art" },
  { value: "Piano", label: "Piano" },
  { value: "Music Practice", label: "Music Practice" },
  { value: "Chores", label: "Chores" },
  { value: "Health & Nutrition", label: "Health & Nutrition" },
  { value: "Spiritual", label: "Spiritual" },
  { value: "Executive Function", label: "Executive Function" },
]

// Mock data for goals
const mockGoals: Goal[] = [
  {
    id: 1,
    title: "Complete Math Module 3",
    description: "Finish all exercises in the algebra section and take the final quiz",
    subject: "Mathematics",
    category: "academic",
    dueDate: new Date(2025, 4, 25),
    reward: "1 hour of game time",
    xpReward: 30,
    coinReward: 15,
    status: "on-track",
    progress: 65,
    visibleToStudent: true,
  },
  {
    id: 2,
    title: "Read 'To Kill a Mockingbird'",
    description: "Read the entire book and prepare notes for discussion",
    subject: "English",
    category: "academic",
    dueDate: new Date(2025, 4, 30),
    reward: "Movie night",
    xpReward: 25,
    coinReward: 10,
    status: "behind",
    progress: 30,
    visibleToStudent: true,
  },
  {
    id: 3,
    title: "Complete Science Project",
    description: "Build a working model of the solar system",
    subject: "Science",
    category: "academic",
    dueDate: new Date(2025, 4, 15),
    reward: "Trip to the science museum",
    xpReward: 40,
    coinReward: 20,
    status: "complete",
    progress: 100,
    visibleToStudent: true,
    completedDate: new Date(2025, 4, 10),
  },
  {
    id: 4,
    title: "Learn 50 Spanish Vocabulary Words",
    description: "Master basic Spanish vocabulary for everyday conversation",
    subject: "Spanish",
    category: "academic",
    dueDate: new Date(2025, 4, 20),
    reward: null,
    xpReward: 20,
    coinReward: 10,
    status: "behind",
    progress: 20,
    visibleToStudent: false,
  },
  {
    id: 5,
    title: "Complete History Essay",
    description: "Write a 5-page essay on the Civil War",
    subject: "History",
    category: "academic",
    dueDate: new Date(2025, 4, 18),
    reward: "Ice cream outing",
    xpReward: 35,
    coinReward: 15,
    status: "on-track",
    progress: 75,
    visibleToStudent: true,
  },
  {
    id: 6,
    title: "Master Multiplication Tables",
    description: "Learn multiplication tables from 1-12",
    subject: "Mathematics",
    category: "academic",
    dueDate: new Date(2025, 3, 30),
    reward: "New puzzle game",
    xpReward: 30,
    coinReward: 15,
    status: "complete",
    progress: 100,
    visibleToStudent: true,
    completedDate: new Date(2025, 3, 28),
  },
  {
    id: 7,
    title: "Daily Exercise Routine",
    description: "Complete 30 minutes of exercise every day for two weeks",
    subject: "Physical Education",
    category: "fitness",
    dueDate: new Date(2025, 4, 28),
    reward: "New sports equipment",
    xpReward: 45,
    coinReward: 25,
    status: "on-track",
    progress: 50,
    visibleToStudent: true,
  },
  {
    id: 8,
    title: "Mindfulness Practice",
    description: "Practice mindfulness meditation for 10 minutes daily for a week",
    subject: "Wellness",
    category: "mindset",
    dueDate: new Date(2025, 4, 22),
    reward: "Relaxation day",
    xpReward: 25,
    coinReward: 15,
    status: "on-track",
    progress: 40,
    visibleToStudent: true,
  },
  {
    id: 9,
    title: "Daily Affirmations",
    description: "Practice positive affirmations every morning",
    subject: "Daily Affirmations",
    category: "spiritual",
    dueDate: new Date(2025, 4, 25),
    reward: "Self-care day",
    xpReward: 20,
    coinReward: 10,
    status: "on-track",
    progress: 60,
    visibleToStudent: true,
  },
]

// Template goals for suggestions
const templateGoals = [
  {
    title: "Master multiplication tables",
    subject: "Mathematics",
    category: "academic",
    icon: <Target className="h-5 w-5" />,
    xpReward: 30,
    coinReward: 15,
  },
  {
    title: "Complete Biology module 2",
    subject: "Science",
    category: "academic",
    icon: <BookOpen className="h-5 w-5" />,
    xpReward: 35,
    coinReward: 20,
  },
  {
    title: "Write in journal 10 days in a row",
    subject: "English",
    category: "academic",
    icon: <Calendar className="h-5 w-5" />,
    xpReward: 25,
    coinReward: 10,
  },
  {
    title: "Memorize 20 vocabulary words",
    subject: "English",
    category: "academic",
    icon: <BookOpen className="h-5 w-5" />,
    xpReward: 20,
    coinReward: 10,
  },
  {
    title: "Complete coding challenge",
    subject: "Computer Science",
    category: "academic",
    icon: <Target className="h-5 w-5" />,
    xpReward: 40,
    coinReward: 20,
  },
  {
    title: "Daily exercise routine",
    subject: "Physical Education",
    category: "fitness",
    icon: <Target className="h-5 w-5" />,
    xpReward: 30,
    coinReward: 15,
  },
  {
    title: "Practice mindfulness meditation",
    subject: "Wellness",
    category: "mindset",
    icon: <Target className="h-5 w-5" />,
    xpReward: 25,
    coinReward: 15,
  },
  {
    title: "Complete art project",
    subject: "Art",
    category: "personal",
    icon: <Target className="h-5 w-5" />,
    xpReward: 30,
    coinReward: 15,
  },
  {
    title: "Daily reflection practice",
    subject: "Spiritual",
    category: "spiritual",
    icon: <Target className="h-5 w-5" />,
    xpReward: 25,
    coinReward: 15,
  },
]

// Generate dynamic subject colors
const getSubjectColor = (subject: string) => {
  // Predefined colors for common subjects
  const predefinedColors: Record<
    string,
    {
      light: string
      medium: string
      dark: string
      badge: string
    }
  > = {
    Mathematics: {
      light: "from-blue-600/20 to-blue-400/10",
      medium: "text-blue-400",
      dark: "from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500",
      badge: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    },
    English: {
      light: "from-purple-600/20 to-purple-400/10",
      medium: "text-purple-400",
      dark: "from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500",
      badge: "bg-purple-500/20 text-purple-400 border-purple-500/50",
    },
    Science: {
      light: "from-green-600/20 to-green-400/10",
      medium: "text-green-400",
      dark: "from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500",
      badge: "bg-green-500/20 text-green-400 border-green-500/50",
    },
    History: {
      light: "from-amber-600/20 to-amber-400/10",
      medium: "text-amber-400",
      dark: "from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500",
      badge: "bg-amber-500/20 text-amber-400 border-amber-500/50",
    },
    Spanish: {
      light: "from-red-600/20 to-red-400/10",
      medium: "text-red-400",
      dark: "from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500",
      badge: "bg-red-500/20 text-red-400 border-red-500/50",
    },
    "Computer Science": {
      light: "from-cyan-600/20 to-cyan-400/10",
      medium: "text-cyan-400",
      dark: "from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500",
      badge: "bg-cyan-500/20 text-cyan-400 border-cyan-500/50",
    },
    "Physical Education": {
      light: "from-emerald-600/20 to-emerald-400/10",
      medium: "text-emerald-400",
      dark: "from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500",
      badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
    },
    Wellness: {
      light: "from-violet-600/20 to-violet-400/10",
      medium: "text-violet-400",
      dark: "from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500",
      badge: "bg-violet-500/20 text-violet-400 border-violet-500/50",
    },
    Art: {
      light: "from-pink-600/20 to-pink-400/10",
      medium: "text-pink-400",
      dark: "from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500",
      badge: "bg-pink-500/20 text-pink-400 border-pink-500/50",
    },
    Piano: {
      light: "from-indigo-600/20 to-indigo-400/10",
      medium: "text-indigo-400",
      dark: "from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500",
      badge: "bg-indigo-500/20 text-indigo-400 border-indigo-500/50",
    },
    "Music Practice": {
      light: "from-indigo-600/20 to-indigo-400/10",
      medium: "text-indigo-400",
      dark: "from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500",
      badge: "bg-indigo-500/20 text-indigo-400 border-indigo-500/50",
    },
    Chores: {
      light: "from-orange-600/20 to-orange-400/10",
      medium: "text-orange-400",
      dark: "from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500",
      badge: "bg-orange-500/20 text-orange-400 border-orange-500/50",
    },
    "Health & Nutrition": {
      light: "from-lime-600/20 to-lime-400/10",
      medium: "text-lime-400",
      dark: "from-lime-600 to-green-600 hover:from-lime-500 hover:to-green-500",
      badge: "bg-lime-500/20 text-lime-400 border-lime-500/50",
    },
    Spiritual: {
      light: "from-yellow-600/20 to-yellow-400/10",
      medium: "text-yellow-400",
      dark: "from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500",
      badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
    },
    "Executive Function": {
      light: "from-slate-600/20 to-slate-400/10",
      medium: "text-slate-400",
      dark: "from-slate-600 to-gray-600 hover:from-slate-500 hover:to-gray-500",
      badge: "bg-slate-500/20 text-slate-400 border-slate-500/50",
    },
    "Daily Affirmations": {
      light: "from-yellow-600/20 to-yellow-400/10",
      medium: "text-yellow-400",
      dark: "from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500",
      badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
    },
  }

  // Return predefined color if available
  if (predefinedColors[subject]) {
    return predefinedColors[subject]
  }

  // Generate a color based on the subject string for custom subjects
  // This is a simple hash function to generate a consistent color for the same subject
  const hash = subject.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)

  // Use the hash to select from a set of predefined colors
  const colorOptions = Object.values(predefinedColors)
  const index = Math.abs(hash) % colorOptions.length

  return colorOptions[index]
}

// Category colors
const categoryColors = {
  academic: {
    light: "from-blue-600/20 to-blue-400/10",
    medium: "text-blue-400",
    dark: "from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500",
    badge: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  },
  personal: {
    light: "from-purple-600/20 to-purple-400/10",
    medium: "text-purple-400",
    dark: "from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500",
    badge: "bg-purple-500/20 text-purple-400 border-purple-500/50",
  },
  fitness: {
    light: "from-emerald-600/20 to-emerald-400/10",
    medium: "text-emerald-400",
    dark: "from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500",
    badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
  },
  mindset: {
    light: "from-violet-600/20 to-violet-400/10",
    medium: "text-violet-400",
    dark: "from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500",
    badge: "bg-violet-500/20 text-violet-400 border-violet-500/50",
  },
  spiritual: {
    light: "from-yellow-600/20 to-yellow-400/10",
    medium: "text-yellow-400",
    dark: "from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500",
    badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  },
}

// Status badges
const statusBadges = {
  "on-track": "bg-green-500/20 text-green-400 border-green-500/50",
  behind: "bg-red-500/20 text-red-400 border-red-500/50",
  complete: "bg-blue-500/20 text-blue-400 border-blue-500/50",
}

// Default new goal template
const defaultNewGoal: Omit<Goal, "id"> = {
  title: "",
  description: "",
  subject: "Mathematics",
  category: "academic",
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
  reward: "",
  xpReward: 30,
  coinReward: 15,
  status: "on-track",
  progress: 0,
  visibleToStudent: true,
}

export default function ParentGoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(mockGoals)
  const [expandedGoals, setExpandedGoals] = useState<number[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [carouselIndex, setCarouselIndex] = useState(0)

  // Modal states
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [completeModalOpen, setCompleteModalOpen] = useState(false)
  const [newGoal, setNewGoal] = useState<Omit<Goal, "id">>({ ...defaultNewGoal })

  // Confetti state
  const [showConfetti, setShowConfetti] = useState(false)

  // Filter goals by status
  const currentGoals = goals.filter((goal) => goal.status !== "complete")
  const achievedGoals = goals.filter((goal) => goal.status === "complete")

  // Toggle goal description expansion
  const toggleGoalExpansion = (goalId: number) => {
    if (expandedGoals.includes(goalId)) {
      setExpandedGoals(expandedGoals.filter((id) => id !== goalId))
    } else {
      setExpandedGoals([...expandedGoals, goalId])
    }
  }

  // Calculate days remaining for a goal
  const getDaysRemaining = (dueDate: Date) => {
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Carousel navigation
  const nextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % 2)
  }

  const prevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + 2) % 2)
  }

  // Get carousel title based on index
  const getCarouselTitle = () => {
    switch (carouselIndex) {
      case 0:
        return "Current Goals"
      case 1:
        return "Recently Achieved"
      default:
        return "Goals"
    }
  }

  // Update the getCarouselGoals function to filter goals completed within the past 6 months and sort them by completion date
  const getCarouselGoals = () => {
    switch (carouselIndex) {
      case 0:
        return currentGoals
      case 1: {
        // Filter goals completed within the past 6 months
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

        return (
          achievedGoals
            .filter((goal) => goal.completedDate && goal.completedDate > sixMonthsAgo)
            // Sort from most recent to oldest
            .sort((a, b) => {
              const dateA = a.completedDate || new Date()
              const dateB = b.completedDate || new Date()
              return dateB.getTime() - dateA.getTime()
            })
        )
      }
      default:
        return []
    }
  }

  // Open goal detail modal
  const openGoalDetail = (goal: Goal) => {
    setSelectedGoal(goal)
    setDetailModalOpen(true)
  }

  // Open create goal modal
  const openCreateGoal = () => {
    setEditingGoal(null)
    setNewGoal({ ...defaultNewGoal })
    setCreateModalOpen(true)
  }

  // Open edit goal modal
  const openEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setNewGoal({
      title: goal.title,
      description: goal.description,
      subject: goal.subject,
      category: goal.category,
      dueDate: goal.dueDate,
      reward: goal.reward,
      xpReward: goal.xpReward,
      coinReward: goal.coinReward,
      status: goal.status,
      progress: goal.progress,
      visibleToStudent: goal.visibleToStudent,
      completedDate: goal.completedDate,
    })
    setCreateModalOpen(true)
  }

  // Open delete confirmation modal
  const openDeleteConfirmation = (goal: Goal) => {
    setSelectedGoal(goal)
    setDeleteModalOpen(true)
  }

  // Open complete confirmation modal
  const openCompleteConfirmation = (goal: Goal) => {
    setSelectedGoal(goal)
    setCompleteModalOpen(true)
  }

  // Handle save goal (create or edit)
  const handleSaveGoal = () => {
    if (editingGoal) {
      // Update existing goal
      setGoals(
        goals.map((goal) =>
          goal.id === editingGoal.id
            ? {
                ...goal,
                ...newGoal,
              }
            : goal,
        ),
      )
    } else {
      // Create new goal
      const newId = Math.max(...goals.map((goal) => goal.id)) + 1
      setGoals([
        ...goals,
        {
          id: newId,
          ...newGoal,
        },
      ])
    }
    setCreateModalOpen(false)
  }

  // Handle delete goal
  const handleDeleteGoal = () => {
    if (selectedGoal) {
      setGoals(goals.filter((goal) => goal.id !== selectedGoal.id))
      setDeleteModalOpen(false)
      setDetailModalOpen(false)
    }
  }

  // Fix the handleCompleteGoal function which has a bug
  const handleCompleteGoal = () => {
    if (selectedGoal) {
      setGoals(
        goals.map((goal) =>
          goal.id === selectedGoal.id
            ? {
                ...goal,
                status: "complete",
                progress: 100,
                completedDate: new Date(),
              }
            : goal,
        ),
      )
      setCompleteModalOpen(false)
      setDetailModalOpen(false)

      // Show confetti animation
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }

  // Handle using a template goal
  const handleUseTemplate = (template: (typeof templateGoals)[0]) => {
    setNewGoal({
      ...defaultNewGoal,
      title: template.title,
      subject: template.subject,
      category: template.category,
      xpReward: template.xpReward,
      coinReward: template.coinReward,
    })
    setEditingGoal(null)
    setCreateModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Confetti animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="absolute top-1/4 left-1/4 text-4xl animate-float-slow">✨</div>
          <div className="absolute top-1/3 right-1/3 text-4xl animate-float-medium">🎉</div>
          <div className="absolute bottom-1/3 left-1/3 text-4xl animate-float-fast">🏆</div>
          <div className="absolute top-1/2 right-1/4 text-4xl animate-float-slow">🎊</div>
          <div className="absolute bottom-1/4 right-1/2 text-4xl animate-float-medium">🌟</div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header with navigation */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link href="/parent">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-800">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent"
            >
              Student Goals
            </motion.h1>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
          >
            <Link href="/student/goals">
              <Eye className="h-4 w-4 mr-2" />
              Student View
            </Link>
          </Button>
        </div>

        {/* Top Section: Goal Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Target className={`h-5 w-5 ${carouselIndex === 0 ? "text-green-400" : "text-blue-400"}`} />
              {getCarouselTitle()}
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full hover:bg-gray-800" onClick={prevCarousel}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full hover:bg-gray-800" onClick={nextCarousel}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
          // Replace the carousel section with an improved continuously scrollable version
          <div
            className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
            style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}
          >
            <div className="flex gap-4 min-w-max pr-4">
              {getCarouselGoals().map((goal) => (
                <Card
                  key={goal.id}
                  className={`w-80 bg-gray-900/80 border-gray-800 hover:bg-gray-800/80 transition-all ${
                    carouselIndex === 1
                      ? "hover:shadow-blue-900/20 border-blue-900/10"
                      : goal.status === "behind"
                        ? "hover:shadow-red-900/20 border-red-900/30"
                        : goal.status === "on-track"
                          ? "hover:shadow-green-900/20"
                          : "hover:shadow-blue-900/20"
                  }`}
                >
                  <CardHeader className={`pb-2 bg-gradient-to-r ${getSubjectColor(goal.subject).light} rounded-t-lg`}>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base font-medium">{goal.title}</CardTitle>
                      {carouselIndex === 0 && (
                        <Badge variant="outline" className={statusBadges[goal.status]}>
                          {goal.status === "on-track" ? "On Track" : goal.status === "behind" ? "Behind" : "Complete"}
                        </Badge>
                      )}
                    </div>
                    <CardDescription>
                      <Badge variant="outline" className={getSubjectColor(goal.subject).badge}>
                        {goal.subject}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {carouselIndex === 0 ? (
                        <>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{goal.progress}%</span>
                            </div>
                            <Progress value={goal.progress} className="h-2 bg-gray-800">
                              <div
                                className={`h-full bg-gradient-to-r ${getSubjectColor(goal.subject).dark} rounded-full`}
                              />
                            </Progress>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1 text-sm">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>{getDaysRemaining(goal.dueDate)} days left</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <Sparkles className="h-4 w-4 text-purple-400" />
                              <span>{goal.xpReward} XP</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Coins className="h-4 w-4 text-amber-400" />
                              <span>{goal.coinReward} Coins</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                              <CheckCircle className="h-6 w-6 text-blue-400" />
                            </div>
                            <div className="text-center space-y-1">
                              <div className="text-sm text-gray-400">Completed on</div>
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                                {format(goal.completedDate || new Date(), "MMMM d, yyyy")}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mt-2">
                            <div className="flex items-center gap-2 bg-purple-900/20 p-2 rounded-md">
                              <Sparkles className="h-5 w-5 text-purple-400" />
                              <span className="text-purple-300 font-medium">{goal.xpReward} XP</span>
                            </div>
                            <div className="flex items-center gap-2 bg-amber-900/20 p-2 rounded-md">
                              <Coins className="h-5 w-5 text-amber-400" />
                              <span className="text-amber-300 font-medium">{goal.coinReward} Coins</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`${getSubjectColor(goal.subject).medium} hover:bg-gray-800`}
                      onClick={() => openGoalDetail(goal)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          {/* Remove the "See All Past Goals" link */}
        </motion.div>

        {/* Middle Section: Create Goal Button and Goal List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex justify-between items-center mb-6">
            <Button
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white px-6 py-6 rounded-xl flex items-center gap-2 hover:scale-[1.02] transition-all"
              size="lg"
              onClick={openCreateGoal}
            >
              <Plus className="h-5 w-5" />
              Create New Goal
            </Button>

            <Select defaultValue="all">
              <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="history">History</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {currentGoals.map((goal) => (
              <Card
                key={goal.id}
                className={`bg-gray-900/80 border-gray-800 hover:bg-gray-800/80 transition-all ${
                  goal.status === "behind" ? "border-red-900/30" : ""
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg font-medium">{goal.title}</CardTitle>
                        <Badge variant="outline" className={statusBadges[goal.status]}>
                          {goal.status === "on-track" ? "On Track" : goal.status === "behind" ? "Behind" : "Complete"}
                        </Badge>
                        {goal.visibleToStudent ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="text-green-400">
                                  <Eye className="h-4 w-4" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Visible to student</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="text-gray-500">
                                  <EyeOff className="h-4 w-4" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Hidden from student</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <CardDescription className="mt-1">
                        <Badge variant="outline" className={getSubjectColor(goal.subject).badge}>
                          {goal.subject}
                        </Badge>
                        <span className="ml-2 text-gray-400">Due: {format(goal.dueDate, "MMMM d, yyyy")}</span>
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-gray-800"
                        onClick={() => toggleGoalExpansion(goal.id)}
                      >
                        {expandedGoals.includes(goal.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {expandedGoals.includes(goal.id) && (
                  <CardContent>
                    <div className="space-y-4 pt-2">
                      <div className="text-sm text-gray-300">{goal.description}</div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Subject or Focus Area</div>
                          <CreatableSelect
                            options={subjectOptions}
                            value={goal.subject}
                            onChange={() => {}}
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium">Due Date</div>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal bg-gray-800 border-gray-700"
                              >
                                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-700">
                              <CalendarComponent
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                initialFocus
                                className="bg-gray-900"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium">Reward (Optional)</div>
                          <input
                            type="text"
                            placeholder="e.g. 30 minutes of game time"
                            defaultValue={goal.reward || ""}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm font-medium">XP Reward</div>
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-purple-400" />
                            <input
                              type="number"
                              defaultValue={goal.xpReward}
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium">Coin Reward</div>
                          <div className="flex items-center gap-2">
                            <Coins className="h-4 w-4 text-amber-400" />
                            <input
                              type="number"
                              defaultValue={goal.coinReward}
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium">Visible to Student</div>
                          <Switch checked={goal.visibleToStudent} />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-amber-400 hover:text-amber-300 hover:bg-amber-900/20"
                            onClick={() => openEditGoal(goal)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            onClick={() => openDeleteConfirmation(goal)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-400 hover:text-green-300 hover:bg-green-900/20"
                            onClick={() => openCompleteConfirmation(goal)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark Complete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}

                {!expandedGoals.includes(goal.id) && (
                  <CardContent className="pt-0">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1 w-1/2">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2 bg-gray-800">
                          <div
                            className={`h-full bg-gradient-to-r ${getSubjectColor(goal.subject).dark} rounded-full`}
                          />
                        </Progress>
                        <div className="flex items-center justify-between text-xs mt-1">
                          <div className="flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-purple-400" />
                            <span>{goal.xpReward} XP</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Coins className="h-3 w-3 text-amber-400" />
                            <span>{goal.coinReward} Coins</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-amber-400 hover:text-amber-300 hover:bg-amber-900/20"
                          onClick={() => openEditGoal(goal)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          onClick={() => openDeleteConfirmation(goal)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-400 hover:text-green-300 hover:bg-green-900/20"
                          onClick={() => openCompleteConfirmation(goal)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Bottom Section: Goal Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gray-900/80 border-gray-800">
            <CardHeader className="pb-2 bg-gradient-to-r from-amber-600/20 to-amber-400/10 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-400" />
                Need Ideas?
              </CardTitle>
              <CardDescription>Click on any template below to quickly create a new goal</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {templateGoals.map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:scale-[1.02] transition-all h-auto py-3"
                    onClick={() => handleUseTemplate(template)}
                  >
                    <div
                      className={`h-8 w-8 rounded-full ${categoryColors[template.category as keyof typeof categoryColors].badge} flex items-center justify-center mr-3`}
                    >
                      {template.icon}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{template.title}</span>
                      <span className="text-xs text-gray-400">{template.subject}</span>
                      <span className="text-xs mt-1">
                        <span className="text-purple-400">{template.xpReward} XP</span> •{" "}
                        <span className="text-amber-400">{template.coinReward} Coins</span>
                      </span>
                    </div>
                  </Button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-indigo-900/20 rounded-lg border border-indigo-800/30">
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-500/20 p-2 rounded-full">
                    <Info className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-indigo-300 font-medium">⭐ Pro Tip</h4>
                    <p className="text-sm text-gray-300 mt-1">
                      Goals with a due date and reward are 45% more likely to be completed! Adding XP and Coins
                      increases student motivation.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Goal Detail Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-bold">{selectedGoal?.title}</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-gray-800"
                onClick={() => setDetailModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription>
              {selectedGoal && (
                <Badge variant="outline" className={getSubjectColor(selectedGoal.subject).badge}>
                  {selectedGoal.subject}
                </Badge>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedGoal && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-400">Description</div>
                <p className="text-gray-200">{selectedGoal.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-400">Due Date</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{format(selectedGoal.dueDate, "MMMM d, yyyy")}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-400">Status</div>
                  <Badge variant="outline" className={statusBadges[selectedGoal.status]}>
                    {selectedGoal.status === "on-track"
                      ? "On Track"
                      : selectedGoal.status === "behind"
                        ? "Behind"
                        : "Complete"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-400">Progress</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Completion</span>
                    <span>{selectedGoal.progress}%</span>
                  </div>
                  <Progress value={selectedGoal.progress} className="h-2 bg-gray-800">
                    <div
                      className={`h-full bg-gradient-to-r ${getSubjectColor(selectedGoal.subject).dark} rounded-full`}
                    />
                  </Progress>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-400">XP Reward</div>
                  <div className="flex items-center gap-2 text-purple-400">
                    <Sparkles className="h-4 w-4" />
                    <span>{selectedGoal.xpReward} XP</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-400">Coin Reward</div>
                  <div className="flex items-center gap-2 text-amber-400">
                    <Coins className="h-4 w-4" />
                    <span>{selectedGoal.coinReward} Coins</span>
                  </div>
                </div>
              </div>

              {selectedGoal.reward && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-400">Additional Reward</div>
                  <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/50">
                    🎁 {selectedGoal.reward}
                  </Badge>
                </div>
              )}

              {selectedGoal.completedDate && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-400">Completed On</div>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                    {format(selectedGoal.completedDate, "MMMM d, yyyy")}
                  </Badge>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-gray-400">Visible to Student</div>
                  <Switch checked={selectedGoal.visibleToStudent} disabled={selectedGoal.status === "complete"} />
                </div>

                {selectedGoal.status !== "complete" && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-amber-400 hover:text-amber-300 hover:bg-amber-900/20"
                      onClick={() => {
                        setDetailModalOpen(false)
                        openEditGoal(selectedGoal)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      onClick={() => {
                        setDetailModalOpen(false)
                        openDeleteConfirmation(selectedGoal)
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-400 hover:text-green-300 hover:bg-green-900/20"
                      onClick={() => {
                        setDetailModalOpen(false)
                        openCompleteConfirmation(selectedGoal)
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark Complete
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Goal Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
              {editingGoal ? "Edit Goal" : "Create New Goal"}
            </DialogTitle>
            <DialogDescription>
              {editingGoal ? "Update the goal details below" : "Fill in the details to create a new goal"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Goal Title</Label>
              <Input
                id="title"
                placeholder="What do you want to achieve?"
                className="bg-gray-800 border-gray-700"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={newGoal.category} onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}>
                  <SelectTrigger id="category" className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="academic">📚 Academic</SelectItem>
                    <SelectItem value="personal">🌱 Personal</SelectItem>
                    <SelectItem value="fitness">💪 Fitness</SelectItem>
                    <SelectItem value="mindset">🧠 Mindset</SelectItem>
                    <SelectItem value="spiritual">✨ Spiritual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject or Focus Area</Label>
                <CreatableSelect
                  options={subjectOptions}
                  value={newGoal.subject}
                  onChange={(value) => setNewGoal({ ...newGoal, subject: value })}
                  placeholder="Select or create..."
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Add more details about the goal..."
                className="bg-gray-800 border-gray-700 min-h-[100px]"
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="dueDate"
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-gray-800 border-gray-700"
                  >
                    {newGoal.dueDate ? format(newGoal.dueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-700">
                  <CalendarComponent
                    mode="single"
                    selected={newGoal.dueDate}
                    onSelect={(date) => date && setNewGoal({ ...newGoal, dueDate: date })}
                    initialFocus
                    className="bg-gray-900"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="xpReward">XP Points</Label>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <Input
                    id="xpReward"
                    type="number"
                    className="bg-gray-800 border-gray-700"
                    value={newGoal.xpReward}
                    onChange={(e) => setNewGoal({ ...newGoal, xpReward: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coinReward">Coins</Label>
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-amber-400" />
                  <Input
                    id="coinReward"
                    type="number"
                    className="bg-gray-800 border-gray-700"
                    value={newGoal.coinReward}
                    onChange={(e) => setNewGoal({ ...newGoal, coinReward: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 bg-gray-800/50 p-2 rounded-md">
              <div className="w-full text-xs text-gray-400 mb-1">Suggested Values:</div>
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-700 text-xs"
                onClick={() => setNewGoal({ ...newGoal, xpReward: 20, coinReward: 10 })}
              >
                Easy: 20 XP / 10 Coins
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-700 text-xs"
                onClick={() => setNewGoal({ ...newGoal, xpReward: 30, coinReward: 15 })}
              >
                Medium: 30 XP / 15 Coins
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-700 text-xs"
                onClick={() => setNewGoal({ ...newGoal, xpReward: 50, coinReward: 25 })}
              >
                Hard: 50 XP / 25 Coins
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reward">Additional Reward (Optional)</Label>
              <Input
                id="reward"
                placeholder="e.g. Movie night, Ice cream outing"
                className="bg-gray-800 border-gray-700"
                value={newGoal.reward || ""}
                onChange={(e) => setNewGoal({ ...newGoal, reward: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="visibleToStudent"
                  checked={newGoal.visibleToStudent}
                  onCheckedChange={(checked) => setNewGoal({ ...newGoal, visibleToStudent: checked })}
                />
                <Label htmlFor="visibleToStudent">Visible to student</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500"
              onClick={handleSaveGoal}
              disabled={!newGoal.title.trim()}
            >
              {editingGoal ? "Update Goal" : "Create Goal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-400">Delete Goal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this goal? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedGoal && (
            <div className="py-4">
              <div className="p-3 bg-gray-800 rounded-md">
                <h4 className="font-medium">{selectedGoal.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={getSubjectColor(selectedGoal.subject).badge}>
                    {selectedGoal.subject}
                  </Badge>
                  <span className="text-xs text-gray-400">Due: {format(selectedGoal.dueDate, "MMM d, yyyy")}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" className="bg-red-600 hover:bg-red-700" onClick={handleDeleteGoal}>
              Delete Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Confirmation Modal */}
      <Dialog open={completeModalOpen} onOpenChange={setCompleteModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-green-400">Mark as Complete</DialogTitle>
            <DialogDescription>Are you sure you want to mark this goal as completed?</DialogDescription>
          </DialogHeader>

          {selectedGoal && (
            <div className="py-4">
              <div className="p-3 bg-gray-800 rounded-md">
                <h4 className="font-medium">{selectedGoal.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={getSubjectColor(selectedGoal.subject).badge}>
                    {selectedGoal.subject}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-3 text-sm">
                  <div className="flex items-center gap-1 text-purple-400">
                    <Sparkles className="h-4 w-4" />
                    <span>{selectedGoal.xpReward} XP</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Coins className="h-4 w-4" />
                    <span>{selectedGoal.coinReward} Coins</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-400">
                <p>
                  Completing this goal will award the student with {selectedGoal.xpReward} XP and{" "}
                  {selectedGoal.coinReward} Coins.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500"
              onClick={handleCompleteGoal}
            >
              Mark Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
