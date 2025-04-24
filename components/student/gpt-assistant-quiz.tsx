"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  List,
  Book,
  MessageSquare,
  RefreshCw,
  PenTool,
  Brain,
  ArrowRight,
} from "lucide-react"

// Mock data for the quiz
const mockQuestions = [
  {
    id: 1,
    type: "multiple-choice",
    text: "What is the function of mitochondria in a cell?",
    options: [
      { id: "a", text: "Cell division" },
      { id: "b", text: "Protein synthesis" },
      { id: "c", text: "Energy production" },
      { id: "d", text: "Waste removal" },
    ],
    correctAnswer: "c",
    explanation:
      "Mitochondria are often referred to as the powerhouse of the cell because they generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy.",
  },
  {
    id: 2,
    type: "open-ended",
    text: "Explain how photosynthesis works and why it's important for life on Earth.",
    sampleAnswer:
      "Photosynthesis is the process by which plants, algae, and some bacteria convert light energy, usually from the sun, into chemical energy in the form of glucose or other sugars. This process involves capturing light energy to convert carbon dioxide and water into glucose and oxygen. Photosynthesis is crucial for life on Earth as it produces oxygen for animals to breathe and provides the energy-rich organic compounds that form the base of food chains.",
  },
  {
    id: 3,
    type: "multiple-choice",
    text: "Which of the following is NOT a component of the cell membrane?",
    options: [
      { id: "a", text: "Phospholipids" },
      { id: "b", text: "Cholesterol" },
      { id: "c", text: "Ribosomes" },
      { id: "d", text: "Glycoproteins" },
    ],
    correctAnswer: "c",
    explanation:
      "Ribosomes are not components of the cell membrane. They are organelles that synthesize proteins and are found either free in the cytoplasm or attached to the endoplasmic reticulum.",
  },
  {
    id: 4,
    type: "multiple-choice",
    text: "Which of the following best describes the process of natural selection?",
    options: [
      { id: "a", text: "Organisms adapting to their environment during their lifetime" },
      { id: "b", text: "The survival and reproduction of individuals with favorable traits" },
      { id: "c", text: "The intentional breeding of organisms with desired characteristics" },
      { id: "d", text: "Random changes in the genetic code of an organism" },
    ],
    correctAnswer: "b",
    explanation:
      "Natural selection is the process where organisms with traits that better enable them to adapt to their environment will survive and reproduce more successfully than those that do not. This leads to the passing of favorable traits to future generations.",
  },
  {
    id: 5,
    type: "open-ended",
    text: "Describe the structure and function of DNA in cellular reproduction.",
    sampleAnswer:
      "DNA (deoxyribonucleic acid) is a double-helix structure composed of nucleotides, each containing a sugar, phosphate group, and one of four nitrogenous bases (adenine, thymine, guanine, cytosine). In cellular reproduction, DNA replicates through a process called semiconservative replication, where the double helix unwinds and each strand serves as a template for the synthesis of a new complementary strand. This ensures that each daughter cell receives an identical copy of the genetic material, maintaining genetic continuity across generations.",
  },
]

interface GPTAssistantQuizProps {
  topic: string
  subject: string
  source: string
}

