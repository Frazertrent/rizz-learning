"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import {
  FileUp,
  FileText,
  PuzzleIcon as PuzzlePiece,
  Calendar,
  Book,
  Sparkles,
  Brain,
  Wand2,
  Loader2,
  ArrowLeft,
  ListPlus,
  Eye,
  CheckCircle,
  Clock,
  GraduationCap,
  Target,
  ArrowRight,
  Edit,
  Plus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

// Types
interface Class {
  id: string
  title: string
  meetingDays: string
  meetingTime: string
  assignmentCount: number
  testCount: number
  startDate: string
  endDate: string
  approved: boolean
  skipped: boolean
}

interface Assignment {
  id: string
  title: string
  dueDate: string
  type: "homework" | "quiz" | "test" | "project"
  points: number
}

export function SyllabusUpload() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [activeMethod, setActiveMethod] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzeProgress, setAnalyzeProgress] = useState(0)
  const [analyzeStatus, setAnalyzeStatus] = useState("")
  const [detectedClasses, setDetectedClasses] = useState<Class[]>([])
  const [sampleAssignments, setSampleAssignments] = useState<Assignment[]>([])
  const [manualClass, setManualClass] = useState({
    title: "",
    meetingDays: "",
    meetingTime: "",
    startDate: "",
    endDate: "",
  })
  const [autoGenerateClass, setAutoGenerateClass] = useState({
    title: "",
    schedulePattern: "",
    duration: "",
    startDate: "",
    endDate: "",
    notes: "",
  })
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [syllabusText, setSyllabusText] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Loading states
  const [isFileLoading, setIsFileLoading] = useState(false)
  const [isTextLoading, setIsTextLoading] = useState(false)
  const [isTemplateLoading, setIsTemplateLoading] = useState(false)
  const [isAutoLoading, setIsAutoLoading] = useState(false)

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [autoGenerateMessages, setAutoGenerateMessages] = useState<string[]>([
    "🧠 Thinking...",
    "📚 Building your plan...",
    "✅ Creating assignments...",
    "🎯 Setting goals...",
    "Almost there!",
  ])
  const [currentAutoMessage, setCurrentAutoMessage] = useState(0)

  // Ref for scrolling to Step 2
  const step2Ref = useRef<HTMLDivElement>(null)

  // Function to scroll to Step 2
  const scrollToStep2 = () => {
    if (step2Ref.current) {
      setTimeout(() => {
        step2Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 300)
    }
  }

  // Function to trigger confetti animation
  const triggerConfetti = () => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: randomInRange(0.1, 0.3) },
        colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"],
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: randomInRange(0.1, 0.3) },
        colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"],
      })
    }, 250)
  }

  // Auto-generate message cycling effect
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isAutoLoading) {
      interval = setInterval(() => {
        setCurrentAutoMessage((prev) => (prev < autoGenerateMessages.length - 1 ? prev + 1 : prev))
      }, 400)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isAutoLoading, autoGenerateMessages])

  // Generate sample assignments for review
  const generateSampleAssignments = (classTitle: string): Assignment[] => {
    const assignmentTypes: ("homework" | "quiz" | "test" | "project")[] = ["homework", "quiz", "test", "project"]
    const assignmentTitles = {
      homework: ["Reading Assignment", "Practice Problems", "Worksheet", "Review Questions", "Vocabulary Exercise"],
      quiz: ["Chapter Quiz", "Concept Check", "Pop Quiz", "Knowledge Check", "Quick Assessment"],
      test: ["Unit Test", "Midterm Exam", "Final Exam", "Chapter Test", "Comprehensive Assessment"],
      project: ["Research Project", "Group Presentation", "Creative Assignment", "Lab Report", "Portfolio Submission"],
    }

    const months = ["Sep", "Oct", "Nov", "Dec"]
    const sampleAssignments: Assignment[] = []

    // Generate 4-6 sample assignments
    const count = Math.floor(Math.random() * 3) + 4

    for (let i = 0; i < count; i++) {
      const type = assignmentTypes[Math.floor(Math.random() * assignmentTypes.length)]
      const titles = assignmentTitles[type]
      const title = `${classTitle}: ${titles[Math.floor(Math.random() * titles.length)]}`
      const month = months[Math.floor(Math.random() * months.length)]
      const day = Math.floor(Math.random() * 28) + 1
      const points = type === "test" ? 100 : type === "project" ? 50 : type === "quiz" ? 25 : 10

      sampleAssignments.push({
        id: `assignment-${Date.now()}-${i}`,
        title,
        dueDate: `${month} ${day}`,
        type,
        points,
      })
    }

    // Sort by due date (simple string comparison)
    return sampleAssignments.sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  }

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    const file = e.target.files[0]
    setSelectedFile(file)
    setActiveMethod("file")
  }

  // Process file upload
  const handleFileUpload = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }

    setIsFileLoading(true)
    setIsAnalyzing(true)
    setAnalyzeProgress(0)
    setAnalyzeStatus("📖 Scanning syllabus...")

    // Simulate progress updates
    const interval = setInterval(() => {
      setAnalyzeProgress((prev) => {
        const newProgress = prev + Math.floor(Math.random() * 15) + 5

        if (newProgress >= 40 && newProgress < 70) {
          setAnalyzeStatus("⏳ Analyzing content...")
        } else if (newProgress >= 70 && newProgress < 100) {
          setAnalyzeStatus("🔍 Identifying classes and assignments...")
        }

        return Math.min(newProgress, 100)
      })
    }, 600)

    // After "analysis" is complete
    setTimeout(() => {
      clearInterval(interval)
      setAnalyzeProgress(100)

      // Generate mock classes
      const possibleClasses = ["Math 6", "Language Arts", "Science", "History", "Art", "Music", "Physical Education"]
      const classCount = Math.floor(Math.random() * 3) + 2
      const selectedClasses = []

      for (let i = 0; i < classCount; i++) {
        const randomIndex = Math.floor(Math.random() * possibleClasses.length)
        selectedClasses.push(possibleClasses[randomIndex])
        possibleClasses.splice(randomIndex, 1)

        if (possibleClasses.length === 0) break
      }

      const mockClasses = generateMockClasses(selectedClasses, classCount)
      const totalAssignments = mockClasses.reduce((sum, cls) => sum + cls.assignmentCount + cls.testCount, 0)

      setAnalyzeStatus(`✅ Found ${mockClasses.length} classes, ${totalAssignments} assignments`)
      setDetectedClasses(mockClasses)

      // Generate sample assignments for the first class
      if (mockClasses.length > 0) {
        setSampleAssignments(generateSampleAssignments(mockClasses[0].title))
      }

      setTimeout(() => {
        setIsAnalyzing(false)
        setIsFileLoading(false)
        // Advance to step 2 and scroll to it
        setStep(2)
        scrollToStep2()
      }, 1000)
    }, 3500)
  }

  // Process text analysis
  const handleTextAnalysis = () => {
    if (!syllabusText.trim()) {
      toast({
        title: "Please enter some text",
        description: "We need some content to analyze",
        variant: "destructive",
      })
      return
    }

    setIsTextLoading(true)
    setIsAnalyzing(true)
    setAnalyzeProgress(0)
    setAnalyzeStatus("📖 Scanning syllabus text...")

    // Simulate progress updates
    const interval = setInterval(() => {
      setAnalyzeProgress((prev) => {
        const newProgress = prev + Math.floor(Math.random() * 15) + 5

        if (newProgress >= 40 && newProgress < 70) {
          setAnalyzeStatus("⏳ Analyzing content...")
        } else if (newProgress >= 70 && newProgress < 100) {
          setAnalyzeStatus("🔍 Identifying classes and assignments...")
        }

        return Math.min(newProgress, 100)
      })
    }, 600)

    // After "analysis" is complete
    setTimeout(() => {
      clearInterval(interval)
      setAnalyzeProgress(100)

      // Generate mock classes
      const possibleClasses = ["Math 6", "Language Arts", "Science", "History", "Art", "Music", "Physical Education"]
      const classCount = Math.floor(Math.random() * 3) + 2
      const selectedClasses = []

      for (let i = 0; i < classCount; i++) {
        const randomIndex = Math.floor(Math.random() * possibleClasses.length)
        selectedClasses.push(possibleClasses[randomIndex])
        possibleClasses.splice(randomIndex, 1)

        if (possibleClasses.length === 0) break
      }

      const mockClasses = generateMockClasses(selectedClasses, classCount)
      const totalAssignments = mockClasses.reduce((sum, cls) => sum + cls.assignmentCount + cls.testCount, 0)

      setAnalyzeStatus(`✅ Found ${mockClasses.length} classes, ${totalAssignments} assignments`)
      setDetectedClasses(mockClasses)

      // Generate sample assignments for the first class
      if (mockClasses.length > 0) {
        setSampleAssignments(generateSampleAssignments(mockClasses[0].title))
      }

      setTimeout(() => {
        setIsAnalyzing(false)
        setIsTextLoading(false)
        // Advance to step 2 and scroll to it
        setStep(2)
        scrollToStep2()
      }, 1000)
    }, 3500)
  }

  // Process template selection
  const handleTemplateSelection = () => {
    if (!selectedTemplate) {
      toast({
        title: "No template selected",
        description: "Please select a template to continue",
        variant: "destructive",
      })
      return
    }

    setIsTemplateLoading(true)
    setIsAnalyzing(true)
    setAnalyzeProgress(0)
    setAnalyzeStatus("📖 Loading template...")

    // Simulate progress updates
    const interval = setInterval(() => {
      setAnalyzeProgress((prev) => {
        const newProgress = prev + Math.floor(Math.random() * 15) + 5

        if (newProgress >= 40 && newProgress < 70) {
          setAnalyzeStatus("⏳ Customizing template...")
        } else if (newProgress >= 70 && newProgress < 100) {
          setAnalyzeStatus("🔍 Creating assignments...")
        }

        return Math.min(newProgress, 100)
      })
    }, 600)

    // After "analysis" is complete
    setTimeout(() => {
      clearInterval(interval)
      setAnalyzeProgress(100)

      // Generate mock classes based on the template
      let mockClasses: Class[] = []

      if (selectedTemplate === "math6") {
        mockClasses = generateMockClasses(["Math 6"], 1)
      } else if (selectedTemplate === "languageArts") {
        mockClasses = generateMockClasses(["Language Arts 6"], 1)
      } else if (selectedTemplate === "scienceBiology") {
        mockClasses = generateMockClasses(["Biology"], 1)
      } else {
        mockClasses = generateMockClasses(["General Science"], 1)
      }

      const totalAssignments = mockClasses.reduce((sum, cls) => sum + cls.assignmentCount + cls.testCount, 0)

      setAnalyzeStatus(`✅ Template ready with ${totalAssignments} assignments`)
      setDetectedClasses(mockClasses)

      // Generate sample assignments for the first class
      if (mockClasses.length > 0) {
        setSampleAssignments(generateSampleAssignments(mockClasses[0].title))
      }

      setTimeout(() => {
        setIsAnalyzing(false)
        setIsTemplateLoading(false)
        // Advance to step 2 and scroll to it
        setStep(2)
        scrollToStep2()
      }, 1000)
    }, 3000)
  }

  // Process auto-generate class
  const handleAutoGenerateClass = (e: React.FormEvent) => {
    e.preventDefault()

    if (!autoGenerateClass.title || !autoGenerateClass.schedulePattern) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Reset message index and start loading
    setCurrentAutoMessage(0)
    setIsAutoLoading(true)
    setIsAnalyzing(true)
    setAnalyzeProgress(0)
    setAnalyzeStatus("🧠 Building your plan...")

    // Simulate progress updates
    const interval = setInterval(() => {
      setAnalyzeProgress((prev) => {
        const newProgress = prev + Math.floor(Math.random() * 15) + 5

        if (newProgress >= 40 && newProgress < 70) {
          setAnalyzeStatus("📚 Creating assignments...")
        } else if (newProgress >= 70 && newProgress < 100) {
          setAnalyzeStatus("✅ Almost there!")
        }

        return Math.min(newProgress, 100)
      })
    }, 600)

    // After "analysis" is complete
    setTimeout(() => {
      clearInterval(interval)
      setAnalyzeProgress(100)

      // Create auto-generated class
      const meetingDays =
        autoGenerateClass.schedulePattern === "everyday"
          ? "Mon/Tue/Wed/Thu/Fri"
          : autoGenerateClass.schedulePattern === "mwf"
            ? "Mon/Wed/Fri"
            : "Weekly"

      const newClass: Class = {
        id: `auto-${Date.now()}`,
        title: autoGenerateClass.title,
        meetingDays: meetingDays,
        meetingTime: "10:00AM",
        assignmentCount: Math.floor(Math.random() * 15) + 10,
        testCount: Math.floor(Math.random() * 4) + 2,
        startDate: autoGenerateClass.startDate || "Sep 1",
        endDate: autoGenerateClass.endDate || "Dec 15",
        approved: false,
        skipped: false,
      }

      setDetectedClasses([newClass])

      // Generate sample assignments for review
      setSampleAssignments(generateSampleAssignments(newClass.title))

      setTimeout(() => {
        setIsAnalyzing(false)
        setIsAutoLoading(false)
        // Advance to step 2 and scroll to it
        setStep(2)
        scrollToStep2()
      }, 1000)
    }, 3000)
  }

  // Handle confirmation of the plan
  const handleConfirmPlan = () => {
    // Show success modal and trigger confetti
    setShowSuccessModal(true)
    triggerConfetti()

    // Show toast notification
    toast({
      title: "🎉 Success!",
      description: "Your learning plan is ready to go!",
    })

    // Advance to step 3
    setStep(3)
  }

  // Generate mock classes with random data
  const generateMockClasses = (classNames: string[], count: number): Class[] => {
    const days = ["Mon/Wed", "Tue/Thu", "Mon/Wed/Fri", "Tue/Thu/Fri"]
    const times = ["9:00AM", "10:30AM", "1:00PM", "2:30PM"]
    const startMonths = ["Aug", "Sep"]
    const endMonths = ["Dec", "Jan"]

    return classNames.map((name, index) => ({
      id: `class-${Date.now()}-${index}`,
      title: name,
      meetingDays: days[Math.floor(Math.random() * days.length)],
      meetingTime: times[Math.floor(Math.random() * times.length)],
      assignmentCount: Math.floor(Math.random() * 15) + 5,
      testCount: Math.floor(Math.random() * 4) + 1,
      startDate: `${startMonths[Math.floor(Math.random() * startMonths.length)]} ${Math.floor(Math.random() * 15) + 1}`,
      endDate: `${endMonths[Math.floor(Math.random() * endMonths.length)]} ${Math.floor(Math.random() * 15) + 1}`,
      approved: false,
      skipped: false,
    }))
  }

  // Reset the process
  const handleReset = () => {
    setStep(1)
    setActiveMethod("")
    setIsAnalyzing(false)
    setAnalyzeProgress(0)
    setAnalyzeStatus("")
    setDetectedClasses([])
    setSampleAssignments([])
    setManualClass({
      title: "",
      meetingDays: "",
      meetingTime: "",
      startDate: "",
      endDate: "",
    })
    setAutoGenerateClass({
      title: "",
      schedulePattern: "",
      duration: "",
      startDate: "",
      endDate: "",
      notes: "",
    })
    setSelectedTemplate("")
    setSyllabusText("")
    setSelectedFile(null)
    setShowSuccessModal(false)
    setIsFileLoading(false)
    setIsTextLoading(false)
    setIsTemplateLoading(false)
    setIsAutoLoading(false)
  }

  // Navigate to other pages
  const navigateTo = (path: string) => {
    router.push(path)
  }

  // Get badge color based on assignment type
  const getAssignmentBadgeColor = (type: string) => {
    switch (type) {
      case "homework":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "quiz":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "test":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "project":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent mb-2">
          📚 Build Your Student&apos;s Learning Plan
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Upload a syllabus, document, or class schedule — we&apos;ll scan it and set everything up automatically!
        </p>
      </motion.div>

      {/* Step indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <motion.div
            animate={{
              scale: step === 1 ? 1.1 : 1,
              backgroundColor: step >= 1 ? "rgb(124, 58, 237)" : "rgb(209, 213, 219)",
            }}
            className={`rounded-full w-10 h-10 flex items-center justify-center text-white font-bold cursor-pointer ${
              step >= 1 ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-600"
            }`}
            onClick={() => step > 1 && setStep(1)}
            title="Step 1: Choose or build the plan"
            role="button"
            aria-label="Go to step 1: Choose or build the plan"
            tabIndex={0}
          >
            1
          </motion.div>
          <motion.div className="h-1 w-8 sm:w-16 relative overflow-hidden" aria-hidden="true">
            <motion.div className="absolute inset-0 bg-gray-300 dark:bg-gray-600" />
            <motion.div
              className="absolute inset-0 bg-purple-600"
              initial={{ scaleX: 0 }}
              animate={{
                scaleX: step >= 2 ? 1 : 0,
                originX: 0,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </motion.div>
          <motion.div
            animate={{
              scale: step === 2 ? 1.1 : 1,
              backgroundColor: step >= 2 ? "rgb(124, 58, 237)" : "rgb(209, 213, 219)",
            }}
            className={`rounded-full w-10 h-10 flex items-center justify-center text-white font-bold ${
              step >= 2 ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-600"
            }`}
            title="Step 2: Review suggested schedule"
            role="button"
            aria-label="Step 2: Review suggested schedule"
          >
            2
          </motion.div>
          <motion.div className="h-1 w-8 sm:w-16 relative overflow-hidden" aria-hidden="true">
            <motion.div className="absolute inset-0 bg-gray-300 dark:bg-gray-600" />
            <motion.div
              className="absolute inset-0 bg-purple-600"
              initial={{ scaleX: 0 }}
              animate={{
                scaleX: step >= 3 ? 1 : 0,
                originX: 0,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </motion.div>
          <motion.div
            animate={{
              scale: step === 3 ? 1.1 : 1,
              backgroundColor: step === 3 ? "rgb(124, 58, 237)" : "rgb(209, 213, 219)",
            }}
            className={`rounded-full w-10 h-10 flex items-center justify-center text-white font-bold ${
              step === 3 ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-600"
            }`}
            title="Step 3: Confirmation"
            role="button"
            aria-label="Step 3: Confirmation"
          >
            3
          </motion.div>
        </div>
      </div>

      {/* Step 1: Choose or build the plan */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Row 1: For parents with a formal syllabus */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold flex items-center justify-center">
                  <FileText className="mr-2 h-6 w-6 text-purple-500" />🟪 For parents with a formal syllabus
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Upload or paste your existing syllabus and we'll set up your student's schedule automatically.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upload File Option */}
                <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <Card
                    className={`h-full overflow-hidden border-2 transition-all duration-300 ${
                      activeMethod === "file"
                        ? "border-blue-400 shadow-lg shadow-blue-100 dark:shadow-blue-900/20"
                        : "hover:border-blue-400"
                    }`}
                  >
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      <CardTitle className="flex items-center text-xl">
                        <FileUp className="mr-2 h-6 w-6" />📄 Upload a Syllabus File
                      </CardTitle>
                      <CardDescription className="text-blue-100">Supports PDF, DOC, DOCX, CSV</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                        <FileUp className="h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
                          Drag and drop your file here, or click to browse
                        </p>
                        <Label
                          htmlFor="file-upload"
                          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                          Upload File
                        </Label>
                        <Input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx,.csv"
                          onChange={handleFileSelect}
                        />
                        {selectedFile && (
                          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                            Selected: {selectedFile.name}
                          </div>
                        )}
                      </div>
                      <div className="mt-4">
                        <Button
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
                          onClick={handleFileUpload}
                          disabled={isFileLoading || !selectedFile}
                        >
                          {isFileLoading ? (
                            <span className="flex items-center justify-center">
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center">
                              <ArrowRight className="mr-2 h-4 w-4" /> Next
                            </span>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Paste Text Option */}
                <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <Card
                    className={`h-full overflow-hidden border-2 transition-all duration-300 ${
                      activeMethod === "text"
                        ? "border-pink-400 shadow-lg shadow-pink-100 dark:shadow-pink-900/20"
                        : "hover:border-pink-400"
                    }`}
                  >
                    <CardHeader className="bg-gradient-to-r from-pink-500 to-red-500 text-white">
                      <CardTitle className="flex items-center text-xl">
                        <FileText className="mr-2 h-6 w-6" />📝 Paste Text from Syllabus
                      </CardTitle>
                      <CardDescription className="text-pink-100">Copy and paste from any document</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Paste your syllabus text here..."
                          className="min-h-[120px] border-2 focus:border-pink-400"
                          value={syllabusText}
                          onChange={(e) => setSyllabusText(e.target.value)}
                        />
                        <Button
                          className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
                          onClick={handleTextAnalysis}
                          disabled={isTextLoading || !syllabusText.trim()}
                        >
                          {isTextLoading ? (
                            <span className="flex items-center justify-center">
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center">
                              <ArrowRight className="mr-2 h-4 w-4" /> Next
                            </span>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-gray-900 px-4 text-sm text-gray-500 dark:text-gray-400">
                  or choose another option
                </span>
              </div>
            </div>

            {/* Row 2: Want to use one of our premade options? */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mb-10"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold flex items-center justify-center">
                  <PuzzlePiece className="mr-2 h-6 w-6 text-green-500" />🟩 Want to use one of our premade options?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Pick from our prebuilt curriculum templates. You'll review the schedule before confirming.
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <Card
                    className={`h-full overflow-hidden border-2 transition-all duration-300 ${
                      activeMethod === "template"
                        ? "border-green-400 shadow-lg shadow-green-100 dark:shadow-green-900/20"
                        : "hover:border-green-400"
                    }`}
                  >
                    <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                      <CardTitle className="flex items-center text-xl">
                        <PuzzlePiece className="mr-2 h-6 w-6" />🧩 Use a Premade Template
                      </CardTitle>
                      <CardDescription className="text-green-100">
                        Quick start with our curriculum templates
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <Select
                          onValueChange={(value) => {
                            setSelectedTemplate(value)
                            setActiveMethod("template")
                          }}
                        >
                          <SelectTrigger className="border-2 focus:border-green-400">
                            <SelectValue placeholder="Select a subject template" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="math6">Math 6</SelectItem>
                            <SelectItem value="languageArts">Language Arts</SelectItem>
                            <SelectItem value="scienceBiology">Biology</SelectItem>
                            <SelectItem value="scienceGeneral">General Science</SelectItem>
                            <SelectItem value="history">History</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
                          disabled={isTemplateLoading || !selectedTemplate}
                          onClick={handleTemplateSelection}
                        >
                          {isTemplateLoading ? (
                            <span className="flex items-center justify-center">
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center">
                              <ArrowRight className="mr-2 h-4 w-4" /> Next
                            </span>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-gray-900 px-4 text-sm text-gray-500 dark:text-gray-400">
                  or choose another option
                </span>
              </div>
            </div>

            {/* Row 3: No syllabus? We've got you covered! */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold flex items-center justify-center">
                  <Brain className="mr-2 h-6 w-6 text-purple-500" />
                  🧠🧠 No syllabus? We&apos;ve got you covered!
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Choose how you&apos;d like to build your class if you&apos;re not using a formal curriculum.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Manually Create Class Option */}
                <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <Card
                    className={`h-full overflow-hidden border-2 transition-all duration-300 ${
                      activeMethod === "manual"
                        ? "border-amber-400 shadow-lg shadow-amber-100 dark:shadow-amber-900/20"
                        : "hover:border-amber-400"
                    }`}
                  >
                    <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      <CardTitle className="flex items-center text-xl">
                        <Plus className="mr-2 h-6 w-6" />➕ Manually Create Class
                      </CardTitle>
                      <CardDescription className="text-amber-100">
                        Know what you want? Build your class from scratch.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          if (!manualClass.title || !manualClass.meetingDays || !manualClass.startDate) {
                            toast({
                              title: "Missing information",
                              description: "Please fill in all required fields",
                              variant: "destructive",
                            })
                            return
                          }

                          setIsAnalyzing(true)
                          setAnalyzeProgress(0)
                          setAnalyzeStatus("Creating your class...")

                          // Simulate progress
                          const interval = setInterval(() => {
                            setAnalyzeProgress((prev) => Math.min(prev + 10, 100))
                          }, 300)

                          setTimeout(() => {
                            clearInterval(interval)
                            setAnalyzeProgress(100)

                            // Create a single class from manual input
                            const newClass: Class = {
                              id: `manual-${Date.now()}`,
                              title: manualClass.title,
                              meetingDays: manualClass.meetingDays,
                              meetingTime: manualClass.meetingTime || "N/A",
                              assignmentCount: Math.floor(Math.random() * 10) + 5,
                              testCount: Math.floor(Math.random() * 3) + 1,
                              startDate: manualClass.startDate,
                              endDate: manualClass.endDate || "TBD",
                              approved: false,
                              skipped: false,
                            }

                            setDetectedClasses([newClass])
                            setSampleAssignments(generateSampleAssignments(newClass.title))

                            setTimeout(() => {
                              setIsAnalyzing(false)
                              setStep(2)
                              scrollToStep2()
                            }, 500)
                          }, 2000)
                        }}
                        className="space-y-3"
                      >
                        <div>
                          <Label htmlFor="class-title">Class Title</Label>
                          <Input
                            id="class-title"
                            placeholder="e.g. Math 6"
                            className="border-2 focus:border-amber-400"
                            value={manualClass.title}
                            onChange={(e) => {
                              setManualClass({ ...manualClass, title: e.target.value })
                              setActiveMethod("manual")
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor="meeting-days">Meeting Days</Label>
                          <Input
                            id="meeting-days"
                            placeholder="e.g. Mon/Wed"
                            className="border-2 focus:border-amber-400"
                            value={manualClass.meetingDays}
                            onChange={(e) => setManualClass({ ...manualClass, meetingDays: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="start-date">Start Date</Label>
                            <Input
                              id="start-date"
                              placeholder="e.g. Aug 15"
                              className="border-2 focus:border-amber-400"
                              value={manualClass.startDate}
                              onChange={(e) => setManualClass({ ...manualClass, startDate: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="end-date">End Date</Label>
                            <Input
                              id="end-date"
                              placeholder="e.g. Dec 15"
                              className="border-2 focus:border-amber-400"
                              value={manualClass.endDate}
                              onChange={(e) => setManualClass({ ...manualClass, endDate: e.target.value })}
                            />
                          </div>
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                          <span className="flex items-center justify-center">
                            <ArrowRight className="mr-2 h-4 w-4" /> Create Class
                          </span>
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Auto-Generate a Learning Plan */}
                <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <Card
                    className={`h-full overflow-hidden border-2 transition-all duration-300 relative ${
                      activeMethod === "auto"
                        ? "border-purple-400 shadow-lg shadow-purple-100 dark:shadow-purple-900/20"
                        : "hover:border-purple-400"
                    }`}
                  >
                    <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                      <CardTitle className="flex items-center text-xl">
                        <Wand2 className="mr-2 h-6 w-6" />✨ Auto-Generate a Learning Plan
                      </CardTitle>
                      <CardDescription className="text-purple-100">
                        Not sure where to start? Let us build a schedule for you.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <form onSubmit={handleAutoGenerateClass} className="space-y-3">
                        <div>
                          <Label htmlFor="subject-title">Subject Title</Label>
                          <Input
                            id="subject-title"
                            placeholder="e.g. Khan Academy Math"
                            className="border-2 focus:border-purple-400"
                            value={autoGenerateClass.title}
                            onChange={(e) => {
                              setAutoGenerateClass({ ...autoGenerateClass, title: e.target.value })
                              setActiveMethod("auto")
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor="schedule-pattern">Schedule Pattern</Label>
                          <Select
                            onValueChange={(value) => {
                              setAutoGenerateClass({ ...autoGenerateClass, schedulePattern: value })
                              setActiveMethod("auto")
                            }}
                          >
                            <SelectTrigger id="schedule-pattern" className="border-2 focus:border-purple-400">
                              <SelectValue placeholder="Select a schedule pattern" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="everyday">Every weekday</SelectItem>
                              <SelectItem value="mwf">Mon/Wed/Fri</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="duration">Duration</Label>
                          <Select
                            onValueChange={(value) => {
                              setAutoGenerateClass({ ...autoGenerateClass, duration: value })
                              setActiveMethod("auto")
                            }}
                          >
                            <SelectTrigger id="duration" className="border-2 focus:border-purple-400">
                              <SelectValue placeholder="Select a duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2weeks">2 weeks</SelectItem>
                              <SelectItem value="1month">1 month</SelectItem>
                              <SelectItem value="2months">2 months</SelectItem>
                              <SelectItem value="3months">3 months</SelectItem>
                              <SelectItem value="semester">Full semester</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="notes">Optional Notes or Goals</Label>
                          <Textarea
                            id="notes"
                            placeholder="e.g. Finish 12 modules by December"
                            className="min-h-[80px] border-2 focus:border-purple-400"
                            value={autoGenerateClass.notes}
                            onChange={(e) => {
                              setAutoGenerateClass({ ...autoGenerateClass, notes: e.target.value })
                              setActiveMethod("auto")
                            }}
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
                          disabled={isAutoLoading || !autoGenerateClass.title || !autoGenerateClass.schedulePattern}
                        >
                          {isAutoLoading ? (
                            <span className="flex items-center justify-center">
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center">
                              <ArrowRight className="mr-2 h-4 w-4" /> Create Plan For Me
                            </span>
                          )}
                        </Button>
                      </form>

                      {/* Auto-generate loading overlay */}
                      <AnimatePresence>
                        {isAutoLoading && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gradient-to-r from-purple-500/90 to-indigo-500/90 flex flex-col items-center justify-center text-white p-6 rounded-b-lg"
                          >
                            <Loader2 className="h-12 w-12 animate-spin mb-4" />
                            <motion.p
                              key={currentAutoMessage}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-xl font-medium text-center"
                            >
                              {autoGenerateMessages[currentAutoMessage]}
                            </motion.p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>

            {/* Analysis Progress */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-8"
                >
                  <Card className="border-2 border-purple-300">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">{analyzeStatus}</h3>
                          <span className="text-sm text-gray-500">{analyzeProgress}%</span>
                        </div>
                        <Progress value={analyzeProgress} className="h-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                          {analyzeProgress < 100
                            ? "Please wait while we analyze your content..."
                            : "Analysis complete! Preparing results..."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Step 2: Review Learning Plan */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 25 }}
            className="mb-8"
            ref={step2Ref}
          >
            <Card className="border-2 border-purple-400 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <CardTitle className="flex items-center text-2xl">
                  <Target className="mr-2 h-6 w-6" />🎯 Review Your Learning Plan
                </CardTitle>
                <CardDescription className="text-purple-100 text-lg">
                  We've created your class schedule and assignments. Please review below.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Class Summary */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h3 className="text-xl font-semibold mb-3 flex items-center">
                      <GraduationCap className="mr-2 h-5 w-5 text-purple-600" />
                      Class Summary
                    </h3>

                    {detectedClasses.length > 0 && (
                      <div className="space-y-4">
                        {detectedClasses.map((cls) => (
                          <div key={cls.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                            <div className="flex justify-between items-start">
                              <h4 className="text-lg font-medium text-purple-700 dark:text-purple-300">{cls.title}</h4>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                              <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                <span>Meets: {cls.meetingDays}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                <span>Time: {cls.meetingTime}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                <span>Start: {cls.startDate}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                <span>End: {cls.endDate}</span>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center space-x-2">
                              <span className="text-sm font-medium">Total Assignments:</span>
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                              >
                                {cls.assignmentCount} Assignments
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                              >
                                {cls.testCount} Tests
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sample Assignments */}
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
                    <h3 className="text-xl font-semibold mb-3 flex items-center">
                      <Book className="mr-2 h-5 w-5 text-indigo-600" />
                      Sample Assignments
                    </h3>

                    {sampleAssignments.length > 0 ? (
                      <div className="space-y-2">
                        {sampleAssignments.map((assignment) => (
                          <div
                            key={assignment.id}
                            className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex justify-between items-center"
                          >
                            <div>
                              <div className="font-medium">{assignment.title}</div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Due: {assignment.dueDate}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getAssignmentBadgeColor(assignment.type)}>
                                {assignment.type.charAt(0).toUpperCase() + assignment.type.slice(1)}
                              </Badge>
                              <span className="text-sm font-medium">{assignment.points} pts</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No sample assignments available</p>
                    )}
                  </div>

                  {/* Confirmation Message */}
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-medium text-green-800 dark:text-green-300">Ready to Confirm?</h3>
                        <p className="text-green-700 dark:text-green-400 mt-1">
                          If everything looks good, click "Confirm Plan" below. Or go back and adjust any details.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2 pb-6">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="border-2 border-gray-300 hover:border-purple-400"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>

                <Button
                  onClick={handleConfirmPlan}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm Plan
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Final Confirmation */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Card className="border-2 border-green-400 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 10,
                    delay: 0.2,
                  }}
                >
                  <Sparkles className="h-16 w-16 mx-auto mb-2 text-yellow-300" />
                </motion.div>
                <CardTitle className="text-2xl">🎉 You&apos;re All Set!</CardTitle>
                <CardDescription className="text-green-100 text-lg">
                  Your student&apos;s class schedule and assignments have been saved.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-lg mb-6">
                  They&apos;ll now show up in the dashboard, schedule, uploads, and rewards pages.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full py-6"
                      onClick={() => navigateTo("/parent/calendar")}
                    >
                      <Calendar className="h-5 w-5 mr-2" />📅 Preview Student Schedule
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                    <Button
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-full py-6"
                      onClick={() => navigateTo("/parent/students")}
                    >
                      <Book className="h-5 w-5 mr-2" />📘 Go to Assignments
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
              <CardFooter className="pb-6">
                <Button
                  variant="outline"
                  className="mx-auto border-2 border-gray-300 hover:border-purple-400"
                  onClick={handleReset}
                >
                  Add Another Class
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal for Manual Class Creation */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center justify-center">
              <Sparkles className="h-6 w-6 mr-2 text-amber-500" />
              Class Created!
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Your new class has been added to your student&apos;s schedule.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
              onClick={() => {
                setShowSuccessModal(false)
                navigateTo("/parent/students/enoch123/schedule")
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              View in Schedule
            </Button>
            <Button
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
              onClick={() => {
                setShowSuccessModal(false)
                navigateTo("/parent/curriculum")
              }}
            >
              <ListPlus className="h-4 w-4 mr-2" />
              Add Assignments
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuccessModal(false)} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Setup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
