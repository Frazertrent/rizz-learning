"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { FlashcardSet } from "./flashcard-study"
import { MessageSquare, Send, X } from "lucide-react"

interface FlashcardChatModalProps {
  flashcardSet: FlashcardSet
  onClose: () => void
}

export function FlashcardChatModal({ flashcardSet, onClose }: FlashcardChatModalProps) {
  const [message, setMessage] = useState(`Help me study this flashcard set from ${flashcardSet.name}`)

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
          <h2 className="text-xl font-bold flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Send to Chat
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-gray-400 mb-4">
          Send this flashcard set to the GPT Chat for additional help and explanations.
        </p>

        <div className="mb-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px] bg-gray-700/50 border-gray-700 focus:border-purple-500"
            placeholder="Enter your message to GPT..."
          />
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 border-gray-700 hover:bg-gray-700/50" onClick={onClose}>
            Cancel
          </Button>

          <Button
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            onClick={() => {
              // In a real app, this would navigate to the chat page with the message
              window.location.href = `/student/chat?prompt=${encodeURIComponent(message)}`
            }}
          >
            <Send className="h-4 w-4 mr-2" />
            Send to Chat
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
