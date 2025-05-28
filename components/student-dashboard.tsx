"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SidebarProvider } from "@/components/ui/sidebar"
import { StudentHeader } from "@/components/student/student-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useIsMobile } from "@/hooks/use-mobile"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Calendar,
  BookOpen,
  Award,
  Target,
  CheckSquare,
  Zap,
  ArrowRight,
  Flame,
  TrendingUp,
  Trophy,
  Sparkles,
  Rocket,
  CheckCircle2,
  Clock,
  GraduationCap,
  Upload,
  MessageSquare,
  FileText,
  Info,
  ChevronDown,
  Lightbulb,
  Gamepad,
  Coins,
  Brain,
  PenTool,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import confetti from "canvas-confetti"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Subject icons mapping
const subjectIcons = {
  Math: "📘",
  Science: "🔬",
  History: "📖",
  English: "📝",
  Art: "🎨",
  Music: "🎵",
  "Physical Education": "⚽",
  Geography: "🌎",
  Languages: "🗣️",
}

// Sample assignments data
const sampleAssignments = [
  {
    id: "1",
    title: "Math Quiz: Algebra",
    subject: "Math",
    dueDate: new Date(),
    status: "in-progress",
    priority: "high",
    description: "Complete the algebra quiz covering equations, inequalities, and graphing.",
    instructions: "Answer all 20 questions. Show your work for partial credit on problems 5-10.",
    rubric: "Each question is worth 5 points. Partial credit available for work shown.",
  },
  {
    id: "2",
    title: "Science Lab Report",
    subject: "Science",
    dueDate: new Date(Date.now() + 86400000), // Tomorrow
    status: "not-started",
    priority: "medium",
    description: "Write up your findings from the photosynthesis experiment.",
    instructions: "Include hypothesis, materials, procedure, results, and conclusion sections.",
    rubric: "Graded on accuracy, completeness, and scientific reasoning.",
  },
  {
    id: "3",
    title: "History Essay",
    subject: "History",
    dueDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
    status: "not-started",
    priority: "medium",
    description: "Write a 500-word essay on the causes of World War I.",
    instructions: "Focus on at least three major causes and their interconnections.",
    rubric: "Graded on historical accuracy, thesis development, and use of evidence.",
  },
  {
    id: "4",
    title: "English Book Report",
    subject: "English",
    dueDate: new Date(Date.now() - 86400000), // Yesterday
    status: "overdue",
    priority: "high",
    description: "Write a report on the novel you read this month.",
    instructions: "Include character analysis, plot summary, and personal reflection.",
    rubric: "Graded on comprehension, analysis, and writing mechanics.",
  },
]

// Sample grades data
const sampleGrades = [
  { subject: "Math", grade: 92, letter: "A" },
  { subject: "Science", grade: 84, letter: "B" },
  { subject: "History", grade: 77, letter: "C+" },
  { subject: "English", grade: 95, letter: "A" },
  { subject: "Art", grade: 88, letter: "B+" },
  { subject: "Music", grade: 90, letter: "A-" },
]

// Sample goals data
const sampleGoals = [
  {
    id: "1",
    title: "Read 20 pages",
    category: "academic",
    progress: 100,
    completed: true,
    completedDate: new Date(Date.now() - 86400000 * 2), // 2 days ago
  },
  {
    id: "2",
    title: "Complete Math Unit",
    category: "academic",
    progress: 40,
    completed: false,
    dueDate: new Date(Date.now() + 86400000 * 5), // 5 days from now
  },
  {
    id: "3",
    title: "Science Project",
    category: "academic",
    progress: 10,
    completed: false,
    dueDate: new Date(Date.now() + 86400000 * 14), // 14 days from now
  },
  {
    id: "4",
    title: "Practice Piano",
    category: "personal",
    progress: 100,
    completed: true,
    completedDate: new Date(Date.now() - 86400000), // 1 day ago
  },
]

// Weekly win messages
const weeklyWinMessages = [
  "You're crushing it!",
  "Keep the streak alive!",
  "You're making amazing progress!",
  "Your hard work is paying off!",
  "You're on fire this week!",
]

// Mood options with confirmation messages
const moodOptions = [
  { value: "excited", label: "Excited", emoji: "😃", message: "Energy unlocked! Make today awesome!" },
  { value: "happy", label: "Happy", emoji: "😊", message: "Right on! It's a happy day!" },
  { value: "focused", label: "Focused", emoji: "🧐", message: "Locked in! Let's go!" },
  { value: "tired", label: "Tired", emoji: "😴", message: "Sometimes rest is part of progress." },
  { value: "confused", label: "Confused", emoji: "🤔", message: "Let's untangle it together." },
  { value: "overwhelmed", label: "Overwhelmed", emoji: "😰", message: "One thing at a time — you're not alone." },
  { value: "sad", label: "Sad", emoji: "😔", message: "Hang in there — things will get better." },
  { value: "angry", label: "Angry", emoji: "😠", message: "Take a breath — you've got this." },
]

