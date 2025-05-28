"use client"

import { useState, useEffect } from "react"
import { Sparkles, Trophy, Calendar, Target, ArrowUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Motivational quotes
const motivationalQuotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
]

export default function MotivationalFeed({ goals }) {
  const [quote, setQuote] = useState(motivationalQuotes[0])

  // Change quote every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length)
      setQuote(motivationalQuotes[randomIndex])
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Calculate stats
  const completedGoals = goals.filter((goal) => goal.completed).length
  const totalGoals = goals.length
  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0
  const streakGoals = goals.filter((goal) => goal.streak && goal.streak > 0)
  const highestStreak = streakGoals.length > 0 ? Math.max(...streakGoals.map((goal) => goal.streak)) : 0

  // Get goals due soon
  const today = new Date()
  const upcomingGoals = goals
    .filter((goal) => !goal.completed && goal.dueDate && goal.dueDate !== "Ongoing")
    .sort((a, b) => {
      const dateA = new Date(a.dueDate)
      const dateB = new Date(b.dueDate)
      return dateA - dateB
    })
    .slice(0, 2)

  return (
    <div className="space-y-4">
      {/* Motivational Stats Card */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/10 rounded-xl p-4 border border-amber-200 dark:border-amber-800 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="bg-amber-200 dark:bg-amber-800/50 rounded-full p-2 text-amber-700 dark:text-amber-300">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-300">Your Progress</h3>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
              {completedGoals === 0
                ? "Set your first goal and start your journey!"
                : `You've completed ${completedGoals} out of ${totalGoals} goals. Keep it up!`}
            </p>

            {totalGoals > 0 && (
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-amber-700 dark:text-amber-400">Completion Rate</span>
                  <span className="text-amber-700 dark:text-amber-400">{completionRate}%</span>
                </div>
                <Progress
                  value={completionRate}
                  className="h-2 bg-amber-200/50 dark:bg-amber-800/50"
                  indicatorClassName="bg-amber-500 dark:bg-amber-400"
                />
              </div>
            )}

            {highestStreak > 0 && (
              <div className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                <span className="inline-block mr-1">🔥</span>
                Your highest streak is {highestStreak} days!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quote Card */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/5 rounded-xl p-4 border border-blue-200 dark:border-blue-800/50 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="bg-blue-200 dark:bg-blue-800/50 rounded-full p-2 text-blue-700 dark:text-blue-300">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-800 dark:text-blue-300">Daily Inspiration</h3>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1 italic">"{quote.text}"</p>
            <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">— {quote.author}</p>
          </div>
        </div>
      </div>

      {/* Upcoming Goals */}
      {upcomingGoals.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/5 rounded-xl p-4 border border-purple-200 dark:border-purple-800/50 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-purple-200 dark:bg-purple-800/50 rounded-full p-2 text-purple-700 dark:text-purple-300">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-800 dark:text-purple-300">Coming Up</h3>
              <div className="mt-2 space-y-2">
                {upcomingGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-2 border border-purple-100 dark:border-purple-900/30"
                  >
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium text-purple-700 dark:text-purple-300">{goal.title}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-xs text-purple-600 dark:text-purple-400">Due: {goal.dueDate}</div>
                      <div className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                        {goal.progress}% complete
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Level Up Teaser */}
      <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/10 dark:to-teal-900/5 rounded-xl p-4 border border-green-200 dark:border-green-800/50 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="bg-green-200 dark:bg-green-800/50 rounded-full p-2 text-green-700 dark:text-green-300">
            <ArrowUp className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">Level Up!</h3>
            <p className="text-sm text-green-700 dark:text-green-400 mt-1">
              Complete 3 more goals to reach the next level and unlock new rewards!
            </p>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-green-700 dark:text-green-400">Progress to Level 6</span>
                <span className="text-green-700 dark:text-green-400">70%</span>
              </div>
              <Progress
                value={70}
                className="h-2 bg-green-200/50 dark:bg-green-800/50"
                indicatorClassName="bg-green-500 dark:bg-green-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