export default function GPTAssistantQuiz({ topic, subject, source }: GPTAssistantQuizProps) {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [userAnswer, setUserAnswer] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [showSidePanel, setShowSidePanel] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [quizResults, setQuizResults] = useState({
    correct: 0,
    incorrect: 0,
    skipped: 0,
  })
  const [sidePanelContent, setSidePanelContent] = useState<"questions" | "resources" | "chat">("questions")

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const currentQuestion = mockQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / mockQuestions.length) * 100

  // Simulated typing effect for GPT responses
  useEffect(() => {
    if (showFeedback && !isTyping) {
      const textToType = isCorrect
        ? "✅ That's right! Great job. The mitochondria is indeed responsible for energy production in the cell."
        : "❌ Not quite. Let me explain why. The mitochondria is known as the powerhouse of the cell because it produces energy through cellular respiration."

      setIsTyping(true)
      setTypedText("")

      let i = 0
      const typing = setInterval(() => {
        setTypedText(textToType.substring(0, i))
        i++
        if (i > textToType.length) {
          clearInterval(typing)
          setIsTyping(false)
        }
      }, 20)

      return () => clearInterval(typing)
    }
  }, [showFeedback, isCorrect])

  // Auto-focus textarea for open-ended questions
  useEffect(() => {
    if (currentQuestion.type === "open-ended" && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [currentQuestion])

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId)
    setIsCorrect(answerId === currentQuestion.correctAnswer)
    setShowFeedback(true)
  }

  const handleTextSubmit = () => {
    if (userAnswer.length < 10) return

    // For demo purposes, always give positive feedback
    setIsCorrect(true)
    setShowFeedback(true)
  }

  const handleNextQuestion = () => {
    // Update quiz results
    if (showFeedback) {
      if (isCorrect) {
        setQuizResults((prev) => ({ ...prev, correct: prev.correct + 1 }))
      } else {
        setQuizResults((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }))
      }
    } else {
      setQuizResults((prev) => ({ ...prev, skipped: prev.skipped + 1 }))
    }

    // Reset states
    setSelectedAnswer(null)
    setUserAnswer("")
    setShowFeedback(false)
    setShowHint(false)
    setShowExplanation(false)

    // Move to next question or show completion
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      setShowCompletionModal(true)
    }
  }

  const handleSkipQuestion = () => {
    setQuizResults((prev) => ({ ...prev, skipped: prev.skipped + 1 }))

    // Reset states
    setSelectedAnswer(null)
    setUserAnswer("")
    setShowFeedback(false)
    setShowHint(false)
    setShowExplanation(false)

    // Move to next question or show completion
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      setShowCompletionModal(true)
    }
  }

  const handleRetry = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setUserAnswer("")
    setShowFeedback(false)
    setShowHint(false)
    setShowExplanation(false)
    setShowCompletionModal(false)
    setQuizResults({
      correct: 0,
      incorrect: 0,
      skipped: 0,
    })
  }

  const toggleSidePanel = (content: "questions" | "resources" | "chat") => {
    setSidePanelContent(content)
    setShowSidePanel((prev) => !prev)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-16">
      {/* Header */}
      <div className="container mx-auto px-4 pt-8 pb-4">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              🤖 GPT-Assisted Quiz
              <span className="ml-4 text-xs bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1 rounded-full">
                ⚡ AI-Powered
              </span>
            </h1>
            <p className="text-gray-300 mt-2 mb-4">
              Let your AI tutor guide you through a dynamic test with feedback and coaching.
            </p>
            <div className="mt-2">
              <p className="font-bold">📘 Topic: {topic}</p>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-sm">{subject}</span>
                <span className="bg-purple-900 text-purple-200 px-3 py-1 rounded-full text-sm">{source}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="container mx-auto px-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-lg font-medium">
            Question {currentQuestionIndex + 1} of {mockQuestions.length}
          </p>
          <p className="text-sm">{progress.toFixed(0)}%</p>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
            initial={{ width: `${(currentQuestionIndex / mockQuestions.length) * 100}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Main Quiz Area */}
      <div className="container mx-auto px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 rounded-xl shadow-lg p-6 mb-6"
          >
            {/* Question */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">{currentQuestion.text}</h2>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-sm">{subject}</span>
                {currentQuestion.type === "multiple-choice" ? (
                  <span className="bg-green-900 text-green-200 px-3 py-1 rounded-full text-sm">Multiple Choice</span>
                ) : (
                  <span className="bg-yellow-900 text-yellow-200 px-3 py-1 rounded-full text-sm">Open Ended</span>
                )}
              </div>
            </div>

            {/* Answer Input */}
            {currentQuestion.type === "multiple-choice" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id)}
                    disabled={showFeedback}
                    className={`p-4 rounded-lg text-left flex items-start transition-all transform hover:scale-102 hover:shadow-md ${
                      selectedAnswer === option.id && showFeedback
                        ? isCorrect
                          ? "bg-green-800 border-green-500 text-green-100"
                          : "bg-red-800 border-red-500 text-red-100"
                        : selectedAnswer === option.id
                          ? "bg-blue-700 border-blue-500"
                          : "bg-gray-700 hover:bg-gray-600"
                    } ${showFeedback && option.id === currentQuestion.correctAnswer && "bg-green-800 border-green-500 text-green-100"}`}
                  >
                    <span className="font-bold mr-3 text-lg">{option.id.toUpperCase()}.</span>
                    <span>{option.text}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mb-6">
                <textarea
                  ref={textareaRef}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={showFeedback}
                  placeholder="Type your answer here..."
                  className="w-full h-40 p-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-between mt-2 text-sm text-gray-400">
                  <span>{userAnswer.length} characters</span>
                  <span>{userAnswer.length < 10 ? "Please write at least 10 characters" : "✓ Minimum length met"}</span>
                </div>
                {!showFeedback && (
                  <button
                    onClick={handleTextSubmit}
                    disabled={userAnswer.length < 10}
                    className="mt-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Answer
                  </button>
                )}
              </div>
            )}

            {/* Hint Button */}
            {!showFeedback && (
              <button
                onClick={() => setShowHint(true)}
                className="flex items-center text-yellow-400 hover:text-yellow-300 mb-4"
              >
                <HelpCircle size={16} className="mr-1" />
                <span>I need a hint</span>
              </button>
            )}

            {/* Hint Popup */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-blue-900 text-blue-100 p-4 rounded-lg mb-6"
                >
                  <p className="font-medium mb-1">💡 Hint:</p>
                  <p>
                    {currentQuestion.type === "multiple-choice"
                      ? "Think about what cellular organelles are primarily responsible for producing ATP."
                      : "Consider the key components involved in the process and how they interact with each other."}
                  </p>
                  <button onClick={() => setShowHint(false)} className="text-blue-300 hover:text-blue-100 text-sm mt-2">
                    Got it
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Feedback Area */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mb-6"
                >
                  <div
                    className={`p-4 rounded-lg ${isCorrect ? "bg-green-900 text-green-100" : "bg-red-900 text-red-100"}`}
                  >
                    <p>{typedText}</p>
                    {isTyping && (
                      <span className="inline-flex">
                        <span className="animate-bounce">.</span>
                        <span className="animate-bounce animation-delay-200">.</span>
                        <span className="animate-bounce animation-delay-400">.</span>
                      </span>
                    )}
                  </div>

                  {!isTyping && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => setShowExplanation(true)}
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center"
                      >
                        <Brain size={16} className="mr-2" />
                        Explain This
                      </button>
                      <button
                        onClick={handleSkipQuestion}
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center"
                      >
                        <RefreshCw size={16} className="mr-2" />
                        Try Another
                      </button>
                      <button
                        onClick={() => router.push("/student/chat")}
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center"
                      >
                        <PenTool size={16} className="mr-2" />
                        Show Me How
                      </button>
                      <button
                        onClick={handleNextQuestion}
                        className="px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center"
                      >
                        Next Question
                        <ChevronRight size={16} className="ml-2" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Explanation Area */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-gray-700 p-4 rounded-lg mb-6"
                >
                  <p className="font-medium mb-1">🧠 Explanation:</p>
                  <p className="mb-2">
                    {currentQuestion.type === "multiple-choice"
                      ? currentQuestion.explanation
                      : "Your answer demonstrates a good understanding of the topic. The key points to remember are the process steps and their significance in the broader context."}
                  </p>
                  <button
                    onClick={() => setShowExplanation(false)}
                    className="text-blue-300 hover:text-blue-100 text-sm"
                  >
                    Got it
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Skip Button (only shown if feedback not visible) */}
            {!showFeedback && (
              <div className="flex justify-end">
                <button onClick={handleSkipQuestion} className="text-gray-400 hover:text-gray-300 text-sm">
                  Skip this question
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Side Panel Toggle Buttons */}
      <div className="fixed right-4 top-1/3 transform -translate-y-1/2 flex flex-col gap-2">
        <button
          onClick={() => toggleSidePanel("questions")}
          className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full shadow-lg"
          aria-label="View Question List"
        >
          <List size={20} />
        </button>
        <button
          onClick={() => toggleSidePanel("resources")}
          className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full shadow-lg"
          aria-label="Topic Info & Resources"
        >
          <Book size={20} />
        </button>
        <button
          onClick={() => toggleSidePanel("chat")}
          className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full shadow-lg"
          aria-label="Ask GPT Something Else"
        >
          <MessageSquare size={20} />
        </button>
      </div>

      {/* Side Panel */}
      <AnimatePresence>
        {showSidePanel && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-0 top-0 h-full w-80 bg-gray-800 shadow-lg z-50 overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">
                  {sidePanelContent === "questions" && "📋 Question List"}
                  {sidePanelContent === "resources" && "📘 Topic Resources"}
                  {sidePanelContent === "chat" && "🧑‍🏫 Ask GPT"}
                </h3>
                <button onClick={() => setShowSidePanel(false)} className="text-gray-400 hover:text-white">
                  ✕
                </button>
              </div>

              {sidePanelContent === "questions" && (
                <div className="space-y-3">
                  {mockQuestions.map((q, index) => (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentQuestionIndex(index)
                        setSelectedAnswer(null)
                        setUserAnswer("")
                        setShowFeedback(false)
                        setShowHint(false)
                        setShowExplanation(false)
                        setShowSidePanel(false)
                      }}
                      className={`w-full text-left p-3 rounded-lg ${
                        index === currentQuestionIndex ? "bg-blue-700" : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-2 font-bold">{index + 1}.</span>
                        <span className="truncate">{q.text.substring(0, 30)}...</span>
                      </div>
                      <div className="text-xs mt-1 text-gray-400">
                        {q.type === "multiple-choice" ? "Multiple Choice" : "Open Ended"}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {sidePanelContent === "resources" && (
                <div className="space-y-4">
                  <div className="bg-gray-700 p-3 rounded-lg">
                    <h4 className="font-bold mb-1">Topic Overview</h4>
                    <p className="text-sm text-gray-300">
                      {topic} is a fundamental concept in {subject} that covers key principles and applications.
                    </p>
                  </div>

                  <div className="bg-gray-700 p-3 rounded-lg">
                    <h4 className="font-bold mb-1">Key Concepts</h4>
                    <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                      <li>Primary structures and functions</li>
                      <li>Underlying mechanisms</li>
                      <li>Real-world applications</li>
                      <li>Historical development</li>
                    </ul>
                  </div>

                  <div className="bg-gray-700 p-3 rounded-lg">
                    <h4 className="font-bold mb-1">Related Topics</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded-full text-xs">Cell Structure</span>
                      <span className="bg-purple-900 text-purple-200 px-2 py-1 rounded-full text-xs">
                        Energy Transfer
                      </span>
                      <span className="bg-green-900 text-green-200 px-2 py-1 rounded-full text-xs">
                        Cellular Respiration
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {sidePanelContent === "chat" && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-300">Have a question about this topic? Ask GPT for help!</p>
                  <textarea
                    placeholder="Type your question here..."
                    className="w-full h-32 p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => router.push("/student/chat")}
                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium"
                  >
                    Ask GPT
                  </button>

                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <h4 className="font-bold mb-2">Suggested Questions</h4>
                    <div className="space-y-2">
                      <button className="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm">
                        How does this relate to real-world applications?
                      </button>
                      <button className="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm">
                        Can you explain this in simpler terms?
                      </button>
                      <button className="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm">
                        What are common misconceptions about this topic?
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold mb-2">You finished the GPT quiz!</h2>
                <p className="text-gray-300">Great job completing all {mockQuestions.length} questions.</p>
              </div>

              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="font-bold mb-3">Your Results</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-green-400 text-xl font-bold">{quizResults.correct}</div>
                    <div className="text-sm text-gray-400">Correct</div>
                  </div>
                  <div>
                    <div className="text-red-400 text-xl font-bold">{quizResults.incorrect}</div>
                    <div className="text-sm text-gray-400">Incorrect</div>
                  </div>
                  <div>
                    <div className="text-yellow-400 text-xl font-bold">{quizResults.skipped}</div>
                    <div className="text-sm text-gray-400">Skipped</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-600">
                  <div className="flex justify-between items-center mb-2">
                    <span>XP Earned:</span>
                    <span className="font-bold text-yellow-300">+{quizResults.correct * 10} XP</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Coins Earned:</span>
                    <span className="font-bold text-yellow-300">+{quizResults.correct * 5} 🪙</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleRetry}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium flex items-center justify-center"
                >
                  <RefreshCw size={18} className="mr-2" />
                  Retry with GPT
                </button>
                <button
                  onClick={() => router.push("/student/practice-tests")}
                  className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium flex items-center justify-center"
                >
                  <ArrowRight size={18} className="mr-2" />
                  Back to Practice Tests
                </button>
                <button
                  onClick={() => router.push("/student/chat")}
                  className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium flex items-center justify-center"
                >
                  <MessageSquare size={18} className="mr-2" />
                  Ask GPT More About This Topic
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 flex justify-center gap-4">
        <Link
          href="/student/practice-tests"
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Practice Tests
        </Link>
        <Link
          href="/student/flashcards"
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center"
        >
          <Book size={16} className="mr-1" />
          Open Flashcards
        </Link>
        <Link href="/student/chat" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center">
          <Brain size={16} className="mr-1" />
          Review with GPT
        </Link>
      </div>
    </div>
  )
}
