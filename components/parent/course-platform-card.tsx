"use client"

import { useState } from "react"
import { WebsiteThumbnail } from "@/components/ui/website-thumbnail"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getPlatformForCourse } from "@/lib/platform-mappings"
import { BookOpen, ExternalLink, Check, X } from "lucide-react"

interface CoursePlatformCardProps {
  subject: string
  course: string
  platformUrl?: string
  needPlatformHelp?: boolean | null
  onPlatformSelect?: (url: string) => void
  onHelpToggle?: (needsHelp: boolean) => void
}

// Helper function to validate URLs
function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString)
    return true
  } catch (e) {
    return false
  }
}

export function CoursePlatformCard({
  subject,
  course,
  platformUrl,
  needPlatformHelp,
  onPlatformSelect,
  onHelpToggle,
}: CoursePlatformCardProps) {
  // Get the default platform for this course if none is provided
  const defaultPlatform = getPlatformForCourse(subject, course)
  const [url, setUrl] = useState(platformUrl || defaultPlatform?.url || "")
  const [title, setTitle] = useState(course || subject)

  // Handle platform selection
  const handlePlatformSelect = () => {
    if (onPlatformSelect && isValidUrl(url)) {
      onPlatformSelect(url)
    }
  }

  // Handle help toggle
  const handleHelpToggle = (needsHelp: boolean) => {
    if (onHelpToggle) {
      onHelpToggle(needsHelp)
    }
  }

  // Handle external link click
  const handleExternalLinkClick = () => {
    if (isValidUrl(url)) {
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700 overflow-hidden hover:border-red-500/30 transition-all">
      <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-700 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-white">
          <BookOpen className="h-4 w-4 text-red-400" />
          {title}
        </CardTitle>
        <CardDescription className="text-gray-400">{subject}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <WebsiteThumbnail url={url} title={title} />
      </CardContent>
      <CardFooter className="flex flex-col gap-2 p-3">
        <div className="flex justify-between w-full">
          <Button
            size="sm"
            variant="outline"
            className="text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
            onClick={handleExternalLinkClick}
            disabled={!isValidUrl(url)}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Visit Platform
          </Button>

          {onHelpToggle && (
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={needPlatformHelp === true ? "default" : "outline"}
                className={`text-xs ${
                  needPlatformHelp === true
                    ? "bg-red-700 hover:bg-red-600 text-white"
                    : "border-gray-600 text-gray-300 hover:bg-gray-700"
                }`}
                onClick={() => handleHelpToggle(true)}
              >
                <X className="h-3 w-3 mr-1" />
                Need Help
              </Button>
              <Button
                size="sm"
                variant={needPlatformHelp === false ? "default" : "outline"}
                className={`text-xs ${
                  needPlatformHelp === false
                    ? "bg-green-700 hover:bg-green-600 text-white"
                    : "border-gray-600 text-gray-300 hover:bg-gray-700"
                }`}
                onClick={() => handleHelpToggle(false)}
              >
                <Check className="h-3 w-3 mr-1" />
                Got It
              </Button>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
