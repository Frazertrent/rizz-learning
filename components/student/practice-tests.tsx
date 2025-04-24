"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Sparkles, Upload, MessageSquare, FileText } from "lucide-react"
import Link from "next/link"
import { CreatableSelect, type Option } from "@/components/ui/creatable-select"

interface PracticeTestsPageProps {
  setId: string | null
  setName: string | null
}

export default function PracticeTestsPage({ setId, setName }: PracticeTestsPageProps) {
  const router = useRouter()

  // State for test setup
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [selectedSource, setSelectedSource] = useState<string>("")
  const [selectedTopic, setSelectedTopic] = useState<string>("")
  const [isSetupComplete, setIsSetupComplete] = useState(false)

  // Options for dropdowns
  const classOptions: Option[] = [
    { value: "math", label: "Math" },
    { value: "science", label: "Science" },
    { value: "english", label: "English" },
    { value: "history", label: "History" },
    { value: "art", label: "Art" },
    { value: "music", label: "Music" },
    { value: "physical_education", label: "Physical Education" },
    { value: "foreign_language", label: "Foreign Language" },
    { value: "computer_science", label: "Computer Science" },
  ]

  const sourceOptions: Option[] = [
    { value: "study_guide", label: "Study Guide" },
    { value: "workbook", label: "Workbook" },
    { value: "lecture_notes", label: "Lecture Notes" },
    { value: "assignment", label: "Assignment" },
    { value: "quiz", label: "Quiz" },
    { value: "test_prep", label: "Test Prep" },
    { value: "textbook", label: "Textbook" },
    { value: "flashcards", label: "Flashcards" },
  ]

  // Topic options (would be dynamically populated in a real app based on class selection)
  const getTopicOptions = (classValue: string): Option[] => {
    switch (classValue) {
      case "math":
        return [
          { value: "algebra_fundamentals", label: "Algebra Fundamentals" },
          { value: "geometry_basics", label: "Geometry Basics" },
          { value: "calculus_intro", label: "Introduction to Calculus" },
          { value: "statistics", label: "Statistics and Probability" },
        ]
      case "science":
        return [
          { value: "cell_biology", label: "Cell Biology" },
          { value: "chemistry_basics", label: "Chemistry Basics" },
          { value: "physics_mechanics", label: "Physics: Mechanics" },
          { value: "earth_science", label: "Earth Science" },
        ]
      case "history":
        return [
          { value: "world_war_ii", label: "WWII Overview" },
          { value: "ancient_civilizations", label: "Ancient Civilizations" },
          { value: "us_constitution", label: "US Constitution" },
          { value: "civil_rights", label: "Civil Rights Movement" },
        ]
      case "english":
        return [
          { value: "shakespeare", label: "Shakespeare's Works" },
          { value: "grammar_essentials", label: "Grammar Essentials" },
          { value: "essay_writing", label: "Essay Writing" },
          { value: "american_literature", label: "American Literature" },
        ]
      default:
        return [
          { value: "general_topic_1", label: "General Topic 1" },
          { value: "general_topic_2", label: "General Topic 2" },
          { value: "general_topic_3", label: "General Topic 3" },
        ]
    }
  }

  const [topicOptions, setTopicOptions] = useState<Option[]>([])

  // Update topic options when class changes
  useEffect(() => {
    if (selectedClass) {
      setTopicOptions(getTopicOptions(selectedClass))
      setSelectedTopic("") // Reset topic when class changes
    } else {
      setTopicOptions([])
    }
  }, [selectedClass])

  // Check if setup is complete whenever selections change
  useEffect(() => {
    if (selectedClass && selectedSource && selectedTopic) {
      setIsSetupComplete(true)
    } else {
      setIsSetupComplete(false)
    }
  }, [selectedClass, selectedSource, selectedTopic])

  // Pre-fill topic if coming from flashcards
  useEffect(() => {
    if (setName) {
      setSelectedTopic(setName)
      setSelectedSource("flashcards")
    }
  }, [setName])

  // Handle starting a quiz
  const handleStartQuiz = (quizType: string) => {
    if (!isSetupComplete) return

    const topicSlug = selectedTopic.replace(/\s+/g, "-").toLowerCase()
    router.push(`/student/practice-tests/${quizType}/${topicSlug}?class=${selectedClass}&source=${selectedSource}`)
  }

  // Get label from value
  const getLabelFromValue = (options: Option[], value: string): string => {
    const option = options.find((opt) => opt.value === value)
    return option ? option.label : value
  }

  // Animation variants
  const cardVariants = {
    inactive: { opacity: 0.7, scale: 0.98 },
    active: { opacity: 1, scale: 1 },
    hover: { scale: 1.03, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)" },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Link href="/student" className="mr-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">📝 Practice Tests</h1>
            <Badge className="ml-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              AI-Generated
            </Badge>
          </div>
          <p className="text-gray-400 ml-10 max-w-2xl">
            Review key concepts with auto-generated quizzes tailored to your class and topic.
          </p>
        </div>

        {/* Selection Panel */}
        <Card className="bg-gray-800/50 border-gray-700 mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="class" className="text-sm text-gray-400 mb-1 block">
                  Class
                </Label>
                <CreatableSelect
                  options={classOptions}
                  value={selectedClass}
                  onChange={setSelectedClass}
                  placeholder="Select class"
                  className="bg-gray-900/50"
                />
              </div>

              <div>
                <Label htmlFor="source" className="text-sm text-gray-400 mb-1 block">
                  Source Material
                </Label>
                <CreatableSelect
                  options={sourceOptions}
                  value={selectedSource}
                  onChange={setSelectedSource}
                  placeholder="Select source"
                  className="bg-gray-900/50"
                />
              </div>

              <div>
                <Label htmlFor="topic" className="text-sm text-gray-400 mb-1 block">
                  Topic / Specific Task
                </Label>
                <CreatableSelect
                  options={topicOptions}
                  value={selectedTopic}
                  onChange={setSelectedTopic}
                  placeholder="Select or type topic"
                  className="bg-gray-900/50"
                  createMessage="Create topic"
                />
              </div>
            </div>

            {/* Selection Summary Tags */}
            <AnimatePresence>
              {isSetupComplete && (
                <motion.div
                  className="mt-4 flex flex-wrap gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Badge className="bg-blue-600/80">{getLabelFromValue(classOptions, selectedClass)}</Badge>
                  <Badge className="bg-purple-600/80">{getLabelFromValue(sourceOptions, selectedSource)}</Badge>
                  <Badge className="bg-green-600/80">
                    {getLabelFromValue(topicOptions, selectedTopic) || selectedTopic}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Quiz Style Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            variants={cardVariants}
            initial="inactive"
            animate={isSetupComplete ? "active" : "inactive"}
            whileHover={isSetupComplete ? "hover" : "inactive"}
            transition={{ duration: 0.2 }}
          >
            <Card
              className={`bg-gray-800/50 border-gray-700 h-full transition-all ${!isSetupComplete ? "cursor-not-allowed" : "cursor-pointer"}`}
              onClick={() => isSetupComplete && handleStartQuiz("quick-quiz")}
            >
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-xl mr-2">🧠</span> Quick Quiz
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Test your knowledge with a quick 5-question multiple choice quiz.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={!isSetupComplete}
                >
                  Start Quick Quiz
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="inactive"
            animate={isSetupComplete ? "active" : "inactive"}
            whileHover={isSetupComplete ? "hover" : "inactive"}
            transition={{ duration: 0.2 }}
          >
            <Card
              className={`bg-gray-800/50 border-gray-700 h-full transition-all ${!isSetupComplete ? "cursor-not-allowed" : "cursor-pointer"}`}
              onClick={() => isSetupComplete && handleStartQuiz("multiple-choice")}
            >
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-xl mr-2">📝</span> Multiple Choice
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Practice with multiple choice questions and detailed explanations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={!isSetupComplete}
                >
                  Start Multiple Choice
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="inactive"
            animate={isSetupComplete ? "active" : "inactive"}
            whileHover={isSetupComplete ? "hover" : "inactive"}
            transition={{ duration: 0.2 }}
          >
            <Card
              className={`bg-gray-800/50 border-gray-700 h-full transition-all ${!isSetupComplete ? "cursor-not-allowed" : "cursor-pointer"}`}
              onClick={() => isSetupComplete && handleStartQuiz("long-answer")}
            >
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-xl mr-2">✍️</span> Long Answer
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Practice writing detailed answers to complex questions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={!isSetupComplete}
                >
                  Start Long Answer
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="inactive"
            animate={isSetupComplete ? "active" : "inactive"}
            whileHover={isSetupComplete ? "hover" : "inactive"}
            transition={{ duration: 0.2 }}
          >
            <Card
              className={`bg-gray-800/50 border-gray-700 h-full transition-all relative overflow-hidden ${!isSetupComplete ? "cursor-not-allowed" : "cursor-pointer"}`}
              onClick={() => isSetupComplete && handleStartQuiz("gpt-assistant")}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-bl-full"></div>
              <CardHeader>
                <CardTitle className="flex items-center flex-wrap">
                  <span className="text-xl mr-2">✨</span> Full Quiz with GPT Assistant
                  <Badge className="ml-2 bg-gradient-to-r from-amber-500 to-orange-500 text-xs">⚡ Premium</Badge>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Get a comprehensive quiz experience with GPT guiding you through questions, hints, and feedback.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={!isSetupComplete}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start GPT-Assisted Quiz
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 border-t border-gray-800 pt-6">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/student/uploads">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Upload className="h-4 w-4 mr-2" /> Upload Materials
              </Button>
            </Link>
            <Link href="/student/chat">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <MessageSquare className="h-4 w-4 mr-2" /> Open GPT Assistant
              </Button>
            </Link>
            <Link href="/student/flashcards">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <FileText className="h-4 w-4 mr-2" /> View Flashcards
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
