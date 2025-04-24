"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, Edit, Trash2, Plus, AlertCircle, Award } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"

export function ReflectionJournal() {
  const [date, setDate] = useState<Date>(new Date())
  const [activeTab, setActiveTab] = useState("write")
  const [reflections, setReflections] = useState<{
    [key: string]: { content: string; mood: string; tags: string[]; proudOf: string }
  }>({})
  const [currentReflection, setCurrentReflection] = useState("")
  const [currentMood, setCurrentMood] = useState("neutral")
  const [currentTags, setCurrentTags] = useState<string[]>([])
  const [proudOf, setProudOf] = useState("")
  const [newTag, setNewTag] = useState("")
  const [showDateError, setShowDateError] = useState(false)
  const [showRewardBanner, setShowRewardBanner] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)
  const [coinsEarned, setCoinsEarned] = useState(0)
  const [moodStreakCount, setMoodStreakCount] = useState(0)
  const [hasSubmittedToday, setHasSubmittedToday] = useState(false)

  const confettiCanvasRef = useRef(null)

  const dateKey = date.toISOString().split("T")[0]
  const todayKey = new Date().toISOString().split("T")[0]
  const hasReflectionForDate = reflections[dateKey] !== undefined

  // Check if the selected date is today
  useEffect(() => {
    if (dateKey !== todayKey) {
      setShowDateError(true)
      setDate(new Date()) // Reset to today
    } else {
      setShowDateError(false)
    }
  }, [dateKey, todayKey])

  // Check if reflection was already submitted today
  useEffect(() => {
    setHasSubmittedToday(reflections[todayKey] !== undefined)
  }, [reflections, todayKey])

  // Calculate mood streak
  useEffect(() => {
    let streak = 0
    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const checkDate = new Date()
      checkDate.setDate(today.getDate() - i)
      const checkKey = checkDate.toISOString().split("T")[0]

      if (reflections[checkKey]) {
        streak++
      } else if (i === 0) {
        // If today doesn't have a reflection yet, that's okay
        continue
      } else {
        // Break the streak if a day is missed
        break
      }
    }

    setMoodStreakCount(streak)
  }, [reflections])

  const moods = [
    { value: "excited", label: "Excited", emoji: "😃" },
    { value: "happy", label: "Happy", emoji: "😊" },
    { value: "neutral", label: "Neutral", emoji: "😐" },
    { value: "tired", label: "Tired", emoji: "😴" },
    { value: "frustrated", label: "Frustrated", emoji: "😤" },
    { value: "sad", label: "Sad", emoji: "😔" },
  ]

  // Generate mock data for the mood streak
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const moodStreak = weekdays.map((day, index) => {
    const d = new Date()
    d.setDate(d.getDate() - d.getDay() + index)
    const key = d.toISOString().split("T")[0]

    return {
      day,
      date: d,
      mood: reflections[key]?.mood || null,
    }
  })

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const loadReflection = (date: Date) => {
    const key = date.toISOString().split("T")[0]
    if (reflections[key]) {
      setCurrentReflection(reflections[key].content)
      setCurrentMood(reflections[key].mood)
      setCurrentTags(reflections[key].tags)
      setProudOf(reflections[key].proudOf || "")
    } else {
      setCurrentReflection("")
      setCurrentMood("neutral")
      setCurrentTags([])
      setProudOf("")
    }
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#9c5fff", "#7000ff", "#ff0099", "#00ffff"],
    })
  }

  const saveReflection = () => {
    if (currentReflection.trim() === "") return

    const key = date.toISOString().split("T")[0]
    const isNewReflection = !reflections[key]

    setReflections({
      ...reflections,
      [key]: {
        content: currentReflection,
        mood: currentMood,
        tags: currentTags,
        proudOf: proudOf,
      },
    })

    // Only award XP and coins for new reflections
    if (isNewReflection) {
      // Set rewards
      const newXp = 10
      const newCoins = 5

      setXpEarned(newXp)
      setCoinsEarned(newCoins)

      // Show reward banner with confetti
      setShowRewardBanner(true)
      triggerConfetti()

      // Auto-dismiss banner after 3 seconds
      setTimeout(() => {
        setShowRewardBanner(false)
      }, 3000)
    }
  }

  const addTag = () => {
    if (newTag.trim() !== "" && !currentTags.includes(newTag.trim())) {
      setCurrentTags([...currentTags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setCurrentTags(currentTags.filter((t) => t !== tag))
  }

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Reflection Journal</h1>

      {showDateError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>🛑 Reflections can only be written for today.</AlertDescription>
        </Alert>
      )}

      {/* Reward Banner */}
      <AnimatePresence>
        {showRewardBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center shadow-lg"
          >
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-500 mb-1">
              🎉 Reflection Saved!
            </h3>
            <p className="text-lg">
              You earned <span className="font-bold text-blue-300">+{xpEarned} XP</span> and{" "}
              <span className="font-bold text-yellow-300">+{coinsEarned} Coins</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="shadow-md">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
          <div className="flex items-center justify-center">
            <CardTitle className="text-center">{formatDate(date)}</CardTitle>
          </div>
          <CardDescription className="text-white/80 text-center">
            Record your thoughts, feelings, and learning experiences
          </CardDescription>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="view" disabled={!hasReflectionForDate}>
                View
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="write" className="p-0">
            <CardContent className="pt-6">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">How are you feeling today?</label>
                <div className="flex flex-wrap gap-2">
                  {moods.map((mood) => (
                    <Button
                      key={mood.value}
                      variant={currentMood === mood.value ? "default" : "outline"}
                      className={`flex items-center gap-1 ${currentMood === mood.value ? "bg-purple-600" : ""}`}
                      onClick={() => setCurrentMood(mood.value)}
                    >
                      <span>{mood.emoji}</span>
                      <span>{mood.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Mood Streak Tracker */}
              <div className="mb-6 mt-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Mood Streak This Week</h3>
                <div className="flex justify-between items-center">
                  {moodStreak.map((day, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-8 h-8 flex items-center justify-center">
                        {day.mood ? (
                          <span>{moods.find((m) => m.value === day.mood)?.emoji || "😐"}</span>
                        ) : (
                          <span className="text-gray-300 dark:text-gray-600">–</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{day.day}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400 italic">
                  Keep checking in to complete your streak!
                </p>
              </div>

              {/* Rewards Summary Card */}
              <div className="mb-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-900/30 dark:to-purple-900/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30 shadow-sm">
                <h3 className="text-base font-medium mb-3 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-amber-500" />🪙 Today's Rewards
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">XP Earned:</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {hasSubmittedToday ? `+${xpEarned} XP` : "0 XP"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Coins Earned:</span>
                    <span className="font-medium text-amber-600 dark:text-amber-400">
                      {hasSubmittedToday ? `+${coinsEarned} Coins` : "0 Coins"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mood Streak:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {moodStreakCount >= 2 ? (
                        <span className="flex items-center">🔥 {moodStreakCount}-Day Streak!</span>
                      ) : (
                        <span className="text-gray-600 dark:text-gray-400">Let's build your first streak!</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Today's Reflection</label>
                <Textarea
                  placeholder="What did you learn today? What challenges did you face? What are you proud of?"
                  className="min-h-[200px]"
                  value={currentReflection}
                  onChange={(e) => setCurrentReflection(e.target.value)}
                />
              </div>

              {/* What's one thing you're proud of today? */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">💫 What's one thing you're proud of today?</label>
                <Textarea
                  placeholder="e.g. I stayed focused during math practice"
                  className="min-h-[80px]"
                  value={proudOf}
                  onChange={(e) => setProudOf(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {currentTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="ml-1 text-xs">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a tag"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                  />
                  <Button onClick={addTag} size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end">
              <Button
                onClick={saveReflection}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md"
              >
                <Save className="h-4 w-4 mr-2" /> Save Reflection
              </Button>
            </CardFooter>
          </TabsContent>

          <TabsContent value="view" className="p-0">
            {hasReflectionForDate && (
              <CardContent className="pt-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">Mood</h3>
                  <div className="flex items-center">
                    {moods.find((m) => m.value === reflections[dateKey].mood)?.emoji}
                    {moods.find((m) => m.value === reflections[dateKey].mood)?.label}
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">Reflection</h3>
                  <div className="whitespace-pre-wrap">{reflections[dateKey].content}</div>
                </div>

                {reflections[dateKey].proudOf && (
                  <>
                    <Separator className="my-4" />
                    <div className="mb-4">
                      <h3 className="text-lg font-medium mb-2">💫 Proud of</h3>
                      <div className="whitespace-pre-wrap">{reflections[dateKey].proudOf}</div>
                    </div>
                  </>
                )}

                <Separator className="my-4" />

                <div>
                  <h3 className="text-lg font-medium mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {reflections[dateKey].tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            )}

            <CardFooter className="flex justify-end">
              <Button variant="outline" onClick={() => setActiveTab("write")} className="mr-2">
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
            </CardFooter>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
