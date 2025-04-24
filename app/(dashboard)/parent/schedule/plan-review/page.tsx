"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import confetti from "canvas-confetti"
import { Sparkles, Calendar, Book, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function PlanReviewPage() {
  const router = useRouter()
  const { toast } = useToast()

  // Trigger confetti and toast on page load
  useEffect(() => {
    // Trigger confetti
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: randomInRange(0.1, 0.3) },
        colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"],
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: randomInRange(0.1, 0.3) },
        colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"],
      })
    }, 250)

    // Show success toast
    toast({
      title: "🎉 Success!",
      description: "Your learning plan has been created!",
    })

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [toast])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="border-2 border-purple-400 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
            <div className="flex items-center justify-center mb-2">
              <Sparkles className="h-8 w-8 text-yellow-300 mr-2" />
              <CardTitle className="text-2xl">Your Learning Plan is Ready!</CardTitle>
            </div>
            <CardDescription className="text-purple-100 text-lg text-center">
              We've created a customized learning plan based on your preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-2 text-purple-700 dark:text-purple-300">Khan Academy Math</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  A comprehensive learning plan with assignments scheduled every Mon/Wed/Fri.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
                    <p className="font-medium">📅 Schedule</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Mon/Wed/Fri at 10:00 AM</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
                    <p className="font-medium">⏱️ Duration</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sep 1 - Dec 15 (3 months)</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
                    <p className="font-medium">📚 Assignments</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">24 assignments created</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
                    <p className="font-medium">📝 Tests</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">4 tests scheduled</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-bold mb-4">What's Next?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg py-6"
                    onClick={() => router.push("/parent/calendar")}
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    View Full Schedule
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg py-6"
                    onClick={() => router.push("/parent/assignments")}
                  >
                    <Book className="h-5 w-5 mr-2" />
                    Manage Assignments
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pb-6 flex justify-center">
            <Button
              variant="outline"
              className="border-2 border-gray-300 hover:border-purple-400"
              onClick={() => router.push("/parent/curriculum/upload-syllabus")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Learning Plan Builder
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
