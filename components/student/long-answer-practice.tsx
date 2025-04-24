"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, HelpCircle, Lightbulb, Brain, BookOpen, MessageSquare, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

// Mock data for the long answer questions
const mockQuestions = [
  {
    id: 1,
    question: "Explain how the water cycle works and its importance to Earth's ecosystems.",
    hint: "Consider the different states of water (solid, liquid, gas) and how they transform through processes like evaporation, condensation, and precipitation.",
    tags: ["Science", "Environmental", "Test Prep"],
    feedback:
      "Good explanation of the water cycle! You covered the key processes and their importance. Consider adding more about how human activities impact the water cycle for a more comprehensive answer.",
  },
  {
    id: 2,
    question: "Analyze the main themes in Shakespeare's 'Macbeth' and how they relate to modern society.",
    hint: "Focus on themes like ambition, power, guilt, and the supernatural. Consider drawing parallels to modern political or social situations.",
    tags: ["English", "Literature", "Essay"],
    feedback:
      "Strong analysis of the themes in Macbeth. Your connections to modern politics were insightful. To strengthen your answer, consider including more specific quotes from the play to support your points.",
  },
  {
    id: 3,
    question: "Discuss the causes and effects of the Great Depression and compare it to the 2008 financial crisis.",
    hint: "Consider economic factors like stock market crashes, banking failures, and government policies. Look for similarities and differences between the two events.",
    tags: ["History", "Economics", "Comparative"],
    feedback:
      "Excellent comparison between the two economic crises. Your analysis of the causes was thorough. To improve, you could explore more about the different government responses and their effectiveness.",
  },
]

interface LongAnswerPracticeProps {
  topic: string
  subject: string
  source: string
}

