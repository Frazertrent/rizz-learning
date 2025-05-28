"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Plus,
  MoreHorizontal,
  Sparkles,
  Coins,
  Calendar,
  Award,
  Zap,
  MessageSquare,
  Flame,
  ArrowRight,
  HelpCircle,
  Star,
  FileUp,
  X,
  Edit,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import AddGoalModal from "./add-goal-modal"
import AddHabitModal from "./add-habit-modal"
import GoalSuggestionModal from "./goal-suggestion-modal"
import SubmitEvidenceModal from "./submit-evidence-modal"
import confetti from "canvas-confetti"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Sample goal data
const sampleGoals = [
  {
    id: "1",
    title: "Complete Science Chapter 5",
    category: "academic",
    progress: 75,
    xpReward: 25,
    coinReward: 10,
    dueDate: "Apr 25, 2025",
    steps: [
      { id: "1-1", text: "Read pages 120-135", completed: true },
      { id: "1-2", text: "Complete practice questions", completed: true },
      { id: "1-3", text: "Take chapter quiz", completed: false },
      { id: "1-4", text: "Submit lab report", completed: false },
    ],
  },
  {
    id: "2",
    title: "Practice Piano for 30 Minutes Daily",
    category: "personal",
    progress: 60,
    xpReward: 15,
    coinReward: 5,
    dueDate: "Ongoing",
    streak: 3,
  },
  {
    id: "3",
    title: "Run 2 Miles",
    category: "fitness",
    progress: 50,
    xpReward: 20,
    coinReward: 8,
    dueDate: "Apr 20, 2025",
  },
  {
    id: "4",
    title: "Daily Mindfulness Practice",
    category: "mindset",
    progress: 40,
    xpReward: 10,
    coinReward: 5,
    dueDate: "Ongoing",
    streak: 2,
  },
  {
    id: "5",
    title: "Complete Math Assignment",
    category: "academic",
    progress: 100,
    xpReward: 30,
    coinReward: 15,
    completed: true,
    completedDate: "Apr 15, 2025",
  },
  {
    id: "6",
    title: "Read 20 Pages of Novel",
    category: "personal",
    progress: 100,
    xpReward: 15,
    coinReward: 5,
    completed: true,
    completedDate: "Apr 14, 2025",
  },
  // Add spiritual goals
  {
    id: "7",
    title: "Study scriptures for 10 minutes daily",
    category: "spiritual",
    progress: 65,
    xpReward: 20,
    coinReward: 8,
    dueDate: "Ongoing",
    streak: 4,
  },
  {
    id: "8",
    title: "Write 3 things I'm grateful for each night",
    category: "spiritual",
    progress: 30,
    xpReward: 15,
    coinReward: 5,
    dueDate: "Apr 30, 2025",
  },
  {
    id: "9",
    title: "Pray morning and evening for 7 days",
    category: "spiritual",
    progress: 85,
    xpReward: 25,
    coinReward: 10,
    dueDate: "Apr 22, 2025",
    steps: [
      { id: "9-1", text: "Morning prayer", completed: true },
      { id: "9-2", text: "Evening prayer", completed: true },
      { id: "9-3", text: "Reflection time", completed: false },
    ],
  },
  {
    id: "10",
    title: "Attend church this Sunday with family",
    category: "spiritual",
    progress: 0,
    xpReward: 30,
    coinReward: 15,
    dueDate: "Apr 21, 2025",
  },
  {
    id: "11",
    title: "Memorize 1 new scripture this week",
    category: "spiritual",
    progress: 100,
    xpReward: 20,
    coinReward: 10,
    completed: true,
    completedDate: "Apr 16, 2025",
  },
  {
    id: "12",
    title: "Daily reflection practice",
    category: "spiritual",
    progress: 50,
    xpReward: 15,
    coinReward: 7,
    dueDate: "Ongoing",
    streak: 2,
  },
]

