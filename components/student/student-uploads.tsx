"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Book,
  Calculator,
  FileUp,
  FlaskRoundIcon as Flask,
  Globe,
  Music,
  Palette,
  PenTool,
  Upload,
  Clock,
  Eye,
  RefreshCw,
  PenSquare,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Brain,
  BarChart,
  Paperclip,
  Search,
  Sparkles,
  Pencil,
  Tag,
  BookOpen,
  ChevronRight,
  Award,
  Coins,
  MessageSquare,
  Download,
  X,
  Plus,
  Info,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Zap,
  FileQuestion,
  ListChecks,
  Edit,
  Send,
  RotateCcw,
  Lightbulb,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams, useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Add these CSS classes for the 3D card flip effect
const perspectiveStyles = `
  .perspective {
    perspective: 1000px;
  }
  .backface-hidden {
    backface-visibility: hidden;
  }
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
  .card-container {
    position: relative;
    height: 12rem;
    width: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }
  .card-container.flipped {
    transform: rotateY(180deg);
  }
  .card-front, .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    padding: 1.5rem;
  }
  .card-back {
    transform: rotateY(180deg);
  }
  .quiz-option {
    transition: all 0.2s ease;
  }
  .quiz-option:hover {
    transform: translateY(-2px);
  }
  .quiz-option.correct {
    background-color: rgba(34, 197, 94, 0.1);
    border-color: rgba(34, 197, 94, 0.5);
  }
  .quiz-option.incorrect {
    background-color: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.5);
  }
  .confetti {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: #f00;
    border-radius: 50%;
    animation: confetti-fall 5s ease-out forwards;
  }
  @keyframes confetti-fall {
    0% {
      transform: translateY(-50px) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(500px) rotate(720deg);
      opacity: 0;
    }
  }
`

// Sample data for subjects
const subjects = [
  { id: 1, name: "Math", icon: Calculator, color: "bg-gradient-to-br from-blue-400 to-blue-600" },
  { id: 2, name: "Science", icon: Flask, color: "bg-gradient-to-br from-green-400 to-green-600" },
  { id: 3, name: "English", icon: Book, color: "bg-gradient-to-br from-purple-400 to-purple-600" },
  { id: 4, name: "History", icon: Globe, color: "bg-gradient-to-br from-amber-400 to-amber-600" },
  { id: 5, name: "Art", icon: Palette, color: "bg-gradient-to-br from-pink-400 to-pink-600" },
  { id: 6, name: "Music", icon: Music, color: "bg-gradient-to-br from-indigo-400 to-indigo-600" },
  { id: 7, name: "Writing", icon: PenTool, color: "bg-gradient-to-br from-teal-400 to-teal-600" },
]

// Sample data for assignments
const assignments = [
  {
    id: 1,
    subject: "Math",
    title: "Algebra Worksheet #3",
    description: "Complete problems 1-20",
    dueDate: "2025-04-17",
    status: "Due Tomorrow",
  },
  {
    id: 2,
    subject: "Math",
    title: "Geometry Quiz",
    description: "Chapter 5 review",
    dueDate: "2025-04-16",
    status: "Due Today",
  },
  {
    id: 3,
    subject: "Science",
    title: "Lab Report: Photosynthesis",
    description: "Write up results from yesterday's experiment",
    dueDate: "2025-04-18",
    status: "Due This Week",
  },
  {
    id: 4,
    subject: "Science",
    title: "Ecosystem Diagram",
    description: "Create a food web for the local ecosystem",
    dueDate: "2025-04-15",
    status: "Overdue",
  },
  {
    id: 5,
    subject: "English",
    title: "Essay: Shakespeare Analysis",
    description: "3-page analysis of themes in Macbeth",
    dueDate: "2025-04-20",
    status: "Due Next Week",
  },
  {
    id: 6,
    subject: "English",
    title: "Vocabulary Quiz",
    description: "Unit 7 vocabulary words",
    dueDate: "2025-04-16",
    status: "Due Today",
  },
  {
    id: 7,
    subject: "History",
    title: "Civil War Presentation",
    description: "10-minute presentation on a Civil War battle",
    dueDate: "2025-04-19",
    status: "Due This Week",
  },
  {
    id: 8,
    subject: "History",
    title: "Primary Source Analysis",
    description: "Analyze the Declaration of Independence",
    dueDate: "2025-04-14",
    status: "Overdue",
  },
]

// Sample data for previous uploads
const previousUploads = [
  {
    id: 1,
    subject: "Math",
    fileName: "Algebra_Homework.pdf",
    type: "Completed Assignment",
    date: "April 15, 2025",
    gptOutputs: ["Flashcards", "Quiz"],
    status: "Graded",
    linkedAssignment: {
      id: 1,
      title: "Algebra Worksheet #3",
      completed: true,
      feedbackStatus: "Complete",
    },
    category: "Completed Student Work",
    hasFlashcards: true,
    hasQuiz: true,
    tags: ["Algebra", "Equations", "Homework"],
    fileUrl: "/placeholder.svg?height=800&width=600",
  },
  {
    id: 2,
    subject: "Science",
    fileName: "Lab_Report_Photosynthesis.docx",
    type: "Completed Assignment",
    date: "April 14, 2025",
    gptOutputs: ["Summary", "Action Plan"],
    status: "Pending",
    linkedAssignment: null,
    category: "Completed Student Work",
    hasFlashcards: false,
    hasQuiz: false,
    tags: ["Photosynthesis", "Lab Report", "Biology"],
    fileUrl: "/placeholder.svg?height=800&width=600",
  },
  {
    id: 3,
    subject: "English",
    fileName: "Essay_Shakespeare.docx",
    type: "Essay or Report",
    date: "April 12, 2025",
    gptOutputs: ["Feedback", "Outline"],
    status: "Graded",
    linkedAssignment: {
      id: 5,
      title: "Essay: Shakespeare Analysis",
      completed: true,
      feedbackStatus: "Complete",
    },
    category: "Completed Student Work",
    hasFlashcards: false,
    hasQuiz: true,
    tags: ["Shakespeare", "Macbeth", "Literary Analysis"],
    fileUrl: "/placeholder.svg?height=800&width=600",
  },
  {
    id: 4,
    subject: "History",
    fileName: "Civil_War_Presentation.pptx",
    type: "Presentation Slides",
    date: "April 10, 2025",
    gptOutputs: ["Summary", "Quiz"],
    status: "Graded",
    linkedAssignment: {
      id: 7,
      title: "Civil War Presentation",
      completed: true,
      feedbackStatus: "Complete",
    },
    category: "Completed Student Work",
    hasFlashcards: true,
    hasQuiz: true,
    tags: ["Civil War", "American History", "Presentation"],
    fileUrl: "/placeholder.svg?height=800&width=600",
  },
  {
    id: 5,
    subject: "Science",
    fileName: "Photosynthesis_Lecture_Notes.pdf",
    type: "Lecture Transcript",
    date: "April 8, 2025",
    gptOutputs: ["Summary", "Flashcards"],
    status: "N/A",
    linkedAssignment: null,
    category: "Class or Teacher Material",
    hasFlashcards: true,
    hasQuiz: true,
    tags: ["Photosynthesis", "Biology", "Lecture Notes"],
    fileUrl: "/placeholder.svg?height=800&width=600",
  },
  {
    id: 6,
    subject: "Math",
    fileName: "Algebra_Study_Guide.pdf",
    type: "Study Guide",
    date: "April 5, 2025",
    gptOutputs: ["Flashcards", "Practice Problems"],
    status: "N/A",
    linkedAssignment: null,
    category: "Class or Teacher Material",
    hasFlashcards: true,
    hasQuiz: true,
    tags: ["Algebra", "Study Guide", "Equations"],
    fileUrl: "/placeholder.svg?height=800&width=600",
  },
  {
    id: 7,
    subject: "English",
    fileName: "Essay_Rubric.pdf",
    type: "Rubric or Grading Criteria",
    date: "April 3, 2025",
    gptOutputs: ["Summary"],
    status: "N/A",
    linkedAssignment: {
      id: 5,
      title: "Essay: Shakespeare Analysis",
      completed: false,
      feedbackStatus: null,
    },
    category: "Class or Teacher Material",
    hasFlashcards: false,
    hasQuiz: false,
    tags: ["Essay", "Rubric", "Grading"],
    fileUrl: "/placeholder.svg?height=800&width=600",
  },
]

