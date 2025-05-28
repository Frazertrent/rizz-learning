"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { CheckCircle, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface SavePreferencesButtonProps {
  preferences: any
  onSuccess?: () => void
  closePopover?: () => void
}

export function SavePreferencesButton({ preferences, onSuccess, closePopover }: SavePreferencesButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const savePreferences = async () => {
    setIsLoading(true)
    setIsSuccess(false)

    try {
      // Get the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error("User not authenticated")
      }

      const parentId = user.id

      // Get the latest intake form for this parent
      const { data: intakeData, error: intakeError } = await supabase
        .from("parent_intake_form")
        .select("id")
        .eq("parent_id", parentId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (intakeError && intakeError.code !== "PGRST116") {
        throw intakeError
      }

      if (!intakeData) {
        throw new Error("No intake form found for this user")
      }

      // Update the preferences in the intake form
      const { error: updateError } = await supabase
        .from("parent_intake_form")
        .update({
          // Map the preferences object to the database columns
          target_gpa: preferences.targetGpa,
          outcome_level: preferences.outcomeLevel,
          structure_preference: preferences.structurePreference,
          school_days: Array(preferences.daysPerWeek).fill(true), // Simplified representation
          start_time: preferences.startTime,
          end_time: preferences.endTime,
          block_length: preferences.blockLength,
          term_structure: preferences.termStructure,
          mentor_personality: [preferences.mentorTone],
          // Add any other preferences that need to be updated
          updated_at: new Date().toISOString(),
        })
        .eq("id", intakeData.id)

      if (updateError) {
        throw updateError
      }

      // Show success state
      setIsSuccess(true)
      toast({
        title: "Preferences saved",
        description: "Your platform recommendations have been updated.",
        variant: "default",
      })

      // Call the success callback if provided
      if (onSuccess) {
        onSuccess()
      }

      // Close the popover after a delay if the function is provided
      if (closePopover) {
        setTimeout(() => {
          closePopover()
          setIsSuccess(false)
        }, 1500)
      }
    } catch (error) {
      console.error("Error saving preferences:", error)
      toast({
        title: "Error saving preferences",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <Button
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
        onClick={savePreferences}
        disabled={isLoading || isSuccess}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Saved Successfully!
          </>
        ) : (
          "Save Preferences"
        )}
      </Button>
    </div>
  )
}
