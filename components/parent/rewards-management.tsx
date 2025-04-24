"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Clock, Edit2, Gift, Plus, Repeat, Trash2, Flame, Coins } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import Confetti from "react-confetti"
import { useWindowSize } from "@/hooks/use-mobile"

// Sample data
const students = [
  { id: 1, name: "Enoch", coins: 120, streak: 7 },
  { id: 2, name: "Sarah", coins: 180, streak: 12 },
  { id: 3, name: "Benjamin", coins: 85, streak: 3 },
]

const initialCustomRewards = [
  { id: 1, name: "Extra Screen Time", description: "30 minutes of additional screen time", cost: 50, icon: "🎮" },
  { id: 2, name: "Choose Dinner", description: "Pick what's for dinner one night", cost: 75, icon: "🍕" },
  { id: 3, name: "Movie Night", description: "Pick a movie for family movie night", cost: 100, icon: "🎬" },
  { id: 4, name: "New Book", description: "Get a new book of your choice", cost: 150, icon: "📚" },
]

const habitTypes = [
  { id: 1, name: "Habits", description: "Things to do regularly", icon: <Repeat className="h-5 w-5" /> },
  { id: 2, name: "Dailies", description: "Tasks to complete each day", icon: <Clock className="h-5 w-5" /> },
  { id: 3, name: "To-Dos", description: "One-time tasks to complete", icon: <CheckCircle className="h-5 w-5" /> },
]

