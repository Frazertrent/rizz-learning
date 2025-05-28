"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { FlashcardSet } from "./flashcard-study"
import { Plus, Tag, X } from "lucide-react"

interface FlashcardTagEditorProps {
  flashcardSet: FlashcardSet
  onClose: () => void
  onSave: (tags: string[]) => void
}

export function FlashcardTagEditor({ flashcardSet, onClose, onSave }: FlashcardTagEditorProps) {
  const [tags, setTags] = useState<string[]>([...flashcardSet.tags])
  const [newTag, setNewTag] = useState("")

  // Suggested tags based on the content
  const suggestedTags = [
    "Important",
    "Review",
    "Difficult",
    "Exam",
    "Quiz",
    "Concept",
    "Definition",
    "Formula",
    "Theory",
    "Practice",
  ].filter((tag) => !tags.includes(tag))

  const addTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
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
          <h2 className="text-xl font-bold flex items-center">
            <Tag className="h-5 w-5 mr-2" />
            Edit Tags
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-gray-400 mb-4">Add or remove tags to organize your flashcard set.</p>

        <div className="mb-6">
          <div className="flex gap-2 mb-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="bg-gray-700/50 border-gray-700 focus:border-purple-500"
              placeholder="Add a new tag..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addTag(newTag)
                }
              }}
            />
            <Button variant="outline" className="border-gray-700 hover:bg-gray-700/50" onClick={() => addTag(newTag)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-gray-700/50 hover:bg-gray-700 px-3 py-1.5">
                {tag}
                <button className="ml-2 text-gray-400 hover:text-white" onClick={() => removeTag(tag)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {tags.length === 0 && <div className="text-sm text-gray-500 italic">No tags added yet</div>}
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Suggested Tags</h3>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.slice(0, 8).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="bg-gray-700/30 hover:bg-gray-700 cursor-pointer"
                  onClick={() => addTag(tag)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 border-gray-700 hover:bg-gray-700/50" onClick={onClose}>
            Cancel
          </Button>

          <Button
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            onClick={() => onSave(tags)}
          >
            Save Tags
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