// Sample habits data
const sampleHabits = [
  {
    id: "h1",
    title: "Read 10 mins",
    emoji: "📖",
    category: "academic",
    completed: false,
    streak: 5,
    xpReward: 5,
  },
  {
    id: "h2",
    title: "Drink 8 glasses of water",
    emoji: "💧",
    category: "fitness",
    completed: true,
    streak: 12,
    xpReward: 5,
  },
  {
    id: "h3",
    title: "Practice gratitude",
    emoji: "🙏",
    category: "mindset",
    completed: false,
    streak: 3,
    xpReward: 5,
  },
  {
    id: "h4",
    title: "Tidy room",
    emoji: "🧹",
    category: "personal",
    completed: true,
    streak: 2,
    xpReward: 5,
  },
  {
    id: "h5",
    title: "Morning prayer",
    emoji: "✨",
    category: "spiritual",
    completed: true,
    streak: 7,
    xpReward: 5,
  },
  {
    id: "h6",
    title: "Practice instrument",
    emoji: "🎵",
    category: "personal",
    completed: false,
    streak: 0,
    xpReward: 5,
  },
]

// Inspirational quotes
const inspirationalQuotes = [
  {
    quote: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    quote: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
  },
  {
    quote: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
  },
  {
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    quote: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar",
  },
]

// Goal category styling
const categoryStyles = {
  academic: {
    bgGradient: "from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/10",
    borderColor: "border-blue-200 dark:border-blue-800",
    progressColor: "bg-blue-500",
    icon: "📚",
    textColor: "text-blue-700 dark:text-blue-300",
    lightBg: "bg-blue-100 dark:bg-blue-900/40",
    darkBg: "bg-blue-600 dark:bg-blue-700",
    emoji: "🔵",
  },
  personal: {
    bgGradient: "from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-800/10",
    borderColor: "border-green-200 dark:border-green-800",
    progressColor: "bg-green-500",
    icon: "🌱",
    textColor: "text-green-700 dark:text-green-300",
    lightBg: "bg-green-100 dark:bg-green-900/40",
    darkBg: "bg-green-600 dark:bg-green-700",
    emoji: "🌱",
  },
  fitness: {
    bgGradient: "from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-800/10",
    borderColor: "border-orange-200 dark:border-orange-800",
    progressColor: "bg-orange-500",
    icon: "💪",
    textColor: "text-orange-700 dark:text-orange-300",
    lightBg: "bg-orange-100 dark:bg-orange-900/40",
    darkBg: "bg-orange-600 dark:bg-orange-700",
    emoji: "💪",
  },
  mindset: {
    bgGradient: "from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-800/10",
    borderColor: "border-purple-200 dark:border-purple-800",
    progressColor: "bg-purple-500",
    icon: "🧠",
    textColor: "text-purple-700 dark:text-purple-300",
    lightBg: "bg-purple-100 dark:bg-purple-900/40",
    darkBg: "bg-purple-600 dark:bg-purple-700",
    emoji: "🧠",
  },
  spiritual: {
    bgGradient: "from-amber-100 to-amber-50 dark:from-amber-900/20 dark:to-amber-800/10",
    borderColor: "border-amber-200 dark:border-amber-800",
    progressColor: "bg-amber-500",
    icon: "✨",
    textColor: "text-amber-700 dark:text-amber-300",
    lightBg: "bg-amber-100 dark:bg-amber-900/40",
    darkBg: "bg-amber-600 dark:bg-amber-700",
    emoji: "✨",
  },
  completed: {
    bgGradient: "from-gray-100 to-gray-50 dark:from-gray-800/20 dark:to-gray-700/10",
    borderColor: "border-gray-200 dark:border-gray-700",
    progressColor: "bg-gray-500",
    icon: "✅",
    textColor: "text-gray-700 dark:text-gray-300",
    lightBg: "bg-gray-100 dark:bg-gray-800",
    darkBg: "bg-gray-600 dark:bg-gray-700",
    emoji: "✅",
  },
}

