"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Flame,
  Star,
  Trophy,
  Sparkles,
  ShoppingBag,
  Package,
  Calendar,
  Gift,
  Medal,
  Clock,
  Brain,
  Filter,
  ChevronRight,
  Zap,
  Palette,
} from "lucide-react"
import { RewardsHeader } from "@/components/student/rewards-header"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function StudentRewards() {
  const [activeTab, setActiveTab] = useState("xp")
  const [showConfetti, setShowConfetti] = useState(false)
  const [progressValue, setProgressValue] = useState(0)
  const [rewardClaimed, setRewardClaimed] = useState(false)
  const [isRewardOpen, setIsRewardOpen] = useState(false)
  const [filterValue, setFilterValue] = useState("today")

  // Sample data
  const level = 5
  const currentXP = 450
  const nextLevelXP = 600
  const progress = (currentXP / nextLevelXP) * 100
  const totalXP = 450
  const todayXP = 75
  const weekXP = 210
  const streak = 5
  const coins = 120
  const recentLevelUp = false // Set to true to show level up celebration
  const hasUnclaimedReward = true // Set to true if user has a reward to claim

  // Animate progress bar on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressValue(progress)
    }, 500)
    return () => clearTimeout(timer)
  }, [progress])

  // Show confetti animation when component mounts if user has unclaimed reward
  useEffect(() => {
    if (hasUnclaimedReward && !rewardClaimed) {
      setShowConfetti(true)
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [hasUnclaimedReward, rewardClaimed])

  const recentXP = [
    { id: 1, activity: "Completed Math Assignment", date: "Today", xp: 15, type: "assignment" },
    { id: 2, activity: "Daily Check-in", date: "Today", xp: 10, type: "daily" },
    { id: 3, activity: "Reflection Journal Entry", date: "Yesterday", xp: 20, type: "reflection" },
    { id: 4, activity: "Science Quiz", date: "Yesterday", xp: 25, type: "assignment" },
    { id: 5, activity: "5-Day Streak Bonus", date: "Today", xp: 50, type: "streak" },
  ]

  const achievements = [
    {
      id: 1,
      icon: <Trophy className="h-8 w-8 text-yellow-400" />,
      title: "Quiz Pro",
      description: "Complete 20 quizzes",
      progress: 15,
      total: 20,
      unlocked: false,
    },
    {
      id: 2,
      icon: <Flame className="h-8 w-8 text-orange-400" />,
      title: "Streak King",
      description: "Maintain a 7-day streak",
      progress: 5,
      total: 7,
      unlocked: false,
    },
    {
      id: 3,
      icon: <Brain className="h-8 w-8 text-purple-400" />,
      title: "XP Monster",
      description: "Earn 1000 XP total",
      progress: 450,
      total: 1000,
      unlocked: false,
    },
    {
      id: 4,
      icon: <Clock className="h-8 w-8 text-blue-400" />,
      title: "Early Bird",
      description: "Log in before 8 AM",
      progress: 1,
      total: 1,
      unlocked: true,
    },
    {
      id: 5,
      icon: <Star className="h-8 w-8 text-amber-400" />,
      title: "Perfect Score",
      description: "Get 100% on any quiz",
      progress: 1,
      total: 1,
      unlocked: true,
    },
    {
      id: 6,
      icon: <Sparkles className="h-8 w-8 text-indigo-400" />,
      title: "Reflection Master",
      description: "Complete 10 reflections",
      progress: 3,
      total: 10,
      unlocked: false,
    },
  ]

  const marketplaceItems = [
    {
      id: 1,
      icon: <Zap className="h-6 w-6 text-yellow-400" />,
      title: "Limited Time: Booster Pack",
      price: 250,
      limited: true,
    },
    {
      id: 2,
      icon: "🧢",
      title: "Neon Headband",
      price: 100,
      limited: false,
    },
    {
      id: 3,
      icon: <Palette className="h-6 w-6 text-purple-400" />,
      title: "Avatar Background: Galaxy",
      price: 200,
      limited: false,
    },
  ]

  const bonusOpportunities = [
    {
      id: 1,
      icon: <Sparkles className="h-5 w-5 text-yellow-400" />,
      title: "Double XP on Assignments",
      description: "This Friday",
    },
    {
      id: 2,
      icon: <Flame className="h-5 w-5 text-orange-400" />,
      title: "+30 XP Streak Bonus",
      description: "Log in tomorrow",
    },
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case "assignment":
        return <div className="mr-2 text-green-400">✅</div>
      case "reflection":
        return <div className="mr-2 text-blue-400">💬</div>
      case "daily":
        return <div className="mr-2 text-amber-400">🎯</div>
      case "streak":
        return <div className="mr-2 text-orange-400">🔥</div>
      default:
        return <div className="mr-2 text-purple-400">✨</div>
    }
  }

  const handleClaimReward = () => {
    setIsRewardOpen(true)
  }

  const handleCloseReward = () => {
    setIsRewardOpen(false)
    setRewardClaimed(true)
    setShowConfetti(false)
  }

  const filteredXP = recentXP.filter((item) => {
    if (filterValue === "today") return item.date === "Today"
    if (filterValue === "week") return true // In a real app, this would filter by this week
    return true // Default to showing all
  })

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Status Bar */}
      <div className="flex justify-end items-center mb-4 gap-4">
        <div className="flex items-center bg-black/20 rounded-full px-3 py-1">
          <Sparkles className="h-4 w-4 mr-1 text-yellow-400" />
          <span className="text-sm font-medium">{totalXP} XP</span>
        </div>
        <div className="flex items-center bg-black/20 rounded-full px-3 py-1">
          <Star className="h-4 w-4 mr-1 text-amber-400" />
          <span className="text-sm font-medium">{coins} Coins</span>
        </div>
        <div className="flex items-center bg-black/20 rounded-full px-3 py-1">
          <Flame className="h-4 w-4 mr-1 text-orange-400 animate-pulse" />
          <span className="text-sm font-medium">{streak} Day Streak</span>
        </div>
      </div>

      {/* Enhanced Rewards Header */}
      <RewardsHeader level={level} totalXP={totalXP} recentLevelUp={recentLevelUp} />

      {/* Main Content */}
      <Tabs defaultValue="xp" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6 bg-gray-800/50 p-1 rounded-full">
          <TabsTrigger
            value="xp"
            className={`flex items-center rounded-full px-4 py-2 transition-all ${
              activeTab === "xp" ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white" : "hover:bg-gray-700/50"
            }`}
          >
            <Sparkles className="h-4 w-4 mr-2" /> XP & Level
          </TabsTrigger>
          <TabsTrigger
            value="streaks"
            className={`flex items-center rounded-full px-4 py-2 transition-all ${
              activeTab === "streaks"
                ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                : "hover:bg-gray-700/50"
            }`}
          >
            <Flame className="h-4 w-4 mr-2" /> Streaks
          </TabsTrigger>
          <TabsTrigger
            value="badges"
            className={`flex items-center rounded-full px-4 py-2 transition-all ${
              activeTab === "badges"
                ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white"
                : "hover:bg-gray-700/50"
            }`}
          >
            <Trophy className="h-4 w-4 mr-2" /> Badges
          </TabsTrigger>
          <TabsTrigger
            value="marketplace"
            className={`flex items-center rounded-full px-4 py-2 transition-all ${
              activeTab === "marketplace"
                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                : "hover:bg-gray-700/50"
            }`}
          >
            <ShoppingBag className="h-4 w-4 mr-2" /> Marketplace
          </TabsTrigger>
          <TabsTrigger
            value="inventory"
            className={`flex items-center rounded-full px-4 py-2 transition-all ${
              activeTab === "inventory"
                ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white"
                : "hover:bg-gray-700/50"
            }`}
          >
            <Package className="h-4 w-4 mr-2" /> Inventory
          </TabsTrigger>
        </TabsList>

        <TabsContent value="xp" className="space-y-6">
          {/* Level Card - Updated with tooltip */}
          <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-gray-200">Current Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="text-5xl font-bold mr-2 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent animate-bounce-subtle">
                    {level}
                  </div>
                  <div className="text-gray-400">Explorer</div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-right cursor-help">
                        <div className="text-sm text-gray-400 mb-1">
                          {currentXP} / {nextLevelXP} XP to next level
                        </div>
                        <div className="flex items-center">
                          <Sparkles className="h-4 w-4 mr-1 text-purple-400" />
                          <span>
                            Need {nextLevelXP - currentXP} more XP for Level {level + 1}
                          </span>
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
              </div>
              <Progress
                value={progressValue}
                className="h-2 bg-gray-700"
                indicatorClassName="bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse-subtle"
              />
            </CardContent>
          </Card>

          {/* NEW: Claimable Rewards Widget */}
          <Card className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-0 shadow-lg overflow-hidden relative">
            <CardHeader>
              <CardTitle className="text-xl text-gray-200 flex items-center">
                <Gift className="h-5 w-5 mr-2 text-pink-400" /> Claim Your Rewards!
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasUnclaimedReward && !rewardClaimed ? (
                <div className="text-center py-4">
                  {showConfetti && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {Array.from({ length: 50 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute bottom-0 w-2 h-2 rounded-full animate-confetti"
                          style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            backgroundColor: ["#FFD700", "#FF3366", "#36CFFF", "#8A2BE2", "#FF8C00"][
                              Math.floor(Math.random() * 5)
                            ],
                          }}
                        />
                      ))}
                    </div>
                  )}
                  <div className="mb-4 text-lg font-medium">You've reached a new milestone!</div>
                  <Button
                    onClick={handleClaimReward}
                    size="lg"
                    className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white border-0 shadow-lg hover:shadow-amber-700/20 transition-all animate-pulse"
                  >
                    <Gift className="h-5 w-5 mr-2" /> Open Mystery Box
                  </Button>

                  <Dialog open={isRewardOpen} onOpenChange={setIsRewardOpen}>
                    <DialogContent className="bg-gradient-to-br from-gray-900 to-gray-800 border-0 shadow-xl max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl text-center mb-2">
                          <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                            Reward Unlocked!
                          </span>
                        </DialogTitle>
                        <DialogDescription className="text-center text-gray-400">
                          Congratulations on your achievement!
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col items-center justify-center py-6 space-y-6">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 rounded-full animate-ping" />
                          <div className="relative bg-gradient-to-r from-yellow-500 to-amber-600 p-6 rounded-full">
                            <Star className="h-12 w-12 text-white animate-bounce-subtle" />
                          </div>
                        </div>
                        <div className="text-center space-y-3">
                          <div className="text-xl font-bold">🎉 You received 50 Coins!</div>
                          <div className="text-lg">✨ Unlocked: Gold Notebook Avatar Frame!</div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={handleCloseReward}
                          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                        >
                          Awesome!
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-gray-500 italic">Keep learning to unlock your next prize!</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* NEW: Achievement Badges Grid */}
          <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-gray-200 flex items-center">
                <Medal className="h-5 w-5 mr-2 text-yellow-400" /> Your Achievements
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Filter className="h-4 w-4" /> Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>All</DropdownMenuItem>
                  <DropdownMenuItem>Unlocked</DropdownMenuItem>
                  <DropdownMenuItem>Locked</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`rounded-lg p-4 transition-all ${
                      achievement.unlocked
                        ? "bg-gradient-to-br from-gray-700/50 to-gray-800/50 hover:shadow-lg hover:shadow-yellow-600/10 border border-yellow-600/20"
                        : "bg-gray-800/30 border border-gray-700/30"
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`rounded-full p-3 mb-3 ${
                          achievement.unlocked ? "bg-yellow-500/20 animate-pulse-subtle" : "bg-gray-700/30"
                        }`}
                      >
                        {achievement.icon}
                      </div>
                      <h3 className={`font-medium mb-1 ${achievement.unlocked ? "text-white" : "text-gray-400"}`}>
                        {achievement.title}
                      </h3>
                      <p className="text-xs text-gray-400 mb-2">{achievement.description}</p>
                      <div className="w-full bg-gray-700/50 rounded-full h-1.5 mb-1">
                        <div
                          className={`h-1.5 rounded-full ${
                            achievement.unlocked ? "bg-gradient-to-r from-yellow-400 to-amber-500" : "bg-gray-600"
                          }`}
                          style={{
                            width: `${Math.min(100, (achievement.progress / achievement.total) * 100)}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {achievement.progress}/{achievement.total}
                      </p>
                      {achievement.unlocked && (
                        <Badge className="mt-2 bg-gradient-to-r from-yellow-400 to-amber-500 border-0">Unlocked</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* NEW: Marketplace Preview */}
          <Card className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-gray-200 flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2 text-emerald-400" /> New in the Marketplace
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {marketplaceItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg p-4 border border-emerald-900/20 hover:shadow-lg hover:shadow-emerald-900/10 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        {typeof item.icon === "string" ? (
                          <div className="text-2xl mr-2">{item.icon}</div>
                        ) : (
                          <div className="mr-2">{item.icon}</div>
                        )}
                        <div className="font-medium">{item.title}</div>
                      </div>
                      {item.limited && (
                        <Badge className="bg-gradient-to-r from-red-500 to-orange-500 border-0 text-xs">Limited</Badge>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>{item.price} Coins</span>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs">
                        Buy
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Button
                  variant="outline"
                  className="bg-transparent border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/30 hover:text-emerald-300"
                >
                  Open Marketplace <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* NEW: Upcoming Bonuses */}
          <Card className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-gray-200 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-400" /> Bonus Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bonusOpportunities.map((bonus) => (
                  <div
                    key={bonus.id}
                    className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg p-4 border border-blue-900/20 hover:translate-x-1 transition-all"
                  >
                    <div className="flex items-center">
                      <div className="mr-3 bg-blue-900/30 p-2 rounded-full">{bonus.icon}</div>
                      <div>
                        <div className="font-medium">{bonus.title}</div>
                        <div className="text-xs text-gray-400">{bonus.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent XP - Enhanced with filter */}
          <Card className="bg-gray-800/50 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-gray-200">Recent XP Earned</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Calendar className="h-4 w-4" /> {filterValue === "today" ? "Today" : "This Week"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterValue("today")}>Today</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterValue("week")}>This Week</DropdownMenuItem>
                  <DropdownMenuItem>Custom Range</DropdownMenuItem>
                  <DropdownMenuItem>By Type</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredXP.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all hover:translate-x-1 ${
                    index % 2 === 0
                      ? "bg-gradient-to-r from-gray-800/30 to-gray-700/30"
                      : "bg-gradient-to-r from-gray-800/50 to-gray-700/50"
                  }`}
                >
                  <div className="flex items-center">
                    {getActivityIcon(item.type)}
                    <div>
                      <div className="font-medium">{item.activity}</div>
                      <div className="text-xs text-gray-400">{item.date}</div>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-purple-500/80 to-indigo-500/80 hover:from-purple-500 hover:to-indigo-500 border-0 px-3 py-1 flex items-center shadow-md hover:shadow-purple-500/20 transition-all">
                    <Sparkles className="h-3 w-3 mr-1" /> +{item.xp} XP
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="streaks">
          <Card className="bg-gray-800/50 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-gray-200">Your Streaks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Flame className="h-16 w-16 mx-auto text-orange-500 mb-4 animate-pulse" />
                <h3 className="text-2xl font-bold mb-2">🔥 {streak}-Day Streak!</h3>
                <p className="text-gray-400 mb-4">Keep it up! You're on fire!</p>
                <div className="bg-gray-700/50 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-sm text-gray-300">Next streak reward in 2 days:</p>
                  <div className="flex items-center justify-center mt-2 gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="font-medium">+25 Coins</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges">
          <Card className="bg-gray-800/50 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-gray-200">Your Badges</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Filter className="h-4 w-4" /> All Badges
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>All</DropdownMenuItem>
                  <DropdownMenuItem>Unlocked</DropdownMenuItem>
                  <DropdownMenuItem>Locked</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-700/50 rounded-lg p-4 text-center hover:bg-gray-700/70 transition-all">
                  <div className="bg-yellow-500/20 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                  </div>
                  <h3 className="font-medium mb-1">First Steps</h3>
                  <p className="text-xs text-gray-400">Completed first assignment</p>
                  <Badge className="mt-2 bg-gradient-to-r from-yellow-400 to-amber-500 border-0">Unlocked</Badge>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4 text-center hover:bg-gray-700/70 transition-all">
                  <div className="bg-blue-500/20 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Flame className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="font-medium mb-1">Streak Master</h3>
                  <p className="text-xs text-gray-400">Maintained a 5-day streak</p>
                  <Badge className="mt-2 bg-gradient-to-r from-yellow-400 to-amber-500 border-0">Unlocked</Badge>
                </div>
                {/* Placeholder for locked badges */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-gray-700/20 rounded-lg p-4 text-center border border-dashed border-gray-600 cursor-help">
                        <div className="bg-gray-600/20 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-3">
                          <Brain className="h-8 w-8 text-gray-500" />
                        </div>
                        <h3 className="font-medium mb-1">Quiz Pro</h3>
                        <p className="text-xs text-gray-400">Complete 20 quizzes</p>
                        <Badge className="mt-2 bg-gray-600 border-0">15/20 Complete</Badge>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Complete 5 more quizzes to unlock this badge!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-gray-700/20 rounded-lg p-4 text-center border border-dashed border-gray-600 cursor-help">
                        <div className="bg-gray-600/20 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-3">
                          <Clock className="h-8 w-8 text-gray-500" />
                        </div>
                        <h3 className="font-medium mb-1">Early Riser</h3>
                        <p className="text-xs text-gray-400">Log in before 8 AM</p>
                        <Badge className="mt-2 bg-gray-600 border-0">Locked</Badge>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Log in before 8 AM to unlock this badge!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace">
          <Card className="bg-gray-800/50 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-gray-200">Rewards Marketplace</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-lg p-4 border border-green-900/30 hover:shadow-lg hover:shadow-green-900/10 transition-all">
                  <h3 className="font-medium mb-2">Extra Break Time</h3>
                  <p className="text-sm text-gray-400 mb-3">Get 15 minutes of extra break time</p>
                  <div className="flex justify-between items-center">
                    <Badge className="bg-green-600/80 hover:bg-green-600 border-0">
                      <Star className="h-3 w-3 mr-1" /> 50 Coins
                    </Badge>
                    <Button size="sm" variant="outline" className="text-xs">
                      Redeem
                    </Button>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-lg p-4 border border-blue-900/30 hover:shadow-lg hover:shadow-blue-900/10 transition-all">
                  <h3 className="font-medium mb-2">Choose Next Activity</h3>
                  <p className="text-sm text-gray-400 mb-3">Pick your next learning activity</p>
                  <div className="flex justify-between items-center">
                    <Badge className="bg-blue-600/80 hover:bg-blue-600 border-0">
                      <Star className="h-3 w-3 mr-1" /> 75 Coins
                    </Badge>
                    <Button size="sm" variant="outline" className="text-xs">
                      Redeem
                    </Button>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-lg p-4 border border-purple-900/30 hover:shadow-lg hover:shadow-purple-900/10 transition-all">
                  <h3 className="font-medium mb-2">Digital Avatar Item</h3>
                  <p className="text-sm text-gray-400 mb-3">Unlock a special item for your avatar</p>
                  <div className="flex justify-between items-center">
                    <Badge className="bg-purple-600/80 hover:bg-purple-600 border-0">
                      <Star className="h-3 w-3 mr-1" /> 100 Coins
                    </Badge>
                    <Button size="sm" variant="outline" className="text-xs">
                      Redeem
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card className="bg-gray-800/50 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-gray-200">Your Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">Your inventory is empty</h3>
                <p className="text-gray-400 mb-4">Redeem rewards from the marketplace to see them here!</p>
                <Button variant="outline" className="mx-auto">
                  <ShoppingBag className="h-4 w-4 mr-2" /> Go to Marketplace
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
