"use client"

import { useState } from "react"
import { Check, Loader2, Search, X, Lightbulb } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface GptHelperModalProps {
  isOpen: boolean
  onClose: () => void
  timeBlock: any | null
  onSuggestionSelect: (suggestion: string) => void
}

// Mock suggestions - in a real app, these would come from an AI API call
const MOCK_SUGGESTIONS = {
  math: [
    { name: "Khan Academy", url: "https://www.khanacademy.org/math" },
    { name: "IXL Math", url: "https://www.ixl.com/math" },
    { name: "Prodigy Math Game", url: "https://www.prodigygame.com" },
  ],
  science: [
    { name: "Mystery Science", url: "https://mysteryscience.com" },
    { name: "Generation Genius", url: "https://www.generationgenius.com" },
    { name: "Science Buddies", url: "https://www.sciencebuddies.org" },
  ],
  reading: [
    { name: "Epic!", url: "https://www.getepic.com" },
    { name: "ReadWorks", url: "https://www.readworks.org" },
    { name: "CommonLit", url: "https://www.commonlit.org" },
  ],
  writing: [
    { name: "NoRedInk", url: "https://www.noredink.com" },
    { name: "Quill", url: "https://www.quill.org" },
    { name: "WriteWell", url: "https://www.writewell.com" },
  ],
  history: [
    { name: "Big History Project", url: "https://www.bighistoryproject.com" },
    { name: "iCivics", url: "https://www.icivics.org" },
    { name: "History.com", url: "https://www.history.com/topics" },
  ],
  default: [
    { name: "Outschool", url: "https://outschool.com" },
    { name: "BrainPOP", url: "https://www.brainpop.com" },
    { name: "Discovery Education", url: "https://www.discoveryeducation.com" },
  ],
}

export function GptHelperModal({ isOpen, onClose, timeBlock, onSuggestionSelect }: GptHelperModalProps) {
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Array<{ name: string; url: string }>>([])

  // Get suggestions based on the time block activity
  const getSuggestions = () => {
    setLoading(true)

    // In a real app, this would be an API call to an AI service
    setTimeout(() => {
      const activity = timeBlock?.activity_name?.toLowerCase() || timeBlock?.label?.toLowerCase() || ""

      let suggestionsToUse = MOCK_SUGGESTIONS.default

      for (const [key, value] of Object.entries(MOCK_SUGGESTIONS)) {
        if (activity.includes(key)) {
          suggestionsToUse = value
          break
        }
      }

      // Filter by search query if provided
      if (searchQuery) {
        suggestionsToUse = suggestionsToUse.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
      }

      setSuggestions(suggestionsToUse)
      setLoading(false)
    }, 1000)
  }

  // Reset state when modal opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setSearchQuery("")
      setSuggestions([])
      // Auto-load suggestions when modal opens
      if (timeBlock) {
        getSuggestions()
      }
    } else {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Find the Perfect Tool
            {timeBlock && (
              <span className="block text-sm font-normal text-muted-foreground">
                For: {timeBlock.activity_name || timeBlock.label}
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            Let's find the best educational platform or resource for this time block.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search for specific tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" onClick={getSuggestions}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="max-h-[300px] overflow-y-auto rounded-md border p-1">
            {loading ? (
              <div className="flex h-[200px] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Finding the best tools...</span>
              </div>
            ) : suggestions.length > 0 ? (
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-between px-2 py-6 text-left"
                    onClick={() => onSuggestionSelect(suggestion.url)}
                  >
                    <div>
                      <div className="font-medium">{suggestion.name}</div>
                      <div className="text-xs text-muted-foreground">{suggestion.url}</div>
                    </div>
                    <Check className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                  </Button>
                ))}
              </div>
            ) : (
              <div className="flex h-[200px] flex-col items-center justify-center text-center text-muted-foreground">
                <Lightbulb className="h-12 w-12 mb-2 opacity-20" />
                <p>Click the search button to find tools for this time block.</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={() => timeBlock && onSuggestionSelect("https://outschool.com")}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
          >
            <Lightbulb className="mr-2 h-4 w-4" />
            Get AI Recommendation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
