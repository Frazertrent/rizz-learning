"use client"

import { Info, Lightbulb } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TimeBlockCardProps {
  timeBlock: any
  resourceLink: string
  notes: string
  onResourceLinkChange: (value: string) => void
  onNotesChange: (value: string) => void
  onGptHelperClick: () => void
}

// Function to get a color based on the subject/activity
function getColorForActivity(activity: string): string {
  const colors = {
    math: "from-blue-500 to-blue-600",
    science: "from-green-500 to-green-600",
    reading: "from-purple-500 to-purple-600",
    writing: "from-indigo-500 to-indigo-600",
    history: "from-amber-500 to-amber-600",
    art: "from-pink-500 to-pink-600",
    music: "from-rose-500 to-rose-600",
    pe: "from-emerald-500 to-emerald-600",
    language: "from-violet-500 to-violet-600",
    scripture: "from-yellow-500 to-yellow-600",
    break: "from-gray-500 to-gray-600",
    lunch: "from-orange-500 to-orange-600",
    default: "from-teal-500 to-teal-600",
  }

  const lowerActivity = activity?.toLowerCase() || ""

  for (const [key, value] of Object.entries(colors)) {
    if (lowerActivity.includes(key)) {
      return value
    }
  }

  return colors.default
}

// Format time from 24h to 12h format
function formatTime(time: string): string {
  if (!time) return ""

  try {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12

    return `${hour12}:${minutes} ${ampm}`
  } catch (e) {
    return time
  }
}

export function TimeBlockCard({
  timeBlock,
  resourceLink,
  notes,
  onResourceLinkChange,
  onNotesChange,
  onGptHelperClick,
}: TimeBlockCardProps) {
  const colorGradient = getColorForActivity(timeBlock.activity_name || timeBlock.label || "")

  const startTime = formatTime(timeBlock.start_time)
  const endTime = timeBlock.end_time ? formatTime(timeBlock.end_time) : ""
  const title = endTime
    ? `${startTime} – ${endTime} – ${timeBlock.activity_name || timeBlock.label || "Activity"}`
    : `${startTime} – ${timeBlock.activity_name || timeBlock.label || "Activity"}`

  return (
    <Card className={`overflow-hidden border-t-4 bg-gradient-to-r ${colorGradient} bg-opacity-10`}>
      <CardHeader className="bg-gradient-to-r from-black/5 to-black/10 pb-3">
        <CardTitle className="flex items-center text-lg font-bold">
          <span className="mr-2">⏰</span> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor={`resource-${timeBlock.id}`} className="flex items-center text-sm font-medium">
              🔗 Paste direct link to the resource
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="ml-1 h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    Use the exact link that takes you straight to the student's resource (not just a landing page).
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <Button variant="outline" size="sm" onClick={onGptHelperClick} className="gap-1 text-sm">
              <Lightbulb className="h-4 w-4" />🤖 Help Me Pick a Tool
            </Button>
          </div>
          <Input
            id={`resource-${timeBlock.id}`}
            placeholder="https://..."
            value={resourceLink}
            onChange={(e) => onResourceLinkChange(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor={`notes-${timeBlock.id}`} className="text-sm font-medium">
            📝 Notes
          </label>
          <Textarea
            id={`notes-${timeBlock.id}`}
            placeholder="Write reminders, tips, or things to check here."
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            className="min-h-[100px] w-full"
          />
        </div>
      </CardContent>
    </Card>
  )
}
