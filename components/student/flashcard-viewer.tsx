"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Flashcard } from "./flashcard-study"
import { RefreshCw, Brain, ArrowRight, Loader2 } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface FlashcardViewerProps {
  card: Flashcard
  isFlipped: boolean
  onFlip: () => void
}

export function FlashcardViewer({ card, isFlipped, onFlip }: FlashcardViewerProps) {
  const [showMemoryTrick, setShowMemoryTrick] = useState(false)
  const [memoryTrickType, setMemoryTrickType] = useState<"normal" | "rhyme">("normal")
  const [isGenerating, setIsGenerating] = useState(false)

  // Function to generate a memory trick (simulated)
  const generateMemoryTrick = (type: "normal" | "rhyme") => {
    setMemoryTrickType(type)
    setIsGenerating(true)
    // Simulate API call delay
    setTimeout(() => {
      setIsGenerating(false)
    }, 1500)
  }

  return (
    <div className="relative perspective-1000 w-full h-[400px]">
      <motion.div
        className="w-full h-full relative preserve-3d transition-all duration-500"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Front of card */}
        <div
          className="absolute w-full h-full backface-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-xl p-8 flex flex-col cursor-pointer"
          onClick={onFlip}
        >
          <div className="flex-1 flex items-center justify-center">
            <h3 className="text-2xl font-medium text-center">{card.front}</h3>
          </div>
          <div className="text-center text-gray-400 text-sm mt-4">Tap card or press spacebar to flip</div>
        </div>

        {/* Back of card */}
        <div
          className="absolute w-full h-full backface-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-xl p-8 flex flex-col rotateY-180 cursor-pointer"
          onClick={onFlip}
        >
          <div className="flex-1 flex items-center justify-center">
            <div className="text-xl">{card.back}</div>
          </div>
          <div className="flex flex-wrap gap-1 justify-center mt-4">
            {card.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-gray-700/50">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Flip button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-4 right-4 bg-gray-800/50 hover:bg-gray-700/50 z-10"
        onClick={(e) => {
          e.stopPropagation()
          onFlip()
        }}
      >
        <RefreshCw className="h-4 w-4" />
      </Button>

      {/* Help Me Remember This button - only visible when card is flipped */}
      {isFlipped && (
        <Button
          variant="outline"
          size="sm"
          className="absolute bottom-4 left-4 bg-gray-800/50 hover:bg-gray-700/50 z-10 border-gray-700"
          onClick={(e) => {
            e.stopPropagation()
            setShowMemoryTrick(!showMemoryTrick)
            if (!showMemoryTrick) {
              generateMemoryTrick("normal")
            }
          }}
          title="Get a memory trick or mnemonic to make this stick"
        >
          <Brain className="h-4 w-4 mr-2" />
          Help Me Remember This
        </Button>
      )}

      {/* Memory Trick Popup */}
      <AnimatePresence>
        {showMemoryTrick && (
          <motion.div
            className="absolute left-4 bottom-16 w-80 bg-gradient-to-br from-purple-900/90 to-indigo-900/90 backdrop-blur-sm rounded-xl p-4 shadow-xl z-20 border border-purple-700/50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-white flex items-center">
                <Brain className="h-4 w-4 mr-2 text-purple-400" />
                Memory Tip
              </h4>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full"
                onClick={() => setShowMemoryTrick(false)}
              >
                <span className="sr-only">Close</span>
                <span aria-hidden="true">×</span>
              </Button>
            </div>

            <div className="mb-3">
              {isGenerating ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
                  <span className="ml-2 text-sm text-purple-200">Generating memory trick...</span>
                </div>
              ) : (
                <div className="text-sm text-purple-100">
                  {memoryTrickType === "normal" ? (
                    <>
                      <p className="mb-2">To remember that {card.front.toLowerCase()}, think of it as:</p>
                      <p className="font-medium text-white">
                        {card.back.length > 100
                          ? "Breaking this down into key parts: " + card.back.substring(0, 100) + "..."
                          : card.back}
                      </p>
                      <p className="mt-2 text-xs text-purple-300">
                        Try associating this with a vivid mental image or a familiar concept.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mb-2">Here's a rhyme to help you remember:</p>
                      <p className="font-medium text-white italic">
                        "{card.front.split(" ").slice(0, 3).join(" ")}..." is what they say,
                        <br />"{card.back.split(" ").slice(0, 3).join(" ")}..." helps me remember each day!
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-purple-200 hover:text-white hover:bg-purple-800/50"
                onClick={() => generateMemoryTrick(memoryTrickType === "normal" ? "rhyme" : "normal")}
              >
                {memoryTrickType === "normal" ? "🎵 Make it a Rhyme" : "🧠 Standard Memory Trick"}
              </Button>

              <Link
                href={`/student/chat?prompt=Help me create a memory trick for this flashcard: "${card.front}" with answer "${card.back}"`}
                passHref
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs bg-purple-800/50 hover:bg-purple-700/50 text-white"
                >
                  Send to GPT Chat
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