// Sample flashcards for History
const historyFlashcards = [
  {
    question: "What is the primary cause of World War I?",
    answer:
      "The assassination of Archduke Franz Ferdinand of Austria, which set off a chain reaction of events between allied countries.",
    tags: ["History", "World War I", "Causes"],
  },
  {
    question: "When did the Civil War begin?",
    answer:
      "The American Civil War began on April 12, 1861, when Confederate forces fired upon Fort Sumter in South Carolina.",
    tags: ["History", "Civil War", "American History"],
  },
  {
    question: "Who was the first President of the United States?",
    answer: "George Washington, who served from 1789 to 1797.",
    tags: ["History", "American History", "Presidents"],
  },
]

// Sample flashcards for Math
const mathFlashcards = [
  {
    question: "What is the quadratic formula?",
    answer: "x = (-b ± √(b² - 4ac)) / 2a, where ax² + bx + c = 0",
    tags: ["Math", "Algebra", "Equations"],
  },
  {
    question: "What is the Pythagorean theorem?",
    answer: "a² + b² = c², where a and b are the legs of a right triangle and c is the hypotenuse.",
    tags: ["Math", "Geometry", "Triangles"],
  },
  {
    question: "What is the formula for the area of a circle?",
    answer: "A = πr², where r is the radius of the circle.",
    tags: ["Math", "Geometry", "Area"],
  },
]

// Sample quiz questions for History
const historyQuizQuestions = [
  {
    question: "Which event directly triggered the start of World War I?",
    options: [
      "The sinking of the Lusitania",
      "The assassination of Archduke Franz Ferdinand",
      "The Russian Revolution",
      "The Treaty of Versailles",
    ],
    correctAnswer: 1,
    explanation:
      "The assassination of Archduke Franz Ferdinand of Austria on June 28, 1914, is considered the immediate trigger that set off a chain of events leading to World War I.",
  },
  {
    question: "Which of the following was NOT one of the major Allied Powers during World War I?",
    options: ["Great Britain", "France", "Russia", "Spain"],
    correctAnswer: 3,
    explanation:
      "Spain remained neutral during World War I. The major Allied Powers included Great Britain, France, Russia, Italy (after 1915), and the United States (after 1917).",
  },
  {
    question: "What was the name of the treaty that officially ended World War I?",
    options: ["Treaty of Versailles", "Treaty of Paris", "Treaty of London", "Treaty of Berlin"],
    correctAnswer: 0,
    explanation:
      "The Treaty of Versailles, signed on June 28, 1919, officially ended World War I and imposed harsh penalties on Germany.",
  },
  {
    question: "Which new weapons were introduced during World War I?",
    options: [
      "Nuclear bombs and jet fighters",
      "Tanks, poison gas, and flamethrowers",
      "Guided missiles and radar",
      "Laser weapons and drones",
    ],
    correctAnswer: 1,
    explanation:
      "World War I saw the introduction of many new weapons including tanks, poison gas, flamethrowers, and improved machine guns, making it much deadlier than previous conflicts.",
  },
  {
    question: "What was the nickname given to World War I at the time?",
    options: ["The Great War", "The World War", "The European Conflict", "The Global Struggle"],
    correctAnswer: 0,
    explanation:
      "World War I was commonly called 'The Great War' or 'The War to End All Wars' until the outbreak of World War II made numerical designations necessary.",
  },
]

// Sample quiz questions for Math
const mathQuizQuestions = [
  {
    question: "What is the solution to the equation 2x + 5 = 13?",
    options: ["x = 3", "x = 4", "x = 5", "x = 6"],
    correctAnswer: 1,
    explanation: "To solve 2x + 5 = 13, subtract 5 from both sides: 2x = 8. Then divide both sides by 2: x = 4.",
  },
  {
    question: "What is the value of y in the point (3, y) that lies on the line y = 2x - 1?",
    options: ["y = 3", "y = 4", "y = 5", "y = 6"],
    correctAnswer: 2,
    explanation: "Substitute x = 3 into the equation y = 2x - 1: y = 2(3) - 1 = 6 - 1 = 5.",
  },
  {
    question: "What is the area of a circle with radius 4 units?",
    options: ["8π square units", "12π square units", "16π square units", "64π square units"],
    correctAnswer: 2,
    explanation: "The area of a circle is A = πr². With r = 4, we get A = π(4)² = 16π square units.",
  },
  {
    question: "If a triangle has sides of length 3, 4, and 5 units, what type of triangle is it?",
    options: ["Equilateral", "Isosceles", "Scalene", "Right"],
    correctAnswer: 3,
    explanation: "This is a right triangle because it satisfies the Pythagorean theorem: 3² + 4² = 5² (9 + 16 = 25).",
  },
  {
    question: "What is the slope of a line perpendicular to y = 3x + 2?",
    options: ["m = 3", "m = -3", "m = 1/3", "m = -1/3"],
    correctAnswer: 3,
    explanation:
      "The slope of y = 3x + 2 is 3. The slope of a perpendicular line is the negative reciprocal, which is -1/3.",
  },
]

// Sample long-answer prompts for History
const historyLongAnswerPrompts = [
  {
    prompt: "Explain the major causes of World War I and how they contributed to the outbreak of the conflict.",
    guidance:
      "Consider political, economic, and social factors. Discuss nationalism, imperialism, militarism, and the alliance system.",
  },
  {
    prompt:
      "Compare and contrast the Eastern and Western Fronts during World War I. How did geography, strategy, and outcomes differ?",
    guidance:
      "Discuss major battles, military tactics, and the impact on civilian populations in both theaters of war.",
  },
  {
    prompt:
      "Analyze the impact of World War I on society, particularly focusing on changes in gender roles and class structures.",
    guidance:
      "Consider how the war affected women's rights, labor movements, and social hierarchies across different countries.",
  },
]

// Sample long-answer prompts for Math
const mathLongAnswerPrompts = [
  {
    prompt: "Explain the key steps in solving a quadratic equation using the quadratic formula. Provide an example.",
    guidance: "Include the formula, explain when to use it, and walk through each step with a specific example.",
  },
  {
    prompt:
      "Describe the relationship between linear equations and their graphs. How do the slope and y-intercept affect the appearance of the line?",
    guidance: "Explain the slope-intercept form (y = mx + b) and how changing m and b transforms the graph.",
  },
  {
    prompt:
      "Explain how to find the area and perimeter of composite shapes. Provide an example with a shape composed of a rectangle and a semicircle.",
    guidance:
      "Break down the process of identifying component shapes, finding their individual measurements, and combining them appropriately.",
  },
]

// Upload types
const uploadTypes = {
  "Completed Student Work": [
    "Completed Assignment",
    "Reflection Journal",
    "Project File",
    "Essay or Report",
    "Final Exam Submission",
    "Quiz/Test Answers",
    "Presentation Slides",
    "Re-uploaded Work",
  ],
  "Class or Teacher Material": [
    "Assignment Instructions",
    "Test/Quiz Outline",
    "Study Guide",
    "Graded Work (with Teacher Notes)",
    "Workbook Pages",
    "Lecture Transcript",
    "Project Guidelines",
    "Rubric or Grading Criteria",
    "Semester Overview or Progress Report",
    "Syllabus or Curriculum Map",
  ],
}

// Suggested tags for autocomplete
const suggestedTags = [
  "Algebra",
  "Geometry",
  "Calculus",
  "Statistics",
  "Trigonometry",
  "Biology",
  "Chemistry",
  "Physics",
  "Earth Science",
  "Astronomy",
  "Literature",
  "Grammar",
  "Vocabulary",
  "Writing",
  "Poetry",
  "American History",
  "World History",
  "Geography",
  "Civics",
  "Economics",
  "Drawing",
  "Painting",
  "Sculpture",
  "Art History",
  "Design",
  "Composition",
  "Theory",
  "Instruments",
  "Performance",
  "Music History",
  "Essay",
  "Research",
  "Presentation",
  "Project",
  "Exam",
  "Homework",
  "Notes",
  "Study Guide",
  "Review",
  "Practice",
]

