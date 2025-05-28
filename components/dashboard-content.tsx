"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Calendar,
  BookOpen,
  Award,
  Target,
  CheckSquare,
  Zap,
  ArrowRight,
  Clock,
  BookMarked,
  Flame,
  CalendarDays,
  MessageSquare,
  Lightbulb,
} from "lucide-react"
import Link from "next/link"

interface DashboardContentProps {
  studentName: string
  addCoinsAndXp: (coins: number, xp: number) => void
}

export default function DashboardContent({ studentName, addCoinsAndXp }: DashboardContentProps) {
  const isMobile = useIsMobile()
  const [dailyChallengeCompleted, setDailyChallengeCompleted] = useState(false)

  const handleCompleteChallenge = () => {
    if (!dailyChallengeCompleted) {
      addCoinsAndXp(10, 15)
      setDailyChallengeCompleted(true)
    }
  }

  return (
    <main className={`flex-1 overflow-y-auto p-6 pt-8 ${isMobile ? "ml-0" : "ml-64"}`}>
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {studentName}!</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here's what's happening with your learning journey today.
          </p>
        </header>

        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex space-x-4 md:justify-center">
            {/* Keep only these four buttons */}
            <Link href="/parent/schedule">
              <Button
                variant="default"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                Schedule
              </Button>
            </Link>

            <Link href="/parent/feedback">
              <Button
                variant="default"
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Feedback
              </Button>
            </Link>

            <Link href="/parent/gradebook">
              <Button
                variant="default"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Gradebook
              </Button>
            </Link>

            <Link href="/parent/reflection">
              <Button
                variant="default"
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                Reflection
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="quick-access">Quick Access</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Today's Schedule Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                    Today's Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">9:00 AM</span>
                      <span className="font-medium">Math</span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">10:30 AM</span>
                      <span className="font-medium">Science</span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">1:00 PM</span>
                      <span className="font-medium">History</span>
                    </li>
                  </ul>
                  <Button variant="link" size="sm" className="mt-2 px-0" asChild>
                    <a href="/student/schedule">
                      View full schedule <ArrowRight className="h-4 w-4 ml-1" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Assignments Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <BookOpen className="h-5 w-5 mr-2 text-purple-500" />
                    Assignments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex justify-between text-sm">
                      <span className="font-medium">Math Quiz</span>
                      <span className="text-red-500">Today</span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span className="font-medium">Science Lab</span>
                      <span className="text-gray-600 dark:text-gray-400">Tomorrow</span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span className="font-medium">History Essay</span>
                      <span className="text-gray-600 dark:text-gray-400">Apr 20</span>
                    </li>
                  </ul>
                  <Button variant="link" size="sm" className="mt-2 px-0" asChild>
                    <a href="/student/assignments">
                      View all assignments <ArrowRight className="h-4 w-4 ml-1" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Goals Progress Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Target className="h-5 w-5 mr-2 text-green-500" />
                    Goals Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Read 20 pages</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Complete Math Unit</span>
                        <span>40%</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Science Project</span>
                        <span>10%</span>
                      </div>
                      <Progress value={10} className="h-2" />
                    </div>
                  </div>
                  <Button variant="link" size="sm" className="mt-2 px-0" asChild>
                    <a href="/student/goals">
                      View all goals <ArrowRight className="h-4 w-4 ml-1" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Daily Challenge Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                    Daily Challenge
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">Complete a 15-minute focused study session without distractions.</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium">Reward: </span>
                      <span className="text-amber-500">10 coins</span>
                      <span> + </span>
                      <span className="text-blue-500">15 XP</span>
                    </div>
                    <Button size="sm" onClick={handleCompleteChallenge} disabled={dailyChallengeCompleted}>
                      {dailyChallengeCompleted ? "Completed" : "Complete"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Subject Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Subject Progress</CardTitle>
                <CardDescription>Your progress across different subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Math</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Science</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">History</span>
                      <span>42%</span>
                    </div>
                    <Progress value={42} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">English</span>
                      <span>91%</span>
                    </div>
                    <Progress value={91} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Streak */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Flame className="h-5 w-5 mr-2 text-orange-500" />
                  Learning Streak
                </CardTitle>
                <CardDescription>You're on a 7-day streak! Keep it up!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${i < 7 ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-400"}`}
                      >
                        {i + 1}
                      </div>
                      <span className="text-xs">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Your Learning Progress</CardTitle>
                <CardDescription>Track your progress across all subjects and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 dark:text-gray-400">
                  Detailed progress tracking coming soon. Check back for updates!
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quick-access">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <QuickAccessCard
                href="/student/schedule"
                icon={<Clock className="h-6 w-6 text-blue-500" />}
                title="Schedule"
                description="View your daily and weekly schedule"
              />
              <QuickAccessCard
                href="/student/assignments"
                icon={<BookOpen className="h-6 w-6 text-purple-500" />}
                title="Assignments"
                description="Track and complete your assignments"
              />
              <QuickAccessCard
                href="/student/goals"
                icon={<Target className="h-6 w-6 text-green-500" />}
                title="Goals"
                description="Set and track your learning goals"
              />
              <QuickAccessCard
                href="/student/rewards"
                icon={<Award className="h-6 w-6 text-amber-500" />}
                title="Rewards"
                description="Redeem coins for rewards"
              />
              <QuickAccessCard
                href="/student/check-ins"
                icon={<CheckSquare className="h-6 w-6 text-teal-500" />}
                title="Check-ins"
                description="Daily and weekly check-ins"
              />
              <QuickAccessCard
                href="/student/uploads"
                icon={<BookMarked className="h-6 w-6 text-indigo-500" />}
                title="Uploads"
                description="Upload and manage your work"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

function QuickAccessCard({
  href,
  icon,
  title,
  description,
}: {
  href: string
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <a href={href} className="block">
      <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1">
        <CardContent className="p-6">
          <div className="mb-4">{icon}</div>
          <h3 className="font-medium mb-1">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </CardContent>
      </Card>
    </a>
  )
}
