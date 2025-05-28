"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { FlashcardSet } from "./flashcard-study"
import { CheckCircle, X, AlertCircle } from 'lucide-react'

interface FlashcardQuizModalProps {
  flashcardSet: FlashcardSet
  onClose: () => void
}

export function FlashcardQuizModal({ flashcardSet, onClose }: FlashcardQuizModalProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  // Direct navigation functions for each quiz type
  const handleQuickQuiz = () => {
    onClose()
    setTimeout(() => {
      window.location.href = `/student/practice-tests?type=quick&set=${encodeURIComponent(
        flashcardSet.name
      )}&id=${flashcardSet.id}&autoOpen=true`
    }, 300)
  }

  const handleMultipleChoice = () => {
    onClose()
    setTimeout(() => {
      window.location.href = `/student/practice-tests?type=multiple&set=${encodeURIComponent(
        flashcardSet.name
      )}&id=${flashcardSet.id}&autoOpen=true`
    }, 300)
  }

  const handleLongAnswer = () => {
    onClose()
    setTimeout(() => {
      window.location.href = `/student/practice-tests?type=long&set=${encodeURIComponent(
        flashcardSet.name
      )}&id=${flashcardSet.id}&autoOpen=true`
    }, 300)
  }

  const handleGptQuiz = () => {
    onClose()
    setTimeout(() => {
      window.location.href = `/student/chat?prompt=${encodeURIComponent(
        `Create a comprehensive quiz based on the flashcard set for ${flashcardSet.name}`
      )}`
    }, 300)
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">Quiz Me Instead</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-gray-400 mb-6">Choose a quiz format to test your knowledge of {flashcardSet.name}.</p>

        {/* Direct buttons instead of options with a separate start button */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start text-left h-auto py-4 bg-gray-700/30 border-gray-700 hover:bg-gray-700/50"
            onClick={handleQuickQuiz}
          >
            <div className="flex items-start">
              <div className="mr-3 mt-1 text-xl">🧠</div>
              <div className="flex-1">
                <h3 className="font-medium mb-1 text-white">5-question quick quiz</h3>
                <p className="text-sm text-gray-400">A quick 5-question quiz with multiple choice answers.</p>
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start text-left h-auto py-4 bg-gray-700/30 border-gray-700 hover:bg-gray-700/50"
            onClick={handleMultipleChoice}
          >
            <div className="flex items-start">
              <div className="mr-3 mt-1 text-xl">📝</div>
              <div className="flex-1">
                <h3 className="font-medium mb-1 text-white">Multiple-choice</h3>
                <p className="text-sm text-gray-400">A set of multiple-choice questions with detailed explanations.</p>
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start text-left h-auto py-4 bg-gray-700/30 border-gray-700 hover:bg-gray-700/50"
            onClick={handleLongAnswer}
          >
            <div className="flex items-start">
              <div className="mr-3 mt-1 text-xl">🖊</div>
              <div className="flex-1">
                <h3 className="font-medium mb-1 text-white">Long-answer practice</h3>
                <p className="text-sm text-gray-400">Practice writing detailed answers to complex questions.</p>
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start text-left h-auto py-4 bg-gray-700/30 border-gray-700 hover:bg-gray-700/50"
            onClick={handleGptQuiz}
          >
            <div className="flex items-start">
              <div className="mr-3 mt-1 text-xl">🤖</div>
              <div className="flex-1">
                <h3 className="font-medium mb-1 text-white">Launch full quiz in GPT Assistant</h3>
                <p className="text-sm text-gray-400">Generate a comprehensive quiz with GPT assistance.</p>
              </div>
            </div>
          </Button>
        </div>

        <div className="mt-6">
          <Button
            variant="outline"
            className="w-full border-gray-700 hover:bg-gray-700/50"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