export default function StudentGoals() {
  const [activeTab, setActiveTab] = useState("academic")
  const [goals, setGoals] = useState(sampleGoals)
  const [habits, setHabits] = useState(sampleHabits)
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false)
  const [isAddHabitModalOpen, setIsAddHabitModalOpen] = useState(false)
  const [isGptGoalModalOpen, setIsGptGoalModalOpen] = useState(false)
  const [isGptHabitModalOpen, setIsGptHabitModalOpen] = useState(false)
  const [isSubmitEvidenceModalOpen, setIsSubmitEvidenceModalOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [dailyXP, setDailyXP] = useState(0)
  const [quote, setQuote] = useState(inspirationalQuotes[0])
  const [showConfetti, setShowConfetti] = useState(false)

  // Calculate total completed goals
  const completedGoalsCount = goals.filter((goal) => goal.completed).length
  const totalGoalsCount = goals.length
  const completionPercentage = Math.round((completedGoalsCount / totalGoalsCount) * 100)

  // Calculate highest streak
  const highestStreak = Math.max(
    ...habits.map((habit) => habit.streak),
    ...goals.filter((goal) => goal.streak).map((goal) => goal.streak || 0),
  )

  // Filter goals and habits based on active tab
  const filteredGoals = goals.filter((goal) => {
    if (activeTab === "all") return !goal.completed
    if (activeTab === "completed") return goal.completed
    return goal.category === activeTab && !goal.completed
  })

  const filteredHabits = habits.filter((habit) => {
    if (activeTab === "all" || activeTab === "completed") return true
    return habit.category === activeTab
  })

  // Calculate daily XP from completed habits
  useEffect(() => {
    const xp = habits.filter((habit) => habit.completed).reduce((total, habit) => total + habit.xpReward, 0)
    setDailyXP(xp)
  }, [habits])

  // Rotate quotes every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length)
      setQuote(inspirationalQuotes[randomIndex])
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  // Handle goal completion
  const handleCompleteGoal = (goalId) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId) {
          // Trigger confetti
          triggerConfetti()
          return {
            ...goal,
            progress: 100,
            completed: true,
            completedDate: new Date().toLocaleDateString(),
          }
        }
        return goal
      }),
    )
  }

  // Handle submitting evidence for a goal
  const handleSubmitEvidence = (goal) => {
    setSelectedGoal(goal)
    setIsSubmitEvidenceModalOpen(true)
  }

  // Handle habit completion
  const handleCompleteHabit = (habitId) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === habitId) {
          const newCompleted = !habit.completed
          // Only trigger confetti when completing, not uncompleting
          if (newCompleted) {
            triggerConfetti()
          }
          return {
            ...habit,
            completed: newCompleted,
            streak: newCompleted ? habit.streak + 1 : habit.streak,
          }
        }
        return habit
      }),
    )
  }

  // Trigger confetti animation
  const triggerConfetti = () => {
    setShowConfetti(true)
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
    setTimeout(() => setShowConfetti(false), 2000)
  }

  // Handle adding a new goal
  const handleAddGoal = (newGoal) => {
    setGoals([
      ...goals,
      {
        id: (goals.length + 1).toString(),
        ...newGoal,
        progress: 0,
        completed: false,
      },
    ])
    setIsAddGoalModalOpen(false)
  }

  // Handle adding a new habit
  const handleAddHabit = (newHabit) => {
    setHabits([
      ...habits,
      {
        id: `h${habits.length + 1}`,
        ...newHabit,
        completed: false,
        streak: 0,
      },
    ])
    setIsAddHabitModalOpen(false)
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse-slow mb-2">
          🎯 My Goals & Habits
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Track your progress. Build better routines. Celebrate growth!
        </p>

        {/* Category Filter Tabs - Full Width */}
        <div className="mb-8">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full flex overflow-x-auto bg-gray-100 dark:bg-gray-800 p-1.5 rounded-full">
              <TabsTrigger
                key="all"
                value="all"
                className={cn(
                  "flex items-center gap-1 rounded-full px-4 py-2 transition-all flex-shrink-0",
                  activeTab === "all" ? "bg-white dark:bg-gray-700 shadow-sm font-medium" : "",
                )}
              >
                <span>🌈</span>
                <span className="hidden sm:inline">Show All</span>
              </TabsTrigger>
              {Object.entries(categoryStyles).map(([category, style]) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-4 py-2 transition-all flex-shrink-0",
                    activeTab === category ? style.lightBg : "",
                    activeTab === category ? style.textColor : "",
                    activeTab === category ? "font-medium shadow-sm" : "",
                  )}
                >
                  <span>{style.emoji}</span>
                  <span className="hidden sm:inline capitalize">{category}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Big Goals */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">🎯 My Big Goals</h2>
            <Button
              onClick={() => setIsAddGoalModalOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-1" /> Add New Goal
            </Button>
          </div>

          {/* GPT Assistant Card */}
          <Card className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 border-indigo-200 dark:border-indigo-800 shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-indigo-200 dark:bg-indigo-800 rounded-full p-2 mr-3">
                  <HelpCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                </div>
                <div>
                  <p className="font-medium">Need help setting a smart goal?</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Get personalized suggestions</p>
                </div>
              </div>
              <Button
                onClick={() => setIsGptGoalModalOpen(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
              >
                🎯 Get Goal Suggestion
              </Button>
            </CardContent>
          </Card>

          {/* Goal Cards */}
          <div className="space-y-4">
            {filteredGoals.length > 0 ? (
              filteredGoals.map((goal) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className={cn(
                      "overflow-hidden transition-all duration-300 border-2 hover:shadow-lg",
                      `border-${goal.category === "academic" ? "blue" : goal.category === "personal" ? "green" : goal.category === "fitness" ? "orange" : goal.category === "mindset" ? "purple" : goal.category === "spiritual" ? "amber" : "gray"}-300 dark:border-${goal.category === "academic" ? "blue" : goal.category === "personal" ? "green" : goal.category === "fitness" ? "orange" : goal.category === "mindset" ? "purple" : goal.category === "spiritual" ? "amber" : "gray"}-700`,
                      goal.completed
                        ? "bg-gray-50 dark:bg-gray-800/30"
                        : `bg-gradient-to-br ${categoryStyles[goal.category].bgGradient}`,
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge
                          className={cn(
                            "px-2 py-1",
                            categoryStyles[goal.category].lightBg,
                            categoryStyles[goal.category].textColor,
                          )}
                        >
                          {categoryStyles[goal.category].icon} {goal.category}
                        </Badge>

                        <div className="flex items-center gap-2">
                          {goal.dueDate && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {goal.dueDate}
                            </Badge>
                          )}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit Goal</DropdownMenuItem>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Delete Goal</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <h3
                        className={cn(
                          "text-lg font-semibold mb-2",
                          goal.completed
                            ? "text-gray-500 dark:text-gray-400 line-through"
                            : categoryStyles[goal.category].textColor,
                        )}
                      >
                        {goal.title}
                      </h3>

                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className={categoryStyles[goal.category].textColor}>Progress</span>
                          <span className={categoryStyles[goal.category].textColor}>{goal.progress}%</span>
                        </div>
                        <Progress
                          value={goal.progress}
                          className="h-2 bg-gray-100 dark:bg-gray-700"
                          indicatorClassName={categoryStyles[goal.category].progressColor}
                        />
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        {goal.xpReward && (
                          <div className="flex items-center bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />+{goal.xpReward} XP
                          </div>
                        )}

                        {goal.coinReward && (
                          <div className="flex items-center bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full text-xs">
                            <Coins className="h-3 w-3 mr-1" />+{goal.coinReward}
                          </div>
                        )}

                        {goal.streak && (
                          <div className="flex items-center bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded-full text-xs">
                            🔥 {goal.streak} day streak
                          </div>
                        )}
                      </div>

                      {!goal.completed ? (
                        <Button
                          onClick={() => handleSubmitEvidence(goal)}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full w-full"
                          size="sm"
                        >
                          <FileUp className="h-4 w-4 mr-1" />
                          Submit Evidence
                        </Button>
                      ) : (
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                          Completed on {goal.completedDate}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
                  No {activeTab === "completed" ? "completed" : activeTab === "all" ? "" : activeTab} goals yet.
                </p>
                <Button
                  onClick={() => setIsAddGoalModalOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Your First Goal
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Daily Habits */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">🔁 Daily Habits Builder</h2>
            <Button
              onClick={() => setIsAddHabitModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white"
            >
              <Plus className="h-4 w-4 mr-1" /> Add New Habit
            </Button>
          </div>

          {/* Habits List */}
          <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-md">
            <CardContent className="p-4">
              <div className="space-y-3">
                {filteredHabits.length > 0 ? (
                  filteredHabits.map((habit) => (
                    <motion.div
                      key={habit.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border-l-4",
                        habit.completed ? "bg-gray-50 dark:bg-gray-800/30" : "bg-white dark:bg-gray-800",
                        `border-l-${habit.category === "academic" ? "blue" : habit.category === "personal" ? "green" : habit.category === "fitness" ? "orange" : habit.category === "mindset" ? "purple" : habit.category === "spiritual" ? "amber" : "gray"}-500`,
                      )}
                    >
                      <div className="flex items-center">
                        <Checkbox
                          id={`habit-${habit.id}`}
                          checked={habit.completed}
                          onCheckedChange={() => handleCompleteHabit(habit.id)}
                          className={cn(
                            "mr-3 h-5 w-5 rounded-full transition-all",
                            habit.completed ? "bg-gradient-to-r from-green-500 to-emerald-500" : "",
                          )}
                        />
                        <div>
                          <label
                            htmlFor={`habit-${habit.id}`}
                            className={cn(
                              "font-medium flex items-center cursor-pointer",
                              habit.completed ? "line-through text-gray-500 dark:text-gray-400" : "",
                            )}
                          >
                            <span className="mr-2">{habit.emoji}</span>
                            {habit.title}
                          </label>
                          <Badge
                            className={cn(
                              "mt-1 text-xs",
                              categoryStyles[habit.category].lightBg,
                              categoryStyles[habit.category].textColor,
                            )}
                          >
                            {habit.category}
                          </Badge>
                        </div>
                      </div>

                      {habit.streak > 0 && (
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                          <Flame className="h-3 w-3 mr-1" /> {habit.streak}
                        </Badge>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
                      No {activeTab === "all" ? "" : activeTab} habits yet.
                    </p>
                    <Button
                      onClick={() => setIsAddHabitModalOpen(true)}
                      className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Your First Habit
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* XP Tracker */}
          <Card className="bg-gradient-to-br from-purple-100 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Zap className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" /> 💥 Daily XP Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">Today's XP</span>
                <span className="font-bold text-purple-700 dark:text-purple-300">{dailyXP} XP</span>
              </div>
              <Progress
                value={(dailyXP / 50) * 100}
                className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full"
                indicatorClassName="bg-gradient-to-r from-purple-500 to-indigo-500"
              />
              <div className="mt-2 text-xs text-right text-gray-500 dark:text-gray-400">
                {50 - dailyXP} XP until next reward
              </div>

              {habits.some((h) => h.streak > 0) && (
                <div className="mt-3 flex items-center text-orange-600 dark:text-orange-400">
                  <Flame className="h-4 w-4 mr-1 animate-pulse" />
                  <span className="text-sm font-medium">
                    {habits.filter((h) => h.completed).length} habits completed today
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* GPT Habit Suggestion */}
          <Card className="bg-gradient-to-r from-teal-100 to-blue-100 dark:from-teal-900/30 dark:to-blue-900/30 border-teal-200 dark:border-teal-800 shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-teal-200 dark:bg-teal-800 rounded-full p-2 mr-3">
                  <Star className="h-5 w-5 text-teal-600 dark:text-teal-300" />
                </div>
                <div>
                  <p className="font-medium">Want to build a new positive habit?</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Get personalized suggestions</p>
                </div>
              </div>
              <Button
                onClick={() => setIsGptHabitModalOpen(true)}
                className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white"
              >
                ✨ Suggest a New Habit
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section - Shared */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Progress Tile */}
        <Link href="/student/rewards" className="block">
          <Card className="bg-gradient-to-br from-blue-100 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800 shadow-md hover:shadow-lg transition-all h-full">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Award className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" /> 🏆 Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <p className="text-lg font-medium mb-2">
                  You've completed {completedGoalsCount} out of {totalGoalsCount} goals.
                </p>
                <Progress
                  value={completionPercentage}
                  className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full"
                  indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-500"
                />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{completionPercentage}% Complete</p>
              </div>

              <div className="flex items-center justify-center mt-4">
                <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-3 py-2 rounded-lg flex items-center">
                  <Flame className="h-5 w-5 mr-2 text-orange-500 animate-pulse" />
                  <span>Your highest streak is {highestStreak} days!</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex justify-center">
              <Button variant="ghost" className="text-blue-600 dark:text-blue-400 gap-1">
                View Rewards <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </Link>

        {/* Daily Inspiration */}
        <Link href="/student/reflection" className="block">
          <Card className="bg-gradient-to-br from-purple-100 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/20 border-purple-200 dark:border-purple-800 shadow-md hover:shadow-lg transition-all h-full">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" /> 💬 Daily Inspiration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-4">
                <p className="text-lg italic mb-3">"{quote.quote}"</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">— {quote.author}</p>
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex justify-center">
              <Button variant="ghost" className="text-purple-600 dark:text-purple-400 gap-1">
                Open Journal <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </Link>
      </div>

      {/* Modals */}
      <AddGoalModal
        isOpen={isAddGoalModalOpen}
        onClose={() => setIsAddGoalModalOpen(false)}
        onAddGoal={handleAddGoal}
      />

      <AddHabitModal
        isOpen={isAddHabitModalOpen}
        onClose={() => setIsAddHabitModalOpen(false)}
        onAddHabit={handleAddHabit}
      />

      <GoalSuggestionModal
        isOpen={isGptGoalModalOpen}
        onClose={() => setIsGptGoalModalOpen(false)}
        onAddGoal={handleAddGoal}
      />

      <SubmitEvidenceModal
        isOpen={isSubmitEvidenceModalOpen}
        onClose={() => setIsSubmitEvidenceModalOpen(false)}
        goalTitle={selectedGoal?.title || ""}
      />

      {/* Real Habit Suggestion Modal */}
      <Dialog open={isGptHabitModalOpen} onOpenChange={(open) => !open && setIsGptHabitModalOpen(false)}>
        <DialogContent className="sm:max-w-[500px] bg-gray-950 border border-gray-800 shadow-xl rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-blue-500/10 to-purple-500/10 pointer-events-none" />

          <DialogHeader className="pb-2">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
              ✨ Here's a Habit You Might Like!
            </DialogTitle>
          </DialogHeader>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-4">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-5 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-teal-900/50 text-teal-300 h-12 w-12 rounded-full flex items-center justify-center text-2xl">
                  🧘‍♂️
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Stretch for 2 minutes after waking up</h3>
                  <Badge className="bg-purple-900/50 text-purple-300 border-purple-700 mt-1">
                    <span className="mr-1">🧠</span> Mindset
                  </Badge>
                </div>
              </div>

              <div className="space-y-4 mb-4">
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                  <p className="text-gray-300 text-sm font-medium mb-1">💬 Motivation:</p>
                  <p className="text-white">
                    Stretching helps boost your focus and mood. Start your day feeling great!
                  </p>
                </div>

                <div className="bg-orange-900/20 border border-orange-800/30 rounded-lg p-3 flex items-start gap-3">
                  <Flame className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-orange-300 font-medium">Challenge:</p>
                    <p className="text-gray-300">Do it for 7 days in a row and earn a bonus XP badge!</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="ghost"
                  onClick={() => setIsGptHabitModalOpen(false)}
                  className="text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <X className="h-4 w-4 mr-1" /> Close
                </Button>

                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  onClick={() => {
                    // This would normally load a new suggestion
                    // For now just close the modal
                    setIsGptHabitModalOpen(false)
                  }}
                >
                  <ArrowRight className="h-4 w-4 mr-1" /> Suggest Another
                </Button>

                <Button
                  variant="outline"
                  className="border-blue-700 text-blue-300 hover:bg-blue-900/30 hover:text-blue-200"
                  onClick={() => {
                    // Open the add habit modal with prefilled data
                    setIsGptHabitModalOpen(false)
                    setIsAddHabitModalOpen(true)
                  }}
                >
                  <Edit className="h-4 w-4 mr-1" /> Customize First
                </Button>

                <Button
                  onClick={() => {
                    // Add the habit directly
                    handleAddHabit({
                      title: "Stretch for 2 minutes after waking up",
                      emoji: "🧘‍♂️",
                      category: "mindset",
                      xpReward: 5,
                    })

                    // Trigger confetti
                    triggerConfetti()

                    // Show success message (could be implemented with toast)
                    alert("🎉 New habit added to your list! Keep it up!")

                    setIsGptHabitModalOpen(false)
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add This Habit
                </Button>
              </div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor: ["#FFD700", "#FF3366", "#36CFFF", "#8A2BE2", "#FF8C00"][
                    Math.floor(Math.random() * 5)
                  ],
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