export default function LongAnswerPractice({ topic, subject, source }: LongAnswerPracticeProps) {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>(Array(mockQuestions.length).fill(""))
  const [showHint, setShowHint] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Auto-focus the textarea when the question changes
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [currentQuestionIndex])

  const currentQuestion = mockQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / mockQuestions.length) * 100

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = e.target.value
    setAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setShowHint(false)
      setShowFeedback(false)
    } else {
      setShowCompletionModal(true)
    }
  }

  const handleSkipQuestion = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setShowHint(false)
      setShowFeedback(false)
    } else {
      setShowCompletionModal(true)
    }
  }

  const handleRetryQuestion = () => {
    setShowCompletionModal(false)
    setCurrentQuestionIndex(0)
    setAnswers(Array(mockQuestions.length).fill(""))
  }

  const handleAskGPT = () => {
    // Placeholder for navigating to chat with context
    router.push(
      `/student/chat?topic=${encodeURIComponent(topic)}&question=${encodeURIComponent(currentQuestion.question)}`,
    )
  }

  const handleHelpMeWrite = () => {
    // Placeholder for navigating to chat with current question and draft
    router.push(
      `/student/chat?topic=${encodeURIComponent(topic)}&question=${encodeURIComponent(currentQuestion.question)}&draft=${encodeURIComponent(answers[currentQuestionIndex])}`,
    )
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="text-center mb-8 relative">
        <h1 className="text-3xl font-bold mb-2">🖊️ Long Answer Practice</h1>
        <p className="text-lg mb-4 text-gray-300">
          Write detailed responses to complex questions — just like real tests.
        </p>

        <div className="flex flex-col items-center mb-4">
          <div className="font-bold text-lg mb-2">📘 Topic: {topic}</div>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-600 text-white">{subject}</span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-600 text-white">{source}</span>
          </div>
        </div>

        <div className="absolute top-0 right-0">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            ⚡ AI-Generated
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-300">
            Question {currentQuestionIndex + 1} of {mockQuestions.length}
          </span>
          <span className="text-sm font-medium text-gray-300">{Math.round(progress)}%</span>
        </div>
        <Progress
          value={progress}
          className="h-2 bg-gray-700"
          indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-600"
        />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700"
        >
          <h2 className="text-xl font-bold mb-4">{currentQuestion.question}</h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {currentQuestion.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-white">
                {tag}
              </span>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="mb-6 flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-gray-700"
            onClick={() => setShowHint(!showHint)}
          >
            <HelpCircle size={16} />❓ Need a hint?
          </Button>

          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-blue-900/30 p-4 rounded-md mb-6 border border-blue-800/50"
            >
              <p className="text-blue-300">
                <span className="font-bold">Hint:</span> {currentQuestion.hint}
              </p>
            </motion.div>
          )}

          {/* Answer Textarea */}
          <div className="mb-6">
            <textarea
              ref={textareaRef}
              value={answers[currentQuestionIndex]}
              onChange={handleAnswerChange}
              placeholder="Type your answer here..."
              className="w-full h-64 p-4 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
              style={{ resize: "vertical" }}
            />
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>{answers[currentQuestionIndex].length} characters</span>
              <span>
                {answers[currentQuestionIndex].length < 15
                  ? `At least ${15 - answers[currentQuestionIndex].length} more characters needed`
                  : "Minimum length reached"}
              </span>
            </div>
          </div>

          {/* Feedback and Help Buttons */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Button
              variant="ghost"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              onClick={() => setShowFeedback(!showFeedback)}
              disabled={answers[currentQuestionIndex].length < 15}
            >
              <Lightbulb size={16} />💡 Give Feedback
            </Button>

            <Button
              variant="ghost"
              className="flex items-center gap-2 border border-gray-600 hover:bg-gray-700 text-white"
              onClick={handleHelpMeWrite}
            >
              <Brain size={16} />🧠 Help Me Write
            </Button>
          </div>

          {showFeedback && answers[currentQuestionIndex].length >= 15 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-green-900/30 p-4 rounded-md mb-6 border border-green-800/50"
            >
              <p className="text-green-300">
                <span className="font-bold">Feedback:</span> {currentQuestion.feedback}
              </p>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              variant="ghost"
              onClick={handleSkipQuestion}
              className="flex items-center gap-2 border border-gray-600 hover:bg-gray-700 text-white"
            >
              Skip Question
            </Button>

            <Button
              onClick={handleNextQuestion}
              disabled={answers[currentQuestionIndex].length < 15}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {currentQuestionIndex < mockQuestions.length - 1 ? "Next Question" : "Complete Practice"}
              <ArrowRight size={16} />
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Links */}
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <Button variant="ghost" asChild className="border border-gray-600 hover:bg-gray-700 text-white">
          <Link href="/student/practice-tests" className="flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Practice Tests
          </Link>
        </Button>
        <Button variant="ghost" asChild className="border border-gray-600 hover:bg-gray-700 text-white">
          <Link href="/student/chat" className="flex items-center gap-2">
            <MessageSquare size={16} /> Ask GPT About This Topic
          </Link>
        </Button>
        <Button variant="ghost" asChild className="border border-gray-600 hover:bg-gray-700 text-white">
          <Link href="/student/flashcards" className="flex items-center gap-2">
            <BookOpen size={16} /> View Flashcards
          </Link>
        </Button>
      </div>

      {/* Completion Modal */}
      <Dialog open={showCompletionModal} onOpenChange={setShowCompletionModal}>
        <DialogContent className="sm:max-w-md bg-gray-800 text-white border border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">🎉 Great job finishing your long-answer session!</DialogTitle>
            <DialogDescription className="text-center text-lg text-gray-300">
              You completed {mockQuestions.length} questions.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-center mb-4 text-gray-300">
              Writing practice helps develop critical thinking and communication skills. Keep up the good work!
            </p>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="ghost"
              onClick={handleRetryQuestion}
              className="flex items-center justify-center gap-2 w-full border border-gray-600 hover:bg-gray-700 text-white"
            >
              <RefreshCw size={16} />🔁 Retry a Question
            </Button>

            <Button
              onClick={handleAskGPT}
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <MessageSquare size={16} />💬 Ask GPT for Review
            </Button>

            <Button
              variant="default"
              onClick={() => router.push("/student/practice-tests")}
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <BookOpen size={16} />📚 Back to Practice Tests
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
