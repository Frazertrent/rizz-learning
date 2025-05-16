"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { Target, Users, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-provider"

export default function ParentDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [termPlans, setTermPlans] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    async function fetchTermPlans() {
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

    fetchTermPlans()
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

      {termPlans.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700 p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">No Term Plans Found</h2>
          <p className="text-gray-400 mb-6">You haven't created any term plans yet.</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/parent/term-plan-builder">Create Your First Term Plan</Link>
          </Button>
        </Card>
      ) : (
        <>
          <h2 className="text-2xl font-semibold">Your Term Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Link href={`/parent/term-plan-overview?id=${termPlan.id}`}>View Details</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-blue-600 text-blue-400 hover:bg-blue-900/20"
                    onClick={() => {
                      // Store the term plan in session storage and navigate to edit page
                      sessionStorage.setItem("termPlan", JSON.stringify(termPlan.data || termPlan))
                      router.push("/parent/term-plan-builder")
                    }}
                  >
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
