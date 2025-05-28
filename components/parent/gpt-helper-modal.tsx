"use client"

import { useState, useEffect } from "react"
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
import { createClient } from "@supabase/supabase-js"

interface GptHelperModalProps {
  isOpen: boolean
  onClose: () => void
  timeBlock: any | null
  onSuggestionSelect: (suggestion: string) => void
}

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Platform {
  id: string
  name: string
  url: string
  subject: string
  description?: string
  type: string
}

export function GptHelperModal({ isOpen, onClose, timeBlock, onSuggestionSelect }: GptHelperModalProps) {
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Platform[]>([])
  const [error, setError] = useState<string | null>(null)

  // Fetch platform suggestions from Supabase
  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
    setLoading(true)

        // Get the subject from the time block if available
        const subject = timeBlock?.subject?.toLowerCase() || ''

        // Fetch platforms for the subject
        const { data: platformsData, error: platformsError } = await supabase
          .from('platforms')
          .select('*')
          .eq('subject', subject)
          .order('name')

        if (platformsError) throw platformsError

        // If no subject-specific platforms found, get general platforms
        if (!platformsData || platformsData.length === 0) {
          const { data: generalPlatforms, error: generalError } = await supabase
            .from('platforms')
            .select('*')
            .eq('type', 'general')
            .order('name')

          if (generalError) throw generalError
          setSuggestions(generalPlatforms as Platform[] || [])
        } else {
          setSuggestions(platformsData as Platform[] || [])
        }

        setError(null)
      } catch (err) {
        console.error('Error fetching platforms:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
      setLoading(false)
      }
    }

    if (isOpen) {
      fetchPlatforms()
  }
  }, [isOpen, timeBlock])

  // Reset state when modal opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setSearchQuery("")
      setSuggestions([])
    } else {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
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
            Here are some suggested resources based on your schedule:
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
            {loading ? (
            <div className="text-center">Loading suggestions...</div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : suggestions.length === 0 ? (
            <div className="text-center">No suggestions available for this subject.</div>
          ) : (
            suggestions.map((platform) => (
              <div key={platform.id} className="grid grid-cols-4 items-center gap-4">
                  <Button
                  variant="outline"
                  className="col-span-4"
                  onClick={() => timeBlock && onSuggestionSelect(platform.url)}
                  >
                  {platform.name}
                  </Button>
              </div>
            ))
            )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
