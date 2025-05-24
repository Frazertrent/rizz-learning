"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Save } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TimeBlockCard } from "@/components/parent/time-block-card"
import { GptHelperModal } from "@/components/parent/gpt-helper-modal"
import { useToast } from "@/hooks/use-toast"

export function PlatformPlanBuilder() {
  const [timeBlocks, setTimeBlocks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [students, setStudents] = useState<any[]>([])
  const [isGptModalOpen, setIsGptModalOpen] = useState(false)
  const [currentTimeBlock, setCurrentTimeBlock] = useState<any>(null)
  const [platformLinks, setPlatformLinks] = useState<Record<string, string>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const supabase = createClientComponentClient()

  // Fetch students
  useEffect(() => {
    async function fetchStudents() {
      try {
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) return

        const { data: studentsData, error } = await supabase
          .from("students")
          .select("*")
          .eq("parent_id", userData.user.id)

        if (error) throw error

        if (studentsData && studentsData.length > 0) {
          setStudents(studentsData)
          setSelectedStudent(studentsData[0].id)
        }
      } catch (error) {
        console.error("Error fetching students:", error)
        toast({
          title: "Error",
          description: "Failed to load students. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchStudents()
  }, [supabase, toast])

  // Fetch time blocks for selected student
  useEffect(() => {
    async function fetchTimeBlocks() {
      if (!selectedStudent) return

      setLoading(true)
      try {
        // First get the term plan for the student
        const { data: termPlanData, error: termPlanError } = await supabase
          .from("term_plans")
          .select("*")
          .eq("student_id", selectedStudent)
          .order("created_at", { ascending: false })
          .limit(1)

        if (termPlanError) throw termPlanError

        if (termPlanData && termPlanData.length > 0) {
          // Then get the time blocks for that term plan
          const { data: timeBlocksData, error: timeBlocksError } = await supabase
            .from("time_blocks")
            .select("*")
            .eq("term_plan_id", termPlanData[0].id)
            .order("start_time", { ascending: true })

          if (timeBlocksError) throw timeBlocksError

          setTimeBlocks(timeBlocksData || [])

          // Initialize empty platform links and notes for each time block
          const initialPlatformLinks: Record<string, string> = {}
          const initialNotes: Record<string, string> = {}

          timeBlocksData?.forEach((block) => {
            initialPlatformLinks[block.id] = ""
            initialNotes[block.id] = ""
          })

          setPlatformLinks(initialPlatformLinks)
          setNotes(initialNotes)
        }
      } catch (error) {
        console.error("Error fetching time blocks:", error)
        toast({
          title: "Error",
          description: "Failed to load time blocks. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTimeBlocks()
  }, [selectedStudent, supabase, toast])

  const handleStudentChange = (studentId: string) => {
    setSelectedStudent(studentId)
  }

  const handleResourceLinkChange = (blockId: string, value: string) => {
    setPlatformLinks((prev) => ({
      ...prev,
      [blockId]: value,
    }))
  }

  const handleNotesChange = (blockId: string, value: string) => {
    setNotes((prev) => ({
      ...prev,
      [blockId]: value,
    }))
  }

  const openGptHelper = (timeBlock: any) => {
    setCurrentTimeBlock(timeBlock)
    setIsGptModalOpen(true)
  }

  const handleGptSuggestion = (suggestion: string, blockId: string) => {
    setPlatformLinks((prev) => ({
      ...prev,
      [blockId]: suggestion,
    }))
    setIsGptModalOpen(false)
  }

  const savePlatformPlan = () => {
    toast({
      title: "Success!",
      description: "Your platform plan has been saved.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="text-2xl font-bold">
              🎯 You've built your Term Plan!
              <br />
              ➡️ Now let's connect each time block to a real platform or resource.
            </div>
            <p className="text-white/90">
              Great job building your Term Plan!
              <br />
              Now it's time to link each time block with the tool, program, or resource your student will use.
            </p>
            <div className="space-y-1">
              <p className="text-white/90">✅ Already know the platform? Paste the direct link.</p>
              <p className="text-white/90">💡 Not sure yet? Let GPT help you find the right one.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Selector */}
      {students.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {students.map((student) => (
            <Button
              key={student.id}
              variant={selectedStudent === student.id ? "default" : "outline"}
              onClick={() => handleStudentChange(student.id)}
              className="rounded-full px-6"
            >
              {student.first_name}
            </Button>
          ))}
        </div>
      )}

      {/* Time Blocks */}
      {loading ? (
        <div className="flex h-[200px] items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading time blocks...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {timeBlocks.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No time blocks found. Please create a term plan first.</p>
                <Button className="mt-4" asChild>
                  <Link href="/parent/term-plan-builder">Create Term Plan</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            timeBlocks.map((block) => (
              <TimeBlockCard
                key={block.id}
                timeBlock={block}
                resourceLink={platformLinks[block.id] || ""}
                notes={notes[block.id] || ""}
                onResourceLinkChange={(value) => handleResourceLinkChange(block.id, value)}
                onNotesChange={(value) => handleNotesChange(block.id, value)}
                onGptHelperClick={() => openGptHelper(block)}
              />
            ))
          )}
        </div>
      )}

      {/* Save Button */}
      {timeBlocks.length > 0 && (
        <div className="flex justify-center pt-6">
          <Button
            size="lg"
            onClick={savePlatformPlan}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <Save className="mr-2 h-5 w-5" />💾 Save Platform Plan
          </Button>
        </div>
      )}

      {/* GPT Helper Modal */}
      <GptHelperModal
        isOpen={isGptModalOpen}
        onClose={() => setIsGptModalOpen(false)}
        timeBlock={currentTimeBlock}
        onSuggestionSelect={(suggestion) => currentTimeBlock && handleGptSuggestion(suggestion, currentTimeBlock.id)}
      />
    </div>
  )
}
