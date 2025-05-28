"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { Target, Users, AlertCircle, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-provider"
import { AddStudentModal } from "@/components/parent/add-student-modal"
import { toast } from "@/hooks/use-toast"

export default function ParentDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [termPlans, setTermPlans] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Get the current user
        let userId = user?.id

        if (!userId) {
          // Try to get from localStorage as fallback
          const storedUser = localStorage.getItem("user")
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser)
              if (parsedUser && parsedUser.id) {
                userId = parsedUser.id
              }
            } catch (e) {
              console.error("Error parsing stored user:", e)
            }
          } else {
            // Check for demo user ID
            const demoUserId = localStorage.getItem("demoUserId")
            if (demoUserId) {
              userId = demoUserId
              console.log("Using demo user ID:", demoUserId)
            }
          }
        }

        if (!userId) {
          setError("No user ID found. Please log in.")
          setLoading(false)
          return
        }

        // Create Supabase client
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

        // Fetch students for the user
        const { data: studentData, error: studentError } = await supabase
          .from("student")
          .select("*")
          .eq("parent_id", userId)

        if (studentError) {
          console.error("Error fetching students:", studentError)
          setError(studentError.message)
          setLoading(false)
          return
        }

        setStudents(studentData || [])

        // Fetch term plans for the user
        const { data, error: fetchError } = await supabase
          .from("term_plans")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        if (fetchError) {
          console.error("Error fetching term plans:", fetchError)
          setError(fetchError.message)
          setLoading(false)
          return
        }

        // Fetch student term plans for each term plan
        if (data && data.length > 0) {
          const termPlansWithStudents = await Promise.all(
            data.map(async (termPlan) => {
              const { data: studentTermPlans, error: studentError } = await supabase
                .from("student_term_plans")
                .select("*")
                .eq("term_plan_id", termPlan.id)

              if (studentError) {
                console.error("Error fetching student term plans:", studentError)
                return { ...termPlan, studentTermPlans: [] }
              }

              return { ...termPlan, studentTermPlans: studentTermPlans || [] }
            }),
          )

          setTermPlans(termPlansWithStudents)
        } else {
          setTermPlans([])
        }
      } catch (error) {
        console.error("Error in fetchTermPlans:", error)
        setError((error as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  // Function to format the term name
  const formatTermName = (termPlan: any) => {
    if (termPlan.academic_term) {
      return `${termPlan.academic_term} ${termPlan.term_year || ""}`
    }

    // Try to get from data if available
    if (termPlan.data && termPlan.data.academicTerm) {
      return `${termPlan.data.academicTerm} ${termPlan.data.termYear || ""}`
    }

    return "Unnamed Term"
  }

  // Function to get student count
  const getStudentCount = (termPlan: any) => {
    if (termPlan.studentTermPlans) {
      return termPlan.studentTermPlans.length
    }

    // Try to get from data if available
    if (termPlan.data && termPlan.data.students) {
      return Object.keys(termPlan.data.students).length
    }

    return 0
  }

  // Function to get goals
  const getGoals = (termPlan: any) => {
    if (termPlan.goals && Array.isArray(termPlan.goals)) {
      return termPlan.goals
    }

    // Try to get from data if available
    if (termPlan.data && termPlan.data.goals && Array.isArray(termPlan.data.goals)) {
      return termPlan.data.goals
    }

    return []
  }

  // Function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return ""

    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Function to handle viewing term plan details
  const handleViewTermPlan = (termPlan: any) => {
    try {
      console.log("Opening term plan:", termPlan)

      // Ensure we have a valid term plan object
      if (!termPlan || !termPlan.id) {
        toast({
          title: "Error",
          description: "Invalid term plan data. Please try again.",
          variant: "destructive",
        })
        return
      }

      // Process the term plan data to ensure it has the expected structure
      const processedTermPlan = {
        id: termPlan.id,
        academicTerm: termPlan.academic_term || "",
        termType: termPlan.term_type || "",
        termYear: termPlan.term_year || new Date().getFullYear(),
        goals: termPlan.goals || [],
        students: {},
      }

      // If data is a string, try to parse it
      if (termPlan.data) {
        try {
          const parsedData = typeof termPlan.data === "string" ? JSON.parse(termPlan.data) : termPlan.data

          // Merge the parsed data with our processed term plan
          if (parsedData && typeof parsedData === "object") {
            // Copy over specific fields we care about
            if (parsedData.academicTerm) processedTermPlan.academicTerm = parsedData.academicTerm
            if (parsedData.termType) processedTermPlan.termType = parsedData.termType
            if (parsedData.termYear) processedTermPlan.termYear = parsedData.termYear
            if (Array.isArray(parsedData.goals)) processedTermPlan.goals = parsedData.goals

            // Handle students data
            if (parsedData.students && typeof parsedData.students === "object") {
              processedTermPlan.students = parsedData.students
            }
          }
        } catch (e) {
          console.error("Error parsing term plan data:", e)
        }
      }

      // Store the processed term plan in localStorage
      localStorage.setItem(`termPlan_${termPlan.id}`, JSON.stringify(processedTermPlan))
      console.log("Term plan saved to localStorage:", processedTermPlan)

      // Navigate to the term plan overview page
      router.push(`/parent/term-plan-overview?id=${termPlan.id}`)
    } catch (error) {
      console.error("Error navigating to term plan:", error)
      toast({
        title: "Error",
        description: "Failed to open term plan. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Function to handle editing term plan
  const handleEditTermPlan = (termPlan: any) => {
    try {
      // Process the term plan data the same way as in handleViewTermPlan
      const processedTermPlan = {
        id: termPlan.id,
        academicTerm: termPlan.academic_term || "",
        termType: termPlan.term_type || "",
        termYear: termPlan.term_year || new Date().getFullYear(),
        goals: termPlan.goals || [],
        students: {},
      }

      // If data is a string, try to parse it
      if (termPlan.data) {
        try {
          const parsedData = typeof termPlan.data === "string" ? JSON.parse(termPlan.data) : termPlan.data

          // Merge the parsed data with our processed term plan
          if (parsedData && typeof parsedData === "object") {
            if (parsedData.academicTerm) processedTermPlan.academicTerm = parsedData.academicTerm
            if (parsedData.termType) processedTermPlan.termType = parsedData.termType
            if (Array.isArray(parsedData.goals)) processedTermPlan.goals = parsedData.goals

            if (parsedData.students && typeof parsedData.students === "object") {
              processedTermPlan.students = parsedData.students
            }
          }
        } catch (e) {
          console.error("Error parsing term plan data:", e)
        }
      }

      // Store the processed term plan in localStorage
      localStorage.setItem(`termPlan_${termPlan.id}`, JSON.stringify(processedTermPlan))
      console.log("Term plan saved to localStorage for editing:", processedTermPlan)

      // Navigate to the term plan overview page with edit mode
      router.push(`/parent/term-plan-overview?id=${termPlan.id}&edit=true`)
    } catch (error) {
      console.error("Error navigating to edit term plan:", error)
      toast({
        title: "Error",
        description: "Failed to open term plan editor. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <h1 className="text-3xl font-bold mb-6">Loading Dashboard...</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 bg-gray-700" />
                <Skeleton className="h-4 w-1/2 bg-gray-700" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full bg-gray-700" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full bg-gray-700" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="bg-red-900/30 border-red-700 text-red-100">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-6">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/parent/term-plan-builder">Create New Term Plan</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Parent Dashboard</h1>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/parent/term-plan-builder">Create New Term Plan</Link>
        </Button>
      </div>

      {/* Term Plans Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-6 w-6 text-blue-400" />
          <h2 className="text-2xl font-semibold">Term Plans</h2>
        </div>
        <Card className="bg-gray-800 border-gray-700 p-4 w-48">
          <CardTitle className="text-center">Hello Parent</CardTitle>
        </Card>
      </div>

      <div className="space-y-6">
        {/* Term Plans Cards */}
        {termPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {termPlans.map((termPlan) => (
              <Card key={termPlan.id} className="bg-gray-800 border-gray-700 hover:border-blue-600 transition-all">
                <CardHeader className="bg-gradient-to-r from-blue-900/50 to-purple-900/30 rounded-t-lg">
                  <CardTitle className="text-xl">{formatTermName(termPlan)}</CardTitle>
                  <CardDescription>
                    Created: {formatDate(termPlan.created_at)}
                    {termPlan.updated_at !== termPlan.created_at && ` • Updated: ${formatDate(termPlan.updated_at)}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-400" />
                      <span>{getStudentCount(termPlan)} student(s)</span>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-400" />
                        Term Goals
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {getGoals(termPlan)
                          .slice(0, 3)
                          .map((goal: string, index: number) => (
                            <Badge key={index} className="bg-blue-900/30 text-blue-100 border border-blue-700">
                              {goal}
                            </Badge>
                          ))}
                        {getGoals(termPlan).length > 3 && (
                          <Badge className="bg-blue-900/30 text-blue-100 border border-blue-700">
                            +{getGoals(termPlan).length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => handleViewTermPlan(termPlan)}>
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-blue-600 text-blue-400 hover:bg-blue-900/20"
                    onClick={() => handleEditTermPlan(termPlan)}
                  >
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No term plans yet. Create your first term plan to get started.
            </p>
            <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700">
              <Link href="/parent/term-plan-builder">Create Term Plan</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Your Students Section */}
      <div className="flex items-center gap-2 mt-8 mb-4">
        <Users className="h-6 w-6 text-blue-400" />
        <h2 className="text-2xl font-semibold">Your Students</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <Card key={student.id} className="bg-gray-800 border-gray-700 hover:border-blue-600 transition-all">
            <CardHeader>
              <CardTitle className="text-xl">{student.full_name}</CardTitle>
              <CardDescription>{student.grade_level}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">On Track</span>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Subjects</h3>
                  <div className="flex flex-wrap gap-1">
                    {student.assigned_tools && student.assigned_tools.length > 0 ? (
                      student.assigned_tools.map((tool: string, index: number) => (
                        <Badge key={index} className="bg-blue-900/30 text-blue-100 border border-blue-700">
                          {tool}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">No subjects assigned</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Link href={`/parent/students/${student.id}`}>View Student</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}

        {/* Add Student Card */}
        <AddStudentModal />
      </div>
    </div>
  )
}
