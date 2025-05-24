"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddStudentDialog } from "./add-student-dialog"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export function AddStudentButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [parentId, setParentId] = useState<string | null>(null)

  // Get the parent ID when the button is clicked
  async function handleClick() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setParentId(user.id)
        setIsDialogOpen(true)
      } else {
        console.error("No user found")
        // Redirect to login if no user is found
        window.location.href = "/login"
      }
    } catch (error) {
      console.error("Error getting user:", error)
    }
  }

  return (
    <>
      <Button
        onClick={handleClick}
        className="w-full h-full flex flex-col items-center justify-center gap-4 py-8 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700"
      >
        <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
          <Plus className="h-8 w-8 text-blue-500" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Add Student</h3>
          <p className="text-gray-400">Add a new student to your homeschool</p>
        </div>
      </Button>

      {parentId && (
        <AddStudentDialog parentId={parentId} isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
      )}
    </>
  )
}