// Quick access tiles data
const quickAccessTiles = [
  {
    id: "goals",
    emoji: "🎯",
    title: "My Goals & Habits",
    description: "Set personal goals and build better routines.",
    ctaText: "View Goals",
    ctaLink: "/student/goals",
    bgClass: "from-purple-600/90 to-purple-900/90",
    iconBgClass: "from-purple-400 to-purple-600",
    icon: <Target className="h-6 w-6" />,
  },
  {
    id: "rewards",
    emoji: "🏆",
    title: "Rewards & XP",
    description: "See what you've earned and how to level up.",
    ctaText: "View Rewards",
    ctaLink: "/student/rewards",
    bgClass: "from-amber-500/90 to-yellow-700/90",
    iconBgClass: "from-amber-400 to-yellow-500",
    icon: <Award className="h-6 w-6" />,
    badge: "450 XP",
  },
  {
    id: "practice",
    emoji: "🧠",
    title: "Practice Mode",
    description: "Take a quiz, test your skills, or prep for class.",
    ctaText: "Start Practice",
    ctaLink: "/student/practice-tests",
    bgClass: "from-blue-600/90 to-blue-900/90",
    iconBgClass: "from-blue-400 to-blue-600",
    icon: <Brain className="h-6 w-6" />,
  },
  {
    id: "writing",
    emoji: "📝",
    title: "Submit Writing",
    description: "Turn in a journal entry or upload your latest paper.",
    ctaText: "Submit Writing",
    ctaLink: "/student/writing-submissions",
    bgClass: "from-pink-500/90 to-purple-700/90",
    iconBgClass: "from-pink-400 to-purple-500",
    icon: <PenTool className="h-6 w-6" />,
  },
  {
    id: "grades",
    emoji: "📊",
    title: "My Grades",
    description: "View your progress and subject scores.",
    ctaText: "Check Grades",
    ctaLink: "/student/grades",
    bgClass: "from-indigo-600/90 to-indigo-900/90",
    iconBgClass: "from-indigo-400 to-indigo-600",
    icon: <BarChart3 className="h-6 w-6" />,
  },
]

