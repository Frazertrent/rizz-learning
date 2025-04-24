"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, XCircle, ArrowRight, RotateCcw, MessageSquare, Home } from "lucide-react"

// Types
interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: number
}

interface QuizState {
  currentQuestion: number
  selectedAnswers: (number | null)[]
  isCompleted: boolean
  score: number
}

interface QuickQuizProps {
  topic: string
  source: string
  subject: string
}

export function QuickQuiz({ topic, source, subject }: QuickQuizProps) {
  const router = useRouter()

  // Mock questions - in a real app, these would be generated based on the topic
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      text: "What is the primary function of mitochondria in a cell?",
      options: ["Protein synthesis", "Energy production", "Cell division", "Waste removal"],
      correctAnswer: 1,
    },
    {
      id: 2,
      text: "Which of the following is NOT a type of chemical bond?",
      options: ["Covalent bond", "Ionic bond", "Hydrogen bond", "Quantum bond"],
      correctAnswer: 3,
    },
    {
      id: 3,
      text: "What is the process called when plants convert light energy into chemical energy?",
      options: ["Photosynthesis", "Respiration", "Fermentation", "Transpiration"],
      correctAnswer: 0,
    },
    {
      id: 4,
      text: "Which organelle is responsible for protein synthesis in the cell?",
      options: ["Nucleus", "Golgi apparatus", "Ribosome", "Lysosome"],
      correctAnswer: 2,
    },
    {
      id: 5,
      text: "What is the main component of the cell membrane?",
      options: ["Carbohydrates", "Proteins", "Phospholipids", "Nucleic acids"],
      correctAnswer: 2,
    },
  ])

  // Quiz state
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    selectedAnswers: Array(questions.length).fill(null),
    isCompleted: false,
    score: 0,
  })

  // Completion modal state
  const [showCompletionModal, setShowCompletionModal] = useState(false)

  // Update questions based on topic when it changes
  useEffect(() => {
    // In a real app, this would fetch questions from an API based on the topic
    // For now, we'll just update the mock questions with the topic name
    if (topic && topic !== "General Knowledge") {
      const updatedQuestions = [...questions]
      updatedQuestions[0].text = `Regarding ${topic}, which of the following statements is true?`
      setQuestions(updatedQuestions)
    }
  }, [topic])

  // Handle option selection
  const handleOptionSelect = (optionIndex: number) => {
    const newSelectedAnswers = [...quizState.selectedAnswers]
    newSelectedAnswers[quizState.currentQuestion] = optionIndex

    // Update score if correct
    let newScore = quizState.score
    if (optionIndex === questions[quizState.currentQuestion].correctAnswer) {
      newScore += 1
    }

    setQuizState({
      ...quizState,
      selectedAnswers: newSelectedAnswers,
      score: newScore,
    })
  }

  // Handle next question
  const handleNextQuestion = () => {
    if (quizState.currentQuestion < questions.length - 1) {
      setQuizState({
        ...quizState,
        currentQuestion: quizState.currentQuestion + 1,
      })
    } else {
      // Quiz completed
      setQuizState({
        ...quizState,
        isCompleted: true,
      })
      setShowCompletionModal(true)
    }
  }

  // Handle try again
  const handleTryAgain = () => {
    setShowCompletionModal(false)
    setQuizState({
      currentQuestion: 0,
      selectedAnswers: Array(questions.length).fill(null),
      isCompleted: false,
      score: 0,
    })
  }

  // Current question data
  const currentQuestion = questions[quizState.currentQuestion]
  const selectedAnswer = quizState.selectedAnswers[quizState.currentQuestion]
  const hasSelectedAnswer = selectedAnswer !== null
  const isCorrect = hasSelectedAnswer && selectedAnswer === currentQuestion.correctAnswer

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8 w-full max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">🧠 Quick Quiz</h1>
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500">⚡ AI-Generated</Badge>
        </div>
        <p className="text-muted-foreground mt-2">Test your knowledge with this 5-question challenge.</p>

        <div className="flex items-center justify-center mt-4 flex-wrap gap-2">
          <span className="font-bold">📘 Topic: {topic}</span>
          <Badge variant="outline" className="ml-2">
            {subject}
          </Badge>
          <Badge variant="outline" className="ml-2">
            {source}
          </Badge>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full max-w-3xl mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            Question {quizState.currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium">
            {Math.round(((quizState.currentQuestion + 1) / questions.length) * 100)}%
          </span>
        </div>
        <Progress
          value={((quizState.currentQuestion + 1) / questions.length) * 100}
          className="h-2"
          indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500"
        />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={quizState.currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-3xl"
        >
          <Card className="shadow-lg border-2 border-gray-100 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl">{currentQuestion.text}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === index ? (isCorrect ? "default" : "destructive") : "outline"}
                    className={`
                      h-auto py-4 px-6 text-left justify-start text-base
                      transition-all duration-200 hover:scale-[1.02]
                      ${
                        hasSelectedAnswer && index === currentQuestion.correctAnswer
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : ""
                      }
                      ${
                        hasSelectedAnswer &&
                        selectedAnswer !== currentQuestion.correctAnswer &&
                        index === selectedAnswer
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : ""
                      }
                      ${
                        hasSelectedAnswer && index !== selectedAnswer && index !== currentQuestion.correctAnswer
                          ? "opacity-60"
                          : ""
                      }
                    `}
                    onClick={() => !hasSelectedAnswer && handleOptionSelect(index)}
                    disabled={hasSelectedAnswer && index !== selectedAnswer}
                  >
                    <div className="flex items-center w-full">
                      <span className="mr-3 flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>{option}</span>
                      {hasSelectedAnswer && index === currentQuestion.correctAnswer && (
                        <CheckCircle className="ml-auto text-white h-5 w-5" />
                      )}
                      {hasSelectedAnswer && selectedAnswer === index && !isCorrect && (
                        <XCircle className="ml-auto text-white h-5 w-5" />
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={handleNextQuestion}
                disabled={!hasSelectedAnswer}
                className={`
                  transition-all duration-300
                  ${!hasSelectedAnswer ? "opacity-50" : "animate-pulse"}
                `}
              >
                {quizState.currentQuestion < questions.length - 1 ? (
                  <>
                    Next Question <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Complete Quiz <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Sticky Bottom Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex justify-end items-center">
        <Link href="/student/practice-tests" className="text-blue-500 hover:underline">
          ❓ Change Topic
        </Link>
      </div>

      {/* Completion Modal */}
      <Dialog open={showCompletionModal} onOpenChange={setShowCompletionModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">🎉 Quiz Complete!</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold mb-2">
                You got {quizState.score} out of {questions.length} correct.
              </div>
              <div className="text-muted-foreground">
                {quizState.score === questions.length
                  ? "Perfect score! Amazing job!"
                  : quizState.score >= questions.length * 0.8
                    ? "Great job! Keep practicing this topic for mastery."
                    : quizState.score >= questions.length * 0.6
                      ? "Good effort! A bit more practice will help you master this topic."
                      : "Keep practicing! This topic needs a bit more review."}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
              <Button variant="outline" onClick={handleTryAgain} className="flex items-center justify-center">
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button variant="outline" className="flex items-center justify-center" asChild>
                <Link href="/student/chat">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Ask GPT About a Question
                </Link>
              </Button>
              <Button variant="default" className="flex items-center justify-center" asChild>
                <Link href="/student/practice-tests">
                  <Home className="mr-2 h-4 w-4" />
                  Return to Practice Tests
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
