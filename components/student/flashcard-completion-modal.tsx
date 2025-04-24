"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { PieChart } from "lucide-react"

interface FlashcardCompletionModalProps {
  stats: {
    again: number
    hard: number
    good: number
    easy: number
  }
  totalCards: number
  onClose: () => void
  onRetryMissed: () => void
  onReturnToDashboard: () => void
}

export function FlashcardCompletionModal({
  stats,
  totalCards,
  onClose,
  onRetryMissed,
  onReturnToDashboard,
}: FlashcardCompletionModalProps) {
  const hasReviewedCards = totalCards > 0
  const missedCards = stats.again + stats.hard
  const hasMissedCards = missedCards > 0

  // Calculate percentages for the pie chart
  const calculatePercentage = (value: number) => {
    return hasReviewedCards ? Math.round((value / totalCards) * 100) : 0
  }

  const percentages = {
    again: calculatePercentage(stats.again),
    hard: calculatePercentage(stats.hard),
    good: calculatePercentage(stats.good),
    easy: calculatePercentage(stats.easy),
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
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎉</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Nice work! You finished your session!</h2>
          <p className="text-gray-400">You've earned 15 XP for reviewing this set!</p>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-3 text-center">Your Performance</h3>

          <div className="flex items-center justify-center mb-4">
            <div className="w-24 h-24 relative">
              <PieChart className="w-full h-full text-gray-700" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-medium">{totalCards}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-red-500/20 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-red-400">{stats.again}</div>
              <div className="text-xs text-gray-400">Again ({percentages.again}%)</div>
            </div>

            <div className="bg-orange-500/20 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-orange-400">{stats.hard}</div>
              <div className="text-xs text-gray-400">Hard ({percentages.hard}%)</div>
            </div>

            <div className="bg-green-500/20 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-green-400">{stats.good}</div>
              <div className="text-xs text-gray-400">Good ({percentages.good}%)</div>
            </div>

            <div className="bg-blue-500/20 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-blue-400">{stats.easy}</div>
              <div className="text-xs text-gray-400">Easy ({percentages.easy}%)</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {hasMissedCards && (
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={onRetryMissed}
            >
              Retry Missed Cards ({missedCards})
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full border-gray-700 hover:bg-gray-700/50"
            onClick={onReturnToDashboard}
          >
            Return to Dashboard
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
