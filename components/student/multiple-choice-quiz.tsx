"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  RefreshCcw,
  BookOpen,
  MessageSquare,
  Sparkles,
} from "lucide-react"

// Types
interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface MultipleChoiceQuizProps {
  topicParam: string
  classParam: string
  sourceParam: string
}

export default function MultipleChoiceQuiz({ topicParam, classParam, sourceParam }: MultipleChoiceQuizProps) {
  const router = useRouter()

  // State
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [showExplanation, setShowExplanation] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)

  // Sample questions (would be generated based on topic in a real app)
  const questions: Question[] = [
    {
      id: 1,
      text: "What is the primary function of the cell membrane?",
      options: [
        "To produce energy for the cell",
        "To control what enters and leaves the cell",
        "To store genetic information",
        "To break down waste materials",
      ],
      correctAnswer: 1,
      explanation:
        "The cell membrane, also called the plasma membrane, controls what enters and leaves the cell. It's a selectively permeable barrier that maintains the cell's internal environment.",
    },
    {
      id: 2,
      text: "Which organelle is known as the 'powerhouse' of the cell?",
      options: ["Nucleus", "Endoplasmic reticulum", "Mitochondria", "Golgi apparatus"],
      correctAnswer: 2,
      explanation:
        "Mitochondria are often called the 'powerhouse' of the cell because they generate most of the cell's supply of adenosine triphosphate (ATP), which is used as a source of chemical energy.",
    },
    {
      id: 3,
      text: "What is the function of ribosomes in a cell?",
      options: ["Cell division", "Protein synthesis", "Lipid production", "DNA replication"],
      correctAnswer: 1,
      explanation:
        "Ribosomes are the sites of protein synthesis. They read the messenger RNA (mRNA) and translate it into a polypeptide chain, which later folds into a protein.",
    },
    {
      id: 4,
      text: "Which of the following is NOT a function of the nucleus?",
      options: [
        "Storing genetic information",
        "Controlling cellular activities",
        "Energy production",
        "RNA processing",
      ],
      correctAnswer: 2,
      explanation:
        "Energy production primarily occurs in the mitochondria, not the nucleus. The nucleus stores genetic information, controls cellular activities through gene expression, and processes RNA.",
    },
    {
      id: 5,
      text: "What is the main function of lysosomes?",
      options: ["Protein synthesis", "Cellular respiration", "Waste disposal", "Photosynthesis"],
      correctAnswer: 2,
      explanation:
        "Lysosomes contain digestive enzymes that break down waste materials, cellular debris, and foreign invaders. They act as the waste disposal system of the cell.",
    },
    {
      id: 6,
      text: "Which structure is responsible for moving the cell or moving substances across the cell surface?",
      options: ["Cell wall", "Cilia and flagella", "Vacuole", "Nucleolus"],
      correctAnswer: 1,
      explanation:
        "Cilia and flagella are hair-like structures that extend from the cell surface and are involved in locomotion or moving substances across the cell surface.",
    },
    {
      id: 7,
      text: "What is the primary role of the Golgi apparatus?",
      options: [
        "Protein synthesis",
        "Cellular respiration",
        "Processing and packaging macromolecules",
        "DNA replication",
      ],
      correctAnswer: 2,
      explanation:
        "The Golgi apparatus modifies, sorts, and packages proteins and lipids for storage in the cell or secretion outside the cell.",
    },
    {
      id: 8,
      text: "Which of the following is a difference between plant and animal cells?",
      options: [
        "Only plant cells have mitochondria",
        "Only animal cells have a nucleus",
        "Only plant cells have chloroplasts",
        "Only animal cells have ribosomes",
      ],
      correctAnswer: 2,
      explanation:
        "Chloroplasts are found only in plant cells and some algae. They contain chlorophyll and are responsible for photosynthesis, converting light energy into chemical energy.",
    },
    {
      id: 9,
      text: "What is the function of the endoplasmic reticulum (ER)?",
      options: ["Cell division", "Protein synthesis and lipid metabolism", "Energy production", "Waste disposal"],
      correctAnswer: 1,
      explanation:
        "The endoplasmic reticulum (ER) is involved in protein synthesis (rough ER) and lipid metabolism (smooth ER). It's a network of membranes throughout the cytoplasm.",
    },
    {
      id: 10,
      text: "Which cellular component is responsible for maintaining the cell's shape and internal organization?",
      options: ["Cell membrane", "Cytoskeleton", "Nucleus", "Vacuole"],
      correctAnswer: 1,
      explanation:
        "The cytoskeleton is a network of protein filaments that extends throughout the cytoplasm, giving the cell its shape, strength, and ability to move. It also organizes the cell's contents.",
    },
  ]

  // Initialize answers array
  useEffect(() => {
    setAnswers(new Array(questions.length).fill(null))
  }, [])

  // Calculate progress
  const progress = ((currentQuestion + 1) / questions.length) * 100

  // Handle selecting an answer
  const handleSelectAnswer = (index: number) => {
    if (selectedAnswer !== null) return // Prevent changing answer

    setSelectedAnswer(index)
    setShowExplanation(true)

    // Update answers array
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = index
    setAnswers(newAnswers)
  }

  // Handle moving to next question
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(answers[currentQuestion + 1])
      setShowExplanation(selectedAnswer !== null)
    } else {
      setQuizComplete(true)
    }
  }

  // Handle moving to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(answers[currentQuestion - 1])
      setShowExplanation(answers[currentQuestion - 1] !== null)
    }
  }

  // Calculate score
  const calculateScore = () => {
    let correct = 0
    answers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correct++
      }
    })
    return correct
  }

  // Get incorrectly answered questions
  const getIncorrectQuestions = () => {
    return questions.filter((_, index) => answers[index] !== null && answers[index] !== questions[index].correctAnswer)
  }

  // Handle retrying missed questions
  const handleRetryMissed = () => {
    const incorrectIndices = questions
      .map((_, index) => (answers[index] !== questions[index].correctAnswer ? index : -1))
      .filter((index) => index !== -1)

    if (incorrectIndices.length > 0) {
      setCurrentQuestion(incorrectIndices[0])
      setQuizComplete(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Link href="/student/practice-tests" className="mr-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">📋 Multiple Choice Quiz</h1>
            </div>
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600">
              <Sparkles className="h-3 w-3 mr-1" /> AI-Generated
            </Badge>
          </div>
          <p className="text-gray-400 ml-10 max-w-2xl mb-3">
            Practice with multiple-choice questions and detailed explanations.
          </p>
          <div className="ml-10 mb-4">
            <div className="font-bold text-lg mb-1">📘 Topic: {topicParam}</div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-600/80">{classParam}</Badge>
              <Badge className="bg-green-600/80">{topicParam}</Badge>
              <Badge className="bg-purple-600/80">{sourceParam}</Badge>
            </div>
          </div>
        </div>

        {!quizComplete ? (
          <>
            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-gray-700" indicatorClassName="bg-purple-600" />
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-6">{questions[currentQuestion].text}</h2>

                    <div className="space-y-3">
                      {questions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleSelectAnswer(index)}
                          disabled={selectedAnswer !== null}
                          className={`w-full text-left p-4 rounded-lg transition-all flex items-center ${
                            selectedAnswer === null
                              ? "bg-gray-700/50 hover:bg-gray-700 border border-gray-600"
                              : selectedAnswer === index
                                ? index === questions[currentQuestion].correctAnswer
                                  ? "bg-green-600/20 border border-green-500"
                                  : "bg-red-600/20 border border-red-500"
                                : index === questions[currentQuestion].correctAnswer
                                  ? "bg-green-600/20 border border-green-500"
                                  : "bg-gray-700/50 border border-gray-600 opacity-50"
                          }`}
                        >
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mr-3">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="flex-grow">{option}</span>
                          {selectedAnswer !== null && index === questions[currentQuestion].correctAnswer && (
                            <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                          )}
                          {selectedAnswer === index && index !== questions[currentQuestion].correctAnswer && (
                            <XCircle className="h-5 w-5 text-red-500 ml-2" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Explanation */}
                    <AnimatePresence>
                      {showExplanation && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-6 p-4 bg-purple-900/30 border border-purple-800/50 rounded-xl"
                        >
                          <h3 className="font-medium mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                            Explanation
                          </h3>
                          <p className="text-gray-300 text-sm">{questions[currentQuestion].explanation}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                className="border-gray-700 hover:bg-gray-700/50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous Question
              </Button>

              <Button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {currentQuestion < questions.length - 1 ? (
                  <>
                    Next Question
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  "Complete Quiz"
                )}
              </Button>
            </div>
          </>
        ) : (
          /* Quiz Complete Summary */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">You finished the quiz!</h2>
                  <p className="text-xl">
                    You got <span className="font-bold text-green-500">{calculateScore()}</span> out of{" "}
                    <span className="font-bold">{questions.length}</span> questions correct
                  </p>
                </div>

                {getIncorrectQuestions().length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold mb-4">Questions to review:</h3>
                    <div className="space-y-4">
                      {getIncorrectQuestions().map((question) => (
                        <div key={question.id} className="p-4 bg-gray-700/30 rounded-lg">
                          <p className="font-medium mb-2">{question.text}</p>
                          <div className="flex items-center text-sm text-red-400 mb-2">
                            <XCircle className="h-4 w-4 mr-2" />
                            Your answer:{" "}
                            {question.options[answers[questions.findIndex((q) => q.id === question.id)] as number]}
                          </div>
                          <div className="flex items-center text-sm text-green-400 mb-2">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Correct answer: {question.options[question.correctAnswer]}
                          </div>
                          <p className="text-sm text-gray-400 mt-2">{question.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    onClick={handleRetryMissed}
                    disabled={getIncorrectQuestions().length === 0}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Retry Missed Questions
                  </Button>

                  <Link href="/student/practice-tests">
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Practice Tests
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Footer Navigation */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/student/practice-tests">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Practice Tests
                </Button>
              </Link>

              <Link href="/student/flashcards">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Flashcards
                </Button>
              </Link>

              <Link href="/student/chat">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Ask GPT About This Quiz
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
