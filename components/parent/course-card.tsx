import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

interface CourseCardProps {
  subject: string
  course: string
  platformUrl: string
  platformHelp?: 'needs_help' | 'no_help_needed' | null
  onPlatformSelect: (url: string) => void
}

export function CourseCard({
  subject,
  course,
  platformUrl,
  platformHelp,
  onPlatformSelect,
}: CourseCardProps) {
  const [url, setUrl] = useState(platformUrl)
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    onPlatformSelect(url)
    setIsEditing(false)
    toast({
      title: "Platform URL updated",
      description: `Updated platform URL for ${course}`,
      variant: "default",
    })
  }

  return (
    <Card className="border-primary/20 hover:border-primary transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{course}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-2">
          {isEditing ? (
            <div className="flex gap-2">
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter platform URL"
                className="flex-1"
              />
              <Button onClick={handleSave} size="sm">Save</Button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              {platformUrl ? (
                <a
                  href={platformUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline truncate"
                >
                  {platformUrl}
                </a>
              ) : (
                <span className="text-muted-foreground">No platform URL set</span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            </div>
          )}
          {platformHelp === 'needs_help' && (
            <div className="text-destructive text-sm">
              Help needed with this course
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 