export function RewardsManagement() {
  // Add state for confetti effect
  const [showConfetti, setShowConfetti] = useState(false)
  const { width, height } = useWindowSize()
  const [activeTab, setActiveTab] = useState("rewards")
  const [customRewards, setCustomRewards] = useState(initialCustomRewards)
  const [newReward, setNewReward] = useState({ name: "", description: "", cost: "", icon: "" })
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [studentData, setStudentData] = useState(students)
  const [adjustStreakStudent, setAdjustStreakStudent] = useState(null)
  const [streakValue, setStreakValue] = useState("")
  const [deleteRewardId, setDeleteRewardId] = useState(null)
  const { toast } = useToast()

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setNewReward({ ...newReward, [id.replace("reward-", "")]: value })
  }

  const handleCreateReward = () => {
    if (!newReward.name || !newReward.cost) return

    const rewardToAdd = {
      id: isEditing ? editingId : Date.now(),
      name: newReward.name,
      description: newReward.description,
      cost: Number.parseInt(newReward.cost),
      icon: newReward.icon || "🎁",
    }

    if (isEditing) {
      setCustomRewards(customRewards.map((reward) => (reward.id === editingId ? rewardToAdd : reward)))
      setSuccessMessage(`✨ '${rewardToAdd.name}' has been updated!`)
    } else {
      setCustomRewards([...customRewards, rewardToAdd])
      setSuccessMessage(`🎉 '${rewardToAdd.name}' has been added!`)
      // Trigger confetti for new rewards
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }

    setShowSuccess(true)
    setNewReward({ name: "", description: "", cost: "", icon: "" })
    setIsEditing(false)
    setEditingId(null)

    setTimeout(() => {
      setShowSuccess(false)
    }, 3000)
  }

  const handleEditReward = (reward) => {
    setNewReward({
      name: reward.name,
      description: reward.description,
      cost: reward.cost.toString(),
      icon: reward.icon,
    })
    setIsEditing(true)
    setEditingId(reward.id)
  }

  const handleDeleteReward = (id) => {
    setCustomRewards(customRewards.filter((reward) => reward.id !== id))
    setDeleteRewardId(null)
    toast({
      title: "Reward deleted",
      description: "The reward has been removed successfully.",
      variant: "default",
    })
  }

  const handleSaveTaskType = (typeId) => {
    toast({
      title: "Task type saved",
      description: "Task type settings have been saved successfully.",
      variant: "default",
    })
  }

  const handleAdjustStreak = (student) => {
    const updatedStudents = studentData.map((s) => {
      if (s.id === student.id) {
        return { ...s, streak: Number.parseInt(streakValue) }
      }
      return s
    })
    setStudentData(updatedStudents)
    setAdjustStreakStudent(null)
    setStreakValue("")
    toast({
      title: "Streak adjusted",
      description: `${student.name}'s streak has been updated to ${streakValue} days.`,
      variant: "default",
    })
  }

  const handleResetStreak = (student) => {
    const updatedStudents = studentData.map((s) => {
      if (s.id === student.id) {
        return { ...s, streak: 0 }
      }
      return s
    })
    setStudentData(updatedStudents)
    toast({
      title: "Streak reset",
      description: `${student.name}'s streak has been reset to 0 days.`,
      variant: "default",
    })
  }

  const handleAddCoins = (student, amount) => {
    if (!amount) return

    const updatedStudents = studentData.map((s) => {
      if (s.id === student.id) {
        return { ...s, coins: s.coins + Number.parseInt(amount) }
      }
      return s
    })
    setStudentData(updatedStudents)

    toast({
      title: "Coins added",
      description: `Added ${amount} coins to ${student.name}.`,
      variant: "default",
    })

    // Reset the input field
    document.getElementById(`${student.name.toLowerCase()}-add-coins`).value = ""
  }

  const handleRemoveCoins = (student, amount) => {
    if (!amount) return

    const updatedStudents = studentData.map((s) => {
      if (s.id === student.id) {
        return { ...s, coins: Math.max(0, s.coins - Number.parseInt(amount)) }
      }
      return s
    })
    setStudentData(updatedStudents)

    toast({
      title: "Coins removed",
      description: `Removed ${amount} coins from ${student.name}.`,
      variant: "default",
    })

    // Reset the input field
    document.getElementById(`${student.name.toLowerCase()}-remove-coins`).value = ""
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Rewards Management</h2>
      </div>

      {showSuccess && (
        <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-3 rounded-md mb-4 flex items-center gap-2 animate-in fade-in slide-in-from-top-5 duration-300">
          <CheckCircle className="h-5 w-5" />
          <span>{successMessage}</span>
        </div>
      )}

      <Tabs defaultValue="rewards" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 h-auto p-1 rounded-full bg-muted/80 backdrop-blur-sm">
          <TabsTrigger
            value="rewards"
            className="py-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300 flex items-center gap-2 justify-center"
          >
            <Gift className="h-4 w-4" /> 🎁 Custom Rewards
          </TabsTrigger>
          <TabsTrigger
            value="tasks"
            className="py-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white transition-all duration-300 flex items-center gap-2 justify-center"
          >
            <CheckCircle className="h-4 w-4" /> 📝 Task Types
          </TabsTrigger>
          <TabsTrigger
            value="streaks"
            className="py-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white transition-all duration-300 flex items-center gap-2 justify-center"
          >
            <Flame className="h-4 w-4" /> 🔥 Streak Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="coins"
            className="py-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white transition-all duration-300 flex items-center gap-2 justify-center"
          >
            <Coins className="h-4 w-4" /> 💰 Coin Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rewards" className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <Button variant="outline" size="sm" className="rounded-full bg-primary/5 hover:bg-primary/10">
              All Rewards
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              Available
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              Locked
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              Redeemed
            </Button>
          </div>
          <Card className="border-primary/20">
            <CardHeader className="bg-gradient-to-r from-pink-100/70 via-purple-100/50 to-transparent dark:from-pink-900/30 dark:via-purple-900/20 rounded-t-xl">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Gift className="h-6 w-6 text-pink-500 dark:text-pink-400" /> 🎁 Custom Rewards Builder
              </CardTitle>
              <CardDescription>Create and manage rewards that students can purchase with coins</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reward-name">Reward Name</Label>
                    <Input
                      id="reward-name"
                      placeholder="Enter reward name"
                      value={newReward.name}
                      onChange={handleInputChange}
                      className="transition-all focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reward-description">Description</Label>
                    <Textarea
                      id="reward-description"
                      placeholder="Describe the reward"
                      value={newReward.description}
                      onChange={handleInputChange}
                      className="transition-all focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reward-cost">Cost (Coins)</Label>
                    <Input
                      id="reward-cost"
                      type="number"
                      placeholder="Enter coin cost"
                      value={newReward.cost}
                      onChange={handleInputChange}
                      className="transition-all focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reward-icon">Icon (Emoji)</Label>
                    <Input
                      id="reward-icon"
                      placeholder="Enter an emoji"
                      value={newReward.icon}
                      onChange={handleInputChange}
                      className="transition-all focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <Button
                    onClick={handleCreateReward}
                    disabled={!newReward.name || !newReward.cost}
                    className="relative overflow-hidden group transition-all hover:shadow-md"
                  >
                    <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300 opacity-30"></div>
                    {isEditing ? (
                      <>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Update Reward
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Reward
                      </>
                    )}
                  </Button>
                  {isEditing && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false)
                        setEditingId(null)
                        setNewReward({ name: "", description: "", cost: "", icon: "" })
                      }}
                      className="mt-2"
                    >
                      Cancel Editing
                    </Button>
                  )}
                </div>

                <div>
                  <h3 className="font-medium mb-4">Current Rewards</h3>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {customRewards.map((reward) => (
                      <div
                        key={reward.id}
                        className="flex items-center justify-between border rounded-xl p-4 transition-all hover:border-primary/30 hover:shadow-md group bg-gradient-to-br from-pink-50/50 to-transparent dark:from-pink-900/10"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-3xl transform transition-transform group-hover:scale-125 group-hover:rotate-12">
                            {reward.icon}
                          </div>
                          <div>
                            <p className="font-medium">{reward.name}</p>
                            <p className="text-sm text-muted-foreground">{reward.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="bg-gradient-to-r from-primary/5 to-pink-100/30 dark:from-primary/10 dark:to-pink-900/20 group-hover:from-primary/10 group-hover:to-pink-100/50 dark:group-hover:from-primary/15 dark:group-hover:to-pink-900/30 transition-colors border-pink-200 dark:border-pink-800"
                          >
                            <span className="mr-1">💰</span> {reward.cost} coins
                          </Badge>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditReward(reward)}
                                  className="opacity-70 hover:opacity-100 transition-opacity"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit reward</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <Dialog
                            open={deleteRewardId === reward.id}
                            onOpenChange={(open) => !open && setDeleteRewardId(null)}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteRewardId(reward.id)}
                                className="opacity-70 hover:opacity-100 transition-opacity text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Delete Reward</DialogTitle>
                                <DialogDescription>Are you sure you want to delete '{reward.name}'?</DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="flex justify-between sm:justify-between">
                                <Button variant="outline" onClick={() => setDeleteRewardId(null)}>
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleDeleteReward(reward.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Yes, Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card className="border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent rounded-t-lg">
              <CardTitle>Task Types</CardTitle>
              <CardDescription>Configure different types of tasks for your students</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-3">
                {habitTypes.map((type) => (
                  <Card key={type.id} className="border-primary/20 transition-all hover:shadow-md">
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                      <CardTitle className="flex items-center gap-2">
                        {type.icon}
                        {type.name}
                      </CardTitle>
                      <CardDescription>{type.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`${type.name.toLowerCase()}-coin-value`}>Coin Value</Label>
                          <Input
                            id={`${type.name.toLowerCase()}-coin-value`}
                            type="number"
                            defaultValue={type.name === "Habits" ? 3 : type.name === "Dailies" ? 5 : 10}
                            className="transition-all focus:ring-2 focus:ring-primary/30"
                          />
                          <p className="text-xs text-muted-foreground">Coins earned for completing this task type</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${type.name.toLowerCase()}-xp-value`}>XP Value</Label>
                          <Input
                            id={`${type.name.toLowerCase()}-xp-value`}
                            type="number"
                            defaultValue={type.name === "Habits" ? 10 : type.name === "Dailies" ? 15 : 25}
                            className="transition-all focus:ring-2 focus:ring-primary/30"
                          />
                          <p className="text-xs text-muted-foreground">XP earned for completing this task type</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full relative overflow-hidden group"
                        onClick={() => handleSaveTaskType(type.id)}
                      >
                        <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300 opacity-20"></div>
                        Save Settings
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="streaks" className="space-y-4">
          <Card className="border-primary/20 rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-100/70 via-yellow-100/50 to-transparent dark:from-amber-900/30 dark:via-yellow-900/20 rounded-t-xl">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Flame className="h-6 w-6 text-amber-500 dark:text-amber-400" /> 🔥 Streak Dashboard
              </CardTitle>
              <CardDescription>Monitor and manage student streaks</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {studentData.map((student) => (
                  <div
                    key={student.id}
                    className="border rounded-xl p-4 transition-all hover:border-amber-300 hover:shadow-md bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-900/10"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">{student.name}</h3>
                      <Badge className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-300 text-white px-3 py-1">
                        <Flame className="h-3 w-3" />
                        {student.streak} Day Streak
                      </Badge>
                    </div>

                    {/* Add XP progress bar with milestones */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>0 days</span>
                        <span>7 days</span>
                        <span>14 days</span>
                        <span>30 days</span>
                      </div>
                      <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                          style={{ width: `${Math.min(100, (student.streak / 30) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        {[7, 14, 30].map((milestone) => (
                          <div
                            key={milestone}
                            className={`flex flex-col items-center transition-opacity duration-300 ${
                              student.streak >= milestone ? "opacity-100" : "opacity-50"
                            }`}
                            style={{ marginLeft: `${(milestone / 30) * 100}%`, transform: "translateX(-50%)" }}
                          >
                            <div
                              className={`w-3 h-3 rounded-full ${
                                student.streak >= milestone ? "bg-yellow-400 animate-pulse" : "bg-muted"
                              }`}
                            ></div>
                            {student.streak >= milestone && (
                              <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                                {milestone === 7 ? "🥉" : milestone === 14 ? "🥈" : "🥇"}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-10 rounded-md flex items-center justify-center transition-all ${
                            i < student.streak
                              ? "bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/30 text-green-800 dark:text-green-300"
                              : "bg-muted"
                          }`}
                        >
                          {i < student.streak && <CheckCircle className="h-5 w-5" />}
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between mt-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="relative overflow-hidden group">
                            <div className="absolute inset-0 w-3 bg-gradient-to-r from-red-500 to-red-300 group-hover:w-full transition-all duration-300 opacity-20"></div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    Reset Streak
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>This will reset the streak for this student to 0.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Reset Streak</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to reset this streak? This will set {student.name}'s streak to 0
                              days.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="flex justify-between sm:justify-between">
                            <Button variant="outline" onClick={() => {}}>
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleResetStreak(student)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Yes, Reset
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog
                        open={adjustStreakStudent?.id === student.id}
                        onOpenChange={(open) => !open && setAdjustStreakStudent(null)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAdjustStreakStudent(student)}
                            className="relative overflow-hidden group"
                          >
                            <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300 opacity-20"></div>
                            Adjust Streak
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Adjust Streak</DialogTitle>
                            <DialogDescription>Set a new streak value for {student.name}.</DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <div className="space-y-2">
                              <Label htmlFor="streak-value">Streak Days</Label>
                              <Input
                                id="streak-value"
                                type="number"
                                min="0"
                                value={streakValue}
                                onChange={(e) => setStreakValue(e.target.value)}
                                className="transition-all focus:ring-2 focus:ring-primary/30"
                              />
                            </div>
                          </div>
                          <DialogFooter className="flex justify-between sm:justify-between">
                            <Button variant="outline" onClick={() => setAdjustStreakStudent(null)}>
                              Cancel
                            </Button>
                            <Button
                              onClick={() => handleAdjustStreak(student)}
                              disabled={!streakValue}
                              className="relative overflow-hidden group"
                            >
                              <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300 opacity-20"></div>
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coins" className="space-y-4">
          <Card className="border-primary/20 rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-100/70 via-emerald-100/50 to-transparent dark:from-green-900/30 dark:via-emerald-900/20 rounded-t-xl">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Coins className="h-6 w-6 text-green-500 dark:text-green-400" /> 💰 Coin Management
              </CardTitle>
              <CardDescription>Manage student coin balances and transactions</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {studentData.map((student) => (
                  <div
                    key={student.id}
                    className="border rounded-xl p-4 transition-all hover:border-green-300 hover:shadow-md bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-900/10"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">{student.name}</h3>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 bg-gradient-to-r from-amber-100/50 to-yellow-100/50 dark:from-amber-900/30 dark:to-yellow-900/30 border-amber-200 dark:border-amber-800 px-3 py-1"
                      >
                        <Coins className="h-3 w-3 text-amber-500 dark:text-amber-400" />
                        <span className="text-amber-700 dark:text-amber-300 font-bold">{student.coins}</span> Coins
                      </Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`${student.name.toLowerCase()}-add-coins`}>Add Coins</Label>
                        <div className="flex gap-2">
                          <Input
                            id={`${student.name.toLowerCase()}-add-coins`}
                            type="number"
                            placeholder="Amount"
                            className="transition-all focus:ring-2 focus:ring-primary/30"
                          />
                          <Button
                            onClick={() =>
                              handleAddCoins(
                                student,
                                document.getElementById(`${student.name.toLowerCase()}-add-coins`).value,
                              )
                            }
                            className="relative overflow-hidden group"
                          >
                            <div className="absolute inset-0 w-3 bg-gradient-to-r from-green-500 to-green-300 group-hover:w-full transition-all duration-300 opacity-20"></div>
                            Add
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${student.name.toLowerCase()}-remove-coins`}>Remove Coins</Label>
                        <div className="flex gap-2">
                          <Input
                            id={`${student.name.toLowerCase()}-remove-coins`}
                            type="number"
                            placeholder="Amount"
                            className="transition-all focus:ring-2 focus:ring-primary/30"
                          />
                          <Button
                            variant="outline"
                            onClick={() =>
                              handleRemoveCoins(
                                student,
                                document.getElementById(`${student.name.toLowerCase()}-remove-coins`).value,
                              )
                            }
                            className="relative overflow-hidden group"
                          >
                            <div className="absolute inset-0 w-3 bg-gradient-to-r from-red-500 to-red-300 group-hover:w-full transition-all duration-300 opacity-20"></div>
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label>Recent Transactions</Label>
                      <div className="mt-2 space-y-2 text-sm">
                        <div className="flex justify-between border-b pb-2">
                          <span>Completed Math assignment</span>
                          <span className="text-green-600 dark:text-green-400">+10 coins</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span>Purchased "Extra Screen Time"</span>
                          <span className="text-red-600 dark:text-red-400">-50 coins</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span>Completed daily tasks</span>
                          <span className="text-green-600 dark:text-green-400">+15 coins</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} />}
    </div>
  )
}
