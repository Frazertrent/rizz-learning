"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus, X, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface AddStudentModalProps {
  onStudentAdded?: () => void
}

export function AddStudentModal({ onStudentAdded }: AddStudentModalProps) {
  const [open, setOpen] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [gradeLevel, setGradeLevel] = useState("")
  const [age, setAge] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!open) {
      setFirstName("")
      setLastName("")
      setGradeLevel("")
      setAge("")
      setIsSubmitting(false)
      setIsSuccess(false)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!firstName || !lastName || !gradeLevel || !age) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("You must be logged in to add a student")

      const fullName = `${firstName} ${lastName}`

      const { error } = await supabase
        .from("student")
        .insert({
          first_name: firstName,
          last_name: lastName,
          full_name: fullName,
          grade_level: gradeLevel,
          age: parseInt(age),
          parent_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      setIsSuccess(true)

      toast({
        title: "Success!",
        description: "Student added successfully",
      })

      setTimeout(() => {
        setOpen(false)
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error("Error adding student:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add student",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="bg-gray-800/50 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-300 flex flex-col items-center justify-center p-8 h-full cursor-pointer">
          <div className="bg-blue-500/20 rounded-full p-4 mb-4">
            <Plus className="h-8 w-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-200 mb-2">Add Student</h3>
          <p className="text-gray-400 text-center">Add a new student to your homeschool</p>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700 text-gray-100 rounded-xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Add New Student</DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter your student's information below to add them to your dashboard.
          </DialogDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName" className="text-gray-300">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Tyson"
                className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lastName" className="text-gray-300">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Frazer"
                className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="gradeLevel" className="text-gray-300">
                Grade Level <span className="text-red-500">*</span>
              </Label>
              <Select value={gradeLevel} onValueChange={setGradeLevel} required>
                <SelectTrigger id="gradeLevel" className="bg-gray-800 border-gray-700 text-white focus:border-blue-500">
                  <SelectValue placeholder="Select grade level" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {[
                    "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", "6th Grade",
                    "7th Grade", "8th Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade"
                  ].map((grade) => (
                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="age" className="text-gray-300">
                Age <span className="text-red-500">*</span>
              </Label>
              <Input
                id="age"
                type="number"
                min={3}
                max={20}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 11"
                className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              disabled={isSubmitting || isSuccess}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className={`min-w-[120px] transition-all ${
                isSuccess ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={!firstName || !lastName || !gradeLevel || !age || isSubmitting || isSuccess}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : isSuccess ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Student Added!
                </>
              ) : (
                "Add Student"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
