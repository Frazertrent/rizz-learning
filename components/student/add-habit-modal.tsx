"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Clock, Link, Plus, X, Calendar, Sparkles, Coins } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import confetti from "canvas-confetti"

interface AddHabitModalProps {
  isOpen: boolean
  onClose: () => void
  onAddHabit: (habit: any) => void
}

export default function AddHabitModal({ isOpen, onClose, onAddHabit }: AddHabitModalProps) {
  const [habitName, setHabitName] = useState("")
  const [category, setCategory] = useState("")
  const [selectedEmoji, setSelectedEmoji] = useState("📝")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [enableReminder, setEnableReminder] = useState(false)
  const [reminderTime, setReminderTime] = useState("08:00")
  const [linkToGoal, setLinkToGoal] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState("")

  // Sample emojis for the picker
  const sampleEmojis = ["📝", "📚", "🏃‍♂️", "💧", "🧠", "🍎", "🧹", "🎵", "🙏", "✨", "💪", "🌱", "📖", "🧘‍♀️", "🎯"]

  // Sample goals for the dropdown
  const sampleGoals = [
    { id: "1", title: "Complete Science Chapter 5" },
    { id: "2", title: "Practice Piano for 30 Minutes Daily" },
    { id: "3", title: "Run 2 Miles" },
    { id: "4", title: "Daily Mindfulness Practice" },
  ]

  const handleSubmit = () => {
    if (!habitName.trim() || !category) return

    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    // Create new habit object
    const newHabit = {
      title: habitName,
      emoji: selectedEmoji,
      category,
      reminderTime: enableReminder ? reminderTime : null,
      linkedGoalId: linkToGoal && selectedGoal ? selectedGoal : null,
      xpReward: 5, // Default XP reward
    }

    onAddHabit(newHabit)
    resetForm()
  }

  const resetForm = () => {
    setHabitName("")
    setCategory("")
    setSelectedEmoji("📝")
    setShowEmojiPicker(false)
    setEnableReminder(false)
    setReminderTime("08:00")
    setLinkToGoal(false)
    setSelectedGoal("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-gray-950 border border-gray-800 shadow-xl rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none" />

        <DialogHeader className="pb-2">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Add a New Daily Habit
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Emoji Picker */}
          <div className="space-y-2">
            <Label htmlFor="emoji" className="text-gray-300">
              Choose an Emoji
            </Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="h-12 w-12 text-2xl bg-gray-900 border-gray-700 hover:bg-gray-800 hover:text-white"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                {selectedEmoji}
              </Button>
              <span className="text-gray-400 text-sm">← Click to change</span>
            </div>

            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 border border-gray-700 rounded-lg p-3 mt-2"
              >
                <div className="flex flex-wrap gap-2">
                  {sampleEmojis.map((emoji) => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      className="h-10 w-10 text-xl hover:bg-gray-800"
                      onClick={() => {
                        setSelectedEmoji(emoji)
                        setShowEmojiPicker(false)
                      }}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Habit Name */}
          <div className="space-y-2">
            <Label htmlFor="habitName" className="text-gray-300">
              Habit Name
            </Label>
            <Input
              id="habitName"
              placeholder="Read 10 mins"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-300">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="bg-gray-900 border-gray-700 text-white focus:ring-purple-500">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700 text-white">
                <SelectItem value="academic" className="focus:bg-gray-800 focus:text-white">
                  <div className="flex items-center">
                    <span className="mr-2">🔵</span> Academic
                  </div>
                </SelectItem>
                <SelectItem value="personal" className="focus:bg-gray-800 focus:text-white">
                  <div className="flex items-center">
                    <span className="mr-2">🌱</span> Personal
                  </div>
                </SelectItem>
                <SelectItem value="fitness" className="focus:bg-gray-800 focus:text-white">
                  <div className="flex items-center">
                    <span className="mr-2">💪</span> Fitness
                  </div>
                </SelectItem>
                <SelectItem value="mindset" className="focus:bg-gray-800 focus:text-white">
                  <div className="flex items-center">
                    <span className="mr-2">🧠</span> Mindset
                  </div>
                </SelectItem>
                <SelectItem value="spiritual" className="focus:bg-gray-800 focus:text-white">
                  <div className="flex items-center">
                    <span className="mr-2">✨</span> Spiritual
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reminder Time */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="enableReminder" className="text-gray-300 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                Remind me at...
              </Label>
              <Switch id="enableReminder" checked={enableReminder} onCheckedChange={setEnableReminder} />
            </div>

            {enableReminder && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white focus:ring-purple-500 focus:border-purple-500 mt-2"
                />
              </motion.div>
            )}
          </div>

          {/* Link to Goal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="linkToGoal" className="text-gray-300 flex items-center">
                <Link className="h-4 w-4 mr-2 text-gray-400" />
                Link to a goal
              </Label>
              <Switch id="linkToGoal" checked={linkToGoal} onCheckedChange={setLinkToGoal} />
            </div>

            {linkToGoal && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Select value={selectedGoal} onValueChange={setSelectedGoal}>
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white focus:ring-purple-500 mt-2">
                    <SelectValue placeholder="Select a goal" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 text-white">
                    {sampleGoals.map((goal) => (
                      <SelectItem key={goal.id} value={goal.id} className="focus:bg-gray-800 focus:text-white">
                        {goal.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            )}
          </div>

          {/* Repeat Pattern (non-editable) */}
          <div className="space-y-2">
            <Label className="text-gray-300 flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              Repeat Pattern
            </Label>
            <div className="bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-gray-400">
              Daily (every day)
            </div>
          </div>

          {/* Rewards Preview */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
            <p className="text-gray-300 text-sm mb-2">Completing this habit will earn you:</p>
            <div className="flex gap-2">
              <Badge className="bg-purple-900/50 text-purple-300 border-purple-700 flex items-center">
                <Sparkles className="h-3 w-3 mr-1" /> +5 XP
              </Badge>
              <Badge className="bg-amber-900/50 text-amber-300 border-amber-700 flex items-center">
                <Coins className="h-3 w-3 mr-1" /> +1 Coin
              </Badge>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              resetForm()
              onClose()
            }}
            className="text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!habitName.trim() || !category}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
          >
            <Plus className="h-4 w-4 mr-1" /> Save Habit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
