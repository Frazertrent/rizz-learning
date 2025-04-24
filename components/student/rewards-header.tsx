"use client"

import { useEffect, useState } from "react"
import { Trophy, Star, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface RewardsHeaderProps {
  level: number
  totalXP: number
  recentLevelUp?: boolean
}

export function RewardsHeader({ level, totalXP, recentLevelUp = false }: RewardsHeaderProps) {
  const [showAnimation, setShowAnimation] = useState(false)
  const [confetti, setConfetti] = useState<Array<{ id: number; left: string; animationDelay: string }>>([])
  const [progressValue, setProgressValue] = useState(0)

  // Sample data
  const nextLevelXP = 600
  const currentXP = 450
  const progress = (currentXP / nextLevelXP) * 100

  // Generate random confetti pieces
  useEffect(() => {
    const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
    }))
    setConfetti(confettiPieces)

    // Trigger animation on mount
    setShowAnimation(true)

    // Clean up animation after it plays
    const timer = setTimeout(() => {
      setShowAnimation(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Animate progress bar on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressValue(progress)
    }, 500)
    return () => clearTimeout(timer)
  }, [progress])

  return (
    <div className="relative py-8 overflow-hidden">
      {/* Decorative Background Banner */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-pink-900/30 rounded-3xl transform -skew-y-1 shadow-lg" />

      {/* Animated Confetti (only shows on initial load or level up) */}
      {showAnimation && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {confetti.map((piece) => (
            <div
              key={piece.id}
              className="absolute bottom-0 w-2 h-2 rounded-full animate-confetti"
              style={{
                left: piece.left,
                animationDelay: piece.animationDelay,
                backgroundColor: ["#FFD700", "#FF3366", "#36CFFF", "#8A2BE2", "#FF8C00"][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      {/* Burst of Light Animation (shows on initial load or level up) */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-purple-500/0 via-yellow-300/20 to-pink-500/0 rounded-3xl",
          "opacity-0 transition-opacity duration-1000",
          showAnimation && "opacity-100",
        )}
      />

      {/* Title Content */}
      <div className="relative z-10 text-center px-4">
        {/* Dynamic Title based on level */}
        <h1
          className={cn(
            "text-5xl md:text-6xl font-bold mb-3",
            "bg-gradient-to-r from-purple-400 via-pink-500 to-amber-400 bg-clip-text text-transparent",
            "animate-gradient-x",
            "drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]",
          )}
        >
          {recentLevelUp ? (
            <span className="inline-flex items-center">
              You're Crushing It, Level {level} Champ!{" "}
              <Trophy className="h-10 w-10 ml-2 text-yellow-400 animate-bounce" />
            </span>
          ) : (
            <span className="inline-flex items-center">
              Your Rewards <Trophy className="h-10 w-10 ml-2 text-yellow-400 animate-pulse" />
            </span>
          )}
        </h1>

        {/* Flying Stars Animation */}
        <div
          className={cn(
            "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
            "opacity-0 transition-opacity duration-500",
            showAnimation && "opacity-100",
          )}
        >
          <Star className="absolute h-6 w-6 text-yellow-400 animate-fly-up-1" />
          <Sparkles className="absolute h-6 w-6 text-blue-400 animate-fly-up-2" />
          <Star className="absolute h-6 w-6 text-pink-400 animate-fly-up-3" />
        </div>

        {/* Updated Level and Progress Section */}
        <div className="mt-4 max-w-md mx-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center mb-2 cursor-help">
                  <div className="text-lg font-medium">Level {level} – Explorer</div>
                  <div className="ml-2 text-sm text-gray-400">
                    {currentXP} / {nextLevelXP} XP to next level
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Earn {nextLevelXP - currentXP} more XP to reach Level {level + 1}!
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Progress
            value={progressValue}
            className="h-2 bg-gray-700/50"
            indicatorClassName="bg-gradient-to-r from-indigo-500 to-purple-600"
          />
        </div>
      </div>
    </div>
  )
}