// Update the component to accept props instead of using useSearchParams directly

// Replace useSearchParams with props
interface StudentUploadsProps {
  subject: string
  status: string
}

export default function StudentUploads({ subject, status }: StudentUploadsProps) {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)

  // Rest of the component remains the same, but use the props instead of searchParams

  const handleSubjectChange = (value: string) => {
    const params = new URLSearchParams()
    if (value !== "all") params.set("subject", value)
    if (status !== "all") params.set("status", status)
    router.push(`/student/uploads?${params.toString()}`)
  }

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams()
    if (subject !== "all") params.set("subject", subject)
    if (value !== "all") params.set("status", value)
    router.push(`/student/uploads?${params.toString()}`)
  }

  // Rest of the component remains the same

  // Make sure to use the props (subject, status) instead of searchParams.get() in the component

  const [selectedSubject, setSelectedSubject] = useState("")
  const [uploadCategory, setUploadCategory] = useState("")
  const [uploadType, setUploadType] = useState("")
  const [selectedAssignment, setSelectedAssignment] = useState("")
  const [files, setFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [completionSummary, setCompletionSummary] = useState(null)
  const [uploadPanelOpen, setUploadPanelOpen] = useState(true)
  const [filesPanelOpen, setFilesPanelOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFeedbackPanel, setShowFeedbackPanel] = useState(false)
  const [showReflectionModal, setShowReflectionModal] = useState(false)
  const [showReuploadModal, setShowReuploadModal] = useState(false)
  const [showFlashcardsModal, setShowFlashcardsModal] = useState(false)
  const [showStudyModal, setShowStudyModal] = useState(false)
  const [showViewAssignmentPanel, setShowViewAssignmentPanel] = useState(false)
  const [showEditTagsModal, setShowEditTagsModal] = useState(false)
  const [showQuickQuizModal, setShowQuickQuizModal] = useState(false)
  const [showMultipleChoiceModal, setShowMultipleChoiceModal] = useState(false)
  const [showLongAnswerModal, setShowLongAnswerModal] = useState(false)
  const [reflectionText, setReflectionText] = useState("")
  const [reuploadReason, setReuploadReason] = useState("")
  const [selectedStudyOption, setSelectedStudyOption] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [currentTags, setCurrentTags] = useState([])
  const [newTag, setNewTag] = useState("")
  const [filteredTags, setFilteredTags] = useState([])
  const [isCardFlipped, setIsCardFlipped] = useState(false)
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0)
  const [currentFlashcards, setCurrentFlashcards] = useState([])
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState([])
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [showQuizResults, setShowQuizResults] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState([])
  const [currentLongAnswerPrompts, setCurrentLongAnswerPrompts] = useState([])
  const [longAnswerResponses, setLongAnswerResponses] = useState({})
  const [showLongAnswerFeedback, setShowLongAnswerFeedback] = useState(false)
  const [currentLongAnswerIndex, setCurrentLongAnswerIndex] = useState(0)
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const confettiRef = useRef(null)

  const [showWritingCoachCard, setShowWritingCoachCard] = useState(false)
  const [writingFileName, setWritingFileName] = useState("")
  const writingCardRef = useRef(null)

  // Get subject and assignment from URL parameters
  const subjectParam = searchParams.get("subject")
  const assignmentParam = searchParams.get("assignment")

  // Set initial values from URL parameters
  useEffect(() => {
    if (subjectParam) {
      setSelectedSubject(subjectParam)
    }

    if (assignmentParam) {
      setSelectedAssignment(assignmentParam)
      setUploadCategory("Completed Student Work")
      setUploadType("Completed Assignment")
    }
  }, [subjectParam, assignmentParam])

  // Update current tags when a file is selected
  useEffect(() => {
    if (selectedFile) {
      setCurrentTags(selectedFile.tags || [])
    }
  }, [selectedFile])

  // Filter suggested tags based on input
  useEffect(() => {
    if (newTag.trim() === "") {
      setFilteredTags([])
    } else {
      const filtered = suggestedTags.filter(
        (tag) => tag.toLowerCase().includes(newTag.toLowerCase()) && !currentTags.includes(tag),
      )
      setFilteredTags(filtered.slice(0, 5)) // Limit to 5 suggestions
    }
  }, [newTag, currentTags])

  // Set appropriate flashcards based on selected file
  useEffect(() => {
    if (selectedFile && showFlashcardsModal) {
      if (selectedFile.subject === "History") {
        setCurrentFlashcards(historyFlashcards)
      } else if (selectedFile.subject === "Math") {
        setCurrentFlashcards(mathFlashcards)
      } else {
        // Default to history if subject doesn't match
        setCurrentFlashcards(historyFlashcards)
      }
      setCurrentFlashcardIndex(0)
      setIsCardFlipped(false)
    }
  }, [selectedFile, showFlashcardsModal])

  // Set appropriate quiz questions based on selected file
  useEffect(() => {
    if (selectedFile && (showQuickQuizModal || showMultipleChoiceModal)) {
      if (selectedFile.subject === "History") {
        setCurrentQuizQuestions(historyQuizQuestions)
      } else if (selectedFile.subject === "Math") {
        setCurrentQuizQuestions(mathQuizQuestions)
      } else {
        // Default to history if subject doesn't match
        setCurrentQuizQuestions(historyQuizQuestions)
      }
      setCurrentQuizIndex(0)
      setSelectedAnswer(null)
      setIsAnswerSubmitted(false)
      setQuizScore(0)
      setShowQuizResults(false)
      setQuizAnswers(Array(5).fill(null))
    }
  }, [selectedFile, showQuickQuizModal, showMultipleChoiceModal])

  // Set appropriate long answer prompts based on selected file
  useEffect(() => {
    if (selectedFile && showLongAnswerModal) {
      if (selectedFile.subject === "History") {
        setCurrentLongAnswerPrompts(historyLongAnswerPrompts)
      } else if (selectedFile.subject === "Math") {
        setCurrentLongAnswerPrompts(mathLongAnswerPrompts)
      } else {
        // Default to history if subject doesn't match
        setCurrentLongAnswerPrompts(historyLongAnswerPrompts)
      }
      setCurrentLongAnswerIndex(0)
      setLongAnswerResponses({})
      setShowLongAnswerFeedback(false)
    }
  }, [selectedFile, showLongAnswerModal])

  // Function to create confetti effect
  const createConfetti = () => {
    if (!confettiRef.current) return

    const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"]

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div")
      confetti.className = "confetti"
      confetti.style.left = `${Math.random() * 100}%`
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.animationDuration = `${Math.random() * 3 + 2}s`
      confetti.style.animationDelay = `${Math.random() * 2}s`
      confettiRef.current.appendChild(confetti)

      // Remove confetti after animation completes
      setTimeout(() => {
        confetti.remove()
      }, 5000)
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const isWritingAssignment = (fileName, subject, category, type) => {
    // Check filename for writing-related terms
    const writingTerms = ["essay", "story", "report", "writing", "paper", "analysis", "reflection", "journal"]
    const fileNameMatch = writingTerms.some((term) => fileName.toLowerCase().includes(term))

    // Check if subject is writing-related
    const writingSubjects = ["Writing", "Language Arts", "English", "Humanities"]
    const subjectMatch = writingSubjects.includes(subject)

    // Check if category/type is writing-related
    const writingTypes = ["Essay or Report", "Reflection Journal", "Creative Writing"]
    const typeMatch = writingTypes.includes(type)

    return fileNameMatch || subjectMatch || typeMatch
  }

  const handleSubmit = () => {
    if (!uploadCategory || !uploadType || !selectedSubject || files.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and select a file to upload.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload process with progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 300)

    // Simulate completion
    setTimeout(() => {
      clearInterval(interval)
      setIsUploading(false)
      setUploadProgress(100)
      setUploadSuccess(true)

      // Check if this might be a writing assignment
      if (files.length > 0 && isWritingAssignment(files[0].name, selectedSubject, uploadCategory, uploadType)) {
        setWritingFileName(files[0].name)
        setShowWritingCoachCard(true)

        // Auto-dismiss the card after 3 minutes
        setTimeout(() => {
          setShowWritingCoachCard(false)
        }, 180000) // 3 minutes
      }

      // Show completion toast
      toast({
        title: "✅ Uploaded!",
        description: "We've filed this where it belongs.",
      })

      // If assignment is linked, show completion summary
      if (selectedAssignment && uploadCategory === "Completed Student Work" && uploadType === "Completed Assignment") {
        const assignment = assignments.find((a) => a.id.toString() === selectedAssignment)
        if (assignment) {
          setCompletionSummary({
            subject: selectedSubject,
            assignmentTitle: assignment.title,
            submissionDate: new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            feedbackStatus: "Processing...",
          })
        }
      }

      // Reset form after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false)
        setCompletionSummary(null)
        setFiles([])
        // Don't reset the dropdowns if they came from URL params
        if (!subjectParam && !assignmentParam) {
          setSelectedSubject("")
          setUploadCategory("")
          setUploadType("")
          setSelectedAssignment("")
        }
      }, 3000)
    }, 3000)
  }

  // Handle adding a new tag
  const handleAddTag = (tag) => {
    if (tag && !currentTags.includes(tag)) {
      setCurrentTags([...currentTags, tag])
      setNewTag("")
    }
  }

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove) => {
    setCurrentTags(currentTags.filter((tag) => tag !== tagToRemove))
  }

  // Handle saving tags
  const handleSaveTags = () => {
    toast({
      title: "Tags updated",
      description: "Your tags have been successfully updated.",
    })
    setShowEditTagsModal(false)
  }

  // Handle quiz answer selection
  const handleAnswerSelect = (answerIndex) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(answerIndex)
    }
  }

  // Handle quiz answer submission
  const handleSubmitAnswer = () => {
    if (selectedAnswer !== null) {
      const isCorrect = selectedAnswer === currentQuizQuestions[currentQuizIndex].correctAnswer

      // Update quiz answers array
      const newQuizAnswers = [...quizAnswers]
      newQuizAnswers[currentQuizIndex] = selectedAnswer
      setQuizAnswers(newQuizAnswers)

      // Update score if correct
      if (isCorrect) {
        setQuizScore(quizScore + 1)
      }

      setIsAnswerSubmitted(true)

      // Move to next question or show results after a delay
      if (currentQuizIndex < 4) {
        setTimeout(() => {
          setCurrentQuizIndex(currentQuizIndex + 1)
          setSelectedAnswer(null)
          setIsAnswerSubmitted(false)
        }, 2000)
      } else {
        setTimeout(() => {
          setShowQuizResults(true)
          createConfetti()
        }, 2000)
      }
    }
  }

  // Handle long answer input
  const handleLongAnswerInput = (index, value) => {
    setLongAnswerResponses({
      ...longAnswerResponses,
      [index]: value,
    })
  }

  // Filter uploads based on active tab and search query
  const filteredUploads = previousUploads.filter((upload) => {
    const matchesSearch =
      upload.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      upload.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      upload.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      upload.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    if (activeTab === "all") {
      return matchesSearch
    } else if (activeTab === "completed") {
      return upload.category === "Completed Student Work" && matchesSearch
    } else if (activeTab === "source") {
      return upload.category === "Class or Teacher Material" && matchesSearch
    } else {
      return upload.subject.toLowerCase() === activeTab.toLowerCase() && matchesSearch
    }
  })

  // Group uploads by subject
  const groupedUploads = filteredUploads.reduce((acc, upload) => {
    if (!acc[upload.subject]) {
      acc[upload.subject] = []
    }
    acc[upload.subject].push(upload)
    return acc
  }, {})

  // Helper function to render subject icon
  const renderSubjectIcon = (subjectName) => {
    const subject = subjects.find((s) => s.name === subjectName)
    if (subject) {
      const IconComponent = subject.icon
      return <IconComponent className="h-5 w-5" />
    }
    return <FileText className="h-5 w-5" />
  }

  // Get subject color
  const getSubjectColor = (subjectName) => {
    const subject = subjects.find((s) => s.name === subjectName)
    return subject?.color || "bg-gradient-to-br from-gray-400 to-gray-600"
  }

  // Close all modals
  const closeAllModals = () => {
    setShowFeedbackPanel(false)
    setShowReflectionModal(false)
    setShowReuploadModal(false)
    setShowFlashcardsModal(false)
    setShowStudyModal(false)
    setShowViewAssignmentPanel(false)
    setShowEditTagsModal(false)
    setShowQuickQuizModal(false)
    setShowMultipleChoiceModal(false)
    setShowLongAnswerModal(false)
  }

  return (
    // Component JSX remains the same, just use props instead of searchParams
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <style jsx>{perspectiveStyles}</style>
      <div ref={confettiRef} className="fixed inset-0 pointer-events-none z-50"></div>

      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 opacity-10 rounded-3xl"></div>
          <div className="relative p-6 rounded-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-transparent bg-clip-text">
              File Manager
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
              Upload and manage your assignments, notes, and class materials
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-3xl">
              All uploads are processed to support your study tools — including reflections, chat help, and flashcard
              building.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Upload New Material Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl">
          <div
            className="p-4 flex justify-between items-center cursor-pointer"
            onClick={() => setUploadPanelOpen(!uploadPanelOpen)}
          >
            <h2 className="text-2xl font-bold flex items-center">
              <Upload className="mr-2 h-5 w-5 text-blue-500" />📥 Upload New Material
            </h2>
            <Button variant="ghost" size="icon" className="rounded-full">
              {uploadPanelOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Button>
          </div>

          <AnimatePresence>
            {uploadPanelOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="p-6">
                  {uploadSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center p-8 text-center"
                    >
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">✅ Uploaded!</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        We've filed this where it belongs. This file will now show up in your dashboard, assignments,
                        and chat help.
                      </p>

                      {/* Completion Summary */}
                      {completionSummary && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="mt-4 w-full max-w-md bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800"
                        >
                          <h4 className="font-medium text-green-800 dark:text-green-300 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Assignment Completed
                          </h4>
                          <div className="mt-2 space-y-1 text-sm">
                            <p className="text-gray-600 dark:text-gray-300">
                              <span className="font-medium">Subject:</span> {completionSummary.subject}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                              <span className="font-medium">Assignment:</span> {completionSummary.assignmentTitle}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                              <span className="font-medium">Submitted:</span> {completionSummary.submissionDate}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 flex items-center">
                              <span className="font-medium mr-1">GPT Feedback:</span>
                              <span className="flex items-center text-blue-500">
                                <span className="relative flex h-3 w-3 mr-1">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                                </span>
                                {completionSummary.feedbackStatus}
                              </span>
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="space-y-6">
                      {/* File Upload Area */}
                      <div>
                        <h3 className="text-lg font-medium mb-2">Upload Your File</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          Upload your assignments, notes, workbook pages, or any class material here.
                        </p>
                        <div
                          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                            files.length > 0
                              ? "border-blue-300 dark:border-blue-700"
                              : "border-gray-300 dark:border-gray-700"
                          }`}
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onClick={() => document.getElementById("file-upload").click()}
                        >
                          <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Drag and drop your files here, or click to browse
                          </p>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                            Supports PDF, DOCX, JPG, PNG, etc.
                          </p>
                          <input id="file-upload" type="file" multiple className="hidden" onChange={handleFileChange} />
                          {files.length > 0 && (
                            <div className="mt-4 text-left">
                              <p className="text-sm font-medium">Selected files:</p>
                              <ul className="mt-2 space-y-1">
                                {files.map((file, index) => (
                                  <li
                                    key={index}
                                    className="text-sm text-gray-600 dark:text-gray-400 flex items-center"
                                  >
                                    <div className="w-1 h-1 bg-blue-500 rounded-full mr-2"></div>
                                    {file.name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Upload Type Selector */}
                      <div className="space-y-5">
                        <div>
                          <h3 className="text-lg font-medium mb-1">What are you uploading?</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            Tell us what you're uploading so we can route it correctly.
                          </p>
                          <Select value={uploadCategory} onValueChange={setUploadCategory}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Completed Student Work">📘 Completed Student Work</SelectItem>
                              <SelectItem value="Class or Teacher Material">📚 Class or Teacher Material</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {uploadCategory && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Label htmlFor="upload-type">Type</Label>
                            <Select value={uploadType} onValueChange={setUploadType}>
                              <SelectTrigger id="upload-type" className="w-full mt-1">
                                <SelectValue placeholder="Select upload type" />
                              </SelectTrigger>
                              <SelectContent>
                                {uploadTypes[uploadCategory]?.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </motion.div>
                        )}

                        <div>
                          <Label htmlFor="subject">Subject or Class</Label>
                          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger id="subject" className="w-full mt-1">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent>
                              {subjects.map((subject) => (
                                <SelectItem key={subject.id} value={subject.name}>
                                  {subject.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {uploadCategory === "Completed Student Work" && uploadType === "Completed Assignment" && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Label htmlFor="assignment-link">Link to a Specific Assignment? (optional)</Label>
                            <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
                              <SelectTrigger id="assignment-link" className="w-full mt-1">
                                <SelectValue placeholder="Select an assignment" />
                              </SelectTrigger>
                              <SelectContent>
                                {assignments
                                  .filter((a) => a.subject === selectedSubject)
                                  .map((assignment) => (
                                    <SelectItem key={assignment.id} value={assignment.id.toString()}>
                                      {assignment.title} ({assignment.status})
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </motion.div>
                        )}
                      </div>

                      {/* Upload Progress */}
                      {isUploading && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <Progress value={uploadProgress} className="h-2" />
                        </div>
                      )}

                      {/* Submit Button */}
                      <div className="flex justify-end mt-6">
                        <Button
                          onClick={handleSubmit}
                          disabled={
                            isUploading || !uploadCategory || !uploadType || !selectedSubject || files.length === 0
                          }
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full px-8 py-2 shadow-md hover:shadow-lg transition-all"
                        >
                          {isUploading ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Uploading...
                            </>
                          ) : (
                            <>Upload File</>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Writing Coach Recommendation Card */}
        <AnimatePresence>
          {showWritingCoachCard && (
            <motion.div
              ref={writingCardRef}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-r from-purple-500/90 to-pink-500/90 dark:from-purple-600/90 dark:to-pink-600/90 rounded-xl">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center mb-2">
                        ✍️ Looks like a writing project!
                      </h3>
                      <p className="text-white/90">
                        Would you like to improve <span className="font-medium">{writingFileName}</span> with AI
                        feedback before submitting to your parent?
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => router.push("/student/writing-submissions")}
                        className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-full px-6 py-2 shadow-md hover:shadow-lg transition-all hover:scale-105"
                      >
                        Open in AI Writing Coach
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-white hover:bg-white/10"
                        onClick={() => setShowWritingCoachCard(false)}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* My Uploaded Files Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8"
      >
        <Card className="overflow-hidden border-none shadow-md bg-gray-50 dark:bg-gray-900/50 rounded-xl">
          <div
            className="p-4 flex justify-between items-center cursor-pointer"
            onClick={() => setFilesPanelOpen(!filesPanelOpen)}
          >
            <h2 className="text-2xl font-bold flex items-center">
              <FileText className="mr-2 h-5 w-5 text-blue-500" />📂 My Uploaded Files
            </h2>
            <Button variant="ghost" size="icon" className="rounded-full">
              {filesPanelOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Button>
          </div>

          <AnimatePresence>
            {filesPanelOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="p-6">
                  {/* Search and Filter */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search files..."
                        className="pl-9 rounded-full border-gray-200 dark:border-gray-700 shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Tabs */}
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
                    <TabsList className="mb-4">
                      <TabsTrigger value="all">All Files</TabsTrigger>
                      <TabsTrigger value="completed">Student Work</TabsTrigger>
                      <TabsTrigger value="source">Class Materials</TabsTrigger>
                      {subjects.map((subject) => (
                        <TabsTrigger key={subject.id} value={subject.name.toLowerCase()}>
                          {subject.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>

                  {/* Files List */}
                  {Object.keys(groupedUploads).length === 0 ? (
                    <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                      <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
                        <AlertCircle className="h-6 w-6 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No files found</h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                        {searchQuery
                          ? "No files match your search criteria. Try a different search term."
                          : "Upload files to see them here."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {Object.entries(groupedUploads).map(([subject, files]) => (
                        <motion.div
                          key={subject}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="space-y-4"
                        >
                          <div className="flex items-center space-x-2">
                            <h3 className="text-xl font-bold flex items-center">
                              {renderSubjectIcon(subject)}
                              <span className="ml-2">{subject}</span>
                            </h3>
                            <div className="h-px flex-grow bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700"></div>
                            <Badge variant="outline" className="rounded-full">
                              {files.length} {files.length === 1 ? "File" : "Files"}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {files.map((file) => (
                              <motion.div
                                key={file.id}
                                whileHover={{ y: -4 }}
                                transition={{ duration: 0.2 }}
                                className="relative"
                              >
                                <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all rounded-xl border border-gray-100 dark:border-gray-800">
                                  <div className={`h-2 ${getSubjectColor(file.subject)}`}></div>
                                  <CardContent className="p-4">
                                    <div className="flex flex-col space-y-4">
                                      <div>
                                        {/* Auto-tagged by AI label */}
                                        <div className="flex justify-between items-start mb-2">
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Badge
                                                  variant="outline"
                                                  className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 flex items-center gap-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-help"
                                                >
                                                  <Sparkles className="h-3 w-3" /> Auto-tagged by AI
                                                </Badge>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p className="text-xs max-w-xs">
                                                  Tags are based on your document content. You can edit them anytime.
                                                </p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                          <Badge
                                            variant={file.status === "Graded" ? "success" : "secondary"}
                                            className="text-xs"
                                          >
                                            {file.status}
                                          </Badge>
                                        </div>

                                        <h3 className="font-bold text-lg line-clamp-1">{file.fileName}</h3>
                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                          <Badge variant="outline" className="text-xs">
                                            {file.subject}
                                          </Badge>
                                          <Badge
                                            variant="outline"
                                            className="text-xs flex items-center gap-1 group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                            onClick={() => {
                                              setSelectedFile(file)
                                              setShowEditTagsModal(true)
                                            }}
                                          >
                                            {file.type}
                                            <Pencil className="h-3 w-3 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                          </Badge>
                                          <span className="text-xs text-gray-500 flex items-center">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {file.date}
                                          </span>
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                          {file.tags.map((tag, index) => (
                                            <Badge
                                              key={index}
                                              variant="secondary"
                                              className="text-xs flex items-center gap-1 group cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                              onClick={() => {
                                                setSelectedFile(file)
                                                setShowEditTagsModal(true)
                                              }}
                                            >
                                              {tag}
                                              <Pencil className="h-3 w-3 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>

                                      <Separator />

                                      {/* Primary Action Buttons - First Row */}
                                      <div className="flex flex-wrap gap-2">
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-full flex-1"
                                                onClick={() => {
                                                  setSelectedFile(file)
                                                  setShowFeedbackPanel(true)
                                                }}
                                              >
                                                <Eye className="h-3 w-3 mr-1" />
                                                View Feedback
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p className="text-xs">See teacher or AI feedback for this work</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>

                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-full flex-1"
                                                onClick={() => {
                                                  setSelectedFile(file)
                                                  setReflectionText(`What did you learn working on ${file.fileName}?`)
                                                  setShowReflectionModal(true)
                                                }}
                                              >
                                                <PenSquare className="h-3 w-3 mr-1" />
                                                Reflect
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p className="text-xs">Log what you learned from this assignment</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>

                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-full flex-1"
                                                onClick={() => {
                                                  setSelectedFile(file)
                                                  setShowReuploadModal(true)
                                                }}
                                              >
                                                <RefreshCw className="h-3 w-3 mr-1" />
                                                Re-upload
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p className="text-xs">Replace this file with an updated version</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>

                                        {file.linkedAssignment && (
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  className="rounded-full flex-1"
                                                  onClick={() => {
                                                    setSelectedFile(file)
                                                    setShowViewAssignmentPanel(true)
                                                  }}
                                                >
                                                  <ExternalLink className="h-3 w-3 mr-1" />
                                                  View Assignment
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p className="text-xs">
                                                  Open and review the original file you submitted
                                                </p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        )}
                                      </div>

                                      {/* Secondary Action Buttons - Second Row */}
                                      {(file.hasFlashcards || file.hasQuiz) && (
                                        <div className="flex flex-wrap gap-2">
                                          {file.hasFlashcards && (
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="rounded-full flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400"
                                              onClick={() => {
                                                closeAllModals()
                                                setSelectedFile(file)
                                                setShowFlashcardsModal(true)
                                              }}
                                            >
                                              <Brain className="h-3 w-3 mr-1" />
                                              Flashcards
                                            </Button>
                                          )}
                                          {file.hasQuiz && (
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="rounded-full flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 dark:text-purple-400"
                                                >
                                                  <BarChart className="h-3 w-3 mr-1" />
                                                  Quiz Me
                                                </Button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent align="end" className="w-56 p-2">
                                                <DropdownMenuItem
                                                  className="cursor-pointer"
                                                  onClick={() => {
                                                    closeAllModals()
                                                    setSelectedFile(file)
                                                    setShowQuickQuizModal(true)
                                                  }}
                                                >
                                                  5-question quick quiz
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                  className="cursor-pointer"
                                                  onClick={() => {
                                                    closeAllModals()
                                                    setSelectedFile(file)
                                                    setShowMultipleChoiceModal(true)
                                                  }}
                                                >
                                                  Multiple-choice
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                  className="cursor-pointer"
                                                  onClick={() => {
                                                    closeAllModals()
                                                    setSelectedFile(file)
                                                    setShowLongAnswerModal(true)
                                                  }}
                                                >
                                                  Long-answer practice
                                                </DropdownMenuItem>
                                                <Separator className="my-2" />
                                                <DropdownMenuItem
                                                  className="cursor-pointer flex items-center text-blue-600"
                                                  onClick={() => {
                                                    router.push(
                                                      `/student/chat?prompt=I want to take a full quiz based on ${file.fileName}. Can you generate a detailed study quiz with explanations?`,
                                                    )
                                                  }}
                                                >
                                                  <MessageSquare className="h-4 w-4 mr-2" />
                                                  Launch full quiz in GPT Assistant
                                                </DropdownMenuItem>
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                          )}
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="rounded-full flex-1 bg-green-50 hover:bg-green-100 text-green-700 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-400"
                                            onClick={() => {
                                              router.push(`/student/chat?file=${file.id}`)
                                            }}
                                          >
                                            <Paperclip className="h-3 w-3 mr-1" />
                                            Study With This
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* View Assignment Panel */}
      <Sheet open={showViewAssignmentPanel} onOpenChange={setShowViewAssignmentPanel}>
        <SheetContent className="sm:max-w-[600px] p-0 overflow-hidden">
          {selectedFile && (
            <>
              <div className={`h-2 w-full ${getSubjectColor(selectedFile.subject)}`}></div>
              <SheetHeader className="px-6 pt-6 pb-2">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${getSubjectColor(
                      selectedFile.subject,
                    )} text-white mr-3`}
                  >
                    {renderSubjectIcon(selectedFile.subject)}
                  </div>
                  <div>
                    <SheetTitle>{selectedFile.fileName}</SheetTitle>
                    <SheetDescription>
                      {selectedFile.type} • {selectedFile.date}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <div className="px-6 py-4 space-y-6">
                {/* File Metadata */}
                <div className="flex flex-wrap gap-2">
                  {selectedFile.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* File Preview */}
                <div className="border rounded-lg overflow-hidden bg-white">
                  <div className="h-[400px] flex items-center justify-center">
                    <img
                      src={selectedFile.fileUrl || "/placeholder.svg"}
                      alt={selectedFile.fileName}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>

                {/* Assignment Details */}
                {selectedFile.linkedAssignment && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-2">Assignment Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Title:</span>
                        <span>{selectedFile.linkedAssignment.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Status:</span>
                        <Badge
                          variant={selectedFile.linkedAssignment.completed ? "success" : "outline"}
                          className="text-xs"
                        >
                          {selectedFile.linkedAssignment.completed ? "Completed" : "Pending"}
                        </Badge>
                      </div>
                      {selectedFile.linkedAssignment.feedbackStatus && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Feedback:</span>
                          <span>{selectedFile.linkedAssignment.feedbackStatus}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <SheetFooter className="p-6 pt-2 flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowViewAssignmentPanel(false)}
                  className="w-full sm:w-auto"
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    // Simulate download
                    toast({
                      title: "Download started",
                      description: `${selectedFile.fileName} is being downloaded.`,
                    })
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  size="sm"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600"
                  onClick={() => {
                    setShowViewAssignmentPanel(false)
                    router.push("/student/chat")
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Open in Chat
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Edit Tags Modal */}
      <Dialog open={showEditTagsModal} onOpenChange={setShowEditTagsModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Tags</DialogTitle>
            <DialogDescription>
              Add or remove tags to better organize your files and improve AI suggestions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-tags">Current Tags</Label>
              <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[60px]">
                {currentTags.length > 0 ? (
                  currentTags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1 pr-1">
                      {tag}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">No tags added yet</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-tag">Add New Tag</Label>
              <div className="relative">
                <Input
                  id="new-tag"
                  placeholder="Type to add a new tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newTag.trim()) {
                      e.preventDefault()
                      handleAddTag(newTag.trim())
                    }
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-7 w-7 rounded-full"
                  onClick={() => handleAddTag(newTag.trim())}
                  disabled={!newTag.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {filteredTags.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Suggested tags:</p>
                  <div className="flex flex-wrap gap-1">
                    {filteredTags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => handleAddTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditTagsModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTags} className="bg-gradient-to-r from-blue-500 to-purple-600">
              Save Tags
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Slide-in Panel */}
      <Sheet open={showFeedbackPanel} onOpenChange={setShowFeedbackPanel}>
        <SheetContent className="sm:max-w-[500px] p-0 overflow-hidden">
          {selectedFile && (
            <>
              <div className={`h-2 w-full ${getSubjectColor(selectedFile.subject)}`}></div>
              <SheetHeader className="px-6 pt-6 pb-2">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${getSubjectColor(
                      selectedFile.subject,
                    )} text-white mr-3`}
                  >
                    {renderSubjectIcon(selectedFile.subject)}
                  </div>
                  <div>
                    <SheetTitle>Feedback for {selectedFile.fileName}</SheetTitle>
                    <SheetDescription>
                      {selectedFile.type} • {selectedFile.date}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">File Information</h4>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Category:</span>
                        <span>{selectedFile.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Type:</span>
                        <span>{selectedFile.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Subject:</span>
                        <span>{selectedFile.subject}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Uploaded:</span>
                        <span>{selectedFile.date}</span>
                      </div>
                      {selectedFile.linkedAssignment && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Linked Assignment:</span>
                          <span>{selectedFile.linkedAssignment.title}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">AI-Generated Resources</h4>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-2">
                      {selectedFile.gptOutputs.map((output, index) => (
                        <div key={index} className="flex items-center">
                          <Sparkles className="h-4 w-4 text-purple-500 mr-2" />
                          <span>{output}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedFile.status === "Graded" && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Feedback</h4>
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                        <p className="text-sm">
                          Great work on this assignment! Your understanding of the concepts is clear, and you've applied
                          them correctly. I particularly liked your analysis in the second section. For future
                          assignments, try to expand more on your conclusions.
                        </p>
                        <div className="mt-2 flex justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Grade:</span>
                          <span className="font-medium text-green-600 dark:text-green-400">A-</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <SheetFooter className="p-6 pt-2 flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFeedbackPanel(false)}
                  className="w-full sm:w-auto"
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600"
                  onClick={() => {
                    setShowFeedbackPanel(false)
                    router.push("/student/chat")
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Get Help in Chat
                </Button>
                {selectedFile.linkedAssignment && (
                  <Button
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      setShowFeedbackPanel(false)
                      router.push("/student/assignments")
                    }}
                  >
                    View Full Assignment
                  </Button>
                )}
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Reflection Modal */}
      <Dialog open={showReflectionModal} onOpenChange={setShowReflectionModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reflect on Your Learning</DialogTitle>
            <DialogDescription>
              Reflecting helps reinforce what you've learned and earns you XP and coins!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Today's Date:</span>
              <span className="text-sm">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reflection">Your Reflection</Label>
              <Textarea
                id="reflection"
                placeholder="Share what you learned, what was challenging, or what you'd do differently next time..."
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                className="min-h-[150px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReflectionModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowReflectionModal(false)
                toast({
                  title: "Reflection Submitted!",
                  description: (
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span>+10 XP</span>
                      <Coins className="h-4 w-4 text-yellow-500 ml-2" />
                      <span>+2 Coins for reflection</span>
                    </div>
                  ),
                })
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-600"
            >
              Submit Reflection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Re-upload Modal */}
      <Dialog open={showReuploadModal} onOpenChange={setShowReuploadModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Re-upload File</DialogTitle>
            <DialogDescription>Upload a new version of {selectedFile?.fileName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>File Details (Auto-retained)</Label>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Subject:</span>
                  <span>{selectedFile?.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Type:</span>
                  <span>{selectedFile?.type}</span>
                </div>
                {selectedFile?.linkedAssignment && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Linked Assignment:</span>
                    <span>{selectedFile?.linkedAssignment.title}</span>
                  </div>
                )}
              </div>
            </div>

            <div
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              onClick={() => document.getElementById("reupload-file").click()}
            >
              <FileUp className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Drag and drop your updated file here, or click to browse
              </p>
              <input id="reupload-file" type="file" className="hidden" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reupload-reason">Why are you re-uploading? (Optional)</Label>
              <Textarea
                id="reupload-reason"
                placeholder="I made corrections based on feedback, added more detail, fixed formatting issues..."
                value={reuploadReason}
                onChange={(e) => setReuploadReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReuploadModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowReuploadModal(false)
                toast({
                  title: "File Re-uploaded",
                  description: "Your updated file has been successfully uploaded.",
                })
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600"
            >
              Upload New Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Flashcards Modal */}
      <Dialog open={showFlashcardsModal} onOpenChange={setShowFlashcardsModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Flashcards for {selectedFile?.fileName}</DialogTitle>
            <DialogDescription>AI-generated flashcards to help you study this material</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Flashcard Preview */}
            <div className="perspective">
              <div
                className={`card-container ${isCardFlipped ? "flipped" : ""}`}
                onClick={() => setIsCardFlipped(!isCardFlipped)}
              >
                <div className="card-front bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                  <div className="text-center">
                    <Tag className="h-5 w-5 text-blue-500 mx-auto mb-2" />
                    <p className="text-lg font-medium">
                      {currentFlashcards[currentFlashcardIndex]?.question || "Loading..."}
                    </p>
                  </div>
                </div>
                <div className="card-back bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
                  <div className="text-center">
                    <BookOpen className="h-5 w-5 text-purple-500 mx-auto mb-2" />
                    <p className="text-md">{currentFlashcards[currentFlashcardIndex]?.answer || "Loading..."}</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-center text-gray-500">Tap a flashcard to flip it and reveal the answer</p>

            {/* Navigation Controls */}
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsCardFlipped(false)
                  setCurrentFlashcardIndex(
                    (currentFlashcardIndex - 1 + currentFlashcards.length) % currentFlashcards.length,
                  )
                }}
                disabled={currentFlashcards.length <= 1}
              >
                Previous
              </Button>
              <span className="flex items-center text-sm text-gray-500">
                {currentFlashcardIndex + 1} / {currentFlashcards.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsCardFlipped(false)
                  setCurrentFlashcardIndex((currentFlashcardIndex + 1) % currentFlashcards.length)
                }}
                disabled={currentFlashcards.length <= 1}
              >
                Next
              </Button>
            </div>

            <div className="flex justify-center gap-2">
              <div className="text-xs text-gray-500 mb-1">Auto-generated study tags:</div>
            </div>
            <div className="flex justify-center flex-wrap gap-2">
              {currentFlashcards[currentFlashcardIndex]?.tags.map((tag, index) => (
                <Badge
                  key={index}
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  onClick={() => {
                    // Filter by tag functionality would go here
                    toast({
                      title: `Filtering by "${tag}"`,
                      description: "Showing flashcards with this tag.",
                    })
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowFlashcardsModal(false)} className="w-full sm:w-auto">
              Close
            </Button>
            <Button
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600"
              onClick={() => {
                setShowFlashcardsModal(false)
                router.push("/student/flashcards")
              }}
            >
              Study Now
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={() => {
                setSelectedFile(selectedFile)
                setShowEditTagsModal(true)
                setShowFlashcardsModal(false)
              }}
            >
              Edit Tags
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={() => {
                setShowFlashcardsModal(false)
                router.push("/student/chat")
              }}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Send to Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Study With This Modal */}
      <Dialog open={showStudyModal} onOpenChange={setShowStudyModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Study With {selectedFile?.fileName}</DialogTitle>
            <DialogDescription>Use this file in the GPT Learning Assistant to get personalized help</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="study-option">What kind of help do you want?</Label>
              <Select value={selectedStudyOption} onValueChange={setSelectedStudyOption}>
                <SelectTrigger id="study-option" className="w-full">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quiz">Quiz Me</SelectItem>
                  <SelectItem value="explain">Explain It</SelectItem>
                  <SelectItem value="walkthrough">Walk Me Through This</SelectItem>
                  <SelectItem value="tips">Give Study Tips</SelectItem>
                  <SelectItem value="questions">Just Ask Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">
                    GPT Learning Assistant will help you study
                  </h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Your file will be loaded into the chat, and GPT will be ready to help you with your specific needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStudyModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowStudyModal(false)
                router.push("/student/chat")
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600"
              disabled={!selectedStudyOption}
            >
              <ChevronRight className="h-4 w-4 mr-2" />
              Continue to Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Quiz Modal */}
      <Dialog open={showQuickQuizModal} onOpenChange={setShowQuickQuizModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                <FileQuestion className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <DialogTitle>🧠 Quick Quiz: 5 Questions</DialogTitle>
                <DialogDescription>Test your knowledge of {selectedFile?.fileName}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {showQuizResults ? (
            <div className="py-6 space-y-6">
              <div className="text-center">
                <div className="inline-block bg-green-100 dark:bg-green-900/30 p-4 rounded-full mb-4">
                  <Award className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
                <p className="text-lg font-medium">
                  Your score: <span className="text-green-600 dark:text-green-400">{quizScore} out of 5</span>
                </p>
                <div className="mt-4 flex justify-center">
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs">
                    <Sparkles className="h-3 w-3 mr-1" /> Powered by AI
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setCurrentQuizIndex(0)
                    setSelectedAnswer(null)
                    setIsAnswerSubmitted(false)
                    setShowQuizResults(false)
                  }}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Review My Answers
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setCurrentQuizIndex(0)
                    setSelectedAnswer(null)
                    setIsAnswerSubmitted(false)
                    setQuizScore(0)
                    setShowQuizResults(false)
                    setQuizAnswers(Array(5).fill(null))
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
                  onClick={() => {
                    setShowQuickQuizModal(false)
                    router.push("/student/chat")
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send to Chat
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-4 space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Question {currentQuizIndex + 1} of 5</span>
                <Badge variant="outline" className="text-xs">
                  {selectedFile?.subject}
                </Badge>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">{currentQuizQuestions[currentQuizIndex]?.question}</h3>

                <div className="space-y-2">
                  {currentQuizQuestions[currentQuizIndex]?.options.map((option, index) => (
                    <div
                      key={index}
                      className={`quiz-option p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedAnswer === index
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "hover:border-gray-400"
                      } ${
                        isAnswerSubmitted && index === currentQuizQuestions[currentQuizIndex].correctAnswer
                          ? "correct border-green-500 bg-green-50 dark:bg-green-900/20"
                          : isAnswerSubmitted && selectedAnswer === index
                            ? "incorrect border-red-500 bg-red-50 dark:bg-red-900/20"
                            : ""
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border ${
                            selectedAnswer === index ? "bg-blue-500 border-blue-500 text-white" : "border-gray-300"
                          } ${
                            isAnswerSubmitted && index === currentQuizQuestions[currentQuizIndex].correctAnswer
                              ? "bg-green-500 border-green-500 text-white"
                              : isAnswerSubmitted && selectedAnswer === index
                                ? "bg-red-500 border-red-500 text-white"
                                : ""
                          }`}
                        >
                          {isAnswerSubmitted && index === currentQuizQuestions[currentQuizIndex].correctAnswer ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : isAnswerSubmitted && selectedAnswer === index ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <span className="text-xs">{String.fromCharCode(65 + index)}</span>
                          )}
                        </div>
                        <span className="flex-1">{option}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {isAnswerSubmitted && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mt-4">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Explanation</h4>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          {currentQuizQuestions[currentQuizIndex]?.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setShowQuickQuizModal(false)}>
                  Exit Quiz
                </Button>
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null || isAnswerSubmitted}
                  className={isAnswerSubmitted ? "hidden" : "bg-gradient-to-r from-blue-500 to-purple-600"}
                >
                  Submit Answer
                </Button>
                {isAnswerSubmitted && currentQuizIndex < 4 && (
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                    Next Question <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs">
              <Sparkles className="h-3 w-3 mr-1" /> Powered by AI
            </Badge>
          </div>
        </DialogContent>
      </Dialog>

      {/* Multiple Choice Modal */}
      <Dialog open={showMultipleChoiceModal} onOpenChange={setShowMultipleChoiceModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                <ListChecks className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <DialogTitle>📝 Multiple-Choice Practice</DialogTitle>
                <DialogDescription>Practice with questions from {selectedFile?.fileName}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            {currentQuizQuestions.map((question, qIndex) => {
              const isAnswered = quizAnswers[qIndex] !== null
              const isCorrect = isAnswered && quizAnswers[qIndex] === question.correctAnswer

              return (
                <div key={qIndex} className="space-y-4 pb-4 border-b last:border-b-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Question {qIndex + 1}</h3>
                    {isAnswered && (
                      <Badge
                        className={
                          isCorrect
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        }
                      >
                        {isCorrect ? "Correct" : "Incorrect"}
                      </Badge>
                    )}
                  </div>

                  <p className="text-base">{question.question}</p>

                  <div className="space-y-2">
                    {question.options.map((option, oIndex) => (
                      <div
                        key={oIndex}
                        className={`quiz-option p-3 border rounded-lg cursor-pointer transition-all ${
                          !isAnswered && qIndex === currentQuizIndex && selectedAnswer === oIndex
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "hover:border-gray-400"
                        } ${
                          isAnswered && oIndex === question.correctAnswer
                            ? "correct border-green-500 bg-green-50 dark:bg-green-900/20"
                            : isAnswered &&
                                quizAnswers[qIndex] === oIndex &&
                                quizAnswers[qIndex] !== question.correctAnswer
                              ? "incorrect border-red-500 bg-red-50 dark:bg-red-900/20"
                              : ""
                        }`}
                        onClick={() => {
                          if (!isAnswered && qIndex === currentQuizIndex) {
                            handleAnswerSelect(oIndex)
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border ${
                              !isAnswered && qIndex === currentQuizIndex && selectedAnswer === oIndex
                                ? "bg-blue-500 border-blue-500 text-white"
                                : "border-gray-300"
                            } ${
                              isAnswered && oIndex === question.correctAnswer
                                ? "bg-green-500 border-green-500 text-white"
                                : isAnswered &&
                                    quizAnswers[qIndex] === oIndex &&
                                    quizAnswers[qIndex] !== question.correctAnswer
                                  ? "bg-red-500 border-red-500 text-white"
                                  : ""
                            }`}
                          >
                            {isAnswered && oIndex === question.correctAnswer ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : isAnswered &&
                              quizAnswers[qIndex] === oIndex &&
                              quizAnswers[qIndex] !== question.correctAnswer ? (
                              <XCircle className="h-4 w-4" />
                            ) : (
                              <span className="text-xs">{String.fromCharCode(65 + oIndex)}</span>
                            )}
                          </div>
                          <span className="flex-1">{option}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {isAnswered ? (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mt-2">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Explanation</h4>
                          <p className="text-sm text-blue-600 dark:text-blue-400">{question.explanation}</p>
                        </div>
                      </div>
                    </div>
                  ) : qIndex === currentQuizIndex ? (
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={selectedAnswer === null}
                      className="bg-gradient-to-r from-purple-500 to-blue-600 mt-2"
                    >
                      Check Answer
                    </Button>
                  ) : null}
                </div>
              )
            })}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowMultipleChoiceModal(false)} className="w-full sm:w-auto">
              Close
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={() => {
                setCurrentQuizIndex(0)
                setSelectedAnswer(null)
                setIsAnswerSubmitted(false)
                setQuizScore(0)
                setQuizAnswers(Array(5).fill(null))
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Study Again
            </Button>
            <Button
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-blue-600"
              onClick={() => {
                setShowMultipleChoiceModal(false)
                router.push("/student/chat")
              }}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Discuss in Chat
            </Button>
          </DialogFooter>

          <div className="flex justify-center">
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 text-xs">
              <Sparkles className="h-3 w-3 mr-1" /> Powered by AI
            </Badge>
          </div>
        </DialogContent>
      </Dialog>

      {/* Long Answer Modal */}
      <Dialog open={showLongAnswerModal} onOpenChange={setShowLongAnswerModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                <Edit className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <DialogTitle>🖊 Long-Answer Practice</DialogTitle>
                <DialogDescription>
                  Practice writing detailed responses about {selectedFile?.fileName}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="py-4 space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                Prompt {currentLongAnswerIndex + 1} of {currentLongAnswerPrompts.length}
              </span>
              <Badge variant="outline" className="text-xs">
                {selectedFile?.subject}
              </Badge>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">{currentLongAnswerPrompts[currentLongAnswerIndex]?.prompt}</h3>

              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-gray-500 mt-0.5" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentLongAnswerPrompts[currentLongAnswerIndex]?.guidance}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="long-answer">Your Response</Label>
                <Textarea
                  id="long-answer"
                  placeholder="Write your answer here..."
                  value={longAnswerResponses[currentLongAnswerIndex] || ""}
                  onChange={(e) => handleLongAnswerInput(currentLongAnswerIndex, e.target.value)}
                  className="min-h-[200px]"
                />
              </div>

              {showLongAnswerFeedback && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mt-4">
                  <div className="flex items-start gap-2">
                    <Zap className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-700 dark:text-green-300 mb-1">AI Feedback</h4>
                      <div className="text-sm text-green-600 dark:text-green-400 space-y-2">
                        <p>
                          <strong>What you did well:</strong> Your explanation shows a good understanding of the core
                          concepts. You've included several key points and structured your response logically.
                        </p>
                        <p>
                          <strong>Areas to improve:</strong> Consider adding specific examples to illustrate your
                          points. Also, try to connect your ideas more explicitly to show relationships between
                          concepts.
                        </p>
                        <p>
                          <strong>Next steps:</strong> Revise your answer to include at least one concrete example and
                          make sure you've addressed all parts of the prompt.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  if (currentLongAnswerIndex > 0) {
                    setCurrentLongAnswerIndex(currentLongAnswerIndex - 1)
                    setShowLongAnswerFeedback(false)
                  } else {
                    setShowLongAnswerModal(false)
                  }
                }}
              >
                {currentLongAnswerIndex > 0 ? "Previous" : "Exit"}
              </Button>

              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowLongAnswerFeedback(!showLongAnswerFeedback)}
                  disabled={!longAnswerResponses[currentLongAnswerIndex]}
                >
                  Get AI Feedback
                </Button>

                <Button
                  className="bg-gradient-to-r from-green-500 to-blue-600"
                  onClick={() => {
                    if (currentLongAnswerIndex < currentLongAnswerPrompts.length - 1) {
                      setCurrentLongAnswerIndex(currentLongAnswerIndex + 1)
                      setShowLongAnswerFeedback(false)
                    } else {
                      setShowLongAnswerModal(false)
                      router.push("/student/chat")
                    }
                  }}
                >
                  {currentLongAnswerIndex < currentLongAnswerPrompts.length - 1 ? (
                    <>
                      Next <ArrowRight className="ml-1 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send to GPT Chat
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs">
              <Sparkles className="h-3 w-3 mr-1" /> Powered by AI
            </Badge>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
