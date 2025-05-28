"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, CheckCircle2, Edit, X, Sparkles, Coins, BookOpen } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import confetti from "canvas-confetti"

interface GoalSuggestionModalProps {
  isOpen: boolean
  onClose: () => void
  onAddGoal: (goal: any) => void
}

export default function GoalSuggestionModal({ isOpen, onClose, onAddGoal }: GoalSuggestionModalProps) {
  const [showSuccess, setShowSuccess] = useState(false)

  // Sample suggested goal
  const suggestedGoal = {
    title: "Complete Science Chapter 5",
    category: "academic",
    dueDate: "April 25, 2025",
    milestones: [
      { id: "m1", text: "Read pages 1–10", completed: false },
      { id: "m2", text: "Summarize in notes", completed: false },
      { id: "m3", text: "Complete chapter quiz", completed: false },
    ],
    xpReward: 25,
    coinReward: 10,
    suggestedHabit: "📖 Read 10 mins daily",
  }

  const handleAddGoal = () => {
    // Trigger confetti animation
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    })

    // Show success message
    setShowSuccess(true)

    // Hide success message after 2 seconds and close modal
    setTimeout(() => {
      setShowSuccess(false)
      onAddGoal(suggestedGoal)
      onClose()
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-gray-950 border border-gray-800 shadow-xl rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none" />

        <DialogHeader className="pb-2">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center">
            🎯 Goal Suggestion from Your Assistant
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <AnimatePresence>
            {showSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6 text-center"
              >
                <div className="flex justify-center mb-3">
                  <div className="bg-green-500/20 rounded-full p-3">
                    <CheckCircle2 className="h-8 w-8 text-green-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-green-400 mb-2">🎉 Goal added! Let's crush it!</h3>
                <p className="text-gray-300">Your new goal has been added to your dashboard.</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-purple-500/30 rounded-xl p-5 shadow-[0_0_15px_rgba(124,58,237,0.2)]"
              >
                <div className="flex justify-between items-start mb-3">
                  <Badge className="bg-blue-900/50 text-blue-300 border-blue-700">
                    <BookOpen className="h-3 w-3 mr-1" /> Academic
                  </Badge>
                  <Badge variant="outline" className="text-gray-300 border-gray-700 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" /> {suggestedGoal.dueDate}
                  </Badge>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{suggestedGoal.title}</h3>

                <div className="space-y-2 mb-4">
                  <p className="text-gray-300 text-sm font-medium">Mini Milestones:</p>
                  <ul className="space-y-2">
                    {suggestedGoal.milestones.map((milestone) => (
                      <li key={milestone.id} className="flex items-start gap-2 text-gray-300">
                        <div className="h-5 w-5 rounded-full border border-gray-700 flex-shrink-0 mt-0.5" />
                        <span>{milestone.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-purple-900/50 text-purple-300 border-purple-700 flex items-center">
                    <Sparkles className="h-3 w-3 mr-1" /> +{suggestedGoal.xpReward} XP
                  </Badge>
                  <Badge className="bg-amber-900/50 text-amber-300 border-amber-700 flex items-center">
                    <Coins className="h-3 w-3 mr-1" /> +{suggestedGoal.coinReward}
                  </Badge>
                </div>

                <div className="bg-gray-900/70 rounded-lg p-3">
                  <p className="text-gray-300 text-sm mb-1">Suggested Habit:</p>
                  <p className="text-white font-medium">{suggestedGoal.suggestedHabit}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="flex gap-2">
          {!showSuccess && (
            <>
              <Button variant="ghost" onClick={onClose} className="text-gray-300 hover:text-white hover:bg-gray-800">
                <X className="h-4 w-4 mr-1" /> Close
              </Button>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                <Edit className="h-4 w-4 mr-1" /> Edit Before Saving
              </Button>
              <Button
                onClick={handleAddGoal}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                <CheckCircle2 className="h-4 w-4 mr-1" /> Add This Goal
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