export default function StudentDashboard() {
  const [studentName, setStudentName] = useState("Enoch")
  const [coins, setCoins] = useState(120)
  const [xp, setXp] = useState(450)
  const [level, setLevel] = useState(5)
  const [streak, setStreak] = useState(7)
  const [dailyChallengeCompleted, setDailyChallengeCompleted] = useState(false)
  const [showRewardModal, setShowRewardModal] = useState(false)
  const [showChallengeModal, setShowChallengeModal] = useState(false)
  const [showAssignmentDetailsModal, setShowAssignmentDetailsModal] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [challengeReflection, setChallengeReflection] = useState("")
  const [motivationalQuote, setMotivationalQuote] = useState("")
  const [weeklyWinMessage, setWeeklyWinMessage] = useState("")
  const [assignments, setAssignments] = useState(sampleAssignments)
  const [grades, setGrades] = useState(sampleGrades)
  const [goals, setGoals] = useState(sampleGoals)
  const [currentMood, setCurrentMood] = useState(moodOptions[0])
  const [missionCompleted, setMissionCompleted] = useState(false)
  const [showMoodConfetti, setShowMoodConfetti] = useState(false)
  const [dailyXpEarned, setDailyXpEarned] = useState(25)
  const [dailyXpGoal, setDailyXpGoal] = useState(50)
  const [dailyCoinsEarned, setDailyCoinsEarned] = useState(15)
  const [dailyCoinsGoal, setDailyCoinsGoal] = useState(30)
  const [progressBarXpWidth, setProgressBarXpWidth] = useState(0)
  const [progressBarCoinsWidth, setProgressBarCoinsWidth] = useState(0)
  const isMobile = useIsMobile()
  const reflectionInputRef = useRef(null)
  const router = useRouter()
  const { toast } = useToast()
  const quickAccessRef = useRef(null)

  // Calculate level based on XP
  useEffect(() => {
    const newLevel = Math.floor(xp / 100) + 1
    setLevel(newLevel)
  }, [xp])

  // Set random motivational quote on load
  useEffect(() => {
    const quotes = [
      "Here's your learning adventure for today!",
      "You're on a roll, keep it up!",
      "Ready to make today amazing?",
      "Your brain is getting stronger every day!",
      "Learning is your superpower!",
    ]
    setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)])

    // Set random weekly win message
    setWeeklyWinMessage(weeklyWinMessages[Math.floor(Math.random() * weeklyWinMessages.length)])
  }, [])

  // Focus on the reflection input when the challenge modal opens
  useEffect(() => {
    if (showChallengeModal && reflectionInputRef.current) {
      setTimeout(() => {
        reflectionInputRef.current.focus()
      }, 100)
    }
  }, [showChallengeModal])

  // Animate progress bars
  useEffect(() => {
    // Animate XP progress bar
    const xpPercentage = (dailyXpEarned / dailyXpGoal) * 100
    let startXpWidth = 0
    const xpInterval = setInterval(() => {
      if (startXpWidth >= xpPercentage) {
        clearInterval(xpInterval)
      } else {
        startXpWidth += 1
        setProgressBarXpWidth(startXpWidth)
      }
    }, 10)

    // Animate Coins progress bar
    const coinsPercentage = (dailyCoinsEarned / dailyCoinsGoal) * 100
    let startCoinsWidth = 0
    const coinsInterval = setInterval(() => {
      if (startCoinsWidth >= coinsPercentage) {
        clearInterval(coinsInterval)
      } else {
        startCoinsWidth += 1
        setProgressBarCoinsWidth(startCoinsWidth)
      }
    }, 10)

    return () => {
      clearInterval(xpInterval)
      clearInterval(coinsInterval)
    }
  }, [dailyXpEarned, dailyXpGoal, dailyCoinsEarned, dailyCoinsGoal])

  const addCoinsAndXp = (coinsToAdd: number, xpToAdd: number) => {
    setCoins((prev) => prev + coinsToAdd)
    setXp((prev) => prev + xpToAdd)
  }

  const handleOpenChallengeModal = () => {
    if (!dailyChallengeCompleted) {
      setShowChallengeModal(true)
    }
  }

  const handleSubmitChallenge = (e) => {
    e.preventDefault()

    // Close the challenge modal
    setShowChallengeModal(false)

    // Trigger confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    // Show reward modal
    setShowRewardModal(true)

    // Update state
    setDailyChallengeCompleted(true)
    addCoinsAndXp(10, 15)
  }

  const handleViewAssignmentDetails = (assignment) => {
    setSelectedAssignment(assignment)
    setShowAssignmentDetailsModal(true)
  }

  const handleCompleteMission = () => {
    // Navigate to uploads page with pre-selected assignments
    router.push("/student/uploads?assignments=book-report,math-quiz")
  }

  const handleMoodChange = (mood) => {
    setCurrentMood(mood)

    // Trigger confetti
    setShowMoodConfetti(true)
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.5, x: 0.7 },
      colors: ["#FF9AA2", "#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7", "#C7CEEA"],
    })

    // Add XP
    addCoinsAndXp(0, 5)

    // Show toast notification
    toast({
      title: `+5 XP for sharing how you feel!`,
      description: mood.message,
      duration: 5000,
    })

    // Reset confetti flag after animation
    setTimeout(() => {
      setShowMoodConfetti(false)
    }, 2000)
  }

  // Format date for display
  const formatDueDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const assignmentDate = new Date(date)
    assignmentDate.setHours(0, 0, 0, 0)

    if (assignmentDate.getTime() === today.getTime()) {
      return "Today"
    } else if (assignmentDate.getTime() === tomorrow.getTime()) {
      return "Tomorrow"
    } else {
      return assignmentDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Done"
      case "in-progress":
        return "In Progress"
      case "overdue":
        return "Overdue"
      default:
        return "Not Started"
    }
  }

  // Get grade color
  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600 dark:text-green-400"
    if (grade >= 80) return "text-blue-600 dark:text-blue-400"
    if (grade >= 70) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  // Sort assignments by due date and status
  const sortedAssignments = [...assignments].sort((a, b) => {
    // Overdue assignments first
    if (a.status === "overdue" && b.status !== "overdue") return -1
    if (a.status !== "overdue" && b.status === "overdue") return 1

    // Then by due date
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })

  // Filter completed and in-progress goals
  const completedGoals = goals.filter((goal) => goal.completed)
  const inProgressGoals = goals.filter((goal) => !goal.completed)

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Student Header */}
        <StudentHeader studentName={studentName} level={level} xp={xp} coins={coins} streak={streak} />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pt-8 pb-16 px-5 sm:px-6 lg:px-8 w-full">
          <div className="max-w-6xl mx-auto">
            {/* Welcome Header and Top-Right Components */}
            <header className="mb-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                {/* Welcome Message - Left 1/3 */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="lg:w-1/3"
                >
                  <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 leading-tight">
                    Welcome back, {studentName}!
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mt-2 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
                    {motivationalQuote}
                  </p>
                </motion.div>

                {/* Right 2/3 - Mission and Mood */}
                <div className="flex flex-col sm:flex-row gap-5 w-full lg:w-2/3">
                  {/* Today's Mission Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex-1"
                  >
                    <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl h-full">
                      <CardContent className="p-6">
                        <div className="flex flex-col h-full">
                          <div className="flex items-start mb-4">
                            <div className="mr-3 mt-1">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white">
                                <Target className="h-6 w-6" />
                              </div>
                            </div>
                            <div>
                              <h3 className="font-bold text-xl text-indigo-700 dark:text-indigo-300">
                                Today's Mission
                              </h3>
                              <p className="text-base text-indigo-600 dark:text-indigo-400 mb-3">
                                Finish your book report + Math quiz!
                              </p>
                              <div className="flex items-center text-sm text-indigo-500 dark:text-indigo-300 mb-4">
                                <Lightbulb className="h-4 w-4 mr-1.5" />
                                Tip: Ask the GPT Mentor if you get stuck!
                              </div>
                            </div>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCompleteMission}
                            className="mt-auto w-full py-3 px-4 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                          >
                            <Upload className="h-5 w-5 mr-2" />
                            Complete The Mission
                          </motion.button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Avatar/Mood Picker */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex-1"
                  >
                    <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl h-full">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center h-full">
                          <h3 className="font-bold text-xl text-blue-700 dark:text-blue-300 mb-4">
                            How are you feeling today?
                          </h3>
                          <div className="relative">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-5xl mb-4 shadow-md"
                            >
                              {currentMood.emoji}
                            </motion.div>
                            {showMoodConfetti && (
                              <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-0 left-1/4 w-2 h-2 rounded-full bg-yellow-500 animate-confetti-1"></div>
                                <div className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-blue-500 animate-confetti-2"></div>
                                <div className="absolute top-0 left-3/4 w-2 h-2 rounded-full bg-pink-500 animate-confetti-3"></div>
                                <div className="absolute top-0 left-1/3 w-3 h-3 rounded-full bg-purple-500 animate-confetti-4"></div>
                                <div className="absolute top-0 left-2/3 w-3 h-3 rounded-full bg-green-500 animate-confetti-5"></div>
                              </div>
                            )}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="lg"
                                variant="outline"
                                className="rounded-full bg-white/50 dark:bg-gray-800/50 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-300 text-base px-5 py-2 h-auto"
                              >
                                {currentMood.label}
                                <ChevronDown className="h-4 w-4 ml-2" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48">
                              {moodOptions.map((mood) => (
                                <DropdownMenuItem
                                  key={mood.value}
                                  className="cursor-pointer py-2"
                                  onClick={() => handleMoodChange(mood)}
                                >
                                  <span className="mr-2 text-xl">{mood.emoji}</span>
                                  <span>{mood.label}</span>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </header>

            {/* Quick Access Tiles - NEW SECTION */}
            <motion.div
              ref={quickAccessRef}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8 overflow-hidden"
            >
              <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x">
                <div className="flex space-x-4 min-w-max">
                  {quickAccessTiles.map((tile, index) => (
                    <motion.div
                      key={tile.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                      whileHover={{
                        scale: 1.03,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      }}
                      className="w-64 sm:w-72 flex-shrink-0 snap-center"
                    >
                      <div
                        className={`relative h-full rounded-2xl overflow-hidden bg-gradient-to-br ${tile.bgClass} shadow-lg border border-white/10`}
                      >
                        {/* Animated background effects */}
                        <div className="absolute inset-0 overflow-hidden">
                          {tile.id === "goals" && (
                            <div className="absolute inset-0">
                              <div className="stars-container">
                                {[...Array(20)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="star"
                                    style={{
                                      top: `${Math.random() * 100}%`,
                                      left: `${Math.random() * 100}%`,
                                      animationDelay: `${Math.random() * 5}s`,
                                      width: `${Math.random() * 3 + 1}px`,
                                      height: `${Math.random() * 3 + 1}px`,
                                    }}
                                  ></div>
                                ))}
                              </div>
                            </div>
                          )}
                          {tile.id === "rewards" && (
                            <div className="absolute inset-0">
                              <div className="sparkles-container">
                                {[...Array(15)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="sparkle"
                                    style={{
                                      top: `${Math.random() * 100}%`,
                                      left: `${Math.random() * 100}%`,
                                      animationDelay: `${Math.random() * 5}s`,
                                      width: `${Math.random() * 4 + 2}px`,
                                      height: `${Math.random() * 4 + 2}px`,
                                    }}
                                  ></div>
                                ))}
                              </div>
                            </div>
                          )}
                          {tile.id === "practice" && (
                            <div className="absolute inset-0">
                              <div className="waves-container">
                                <div className="wave wave1"></div>
                                <div className="wave wave2"></div>
                              </div>
                            </div>
                          )}
                          {tile.id === "writing" && (
                            <div className="absolute inset-0">
                              <div className="page-turn"></div>
                            </div>
                          )}
                          {tile.id === "grades" && (
                            <div className="absolute inset-0">
                              <div className="glow-pulse"></div>
                            </div>
                          )}
                        </div>

                        <div className="relative p-5 flex flex-col h-full z-10">
                          {/* Emoji and Title */}
                          <div className="flex items-center mb-3">
                            <div
                              className={`w-10 h-10 rounded-full bg-gradient-to-br ${tile.iconBgClass} flex items-center justify-center text-white shadow-lg mr-3`}
                            >
                              {tile.icon}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white flex items-center">
                                <span className="mr-2">{tile.emoji}</span> {tile.title}
                              </h3>
                              {tile.badge && (
                                <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 text-white text-xs rounded-full">
                                  {tile.badge}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-white/80 text-sm mb-4">{tile.description}</p>

                          {/* CTA Button */}
                          <div className="mt-auto">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-full py-2.5 px-4 bg-white/15 hover:bg-white/25 text-white font-medium rounded-xl backdrop-blur-sm transition-all flex items-center justify-center"
                              onClick={() => router.push(tile.ctaLink)}
                            >
                              {tile.ctaText}
                              <ArrowRight className="h-4 w-4 ml-1.5" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Dashboard Tabs */}
            <Tabs defaultValue="overview" className="mb-8">
              <TabsList className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-1.5 rounded-full border border-gray-200 dark:border-gray-700">
                <TabsTrigger
                  value="overview"
                  className="rounded-full text-base py-2 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="progress"
                  className="rounded-full text-base py-2 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
                >
                  Progress
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab Content */}
              <TabsContent value="overview" className="space-y-8">
                {/* Upcoming Assignments */}
                <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 rounded-xl">
                  <CardHeader className="pb-2 pt-6 px-6 bg-gradient-to-r from-blue-500/10 to-blue-500/5">
                    <CardTitle className="flex items-center text-xl">
                      <BookOpen className="h-6 w-6 mr-2 text-blue-500" />
                      Upcoming Assignments
                    </CardTitle>
                    <CardDescription className="text-base">
                      Assignments due soon or requiring your attention
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-5 px-6">
                    {sortedAssignments.length > 0 ? (
                      <ul className="space-y-4">
                        {sortedAssignments.map((assignment) => (
                          <motion.li
                            key={assignment.id}
                            whileHover={{ x: 4 }}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors gap-4"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl">
                                <span>{subjectIcons[assignment.subject] || "📚"}</span>
                              </div>
                              <div>
                                <p className="font-medium text-lg">{assignment.title}</p>
                                <div className="flex items-center flex-wrap gap-2 mt-1">
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{assignment.subject}</p>
                                  <span className="text-gray-300 dark:text-gray-600">•</span>
                                  <div
                                    className={`text-sm ${assignment.status === "overdue" ? "text-red-500 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}`}
                                  >
                                    {formatDueDate(assignment.dueDate)}
                                  </div>
                                  <Badge className={`${getStatusColor(assignment.status)}`}>
                                    {getStatusLabel(assignment.status)}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                              <Button
                                size="sm"
                                className="rounded-lg bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md transition-all flex-1 sm:flex-none h-10"
                                onClick={() => handleViewAssignmentDetails(assignment)}
                              >
                                <FileText className="h-4 w-4 mr-1.5" />
                                View Details
                              </Button>
                              <Button
                                size="sm"
                                className="rounded-lg bg-purple-500 hover:bg-purple-600 text-white shadow-sm hover:shadow-md transition-all flex-1 sm:flex-none h-10"
                                asChild
                              >
                                <Link href={`/student/chat?assignment=${encodeURIComponent(assignment.title)}`}>
                                  <MessageSquare className="h-4 w-4 mr-1.5" />
                                  Ask GPT for Help
                                </Link>
                              </Button>
                              <Button
                                size="sm"
                                className="rounded-lg bg-green-500 hover:bg-green-600 text-white shadow-sm hover:shadow-md transition-all flex-1 sm:flex-none h-10"
                                asChild
                              >
                                <Link
                                  href={`/student/uploads?subject=${encodeURIComponent(assignment.subject)}&assignment=${assignment.id}`}
                                >
                                  <Upload className="h-4 w-4 mr-1.5" />
                                  Upload Work
                                </Link>
                              </Button>
                            </div>
                          </motion.li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle2 className="h-14 w-14 mx-auto text-green-500 mb-3" />
                        <p className="text-lg text-gray-500 dark:text-gray-400">No upcoming assignments!</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0 pb-5 px-6">
                    <Button
                      variant="link"
                      size="lg"
                      className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-base"
                      asChild
                    >
                      <Link href="/student/assignments">
                        Go to Assignments <ArrowRight className="h-4 w-4 ml-1.5" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Grade Snapshot */}
                  <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 rounded-xl">
                    <CardHeader className="pb-2 pt-6 px-6 bg-gradient-to-r from-green-500/10 to-green-500/5">
                      <CardTitle className="flex items-center text-xl">
                        <GraduationCap className="h-6 w-6 mr-2 text-green-500" />
                        Grade Snapshot
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5 px-6">
                      <div className="grid grid-cols-2 gap-3">
                        {grades.map((grade, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.03 }}
                            className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm mr-2">
                                <span>{subjectIcons[grade.subject] || "📚"}</span>
                              </div>
                              <span className="font-medium">{grade.subject}</span>
                            </div>
                            <div className={`font-bold ${getGradeColor(grade.grade)}`}>
                              {grade.grade}% ({grade.letter})
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 pb-5 px-6">
                      <Button
                        variant="link"
                        size="lg"
                        className="text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 text-base"
                        asChild
                      >
                        <Link href="/student/grades">
                          Open Gradebook <ArrowRight className="h-4 w-4 ml-1.5" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Daily Challenge Card */}
                  <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 rounded-xl">
                    <CardHeader className="pb-2 pt-6 px-6 bg-gradient-to-r from-yellow-500/10 to-yellow-500/5">
                      <CardTitle className="flex items-center text-xl">
                        <Zap className="h-6 w-6 mr-2 text-yellow-500" />
                        Daily Challenge
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5 px-6">
                      <p className="text-base mb-4">Complete a 15-minute focused study session without distractions.</p>
                      <div className="flex items-center justify-between">
                        <div className="text-base">
                          <span className="font-medium">Reward: </span>
                          <span className="text-amber-500">10 coins</span>
                          <span> + </span>
                          <span className="text-blue-500">15 XP</span>
                        </div>
                        <Button
                          size="lg"
                          onClick={handleOpenChallengeModal}
                          disabled={dailyChallengeCompleted}
                          className={
                            dailyChallengeCompleted
                              ? "bg-green-500 hover:bg-green-600 text-base h-11 px-5"
                              : "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-base h-11 px-5"
                          }
                        >
                          {dailyChallengeCompleted ? (
                            <span className="flex items-center">
                              <CheckCircle2 className="h-5 w-5 mr-1.5" /> Completed
                            </span>
                          ) : (
                            "Complete"
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Streak & XP Progress */}
                <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 rounded-xl">
                  <CardHeader className="pb-2 pt-6 px-6 bg-gradient-to-r from-orange-500/10 to-orange-500/5">
                    <CardTitle className="flex items-center text-xl">
                      <Flame className="h-6 w-6 mr-2 text-orange-500" />
                      Streak & XP Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-5 px-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                      {/* Streak Display */}
                      <div className="flex items-center">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-white flex items-center justify-center mr-4">
                          <Flame className="h-7 w-7" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xl">{streak}-Day Streak</h4>
                          <p className="text-base text-gray-600 dark:text-gray-400">Keep it going!</p>
                        </div>
                      </div>

                      {/* Level & XP */}
                      <div className="flex-1 max-w-md">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium text-base">Level {level}</span>
                          <span className="text-base text-purple-500 dark:text-purple-400">
                            {100 - (xp % 100)} XP to Level {level + 1}
                          </span>
                        </div>
                        <Progress
                          value={xp % 100}
                          className="h-4 bg-gray-100 dark:bg-gray-700"
                          indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-600"
                        />
                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                          <span>{xp} XP</span>
                          <span>{Math.floor(xp / 100) * 100 + 100} XP</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Today's Progress Card - NEW */}
                <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 rounded-xl">
                  <CardHeader className="pb-2 pt-6 px-6 bg-gradient-to-r from-blue-500/10 to-violet-500/10">
                    <CardTitle className="flex items-center text-xl">
                      <Gamepad className="h-6 w-6 mr-2 text-blue-500" />🎮 Today's Progress
                    </CardTitle>
                    <CardDescription className="text-base">
                      Track your XP and Coins as you complete your tasks.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-5 px-6">
                    <div className="space-y-6">
                      {/* XP Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-base font-medium flex items-center">
                            <Sparkles className="h-4 w-4 mr-1.5 text-blue-500" /> XP Earned
                          </span>
                          <span className="font-medium">
                            {dailyXpEarned} / {dailyXpGoal}
                          </span>
                        </div>
                        <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progressBarXpWidth}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Coins Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-base font-medium flex items-center">
                            <Coins className="h-4 w-4 mr-1.5 text-green-500" /> Coins Earned
                          </span>
                          <span className="font-medium">
                            {dailyCoinsEarned} / {dailyCoinsGoal}
                          </span>
                        </div>
                        <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progressBarCoinsWidth}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Progress Tab Content */}
              <TabsContent value="progress" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* XP & Level Progress */}
                  <Card className="overflow-hidden border-0 shadow-md bg-white dark:bg-gray-800 rounded-xl">
                    <CardHeader className="pt-6 px-6 bg-gradient-to-r from-blue-500/10 to-purple-500/5">
                      <CardTitle className="flex items-center text-xl">
                        <TrendingUp className="h-6 w-6 mr-2 text-blue-500" />
                        XP & Level Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 px-6">
                      <div className="space-y-5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-xl mr-4">
                              {level}
                            </div>
                            <div>
                              <h4 className="font-medium text-lg">Level {level}</h4>
                              <p className="text-base text-gray-500 dark:text-gray-400">
                                {xp} XP out of {level * 100} XP
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-base font-medium text-purple-500">
                              {100 - (xp % 100)} XP to Level {level + 1}
                            </span>
                          </div>
                        </div>

                        <div>
                          <Progress
                            value={xp % 100}
                            className="h-5 bg-gray-100 dark:bg-gray-700 rounded-full"
                            indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                          />
                        </div>

                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                          <span>Level {level}</span>
                          <span>Level {level + 1}</span>
                        </div>

                        <div className="pt-3">
                          <h4 className="font-medium text-base mb-3">Recent XP Earned</h4>
                          <ul className="space-y-3">
                            <li className="flex justify-between text-base">
                              <span className="flex items-center">
                                <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                                Daily Challenge
                              </span>
                              <span className="font-medium text-blue-500">+15 XP</span>
                            </li>
                            <li className="flex justify-between text-base">
                              <span className="flex items-center">
                                <BookOpen className="h-5 w-5 mr-2 text-purple-500" />
                                Math Assignment
                              </span>
                              <span className="font-medium text-blue-500">+25 XP</span>
                            </li>
                            <li className="flex justify-between text-base">
                              <span className="flex items-center">
                                <Target className="h-5 w-5 mr-2 text-green-500" />
                                Goal Completed
                              </span>
                              <span className="font-medium text-blue-500">+20 XP</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Goals Completed */}
                  <Card className="overflow-hidden border-0 shadow-md bg-white dark:bg-gray-800 rounded-xl">
                    <CardHeader className="pt-6 px-6 bg-gradient-to-r from-green-500/10 to-green-500/5">
                      <CardTitle className="flex items-center text-xl">
                        <CheckSquare className="h-6 w-6 mr-2 text-green-500" />
                        Goals
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 px-6">
                      {/* Completed Goals */}
                      {completedGoals.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-base font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                            <CheckCircle2 className="h-5 w-5 mr-1.5 text-green-500" /> Completed
                          </h3>
                          <ul className="space-y-3">
                            {completedGoals.map((goal) => (
                              <motion.li
                                key={goal.id}
                                whileHover={{ x: 4 }}
                                className="flex items-start p-4 rounded-lg bg-green-50 dark:bg-green-900/20"
                              >
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300 flex items-center justify-center mr-3">
                                  <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-base">{goal.title}</h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Completed{" "}
                                    {goal.completedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                  </p>
                                </div>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* In Progress Goals */}
                      {inProgressGoals.length > 0 && (
                        <div>
                          <h3 className="text-base font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                            <Clock className="h-5 w-5 mr-1.5 text-blue-500" /> In Progress
                          </h3>
                          <ul className="space-y-3">
                            {inProgressGoals.map((goal) => (
                              <motion.li
                                key={goal.id}
                                whileHover={{ x: 4 }}
                                className="flex items-start p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20"
                              >
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 flex items-center justify-center mr-3">
                                  <Target className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-base">{goal.title}</h4>
                                  <div className="flex items-center mt-2">
                                    <Progress
                                      value={goal.progress}
                                      className="h-3 w-28 bg-blue-100 dark:bg-blue-800"
                                      indicatorClassName="bg-blue-500"
                                    />
                                    <span className="ml-2 text-sm font-medium">{goal.progress}%</span>
                                  </div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Due {goal.dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                  </p>
                                </div>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <Button
                        variant="link"
                        size="lg"
                        className="mt-4 px-0 text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 text-base"
                        asChild
                      >
                        <Link href="/student/goals">
                          View all goals <ArrowRight className="h-4 w-4 ml-1.5" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Weekly Wins */}
                  <Card className="overflow-hidden border-0 shadow-md bg-white dark:bg-gray-800 rounded-xl md:col-span-2">
                    <CardHeader className="pt-6 px-6 bg-gradient-to-r from-yellow-500/10 to-yellow-500/5">
                      <CardTitle className="flex items-center text-xl">
                        <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
                        Weekly Wins
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 px-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-5"
                        >
                          <div className="flex items-center">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 text-white flex items-center justify-center mr-4">
                              <Calendar className="h-7 w-7" />
                            </div>
                            <div>
                              <h4 className="font-medium text-xl">4 days active this week</h4>
                              <p className="text-base text-gray-600 dark:text-gray-300">
                                You've been consistent with your learning!
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-5"
                        >
                          <div className="flex items-center">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-white flex items-center justify-center mr-4">
                              <Flame className="h-7 w-7" />
                            </div>
                            <div>
                              <h4 className="font-medium text-xl">Maintained {streak}-day streak</h4>
                              <p className="text-base text-gray-600 dark:text-gray-300">{weeklyWinMessage}</p>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-5"
                        >
                          <div className="flex items-center">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white flex items-center justify-center mr-4">
                              <Award className="h-7 w-7" />
                            </div>
                            <div>
                              <h4 className="font-medium text-xl">Earned 90 XP + 30 coins</h4>
                              <p className="text-base text-gray-600 dark:text-gray-300">Great progress this week!</p>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Daily Challenge Reflection Modal */}
      <Dialog open={showChallengeModal} onOpenChange={setShowChallengeModal}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 rounded-xl border-0 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-500" />
              Daily Challenge
            </DialogTitle>
            <DialogDescription className="text-base">
              Take a moment to reflect on what you learned or focused on today.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitChallenge}>
            <div className="space-y-4 py-2">
              <Textarea
                ref={reflectionInputRef}
                placeholder="What did you learn or focus on today?"
                className="min-h-[120px] resize-none text-base p-4"
                value={challengeReflection}
                onChange={(e) => setChallengeReflection(e.target.value)}
              />
            </div>
            <DialogFooter className="mt-4">
              <Button
                type="submit"
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white text-base h-11 px-5"
                disabled={!challengeReflection.trim()}
              >
                Submit Reflection
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Daily Challenge Completion Modal */}
      <AnimatePresence>
        {showRewardModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 shadow-xl"
            >
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 mx-auto flex items-center justify-center mb-5">
                  <Rocket className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-3">🎉 Great job, {studentName}!</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-5">
                  You earned <span className="font-bold text-blue-500">+15 XP</span> and{" "}
                  <span className="font-bold text-amber-500">10 coins</span> for reflecting on today's learning.
                </p>
                <Button
                  onClick={() => setShowRewardModal(false)}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white text-base h-11 px-6"
                >
                  Got it!
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Assignment Details Modal */}
      <Dialog open={showAssignmentDetailsModal} onOpenChange={setShowAssignmentDetailsModal}>
        <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-800 rounded-xl border-0 shadow-xl">
          {selectedAssignment && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl">
                    <span>{subjectIcons[selectedAssignment.subject] || "📚"}</span>
                  </div>
                  <DialogTitle className="text-2xl font-bold">{selectedAssignment.title}</DialogTitle>
                </div>
                <DialogDescription className="flex items-center gap-2 mt-2">
                  <Badge className={`${getStatusColor(selectedAssignment.status)} text-sm py-1 px-2`}>
                    {getStatusLabel(selectedAssignment.status)}
                  </Badge>
                  <span
                    className={`text-base ${
                      selectedAssignment.status === "overdue"
                        ? "text-red-500 dark:text-red-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    Due: {formatDueDate(selectedAssignment.dueDate)}
                  </span>
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-5 py-3">
                <div>
                  <h3 className="text-base font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                    <Info className="h-5 w-5 mr-1.5 text-blue-500" /> Description
                  </h3>
                  <p className="text-base text-gray-700 dark:text-gray-300">{selectedAssignment.description}</p>
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                    <FileText className="h-5 w-5 mr-1.5 text-purple-500" /> Instructions
                  </h3>
                  <p className="text-base text-gray-700 dark:text-gray-300">{selectedAssignment.instructions}</p>
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                    <CheckSquare className="h-5 w-5 mr-1.5 text-green-500" /> Rubric
                  </h3>
                  <p className="text-base text-gray-700 dark:text-gray-300">{selectedAssignment.rubric}</p>
                </div>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-0 mt-2">
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="flex-1 sm:flex-none text-base h-11 px-4 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    asChild
                  >
                    <Link href={`/student/chat?assignment=${encodeURIComponent(selectedAssignment.title)}`}>
                      <MessageSquare className="h-5 w-5 mr-2 text-purple-500" />
                      Ask GPT for Help
                    </Link>
                  </Button>
                  <Button
                    className="flex-1 sm:flex-none bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-base h-11 px-4"
                    asChild
                  >
                    <Link
                      href={`/student/uploads?subject=${encodeURIComponent(selectedAssignment.subject)}&assignment=${selectedAssignment.id}`}
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      Upload Work
                    </Link>
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
