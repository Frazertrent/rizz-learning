"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Sparkles, Coins } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

export default function AddGoalModal({ isOpen, onClose, onAddGoal }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "academic",
    description: "",
    dueDate: null,
    xpReward: 15,
    coinReward: 5,
    steps: [""],
  })

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddStep = () => {
    setFormData((prev) => ({
      ...prev,
      steps: [...prev.steps, ""],
    }))
  }

  const handleStepChange = (index, value) => {
    const newSteps = [...formData.steps]
    newSteps[index] = value
    setFormData((prev) => ({ ...prev, steps: newSteps }))
  }

  const handleRemoveStep = (index) => {
    const newSteps = formData.steps.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, steps: newSteps }))
  }

  const handleSubmit = () => {
    // Filter out empty steps
    const filteredSteps = formData.steps
      .filter((step) => step.trim() !== "")
      .map((text, index) => ({
        id: `new-${index}`,
        text,
        completed: false,
      }))

    // Create the new goal object
    const newGoal = {
      title: formData.title,
      category: formData.category,
      description: formData.description,
      dueDate: formData.dueDate ? format(formData.dueDate, "MMM dd, yyyy") : null,
      xpReward: Number.parseInt(formData.xpReward),
      coinReward: Number.parseInt(formData.coinReward),
      steps: filteredSteps.length > 0 ? filteredSteps : undefined,
    }

    onAddGoal(newGoal)

    // Reset form
    setFormData({
      title: "",
      category: "academic",
      description: "",
      dueDate: null,
      xpReward: 15,
      coinReward: 5,
      steps: [""],
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-900 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            ✨ Add New Goal
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Goal Title */}
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">
              Goal Title
            </Label>
            <Input
              id="title"
              placeholder="What do you want to achieve?"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="border-gray-300 dark:border-gray-700"
            />
          </div>

          {/* Goal Category */}
          <div className="grid gap-2">
            <Label htmlFor="category" className="text-gray-700 dark:text-gray-300">
              Category
            </Label>
            <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
              <SelectTrigger id="category" className="border-gray-300 dark:border-gray-700">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="academic">📚 Academic</SelectItem>
                <SelectItem value="personal">🌱 Personal</SelectItem>
                <SelectItem value="fitness">💪 Fitness</SelectItem>
                <SelectItem value="mindset">🧠 Mindset</SelectItem>
                <SelectItem value="spiritual">✨ Spiritual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Add more details about your goal..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="border-gray-300 dark:border-gray-700 resize-none"
              rows={2}
            />
          </div>

          {/* Due Date */}
          <div className="grid gap-2">
            <Label className="text-gray-700 dark:text-gray-300">Due Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="border-gray-300 dark:border-gray-700 text-left font-normal justify-start"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate ? (
                    format(formData.dueDate, "PPP")
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.dueDate}
                  onSelect={(date) => handleChange("dueDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Rewards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="xpReward" className="text-gray-700 dark:text-gray-300">
                XP Reward
              </Label>
              <div className="flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                <Input
                  id="xpReward"
                  type="number"
                  min="0"
                  value={formData.xpReward}
                  onChange={(e) => handleChange("xpReward", e.target.value)}
                  className="border-gray-300 dark:border-gray-700"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="coinReward" className="text-gray-700 dark:text-gray-300">
                Coin Reward
              </Label>
              <div className="flex items-center">
                <Coins className="h-4 w-4 mr-2 text-amber-500" />
                <Input
                  id="coinReward"
                  type="number"
                  min="0"
                  value={formData.coinReward}
                  onChange={(e) => handleChange("coinReward", e.target.value)}
                  className="border-gray-300 dark:border-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="grid gap-2">
            <Label className="text-gray-700 dark:text-gray-300">Steps (Optional)</Label>
            {formData.steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder={`Step ${index + 1}`}
                  value={step}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                  className="border-gray-300 dark:border-gray-700"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveStep(index)}
                  className="text-gray-500 hover:text-red-500"
                  disabled={formData.steps.length === 1}
                >
                  ✕
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddStep}
              className="mt-2 border-dashed border-gray-300 dark:border-gray-700"
            >
              + Add Step
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            disabled={!formData.title.trim()}
          >
            Create Goal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
