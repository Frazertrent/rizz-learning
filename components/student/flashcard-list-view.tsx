"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { FlashcardSet } from "./flashcard-study"
import { Check, List, X } from "lucide-react"

interface FlashcardListViewProps {
  flashcardSet: FlashcardSet
  currentIndex: number
  onSelectCard: (index: number) => void
  onClose: () => void
}

export function FlashcardListView({ flashcardSet, currentIndex, onSelectCard, onClose }: FlashcardListViewProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[80vh] flex flex-col"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <List className="h-5 w-5 mr-2" />
            All Flashcards
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-gray-400 mb-4">View all flashcards in this set. Click on a card to study it.</p>

        <div className="overflow-y-auto flex-1 pr-2 -mr-2">
          <div className="space-y-3">
            {flashcardSet.cards.map((card, index) => (
              <motion.div
                key={card.id}
                className={`p-4 rounded-xl cursor-pointer transition-colors ${
                  index === currentIndex
                    ? "bg-purple-600/20 border border-purple-500/50"
                    : "bg-gray-700/30 border border-gray-700 hover:bg-gray-700/50"
                }`}
                onClick={() => onSelectCard(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex justify-between">
                  <div className="font-medium mb-1">{card.front}</div>
                  {index === currentIndex && (
                    <div className="ml-2">
                      <Check className="h-5 w-5 text-purple-500" />
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-400 mb-2 line-clamp-2">{card.back}</div>
                <div className="flex flex-wrap gap-1">
                  {card.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-gray-700/50 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <Button
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
