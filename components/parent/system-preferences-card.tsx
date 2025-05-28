import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Settings, Info, CheckCircle, AlertCircle, Clock } from "lucide-react"
import Link from "next/link"

interface SystemPreferencesCardProps {
  className?: string
}

export default function SystemPreferencesCard({ className }: SystemPreferencesCardProps) {
  // Mock data for preferences status
  const preferences = [
    { name: "Educational Goals", status: "complete", icon: <CheckCircle className="h-4 w-4" /> },
    { name: "Student Profiles", status: "complete", icon: <CheckCircle className="h-4 w-4" /> },
    { name: "Schedule & Term Preferences", status: "complete", icon: <CheckCircle className="h-4 w-4" /> },
    { name: "Mentor Personality", status: "complete", icon: <CheckCircle className="h-4 w-4" /> },
    { name: "Oversight Rules", status: "complete", icon: <CheckCircle className="h-4 w-4" /> },
    { name: "Grant Settings", status: "missing", icon: <AlertCircle className="h-4 w-4" /> },
    { name: "Accountability Rules", status: "in-progress", icon: <Clock className="h-4 w-4" /> },
  ]

  // Calculate completion percentage
  const completedCount = preferences.filter((pref) => pref.status === "complete").length
  const completionPercentage = Math.round((completedCount / preferences.length) * 100)

  return (
    <Card className={`bg-gray-900/80 border-gray-800 hover:bg-gray-800/80 transition-all ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-indigo-400" />
          Your System Preferences
        </CardTitle>
        <CardDescription>
          These are the settings that power your child's learning system. You can review or update them anytime.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Completion Status</span>
              <span className="text-sm text-muted-foreground">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
            </Progress>
          </div>

          <div className="space-y-2">
            {preferences.map((pref, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`${
                      pref.status === "complete"
                        ? "text-green-400"
                        : pref.status === "in-progress"
                          ? "text-amber-400"
                          : "text-red-400"
                    }`}
                  >
                    {pref.icon}
                  </span>
                  <span className="text-sm">{pref.name}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3.5 w-3.5 text-gray-500 hover:text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-[200px]">
                          {pref.name} affects how the system schedules, provides feedback, and rewards your child.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Badge
                  variant="outline"
                  className={`
                  ${
                    pref.status === "complete"
                      ? "bg-green-500/20 text-green-400 border-green-500/50"
                      : pref.status === "in-progress"
                        ? "bg-amber-500/20 text-amber-400 border-amber-500/50"
                        : "bg-red-500/20 text-red-400 border-red-500/50"
                  }
                `}
                >
                  {pref.status === "complete" ? "Complete" : pref.status === "in-progress" ? "In Progress" : "Missing"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          Re-take Intake Assessment
        </Button>
        <Link href="/parent/settings">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500">
            View & Edit Preferences
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
